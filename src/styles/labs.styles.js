import { StyleSheet } from 'react-native';

export const createStyles = (colors) =>
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
    labsHeader: {
      backgroundColor: colors.cardSubBg,
      borderBottomWidth: 1,
      borderBottomColor: colors.cardBorder,
      padding: 12,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 10,
    },
    titleText: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '700',
    },
    labsScroll: {
      flexDirection: 'row',
      gap: 8,
    },
    labTab: {
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      borderRadius: 6,
      paddingHorizontal: 12,
      paddingVertical: 8,
      minWidth: 110,
    },
    labTabActive: {
      borderColor: colors.warning,
      backgroundColor: colors.warningBg,
    },
    labTabTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    labLevel: {
      fontSize: 9,
      color: colors.textMuted,
      fontWeight: '700',
      textTransform: 'uppercase',
    },
    labLevelActive: {
      color: colors.warning,
    },
    labXp: {
      fontSize: 9,
      color: colors.textMuted,
      fontWeight: '600',
    },
    labTabTitle: {
      fontSize: 12,
      color: colors.textSub,
      fontWeight: '600',
    },
    labTabTitleActive: {
      color: colors.text,
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
      backgroundColor: colors.cardSubBg,
      borderWidth: 1,
      borderColor: colors.cardBorder,
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
      color: colors.text,
      fontSize: 16,
      fontWeight: '800',
      marginBottom: 4,
    },
    overviewDesc: {
      color: colors.textMuted,
      fontSize: 12,
      lineHeight: 18,
      maxWidth: 420,
    },
    xpBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.warningBg,
      borderWidth: 1,
      borderColor: colors.warning,
      borderRadius: 16,
      paddingHorizontal: 8,
      paddingVertical: 4,
      gap: 4,
    },
    xpBadgeText: {
      color: colors.warning,
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
      color: colors.textMuted,
    },
    progressValue: {
      fontSize: 11,
      color: colors.primary,
      fontWeight: '600',
    },
    progressTrack: {
      height: 6,
      backgroundColor: colors.cardBorder,
      borderRadius: 3,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.success,
      borderRadius: 3,
    },
    congratsBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.successBg,
      borderWidth: 1,
      borderColor: colors.success,
      borderRadius: 6,
      padding: 8,
      gap: 8,
    },
    congratsText: {
      color: colors.success,
      fontSize: 12,
      fontWeight: '600',
    },
    stepsList: {
      gap: 10,
    },
    stepsSectionTitle: {
      color: colors.text,
      fontSize: 13,
      fontWeight: '700',
    },
    stepCard: {
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      borderRadius: 8,
      padding: 12,
      gap: 8,
    },
    stepCardCompleted: {
      borderColor: colors.success,
      backgroundColor: colors.successBg,
    },
    stepCardCurrent: {
      borderColor: colors.primary,
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
      color: colors.primary,
      fontWeight: '700',
      textTransform: 'uppercase',
    },
    stepInstruction: {
      fontSize: 13,
      color: colors.text,
      lineHeight: 18,
    },
    textCompleted: {
      color: colors.textMuted,
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
      backgroundColor: colors.cardSubBg,
      borderColor: colors.cardBorder,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      borderWidth: 1,
    },
    hintToggleText: {
      color: colors.textMuted,
      fontSize: 11,
    },
    autoRunBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
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
      backgroundColor: colors.cardSubBg,
      borderWidth: 1,
      borderColor: colors.warning,
      borderRadius: 6,
      padding: 8,
      marginTop: 4,
    },
    hintLabel: {
      color: colors.warning,
      fontSize: 10,
      fontWeight: '700',
      marginBottom: 2,
    },
    hintCode: {
      color: colors.text,
      fontFamily: 'Fira Code, monospace',
      fontSize: 11,
    },
  });

export default createStyles;
