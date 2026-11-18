import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { createStyles } from '../styles/header.styles';
import {
  Terminal,
  Award,
  BookOpen,
  FileCode,
  Stethoscope,
  BookmarkCheck,
  RefreshCw,
  Layers,
  Sun,
  Moon,
  Globe,
} from 'lucide-react';
import { useResponsive } from '../hooks/useResponsive';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useHorizontalScroll } from '../hooks/useHorizontalScroll';

export default function Header({
  activeTab,
  setActiveTab,
  runningCount,
  totalCount,
  xp,
  onReset,
}) {
  const { isMobile } = useResponsive();
  const { isDark, toggleTheme, colors } = useTheme();
  const { isKhmer, toggleLanguage, t } = useLanguage();
  const styles = createStyles(colors, isDark, isKhmer);
  const { scrollRef: navScrollRef } = useHorizontalScroll();

  const tabs = [
    { id: 'workspace', labelKey: 'tabWorkspace', defaultLabel: 'Terminal & Architecture', icon: Terminal },
    { id: 'labs', labelKey: 'tabLabs', defaultLabel: 'Guided Labs', icon: Award, badgeKey: 'badge6Labs', defaultBadge: '6 Labs' },
    { id: 'doctor', labelKey: 'tabDoctor', defaultLabel: 'Docker Doctor', icon: Stethoscope, badgeKey: 'badgeAiHelp', defaultBadge: 'AI Help' },
    { id: 'optimizer', labelKey: 'tabOptimizer', defaultLabel: 'Dockerfile Analyzer', icon: FileCode },
    { id: 'guide', labelKey: 'tabGuide', defaultLabel: 'Visual Learning', icon: BookOpen },
    { id: 'cheatsheet', labelKey: 'tabCheatsheet', defaultLabel: 'Cheatsheet', icon: BookmarkCheck },
  ];

  return (
    <View style={styles.headerContainer}>
      {/* Top Bar */}
      <View style={[styles.topRow, isMobile && styles.topRowMobile]}>
        <View style={styles.brandGroup}>
          <View style={styles.logoBadge}>
            <Layers size={22} color={colors.primary} />
          </View>
          <View>
            <View style={styles.titleRow}>
              <Text style={styles.brandTitle}>{t('brandTitle', 'DockMaster')}</Text>
              <View style={styles.proBadge}>
                <Text style={styles.proText}>PRO</Text>
              </View>
            </View>
            <Text style={styles.brandSubtitle}>
              {t('brandSubtitle', 'Interactive Docker & Server Learning Platform')}
            </Text>
          </View>
        </View>

        {/* Stats, Language, Theme & Actions */}
        <View style={styles.statsRow}>
          {/* Active Containers Pill */}
          <View style={styles.statPill}>
            <View style={[styles.statusDot, runningCount > 0 ? styles.statusActive : styles.statusIdle]} />
            <Text style={styles.statText}>
              <Text style={styles.statBold}>{runningCount}</Text>/{totalCount} {t('running', 'Running')}
            </Text>
          </View>

          {/* XP Pill */}
          <View style={[styles.statPill, styles.xpPill]}>
            <Award size={14} color="#e3b341" />
            <Text style={styles.xpText}>{xp} {t('xpBonus', 'XP')}</Text>
          </View>

          {/* Language Switcher (EN ↔ ខ្មែរ) */}
          <TouchableOpacity
            style={[styles.actionPill, styles.langPill]}
            onPress={toggleLanguage}
            activeOpacity={0.7}
            title={isKhmer ? 'ប្តូរទៅភាសាអង់គ្លេស' : 'Switch to Khmer language'}
          >
            <Globe size={13} color={isKhmer ? colors.primary : colors.textMuted} />
            <Text style={styles.langPillText}>
              {isKhmer ? '🇰🇭 ខ្មែរ' : '🇺🇸 EN'}
            </Text>
          </TouchableOpacity>

          {/* Theme Toggle Button (White-Cream Light ↔ Dark) */}
          <TouchableOpacity
            style={[styles.actionPill, styles.themePill]}
            onPress={toggleTheme}
            activeOpacity={0.7}
            title={isDark ? 'Switch to White-Cream Light Mode' : 'Switch to Dark Mode'}
          >
            {!isDark ? (
              <Sun size={13} color="#9A6700" />
            ) : (
              <Moon size={13} color="#58a6ff" />
            )}
            {!isMobile && (
              <Text style={styles.themePillText}>
                {!isDark ? (isKhmer ? 'White-Cream ពន្លឺ' : 'White-Cream') : (isKhmer ? 'ងងឹត Dark' : 'Dark')}
              </Text>
            )}
          </TouchableOpacity>

          {/* Reset Sandbox */}
          <TouchableOpacity
            style={styles.resetButton}
            onPress={onReset}
            activeOpacity={0.7}
          >
            <RefreshCw size={13} color={colors.textMuted} />
            {!isMobile && <Text style={styles.resetText}>{t('reset', 'Reset')}</Text>}
          </TouchableOpacity>
        </View>
      </View>

      {/* Navigation Tabs (Scrollable on Mobile) */}
      <View style={styles.navBar}>
        <ScrollView
          ref={navScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.navScroll}
        >
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const label = t(tab.labelKey, tab.defaultLabel);
            const badge = tab.badgeKey ? t(tab.badgeKey, tab.defaultBadge) : null;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                style={[
                  styles.navTab,
                  isActive && styles.navTabActive
                ]}
                activeOpacity={0.8}
              >
                <Icon size={16} color={isActive ? colors.primary : colors.textMuted} />
                <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                  {label}
                </Text>
                {badge && (
                  <View style={[
                    styles.tabBadge,
                    isActive && styles.tabBadgeActive
                  ]}>
                    <Text style={[
                      styles.tabBadgeText,
                      isActive && styles.tabBadgeTextActive
                    ]}>
                      {badge}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}
