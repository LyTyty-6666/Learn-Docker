import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { styles } from '../styles/guide.styles';
import {
  BookOpen,
  ChevronRight,
  Info,
  CheckCircle2,
  Play,
  Share2,
  Terminal,
} from 'lucide-react';
import { GUIDE_CHAPTERS } from '../data/guideData';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useHorizontalScroll } from '../hooks/useHorizontalScroll';

export default function LearningGuide({ onExecuteCommand }) {
  const { colors, isDark } = useTheme();
  const { t } = useLanguage();
  const [activeChapterId, setActiveChapterId] = useState(GUIDE_CHAPTERS[0].id);
  const { scrollRef: guideScrollRef } = useHorizontalScroll();

  const activeChapter = GUIDE_CHAPTERS.find(c => c.id === activeChapterId) || GUIDE_CHAPTERS[0];

  return (
    <View style={[styles.container, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
      {/* Sidebar / Chapters Selector */}
      <View style={[styles.guideHeader, { backgroundColor: colors.cardSubBg, borderBottomColor: colors.cardBorder }]}>
        <View style={styles.titleRow}>
          <BookOpen size={18} color={colors.primary} />
          <Text style={[styles.titleText, { color: colors.text }]}>{t('guideTitle', 'Docker & Server Connection Knowledge Base')}</Text>
        </View>
        <ScrollView
          ref={guideScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chaptersScroll}
        >
          {GUIDE_CHAPTERS.map(ch => {
            const isSelected = ch.id === activeChapterId;
            return (
              <TouchableOpacity
                key={ch.id}
                style={[
                  styles.chapterTab,
                  { backgroundColor: colors.cardBg, borderColor: colors.cardBorder },
                  isSelected && [styles.chapterTabActive, { backgroundColor: colors.primaryBg, borderColor: colors.primary }]
                ]}
                onPress={() => setActiveChapterId(ch.id)}
                activeOpacity={0.8}
              >
                <View style={styles.chapterTabTop}>
                  <Text style={[
                    styles.badgeText,
                    { color: colors.textMuted },
                    isSelected && [styles.badgeTextActive, { color: colors.primary }]
                  ]}>
                    {ch.badge}
                  </Text>
                </View>
                <Text style={[
                  styles.chapterTabTitle,
                  { color: colors.textSub },
                  isSelected && [styles.chapterTabTitleActive, { color: colors.primary }]
                ]} numberOfLines={1}>
                  {ch.title.split('.')[1] || ch.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Main Chapter Content */}
      <ScrollView style={styles.contentScroll} contentContainerStyle={styles.contentPadding}>
        <View style={[styles.chapterHeaderCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          <View style={styles.chapterBadgeRow}>
            <View style={[styles.chapterBadge, { backgroundColor: colors.primaryBg, borderColor: colors.primary }]}>
              <Text style={[styles.chapterBadgeLabel, { color: colors.primary }]}>{activeChapter.badge}</Text>
            </View>
          </View>
          <Text style={[styles.chapterTitle, { color: colors.text }]}>{activeChapter.title}</Text>
          <Text style={[styles.chapterSummary, { color: colors.textSub }]}>{activeChapter.summary}</Text>
        </View>

        <View style={styles.sectionsList}>
          {activeChapter.content.map((sec, idx) => (
            <View key={idx} style={[styles.sectionCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
              <Text style={[styles.sectionHeading, { color: colors.text }]}>{sec.heading}</Text>
              <Text style={[styles.sectionText, { color: colors.textSub }]}>{sec.text}</Text>

              {sec.codeSnippet && (
                <View style={[styles.codeSnippetBox, { backgroundColor: isDark ? '#161b22' : '#F3EDE4', borderColor: colors.cardBorder }]}>
                  <Text style={[styles.codeSnippetText, { color: colors.text }]} selectable={true}>
                    {sec.codeSnippet}
                  </Text>
                  {sec.codeSnippet.startsWith('docker run') && (
                    <TouchableOpacity
                      style={[styles.snippetRunBtn, { backgroundColor: colors.primary }]}
                      onPress={() => {
                        const firstLine = sec.codeSnippet.split('\n')[0];
                        onExecuteCommand(firstLine);
                      }}
                    >
                      <Play size={11} color="#ffffff" />
                      <Text style={styles.snippetRunBtnText}>{t('tryInTerminalBtn', 'Try in Terminal')}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {sec.callout && (
                <View style={[styles.calloutBox, { backgroundColor: isDark ? 'rgba(56, 139, 253, 0.1)' : '#F0F5FF', borderLeftColor: colors.primary }]}>
                  <Info size={14} color={colors.primary} />
                  <Text style={[styles.calloutText, { color: colors.text }]}>{sec.callout}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
