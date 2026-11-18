import { StyleSheet } from 'react-native';

export const createStyles = (colors, isDark = true) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.cardBg,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      overflow: 'hidden',
      minHeight: 0,
    },
    guideHeader: {
      backgroundColor: colors.cardSubBg,
      borderBottomWidth: 1,
      borderBottomColor: colors.cardBorder,
      padding: 12,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8,
    },
    titleText: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '700',
    },
    chaptersScroll: {
      flexDirection: 'row',
      gap: 8,
    },
    chapterTab: {
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      borderRadius: 6,
      paddingHorizontal: 12,
      paddingVertical: 6,
      minWidth: 130,
      gap: 2,
    },
    chapterTabActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primaryBg,
    },
    chapterTabTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    badgeText: {
      fontSize: 9,
      color: colors.textMuted,
      fontWeight: '700',
      textTransform: 'uppercase',
    },
    badgeTextActive: {
      color: colors.primary,
    },
    chapterTabTitle: {
      fontSize: 12,
      color: colors.textSub,
      fontWeight: '600',
    },
    chapterTabTitleActive: {
      color: colors.primary,
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
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      borderRadius: 8,
      padding: 14,
      gap: 6,
    },
    chapterBadgeRow: {
      flexDirection: 'row',
    },
    chapterBadge: {
      backgroundColor: colors.primaryBg,
      borderColor: colors.primary,
      borderWidth: 1,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 12,
    },
    chapterBadgeLabel: {
      color: colors.primary,
      fontSize: 10,
      fontWeight: '700',
    },
    chapterTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: '800',
    },
    chapterSummary: {
      color: colors.textSub,
      fontSize: 13,
      lineHeight: 18,
    },
    sectionsList: {
      gap: 12,
    },
    sectionCard: {
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      borderRadius: 8,
      padding: 14,
      gap: 8,
    },
    sectionHeading: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '700',
    },
    sectionText: {
      color: colors.textSub,
      fontSize: 12.5,
      lineHeight: 19,
      whiteSpace: 'pre-wrap',
    },
    codeSnippetBox: {
      backgroundColor: isDark ? '#161b22' : '#F3EDE4',
      borderWidth: 1,
      borderColor: colors.cardBorder,
      borderRadius: 6,
      padding: 10,
      marginVertical: 4,
    },
    codeSnippetText: {
      color: colors.text,
      fontFamily: 'Fira Code, monospace',
      fontSize: 11.5,
      lineHeight: 17,
    },
    snippetRunBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
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
      backgroundColor: colors.primaryBg,
      borderLeftWidth: 3,
      borderLeftColor: colors.primary,
      padding: 8,
      borderRadius: 4,
      gap: 6,
      alignItems: 'flex-start',
    },
    calloutText: {
      color: colors.text,
      fontSize: 11.5,
      lineHeight: 16,
      flex: 1,
    },
  });

export default createStyles;
