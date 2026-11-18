import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1117',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#30363d',
    overflow: 'hidden',
    minHeight: 0,
  },
  labsHeader: {
    backgroundColor: '#161b22',
    borderBottomWidth: 1,
    borderBottomColor: '#30363d',
    padding: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  titleText: {
    color: '#f0f6fc',
    fontSize: 14,
    fontWeight: '700',
  },
  labsScroll: {
    flexDirection: 'row',
    gap: 8,
  },
  labTab: {
    backgroundColor: '#21262d',
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 110,
  },
  labTabActive: {
    borderColor: '#e3b341',
    backgroundColor: 'rgba(227, 179, 65, 0.1)',
  },
  labTabTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  labLevel: {
    fontSize: 9,
    color: '#8b949e',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  labLevelActive: {
    color: '#e3b341',
  },
  labXp: {
    fontSize: 9,
    color: '#8b949e',
    fontWeight: '600',
  },
  labTabTitle: {
    fontSize: 12,
    color: '#c9d1d9',
    fontWeight: '600',
  },
  labTabTitleActive: {
    color: '#f0f6fc',
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
    backgroundColor: '#161b22',
    borderWidth: 1,
    borderColor: '#30363d',
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
    color: '#f0f6fc',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  overviewDesc: {
    color: '#8b949e',
    fontSize: 12,
    lineHeight: 18,
    maxWidth: 420,
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(227, 179, 65, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(227, 179, 65, 0.3)',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  xpBadgeText: {
    color: '#e3b341',
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
    color: '#8b949e',
  },
  progressValue: {
    fontSize: 11,
    color: '#58a6ff',
    fontWeight: '600',
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#21262d',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#238636',
    borderRadius: 3,
  },
  congratsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(63, 185, 80, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(63, 185, 80, 0.3)',
    borderRadius: 6,
    padding: 8,
    gap: 8,
  },
  congratsText: {
    color: '#3fb950',
    fontSize: 12,
    fontWeight: '600',
  },
  stepsList: {
    gap: 10,
  },
  stepsSectionTitle: {
    color: '#f0f6fc',
    fontSize: 13,
    fontWeight: '700',
  },
  stepCard: {
    backgroundColor: '#161b22',
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  stepCardCompleted: {
    borderColor: '#238636',
    backgroundColor: 'rgba(35, 134, 54, 0.05)',
  },
  stepCardCurrent: {
    borderColor: '#58a6ff',
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
    color: '#58a6ff',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  stepInstruction: {
    fontSize: 13,
    color: '#f0f6fc',
    lineHeight: 18,
  },
  textCompleted: {
    color: '#8b949e',
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
  },
  hintToggleText: {
    color: '#8b949e',
    fontSize: 11,
  },
  autoRunBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f6feb',
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
    backgroundColor: '#0d1117',
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 6,
    padding: 8,
    marginTop: 4,
  },
  hintLabel: {
    color: '#e3b341',
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 2,
  },
  hintCode: {
    color: '#58a6ff',
    fontFamily: 'Fira Code, monospace',
    fontSize: 11,
  },
});

export default styles;
