import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import {
  Stethoscope,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Play,
  ArrowRight,
  Code,
  Zap,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { DIAGNOSTIC_ISSUES } from '../data/doctorData';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function Doctor({
  containers,
  onExecuteCommand,
}) {
  const { colors, isDark } = useTheme();
  const { t } = useLanguage();
  const [selectedIssueId, setSelectedIssueId] = useState(DIAGNOSTIC_ISSUES[0].id);
  const [testPortInput, setTestPortInput] = useState('8080');
  const [portDiagnosis, setPortDiagnosis] = useState(null);

  const activeIssue = DIAGNOSTIC_ISSUES.find(i => i.id === selectedIssueId) || DIAGNOSTIC_ISSUES[0];

  const handleDiagnosePort = () => {
    const p = parseInt(testPortInput, 10);
    if (!p) return;

    const matchedContainer = containers.find(c =>
      c.ports && c.ports.some(cp => cp.host === p)
    );

    if (!matchedContainer) {
      setPortDiagnosis({
        status: 'error',
        title: `No Container Bound to Port ${p}`,
        explanation: `Requests to http://localhost:${p} will trigger ERR_CONNECTION_REFUSED because no active Docker container published this port.`,
        fixCmd: `docker run -d -p ${p}:80 --name web-server nginx:alpine`,
        fixDesc: `Run a container explicitly mapping host port ${p}.`,
      });
    } else if (matchedContainer.status !== 'running') {
      setPortDiagnosis({
        status: 'warning',
        title: `Container "${matchedContainer.name}" is Stopped!`,
        explanation: `Host port ${p} belongs to container "${matchedContainer.name}", but the container is currently stopped (offline).`,
        fixCmd: `docker start ${matchedContainer.name}`,
        fixDesc: `Start the stopped container to open the port.`,
      });
    } else {
      setPortDiagnosis({
        status: 'success',
        title: `Healthy Connection on Port ${p}!`,
        explanation: `Container "${matchedContainer.name}" is actively listening and forwarding requests to internal port ${matchedContainer.ports[0].container}.`,
        fixCmd: `curl http://localhost:${p}`,
        fixDesc: `Test the HTTP response with curl.`,
      });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
      {/* Header */}
      <View style={[styles.doctorHeader, { backgroundColor: colors.cardSubBg, borderBottomColor: colors.cardBorder }]}>
        <View style={styles.headerTitleRow}>
          <Stethoscope size={18} color={colors.primary} />
          <Text style={[styles.headerTitleText, { color: colors.text }]}>{t('doctorTitle', 'Docker Doctor & Connection Diagnostic Advisor')}</Text>
        </View>
        <Text style={[styles.headerSubtitleText, { color: colors.textMuted }]}>
          {t('doctorSubtitle', 'Select a common Docker server problem or diagnose your running ports to get instant actionable suggestions.')}
        </Text>
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        {/* Quick Port Diagnostic Doctor Tool */}
        <View style={[styles.portDoctorBox, { backgroundColor: colors.cardSubBg, borderColor: colors.cardBorder }]}>
          <View style={styles.portDoctorHeader}>
            <Zap size={15} color={colors.warning} />
            <Text style={[styles.portDoctorTitle, { color: colors.text }]}>{t('portDoctorTitle', 'Interactive Host Port Inspector')}</Text>
          </View>
          <Text style={[styles.portDoctorDesc, { color: colors.textMuted }]}>
            {t('portDoctorDesc', "Wondering why a port isn't connecting? Enter any host port to diagnose its status against your Docker sandbox.")}
          </Text>

          <View style={[styles.portInputRow, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
            <Text style={[styles.portInputPrefix, { color: colors.textMuted }]}>http://localhost:</Text>
            <TextInput
              style={[styles.portInput, { color: colors.text }]}
              value={testPortInput}
              onChangeText={setTestPortInput}
              onSubmitEditing={handleDiagnosePort}
              keyboardType="numeric"
              placeholder="8080"
              placeholderTextColor={colors.textMuted}
            />
            <TouchableOpacity
              style={[styles.diagnoseBtn, { backgroundColor: colors.primary }]}
              onPress={handleDiagnosePort}
              activeOpacity={0.8}
            >
              <Search size={13} color="#ffffff" />
              <Text style={styles.diagnoseBtnText}>{t('diagnosePortBtn', 'Diagnose Port')}</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Port Testing Chips */}
          <View style={styles.quickPortsRow}>
            <Text style={[styles.quickPortsLabel, { color: colors.textMuted }]}>{t('quickTestLabel', 'Quick Test:')}</Text>
            {[8080, 3000, 5432, 80, 6379].map(p => {
              const isActive = testPortInput === String(p);
              return (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.quickPortChip,
                    { backgroundColor: colors.cardBg, borderColor: colors.cardBorder },
                    isActive && [styles.quickPortChipActive, { backgroundColor: colors.primaryBg, borderColor: colors.primary }]
                  ]}
                  onPress={() => {
                    setTestPortInput(String(p));
                    const matchedContainer = containers.find(c =>
                      c.ports && c.ports.some(cp => cp.host === p)
                    );
                    if (!matchedContainer) {
                      setPortDiagnosis({
                        status: 'error',
                        title: `No Container Bound to Port ${p}`,
                        explanation: `Requests to http://localhost:${p} will trigger ERR_CONNECTION_REFUSED because no active Docker container published this port.`,
                        fixCmd: `docker run -d -p ${p}:80 --name web-server nginx:alpine`,
                        fixDesc: `Run a container explicitly mapping host port ${p}.`,
                      });
                    } else if (matchedContainer.status !== 'running') {
                      setPortDiagnosis({
                        status: 'warning',
                        title: `Container "${matchedContainer.name}" is Stopped!`,
                        explanation: `Host port ${p} belongs to container "${matchedContainer.name}", but the container is currently stopped (offline).`,
                        fixCmd: `docker start ${matchedContainer.name}`,
                        fixDesc: `Start the stopped container to open the port.`,
                      });
                    } else {
                      setPortDiagnosis({
                        status: 'success',
                        title: `Healthy Connection on Port ${p}!`,
                        explanation: `Container "${matchedContainer.name}" is actively listening and forwarding requests to internal port ${matchedContainer.ports[0].container}.`,
                        fixCmd: `curl http://localhost:${p}`,
                        fixDesc: `Test the HTTP response with curl.`,
                      });
                    }
                  }}
                >
                  <Text style={[
                    styles.quickPortChipText,
                    { color: colors.textSub },
                    isActive && [styles.quickPortChipTextActive, { color: colors.primary }]
                  ]}>
                    :{p}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {portDiagnosis && (
            <View
              style={[
                styles.portDiagCard,
                { backgroundColor: colors.cardBg, borderColor: colors.cardBorder },
                portDiagnosis.status === 'error' && styles.portDiagCardError,
                portDiagnosis.status === 'warning' && styles.portDiagCardWarning,
                portDiagnosis.status === 'success' && styles.portDiagCardSuccess,
              ]}
            >
              <View style={styles.diagTitleRow}>
                {portDiagnosis.status === 'success' ? (
                  <CheckCircle2 size={16} color={colors.success} />
                ) : (
                  <AlertTriangle size={16} color={portDiagnosis.status === 'error' ? colors.danger : colors.warning} />
                )}
                <Text style={[styles.diagTitleText, { color: colors.text }]}>{portDiagnosis.title}</Text>
              </View>
              <Text style={[styles.diagExplanation, { color: colors.textSub }]}>{portDiagnosis.explanation}</Text>

              {portDiagnosis.fixCmd && (
                <View style={styles.diagFixRow}>
                  <Text style={[styles.diagFixDesc, { color: colors.textMuted }]}>Suggested Action: {portDiagnosis.fixDesc}</Text>
                  <TouchableOpacity
                    style={[styles.runFixBtn, { backgroundColor: colors.primary }]}
                    onPress={() => onExecuteCommand(portDiagnosis.fixCmd)}
                  >
                    <Play size={11} color="#ffffff" />
                    <Text style={styles.runFixBtnText}>{portDiagnosis.fixCmd}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Issue Selector Pills */}
        <View style={styles.issueSection}>
          <Text style={[styles.sectionHeading, { color: colors.text }]}>{t('commonIssuesTitle', 'Common Docker Connection & Server Issues')}</Text>
          <View style={styles.issueTabsList}>
            {DIAGNOSTIC_ISSUES.map(issue => {
              const isSelected = issue.id === selectedIssueId;
              return (
                <TouchableOpacity
                  key={issue.id}
                  style={[
                    styles.issueTab,
                    { backgroundColor: colors.cardBg, borderColor: colors.cardBorder },
                    isSelected && [styles.issueTabActive, { backgroundColor: colors.primaryBg, borderColor: colors.primary }]
                  ]}
                  onPress={() => setSelectedIssueId(issue.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.issueTabTop}>
                    <Text style={[styles.issueCategory, { color: colors.textMuted }]}>{issue.category}</Text>
                    <View style={[
                      styles.severityBadge,
                      issue.severity === 'Critical' ? styles.sevCritical : styles.sevHigh
                    ]}>
                      <Text style={styles.sevText}>{issue.severity}</Text>
                    </View>
                  </View>
                  <Text style={[
                    styles.issueTabTitle,
                    { color: colors.text },
                    isSelected && [styles.issueTabTitleActive, { color: colors.primary }]
                  ]}>
                    {issue.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Detailed Issue Breakdown & Suggestions */}
        <View style={[styles.detailCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          <View style={[styles.detailHeader, { borderBottomColor: colors.cardBorder }]}>
            <View style={styles.detailHeaderTop}>
              <Text style={[styles.detailCategory, { color: colors.textMuted }]}>{activeIssue.category}</Text>
              <Text style={[styles.detailSeverity, { color: colors.textMuted }]}>Severity: {activeIssue.severity}</Text>
            </View>
            <Text style={[styles.detailTitle, { color: colors.text }]}>{activeIssue.title}</Text>
          </View>

          {/* Symptom Box */}
          <View style={[styles.symptomBox, { backgroundColor: isDark ? 'rgba(248, 81, 73, 0.1)' : '#FFF1F0', borderColor: isDark ? '#f8514933' : '#FFCCC7' }]}>
            <Text style={styles.symptomLabel}>{t('symptomLabel', '🚨 Observed Symptom:')}</Text>
            <Text style={[styles.symptomText, { color: colors.text }]}>{activeIssue.symptom}</Text>
          </View>

          {/* Root Causes & Solutions */}
          <View style={styles.causesList}>
            <Text style={[styles.causesTitle, { color: colors.text }]}>{t('rootCausesTitle', 'Root Causes & Instant Fixes:')}</Text>
            {activeIssue.rootCauses.map((rc, idx) => (
              <View key={idx} style={[styles.causeCard, { backgroundColor: colors.cardSubBg, borderColor: colors.cardBorder }]}>
                <View style={styles.causeHeader}>
                  <Text style={[styles.causeIndex, { color: colors.primary }]}>Cause #{idx + 1}:</Text>
                  <Text style={[styles.causeReason, { color: colors.text }]}>{rc.reason}</Text>
                </View>
                <Text style={[styles.causeDetails, { color: colors.textSub }]}>{rc.details}</Text>

                <View style={[styles.solutionBox, { backgroundColor: isDark ? 'rgba(56, 139, 253, 0.1)' : '#F0F5FF', borderColor: isDark ? '#388bfd33' : '#ADC6FF' }]}>
                  <Text style={styles.solutionLabel}>{t('recommendedFixLabel', '💡 Recommended Fix:')}</Text>
                  <Text style={[styles.solutionText, { color: colors.text }]}>{rc.solution}</Text>
                </View>

                {rc.codeComparison && (
                  <View style={styles.codeCompareRow}>
                    <View style={[styles.codeBox, styles.codeBoxBad, { backgroundColor: isDark ? '#161b22' : '#FFF2F0', borderColor: isDark ? '#f85149' : '#FFA39E' }]}>
                      <Text style={styles.codeBoxTitleBad}>{t('antiPatternLabel', '❌ Anti-Pattern (Fails in Docker)')}</Text>
                      <Text style={[styles.codeSnippet, { color: colors.text }]}>{rc.codeComparison.bad}</Text>
                    </View>
                    <View style={[styles.codeBox, styles.codeBoxGood, { backgroundColor: isDark ? '#161b22' : '#F6FFED', borderColor: isDark ? '#3fb950' : '#B7EB8F' }]}>
                      <Text style={styles.codeBoxTitleGood}>{t('correctSolutionLabel', '✅ Correct Solution (Works in Docker)')}</Text>
                      <Text style={[styles.codeSnippet, { color: colors.text }]}>{rc.codeComparison.good}</Text>
                    </View>
                  </View>
                )}

                {rc.commandFix && (
                  <View style={styles.cmdFixBox}>
                    <Text style={[styles.cmdFixLabel, { color: colors.textMuted }]}>Fix Command:</Text>
                    <TouchableOpacity
                      style={[styles.runCmdBtn, { backgroundColor: colors.primary }]}
                      onPress={() => onExecuteCommand(rc.commandFix)}
                    >
                      <Play size={12} color="#ffffff" />
                      <Text style={styles.runCmdBtnText}>{t('tryFixCmd', 'Run')}: {rc.commandFix}</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Pro Tips */}
          {activeIssue.tips && activeIssue.tips.length > 0 && (
            <View style={[styles.proTipsCard, { backgroundColor: colors.cardSubBg, borderColor: colors.cardBorder }]}>
              <View style={styles.proTipsHeader}>
                <ShieldCheck size={14} color={colors.success} />
                <Text style={[styles.proTipsTitle, { color: colors.text }]}>Docker Doctor Best Practice Rules</Text>
              </View>
              {activeIssue.tips.map((tip, idx) => (
                <Text key={idx} style={[styles.tipItemText, { color: colors.textSub }]}>
                  • {tip}
                </Text>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
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
    minHeight: 0,
  },
  doctorHeader: {
    backgroundColor: '#161b22',
    borderBottomWidth: 1,
    borderBottomColor: '#30363d',
    padding: 14,
    gap: 4,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitleText: {
    color: '#f0f6fc',
    fontSize: 15,
    fontWeight: '700',
  },
  headerSubtitleText: {
    color: '#8b949e',
    fontSize: 12,
  },
  scrollArea: {
    flex: 1,
    minHeight: 0,
  },
  scrollContent: {
    padding: 14,
    gap: 14,
  },
  portDoctorBox: {
    backgroundColor: '#161b22',
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  portDoctorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  portDoctorTitle: {
    color: '#f0f6fc',
    fontSize: 13,
    fontWeight: '700',
  },
  portDoctorDesc: {
    color: '#8b949e',
    fontSize: 11,
  },
  portInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0d1117',
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 6,
    marginTop: 4,
  },
  portInputPrefix: {
    color: '#8b949e',
    fontSize: 12,
    fontFamily: 'Fira Code, monospace',
  },
  portInput: {
    flex: 1,
    color: '#f0f6fc',
    fontFamily: 'Fira Code, monospace',
    fontSize: 13,
    paddingVertical: 2,
    outlineStyle: 'none',
  },
  diagnoseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f6feb',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    gap: 4,
  },
  diagnoseBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  quickPortsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
    marginTop: 6,
  },
  quickPortsLabel: {
    color: '#8b949e',
    fontSize: 10,
    fontWeight: '600',
  },
  quickPortChip: {
    backgroundColor: '#161b22',
    borderWidth: 1,
    borderColor: '#30363d',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  quickPortChipActive: {
    borderColor: '#58a6ff',
    backgroundColor: 'rgba(88, 166, 255, 0.15)',
  },
  quickPortChipText: {
    color: '#c9d1d9',
    fontSize: 10,
    fontFamily: 'Fira Code, monospace',
    fontWeight: '600',
  },
  quickPortChipTextActive: {
    color: '#58a6ff',
    fontWeight: '700',
  },
  portDiagCard: {
    backgroundColor: '#21262d',
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 6,
    padding: 10,
    gap: 6,
    marginTop: 6,
  },
  portDiagCardError: {
    borderColor: '#f85149',
    backgroundColor: 'rgba(248, 81, 73, 0.08)',
  },
  portDiagCardWarning: {
    borderColor: '#e3b341',
    backgroundColor: 'rgba(227, 179, 65, 0.08)',
  },
  portDiagCardSuccess: {
    borderColor: '#3fb950',
    backgroundColor: 'rgba(63, 185, 80, 0.08)',
  },
  diagTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  diagTitleText: {
    color: '#f0f6fc',
    fontSize: 12,
    fontWeight: '700',
  },
  diagExplanation: {
    color: '#c9d1d9',
    fontSize: 11,
    lineHeight: 16,
  },
  diagFixRow: {
    gap: 4,
    marginTop: 4,
  },
  diagFixDesc: {
    color: '#8b949e',
    fontSize: 10,
  },
  runFixBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#238636',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    gap: 6,
    alignSelf: 'flex-start',
  },
  runFixBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontFamily: 'Fira Code, monospace',
    fontWeight: '600',
  },
  issueSection: {
    gap: 8,
  },
  sectionHeading: {
    color: '#f0f6fc',
    fontSize: 13,
    fontWeight: '700',
  },
  issueTabsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  issueTab: {
    flex: 1,
    minWidth: 220,
    backgroundColor: '#161b22',
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 8,
    padding: 10,
    gap: 4,
  },
  issueTabActive: {
    borderColor: '#58a6ff',
    backgroundColor: 'rgba(88, 166, 255, 0.1)',
  },
  issueTabTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  issueCategory: {
    fontSize: 10,
    color: '#8b949e',
    fontWeight: '600',
  },
  severityBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  sevCritical: {
    backgroundColor: 'rgba(248, 81, 73, 0.2)',
  },
  sevHigh: {
    backgroundColor: 'rgba(227, 179, 65, 0.2)',
  },
  sevText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#f0f6fc',
  },
  issueTabTitle: {
    fontSize: 12,
    color: '#c9d1d9',
    fontWeight: '600',
  },
  issueTabTitleActive: {
    color: '#58a6ff',
  },
  detailCard: {
    backgroundColor: '#161b22',
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 8,
    padding: 14,
    gap: 12,
  },
  detailHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#21262d',
    paddingBottom: 8,
    gap: 4,
  },
  detailHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailCategory: {
    color: '#58a6ff',
    fontSize: 11,
    fontWeight: '700',
  },
  detailSeverity: {
    color: '#8b949e',
    fontSize: 11,
  },
  detailTitle: {
    color: '#f0f6fc',
    fontSize: 16,
    fontWeight: '800',
  },
  symptomBox: {
    backgroundColor: 'rgba(248, 81, 73, 0.08)',
    borderLeftWidth: 3,
    borderLeftColor: '#f85149',
    padding: 10,
    borderRadius: 4,
    gap: 4,
  },
  symptomLabel: {
    color: '#f85149',
    fontSize: 11,
    fontWeight: '700',
  },
  symptomText: {
    color: '#c9d1d9',
    fontSize: 12,
    lineHeight: 18,
  },
  causesList: {
    gap: 10,
  },
  causesTitle: {
    color: '#f0f6fc',
    fontSize: 13,
    fontWeight: '700',
  },
  causeCard: {
    backgroundColor: '#21262d',
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 6,
    padding: 10,
    gap: 6,
  },
  causeHeader: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'baseline',
  },
  causeIndex: {
    color: '#e3b341',
    fontWeight: '700',
    fontSize: 11,
  },
  causeReason: {
    color: '#f0f6fc',
    fontSize: 12,
    fontWeight: '700',
  },
  causeDetails: {
    color: '#8b949e',
    fontSize: 11,
    lineHeight: 16,
  },
  solutionBox: {
    backgroundColor: '#161b22',
    padding: 8,
    borderRadius: 4,
    gap: 2,
    marginTop: 4,
  },
  solutionLabel: {
    color: '#3fb950',
    fontSize: 10,
    fontWeight: '700',
  },
  solutionText: {
    color: '#c9d1d9',
    fontSize: 11,
  },
  codeCompareRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  codeBox: {
    flex: 1,
    minWidth: 240,
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
  },
  codeBoxBad: {
    backgroundColor: 'rgba(248, 81, 73, 0.05)',
    borderColor: 'rgba(248, 81, 73, 0.3)',
  },
  codeBoxGood: {
    backgroundColor: 'rgba(63, 185, 80, 0.05)',
    borderColor: 'rgba(63, 185, 80, 0.3)',
  },
  codeBoxTitleBad: {
    color: '#f85149',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 4,
  },
  codeBoxTitleGood: {
    color: '#3fb950',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 4,
  },
  codeSnippet: {
    color: '#c9d1d9',
    fontFamily: 'Fira Code, monospace',
    fontSize: 10.5,
    lineHeight: 15,
  },
  cmdFixBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    flexWrap: 'wrap',
  },
  cmdFixLabel: {
    color: '#8b949e',
    fontSize: 11,
    fontWeight: '600',
  },
  runCmdBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f6feb',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    gap: 4,
  },
  runCmdBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontFamily: 'Fira Code, monospace',
    fontWeight: '600',
  },
  proTipsCard: {
    backgroundColor: 'rgba(63, 185, 80, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(63, 185, 80, 0.25)',
    borderRadius: 6,
    padding: 10,
    gap: 4,
  },
  proTipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  proTipsTitle: {
    color: '#3fb950',
    fontSize: 11,
    fontWeight: '700',
  },
  tipItemText: {
    color: '#c9d1d9',
    fontSize: 11,
    lineHeight: 16,
  },
});
