import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { styles } from '../styles/doctor.styles';
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
