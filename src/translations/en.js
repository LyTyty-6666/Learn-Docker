// English Translations Dictionary
export const en = {
  // Header & App
  brandTitle: 'DockMaster',
  brandSubtitle: 'Interactive Docker & Server Learning Platform',
  running: 'Running',
  stopped: 'Stopped',
  reset: 'Reset',
  resetTooltip: 'Reset Docker sandbox to initial state',
  pro: 'PRO',
  theme: 'Theme',
  lightWhiteCream: 'White-Cream',
  darkTheme: 'Dark Mode',
  language: 'Language',
  
  // Tabs
  tabWorkspace: 'Terminal & Architecture',
  tabLabs: 'Guided Labs',
  tabDoctor: 'Docker Doctor',
  tabOptimizer: 'Dockerfile Analyzer',
  tabGuide: 'Visual Learning',
  tabCheatsheet: 'Cheatsheet',
  badge5Labs: '6 Labs',
  badge6Labs: '6 Labs',
  badgeAiHelp: 'AI Help',

  // Workspace
  splitView: 'Split View (Both)',
  cliTerminal: 'CLI Terminal',
  topologyVisualizer: 'Topology Visualizer',
  tipHelpText: '💡 Run commands in terminal to observe real-time topology and port updates!',

  // Terminal
  termUser: 'root@docker-sandbox: ~ (bash 5.2)',
  termShortcutHint: 'Tab ⇥ Complete  •  ↑↓ History',
  runBtn: 'Run',
  clearBtn: 'Clear',
  helpBtn: 'Help',
  quickCommandsTitle: 'Quick Commands:',
  viewAll: 'View All',
  compactView: 'Scrollable',
  scrollHint: 'Scroll with wheel / ◄ ►',
  termInputPlaceholder: 'Type docker command (e.g. docker ps, docker run...)',
  
  // Quick command labels
  cmdListRunning: 'List Running',
  cmdListAll: 'List All',
  cmdRunNginx: 'Run Nginx (8080:80)',
  cmdTestWeb: 'Test Web Server',
  cmdRunRedis: 'Run Redis',
  cmdCreateNet: 'Create Network',
  cmdComposeUp: 'Compose Up',
  cmdInspectLogs: 'Inspect Logs',
  cmdBuildApp: 'Build App (docker build)',
  cmdRunDev: 'Live Code Run (:4000)',
  cmdTestApp: 'Test App (:4000)',

  // Visualizer
  visualizerTitle: 'Live Docker Connection & Topology Visualizer',
  tabTopologyMap: 'Topology Map',
  tabNetworks: 'Networks',
  hostMachineZone: 'HOST MACHINE (Your Laptop / localhost)',
  hostZoneDesc: 'External ports accessible in your web browser (http://localhost:PORT)',
  noHostPorts: 'No host ports currently published (-p)',
  trafficRouteExplanation: 'Traffic routed through Docker bridge to container',
  containersZone: 'DOCKER CONTAINERS (SANDBOX)',
  containersZoneDesc: 'Isolated container instances running with private IP addresses',
  noContainersRunning: 'No containers running yet. Launch one from terminal or quick keys above!',
  quickLaunchNginx: 'Quick Launch Nginx (:8080)',
  bridgeNetworkTitle: 'Docker Virtual Bridge (docker0) — NAT Port Forwarding',
  testHttpBtn: 'Test HTTP',
  inspectBtn: 'Inspect',
  logsBtn: 'Logs',
  stopBtn: 'Stop',
  startBtn: 'Start',

  // Guided Labs
  labsTitle: 'Docker Guided Missions & Challenges',
  missionSteps: 'Mission Steps',
  liveTerminal: 'Live Terminal',
  runInTerminal: 'Run in Terminal',
  showHint: 'Show Hint',
  hideHint: 'Hide Hint',
  hintLabel: '💡 Hint:',
  xpBonus: 'XP',
  labCompleted: '🎉 Fantastic! You completed all steps in this mission!',

  // Docker Doctor
  doctorTitle: 'Docker Doctor & Connection Diagnostic Advisor',
  doctorSubtitle: 'Select a common Docker server problem or diagnose your running ports to get instant actionable suggestions.',
  portDoctorTitle: 'Interactive Host Port Inspector',
  portDoctorDesc: 'Wondering why a port isn\'t connecting? Enter any host port to diagnose its status against your Docker sandbox.',
  diagnosePortBtn: 'Diagnose Port',
  quickTestLabel: 'Quick Test:',
  commonIssuesTitle: 'Common Docker Connection & Server Issues',
  symptomLabel: '🚨 Observed Symptom:',
  rootCausesTitle: 'Root Causes & Instant Fixes:',
  recommendedFixLabel: '💡 Recommended Fix:',
  antiPatternLabel: '❌ Anti-Pattern (Fails in Docker)',
  correctSolutionLabel: '✅ Correct Solution (Works in Docker)',
  tryFixCmd: 'Apply Fix in Terminal',

  // Dockerfile Optimizer
  optimizerTitle: 'Dockerfile Server Linter & Optimizer',
  optimizerSubtitle: 'Audit your server\'s Dockerfile for layer caching, non-root security, host binding, and small image footprints.',
  autoOptimizeBtn: 'Auto-Optimize Dockerfile',
  restoreOriginalBtn: 'Restore Original',
  copyBtn: 'Copy',
  copiedBtn: 'Copied!',
  auditReportTitle: 'Production Best Practice Audit',
  auditPassedBadge: 'All 4 Production Checks Passed!',

  // Cheatsheet
  cheatsheetTitle: 'Interactive Docker Commands Cheatsheet',
  searchCommandsPlaceholder: 'Search commands (e.g. port, logs, network, compose)...',
  commandsLabel: 'Commands',
  noMatchingCommands: 'No matching commands found for',

  // Learning Guide
  guideTitle: 'Docker & Server Connection Knowledge Base',
  tryInTerminalBtn: 'Try in Terminal',
};

export default en;
