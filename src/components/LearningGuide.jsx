import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
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
  guideHeader: {
    backgroundColor: '#161b22',
    borderBottomWidth: 1,
    borderBottomColor: '#30363d',
    padding: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  titleText: {
    color: '#f0f6fc',
    fontSize: 14,
    fontWeight: '700',
  },
  chaptersScroll: {
    flexDirection: 'row',
    gap: 8,
  },
  chapterTab: {
    backgroundColor: '#21262d',
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 130,
    gap: 2,
  },
  chapterTabActive: {
    borderColor: '#58a6ff',
    backgroundColor: 'rgba(88, 166, 255, 0.1)',
  },
  chapterTabTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badgeText: {
    fontSize: 9,
    color: '#8b949e',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  badgeTextActive: {
    color: '#58a6ff',
  },
  chapterTabTitle: {
    fontSize: 12,
    color: '#c9d1d9',
    fontWeight: '600',
  },
  chapterTabTitleActive: {
    color: '#f0f6fc',
    fontWeight: '700',
  },
  contentScroll: {
    flex: 1,
    minHeight: 0,
  },
  contentPadding: {
    padding: 14,
    gap: 14,
  },
  chapterHeaderCard: {
    backgroundColor: '#161b22',
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 8,
    padding: 14,
    gap: 6,
  },
  chapterBadgeRow: {
    flexDirection: 'row',
  },
  chapterBadge: {
    backgroundColor: 'rgba(88, 166, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  chapterBadgeLabel: {
    color: '#58a6ff',
    fontSize: 10,
    fontWeight: '700',
  },
  chapterTitle: {
    color: '#f0f6fc',
    fontSize: 18,
    fontWeight: '800',
  },
  chapterSummary: {
    color: '#8b949e',
    fontSize: 13,
    lineHeight: 18,
  },
  sectionsList: {
    gap: 12,
  },
  sectionCard: {
    backgroundColor: '#161b22',
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 8,
    padding: 14,
    gap: 8,
  },
  sectionHeading: {
    color: '#f0f6fc',
    fontSize: 14,
    fontWeight: '700',
  },
  sectionText: {
    color: '#c9d1d9',
    fontSize: 12.5,
    lineHeight: 19,
    whiteSpace: 'pre-wrap',
  },
  codeSnippetBox: {
    backgroundColor: '#090d12',
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 6,
    padding: 10,
    marginVertical: 4,
  },
  codeSnippetText: {
    color: '#58a6ff',
    fontFamily: 'Fira Code, monospace',
    fontSize: 11.5,
    lineHeight: 17,
  },
  snippetRunBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f6feb',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  snippetRunBtnText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
  },
  calloutBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(88, 166, 255, 0.08)',
    borderLeftWidth: 3,
    borderLeftColor: '#58a6ff',
    padding: 8,
    borderRadius: 4,
    gap: 6,
    alignItems: 'flex-start',
  },
  calloutText: {
    color: '#c9d1d9',
    fontSize: 11.5,
    lineHeight: 16,
    flex: 1,
  },
});
