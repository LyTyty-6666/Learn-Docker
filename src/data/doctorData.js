export const DIAGNOSTIC_ISSUES = [
  {
    id: 'err-connection-refused',
    title: 'Connection Refused (ERR_CONNECTION_REFUSED on localhost:3000)',
    category: 'Networking & Port Binding',
    severity: 'High',
    symptom: 'You started your Node.js or Python web server inside a Docker container, but visiting http://localhost:3000 in your browser gives "ERR_CONNECTION_REFUSED" or curl returns exit code 7.',
    rootCauses: [
      {
        reason: 'Host:Container Port Mapping was omitted',
        details: 'You ran `docker run` without the `-p <host_port>:<container_port>` flag. Even though the server is running inside the container, Docker does not publish the port to your host machine.',
        solution: 'Always pass `-p <host_port>:<container_port>` when launching.',
        commandFix: 'docker run -d -p 3000:3000 --name my-app node:18-alpine',
      },
      {
        reason: 'Server is bound to 127.0.0.1 (Loopback) inside container',
        details: 'Inside Docker, `127.0.0.1` refers to the container\'s isolated loopback interface, NOT your host machine. External requests from the Docker bridge interface cannot reach loopback. Servers MUST listen on `0.0.0.0` (all IPv4 interfaces).',
        solution: 'Change your code to listen on 0.0.0.0 instead of localhost.',
        codeComparison: {
          bad: `// Node.js Express (BAD - unreachable from host)
app.listen(3000, '127.0.0.1', () => ...);

# Python FastAPI/Uvicorn (BAD)
uvicorn.run(app, host="127.0.0.1", port=8000)`,
          good: `// Node.js Express (GOOD - reachable via port mapping)
app.listen(3000, '0.0.0.0', () => ...);

# Python FastAPI/Uvicorn (GOOD)
uvicorn.run(app, host="0.0.0.0", port=8000)`,
        },
      },
    ],
    tips: [
      'Remember: In -p 8080:80, the LEFT side (8080) is on your Laptop/Host, the RIGHT side (80) is inside the Container.',
      'Test port responsiveness with `docker port <container_name>`.',
    ],
  },
  {
    id: 'err-port-allocated',
    title: 'Port Already Allocated (Bind for 0.0.0.0:80 failed)',
    category: 'Port Conflicts',
    severity: 'Critical',
    symptom: 'Error: `driver failed programming external connectivity on endpoint ...: Bind for 0.0.0.0:80 failed: port is already allocated`',
    rootCauses: [
      {
        reason: 'Another container or host service is already using this host port',
        details: 'Only one process on your host OS can bind to a specific TCP port (e.g. port 80). If another container, or local Apache/IIS/Skype is listening on that port, Docker cannot bind it.',
        solution: 'Either map to a different host port (e.g., 8080:80) or stop the competing container.',
        commandFix: 'docker run -d -p 8080:80 --name alt-web nginx:alpine',
      },
    ],
    tips: [
      'Check which containers are using ports with `docker ps --format "{{.Names}}: {{.Ports}}"`.',
      'You can map any free host port: e.g. `-p 8888:80` allows you to access Nginx via `http://localhost:8888`.',
    ],
  },
  {
    id: 'err-dns-name-resolution',
    title: 'Containers Cannot Communicate By Name (getaddrinfo ENOTFOUND)',
    category: 'Container-to-Container Communication',
    severity: 'High',
    symptom: 'Your backend app tries to connect to `db` or `redis` using its container name, but throws "getaddrinfo ENOTFOUND" or connection timeouts.',
    rootCauses: [
      {
        reason: 'Containers are on the default "bridge" network which lacks automatic DNS',
        details: 'The legacy default bridge network does NOT provide automatic DNS resolution between container names. Only user-defined custom bridge networks provide built-in DNS discovery!',
        solution: 'Create a custom bridge network and attach both containers to it.',
        commandFix: 'docker network create my-net && docker network connect my-net backend && docker network connect my-net db',
      },
    ],
    tips: [
      'Always create a custom network: `docker network create my-app-net` or use Docker Compose which creates one automatically.',
      'Ping between containers: `docker exec -it backend ping db`.',
    ],
  },
  {
    id: 'err-container-exits',
    title: 'Container Exits Immediately with Status "Exited (0)" or "Exited (1)"',
    category: 'Process Management',
    severity: 'Medium',
    symptom: 'You start a container with `docker run -d`, but it instantly stops and `docker ps` shows nothing. `docker ps -a` shows "Exited (0)".',
    rootCauses: [
      {
        reason: 'No foreground process keeping PID 1 alive',
        details: 'A Docker container lives only as long as its main process (PID 1) is active. If your script exits, or you start a service in background mode (like `service nginx start`), PID 1 finishes and Docker terminates the container.',
        solution: 'Run the server in the foreground, or use `nginx -g "daemon off;"`.',
        codeComparison: {
          bad: `# Dockerfile (Exits immediately because "service" forks to background)
CMD service nginx start`,
          good: `# Dockerfile (Stays alive as PID 1 foreground process)
CMD ["nginx", "-g", "daemon off;"]`,
        },
      },
    ],
    tips: [
      'View why the container stopped: `docker logs <container_name>`.',
      'For debugging interactive shells, pass `-it`: `docker run -it ubuntu bash`.',
    ],
  },
  {
    id: 'err-daemon-connection',
    title: 'Cannot Connect to Docker Daemon (docker.sock)',
    category: 'Host & Daemon',
    severity: 'Critical',
    symptom: 'Error response: `Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?`',
    rootCauses: [
      {
        reason: 'Docker Desktop or dockerd service is not running or lacks permission',
        details: 'The Docker CLI is just a client communicating via REST socket to the Docker background daemon (dockerd). If the engine is paused or shut down, commands fail.',
        solution: 'Start Docker Desktop on Windows/macOS or run `sudo systemctl start docker` on Linux.',
        commandFix: 'systemctl start docker',
      },
    ],
    tips: [
      'On Windows/macOS: Launch Docker Desktop from the system tray / Start menu.',
      'On Linux: Verify group membership with `sudo usermod -aG docker $USER`.',
    ],
  },
];

