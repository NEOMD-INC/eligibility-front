/**
 * Theme Helper Utilities
 *
 * This file provides helper functions for using theme colors in components
 */

import { themeColors } from '@/theme'

/**
 * Get a theme color value for inline styles
 */
export const getThemeColor = (path: string): string => {
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
 * Common theme color shortcuts for inline styles
 */
export const theme = {
  // Backgrounds
  bg: {
    primary: themeColors.background.default,
    secondary: themeColors.background.secondary,
    white: themeColors.white,
    black: themeColors.black,
  },

  // Text
  text: {
    primary: themeColors.text.primary,
    secondary: themeColors.text.secondary,
    muted: themeColors.text.muted,
    link: themeColors.text.link,
    error: themeColors.text.error,
    white: themeColors.white,
  },

  // Buttons
  button: {
    primary: themeColors.blue[600],
    primaryHover: themeColors.blue[700],
    error: themeColors.red[500],
    errorHover: themeColors.red[600],
  },

  // Borders
  border: {
    default: themeColors.border.default,
    error: themeColors.border.error,
    focus: themeColors.border.focus,
  },

  // Alerts
  alert: {
    info: themeColors.blue[100],
    infoText: themeColors.blue[700],
    error: themeColors.red[100],
    errorText: themeColors.red[700],
  },
}
