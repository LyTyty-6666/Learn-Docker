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
    header: {
      backgroundColor: colors.cardSubBg,
      borderBottomWidth: 1,
      borderBottomColor: colors.cardBorder,
      padding: 14,
      gap: 10,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
    },
    titleLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    matchCountBadge: {
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 12,
    },
    matchCountText: {
      color: colors.primary,
      fontSize: 11,
      fontWeight: '600',
    },
    titleText: {
      color: colors.text,
      fontSize: 15,
      fontWeight: '700',
    },
    clearSearchBtn: {
      padding: 2,
    },
    searchBox: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      borderRadius: 6,
      paddingHorizontal: 10,
      paddingVertical: 6,
      gap: 8,
    },
    searchInput: {
      flex: 1,
      color: colors.text,
      fontSize: 12,
      outlineStyle: 'none',
    },
    bodyScroll: {
      flex: 1,
      minHeight: 0,
    },
    bodyContent: {
      padding: 14,
      gap: 14,
    },
    categoryCard: {
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      borderRadius: 8,
      padding: 12,
      gap: 8,
    },
    categoryTitle: {
      color: colors.primary,
      fontSize: 13,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    itemsList: {
      gap: 8,
    },
    cmdRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.cardSubBg,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      borderRadius: 6,
      padding: 8,
      gap: 8,
      flexWrap: 'wrap',
    },
    cmdInfo: {
      flex: 1,
      minWidth: 200,
      gap: 2,
    },
    cmdText: {
      color: colors.text,
      fontFamily: 'Fira Code, monospace',
      fontSize: 11.5,
      fontWeight: '600',
    },
    descText: {
      color: colors.textSub,
      fontSize: 11,
    },
    actionsGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    actionBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      gap: 4,
    },
    actionBtnText: {
      color: '#ffffff',
      fontSize: 10,
      fontWeight: '700',
    },
    copyBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      paddingHorizontal: 6,
      paddingVertical: 4,
      borderRadius: 4,
      gap: 3,
    },
    copyBtnText: {
      color: colors.textSub,
      fontSize: 10,
    },
    emptyBox: {
      padding: 24,
      alignItems: 'center',
    },
    emptyText: {
      color: colors.textMuted,
      fontSize: 13,
    },
  });

export default createStyles;
