import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { styles } from '../styles/labs.styles';
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
