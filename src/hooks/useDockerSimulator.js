import { useState, useCallback, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { DOCKER_IMAGES, INITIAL_NETWORKS, INITIAL_VOLUMES } from '../data/initialContainers';
import { LABS } from '../data/labsData';

function generateId(len = 12) {
  const chars = '0123456789abcdef';
  let str = '';
  for (let i = 0; i < len; i++) {
    str += chars[Math.floor(Math.random() * chars.length)];
  }
  return str;
}

export function useDockerSimulator() {
  const [containers, setContainers] = useState([
    {
      id: 'a1b2c3d4e5f6',
      name: 'demo-nginx',
      image: 'nginx:alpine',
      status: 'stopped',
      created: '10 minutes ago',
      ports: [{ host: 8081, container: 80, protocol: 'tcp' }],
      network: 'bridge',
      ip: '172.17.0.2',
      volumes: [],
      env: [],
      logs: [
        '2026/11/17 06:10:00 [notice] 1#1: using the "epoll" event method',
        '2026/11/17 06:10:00 [notice] 1#1: nginx/1.25.3 started',
        '2026/11/17 06:10:00 [notice] 1#1: Configuration complete, ready for connections on 0.0.0.0:80',
      ],
      stats: { cpu: '0.1%', mem: '14.2MB / 1.95GB' },
    },
  ]);

  const [images, setImages] = useState(DOCKER_IMAGES);
  const [networks, setNetworks] = useState(INITIAL_NETWORKS);
  const [volumes, setVolumes] = useState(INITIAL_VOLUMES);

  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [lastExecutedCommand, setLastExecutedCommand] = useState('');
  
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [activeLabId, setActiveLabId] = useState('lab-1');
  const [xp, setXp] = useState(50);

  const [terminalLines, setTerminalLines] = useState([
    {
      id: 'line-welcome-1',
      type: 'info',
      text: '🐳 Welcome to DockMaster Interactive Shell (Docker Engine v26.1.0)',
    },
    {
      id: 'line-welcome-2',
      type: 'info',
      text: 'Type "help" to view available commands, or follow the guided Labs on the side!',
    },
    {
      id: 'line-welcome-3',
      type: 'hint',
      text: '💡 Quick test: Try running "docker ps" or "docker run -d -p 8080:80 --name web nginx:alpine"',
    },
  ]);

  // Lab step completion checker
  const checkLabProgress = useCallback((newContainers, newNetworks, newVolumes, lastCmd) => {
    const activeLab = LABS.find(l => l.id === activeLabId);
    if (!activeLab) return;

    const state = {
      containers: newContainers,
      networks: newNetworks,
      volumes: newVolumes,
    };

    activeLab.steps.forEach((step, index) => {
      const stepKey = `${activeLab.id}-${step.id}`;
      if (!completedSteps.has(stepKey)) {
        // Can only complete if prior steps are completed or it's step 0
        const canCheck = index === 0 || completedSteps.has(`${activeLab.id}-${activeLab.steps[index - 1].id}`);
        if (canCheck && step.validate(state, lastCmd)) {
          setCompletedSteps(prev => new Set([...prev, stepKey]));
          setXp(x => x + 50);

          try {
            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.6 },
            });
          } catch (e) {
            // ignore in non-browser env
          }

          setTerminalLines(lines => [
            ...lines,
            {
              id: generateId(),
              type: 'success',
              text: `🎉 Mission Step Passed: [${step.instruction.substring(0, 45)}...] (+50 XP)`,
            },
          ]);
        }
      }
    });
  }, [activeLabId, completedSteps]);

  const executeCommand = useCallback((rawCmd) => {
    if (!rawCmd || !rawCmd.trim()) return;
    const cmd = rawCmd.trim();

    // Add to history
    setHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);
    setLastExecutedCommand(cmd);

    // Record user command input line
    const inputLine = {
      id: generateId(),
      type: 'input',
      text: cmd,
    };

    let responseLines = [];

    const tokens = cmd.split(/\s+/);
    const mainCmd = tokens[0];

    if (cmd === 'clear') {
      setTerminalLines([]);
      return;
    }

    if (cmd === 'help') {
      responseLines = [
        { id: generateId(), type: 'info', text: '═══ DockMaster CLI Practice CheatSheet ═══' },
        { id: generateId(), type: 'output', text: '• docker run -d -p <host>:<container> --name <name> <image>' },
        { id: generateId(), type: 'output', text: '• docker ps / docker ps -a' },
        { id: generateId(), type: 'output', text: '• docker stop <name/id> | docker start <name/id>' },
        { id: generateId(), type: 'output', text: '• docker rm <name/id> | docker rmi <image>' },
        { id: generateId(), type: 'output', text: '• docker logs <name/id>' },
        { id: generateId(), type: 'output', text: '• docker inspect <name/id>' },
        { id: generateId(), type: 'output', text: '• docker network ls | docker network create <name>' },
        { id: generateId(), type: 'output', text: '• docker volume ls | docker volume create <name>' },
        { id: generateId(), type: 'output', text: '• docker compose up -d | docker compose down | docker compose ps' },
        { id: generateId(), type: 'output', text: '• curl http://localhost:<port>' },
        { id: generateId(), type: 'output', text: '• clear | reset' },
      ];
    } else if (cmd === 'reset') {
      setContainers([]);
      setNetworks(INITIAL_NETWORKS);
      setVolumes(INITIAL_VOLUMES);
      responseLines = [
        { id: generateId(), type: 'success', text: 'Docker environment has been reset to clean state.' },
      ];
    } else if (cmd.startsWith('curl')) {
      // Simulated curl client
      const targetUrl = tokens[1] || '';
      const portMatch = targetUrl.match(/:(\d+)/);
      const port = portMatch ? parseInt(portMatch[1], 10) : 80;

      // Find running container mapped to this port
      const matchedContainer = containers.find(c => 
        c.status === 'running' && c.ports.some(p => p.host === port)
      );

      if (matchedContainer) {
        let content = '';
        if (matchedContainer.image.includes('nginx')) {
          content = `<!DOCTYPE html>
<html>
<head><title>Welcome to Nginx!</title></head>
<body>
  <h1>Success! Nginx Web Server is running inside Docker!</h1>
  <p>Connection established from Host Port ${port} to Container Port 80.</p>
</body>
</html>`;
        } else if (matchedContainer.image.includes('node') || matchedContainer.image.includes('app') || matchedContainer.name.includes('app')) {
          const hasLiveReload = matchedContainer.volumes && matchedContainer.volumes.some(v => v.includes('pwd') || v.includes('app') || v.includes('/'));
          content = JSON.stringify({
            status: 'online',
            service: matchedContainer.name,
            version: '1.0.0',
            liveReload: hasLiveReload ? 'ACTIVE (Host Bind-Mount Live Sync)' : 'INACTIVE',
            framework: 'Express.js / Node.js',
            timestamp: new Date().toISOString(),
            message: hasLiveReload
              ? '⚡ Hot Reload Active: Code changes on host are instantly reflected inside Docker!'
              : 'Hello from Dockerized Application Server!',
          }, null, 2);
        } else if (matchedContainer.image.includes('python')) {
          content = JSON.stringify({
            app: 'FastAPI Microservice',
            status: '200 OK',
            docs_url: '/docs',
          }, null, 2);
        } else {
          content = `HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nServer: ${matchedContainer.image}\r\n\r\nConnection successfully established!`;
        }

        responseLines = [
          { id: generateId(), type: 'success', text: `HTTP/1.1 200 OK` },
          { id: generateId(), type: 'output', text: `Server: ${matchedContainer.image}` },
          { id: generateId(), type: 'output', text: `Content-Type: text/html; charset=UTF-8` },
          { id: generateId(), type: 'output', text: '' },
          { id: generateId(), type: 'output', text: content },
        ];

        // Append log to container
        matchedContainer.logs.push(`172.17.0.1 - - [${new Date().toLocaleTimeString()}] "GET / HTTP/1.1" 200 - "curl/8.4.0"`);
      } else {
        responseLines = [
          { id: generateId(), type: 'error', text: `curl: (7) Failed to connect to localhost port ${port}: Connection refused` },
          { id: generateId(), type: 'hint', text: `💡 DockMaster Doctor: No active container is mapped to host port ${port}. Run "docker ps" to verify port bindings!` },
        ];
      }
    } else if (cmd.startsWith('docker compose') || cmd.startsWith('docker-compose')) {
      const sub = tokens[2] || tokens[1];
      if (cmd.includes('up')) {
        const stackContainers = [
          {
            id: generateId(),
            name: 'stack-frontend',
            image: 'nginx:alpine',
            status: 'running',
            created: 'Just now',
            ports: [{ host: 80, container: 80, protocol: 'tcp' }],
            network: 'stack_default',
            ip: '172.20.0.2',
            volumes: [],
            env: [],
            logs: ['Nginx reverse proxy listening on 0.0.0.0:80, forwarding /api to backend:3000'],
            stats: { cpu: '0.2%', mem: '12MB / 2GB' },
          },
          {
            id: generateId(),
            name: 'stack-backend',
            image: 'node:18-alpine',
            status: 'running',
            created: 'Just now',
            ports: [{ host: 4000, container: 3000, protocol: 'tcp' }],
            network: 'stack_default',
            ip: '172.20.0.3',
            volumes: [],
            env: ['NODE_ENV=production', 'PORT=3000', 'DB_HOST=stack-database'],
            logs: ['API Gateway started on port 3000', 'Database connection established to stack-database:5432'],
            stats: { cpu: '0.8%', mem: '68MB / 2GB' },
          },
          {
            id: generateId(),
            name: 'stack-database',
            image: 'postgres:15-alpine',
            status: 'running',
            created: 'Just now',
            ports: [{ host: 5432, container: 5432, protocol: 'tcp' }],
            network: 'stack_default',
            ip: '172.20.0.4',
            volumes: ['stack_pgdata'],
            env: ['POSTGRES_DB=appdb', 'POSTGRES_PASSWORD=secret'],
            logs: ['PostgreSQL Database server initialized and accepting connections.'],
            stats: { cpu: '0.4%', mem: '44MB / 2GB' },
          },
        ];

        setContainers(prev => [
          ...prev.filter(c => !c.name.startsWith('stack-')),
          ...stackContainers,
        ]);

        if (!networks.some(n => n.name === 'stack_default')) {
          setNetworks(prev => [
            ...prev,
            { id: generateId(), name: 'stack_default', driver: 'bridge', scope: 'local', subnet: '172.20.0.0/16', gateway: '172.20.0.1' },
          ]);
        }

        responseLines = [
          { id: generateId(), type: 'info', text: '[+] Running 4/4' },
          { id: generateId(), type: 'success', text: ' ✔ Network stack_default   Created' },
          { id: generateId(), type: 'success', text: ' ✔ Container stack-database  Started' },
          { id: generateId(), type: 'success', text: ' ✔ Container stack-backend   Started' },
          { id: generateId(), type: 'success', text: ' ✔ Container stack-frontend  Started' },
        ];
      } else if (cmd.includes('down')) {
        setContainers(prev => prev.filter(c => !c.name.startsWith('stack-')));
        responseLines = [
          { id: generateId(), type: 'info', text: '[+] Running 4/4' },
          { id: generateId(), type: 'output', text: ' ✔ Container stack-frontend  Removed' },
          { id: generateId(), type: 'output', text: ' ✔ Container stack-backend   Removed' },
          { id: generateId(), type: 'output', text: ' ✔ Container stack-database  Removed' },
          { id: generateId(), type: 'output', text: ' ✔ Network stack_default   Removed' },
        ];
      } else if (cmd.includes('ps')) {
        const stackList = containers.filter(c => c.name.startsWith('stack-'));
        if (stackList.length === 0) {
          responseLines = [{ id: generateId(), type: 'output', text: 'No compose services running.' }];
        } else {
          responseLines = [
            { id: generateId(), type: 'info', text: 'NAME                IMAGE              COMMAND                  SERVICE     STATUS              PORTS' },
            ...stackList.map(c => ({
              id: generateId(),
              type: 'output',
              text: `${c.name.padEnd(19)} ${c.image.padEnd(18)} "${c.image.includes('nginx') ? 'nginx -g daemon...' : 'docker-entrypoint...'}" ${c.name.replace('stack-', '').padEnd(11)} Up (${c.status})       ${c.ports.map(p => `0.0.0.0:${p.host}->${p.container}/tcp`).join(', ')}`,
            })),
          ];
        }
      }
    } else if (mainCmd === 'docker') {
      const action = tokens[1];

      if (action === 'ps') {
        const showAll = tokens.includes('-a') || tokens.includes('--all');
        const list = showAll ? containers : containers.filter(c => c.status === 'running');

        if (list.length === 0) {
          responseLines = [
            { id: generateId(), type: 'info', text: 'CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS         PORTS                    NAMES' },
            { id: generateId(), type: 'output', text: '(No containers found)' },
          ];
        } else {
          responseLines = [
            { id: generateId(), type: 'info', text: 'CONTAINER ID   IMAGE            COMMAND                  CREATED          STATUS          PORTS                    NAMES' },
            ...list.map(c => {
              const portStr = c.ports && c.ports.length > 0
                ? c.ports.map(p => `0.0.0.0:${p.host}->${p.container}/tcp`).join(', ')
                : '';
              const statusStr = c.status === 'running' ? 'Up (healthy)' : 'Exited (0)';
              return {
                id: generateId(),
                type: 'output',
                text: `${c.id.padEnd(14)} ${c.image.padEnd(16)} "/docker-entrypoint..."  ${c.created.padEnd(16)} ${statusStr.padEnd(15)} ${portStr.padEnd(24)} ${c.name}`,
              };
            }),
          ];
        }
      } else if (action === 'images') {
        responseLines = [
          { id: generateId(), type: 'info', text: 'REPOSITORY          TAG                 IMAGE ID       CREATED         SIZE' },
          ...images.map(img => {
            const [repo, tag] = img.name.split(':');
            return {
              id: generateId(),
              type: 'output',
              text: `${repo.padEnd(19)} ${(tag || 'latest').padEnd(19)} ${generateId(12)}   2 weeks ago     ${img.size}`,
            };
          }),
        ];
      } else if (action === 'run') {
        // Parse flags
        let name = '';
        let ports = [];
        let network = 'bridge';
        let volumesList = [];
        let envList = [];
        let isDetached = false;
        let imageArg = '';

        for (let i = 2; i < tokens.length; i++) {
          const t = tokens[i];
          if (t === '-d' || t === '--detach') {
            isDetached = true;
          } else if (t === '--name' && tokens[i + 1]) {
            name = tokens[++i];
          } else if (t.startsWith('--name=')) {
            name = t.split('=')[1];
          } else if ((t === '-p' || t === '--publish') && tokens[i + 1]) {
            const pVal = tokens[++i];
            const [h, c] = pVal.split(':').map(Number);
            if (h && c) ports.push({ host: h, container: c, protocol: 'tcp' });
          } else if (t.startsWith('-p=')) {
            const [h, c] = t.split('=')[1].split(':').map(Number);
            if (h && c) ports.push({ host: h, container: c, protocol: 'tcp' });
          } else if (t === '--network' && tokens[i + 1]) {
            network = tokens[++i];
          } else if (t === '-v' && tokens[i + 1]) {
            const rawV = tokens[++i];
            volumesList.push(rawV.split(':')[0]);
            volumesList.push(rawV);
          } else if (t.startsWith('-v=')) {
            const rawV = t.split('=')[1];
            volumesList.push(rawV.split(':')[0]);
            volumesList.push(rawV);
          } else if (t === '-e' && tokens[i + 1]) {
            envList.push(tokens[++i]);
          } else if (!t.startsWith('-')) {
            imageArg = t;
          }
        }

        if (!imageArg) {
          responseLines = [
            { id: generateId(), type: 'error', text: '"docker run" requires at least 1 argument: [IMAGE]. See "docker run --help".' },
          ];
        } else {
          // Check name conflict
          const containerName = name || `distracted_${generateId(4)}`;
          const existingName = containers.find(c => c.name === containerName);
          if (existingName) {
            responseLines = [
              {
                id: generateId(),
                type: 'error',
                text: `docker: Error response from daemon: Conflict. The container name "/${containerName}" is already in use by container "${existingName.id}". You have to remove (or rename) that container to be able to reuse that name.`,
              },
            ];
          } else {
            // Check port conflicts against running containers
            let portConflict = null;
            for (const p of ports) {
              const conflict = containers.find(c => c.status === 'running' && c.ports.some(cp => cp.host === p.host));
              if (conflict) {
                portConflict = { port: p.host, container: conflict.name };
                break;
              }
            }

            if (portConflict) {
              responseLines = [
                {
                  id: generateId(),
                  type: 'error',
                  text: `docker: Error response from daemon: driver failed programming external connectivity on endpoint ${containerName}: Bind for 0.0.0.0:${portConflict.port} failed: port is already allocated.`,
                },
                {
                  id: generateId(),
                  type: 'hint',
                  text: `💡 DockMaster Doctor: Host port ${portConflict.port} is already used by container "${portConflict.container}". Map to another port (e.g., -p ${portConflict.port + 1}:${ports[0]?.container}) or stop "${portConflict.container}".`,
                },
              ];
            } else {
              const newId = generateId(12);
              const fullId = `${newId}${generateId(52)}`;
              const ipLast = 2 + containers.length;
              const ip = `172.17.0.${ipLast}`;

              // Auto-add image if not present
              if (!images.some(img => img.name === imageArg || img.name.startsWith(imageArg))) {
                setImages(prev => [
                  ...prev,
                  {
                    name: imageArg.includes(':') ? imageArg : `${imageArg}:latest`,
                    tag: imageArg.split(':')[1] || 'latest',
                    size: '45.8 MB',
                    desc: 'User downloaded image',
                    defaultPort: 80,
                    type: 'app',
                    env: [],
                  },
                ]);
              }

              const newContainer = {
                id: newId,
                name: containerName,
                image: imageArg,
                status: 'running',
                created: 'Just now',
                ports: ports.length > 0 ? ports : (imageArg.includes('nginx') ? [{ host: 8080, container: 80, protocol: 'tcp' }] : []),
                network: network,
                ip: ip,
                volumes: volumesList,
                env: envList,
                logs: [
                  `Server initialized on ${ip}`,
                  `Configuration loaded successfully.`,
                  ports.length > 0
                    ? `Ready to handle traffic forwarded from host port ${ports[0].host} -> internal port ${ports[0].container}`
                    : `Process running without published host ports.`,
                ],
                stats: { cpu: '0.1%', mem: '18MB / 2GB' },
              };

              setContainers(prev => {
                const next = [...prev, newContainer];
                checkLabProgress(next, networks, volumes, cmd);
                return next;
              });

              responseLines = [
                { id: generateId(), type: 'output', text: fullId },
              ];
            }
          }
        }
      } else if (action === 'stop') {
        const target = tokens[2];
        const match = containers.find(c => c.name === target || c.id === target);
        if (!match) {
          responseLines = [
            { id: generateId(), type: 'error', text: `Error response from daemon: No such container: ${target}` },
          ];
        } else {
          setContainers(prev => {
            const next = prev.map(c => (c.name === target || c.id === target) ? { ...c, status: 'stopped' } : c);
            checkLabProgress(next, networks, volumes, cmd);
            return next;
          });
          responseLines = [{ id: generateId(), type: 'output', text: target }];
        }
      } else if (action === 'start') {
        const target = tokens[2];
        const match = containers.find(c => c.name === target || c.id === target);
        if (!match) {
          responseLines = [
            { id: generateId(), type: 'error', text: `Error response from daemon: No such container: ${target}` },
          ];
        } else {
          setContainers(prev => {
            const next = prev.map(c => (c.name === target || c.id === target) ? { ...c, status: 'running' } : c);
            checkLabProgress(next, networks, volumes, cmd);
            return next;
          });
          responseLines = [{ id: generateId(), type: 'output', text: target }];
        }
      } else if (action === 'restart') {
        const target = tokens[2];
        const match = containers.find(c => c.name === target || c.id === target);
        if (!match) {
          responseLines = [
            { id: generateId(), type: 'error', text: `Error response from daemon: No such container: ${target}` },
          ];
        } else {
          setContainers(prev => {
            const next = prev.map(c => (c.name === target || c.id === target) ? { ...c, status: 'running' } : c);
            checkLabProgress(next, networks, volumes, cmd);
            return next;
          });
          responseLines = [{ id: generateId(), type: 'output', text: target }];
        }
      } else if (action === 'rm') {
        const isForce = tokens.includes('-f') || tokens.includes('--force');
        const target = tokens.find(t => t !== 'docker' && t !== 'rm' && t !== '-f' && t !== '--force');
        const match = containers.find(c => c.name === target || c.id === target);
        if (!match) {
          responseLines = [
            { id: generateId(), type: 'error', text: `Error: No such container: ${target}` },
          ];
        } else if (match.status === 'running' && !isForce) {
          responseLines = [
            {
              id: generateId(),
              type: 'error',
              text: `Error response from daemon: You cannot remove a running container ${match.id}. Stop the container before attempting removal or force remove using -f`,
            },
          ];
        } else {
          setContainers(prev => {
            const next = prev.filter(c => c.name !== target && c.id !== target);
            checkLabProgress(next, networks, volumes, cmd);
            return next;
          });
          responseLines = [{ id: generateId(), type: 'output', text: target }];
        }
      } else if (action === 'logs') {
        const target = tokens[2];
        const match = containers.find(c => c.name === target || c.id === target);
        if (!match) {
          responseLines = [
            { id: generateId(), type: 'error', text: `Error: No such container: ${target}` },
          ];
        } else {
          responseLines = match.logs.map(log => ({
            id: generateId(),
            type: 'output',
            text: log,
          }));
        }
      } else if (action === 'inspect') {
        const target = tokens[2];
        const match = containers.find(c => c.name === target || c.id === target);
        if (!match) {
          responseLines = [
            { id: generateId(), type: 'error', text: `Error: No such object: ${target}` },
          ];
        } else {
          const inspectData = [
            {
              Id: match.id,
              Created: match.created,
              State: { Status: match.status, Running: match.status === 'running' },
              NetworkSettings: {
                IPAddress: match.ip,
                Gateway: '172.17.0.1',
                Ports: match.ports.reduce((acc, p) => {
                  acc[`${p.container}/tcp`] = [{ HostIp: '0.0.0.0', HostPort: `${p.host}` }];
                  return acc;
                }, {}),
                Networks: {
                  [match.network]: {
                    IPAddress: match.ip,
                    NetworkID: 'net-bridge-default',
                  },
                },
              },
              Mounts: match.volumes.map(v => ({
                Type: 'volume',
                Name: v,
                Source: `/var/lib/docker/volumes/${v}/_data`,
                Destination: '/data',
              })),
            },
          ];
          responseLines = [
            { id: generateId(), type: 'output', text: JSON.stringify(inspectData, null, 2) },
          ];
        }
      } else if (action === 'network') {
        const sub = tokens[2];
        if (sub === 'ls') {
          responseLines = [
            { id: generateId(), type: 'info', text: 'NETWORK ID     NAME      DRIVER    SCOPE' },
            ...networks.map(n => ({
              id: generateId(),
              type: 'output',
              text: `${n.id.substring(0, 12).padEnd(14)} ${n.name.padEnd(9)} ${n.driver.padEnd(9)} ${n.scope}`,
            })),
          ];
        } else if (sub === 'create') {
          const netName = tokens[3];
          if (!netName) {
            responseLines = [{ id: generateId(), type: 'error', text: '"docker network create" requires network name.' }];
          } else {
            const newNet = {
              id: generateId(12),
              name: netName,
              driver: 'bridge',
              scope: 'local',
              subnet: `172.${18 + networks.length}.0.0/16`,
              gateway: `172.${18 + networks.length}.0.1`,
            };
            setNetworks(prev => {
              const next = [...prev, newNet];
              checkLabProgress(containers, next, volumes, cmd);
              return next;
            });
            responseLines = [{ id: generateId(), type: 'output', text: newNet.id }];
          }
        }
      } else if (action === 'volume') {
        const sub = tokens[2];
        if (sub === 'ls') {
          responseLines = [
            { id: generateId(), type: 'info', text: 'DRIVER    VOLUME NAME' },
            ...volumes.map(v => ({
              id: generateId(),
              type: 'output',
              text: `${v.driver.padEnd(9)} ${v.name}`,
            })),
          ];
        } else if (sub === 'create') {
          const volName = tokens[3];
          if (!volName) {
            responseLines = [{ id: generateId(), type: 'error', text: '"docker volume create" requires volume name.' }];
          } else {
            const newVol = { name: volName, driver: 'local', scope: 'local', size: '0 B' };
            setVolumes(prev => {
              const next = [...prev, newVol];
              checkLabProgress(containers, networks, next, cmd);
              return next;
            });
            responseLines = [{ id: generateId(), type: 'output', text: volName }];
          }
        }
      } else if (action === 'build') {
        let tag = 'my-app:latest';
        const tagIdx = tokens.findIndex(t => t === '-t' || t === '--tag');
        if (tagIdx !== -1 && tokens[tagIdx + 1]) {
          tag = tokens[tagIdx + 1];
          if (!tag.includes(':')) tag = `${tag}:latest`;
        }

        const newImage = {
          name: tag,
          size: '142MB',
          created: 'Just now',
          description: 'Custom application container image built from local Dockerfile',
        };

        setImages(prev => {
          const next = [...prev.filter(img => img.name !== tag), newImage];
          return next;
        });

        checkLabProgress(containers, networks, volumes, cmd);

        responseLines = [
          { id: generateId(), type: 'info', text: `[+] Building 1.8s (8/8) FINISHED                         docker:default` },
          { id: generateId(), type: 'output', text: ` => [internal] load build definition from Dockerfile                   0.0s` },
          { id: generateId(), type: 'output', text: ` => [internal] load .dockerignore                                      0.0s` },
          { id: generateId(), type: 'output', text: ` => [1/4] FROM docker.io/library/node:18-alpine                        0.2s` },
          { id: generateId(), type: 'output', text: ` => [2/4] WORKDIR /app                                                 0.1s` },
          { id: generateId(), type: 'output', text: ` => [3/4] COPY package*.json ./                                        0.1s` },
          { id: generateId(), type: 'output', text: ` => [3/4] RUN npm install --production                                0.9s` },
          { id: generateId(), type: 'output', text: ` => [4/4] COPY . .                                                     0.2s` },
          { id: generateId(), type: 'success', text: ` => exporting to image                                                 0.3s` },
          { id: generateId(), type: 'success', text: ` => => naming to docker.io/library/${tag}` },
        ];
      } else if (action === 'exec') {
        const targetContainerName = tokens.find(t => 
          t !== 'docker' && t !== 'exec' && !t.startsWith('-')
        );
        const subCommand = tokens.slice(tokens.indexOf(targetContainerName) + 1).join(' ') || 'sh';

        const matched = containers.find(c => c.name === targetContainerName || c.id === targetContainerName);

        if (!matched) {
          responseLines = [
            { id: generateId(), type: 'error', text: `Error: No such container: ${targetContainerName || 'unknown'}` },
          ];
        } else if (matched.status !== 'running') {
          responseLines = [
            { id: generateId(), type: 'error', text: `Error response from daemon: Container ${matched.id} is not running` },
          ];
        } else {
          checkLabProgress(containers, networks, volumes, cmd);

          if (subCommand.includes('node -v') || subCommand.includes('node --version')) {
            responseLines = [
              { id: generateId(), type: 'success', text: 'v18.20.2' },
            ];
          } else if (subCommand.includes('python -v') || subCommand.includes('python --version')) {
            responseLines = [
              { id: generateId(), type: 'success', text: 'Python 3.11.8' },
            ];
          } else if (subCommand.includes('ls')) {
            responseLines = [
              { id: generateId(), type: 'output', text: 'Dockerfile  README.md  node_modules  package.json  package-lock.json  src' },
            ];
          } else {
            responseLines = [
              { id: generateId(), type: 'success', text: `Connected to interactive session on ${matched.name} (/app)` },
              { id: generateId(), type: 'output', text: `root@${matched.id.substring(0, 7)}:/app# ${subCommand}` },
              { id: generateId(), type: 'output', text: `Process executed successfully inside isolated container environment.` },
            ];
          }
        }
      } else {
        responseLines = [
          { id: generateId(), type: 'error', text: `docker: "${action}" is not a docker command. See "docker --help".` },
        ];
      }
    } else {
      responseLines = [
        { id: generateId(), type: 'error', text: `bash: ${mainCmd}: command not found. Try "help" or "docker ps".` },
      ];
    }

    setTerminalLines(prev => [...prev, inputLine, ...responseLines]);
    checkLabProgress(containers, networks, volumes, cmd);
  }, [containers, images, networks, volumes, checkLabProgress]);

  // Navigate command history
  const navigateHistory = useCallback((direction) => {
    if (history.length === 0) return '';
    let newIndex = historyIndex;
    if (direction === 'up') {
      newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
    } else if (direction === 'down') {
      newIndex = historyIndex === -1 ? -1 : Math.min(history.length - 1, historyIndex + 1);
    }
    setHistoryIndex(newIndex);
    return newIndex >= 0 ? history[newIndex] : '';
  }, [history, historyIndex]);

  return {
    containers,
    images,
    networks,
    volumes,
    terminalLines,
    executeCommand,
    navigateHistory,
    completedSteps,
    activeLabId,
    setActiveLabId,
    xp,
    setContainers,
  };
}
