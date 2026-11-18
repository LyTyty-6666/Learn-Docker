import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { createStyles } from '../styles/guide.styles';
import {
  BookOpen,
  Info,
  Play,
} from 'lucide-react';
import { GUIDE_CHAPTERS } from '../data/guideData';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useHorizontalScroll } from '../hooks/useHorizontalScroll';

export default function LearningGuide({ onExecuteCommand }) {
  const { colors, isDark } = useTheme();
  const { t } = useLanguage();
  const styles = createStyles(colors, isDark);
  const [activeChapterId, setActiveChapterId] = useState(GUIDE_CHAPTERS[0].id);
  const { scrollRef: guideScrollRef } = useHorizontalScroll();

  const activeChapter = GUIDE_CHAPTERS.find(c => c.id === activeChapterId) || GUIDE_CHAPTERS[0];

  return (
    <View style={styles.container}>
      {/* Sidebar / Chapters Selector */}
      <View style={styles.guideHeader}>
        <View style={styles.titleRow}>
          <BookOpen size={18} color={colors.primary} />
          <Text style={styles.titleText}>{t('guideTitle', 'Docker & Server Connection Knowledge Base')}</Text>
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
                  isSelected && styles.chapterTabActive
                ]}
                onPress={() => setActiveChapterId(ch.id)}
                activeOpacity={0.8}
              >
                <View style={styles.chapterTabTop}>
                  <Text style={[
                    styles.badgeText,
                    isSelected && styles.badgeTextActive
                  ]}>
                    {ch.badge}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.chapterTabTitle,
                    isSelected && styles.chapterTabTitleActive
                  ]}
                  numberOfLines={1}
                >
                  {ch.title.split('.')[1] || ch.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Main Chapter Content */}
      <ScrollView style={styles.contentScroll} contentContainerStyle={styles.contentPadding}>
        <View style={styles.chapterHeaderCard}>
          <View style={styles.chapterBadgeRow}>
            <View style={styles.chapterBadge}>
              <Text style={styles.chapterBadgeLabel}>{activeChapter.badge}</Text>
            </View>
          </View>
          <Text style={styles.chapterTitle}>{activeChapter.title}</Text>
          <Text style={styles.chapterSummary}>{activeChapter.summary}</Text>
        </View>

        <View style={styles.sectionsList}>
          {activeChapter.content.map((sec, idx) => (
            <View key={idx} style={styles.sectionCard}>
              <Text style={styles.sectionHeading}>{sec.heading}</Text>
              <Text style={styles.sectionText}>{sec.text}</Text>

              {sec.codeSnippet && (
                <View style={styles.codeSnippetBox}>
                  <Text style={styles.codeSnippetText} selectable={true}>
                    {sec.codeSnippet}
                  </Text>
                  {sec.codeSnippet.startsWith('docker run') && (
                    <TouchableOpacity
                      style={styles.snippetRunBtn}
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
                <View style={styles.calloutBox}>
                  <Info size={14} color={colors.primary} />
                  <Text style={styles.calloutText}>{sec.callout}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
