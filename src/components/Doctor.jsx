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

export default function Doctor({
  containers,
  onExecuteCommand,
}) {
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
          <Stethoscope size={18} color="#58a6ff" />
          <Text style={styles.headerTitleText}>Docker Doctor & Connection Diagnostic Advisor</Text>
        </View>
        <Text style={styles.headerSubtitleText}>
          Select a common Docker server problem or diagnose your running ports to get instant actionable suggestions.
        </Text>
      </View>

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
        {/* Quick Port Diagnostic Doctor Tool */}
        <View style={styles.portDoctorBox}>
          <View style={styles.portDoctorHeader}>
            <Zap size={15} color="#e3b341" />
            <Text style={styles.portDoctorTitle}>Interactive Host Port Inspector</Text>
          </View>
          <Text style={styles.portDoctorDesc}>
            Wondering why a port isn't connecting? Enter any host port to diagnose its status against your Docker sandbox.
          </Text>

          <View style={styles.portInputRow}>
            <Text style={styles.portInputPrefix}>http://localhost:</Text>
            <TextInput
              style={styles.portInput}
              value={testPortInput}
              onChangeText={setTestPortInput}
              keyboardType="numeric"
              placeholder="8080"
              placeholderTextColor="#484f58"
            />
            <TouchableOpacity
              style={styles.diagnoseBtn}
              onPress={handleDiagnosePort}
              activeOpacity={0.8}
            >
              <Search size={13} color="#ffffff" />
              <Text style={styles.diagnoseBtnText}>Diagnose Port</Text>
            </TouchableOpacity>
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
                  <CheckCircle2 size={16} color="#3fb950" />
                ) : (
                  <AlertTriangle size={16} color={portDiagnosis.status === 'error' ? '#f85149' : '#e3b341'} />
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
          <Text style={styles.sectionHeading}>Common Docker Connection & Server Issues</Text>
          <View style={styles.issueTabsList}>
            {DIAGNOSTIC_ISSUES.map(issue => {
              const isSelected = issue.id === selectedIssueId;
              return (
                <TouchableOpacity
                  key={issue.id}
                  style={[styles.issueTab, isSelected && styles.issueTabActive]}
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
                  <Text style={[styles.issueTabTitle, isSelected && styles.issueTabTitleActive]}>
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
            <Text style={styles.symptomLabel}>🚨 Observed Symptom:</Text>
            <Text style={styles.symptomText}>{activeIssue.symptom}</Text>
          </View>

          {/* Root Causes & Solutions */}
          <View style={styles.causesList}>
            <Text style={styles.causesTitle}>Root Causes & Instant Fixes:</Text>
            {activeIssue.rootCauses.map((rc, idx) => (
              <View key={idx} style={styles.causeCard}>
                <View style={styles.causeHeader}>
                  <Text style={styles.causeIndex}>Cause #{idx + 1}:</Text>
                  <Text style={styles.causeReason}>{rc.reason}</Text>
                </View>
                <Text style={styles.causeDetails}>{rc.details}</Text>

                <View style={styles.solutionBox}>
                  <Text style={styles.solutionLabel}>💡 Recommended Fix:</Text>
                  <Text style={styles.solutionText}>{rc.solution}</Text>
                </View>

                {rc.codeComparison && (
                  <View style={styles.codeCompareRow}>
                    <View style={[styles.codeBox, styles.codeBoxBad]}>
                      <Text style={styles.codeBoxTitleBad}>❌ Anti-Pattern (Fails in Docker)</Text>
                      <Text style={styles.codeSnippet}>{rc.codeComparison.bad}</Text>
                    </View>
                    <View style={[styles.codeBox, styles.codeBoxGood]}>
                      <Text style={styles.codeBoxTitleGood}>✅ Correct Solution (Works in Docker)</Text>
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
                      <Text style={styles.runCmdBtnText}>Run: {rc.commandFix}</Text>
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
                <ShieldCheck size={14} color="#3fb950" />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1117',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#30363d',
    overflow: 'hidden',
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
