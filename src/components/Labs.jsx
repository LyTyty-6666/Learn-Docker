import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {
  Award,
  CheckCircle2,
  Circle,
  HelpCircle,
  ChevronRight,
  Terminal,
  Play,
  Sparkles,
  Lock,
} from 'lucide-react';
import { LABS } from '../data/labsData';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useHorizontalScroll } from '../hooks/useHorizontalScroll';

export default function Labs({
  activeLabId,
  setActiveLabId,
  completedSteps,
  onExecuteCommand,
}) {
  const [showHintStepId, setShowHintStepId] = useState(null);
  const { colors } = useTheme();
  const { t } = useLanguage();
  const { scrollRef: labsScrollRef } = useHorizontalScroll();

  const activeLab = LABS.find(l => l.id === activeLabId) || LABS[0];

  // Calculate active lab completion
  const totalSteps = activeLab.steps.length;
  const passedCount = activeLab.steps.filter(s =>
    completedSteps.has(`${activeLab.id}-${s.id}`)
  ).length;
  const isLabFinished = passedCount === totalSteps;
  const progressPct = Math.round((passedCount / totalSteps) * 100);

  return (
    <View style={[styles.container, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
      {/* Lab Tabs / Selector */}
      <View style={[styles.labsHeader, { backgroundColor: colors.cardSubBg, borderBottomColor: colors.cardBorder }]}>
        <View style={styles.titleRow}>
          <Award size={18} color="#e3b341" />
          <Text style={[styles.titleText, { color: colors.text }]}>{t('labsTitle', 'Docker Guided Missions & Challenges')}</Text>
        </View>
        <ScrollView
          ref={labsScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.labsScroll}
        >
          {LABS.map((lab, index) => {
            const isSelected = lab.id === activeLabId;
            const labPassed = lab.steps.every(s =>
              completedSteps.has(`${lab.id}-${s.id}`)
            );
            return (
              <TouchableOpacity
                key={lab.id}
                style={[
                  styles.labTab,
                  { backgroundColor: colors.cardBg, borderColor: colors.cardBorder },
                  isSelected && styles.labTabActive
                ]}
                onPress={() => setActiveLabId(lab.id)}
                activeOpacity={0.8}
              >
                <View style={styles.labTabTop}>
                  <Text style={[styles.labLevel, isSelected && styles.labLevelActive]}>
                    {lab.level}
                  </Text>
                  {labPassed ? (
                    <CheckCircle2 size={12} color="#3fb950" />
                  ) : (
                    <Text style={styles.labXp}>+{lab.xp} XP</Text>
                  )}
                </View>
                <Text style={[styles.labTabTitle, { color: colors.textSub }, isSelected && [styles.labTabTitleActive, { color: colors.text }]]} numberOfLines={1}>
                  {lab.title.split(':')[0]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Active Lab Body */}
      <ScrollView style={styles.bodyScroll} contentContainerStyle={styles.bodyContent}>
        {/* Lab Overview Card */}
        <View style={[styles.overviewCard, { backgroundColor: colors.cardSubBg, borderColor: colors.cardBorder }]}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={[styles.overviewTitle, { color: colors.text }]}>{activeLab.title}</Text>
              <Text style={[styles.overviewDesc, { color: colors.textMuted }]}>{activeLab.description}</Text>
            </View>
            <View style={styles.xpBadge}>
              <Award size={14} color="#e3b341" />
              <Text style={styles.xpBadgeText}>{activeLab.xp} XP</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressLabels}>
              <Text style={[styles.progressLabel, { color: colors.textMuted }]}>{t('missionSteps', 'Mission Progress')}</Text>
              <Text style={[styles.progressValue, { color: colors.primary }]}>
                {passedCount} / {totalSteps} {t('missionSteps', 'Steps')} ({progressPct}%)
              </Text>
            </View>
            <View style={[styles.progressTrack, { backgroundColor: colors.cardBorder }]}>
              <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
            </View>
          </View>

          {isLabFinished && (
            <View style={styles.congratsBanner}>
              <Sparkles size={16} color="#3fb950" />
              <Text style={styles.congratsText}>
                {t('labCompleted', '🎉 Fantastic! You completed all steps in this mission!')}
              </Text>
            </View>
          )}
        </View>

        {/* Steps List */}
        <View style={styles.stepsList}>
          <Text style={[styles.stepsSectionTitle, { color: colors.text }]}>{t('missionSteps', 'Step-by-Step Objectives')}</Text>

          {activeLab.steps.map((step, idx) => {
            const stepKey = `${activeLab.id}-${step.id}`;
            const isCompleted = completedSteps.has(stepKey);
            const isPriorCompleted = idx === 0 || completedSteps.has(`${activeLab.id}-${activeLab.steps[idx - 1].id}`);
            const isCurrent = !isCompleted && isPriorCompleted;
            const isLocked = !isCompleted && !isPriorCompleted;
            const isHintOpen = showHintStepId === step.id;

            return (
              <View
                key={step.id}
                style={[
                  styles.stepCard,
                  { backgroundColor: colors.cardBg, borderColor: colors.cardBorder },
                  isCompleted && styles.stepCardCompleted,
                  isCurrent && [styles.stepCardCurrent, { borderColor: colors.primary }],
                  isLocked && styles.stepCardLocked,
                ]}
              >
                {/* Step Header */}
                <View style={styles.stepTopRow}>
                  <View style={styles.stepStatusIcon}>
                    {isCompleted ? (
                      <CheckCircle2 size={18} color="#3fb950" />
                    ) : isCurrent ? (
                      <Circle size={18} color={colors.primary} />
                    ) : (
                      <Lock size={16} color={colors.textMuted} />
                    )}
                  </View>

                  <View style={styles.stepTitleBox}>
                    <Text style={[styles.stepNumText, { color: colors.primary }, isCompleted && styles.textCompleted]}>
                      {t('step', 'Step')} {idx + 1}
                    </Text>
                    <Text style={[styles.stepInstruction, { color: colors.text }, isCompleted && styles.textCompleted]}>
                      {step.instruction}
                    </Text>
                  </View>
                </View>

                {/* Hint & Run Buttons */}
                <View style={styles.stepActionRow}>
                  <TouchableOpacity
                    style={[styles.hintToggle, { backgroundColor: colors.cardSubBg, borderColor: colors.cardBorder }]}
                    onPress={() => setShowHintStepId(isHintOpen ? null : step.id)}
                  >
                    <HelpCircle size={12} color={colors.textMuted} />
                    <Text style={[styles.hintToggleText, { color: colors.textMuted }]}>
                      {isHintOpen ? t('hideHint', 'Hide Hint') : t('showHint', 'Show Hint / Command')}
                    </Text>
                  </TouchableOpacity>

                  {step.expectedCommand && (
                    <TouchableOpacity
                      style={[styles.autoRunBtn, { backgroundColor: colors.accent || '#238636' }]}
                      onPress={() => onExecuteCommand(step.expectedCommand)}
                    >
                      <Play size={11} color="#ffffff" />
                      <Text style={styles.autoRunBtnText}>{t('runInTerminal', 'Run Command')}</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Expanded Hint Box */}
                {isHintOpen && (
                  <View style={[styles.hintContentBox, { backgroundColor: colors.cardSubBg, borderColor: colors.warning }]}>
                    <Text style={[styles.hintLabel, { color: colors.warning }]}>{t('hintLabel', '💡 Suggested Command:')}</Text>
                    <Text style={[styles.hintCode, { color: colors.text }]} selectable={true}>
                      {step.expectedCommand || step.hint}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
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
  labsHeader: {
    backgroundColor: '#161b22',
    borderBottomWidth: 1,
    borderBottomColor: '#30363d',
    padding: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  titleText: {
    color: '#f0f6fc',
    fontSize: 14,
    fontWeight: '700',
  },
  labsScroll: {
    flexDirection: 'row',
    gap: 8,
  },
  labTab: {
    backgroundColor: '#21262d',
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 110,
  },
  labTabActive: {
    borderColor: '#e3b341',
    backgroundColor: 'rgba(227, 179, 65, 0.1)',
  },
  labTabTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  labLevel: {
    fontSize: 9,
    color: '#8b949e',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  labLevelActive: {
    color: '#e3b341',
  },
  labXp: {
    fontSize: 9,
    color: '#8b949e',
    fontWeight: '600',
  },
  labTabTitle: {
    fontSize: 12,
    color: '#c9d1d9',
    fontWeight: '600',
  },
  labTabTitleActive: {
    color: '#f0f6fc',
    fontWeight: '700',
  },
  bodyScroll: {
    flex: 1,
    minHeight: 0,
  },
  bodyContent: {
    padding: 14,
    gap: 14,
  },
  overviewCard: {
    backgroundColor: '#161b22',
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 8,
    padding: 14,
    gap: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  overviewTitle: {
    color: '#f0f6fc',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  overviewDesc: {
    color: '#8b949e',
    fontSize: 12,
    lineHeight: 18,
    maxWidth: 420,
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(227, 179, 65, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(227, 179, 65, 0.3)',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  xpBadgeText: {
    color: '#e3b341',
    fontWeight: '700',
    fontSize: 11,
  },
  progressContainer: {
    gap: 6,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 11,
    color: '#8b949e',
  },
  progressValue: {
    fontSize: 11,
    color: '#58a6ff',
    fontWeight: '600',
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#21262d',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#238636',
    borderRadius: 3,
  },
  congratsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(63, 185, 80, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(63, 185, 80, 0.3)',
    borderRadius: 6,
    padding: 8,
    gap: 8,
  },
  congratsText: {
    color: '#3fb950',
    fontSize: 12,
    fontWeight: '600',
  },
  stepsList: {
    gap: 10,
  },
  stepsSectionTitle: {
    color: '#f0f6fc',
    fontSize: 13,
    fontWeight: '700',
  },
  stepCard: {
    backgroundColor: '#161b22',
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  stepCardCompleted: {
    borderColor: '#238636',
    backgroundColor: 'rgba(35, 134, 54, 0.05)',
  },
  stepCardCurrent: {
    borderColor: '#58a6ff',
  },
  stepCardLocked: {
    opacity: 0.5,
  },
  stepTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  stepStatusIcon: {
    marginTop: 2,
  },
  stepTitleBox: {
    flex: 1,
    gap: 2,
  },
  stepNumText: {
    fontSize: 10,
    color: '#58a6ff',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  stepInstruction: {
    fontSize: 13,
    color: '#f0f6fc',
    lineHeight: 18,
  },
  textCompleted: {
    color: '#8b949e',
    textDecorationLine: 'line-through',
  },
  stepActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  hintToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
  },
  hintToggleText: {
    color: '#8b949e',
    fontSize: 11,
  },
  autoRunBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f6feb',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    gap: 4,
  },
  autoRunBtnText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  hintContentBox: {
    backgroundColor: '#0d1117',
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 6,
    padding: 8,
    marginTop: 4,
  },
  hintLabel: {
    color: '#e3b341',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 2,
  },
  hintCode: {
    color: '#58a6ff',
    fontFamily: 'Fira Code, monospace',
    fontSize: 11,
  },
});
