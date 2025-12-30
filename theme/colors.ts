/**
 * Theme Colors Configuration
 *
 * This file contains all color definitions used throughout the application.
 * Colors are organized by semantic meaning and purpose.
 */

export const themeColors = {
  // Base colors
  background: {
    default: '#ffffff',
    secondary: '#f9fafb', // gray-50
    dark: '#000000',
  },
  foreground: {
    default: '#171717',
    light: '#ffffff',
  },

  // Gray scale
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    300: '#d1d5db',
    400: '#9ca3af',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },

  // Blue colors (primary actions)
  blue: {
    100: '#dbeafe',
    400: '#60a5fa',
    600: '#2563eb',
    700: '#1d4ed8',
  },

  // Red colors (errors, destructive actions)
  red: {
    100: '#fee2e2',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },

  // Green colors (success actions)
  green: {
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
  },

  // Yellow colors (warning)
  yellow: {
    500: '#eab308',
  },

  // Sky colors (info actions)
  sky: {
    500: '#0ea5e9',
    600: '#0284c7',
  },

  // Zinc colors (neutral grays)
  zinc: {
    50: '#fafafa',
    400: '#a1a1aa',
    600: '#52525b',
    950: '#09090b',
  },

  // Semantic colors
  white: '#ffffff',
  black: '#000000',

  // Custom colors
  custom: {
    hoverDark: '#383838',
    hoverLight: '#ccc',
    hoverBg: '#1a1a1a',
    headerBlue: '#003C8F', // Header/Navigation primary color
    sidebarBg: '#dcddddff', // Sidebar background
    menuActive: '#1c1c21', // Active menu item background
  },

  // Border colors
  border: {
    default: '#d1d5db', // gray-300
    error: '#ef4444', // red-500
    focus: '#2563eb', // blue-600
    focusRing: {
      blue: '#60a5fa', // blue-400
      red: '#f87171', // red-400
    },
    light: 'rgba(0, 0, 0, 0.08)',
    dark: 'rgba(255, 255, 255, 0.145)',
  },

  // Text colors
  text: {
    primary: '#111827', // gray-900
    secondary: '#1f2937', // gray-800
    muted: '#4b5563', // gray-600
    link: '#2563eb', // blue-600
    error: '#dc2626', // red-600
    white: '#ffffff',
    dark: '#09090b', // zinc-950
  },
} as const

/**
 * CSS Variable names mapping
 * These will be used in globals.css
 */
export const cssVariableNames = {
  // Base
  background: '--color-background',
  foreground: '--color-foreground',
  backgroundSecondary: '--color-background-secondary',
  backgroundDark: '--color-background-dark',
  foregroundLight: '--color-foreground-light',

  // Gray scale
  gray50: '--color-gray-50',
  gray100: '--color-gray-100',
  gray300: '--color-gray-300',
  gray400: '--color-gray-400',
  gray600: '--color-gray-600',
  gray700: '--color-gray-700',
  gray800: '--color-gray-800',
  gray900: '--color-gray-900',

  // Blue
  blue100: '--color-blue-100',
  blue400: '--color-blue-400',
  blue600: '--color-blue-600',
  blue700: '--color-blue-700',

  // Red
  red100: '--color-red-100',
  red400: '--color-red-400',
  red500: '--color-red-500',
  red600: '--color-red-600',
  red700: '--color-red-700',

  // Zinc
  zinc50: '--color-zinc-50',
  zinc400: '--color-zinc-400',
  zinc600: '--color-zinc-600',
  zinc950: '--color-zinc-950',

  // Semantic
  white: '--color-white',
  black: '--color-black',

  // Custom
  hoverDark: '--color-hover-dark',
  hoverLight: '--color-hover-light',
  hoverBg: '--color-hover-bg',

  // Borders
  borderDefault: '--color-border-default',
  borderError: '--color-border-error',
  borderFocus: '--color-border-focus',
  borderFocusRingBlue: '--color-border-focus-ring-blue',
  borderFocusRingRed: '--color-border-focus-ring-red',

  // Text
  textPrimary: '--color-text-primary',
  textSecondary: '--color-text-secondary',
  textMuted: '--color-text-muted',
  textLink: '--color-text-link',
  textError: '--color-text-error',
} as const

/**
 * Helper function to get color value
 */
export function getThemeColor(path: string): string {
  const keys = path.split('.')
  let value: any = themeColors

  for (const key of keys) {
    value = value[key]
    if (value === undefined) {
      console.warn(`Color path "${path}" not found in theme`)
      return '#000000'
    }
  }

  return typeof value === 'string' ? value : '#000000'
}

/**
 * Export theme as a flat object for easy access
 */
export const themeColorsFlat = {
  // Base
  background: themeColors.background.default,
  foreground: themeColors.foreground.default,
  backgroundSecondary: themeColors.background.secondary,
  backgroundDark: themeColors.background.dark,
  foregroundLight: themeColors.foreground.light,

  // Gray
  gray50: themeColors.gray[50],
  gray100: themeColors.gray[100],
  gray300: themeColors.gray[300],
  gray400: themeColors.gray[400],
  gray600: themeColors.gray[600],
  gray700: themeColors.gray[700],
  gray800: themeColors.gray[800],
  gray900: themeColors.gray[900],

  // Blue
  blue100: themeColors.blue[100],
  blue400: themeColors.blue[400],
  blue600: themeColors.blue[600],
  blue700: themeColors.blue[700],

  // Red
  red100: themeColors.red[100],
  red400: themeColors.red[400],
  red500: themeColors.red[500],
  red600: themeColors.red[600],
  red700: themeColors.red[700],

  // Zinc
  zinc50: themeColors.zinc[50],
  zinc400: themeColors.zinc[400],
  zinc600: themeColors.zinc[600],
  zinc950: themeColors.zinc[950],

  // Semantic
  white: themeColors.white,
  black: themeColors.black,

  // Custom
  hoverDark: themeColors.custom.hoverDark,
  hoverLight: themeColors.custom.hoverLight,
  hoverBg: themeColors.custom.hoverBg,
  headerBlue: themeColors.custom.headerBlue,
  sidebarBg: themeColors.custom.sidebarBg,
  menuActive: themeColors.custom.menuActive,

  // Borders
  borderDefault: themeColors.border.default,
  borderError: themeColors.border.error,
  borderFocus: themeColors.border.focus,
  borderFocusRingBlue: themeColors.border.focusRing.blue,
  borderFocusRingRed: themeColors.border.focusRing.red,

  // Text
  textPrimary: themeColors.text.primary,
  textSecondary: themeColors.text.secondary,
  textMuted: themeColors.text.muted,
  textLink: themeColors.text.link,
  textError: themeColors.text.error,
} as const
