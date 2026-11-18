import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    minHeight: '100%',
    width: '100%',
  },
  mainContainer: {
    flex: 1,
    padding: 10,
    minHeight: 0,
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
    borderWidth: 1,
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'transparent',
    gap: 4,
  },
  toggleBtnActive: {
    borderWidth: 1,
  },
  toggleBtnText: {
    fontSize: 11,
    fontWeight: '600',
  },
  toggleBtnTextActive: {
    fontWeight: '700',
  },
  tipHelp: {
    flex: 1,
    alignItems: 'flex-end',
    minWidth: 200,
  },
  tipHelpText: {
    fontSize: 11,
  },
  tabFlexWrapper: {
    flex: 1,
    gap: 8,
    minHeight: 0,
  },
  mobileSubNav: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 6,
    padding: 4,
    gap: 6,
  },
  mobileSubBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 4,
    gap: 6,
  },
  mobileSubBtnActive: {
    borderWidth: 1,
  },
  mobileSubBtnText: {
    fontSize: 11,
    fontWeight: '600',
  },
  mobileSubBtnTextActive: {
    fontWeight: '700',
  },
  contentPanesRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 0,
  },
  contentPanesColumn: {
    flexDirection: 'column',
    minHeight: 0,
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

export default styles;
