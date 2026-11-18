import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { createStyles } from '../styles/doctor.styles';
import {
  Stethoscope,
  AlertTriangle,
  CheckCircle2,
  Play,
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
  const styles = createStyles(colors, isDark);

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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.doctorHeader}>
        <View style={styles.headerTitleRow}>
          <Stethoscope size={18} color={colors.primary} />
          <Text style={styles.headerTitleText}>{t('doctorTitle', 'Docker Doctor & Connection Diagnostic Advisor')}</Text>
        </View>
        <Text style={styles.headerSubtitleText}>
          {t('doctorSubtitle', 'Select a common Docker server problem or diagnose your running ports to get instant actionable suggestions.')}
        </Text>
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        {/* Quick Port Diagnostic Doctor Tool */}
        <View style={styles.portDoctorBox}>
          <View style={styles.portDoctorHeader}>
            <Zap size={15} color={colors.warning} />
            <Text style={styles.portDoctorTitle}>{t('portDoctorTitle', 'Interactive Host Port Inspector')}</Text>
          </View>
          <Text style={styles.portDoctorDesc}>
            {t('portDoctorDesc', "Wondering why a port isn't connecting? Enter any host port to diagnose its status against your Docker sandbox.")}
          </Text>

          <View style={styles.portInputRow}>
            <Text style={styles.portInputPrefix}>http://localhost:</Text>
            <TextInput
              style={styles.portInput}
              value={testPortInput}
              onChangeText={setTestPortInput}
              onSubmitEditing={handleDiagnosePort}
              keyboardType="numeric"
              placeholder="8080"
              placeholderTextColor={colors.textMuted}
            />
            <TouchableOpacity
              style={styles.diagnoseBtn}
              onPress={handleDiagnosePort}
              activeOpacity={0.8}
            >
              <Search size={13} color="#ffffff" />
              <Text style={styles.diagnoseBtnText}>{t('diagnosePortBtn', 'Diagnose Port')}</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Port Testing Chips */}
          <View style={styles.quickPortsRow}>
            <Text style={styles.quickPortsLabel}>{t('quickTestLabel', 'Quick Test:')}</Text>
            {[8080, 3000, 5432, 80, 6379].map(p => {
              const isActive = testPortInput === String(p);
              return (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.quickPortChip,
                    isActive && styles.quickPortChipActive,
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
                    isActive && styles.quickPortChipTextActive,
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
                <Text style={styles.diagTitleText}>{portDiagnosis.title}</Text>
              </View>
              <Text style={styles.diagExplanation}>{portDiagnosis.explanation}</Text>

              {portDiagnosis.fixCmd && (
                <View style={styles.diagFixRow}>
                  <Text style={styles.diagFixDesc}>Suggested Action: {portDiagnosis.fixDesc}</Text>
                  <TouchableOpacity
                    style={styles.runFixBtn}
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
          <Text style={styles.sectionHeading}>{t('commonIssuesTitle', 'Common Docker Connection & Server Issues')}</Text>
          <View style={styles.issueTabsList}>
            {DIAGNOSTIC_ISSUES.map(issue => {
              const isSelected = issue.id === selectedIssueId;
              return (
                <TouchableOpacity
                  key={issue.id}
                  style={[
                    styles.issueTab,
                    isSelected && styles.issueTabActive,
                  ]}
                  onPress={() => setSelectedIssueId(issue.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.issueTabTop}>
                    <Text style={styles.issueCategory}>{issue.category}</Text>
                    <View style={[
                      styles.severityBadge,
                      issue.severity === 'Critical' ? styles.sevCritical : styles.sevHigh
                    ]}>
                      <Text style={styles.sevText}>{issue.severity}</Text>
                    </View>
                  </View>
                  <Text style={[
                    styles.issueTabTitle,
                    isSelected && styles.issueTabTitleActive,
                  ]}>
                    {issue.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Detailed Issue Breakdown & Suggestions */}
        <View style={styles.detailCard}>
          <View style={styles.detailHeader}>
            <View style={styles.detailHeaderTop}>
              <Text style={styles.detailCategory}>{activeIssue.category}</Text>
              <Text style={styles.detailSeverity}>Severity: {activeIssue.severity}</Text>
            </View>
            <Text style={styles.detailTitle}>{activeIssue.title}</Text>
          </View>

          {/* Symptom Box */}
          <View style={styles.symptomBox}>
            <Text style={styles.symptomLabel}>{t('symptomLabel', '🚨 Observed Symptom:')}</Text>
            <Text style={styles.symptomText}>{activeIssue.symptom}</Text>
          </View>

          {/* Root Causes & Solutions */}
          <View style={styles.causesList}>
            <Text style={styles.causesTitle}>{t('rootCausesTitle', 'Root Causes & Instant Fixes:')}</Text>
            {activeIssue.rootCauses.map((rc, idx) => (
              <View key={idx} style={styles.causeCard}>
                <View style={styles.causeHeader}>
                  <Text style={styles.causeIndex}>Cause #{idx + 1}:</Text>
                  <Text style={styles.causeReason}>{rc.reason}</Text>
                </View>
                <Text style={styles.causeDetails}>{rc.details}</Text>

                <View style={styles.solutionBox}>
                  <Text style={styles.solutionLabel}>{t('recommendedFixLabel', '💡 Recommended Fix:')}</Text>
                  <Text style={styles.solutionText}>{rc.solution}</Text>
                </View>

                {rc.codeComparison && (
                  <View style={styles.codeCompareRow}>
                    <View style={[styles.codeBox, styles.codeBoxBad]}>
                      <Text style={styles.codeBoxTitleBad}>{t('antiPatternLabel', '❌ Anti-Pattern (Fails in Docker)')}</Text>
                      <Text style={styles.codeSnippet}>{rc.codeComparison.bad}</Text>
                    </View>
                    <View style={[styles.codeBox, styles.codeBoxGood]}>
                      <Text style={styles.codeBoxTitleGood}>{t('correctSolutionLabel', '✅ Correct Solution (Works in Docker)')}</Text>
                      <Text style={styles.codeSnippet}>{rc.codeComparison.good}</Text>
                    </View>
                  </View>
                )}

                {rc.commandFix && (
                  <View style={styles.cmdFixBox}>
                    <Text style={styles.cmdFixLabel}>Fix Command:</Text>
                    <TouchableOpacity
                      style={styles.runCmdBtn}
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
            <View style={styles.proTipsCard}>
              <View style={styles.proTipsHeader}>
                <ShieldCheck size={14} color={colors.success} />
                <Text style={styles.proTipsTitle}>Docker Doctor Best Practice Rules</Text>
              </View>
              {activeIssue.tips.map((tip, idx) => (
                <Text key={idx} style={styles.tipItemText}>
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
