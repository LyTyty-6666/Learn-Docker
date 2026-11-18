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
  guideHeader: {
    backgroundColor: '#161b22',
    borderBottomWidth: 1,
    borderBottomColor: '#30363d',
    padding: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  titleText: {
    color: '#f0f6fc',
    fontSize: 14,
    fontWeight: '700',
  },
  chaptersScroll: {
    flexDirection: 'row',
    gap: 8,
  },
  chapterTab: {
    backgroundColor: '#21262d',
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 130,
    gap: 2,
  },
  chapterTabActive: {
    borderColor: '#58a6ff',
    backgroundColor: 'rgba(88, 166, 255, 0.1)',
  },
  chapterTabTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badgeText: {
    fontSize: 9,
    color: '#8b949e',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  badgeTextActive: {
    color: '#58a6ff',
  },
  chapterTabTitle: {
    fontSize: 12,
    color: '#c9d1d9',
    fontWeight: '600',
  },
  chapterTabTitleActive: {
    color: '#f0f6fc',
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
    backgroundColor: '#161b22',
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 8,
    padding: 14,
    gap: 6,
  },
  chapterBadgeRow: {
    flexDirection: 'row',
  },
  chapterBadge: {
    backgroundColor: 'rgba(88, 166, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  chapterBadgeLabel: {
    color: '#58a6ff',
    fontSize: 10,
    fontWeight: '700',
  },
  chapterTitle: {
    color: '#f0f6fc',
    fontSize: 18,
    fontWeight: '800',
  },
  chapterSummary: {
    color: '#8b949e',
    fontSize: 13,
    lineHeight: 18,
  },
  sectionsList: {
    gap: 12,
  },
  sectionCard: {
    backgroundColor: '#161b22',
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 8,
    padding: 14,
    gap: 8,
  },
  sectionHeading: {
    color: '#f0f6fc',
    fontSize: 14,
    fontWeight: '700',
  },
  sectionText: {
    color: '#c9d1d9',
    fontSize: 12.5,
    lineHeight: 19,
    whiteSpace: 'pre-wrap',
  },
  codeSnippetBox: {
    backgroundColor: '#090d12',
    borderWidth: 1,
    borderColor: '#30363d',
    borderRadius: 6,
    padding: 10,
    marginVertical: 4,
  },
  codeSnippetText: {
    color: '#58a6ff',
    fontFamily: 'Fira Code, monospace',
    fontSize: 11.5,
    lineHeight: 17,
  },
  snippetRunBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f6feb',
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
    backgroundColor: 'rgba(88, 166, 255, 0.08)',
    borderLeftWidth: 3,
    borderLeftColor: '#58a6ff',
    padding: 8,
    borderRadius: 4,
    gap: 6,
    alignItems: 'flex-start',
  },
  calloutText: {
    color: '#c9d1d9',
    fontSize: 11.5,
    lineHeight: 16,
    flex: 1,
  },
});

export default styles;
