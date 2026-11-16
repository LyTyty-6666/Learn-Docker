import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  Terminal as TermIcon,
  Radio,
  Server,
  Award,
  Stethoscope,
  FileCode,
  BookOpen,
  BookmarkCheck,
} from 'lucide-react';
import { useDockerSimulator } from './hooks/useDockerSimulator';
import { useResponsive } from './hooks/useResponsive';
import Header from './components/Header';
import Terminal from './components/Terminal';
import Visualizer from './components/Visualizer';
import Labs from './components/Labs';
import Doctor from './components/Doctor';
import DockerfileOptimizer from './components/DockerfileOptimizer';
import LearningGuide from './components/LearningGuide';
import Cheatsheet from './components/Cheatsheet';

export default function App() {
  const [activeTab, setActiveTab] = useState('workspace');
  const [workspaceMode, setWorkspaceMode] = useState('both'); // 'both' | 'terminal' | 'visualizer'
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const {
    containers,
    networks,
    terminalLines,
    executeCommand,
    navigateHistory,
    completedSteps,
    activeLabId,
    setActiveLabId,
    xp,
    setContainers,
  } = useDockerSimulator();

  const runningCount = containers.filter(c => c.status === 'running').length;
  const totalCount = containers.length;

  const handleResetSandbox = () => {
    executeCommand('reset');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#161b22" />

      {/* Main Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        runningCount={runningCount}
        totalCount={totalCount}
        xp={xp}
        onReset={handleResetSandbox}
      />

      {/* Main Content Area */}
      <View style={styles.mainContainer}>
        {/* TAB 1: WORKSPACE (Terminal & Visualizer) */}
        {activeTab === 'workspace' && (
          <View style={styles.workspaceWrapper}>
            {/* View Toggle Bar (Especially handy for mobile/tablet) */}
            <View style={styles.viewToggleBar}>
              <View style={styles.toggleButtonsGroup}>
                {isDesktop && (
                  <TouchableOpacity
                    style={[styles.toggleBtn, workspaceMode === 'both' && styles.toggleBtnActive]}
                    onPress={() => setWorkspaceMode('both')}
                  >
                    <Text style={[styles.toggleBtnText, workspaceMode === 'both' && styles.toggleBtnTextActive]}>
                      Split View (Both)
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.toggleBtn, workspaceMode === 'terminal' && styles.toggleBtnActive]}
                  onPress={() => setWorkspaceMode('terminal')}
                >
                  <TermIcon size={12} color={workspaceMode === 'terminal' ? '#58a6ff' : '#8b949e'} />
                  <Text style={[styles.toggleBtnText, workspaceMode === 'terminal' && styles.toggleBtnTextActive]}>
                    CLI Terminal
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleBtn, workspaceMode === 'visualizer' && styles.toggleBtnActive]}
                  onPress={() => setWorkspaceMode('visualizer')}
                >
                  <Radio size={12} color={workspaceMode === 'visualizer' ? '#58a6ff' : '#8b949e'} />
                  <Text style={[styles.toggleBtnText, workspaceMode === 'visualizer' && styles.toggleBtnTextActive]}>
                    Topology Visualizer ({runningCount})
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.tipHelp}>
                <Text style={styles.tipHelpText}>
                  💡 Run commands in terminal to observe real-time topology and port updates!
                </Text>
              </View>
            </View>

            {/* Split or Single Column Layout */}
            <View style={[
              styles.contentPanesRow,
              (isMobile || workspaceMode !== 'both') && styles.contentPanesColumn
            ]}>
              {(workspaceMode === 'both' || workspaceMode === 'terminal' || isMobile) && (
                <View style={[
                  styles.paneHalf,
                  workspaceMode === 'terminal' && styles.paneFull,
                  isMobile && workspaceMode === 'visualizer' && styles.paneHidden
                ]}>
                  <Terminal
                    terminalLines={terminalLines}
                    onExecuteCommand={executeCommand}
                    onNavigateHistory={navigateHistory}
                    onClear={() => executeCommand('clear')}
                  />
                </View>
              )}

              {(workspaceMode === 'both' || workspaceMode === 'visualizer' || isMobile) && (
                <View style={[
                  styles.paneHalf,
                  workspaceMode === 'visualizer' && styles.paneFull,
                  isMobile && workspaceMode === 'terminal' && styles.paneHidden
                ]}>
                  <Visualizer
                    containers={containers}
                    networks={networks}
                    onExecuteCommand={executeCommand}
                  />
                </View>
              )}
            </View>
          </View>
        )}

        {/* TAB 2: GUIDED LABS */}
        {activeTab === 'labs' && (
          <View style={[styles.contentPanesRow, isMobile && styles.contentPanesColumn]}>
            {!isMobile && (
              <View style={styles.paneHalf}>
                <Terminal
                  terminalLines={terminalLines}
                  onExecuteCommand={executeCommand}
                  onNavigateHistory={navigateHistory}
                  onClear={() => executeCommand('clear')}
                />
              </View>
            )}
            <View style={isMobile ? styles.paneFull : styles.paneHalf}>
              <Labs
                activeLabId={activeLabId}
                setActiveLabId={setActiveLabId}
                completedSteps={completedSteps}
                onExecuteCommand={executeCommand}
              />
            </View>
          </View>
        )}

        {/* TAB 3: DOCKER DOCTOR & SUGGESTIONS */}
        {activeTab === 'doctor' && (
          <View style={[styles.contentPanesRow, isMobile && styles.contentPanesColumn]}>
            {!isMobile && (
              <View style={styles.paneHalf}>
                <Terminal
                  terminalLines={terminalLines}
                  onExecuteCommand={executeCommand}
                  onNavigateHistory={navigateHistory}
                  onClear={() => executeCommand('clear')}
                />
              </View>
            )}
            <View style={isMobile ? styles.paneFull : styles.paneHalf}>
              <Doctor
                containers={containers}
                onExecuteCommand={executeCommand}
              />
            </View>
          </View>
        )}

        {/* TAB 4: DOCKERFILE OPTIMIZER */}
        {activeTab === 'optimizer' && (
          <View style={styles.paneFull}>
            <DockerfileOptimizer onExecuteCommand={executeCommand} />
          </View>
        )}

        {/* TAB 5: VISUAL LEARNING GUIDE */}
        {activeTab === 'guide' && (
          <View style={styles.paneFull}>
            <LearningGuide onExecuteCommand={executeCommand} />
          </View>
        )}

        {/* TAB 6: CHEATSHEET */}
        {activeTab === 'cheatsheet' && (
          <View style={styles.paneFull}>
            <Cheatsheet onExecuteCommand={executeCommand} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0d1117',
    height: '100%',
    width: '100%',
  },
  mainContainer: {
    flex: 1,
    padding: 10,
    overflow: 'hidden',
  },
  workspaceWrapper: {
    flex: 1,
    gap: 8,
  },
  viewToggleBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#161b22',
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
    flexWrap: 'wrap',
    gap: 6,
  },
  toggleButtonsGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#21262d',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  toggleBtnActive: {
    backgroundColor: 'rgba(88, 166, 255, 0.15)',
    borderWidth: 1,
    borderColor: '#58a6ff',
  },
  toggleBtnText: {
    fontSize: 11,
    color: '#8b949e',
    fontWeight: '600',
  },
  toggleBtnTextActive: {
    color: '#58a6ff',
    fontWeight: '700',
  },
  tipHelp: {
    flex: 1,
    alignItems: 'flex-end',
    minWidth: 200,
  },
  tipHelpText: {
    color: '#8b949e',
    fontSize: 11,
  },
  contentPanesRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    overflow: 'hidden',
  },
  contentPanesColumn: {
    flexDirection: 'column',
  },
  paneHalf: {
    flex: 1,
    minHeight: 0,
    overflow: 'hidden',
  },
  paneFull: {
    flex: 1,
    minHeight: 0,
    overflow: 'hidden',
  },
  paneHidden: {
    display: 'none',
  },
});
