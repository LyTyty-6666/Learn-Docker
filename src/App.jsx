import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { createStyles } from './styles/app.styles';
import {
  Terminal as TermIcon,
  Radio,
  Award,
  Stethoscope,
} from 'lucide-react';
import { useDockerSimulator } from './hooks/useDockerSimulator';
import { useResponsive } from './hooks/useResponsive';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import Header from './components/Header';
import Terminal from './components/Terminal';
import Visualizer from './components/Visualizer';
import Labs from './components/Labs';
import Doctor from './components/Doctor';
import DockerfileOptimizer from './components/DockerfileOptimizer';
import LearningGuide from './components/LearningGuide';
import Cheatsheet from './components/Cheatsheet';

function AppContent() {
  const [activeTab, setActiveTab] = useState('workspace');
  const { isMobile, isDesktop } = useResponsive();
  const [workspaceMode, setWorkspaceMode] = useState(isMobile ? 'terminal' : 'both');
  const [mobileLabsTab, setMobileLabsTab] = useState('labs');
  const [mobileDoctorTab, setMobileDoctorTab] = useState('doctor');

  const { isDark, colors } = useTheme();
  const { t } = useLanguage();
  const styles = createStyles(colors, isDark);

  // Sync workspace mode when transitioning between mobile and desktop
  React.useEffect(() => {
    if (isMobile && workspaceMode === 'both') {
      setWorkspaceMode('terminal');
    } else if (isDesktop && workspaceMode === 'terminal') {
      setWorkspaceMode('both');
    }
  }, [isMobile, isDesktop]);

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
  } = useDockerSimulator();

  const runningCount = containers.filter(c => c.status === 'running').length;
  const totalCount = containers.length;

  const handleResetSandbox = () => {
    executeCommand('reset');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.headerBg} />

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
            {/* View Toggle Bar */}
            <View style={styles.viewToggleBar}>
              <View style={styles.toggleButtonsGroup}>
                {isDesktop && (
                  <TouchableOpacity
                    style={[
                      styles.toggleBtn,
                      workspaceMode === 'both' && styles.toggleBtnActive
                    ]}
                    onPress={() => setWorkspaceMode('both')}
                  >
                    <Text style={[
                      styles.toggleBtnText,
                      workspaceMode === 'both' && styles.toggleBtnTextActive
                    ]}>
                      {t('splitView', 'Split View (Both)')}
                    </Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[
                    styles.toggleBtn,
                    workspaceMode === 'terminal' && styles.toggleBtnActive
                  ]}
                  onPress={() => setWorkspaceMode('terminal')}
                >
                  <TermIcon size={12} color={workspaceMode === 'terminal' ? colors.primary : colors.textMuted} />
                  <Text style={[
                    styles.toggleBtnText,
                    workspaceMode === 'terminal' && styles.toggleBtnTextActive
                  ]}>
                    {t('cliTerminal', 'CLI Terminal')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleBtn,
                    workspaceMode === 'visualizer' && styles.toggleBtnActive
                  ]}
                  onPress={() => setWorkspaceMode('visualizer')}
                >
                  <Radio size={12} color={workspaceMode === 'visualizer' ? colors.primary : colors.textMuted} />
                  <Text style={[
                    styles.toggleBtnText,
                    workspaceMode === 'visualizer' && styles.toggleBtnTextActive
                  ]}>
                    {t('topologyVisualizer', 'Topology Visualizer')} ({runningCount})
                  </Text>
                </TouchableOpacity>
              </View>

              {!isMobile && (
                <View style={styles.tipHelp}>
                  <Text style={styles.tipHelpText}>
                    {t('tipHelpText', '💡 Run commands in terminal to observe real-time topology and port updates!')}
                  </Text>
                </View>
              )}
            </View>

            {/* Split or Single Column Layout */}
            <View style={[
              styles.contentPanesRow,
              (isMobile || workspaceMode !== 'both') && styles.contentPanesColumn
            ]}>
              {(workspaceMode === 'both' || workspaceMode === 'terminal') && (
                <View style={[
                  styles.paneHalf,
                  workspaceMode === 'terminal' && styles.paneFull,
                ]}>
                  <Terminal
                    terminalLines={terminalLines}
                    onExecuteCommand={executeCommand}
                    onNavigateHistory={navigateHistory}
                    onClear={() => executeCommand('clear')}
                  />
                </View>
              )}

              {(workspaceMode === 'both' || workspaceMode === 'visualizer') && (
                <View style={[
                  styles.paneHalf,
                  workspaceMode === 'visualizer' && styles.paneFull,
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
          <View style={styles.tabFlexWrapper}>
            {isMobile && (
              <View style={styles.mobileSubNav}>
                <TouchableOpacity
                  style={[
                    styles.mobileSubBtn,
                    mobileLabsTab === 'labs' && styles.mobileSubBtnActive
                  ]}
                  onPress={() => setMobileLabsTab('labs')}
                >
                  <Award size={13} color={mobileLabsTab === 'labs' ? colors.primary : colors.textMuted} />
                  <Text style={[
                    styles.mobileSubBtnText,
                    mobileLabsTab === 'labs' && styles.mobileSubBtnTextActive
                  ]}>
                    {t('missionSteps', 'Mission Steps')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.mobileSubBtn,
                    mobileLabsTab === 'terminal' && styles.mobileSubBtnActive
                  ]}
                  onPress={() => setMobileLabsTab('terminal')}
                >
                  <TermIcon size={13} color={mobileLabsTab === 'terminal' ? colors.primary : colors.textMuted} />
                  <Text style={[
                    styles.mobileSubBtnText,
                    mobileLabsTab === 'terminal' && styles.mobileSubBtnTextActive
                  ]}>
                    {t('liveTerminal', 'Live Terminal')}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={[styles.contentPanesRow, isMobile && styles.contentPanesColumn]}>
              {(!isMobile || mobileLabsTab === 'terminal') && (
                <View style={isMobile ? styles.paneFull : styles.paneHalf}>
                  <Terminal
                    terminalLines={terminalLines}
                    onExecuteCommand={executeCommand}
                    onNavigateHistory={navigateHistory}
                    onClear={() => executeCommand('clear')}
                  />
                </View>
              )}
              {(!isMobile || mobileLabsTab === 'labs') && (
                <View style={isMobile ? styles.paneFull : styles.paneHalf}>
                  <Labs
                    activeLabId={activeLabId}
                    setActiveLabId={setActiveLabId}
                    completedSteps={completedSteps}
                    onExecuteCommand={executeCommand}
                  />
                </View>
              )}
            </View>
          </View>
        )}

        {/* TAB 3: DOCKER DOCTOR & SUGGESTIONS */}
        {activeTab === 'doctor' && (
          <View style={styles.tabFlexWrapper}>
            {isMobile && (
              <View style={styles.mobileSubNav}>
                <TouchableOpacity
                  style={[
                    styles.mobileSubBtn,
                    mobileDoctorTab === 'doctor' && styles.mobileSubBtnActive
                  ]}
                  onPress={() => setMobileDoctorTab('doctor')}
                >
                  <Stethoscope size={13} color={mobileDoctorTab === 'doctor' ? colors.primary : colors.textMuted} />
                  <Text style={[
                    styles.mobileSubBtnText,
                    mobileDoctorTab === 'doctor' && styles.mobileSubBtnTextActive
                  ]}>
                    {t('tabDoctor', 'Diagnostic Advisor')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.mobileSubBtn,
                    mobileDoctorTab === 'terminal' && styles.mobileSubBtnActive
                  ]}
                  onPress={() => setMobileDoctorTab('terminal')}
                >
                  <TermIcon size={13} color={mobileDoctorTab === 'terminal' ? colors.primary : colors.textMuted} />
                  <Text style={[
                    styles.mobileSubBtnText,
                    mobileDoctorTab === 'terminal' && styles.mobileSubBtnTextActive
                  ]}>
                    {t('liveTerminal', 'Live Terminal')}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={[styles.contentPanesRow, isMobile && styles.contentPanesColumn]}>
              {(!isMobile || mobileDoctorTab === 'terminal') && (
                <View style={isMobile ? styles.paneFull : styles.paneHalf}>
                  <Terminal
                    terminalLines={terminalLines}
                    onExecuteCommand={executeCommand}
                    onNavigateHistory={navigateHistory}
                    onClear={() => executeCommand('clear')}
                  />
                </View>
              )}
              {(!isMobile || mobileDoctorTab === 'doctor') && (
                <View style={isMobile ? styles.paneFull : styles.paneHalf}>
                  <Doctor
                    containers={containers}
                    onExecuteCommand={executeCommand}
                  />
                </View>
              )}
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

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}
