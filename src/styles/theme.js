/**
 * DockMaster Theme Palette Constants
 * Separated theme definitions for Dark and White-Cream themes.
 */
export const THEME_COLORS = {
  dark: {
    name: 'dark',
    bg: '#0d1117',
    cardBg: '#161b22',
    cardBorder: '#30363d',
    cardSubBg: '#21262d',
    headerBg: '#161b22',
    text: '#f0f6fc',
    textSub: '#c9d1d9',
    textMuted: '#8b949e',
    primary: '#58a6ff',
    primaryBg: 'rgba(88, 166, 255, 0.15)',
    primaryBorder: 'rgba(88, 166, 255, 0.4)',
    success: '#3fb950',
    successBg: 'rgba(63, 185, 80, 0.15)',
    warning: '#e3b341',
    warningBg: 'rgba(227, 179, 65, 0.15)',
    danger: '#f85149',
    dangerBg: 'rgba(248, 81, 73, 0.15)',
    termBg: '#090d12',
    termFrame: '#161b22',
    termBorder: '#21262d',
    inputBg: '#0d1117',
    inputBorder: '#30363d',
    chipBg: '#161b22',
    chipBorder: '#30363d',
    toggleBarBg: '#161b22',
  },
  light: {
    name: 'light',
    // White-Cream theme palette
    bg: '#FAF7F2',              // Soft warm white-cream base
    cardBg: '#FFFFFF',          // Crisp pure white cards
    cardBorder: '#E7E0D6',      // Warm cream border
    cardSubBg: '#F3EDE4',       // Cream sub-surface
    headerBg: '#FFFDF9',        // Warm white header
    text: '#1C1917',            // Deep stone charcoal text
    textSub: '#44403C',         // Warm secondary text
    textMuted: '#78716C',       // Muted warm stone
    primary: '#0969DA',         // Vivid Docker blue
    primaryBg: 'rgba(9, 105, 218, 0.1)',
    primaryBorder: 'rgba(9, 105, 218, 0.35)',
    success: '#1A7F37',         // Forest green
    successBg: 'rgba(26, 127, 55, 0.1)',
    warning: '#9A6700',         // Amber gold
    warningBg: 'rgba(154, 103, 0, 0.1)',
    danger: '#CF222E',          // Clean crimson red
    dangerBg: 'rgba(207, 34, 46, 0.1)',
    termBg: '#1E232A',          // Dark contrast shell interior
    termFrame: '#F3EDE4',       // Cream frame
    termBorder: '#E2D9CC',
    inputBg: '#FFFFFF',
    inputBorder: '#D8D0C5',
    chipBg: '#F5EFEB',
    chipBorder: '#E5DDD1',
    toggleBarBg: '#FFFFFF',
  },
};

export default THEME_COLORS;
