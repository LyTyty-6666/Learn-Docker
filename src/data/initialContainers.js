// Pre-configured templates, images, and container definitions
export const DOCKER_IMAGES = [
  {
    name: 'nginx:alpine',
    tag: 'alpine',
    size: '23.4 MB',
    desc: 'High performance web server & reverse proxy',
    defaultPort: 80,
    type: 'web',
    env: [],
  },
  {
    name: 'node:18-alpine',
    tag: '18-alpine',
    size: '174 MB',
    desc: 'Node.js JavaScript runtime environment',
    defaultPort: 3000,
    type: 'app',
    env: ['NODE_ENV=production', 'PORT=3000'],
  },
  {
    name: 'python:3.11-slim',
    tag: '3.11-slim',
    size: '128 MB',
    desc: 'Python server runtime for FastAPI / Flask',
    defaultPort: 8000,
    type: 'app',
    env: ['PYTHONUNBUFFERED=1'],
  },
  {
    name: 'redis:alpine',
    tag: 'alpine',
    size: '32.1 MB',
    desc: 'In-memory key-value data store & cache',
    defaultPort: 6379,
    type: 'cache',
    env: [],
  },
  {
    name: 'postgres:15-alpine',
    tag: '15-alpine',
    size: '89.6 MB',
    desc: 'Powerful relational SQL database system',
    defaultPort: 5432,
    type: 'database',
    env: ['POSTGRES_DB=appdb', 'POSTGRES_USER=postgres'],
  },
];

export const INITIAL_NETWORKS = [
  {
    id: 'net-bridge-default',
    name: 'bridge',
    driver: 'bridge',
    scope: 'local',
    subnet: '172.17.0.0/16',
    gateway: '172.17.0.1',
    isDefault: true,
  },
  {
    id: 'net-host-default',
    name: 'host',
    driver: 'host',
    scope: 'local',
    subnet: 'N/A',
    gateway: 'N/A',
    isDefault: true,
  },
];

export const INITIAL_VOLUMES = [
  {
    name: 'db_data',
    driver: 'local',
    scope: 'local',
    size: '12.4 MB',
  },
];
