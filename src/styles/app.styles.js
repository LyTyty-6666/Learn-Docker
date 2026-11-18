import { StyleSheet } from 'react-native';

export const createStyles = (colors, isDark = true) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      minHeight: '100%',
      width: '100%',
      backgroundColor: colors.bg,
    },
    mainContainer: {
      flex: 1,
      padding: 10,
      minHeight: 0,
      backgroundColor: colors.bg,
    },
    workspaceWrapper: {
      flex: 1,
      gap: 8,
      minHeight: 0,
    },
    viewToggleBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.toggleBarBg || colors.cardSubBg,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      borderRadius: 6,
      paddingHorizontal: 8,
      paddingVertical: 5,
      flexWrap: 'wrap',
      gap: 6,
    },
    toggleButtonsGroup: {
      flexDirection: 'row',
      gap: 6,
    },
    toggleBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.cardSubBg,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: 'transparent',
      gap: 4,
    },
    toggleBtnActive: {
      backgroundColor: colors.primaryBg,
      borderColor: colors.primary,
    },
    toggleBtnText: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.textMuted,
    },
    toggleBtnTextActive: {
      fontWeight: '700',
      color: colors.primary,
    },
    tipHelp: {
      flex: 1,
      alignItems: 'flex-end',
      minWidth: 200,
    },
    tipHelpText: {
      fontSize: 11,
      color: colors.textMuted,
    },
    tabFlexWrapper: {
      flex: 1,
      gap: 8,
      minHeight: 0,
    },
    mobileSubNav: {
      flexDirection: 'row',
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      borderRadius: 6,
      padding: 4,
      gap: 6,
    },
    mobileSubBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.cardSubBg,
      paddingVertical: 6,
      borderRadius: 4,
      gap: 6,
    },
    mobileSubBtnActive: {
      backgroundColor: colors.primaryBg,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    mobileSubBtnText: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.textMuted,
    },
    mobileSubBtnTextActive: {
      fontWeight: '700',
      color: colors.primary,
    },
    contentPanesRow: {
      flex: 1,
      flexDirection: 'row',
      gap: 10,
      minHeight: 0,
    },
    contentPanesColumn: {
      flexDirection: 'column',
    },
    paneHalf: {
      flex: 1,
      minHeight: 0,
    },
    paneFull: {
      flex: 1,
      minHeight: 0,
    },
    paneHidden: {
      display: 'none',
    },
  });

export default createStyles;
