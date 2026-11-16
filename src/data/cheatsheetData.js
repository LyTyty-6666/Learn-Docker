export const CHEATSHEET = [
  {
    category: 'Container Lifecycle',
    items: [
      { cmd: 'docker run -d -p 8080:80 nginx:alpine', desc: 'Run Nginx in background, mapping host port 8080 to container port 80' },
      { cmd: 'docker run -it ubuntu bash', desc: 'Run container with interactive TTY shell' },
      { cmd: 'docker ps', desc: 'List all running containers with IDs, ports, and status' },
      { cmd: 'docker ps -a', desc: 'List all containers (running and stopped)' },
      { cmd: 'docker stop <name/id>', desc: 'Gracefully stop a running container (SIGTERM followed by SIGKILL)' },
      { cmd: 'docker start <name/id>', desc: 'Start an existing stopped container' },
      { cmd: 'docker restart <name/id>', desc: 'Restart a container' },
      { cmd: 'docker rm <name/id>', desc: 'Remove a stopped container' },
      { cmd: 'docker rm -f <name/id>', desc: 'Force remove a running container immediately' },
    ],
  },
  {
    category: 'Networking & Connectivity',
    items: [
      { cmd: 'docker network ls', desc: 'List all networks (bridge, host, custom)' },
      { cmd: 'docker network create <net-name>', desc: 'Create a custom bridge network with DNS resolution' },
      { cmd: 'docker network connect <net> <container>', desc: 'Attach a running container to an existing network' },
      { cmd: 'docker network inspect <net-name>', desc: 'Display network subnet, gateway, and attached containers' },
      { cmd: 'docker port <container>', desc: 'Show port mappings for a specific container' },
    ],
  },
  {
    category: 'Diagnostics & Logs',
    items: [
      { cmd: 'docker logs <container>', desc: 'Print stdout/stderr output logs of a container' },
      { cmd: 'docker logs -f <container>', desc: 'Stream live logs in real time (follow)' },
      { cmd: 'docker inspect <container>', desc: 'Return low-level JSON details (IP, mounts, env, state)' },
      { cmd: 'docker exec -it <container> sh', desc: 'Open an interactive shell inside a running container' },
      { cmd: 'docker top <container>', desc: 'Display running processes inside a container' },
    ],
  },
  {
    category: 'Images & Volumes',
    items: [
      { cmd: 'docker images', desc: 'List local cached images and their sizes' },
      { cmd: 'docker pull <image>:<tag>', desc: 'Download image layers from Docker Hub' },
      { cmd: 'docker build -t <tag> .', desc: 'Build Docker image from Dockerfile in current directory' },
      { cmd: 'docker rmi <image>', desc: 'Remove an image from local storage' },
      { cmd: 'docker volume create <name>', desc: 'Create a persistent named volume' },
      { cmd: 'docker volume ls', desc: 'List all persistent volumes' },
    ],
  },
  {
    category: 'Docker Compose',
    items: [
      { cmd: 'docker compose up -d', desc: 'Build, create, and start multi-container services in background' },
      { cmd: 'docker compose down', desc: 'Stop and remove containers, networks, and volumes' },
      { cmd: 'docker compose ps', desc: 'List status of services in the current compose project' },
      { cmd: 'docker compose logs -f', desc: 'Follow aggregated logs of all services' },
    ],
  },
];
