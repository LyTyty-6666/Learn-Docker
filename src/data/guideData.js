export const GUIDE_CHAPTERS = [
  {
    id: 'ch-port-mapping',
    title: '1. Port Mapping Explained (-p Host:Container)',
    badge: 'Fundamental',
    summary: 'Why containers are isolated by default, and how NAT port forwarding routes web traffic from your browser to your server.',
    content: [
      {
        heading: 'The Port Forwarding Formula',
        text: 'A container runs inside its own isolated network namespace with private IP addresses (e.g. 172.17.0.2). Your host laptop cannot directly reach container ports unless you publish them.',
        codeSnippet: 'docker run -p <HOST_PORT>:<CONTAINER_PORT> <IMAGE>',
        callout: 'Rule of Thumb: The LEFT port is what YOU type in your browser (localhost:HOST_PORT). The RIGHT port is what your SERVER is listening on inside the container.',
      },
      {
        heading: 'Visualizing Traffic Flow',
        text: `Browser (localhost:8080)
   │
   ▼
[Host Machine - Port 8080]
   │ (iptables / NAT forwarding via Docker Proxy)
   ▼
[Docker Virtual Bridge - docker0]
   │
   ▼
[Container: "web-server" - Port 80 (Nginx listening)]`,
      },
      {
        heading: 'Multiple Containers on Different Host Ports',
        text: 'Two containers can BOTH listen on port 80 internally, as long as they bind to DIFFERENT host ports on your machine:',
        codeSnippet: `docker run -d -p 8081:80 --name site-a nginx:alpine
docker run -d -p 8082:80 --name site-b nginx:alpine

# Now accessible at:
# http://localhost:8081 -> site-a
# http://localhost:8082 -> site-b`,
      },
    ],
  },
  {
    id: 'ch-server-binding',
    title: '2. The 0.0.0.0 vs 127.0.0.1 Server Binding Rule',
    badge: 'Critical Gotcha',
    summary: 'The #1 reason why developers get "Connection Refused" when dockerizing their Node, Python, or Go servers.',
    content: [
      {
        heading: 'Loopback (127.0.0.1) is Container-Local',
        text: 'When a web framework defaults to "localhost" or "127.0.0.1", it binds solely to the loopback network interface (lo) inside that specific container. Because Docker port forwarding routes incoming packets to the container\'s eth0 interface, packets are dropped immediately!',
        codeSnippet: `// ❌ WRONG (Inside Dockerfile or Server Code):
app.listen(3000, 'localhost'); // only accepts calls originating from inside container!

// ✅ CORRECT:
app.listen(3000, '0.0.0.0'); // binds to ALL interfaces, accepting forwarded traffic!`,
      },
      {
        heading: 'Framework Defaults Checklist',
        text: `• Express.js: app.listen(3000) binds to 0.0.0.0 by default ✅
• Vite / Next.js / Astro dev servers: often bind to 127.0.0.1 by default! Use --host 0.0.0.0 ⚠️
• Flask: app.run(host="0.0.0.0", port=5000) ⚠️
• FastAPI / Uvicorn: uvicorn main:app --host 0.0.0.0 --port 8000 ⚠️
• Django: python manage.py runserver 0.0.0.0:8000 ⚠️`,
      },
    ],
  },
  {
    id: 'ch-container-networking',
    title: '3. Container-to-Container Networking & DNS',
    badge: 'Networking',
    summary: 'How containers discover and communicate with each other using Docker embedded DNS without hardcoding IP addresses.',
    content: [
      {
        heading: 'Default Bridge vs Custom User Networks',
        text: 'Docker creates a default network called `bridge`. However, containers on the default bridge can only talk to each other via IP addresses, not container names! To enable automatic service discovery by name, ALWAYS create a custom user network.',
        codeSnippet: `# 1. Create a network
docker network create my-network

# 2. Start the database on the network
docker run -d --name my-db --network my-network postgres:15-alpine

# 3. Start the API on the same network
docker run -d -p 3000:3000 --name my-api --network my-network node:18-alpine`,
      },
      {
        heading: 'Automatic DNS Resolution in Action',
        text: 'In your backend code, your database connection string becomes simply:\n`postgres://postgres:password@my-db:5432/appdb`\n\nDocker\'s embedded DNS server (127.0.0.11) automatically resolves the hostname "my-db" to the container\'s internal IP!',
      },
    ],
  },
  {
    id: 'ch-container-to-host',
    title: '4. Connecting Container to Host Services',
    badge: 'Advanced',
    summary: 'How to connect your container to a database or service running directly on your host machine.',
    content: [
      {
        heading: 'The host.docker.internal Special DNS Name',
        text: 'When your backend container needs to connect to a MySQL or Postgres database installed directly on your Mac or Windows host machine, you cannot use "localhost". Instead, use the magic hostname:',
        codeSnippet: `# In your container config or environment:
DATABASE_URL=postgres://user:pass@host.docker.internal:5432/db`,
        callout: 'On Linux, you can pass `--add-host=host.docker.internal:host-gateway` to docker run to enable this behavior.',
      },
    ],
  },
  {
    id: 'ch-docker-compose',
    title: '5. Multi-Service Orchestration with Docker Compose',
    badge: 'Production',
    summary: 'Declarative definition of multi-container server environments with networks, volumes, and environment variables.',
    content: [
      {
        heading: 'The docker-compose.yml Anatomy',
        text: 'Docker Compose automatically creates a shared network for all defined services and maps internal hostnames matching service keys.',
        codeSnippet: `version: '3.8'

services:
  web:
    image: nginx:alpine
    ports:
      - "80:80"
    depends_on:
      - api

  api:
    image: node:18-alpine
    environment:
      - DB_HOST=db
      - REDIS_HOST=cache
    ports:
      - "3000:3000"

  db:
    image: postgres:15-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:`,
      },
    ],
  },
  {
    id: 'ch-how-to-learn',
    title: '6. The Master Roadmap: How to Learn Docker',
    badge: 'Study Guide',
    summary: 'A structured 6-phase journey from zero command-line knowledge to production multi-container orchestration.',
    content: [
      {
        heading: 'Phase 1: Understand Containers vs VMs & The Mental Model',
        text: 'Do not memorize commands yet! First grasp WHY containers exist. A container is NOT a mini-VM with a guest kernel; it is a sandboxed process sharing the Linux kernel via cgroups (resource limits) and namespaces (isolated network, process IDs, and mounts).',
        callout: 'Remember: Docker Image = Recipe/Class (Immutable Blueprint). Docker Container = Running Instance (Living Object with ephemeral state).',
      },
      {
        heading: 'Phase 2: Master Core Container CLI Commands',
        text: 'Practice the lifecycle: pulling images, launching detached containers with port publishing, inspecting logs, opening an interactive shell with exec, and cleaning up stopped containers.',
        codeSnippet: `# The Core 5 Commands to practice daily:
docker run -d -p 8080:80 --name my-web nginx:alpine
docker ps -a
docker logs -f my-web
docker exec -it my-web sh
docker stop my-web && docker rm my-web`,
      },
      {
        heading: 'Phase 3: Write Efficient Dockerfiles & Layer Caching',
        text: 'Learn how layer caching works. Always copy dependency locks (package.json, requirements.txt) and install packages BEFORE copying source code. Use Alpine or Slim base images to keep footprint small.',
        codeSnippet: `# Optimal Dockerfile pattern:
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
USER node
EXPOSE 3000
CMD ["node", "server.js"]`,
      },
      {
        heading: 'Phase 4: Master Docker Networking and Persistent Storage',
        text: 'Master custom bridge networks so containers can speak via DNS hostnames (e.g. database:5432). Create named volumes to prevent data loss whenever database containers restart.',
        codeSnippet: `docker network create app-net
docker volume create db-data
docker run -d --name db --network app-net -v db-data:/var/lib/postgresql/data postgres:15-alpine`,
      },
      {
        heading: 'Phase 5: Multi-Container Docker Compose',
        text: 'Replace long "docker run" CLI commands with clean, declarative YAML files in docker-compose.yml to launch your frontend, API, database, and cache with a single "docker compose up -d".',
      },
      {
        heading: 'Phase 6: Production Security & CI/CD Pipelines',
        text: 'Audit for security: never run as root (USER nonroot), pin image versions (avoid :latest in production), use .dockerignore, and automate container builds and vulnerability scans in GitHub Actions.',
      },
    ],
  },
  {
    id: 'ch-practice-projects',
    title: '7. Real-World Docker Practice Projects',
    badge: 'Projects',
    summary: 'Solidify your learning with 4 progressive hands-on projects designed to build muscle memory.',
    content: [
      {
        heading: 'Project 1: Static Web Server with Custom Nginx Config',
        text: 'Create a simple HTML/CSS portfolio website and package it with Nginx Alpine. Mount your custom nginx.conf with custom gzip and cache headers.',
        codeSnippet: `docker build -t my-website .
docker run -d -p 8080:80 --name web my-website`,
      },
      {
        heading: 'Project 2: Node.js Express REST API + Redis Cache',
        text: 'Build a Node/Express API with an endpoint that checks Redis for cached query data before hitting a mock database. Connect both containers using a custom user network.',
        codeSnippet: `docker network create my-net
docker run -d --name redis-cache --network my-net redis:alpine
docker run -d -p 3000:3000 --name api --network my-net -e REDIS_HOST=redis-cache my-api`,
      },
      {
        heading: 'Project 3: Full-Stack Compose Stack (PERN/MERN)',
        text: 'Connect a React Vite frontend, Node.js API, PostgreSQL database with named volume persistence, and an Nginx reverse proxy using docker-compose.yml.',
        codeSnippet: `docker compose up -d
docker compose ps
docker compose logs -f`,
      },
      {
        heading: 'Project 4: Automated CI/CD Pipeline with GitHub Actions',
        text: 'Set up a GitHub Actions workflow that automatically runs tests, builds your multi-stage Docker image, tags it with the Git commit SHA, and pushes to Docker Hub or GitHub Container Registry (ghcr.io).',
      },
    ],
  },
  {
    id: 'ch-writing-code-with-docker',
    title: '8. How to Write Code with Docker (Dev to Production)',
    badge: 'Code & Build',
    summary: 'A complete developer blueprint: structure projects, write optimal Dockerfiles, configure .dockerignore, and use bind mounts for live hot-reload coding.',
    content: [
      {
        heading: 'Step 1: The Ideal Project Directory Structure',
        text: 'Keep your source code, configuration, and Docker metadata clean and organized together in the repository root:',
        codeSnippet: `my-awesome-app/
├── src/
│   ├── index.js          # Your server application code
│   └── routes.js
├── package.json          # Dependency manifest
├── package-lock.json     # Strict version lockfile
├── .dockerignore         # Excludes host junk from image
├── Dockerfile            # Blueprint for your container
└── docker-compose.yml    # Development stack orchestration`,
      },
      {
        heading: 'Step 2: The Anatomy of Writing a Dockerfile',
        text: 'Every line creates an immutable layer. Exploit Docker caching by copying package.json FIRST, running install, and THEN copying source files. This ensures code changes do not trigger a 5-minute npm install on every build!',
        codeSnippet: `# 1. Use an official lightweight base image
FROM node:18-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy dependency definitions first (Layer Cache optimization!)
COPY package*.json ./

# 4. Install production dependencies cleanly
RUN npm ci --only=production

# 5. Copy the rest of the application code
COPY . .

# 6. Switch to a non-privileged user for security (no root!)
USER node

# 7. Document the port your code listens on
EXPOSE 3000

# 8. Start the application
CMD ["node", "src/index.js"]`,
        callout: 'Golden Rule: If your code changes, Docker re-runs every step AFTER the modified line. Putting "COPY package*.json" before "COPY . ." saves 90% of your build time!',
      },
      {
        heading: 'Step 3: Crucial .dockerignore File',
        text: 'Never copy your laptop\'s local node_modules or .git directory into your Docker image! Different operating systems (e.g. Mac/Windows C-bindings) will corrupt the Linux container.',
        codeSnippet: `# .dockerignore
node_modules
npm-debug.log
.git
.gitignore
.env
.env.local
dist
coverage`,
      },
      {
        heading: 'Step 4: Live Code Reloading with Bind Mounts (-v)',
        text: 'During development, you don\'t want to rebuild your Docker image every time you save a file! Use a Volume Bind Mount to mirror your host project folder into /app inside the container in real time.',
        codeSnippet: `# Run container with live code sync:
docker run -d \\
  -p 3000:3000 \\
  -v $(pwd):/app \\
  -v /app/node_modules \\
  --name my-api-dev \\
  node:18-alpine \\
  npx nodemon src/index.js

# Note: "-v /app/node_modules" is an anonymous volume that prevents
# your host folder from wiping out the container's installed Linux binaries!`,
      },
      {
        heading: 'Step 5: Multi-Stage Build for Tiny Production Images',
        text: 'For compiled languages or frontend frameworks (React, Vite, Go, TypeScript), build the code in Stage 1, then copy ONLY the compiled bundle into a fresh 10MB Alpine/Nginx container in Stage 2.',
        codeSnippet: `# ---- Stage 1: Build ----
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---- Stage 2: Production Server ----
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`,
      },
    ],
  },
];
