import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  headerContainer: {
    borderBottomWidth: 1,
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
  },
  proBadge: {
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
  },
  statBold: {
    fontWeight: '700',
  },
  xpPill: {
    borderWidth: 1,
  },
  xpText: {
    color: '#e3b341',
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
  themePill: {
    gap: 5,
  },
  pillText: {
    fontSize: 11,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  navBar: {
    borderTopWidth: 1,
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
    borderBottomWidth: 2,
  },
  navLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  navLabelActive: {
    fontWeight: '700',
  },
  tabBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  tabBadgeActive: {},
  tabBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  tabBadgeTextActive: {},
});

export default styles;
