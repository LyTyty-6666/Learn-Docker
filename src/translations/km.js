// Khmer (ភាសាខ្មែរ) Translations Dictionary
export const km = {
  // Header & App
  brandTitle: 'DockMaster',
  brandSubtitle: 'វេទិការៀន Docker & Networking អន្តរកម្ម',
  running: 'កំពុងដំណើរការ',
  stopped: 'បានបញ្ឈប់',
  reset: 'កំណត់ឡើងវិញ',
  resetTooltip: 'កំណត់ប្រព័ន្ធ Docker Sandbox ទៅសភាពដើម',
  pro: 'PRO',
  theme: 'ស្បែកពណ៌',
  lightWhiteCream: 'White-Cream ពន្លឺ',
  darkTheme: 'ងងឹត Dark',
  language: 'ភាសា',

  // Tabs
  tabWorkspace: 'ស្ថានីយ CLI & រចនាសម្ព័ន្ធ',
  tabLabs: 'បេសកកម្មអនុវត្ត',
  tabDoctor: 'វិភាគបញ្ហា Docker',
  tabOptimizer: 'វិភាគ Dockerfile',
  tabGuide: 'មេរៀន Docker',
  tabCheatsheet: 'តារាងពាក្យបញ្ជា',
  badge5Labs: '៦ បេសកកម្ម',
  badge6Labs: '៦ បេសកកម្ម',
  badgeAiHelp: 'ជំនួយ AI',

  // Workspace
  splitView: 'ទិដ្ឋភាពភ្លោះ (ទាំងពីរ)',
  cliTerminal: 'ស្ថានីយ CLI',
  topologyVisualizer: 'ផែនទីបណ្តាញ',
  tipHelpText: '💡 វាយពាក្យបញ្ជាក្នុង Terminal ដើម្បីមើលការផ្លាស់ប្តូរបណ្តាញ និង Port ផ្ទាល់ៗ!',

  // Terminal
  termUser: 'root@docker-sandbox: ~ (bash 5.2)',
  termShortcutHint: 'Tab ⇥ បំពេញស្វ័យប្រវត្តិ  •  ↑↓ ប្រវត្តិពាក្យបញ្ជា',
  runBtn: 'ដំណើរការ',
  clearBtn: 'សម្អាត',
  helpBtn: 'ជំនួយ',
  quickCommandsTitle: 'ពាក្យបញ្ជារហ័ស:',
  viewAll: 'មើលទាំងអស់',
  compactView: 'បង្រួមជួរដេក',
  scrollHint: 'រំកិលកង់ Mouse ឬ ◄ ►',
  termInputPlaceholder: 'វាយពាក្យបញ្ជា docker (ឧ. docker ps, docker run...)',

  // Quick command labels
  cmdListRunning: 'មើលកំពុងរត់',
  cmdListAll: 'មើលទាំងអស់',
  cmdRunNginx: 'រត់ Nginx (8080:80)',
  cmdTestWeb: 'តេស្ត Web Server',
  cmdRunRedis: 'រត់ Redis',
  cmdCreateNet: 'បង្កើត Network',
  cmdComposeUp: 'រត់ Compose',
  cmdInspectLogs: 'ពិនិត្យ Logs',
  cmdBuildApp: 'Build App ពីកូដ',
  cmdRunDev: 'ដំណើរការ Live Code (:4000)',
  cmdTestApp: 'តេស្ត App (:4000)',

  // Visualizer
  visualizerTitle: 'ផែនទីតភ្ជាប់បណ្តាញ Docker & Containers ផ្ទាល់',
  tabTopologyMap: 'ផែនទីតភ្ជាប់',
  tabNetworks: 'បណ្តាញ Networks',
  hostMachineZone: 'ម៉ាស៊ីនដើម HOST MACHINE (កុំព្យូទ័ររបស់អ្នក / localhost)',
  hostZoneDesc: 'Port ខាងក្រៅដែលអាចបើកតាម Browser បាន (http://localhost:PORT)',
  noHostPorts: 'មិនទាន់មាន Port ខាងក្រៅត្រូវបានភ្ជាប់ទេ (-p)',
  trafficRouteExplanation: 'ចរាចរណ៍ទិន្នន័យឆ្លងកាត់ Docker Bridge ទៅកាន់កុងតឺន័រ',
  containersZone: 'កុងតឺន័រ DOCKER (DOCKER CONTAINERS)',
  containersZoneDesc: 'កុងតឺន័រដាច់ដោយឡែកកំពុងដំណើរការជាមួយ IP ផ្ទាល់ខ្លួន',
  noContainersRunning: 'មិនទាន់មានកុងតឺន័រណាមួយកំពុងរត់ទេ។ សាកល្បងដំណើរការមួយតាម Terminal ឬប៊ូតុងខាងលើ!',
  quickLaunchNginx: 'ដំណើរការ Nginx រហ័ស (:8080)',
  bridgeNetworkTitle: 'បណ្តាញនិម្មិត Docker Virtual Bridge (docker0) — NAT Port Forwarding',
  testHttpBtn: 'សាកល្បង HTTP',
  inspectBtn: 'ពិនិត្យ',
  logsBtn: 'Logs',
  stopBtn: 'បញ្ឈប់',
  startBtn: 'ដំណើរការ',

  // Guided Labs
  labsTitle: 'បេសកកម្ម & លំហាត់អនុវត្ត Docker',
  missionSteps: 'ជំហានបេសកកម្ម',
  liveTerminal: 'ស្ថានីយ CLI ផ្ទាល់',
  runInTerminal: 'ដំណើរការក្នុង Terminal',
  showHint: 'បង្ហាញជំនួយ',
  hideHint: 'លាក់ជំនួយ',
  hintLabel: '💡 ជំនួយ / គន្លឹះ:',
  xpBonus: 'XP',
  labCompleted: '🎉 អបអរសាទរ! អ្នកបានបញ្ចប់គ្រប់ជំហាននៃបេសកកម្មនេះហើយ!',

  // Docker Doctor
  doctorTitle: 'Docker Doctor & ជំនួយការវិភាគបញ្ហាតភ្ជាប់',
  doctorSubtitle: 'ជ្រើសរើសបញ្ហាដែលជួបប្រទះញឹកញាប់ ឬពិនិត្យ Port ម៉ាស៊ីនរបស់អ្នកដើម្បីទទួលបានដំណោះស្រាយភ្លាមៗ។',
  portDoctorTitle: 'ឧបករណ៍ពិនិត្យ Host Port អន្តរកម្ម',
  portDoctorDesc: 'ឆ្ងល់ថាម៉េចបាន Port មិនដំណើរការ? បញ្ចូលលេខ Host Port ណាមួយដើម្បីពិនិត្យស្ថានភាពក្នុង Docker Sandbox។',
  diagnosePortBtn: 'វិភាគ Port',
  quickTestLabel: 'សាកល្បងរហ័ស:',
  commonIssuesTitle: 'បញ្ហាទូទៅនៃការតភ្ជាប់ Docker & Server',
  symptomLabel: '🚨 រោគសញ្ញាដែលកើតឡើង:',
  rootCausesTitle: 'មូលហេតុដើម & ដំណោះស្រាយភ្លាមៗ:',
  recommendedFixLabel: '💡 ដំណោះស្រាយដែលណែនាំ:',
  antiPatternLabel: '❌ ការសរសេរខុស (បរាជ័យក្នុង Docker)',
  correctSolutionLabel: '✅ ដំណោះស្រាយត្រឹមត្រូវ (ដំណើរការក្នុង Docker)',
  tryFixCmd: 'អនុវត្តដំណោះស្រាយក្នុង Terminal',

  // Dockerfile Optimizer
  optimizerTitle: 'ឧបករណ៍វិភាគ & បង្កើនប្រសិទ្ធភាព Dockerfile',
  optimizerSubtitle: 'ពិនិត្យ Dockerfile របស់ Server អ្នកសម្រាប់ Layer Caching, សុវត្ថិភាព Non-root, និងទំហំតូចបំផុត។',
  autoOptimizeBtn: 'បង្កើនប្រសិទ្ធភាពស្វ័យប្រវត្តិ',
  restoreOriginalBtn: 'ត្រឡប់ទៅកូដដើមវិញ',
  copyBtn: 'ចម្លង',
  copiedBtn: 'បានចម្លង!',
  auditReportTitle: 'របាយការណ៍ត្រួតពិនិត្យស្តង់ដារផលិតកម្ម',
  auditPassedBadge: 'បានឆ្លងកាត់ការត្រួតពិនិត្យទាំង ៤ ដោយជោគជ័យ!',

  // Cheatsheet
  cheatsheetTitle: 'តារាងពាក្យបញ្ជា Docker អន្តរកម្ម',
  searchCommandsPlaceholder: 'ស្វែងរកពាក្យបញ្ជា (ឧ. port, logs, network, compose)...',
  commandsLabel: 'ពាក្យបញ្ជា',
  noMatchingCommands: 'រកមិនឃើញពាក្យបញ្ជាដែលត្រូវនឹង',

  // Learning Guide
  guideTitle: 'ចំណេះដឹង & មេរៀន Docker Connection',
  tryInTerminalBtn: 'សាកល្បងក្នុង Terminal',
};

export default km;
