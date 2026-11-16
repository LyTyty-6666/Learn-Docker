import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
} from 'react-native';
import {
  Server,
  Radio,
  Globe,
  HardDrive,
  Cpu,
  ArrowRight,
  ExternalLink,
  Play,
  Square,
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Send,
  X,
  Network,
} from 'lucide-react';
import { useResponsive } from '../hooks/useResponsive';

export default function Visualizer({
  containers,
  networks,
  onExecuteCommand,
}) {
  const { isMobile } = useResponsive();
  const [selectedContainer, setSelectedContainer] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [activeTab, setActiveTab] = useState('topology'); // 'topology' | 'networks'

  const handleTestConnection = (container, port) => {
    if (container.status !== 'running') {
      setTestResult({
        success: false,
        container: container.name,
        port: port.host,
        status: 'CONNECTION_REFUSED',
        message: `Container "${container.name}" is STOPPED. Requests to localhost:${port.host} will fail.`,
        tip: `Run "docker start ${container.name}" to bring it back online.`,
      });
      return;
    }

    if (!port || !port.host) {
      setTestResult({
        success: false,
        container: container.name,
        port: null,
        status: 'NO_PORT_MAPPING',
        message: `Container "${container.name}" is running, but no host port was published (-p).`,
        tip: `Docker containers are isolated. You must pass "-p <host_port>:<container_port>" to expose it.`,
      });
      return;
    }

    // Success response simulation
    let body = '';
    if (container.image.includes('nginx')) {
      body = `<!DOCTYPE html>\n<html>\n<head><title>Welcome to Nginx!</title></head>\n<body>\n  <h1>Welcome to Nginx on Docker!</h1>\n  <p>If you see this page, the Docker container port mapping is working properly.</p>\n</body>\n</html>`;
    } else if (container.image.includes('node')) {
      body = JSON.stringify({
        status: 'online',
        uptime: '284s',
        framework: 'Express.js',
        environment: 'production',
        message: 'Node.js API Container successfully responded!',
      }, null, 2);
    } else if (container.image.includes('python')) {
      body = JSON.stringify({
        message: 'Hello from Python FastAPI inside Docker',
        docs: '/docs',
        status: 'healthy',
      }, null, 2);
    } else {
      body = `HTTP/1.1 200 OK\nContainer: ${container.name}\nImage: ${container.image}\nStatus: Active`;
    }

    setTestResult({
      success: true,
      container: container.name,
      port: port.host,
      internalPort: port.container,
      status: '200 OK',
      ip: container.ip,
      body,
      tip: `Traffic routed from Host (localhost:${port.host}) through Docker bridge (${container.ip}) to Container Port ${port.container}.`,
    });
  };

  return (
    <View style={styles.container}>
      {/* Header bar */}
      <View style={styles.visualHeader}>
        <View style={styles.headerTitleRow}>
          <Radio size={16} color="#58a6ff" />
          <Text style={styles.headerTitle}>Live Docker Connection & Topology Visualizer</Text>
        </View>

        <View style={styles.tabButtons}>
          <TouchableOpacity
            style={[styles.modeTab, activeTab === 'topology' && styles.modeTabActive]}
            onPress={() => setActiveTab('topology')}
          >
            <Server size={13} color={activeTab === 'topology' ? '#58a6ff' : '#8b949e'} />
            <Text style={[styles.modeTabText, activeTab === 'topology' && styles.modeTabTextActive]}>
              Topology Map
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeTab, activeTab === 'networks' && styles.modeTabActive]}
            onPress={() => setActiveTab('networks')}
          >
            <Network size={13} color={activeTab === 'networks' ? '#58a6ff' : '#8b949e'} />
            <Text style={[styles.modeTabText, activeTab === 'networks' && styles.modeTabTextActive]}>
              Networks ({networks.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Visualizer Content */}
      <ScrollView style={styles.visualScroll} contentContainerStyle={styles.visualScrollContent}>
        {activeTab === 'topology' ? (
          <View style={styles.topologyWrapper}>
            {/* HOST MACHINE ZONE */}
            <View style={styles.hostZone}>
              <View style={styles.zoneHeader}>
                <Globe size={15} color="#58a6ff" />
                <Text style={styles.zoneTitle}>HOST MACHINE (Your Laptop / localhost)</Text>
              </View>
              <Text style={styles.zoneDesc}>
                External web browser & host requests enter here. Docker proxy intercepts mapped ports.
              </Text>

              {/* Host Ports Grid */}
              <View style={styles.hostPortsGrid}>
                {containers.length === 0 ? (
                  <Text style={styles.emptyText}>No containers running or mapped.</Text>
                ) : (
                  containers.map(c => {
                    const hasPort = c.ports && c.ports.length > 0;
                    const p = hasPort ? c.ports[0] : null;
                    return (
                      <View key={c.id} style={styles.portPill}>
                        <View style={styles.portLeft}>
                          <Text style={styles.portHostLabel}>HOST PORT</Text>
                          <Text style={styles.portHostNum}>{p ? `:${p.host}` : 'Unbound'}</Text>
                        </View>
                        <ArrowRight size={13} color="#8b949e" />
                        <View style={styles.portRight}>
                          <Text style={styles.portContainerLabel}>{c.name}</Text>
                          <Text style={styles.portContainerNum}>{p ? `:${p.container}` : 'No Port'}</Text>
                        </View>
                        {p && (
                          <TouchableOpacity
                            style={styles.testBtnSmall}
                            onPress={() => handleTestConnection(c, p)}
                          >
                            <Send size={11} color="#58a6ff" />
                            <Text style={styles.testBtnText}>Test</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    );
                  })
                )}
              </View>
            </View>

            {/* DOCKER BRIDGE CONNECTOR */}
            <View style={styles.connectorSection}>
              <View style={styles.connectionLine} />
              <View style={styles.bridgeBadge}>
                <Radio size={12} color="#3fb950" />
                <Text style={styles.bridgeBadgeText}>Docker Virtual Network (docker0 / bridge)</Text>
              </View>
              <View style={styles.connectionLine} />
            </View>

            {/* CONTAINERS ZONE */}
            <View style={styles.containersZone}>
              <View style={styles.zoneHeader}>
                <Server size={15} color="#3fb950" />
                <Text style={styles.zoneTitle}>DOCKER CONTAINERS (Isolated Sandboxes)</Text>
              </View>

              {containers.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Server size={32} color="#30363d" />
                  <Text style={styles.emptyCardTitle}>No Containers Present</Text>
                  <Text style={styles.emptyCardSub}>
                    Run a container in the CLI Terminal to see it appear in real-time!
                  </Text>
                  <TouchableOpacity
                    style={styles.quickLaunchBtn}
                    onPress={() => onExecuteCommand('docker run -d -p 8080:80 --name web-server nginx:alpine')}
                  >
                    <Play size={13} color="#ffffff" />
                    <Text style={styles.quickLaunchBtnText}>Launch Nginx Web Server</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.containerGrid}>
                  {containers.map(c => {
                    const isRunning = c.status === 'running';
                    const mainPort = c.ports && c.ports[0];
                    return (
                      <View key={c.id} style={[styles.containerCard, !isRunning && styles.containerCardStopped]}>
                        {/* Container Card Header */}
                        <View style={styles.cardHeader}>
                          <View style={styles.cardTitleGroup}>
                            <View style={[styles.statusIndicator, isRunning ? styles.statusGreen : styles.statusRed]} />
                            <Text style={styles.containerNameText}>{c.name}</Text>
                          </View>
                          <View style={styles.idBadge}>
                            <Text style={styles.idBadgeText}>{c.id.substring(0, 7)}</Text>
                          </View>
                        </View>

                        {/* Image & IP */}
                        <View style={styles.metaRow}>
                          <Text style={styles.metaLabel}>Image:</Text>
                          <Text style={styles.metaValue}>{c.image}</Text>
                        </View>
                        <View style={styles.metaRow}>
                          <Text style={styles.metaLabel}>IP Address:</Text>
                          <Text style={styles.metaValue}>{c.ip || '172.17.0.2'}</Text>
                        </View>
                        <View style={styles.metaRow}>
                          <Text style={styles.metaLabel}>Network:</Text>
                          <Text style={styles.metaValueHighlight}>{c.network || 'bridge'}</Text>
                        </View>

                        {/* Ports Mapping Display */}
                        <View style={styles.portBox}>
                          <Text style={styles.portBoxTitle}>PORT FORWARDING:</Text>
                          {mainPort ? (
                            <View style={styles.portRouteRow}>
                              <Text style={styles.portRouteHost}>localhost:{mainPort.host}</Text>
                              <ArrowRight size={11} color="#58a6ff" />
                              <Text style={styles.portRouteContainer}>{mainPort.container}/tcp</Text>
                            </View>
                          ) : (
                            <Text style={styles.noPortsText}>No ports published (-p)</Text>
                          )}
                        </View>

                        {/* Stats mini bar */}
                        <View style={styles.statsMini}>
                          <View style={styles.statMiniItem}>
                            <Cpu size={11} color="#8b949e" />
                            <Text style={styles.statMiniText}>CPU {c.stats?.cpu || '0.1%'}</Text>
                          </View>
                          <View style={styles.statMiniItem}>
                            <HardDrive size={11} color="#8b949e" />
                            <Text style={styles.statMiniText}>RAM {c.stats?.mem?.split('/')[0] || '14MB'}</Text>
                          </View>
                        </View>

                        {/* Actions */}
                        <View style={styles.cardActions}>
                          {mainPort && (
                            <TouchableOpacity
                              style={styles.cardActionBtnPrimary}
                              onPress={() => handleTestConnection(c, mainPort)}
                            >
                              <Send size={12} color="#ffffff" />
                              <Text style={styles.cardActionBtnPrimaryText}>Test HTTP</Text>
                            </TouchableOpacity>
                          )}

                          <TouchableOpacity
                            style={styles.cardActionBtn}
                            onPress={() => onExecuteCommand(isRunning ? `docker stop ${c.name}` : `docker start ${c.name}`)}
                          >
                            {isRunning ? (
                              <Square size={12} color="#f85149" />
                            ) : (
                              <Play size={12} color="#3fb950" />
                            )}
                            <Text style={styles.cardActionBtnText}>{isRunning ? 'Stop' : 'Start'}</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={styles.cardActionBtn}
                            onPress={() => onExecuteCommand(`docker logs ${c.name}`)}
                          >
                            <FileText size={12} color="#8b949e" />
                            <Text style={styles.cardActionBtnText}>Logs</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          </View>
        ) : (
          /* NETWORKS TAB */
          <View style={styles.networksWrapper}>
            <Text style={styles.sectionTitle}>Docker Virtual Networks</Text>
            <Text style={styles.sectionSub}>
              Custom networks provide automatic DNS name resolution between containers.
            </Text>

            <View style={styles.networkList}>
              {networks.map(net => {
                const attachedContainers = containers.filter(c => c.network === net.name);
                return (
                  <View key={net.id} style={styles.networkCard}>
                    <View style={styles.netHeader}>
                      <View style={styles.netTitleGroup}>
                        <Network size={16} color="#58a6ff" />
                        <Text style={styles.netNameText}>{net.name}</Text>
                        {net.isDefault && (
                          <View style={styles.defaultPill}>
                            <Text style={styles.defaultPillText}>DEFAULT</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.netDriverText}>Driver: {net.driver}</Text>
                    </View>

                    <View style={styles.netMetaGrid}>
                      <View>
                        <Text style={styles.netMetaKey}>Subnet:</Text>
                        <Text style={styles.netMetaVal}>{net.subnet}</Text>
                      </View>
                      <View>
                        <Text style={styles.netMetaKey}>Gateway:</Text>
                        <Text style={styles.netMetaVal}>{net.gateway}</Text>
                      </View>
                    </View>

                    {/* Attached containers */}
                    <View style={styles.attachedBox}>
                      <Text style={styles.attachedTitle}>
                        Connected Containers ({attachedContainers.length}):
                      </Text>
                      {attachedContainers.length === 0 ? (
                        <Text style={styles.attachedEmpty}>None attached</Text>
                      ) : (
                        <View style={styles.attachedChips}>
                          {attachedContainers.map(c => (
                            <View key={c.id} style={styles.attachedChip}>
                              <Server size={11} color="#3fb950" />
                              <Text style={styles.attachedChipText}>{c.name}</Text>
                              <Text style={styles.attachedChipIp}>({c.ip})</Text>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>

      {/* HTTP Connection Test Modal / Result Dialog */}
      {testResult && (
        <Modal visible={true} transparent={true} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <View style={styles.modalHeader}>
                <View style={styles.modalTitleRow}>
                  {testResult.success ? (
                    <CheckCircle2 size={18} color="#3fb950" />
                  ) : (
                    <XCircle size={18} color="#f85149" />
                  )}
                  <Text style={styles.modalTitle}>
                    HTTP Test Result: {testResult.status}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setTestResult(null)}>
                  <X size={18} color="#8b949e" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody}>
                <View style={styles.modalMetaRow}>
                  <Text style={styles.modalMetaLabel}>Target Endpoint:</Text>
                  <Text style={styles.modalMetaCode}>
                    http://localhost:{testResult.port}
                  </Text>
                </View>
                <View style={styles.modalMetaRow}>
                  <Text style={styles.modalMetaLabel}>Destination Container:</Text>
                  <Text style={styles.modalMetaCode}>
                    {testResult.container} (internal port {testResult.internalPort})
                  </Text>
                </View>

                {testResult.body && (
                  <View style={styles.bodyBox}>
                    <Text style={styles.bodyBoxLabel}>Response Body:</Text>
                    <Text style={styles.bodyBoxText}>{testResult.body}</Text>
                  </View>
                )}

                {testResult.message && (
                  <Text style={styles.errorMsgText}>{testResult.message}</Text>
                )}

                <View style={styles.doctorTipBox}>
                  <Text style={styles.doctorTipTitle}>💡 DockMaster Explanation:</Text>
                  <Text style={styles.doctorTipText}>{testResult.tip}</Text>
                </View>
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.closeModalBtn}
                  onPress={() => setTestResult(null)}
                >
                  <Text style={styles.closeModalBtnText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1117',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#30363d',
    overflow: 'hidden',
  },
  visualHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#161b22',
    borderBottomWidth: 1,
    borderBottomColor: '#30363d',
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexWrap: 'wrap',
    gap: 8,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    color: '#f0f6fc',
    fontSize: 13,
    fontWeight: '700',
  },
  tabButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  modeTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#21262d',
    gap: 4,
  },
  modeTabActive: {
    backgroundColor: 'rgba(88, 166, 255, 0.15)',
    borderWidth: 1,
    borderColor: '#58a6ff',
  },
  modeTabText: {
    fontSize: 11,
    color: '#8b949e',
    fontWeight: '600',
  },
  modeTabTextActive: {
    color: '#58a6ff',
  },
  visualScroll: {
    flex: 1,
  },
  visualScrollContent: {
    padding: 12,
    gap: 12,
  },
  topologyWrapper: {
    gap: 12,
  },
  hostZone: {
    backgroundColor: '#161b22',
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 8,
    padding: 12,
  },
  zoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  zoneTitle: {
    color: '#58a6ff',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  zoneDesc: {
    color: '#8b949e',
    fontSize: 11,
    marginBottom: 10,
  },
  hostPortsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  emptyText: {
    color: '#8b949e',
    fontSize: 11,
    fontStyle: 'italic',
  },
  portPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#21262d',
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
    gap: 8,
  },
  portLeft: {
    alignItems: 'flex-start',
  },
  portHostLabel: {
    fontSize: 8,
    color: '#8b949e',
    fontWeight: '700',
  },
  portHostNum: {
    fontSize: 12,
    color: '#3fb950',
    fontWeight: '700',
    fontFamily: 'Fira Code, monospace',
  },
  portRight: {
    alignItems: 'flex-start',
  },
  portContainerLabel: {
    fontSize: 9,
    color: '#c9d1d9',
    fontWeight: '600',
  },
  portContainerNum: {
    fontSize: 11,
    color: '#58a6ff',
    fontFamily: 'Fira Code, monospace',
  },
  testBtnSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(88, 166, 255, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    gap: 3,
  },
  testBtnText: {
    color: '#58a6ff',
    fontSize: 10,
    fontWeight: '700',
  },
  connectorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  connectionLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#30363d',
  },
  bridgeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161b22',
    borderWidth: 1,
    borderColor: '#30363d',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  bridgeBadgeText: {
    color: '#8b949e',
    fontSize: 11,
    fontWeight: '600',
  },
  containersZone: {
    backgroundColor: '#161b22',
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 8,
    padding: 12,
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    gap: 8,
  },
  emptyCardTitle: {
    color: '#f0f6fc',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyCardSub: {
    color: '#8b949e',
    fontSize: 12,
    textAlign: 'center',
    maxWidth: 320,
  },
  quickLaunchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#238636',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6,
    gap: 6,
    marginTop: 6,
  },
  quickLaunchBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  containerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  containerCard: {
    flex: 1,
    minWidth: 260,
    backgroundColor: '#21262d',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#30363d',
    padding: 12,
    gap: 6,
  },
  containerCardStopped: {
    opacity: 0.65,
    borderColor: '#484f58',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#30363d',
    paddingBottom: 6,
  },
  cardTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusGreen: {
    backgroundColor: '#3fb950',
    boxShadow: '0 0 6px rgba(63, 185, 80, 0.7)',
  },
  statusRed: {
    backgroundColor: '#f85149',
  },
  containerNameText: {
    color: '#f0f6fc',
    fontSize: 13,
    fontWeight: '700',
  },
  idBadge: {
    backgroundColor: '#161b22',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  idBadgeText: {
    color: '#8b949e',
    fontSize: 10,
    fontFamily: 'Fira Code, monospace',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 11,
  },
  metaLabel: {
    color: '#8b949e',
    fontSize: 11,
  },
  metaValue: {
    color: '#c9d1d9',
    fontSize: 11,
    fontFamily: 'Fira Code, monospace',
  },
  metaValueHighlight: {
    color: '#58a6ff',
    fontSize: 11,
    fontWeight: '600',
  },
  portBox: {
    backgroundColor: '#161b22',
    padding: 6,
    borderRadius: 6,
    marginTop: 4,
  },
  portBoxTitle: {
    color: '#8b949e',
    fontSize: 9,
    fontWeight: '700',
    marginBottom: 2,
  },
  portRouteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  portRouteHost: {
    color: '#3fb950',
    fontSize: 11,
    fontFamily: 'Fira Code, monospace',
    fontWeight: '700',
  },
  portRouteContainer: {
    color: '#58a6ff',
    fontSize: 11,
    fontFamily: 'Fira Code, monospace',
  },
  noPortsText: {
    color: '#8b949e',
    fontSize: 11,
    fontStyle: 'italic',
  },
  statsMini: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 4,
  },
  statMiniItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statMiniText: {
    color: '#8b949e',
    fontSize: 10,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  cardActionBtnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1f6feb',
    paddingVertical: 5,
    borderRadius: 4,
    gap: 4,
  },
  cardActionBtnPrimaryText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  cardActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#161b22',
    borderWidth: 1,
    borderColor: '#30363d',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 4,
    gap: 4,
  },
  cardActionBtnText: {
    color: '#c9d1d9',
    fontSize: 11,
    fontWeight: '600',
  },
  networksWrapper: {
    gap: 10,
  },
  sectionTitle: {
    color: '#f0f6fc',
    fontSize: 15,
    fontWeight: '700',
  },
  sectionSub: {
    color: '#8b949e',
    fontSize: 12,
    marginBottom: 8,
  },
  networkList: {
    gap: 10,
  },
  networkCard: {
    backgroundColor: '#161b22',
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  netHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  netTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  netNameText: {
    color: '#f0f6fc',
    fontSize: 14,
    fontWeight: '700',
  },
  defaultPill: {
    backgroundColor: '#21262d',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultPillText: {
    color: '#8b949e',
    fontSize: 9,
    fontWeight: '700',
  },
  netDriverText: {
    color: '#8b949e',
    fontSize: 11,
  },
  netMetaGrid: {
    flexDirection: 'row',
    gap: 20,
    backgroundColor: '#21262d',
    padding: 8,
    borderRadius: 6,
  },
  netMetaKey: {
    color: '#8b949e',
    fontSize: 10,
  },
  netMetaVal: {
    color: '#c9d1d9',
    fontSize: 12,
    fontFamily: 'Fira Code, monospace',
  },
  attachedBox: {
    gap: 4,
  },
  attachedTitle: {
    color: '#8b949e',
    fontSize: 11,
    fontWeight: '600',
  },
  attachedEmpty: {
    color: '#6e7681',
    fontSize: 11,
    fontStyle: 'italic',
  },
  attachedChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  attachedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#21262d',
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 4,
  },
  attachedChipText: {
    color: '#f0f6fc',
    fontSize: 11,
    fontWeight: '600',
  },
  attachedChipIp: {
    color: '#8b949e',
    fontSize: 10,
    fontFamily: 'Fira Code, monospace',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalBox: {
    backgroundColor: '#161b22',
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 8,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#30363d',
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    color: '#f0f6fc',
    fontSize: 14,
    fontWeight: '700',
  },
  modalBody: {
    padding: 14,
  },
  modalMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  modalMetaLabel: {
    color: '#8b949e',
    fontSize: 12,
  },
  modalMetaCode: {
    color: '#58a6ff',
    fontFamily: 'Fira Code, monospace',
    fontSize: 12,
  },
  bodyBox: {
    backgroundColor: '#0d1117',
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 6,
    padding: 10,
    marginVertical: 10,
  },
  bodyBoxLabel: {
    color: '#8b949e',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  bodyBoxText: {
    color: '#3fb950',
    fontFamily: 'Fira Code, monospace',
    fontSize: 12,
  },
  errorMsgText: {
    color: '#f85149',
    fontSize: 13,
    fontWeight: '600',
    marginVertical: 8,
  },
  doctorTipBox: {
    backgroundColor: 'rgba(227, 179, 65, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(227, 179, 65, 0.3)',
    borderRadius: 6,
    padding: 10,
    marginTop: 6,
  },
  doctorTipTitle: {
    color: '#e3b341',
    fontWeight: '700',
    fontSize: 12,
    marginBottom: 2,
  },
  doctorTipText: {
    color: '#c9d1d9',
    fontSize: 11,
    lineHeight: 16,
  },
  modalFooter: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#30363d',
    alignItems: 'flex-end',
  },
  closeModalBtn: {
    backgroundColor: '#21262d',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  closeModalBtnText: {
    color: '#f0f6fc',
    fontSize: 12,
    fontWeight: '600',
  },
});
