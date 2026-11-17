export const LABS = [
  {
    id: 'lab-1',
    level: 'Beginner',
    title: 'Lab 1: Run Your First Web Server',
    description: 'Learn how to pull an Nginx image, run it in detached mode with port forwarding, and test the server response.',
    xp: 100,
    steps: [
      {
        id: 's1',
        instruction: 'Run an Nginx container named "web-server" mapped from host port 8080 to container port 80 in detached mode.',
        expectedCommand: 'docker run -d -p 8080:80 --name web-server nginx:alpine',
        hint: 'Use: docker run -d -p 8080:80 --name web-server nginx:alpine',
        validate: (state) => {
          const c = state.containers.find(x => x.name === 'web-server' && x.status === 'running');
          return c && c.ports.some(p => p.host === 8080 && p.container === 80);
        },
      },
      {
        id: 's2',
        instruction: 'Verify that the container is active by listing running containers.',
        expectedCommand: 'docker ps',
        hint: 'Type: docker ps',
        validate: (state, lastCmd) => {
          return lastCmd && (lastCmd.trim() === 'docker ps' || lastCmd.trim() === 'docker ps -a');
        },
      },
      {
        id: 's3',
        instruction: 'Test the connection to the web server using curl on localhost:8080.',
        expectedCommand: 'curl http://localhost:8080',
        hint: 'Type: curl http://localhost:8080',
        validate: (state, lastCmd) => {
          return lastCmd && (lastCmd.includes('curl') && lastCmd.includes('8080'));
        },
      },
    ],
  },
  {
    id: 'lab-2',
    level: 'Intermediate',
    title: 'Lab 2: Multi-Container Custom Networking',
    description: 'Connect a Node.js backend server with a Redis cache on an isolated Docker bridge network using automatic DNS resolution.',
    xp: 150,
    steps: [
      {
        id: 's1',
        instruction: 'Create a custom Docker network named "app-net".',
        expectedCommand: 'docker network create app-net',
        hint: 'Use: docker network create app-net',
        validate: (state) => {
          return state.networks.some(n => n.name === 'app-net');
        },
      },
      {
        id: 's2',
        instruction: 'Start a Redis cache container named "cache" on the "app-net" network.',
        expectedCommand: 'docker run -d --name cache --network app-net redis:alpine',
        hint: 'Use: docker run -d --name cache --network app-net redis:alpine',
        validate: (state) => {
          return state.containers.some(c => c.name === 'cache' && c.network === 'app-net' && c.status === 'running');
        },
      },
      {
        id: 's3',
        instruction: 'Start a Node.js API server named "api-server" on the same "app-net" network with host port 3000 mapped to container port 3000.',
        expectedCommand: 'docker run -d -p 3000:3000 --name api-server --network app-net node:18-alpine',
        hint: 'Use: docker run -d -p 3000:3000 --name api-server --network app-net node:18-alpine',
        validate: (state) => {
          return state.containers.some(c => c.name === 'api-server' && c.network === 'app-net' && c.status === 'running' && c.ports.some(p => p.host === 3000));
        },
      },
      {
        id: 's4',
        instruction: 'Test the API server connection using curl on localhost:3000.',
        expectedCommand: 'curl http://localhost:3000',
        hint: 'Type: curl http://localhost:3000',
        validate: (state, lastCmd) => {
          return lastCmd && lastCmd.includes('curl') && lastCmd.includes('3000');
        },
      },
    ],
  },
  {
    id: 'lab-3',
    level: 'Intermediate',
    title: 'Lab 3: Port Forwarding & Conflict Resolution',
    description: 'Master the port forwarding syntax (-p HostPort:ContainerPort), discover what happens when ports collide, and inspect server logs.',
    xp: 200,
    steps: [
      {
        id: 's1',
        instruction: 'Inspect the running server logs for "web-server" to view incoming connection requests.',
        expectedCommand: 'docker logs web-server',
        hint: 'Type: docker logs web-server',
        validate: (state, lastCmd) => {
          return lastCmd && lastCmd.startsWith('docker logs');
        },
      },
      {
        id: 's2',
        instruction: 'Stop the "web-server" container cleanly to free up resources.',
        expectedCommand: 'docker stop web-server',
        hint: 'Type: docker stop web-server',
        validate: (state) => {
          const c = state.containers.find(x => x.name === 'web-server');
          return c && c.status === 'stopped';
        },
      },
      {
        id: 's3',
        instruction: 'Restart the "web-server" container and verify it is running again.',
        expectedCommand: 'docker start web-server',
        hint: 'Type: docker start web-server',
        validate: (state) => {
          const c = state.containers.find(x => x.name === 'web-server');
          return c && c.status === 'running';
        },
      },
    ],
  },
  {
    id: 'lab-4',
    level: 'Advanced',
    title: 'Lab 4: Database Storage & Volume Persistence',
    description: 'Create a named Docker volume to safely store PostgreSQL database data across container life-cycles.',
    xp: 250,
    steps: [
      {
        id: 's1',
        instruction: 'Create a named volume called "pgdata" for database persistence.',
        expectedCommand: 'docker volume create pgdata',
        hint: 'Use: docker volume create pgdata',
        validate: (state) => {
          return state.volumes.some(v => v.name === 'pgdata');
        },
      },
      {
        id: 's2',
        instruction: 'Run a PostgreSQL container named "postgres-db" with port 5432:5432 and volume "pgdata" mounted to "/var/lib/postgresql/data".',
        expectedCommand: 'docker run -d -p 5432:5432 -v pgdata:/var/lib/postgresql/data --name postgres-db postgres:15-alpine',
        hint: 'Use: docker run -d -p 5432:5432 -v pgdata:/var/lib/postgresql/data --name postgres-db postgres:15-alpine',
        validate: (state) => {
          return state.containers.some(c => c.name === 'postgres-db' && c.status === 'running' && c.volumes && c.volumes.includes('pgdata'));
        },
      },
      {
        id: 's3',
        instruction: 'Inspect the container details with docker inspect postgres-db to see its IP and mount points.',
        expectedCommand: 'docker inspect postgres-db',
        hint: 'Type: docker inspect postgres-db',
        validate: (state, lastCmd) => {
          return lastCmd && lastCmd.startsWith('docker inspect');
        },
      },
    ],
  },
  {
    id: 'lab-5',
    level: 'Master',
    title: 'Lab 5: Full-Stack Docker Compose Orchestration',
    description: 'Spin up an entire 3-tier production stack (Web proxy, Node API, Postgres DB) with one command.',
    xp: 300,
    steps: [
      {
        id: 's1',
        instruction: 'Launch the multi-container stack defined in docker-compose.yml in detached mode.',
        expectedCommand: 'docker compose up -d',
        hint: 'Type: docker compose up -d',
        validate: (state) => {
          const web = state.containers.find(c => c.name === 'stack-frontend' && c.status === 'running');
          const api = state.containers.find(c => c.name === 'stack-backend' && c.status === 'running');
          const db = state.containers.find(c => c.name === 'stack-database' && c.status === 'running');
          return web && api && db;
        },
      },
      {
        id: 's2',
        instruction: 'Check the status of all compose services with docker compose ps.',
        expectedCommand: 'docker compose ps',
        hint: 'Type: docker compose ps',
        validate: (state, lastCmd) => {
          return lastCmd && lastCmd.includes('docker compose ps');
        },
      },
      {
        id: 's3',
        instruction: 'Curl the frontend load balancer on localhost:80 to confirm the stack is online.',
        expectedCommand: 'curl http://localhost:80',
        hint: 'Type: curl http://localhost:80',
        validate: (state, lastCmd) => {
          return lastCmd && lastCmd.includes('curl') && (lastCmd.includes('localhost') || lastCmd.includes('localhost:80'));
        },
      },
    ],
  },
  {
    id: 'lab-6',
    level: 'Developer',
    title: 'Lab 6: Writing & Running Custom Code with Docker',
    description: 'Build a container image directly from your local application code, run it with bind-mount volume for live development code reloading, and test the API endpoint.',
    xp: 350,
    steps: [
      {
        id: 's1',
        instruction: 'Build a custom application Docker image named "my-app" from the current directory Dockerfile.',
        expectedCommand: 'docker build -t my-app .',
        hint: 'Use: docker build -t my-app .',
        validate: (state, lastCmd) => {
          return lastCmd && (lastCmd.includes('docker build') && lastCmd.includes('my-app'));
        },
      },
      {
        id: 's2',
        instruction: 'Run "my-app" as a container named "my-app-dev" mapped from host port 4000:3000 with a bind mount (-v $(pwd):/app) for live code reloading.',
        expectedCommand: 'docker run -d -p 4000:3000 -v $(pwd):/app --name my-app-dev my-app',
        hint: 'Use: docker run -d -p 4000:3000 -v $(pwd):/app --name my-app-dev my-app',
        validate: (state) => {
          const c = state.containers.find(x => x.name === 'my-app-dev' && x.status === 'running');
          return c && c.ports.some(p => p.host === 4000);
        },
      },
      {
        id: 's3',
        instruction: 'Execute a command inside the running container to check the Node.js runtime version.',
        expectedCommand: 'docker exec my-app-dev node -v',
        hint: 'Use: docker exec my-app-dev node -v',
        validate: (state, lastCmd) => {
          return lastCmd && (lastCmd.includes('docker exec') && lastCmd.includes('my-app-dev'));
        },
      },
      {
        id: 's4',
        instruction: 'Test the live-reloading application API response using curl on localhost:4000.',
        expectedCommand: 'curl http://localhost:4000',
        hint: 'Type: curl http://localhost:4000',
        validate: (state, lastCmd) => {
          return lastCmd && (lastCmd.includes('curl') && lastCmd.includes('4000'));
        },
      },
    ],
  },
];
