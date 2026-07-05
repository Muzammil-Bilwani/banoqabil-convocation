import { theme, type ThemeConfig } from 'antd'

export const appTheme: ThemeConfig = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: '#2d8e84',
    colorText: '#1A1A1A',
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    fontSize: 14,
    fontSizeHeading1: 38,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,
    borderRadius: 8,
    controlHeight: 32,
  },
  components: {
    Button: { borderRadius: 8 },
    Input: { borderRadius: 8 },
    Select: { borderRadius: 8 },
  },
}
