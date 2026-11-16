# 🐳 DockMaster Pro — Interactive Docker & Server Learning Platform

> A cross-platform web application built with **React Native (React Native for Web)** supporting **all devices** (Desktop, Tablet, Mobile). Learn Docker connections, container networking, server port forwarding, and get real-time AI suggestions and diagnostics with a fully interactive CLI terminal simulator!

---

## 🌟 Key Features

### 1. 💻 Interactive Docker CLI Terminal Simulator
- **Real-time Bash & Docker Shell**:
  - Command prompt (`root@docker-sandbox:~#`) with ANSI-like colors, tab auto-completion, and command history (Up/Down arrows).
  - Simulates core Docker commands:
    - `docker run -d -p <host>:<container> --name <name> <image>`
    - `docker ps` and `docker ps -a` (with realistic formatted tabular output)
    - `docker stop`, `docker start`, `docker restart`
    - `docker rm`, `docker rm -f`, `docker rmi`
    - `docker images`, `docker pull <image>`
    - `docker logs <container>` (prints realistic web server logs for Nginx, Express, FastAPI, Postgres)
    - `docker inspect <container>` (formatted JSON with network & mount settings)
    - `docker network ls`, `docker network create <name>`
    - `docker volume ls`, `docker volume create <name>`
    - `docker compose up -d`, `docker compose down`, `docker compose ps`
    - `curl http://localhost:<port>` (actual simulated HTTP client that inspects mapped ports and returns real HTTP 200 / HTML / JSON or "Connection Refused")
  - **Quick Command Chips**: One-tap command execution for touchscreens and mobile users.

### 2. 🌐 Live Network & Topology Visualizer
- **Visual Host-to-Container Routing Map**:
  - Displays Host Ports (e.g. `:8080`, `:3000`) connected across the virtual `docker0` bridge network directly to container internal ports (`:80`, `:3000`).
  - Active container status indicators (Running 🟢 / Stopped 🔴), IP addresses (`172.17.0.x`), CPU & memory gauges.
  - **"Test HTTP" Button**: Sends a simulated HTTP request directly to the container and shows the response headers, HTML payload, and explanation of the NAT route.
  - **Docker Virtual Networks Tab**: Displays user-created bridge networks and attached containers with DNS resolution.

### 3. 🧪 5 Progressive Hands-on Guided Labs
- **Lab 1: Hello Web Server** (Run Nginx, port forward `8080:80`, curl localhost:8080).
- **Lab 2: Multi-Container Custom Networking** (Create `app-net`, connect Node API & Redis, inter-container DNS).
- **Lab 3: Port Forwarding Mastery & Port Conflicts** (Inspect logs, stop, restart, handle port collisions).
- **Lab 4: Database Storage & Volume Persistence** (Create named volumes, mount to PostgreSQL).
- **Lab 5: Full-Stack Docker Compose** (Spin up 3-tier stack: Nginx + Node Express + PostgreSQL with `docker compose up -d`).
- Automatic step validation, confetti celebrations 🎉, and XP leveling system!

### 4. 🩺 Docker Doctor & Suggestion Engine
- **Instant Diagnosis for Common Connection Failures**:
  - `ERR_CONNECTION_REFUSED` on `localhost:3000` (missing `-p` or binding to `127.0.0.1` instead of `0.0.0.0`).
  - `Bind for 0.0.0.0:80 failed: port is already allocated` (port collision detection).
  - `getaddrinfo ENOTFOUND` (containers unable to reach each other by name on default bridge).
  - Container exits immediately (`Exited (0)` - PID 1 foreground issue).
  - `Cannot connect to Docker daemon (docker.sock)`.
- **Interactive Host Port Inspector**: Type any host port (e.g., 8080, 3000, 5432) to diagnose which container owns it and get instant fix commands!
- **Side-by-side Code Diffs**: Visual bad vs. good code comparisons for Node.js, Python, Flask, FastAPI, and Django.

### 5. ⚡ Dockerfile Server Linter & Optimizer
- Audits Dockerfiles for Node.js Express, Python FastAPI, etc.
- Detects heavy base images (`:latest` vs `:alpine`), layer cache invalidation, root user security risks, and missing healthchecks.
- One-click **Auto-Optimize** button transforms the Dockerfile to production multi-stage standards.

### 6. 📖 Visual Learning Guide & Searchable Cheatsheet
- Complete illustrated guides on Port Forwarding NAT rules, `0.0.0.0` vs `127.0.0.1`, `host.docker.internal`, and compose syntax.
- Filterable, searchable cheatsheet with "Run in Terminal" and "Copy" actions.

### 7. 📱 Built with React Native (React Native for Web)
- Built using authentic React Native components (`View`, `Text`, `StyleSheet`, `ScrollView`, `TextInput`, `TouchableOpacity`, `useWindowDimensions`, `Platform`).
- Adapts responsively across:
  - **Mobile (< 768px)**: Stacked cards, toggleable terminal/visualizer, touch-friendly quick keys.
  - **Tablet (768px - 1024px)**: Adaptive 2-column view.
  - **Desktop (> 1024px)**: Full side-by-side workbench with split view terminal and live topology map.

---

## 🚀 How to Run

The app is already configured and running on `http://localhost:3000`!

To run or rebuild anytime:

```bash
# Install dependencies (already installed)
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open `http://localhost:3000` in your browser.
