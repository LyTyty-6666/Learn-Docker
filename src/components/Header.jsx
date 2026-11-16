import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import {
  Terminal,
  Activity,
  Award,
  BookOpen,
  FileCode,
  Stethoscope,
  BookmarkCheck,
  RefreshCw,
  Layers,
  Smartphone,
  Tablet,
  Monitor,
} from 'lucide-react';
import { useResponsive } from '../hooks/useResponsive';

export default function Header({
  activeTab,
  setActiveTab,
  runningCount,
  totalCount,
  xp,
  onReset,
}) {
  const { isMobile, isTablet, isDesktop, breakpoint } = useResponsive();

  const tabs = [
    { id: 'workspace', label: 'Terminal & Architecture', icon: Terminal },
    { id: 'labs', label: 'Guided Labs', icon: Award, badge: '5 Labs' },
    { id: 'doctor', label: 'Docker Doctor', icon: Stethoscope, badge: 'AI Help' },
    { id: 'optimizer', label: 'Dockerfile Analyzer', icon: FileCode },
    { id: 'guide', label: 'Visual Learning', icon: BookOpen },
    { id: 'cheatsheet', label: 'Cheatsheet', icon: BookmarkCheck },
  ];

  return (
    <View style={styles.headerContainer}>
      {/* Top Bar */}
      <View style={[styles.topRow, isMobile && styles.topRowMobile]}>
        <View style={styles.brandGroup}>
          <View style={styles.logoBadge}>
            <Layers size={22} color="#58a6ff" />
          </View>
          <View>
            <View style={styles.titleRow}>
              <Text style={styles.brandTitle}>DockMaster</Text>
              <View style={styles.proBadge}>
                <Text style={styles.proText}>PRO</Text>
              </View>
            </View>
            <Text style={styles.brandSubtitle}>Interactive Docker & Server Learning Platform</Text>
          </View>
        </View>

        {/* Stats & Actions */}
        <View style={styles.statsRow}>
          {/* Active Containers Pill */}
          <View style={styles.statPill}>
            <View style={[styles.statusDot, runningCount > 0 ? styles.statusActive : styles.statusIdle]} />
            <Text style={styles.statText}>
              <Text style={styles.statBold}>{runningCount}</Text>/{totalCount} Running
            </Text>
          </View>

          {/* XP Pill */}
          <View style={[styles.statPill, styles.xpPill]}>
            <Award size={14} color="#e3b341" />
            <Text style={styles.xpText}>{xp} XP</Text>
          </View>

          {/* Device Responsive Pill */}
          <View style={styles.devicePill}>
            {isMobile && <Smartphone size={13} color="#8b949e" />}
            {isTablet && <Tablet size={13} color="#8b949e" />}
            {isDesktop && <Monitor size={13} color="#8b949e" />}
            <Text style={styles.deviceText}>{breakpoint.toUpperCase()}</Text>
          </View>

          {/* Reset Sandbox */}
          <TouchableOpacity
            style={styles.resetButton}
            onPress={onReset}
            activeOpacity={0.7}
          >
            <RefreshCw size={13} color="#8b949e" />
            {!isMobile && <Text style={styles.resetText}>Reset</Text>}
          </TouchableOpacity>
        </View>
      </View>

      {/* Navigation Tabs (Scrollable on Mobile) */}
      <View style={styles.navBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.navScroll}
        >
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                style={[styles.navTab, isActive && styles.navTabActive]}
                activeOpacity={0.8}
              >
                <Icon size={16} color={isActive ? '#58a6ff' : '#8b949e'} />
                <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                  {tab.label}
                </Text>
                {tab.badge && (
                  <View style={[styles.tabBadge, isActive && styles.tabBadgeActive]}>
                    <Text style={[styles.tabBadgeText, isActive && styles.tabBadgeTextActive]}>
                      {tab.badge}
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

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#161b22',
    borderBottomWidth: 1,
    borderBottomColor: '#30363d',
    zIndex: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  topRowMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 8,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: 'rgba(88, 166, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(88, 166, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#f0f6fc',
    letterSpacing: -0.3,
  },
  proBadge: {
    backgroundColor: '#1f6feb',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  proText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#ffffff',
  },
  brandSubtitle: {
    fontSize: 12,
    color: '#8b949e',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#21262d',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#30363d',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusActive: {
    backgroundColor: '#3fb950',
    boxShadow: '0 0 8px rgba(63, 185, 80, 0.6)',
  },
  statusIdle: {
    backgroundColor: '#8b949e',
  },
  statText: {
    color: '#c9d1d9',
    fontSize: 12,
  },
  statBold: {
    fontWeight: '700',
    color: '#f0f6fc',
  },
  xpPill: {
    borderColor: 'rgba(227, 179, 65, 0.3)',
    backgroundColor: 'rgba(227, 179, 65, 0.1)',
  },
  xpText: {
    color: '#e3b341',
    fontWeight: '700',
    fontSize: 12,
  },
  devicePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#21262d',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#30363d',
    gap: 5,
  },
  deviceText: {
    color: '#8b949e',
    fontSize: 10,
    fontWeight: '700',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#21262d',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#30363d',
    gap: 4,
  },
  resetText: {
    color: '#8b949e',
    fontSize: 12,
  },
  navBar: {
    borderTopWidth: 1,
    borderTopColor: '#21262d',
    paddingHorizontal: 8,
  },
  navScroll: {
    flexDirection: 'row',
    paddingVertical: 6,
    gap: 6,
  },
  navTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6,
    gap: 8,
  },
  navTabActive: {
    backgroundColor: '#21262d',
    borderBottomWidth: 2,
    borderBottomColor: '#58a6ff',
  },
  navLabel: {
    fontSize: 13,
    color: '#8b949e',
    fontWeight: '500',
  },
  navLabelActive: {
    color: '#f0f6fc',
    fontWeight: '700',
  },
  tabBadge: {
    backgroundColor: '#30363d',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  tabBadgeActive: {
    backgroundColor: 'rgba(88, 166, 255, 0.2)',
  },
  tabBadgeText: {
    fontSize: 10,
    color: '#8b949e',
    fontWeight: '600',
  },
  tabBadgeTextActive: {
    color: '#58a6ff',
  },
});
