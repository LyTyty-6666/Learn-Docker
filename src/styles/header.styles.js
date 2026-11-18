import { StyleSheet } from 'react-native';

export const createStyles = (colors, isDark = true, isKhmer = false) =>
  StyleSheet.create({
    headerContainer: {
      backgroundColor: colors.headerBg,
      borderBottomWidth: 1,
      borderBottomColor: colors.cardBorder,
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
      borderWidth: 1,
      backgroundColor: colors.primaryBg,
      borderColor: colors.primaryBorder,
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
      letterSpacing: -0.3,
      color: colors.text,
    },
    proBadge: {
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: colors.primary,
    },
    proText: {
      fontSize: 10,
      fontWeight: '800',
      color: '#ffffff',
    },
    brandSubtitle: {
      fontSize: 12,
      color: colors.textMuted,
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
      backgroundColor: colors.cardSubBg,
      borderColor: colors.cardBorder,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 16,
      borderWidth: 1,
      gap: 6,
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    statusActive: {
      backgroundColor: '#3fb950',
    },
    statusIdle: {
      backgroundColor: '#8b949e',
    },
    statText: {
      fontSize: 12,
      color: colors.textSub,
    },
    statBold: {
      fontWeight: '700',
      color: colors.text,
    },
    xpPill: {
      backgroundColor: colors.warningBg,
      borderColor: colors.warning,
      borderWidth: 1,
    },
    xpText: {
      color: colors.warning,
      fontWeight: '700',
      fontSize: 12,
    },
    actionPill: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 16,
      borderWidth: 1,
      gap: 5,
      cursor: 'pointer',
    },
    langPill: {
      backgroundColor: isKhmer ? colors.primaryBg : colors.cardSubBg,
      borderColor: isKhmer ? colors.primary : colors.cardBorder,
    },
    langPillText: {
      color: isKhmer ? colors.primary : colors.text,
      fontWeight: '700',
      fontSize: 11,
    },
    themePill: {
      backgroundColor: !isDark ? '#FFF2D9' : colors.cardSubBg,
      borderColor: !isDark ? '#E5B869' : colors.cardBorder,
    },
    themePillText: {
      color: !isDark ? '#7A5200' : colors.textSub,
      fontWeight: '600',
      fontSize: 11,
    },
    pillText: {
      fontSize: 11,
    },
    resetButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.cardSubBg,
      borderColor: colors.cardBorder,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 16,
      borderWidth: 1,
      gap: 4,
      cursor: 'pointer',
    },
    resetText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.textMuted,
    },
    navBar: {
      borderTopWidth: 1,
      borderTopColor: colors.cardBorder,
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
      backgroundColor: colors.cardSubBg,
      borderBottomWidth: 2,
      borderBottomColor: colors.primary,
    },
    navLabel: {
      fontSize: 13,
      fontWeight: '500',
      color: colors.textMuted,
    },
    navLabelActive: {
      fontWeight: '700',
      color: colors.text,
    },
    tabBadge: {
      backgroundColor: colors.cardBorder,
      paddingHorizontal: 6,
      paddingVertical: 1,
      borderRadius: 10,
    },
    tabBadgeActive: {
      backgroundColor: colors.primaryBg,
    },
    tabBadgeText: {
      fontSize: 10,
      fontWeight: '600',
      color: colors.textMuted,
    },
    tabBadgeTextActive: {
      color: colors.primary,
    },
  });

export default createStyles;