export const DOCKERFILE_TEMPLATES = [
  {
    id: 'node',
    name: 'Node.js Express API',
    initialCode: `# Inefficient / Insecure initial Dockerfile
FROM node:latest
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]`,
    optimizedCode: `# Production-Grade Optimized Multi-Stage Dockerfile
FROM node:18-alpine AS base
WORKDIR /app

# Cache dependencies layer first
COPY package*.json ./
RUN npm ci --only=production

# Copy application source code
COPY . .

# Run as non-privileged user for security
USER node

# Expose server port and define healthcheck
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s \\
  CMD wget --quiet --tries=1 --spider http://localhost:3000/health || exit 1

# Start server listening on 0.0.0.0:3000
ENV NODE_ENV=production
CMD ["node", "server.js"]`,
    suggestions: [
      {
        type: 'warning',
        title: 'Huge Base Image',
        desc: '`node:latest` is over 1 GB in size. Switching to `node:18-alpine` reduces image size to ~170 MB and shrinks vulnerability attack surface.',
      },
      {
        type: 'warning',
        title: 'Broken Docker Layer Caching',
        desc: 'Copying `COPY . .` before `RUN npm install` invalidates the layer cache whenever any file changes, forcing re-installation of all node_modules on every build.',
      },
      {
        type: 'security',
        title: 'Security Risk: Running as Root',
        desc: 'By default, Docker containers run as root. In production, switch to `USER node` to prevent container breakout exploits.',
      },
      {
        type: 'tip',
        title: 'Missing Healthcheck',
        desc: 'Add a `HEALTHCHECK` directive so Docker and orchestrators (like Kubernetes or Swarm) know when the web server is actually healthy and responsive.',
      },
    ],
  },
  {
    id: 'python',
    name: 'Python FastAPI / Flask Server',
    initialCode: `# Initial Python Dockerfile
FROM python:3.11
WORKDIR /code
COPY . /code
RUN pip install -r requirements.txt
CMD ["python", "app.py"]`,
    optimizedCode: `# Production Optimized FastAPI Dockerfile
FROM python:3.11-slim
WORKDIR /code

# Prevent Python from writing .pyc files and enable unbuffered logging
ENV PYTHONDONTWRITEBYTECODE=1 \\
    PYTHONUNBUFFERED=1

# Layer cache: install dependencies first
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source
COPY . .

# Create non-root system user
RUN adduser --disabled-password --gecos "" appuser && chown -R appuser /code
USER appuser

EXPOSE 8000
# Ensure Uvicorn binds to 0.0.0.0 and NOT 127.0.0.1!
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]`,
    suggestions: [
      {
        type: 'warning',
        title: 'Missing Host Binding Flag',
        desc: 'By default, many Python servers (Flask/Uvicorn) bind to 127.0.0.1, making them unreachable from outside the container. Explicitly bind to `--host 0.0.0.0`.',
      },
      {
        type: 'tip',
        title: 'Unbuffered Output',
        desc: 'Set `ENV PYTHONUNBUFFERED=1` so server logs appear instantly in `docker logs` without delay.',
      },
      {
        type: 'warning',
        title: 'Clean Pip Cache',
        desc: 'Add `--no-cache-dir` to `pip install` to avoid saving hundreds of megabytes of wheel caches inside the image layer.',
      },
    ],
  },
];
