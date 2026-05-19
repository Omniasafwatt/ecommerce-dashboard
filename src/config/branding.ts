// Mobile 2000 Branding & Color Palette - Light Blue Theme
export const BRAND = {
  name: 'Mobile 2000',
  shortName: 'M2000',
  tagline: 'Your Trusted Mobile Store',
  description: 'Premium Mobile Shopping Experience'
}

// Primary Mobile 2000 Color Palette - Light Blue & Sky Tones
export const COLORS = {
  // Primary Light Blue
  primary: {
    50: '#F0F9FF',
    100: '#E0F2FE',
    200: '#BAE6FD',
    300: '#7DD3FC',
    400: '#38BDF8',
    500: '#0EA5E9', // Primary Light Blue
    600: '#0284C7',
    700: '#0369A1',
    800: '#075985',
    900: '#0C2D6B',
  },

  // Sky Blue Accent
  sky: {
    50: '#F0F9FF',
    100: '#E0F2FE',
    200: '#BAE6FD',
    300: '#7DD3FC',
    400: '#38BDF8',
    500: '#0EA5E9', // Sky Blue
    600: '#0284C7',
    700: '#0369A1',
    800: '#075985',
    900: '#0C2D6B',
  },

  // White & Neutral
  neutral: {
    white: '#FFFFFF',
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Status Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#0EA5E9',
}

// Logo & Branding Colors
export const BRANDING = {
  // Primary brand color (light blue)
  primary: '#0EA5E9',
  
  // Logo colors
  logo: {
    background: '#0EA5E9', // Light blue background
    text: '#FFFFFF', // White text
    accent: '#0369A1', // Darker blue accent
  },

  // Gradient variations
  gradients: {
    primary: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
    accent: 'linear-gradient(135deg, #38BDF8 0%, #0EA5E9 100%)',
    warm: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
  },

  // Text colors
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    inverse: '#FFFFFF',
  },

  // Background colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB',
    tertiary: '#F3F4F6',
  },

  // Border colors
  border: {
    light: '#E5E7EB',
    medium: '#D1D5DB',
    dark: '#9CA3AF',
  },

  // Shadow
  shadow: 'rgba(14, 165, 233, 0.15)',
}

// Theme configuration
export const THEME = {
  colors: COLORS,
  branding: BRANDING,
  brand: BRAND,
  
  // Component specific colors
  components: {
    button: {
      primary: COLORS.primary[500],
      primaryHover: COLORS.primary[600],
      primaryActive: COLORS.primary[700],
    },
    input: {
      border: COLORS.neutral[300],
      focus: COLORS.primary[500],
      background: COLORS.neutral.white,
    },
    card: {
      background: COLORS.neutral.white,
      border: COLORS.neutral[200],
      shadow: BRANDING.shadow,
    },
    sidebar: {
      background: COLORS.neutral[900],
      text: COLORS.neutral.white,
      hover: 'rgba(255, 255, 255, 0.1)',
      active: COLORS.primary[500],
    },
  },
}
