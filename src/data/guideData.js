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
];
