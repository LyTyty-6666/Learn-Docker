import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import { createStyles } from '../styles/visualizer.styles';
import {
  Server,
  Radio,
  Globe,
  HardDrive,
  Cpu,
  ArrowRight,
  Play,
  Square,
  FileText,
  CheckCircle2,
  XCircle,
  Send,
  X,
  Network,
} from 'lucide-react';
import { useResponsive } from '../hooks/useResponsive';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function Visualizer({
  containers,
  networks,
  onExecuteCommand,
}) {
  const { isDark, colors } = useTheme();
  const { t } = useLanguage();
  const styles = createStyles(colors, isDark);
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
          <Radio size={16} color={colors.primary} />
          <Text style={styles.headerTitle}>{t('visualizerTitle', 'Live Docker Connection & Topology Visualizer')}</Text>
        </View>

        <View style={styles.tabButtons}>
          <TouchableOpacity
            style={[
              styles.modeTab,
              activeTab === 'topology' && styles.modeTabActive
            ]}
            onPress={() => setActiveTab('topology')}
          >
            <Server size={13} color={activeTab === 'topology' ? colors.primary : colors.textMuted} />
            <Text style={[
              styles.modeTabText,
              activeTab === 'topology' && styles.modeTabTextActive
            ]}>
              {t('tabTopologyMap', 'Topology Map')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modeTab,
              activeTab === 'networks' && styles.modeTabActive
            ]}
            onPress={() => setActiveTab('networks')}
          >
            <Network size={13} color={activeTab === 'networks' ? colors.primary : colors.textMuted} />
            <Text style={[
              styles.modeTabText,
              activeTab === 'networks' && styles.modeTabTextActive
            ]}>
              {t('tabNetworks', 'Networks')} ({networks.length})
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
                <Globe size={15} color={colors.primary} />
                <Text style={styles.zoneTitle}>{t('hostMachineZone', 'HOST MACHINE (Your Laptop / localhost)')}</Text>
              </View>
              <Text style={styles.zoneDesc}>
                {t('hostZoneDesc', 'External ports accessible in your web browser (http://localhost:PORT)')}
              </Text>

              {/* Host Ports Grid */}
              <View style={styles.hostPortsGrid}>
                {containers.length === 0 ? (
                  <Text style={styles.emptyText}>{t('noHostPorts', 'No host ports currently published (-p)')}</Text>
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
                        <ArrowRight size={13} color={colors.textMuted} />
                        <View style={styles.portRight}>
                          <Text style={styles.portContainerLabel}>{c.name}</Text>
                          <Text style={styles.portContainerNum}>{p ? `:${p.container}` : 'No Port'}</Text>
                        </View>
                        {p && (
                          <TouchableOpacity
                            style={styles.testBtnSmall}
                            onPress={() => handleTestConnection(c, p)}
                          >
                            <Send size={11} color={colors.primary} />
                            <Text style={styles.testBtnText}>{t('testHttpBtn', 'Test')}</Text>
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
                <Radio size={12} color={colors.success} />
                <Text style={styles.bridgeBadgeText}>{t('bridgeNetworkTitle', 'Docker Virtual Network (docker0 / bridge)')}</Text>
              </View>
              <View style={styles.connectionLine} />
            </View>

            {/* CONTAINERS ZONE */}
            <View style={styles.containersZone}>
              <View style={styles.zoneHeader}>
                <Server size={15} color={colors.success} />
                <Text style={[styles.zoneTitle, styles.zoneTitleSuccess]}>{t('containersZone', 'DOCKER CONTAINERS (Isolated Sandboxes)')}</Text>
              </View>

              {containers.length === 0 ? (
                <View style={styles.emptyCard}>
                  <Server size={32} color={colors.textMuted} />
                  <Text style={styles.emptyCardTitle}>{t('noContainersRunning', 'No Containers Present')}</Text>
                  <Text style={styles.emptyCardSub}>
                    {t('noContainersRunning', 'Run a container in the CLI Terminal to see it appear in real-time!')}
                  </Text>
                  <TouchableOpacity
                    style={styles.quickLaunchBtn}
                    onPress={() => onExecuteCommand('docker run -d -p 8080:80 --name web-server nginx:alpine')}
                  >
                    <Play size={13} color="#ffffff" />
                    <Text style={styles.quickLaunchBtnText}>{t('quickLaunchNginx', 'Launch Nginx Web Server')}</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.containerGrid}>
                  {containers.map(c => {
                    const isRunning = c.status === 'running';
                    const mainPort = c.ports && c.ports[0];
                    return (
                      <View key={c.id} style={[
                        styles.containerCard,
                        !isRunning && styles.containerCardStopped
                      ]}>
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
                          <Text style={styles.portBoxTitle}>{t('portForwardingTitle', 'PORT FORWARDING:')}</Text>
                          {mainPort ? (
                            <View style={styles.portRouteRow}>
                              <Text style={styles.portRouteHost}>localhost:{mainPort.host}</Text>
                              <ArrowRight size={11} color={colors.primary} />
                              <Text style={styles.portRouteContainer}>{mainPort.container}/tcp</Text>
                            </View>
                          ) : (
                            <Text style={styles.noPortsText}>{t('noPortsPublished', 'No ports published (-p)')}</Text>
                          )}
                        </View>

                        {/* Stats mini bar */}
                        <View style={styles.statsMini}>
                          <View style={styles.statMiniItem}>
                            <Cpu size={11} color={colors.textMuted} />
                            <Text style={styles.statMiniText}>CPU {c.stats?.cpu || '0.1%'}</Text>
                          </View>
                          <View style={styles.statMiniItem}>
                            <HardDrive size={11} color={colors.textMuted} />
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
                              <Text style={styles.cardActionBtnPrimaryText}>{t('testHttpBtn', 'Test HTTP')}</Text>
                            </TouchableOpacity>
                          )}

                          <TouchableOpacity
                            style={styles.cardActionBtn}
                            onPress={() => onExecuteCommand(isRunning ? `docker stop ${c.name}` : `docker start ${c.name}`)}
                          >
                            {isRunning ? (
                              <Square size={12} color={colors.danger} />
                            ) : (
                              <Play size={12} color={colors.success} />
                            )}
                            <Text style={styles.cardActionBtnText}>{isRunning ? t('stopBtn', 'Stop') : t('startBtn', 'Start')}</Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={styles.cardActionBtn}
                            onPress={() => onExecuteCommand(`docker logs ${c.name}`)}
                          >
                            <FileText size={12} color={colors.textMuted} />
                            <Text style={styles.cardActionBtnText}>{t('logsBtn', 'Logs')}</Text>
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
            <Text style={styles.sectionTitle}>{t('tabNetworks', 'Docker Virtual Networks')}</Text>
            <Text style={styles.sectionSub}>
              {t('networksSub', 'Custom networks provide automatic DNS name resolution between containers.')}
            </Text>

            <View style={styles.networkList}>
              {networks.map(net => {
                const attachedContainers = containers.filter(c => c.network === net.name);
                return (
                  <View key={net.id} style={styles.networkCard}>
                    <View style={styles.netHeader}>
                      <View style={styles.netTitleGroup}>
                        <Network size={16} color={colors.primary} />
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
                              <Server size={11} color={colors.success} />
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
                    <CheckCircle2 size={18} color={colors.success} />
                  ) : (
                    <XCircle size={18} color={colors.danger} />
                  )}
                  <Text style={styles.modalTitle}>
                    HTTP Test Result: {testResult.status}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setTestResult(null)}>
                  <X size={18} color={colors.textMuted} />
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
