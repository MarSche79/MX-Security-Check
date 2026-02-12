export const colors = {
  // Backgrounds
  background: '#0A0E27',
  surface: '#151933',
  surfaceLight: '#1E2344',
  surfaceHover: '#252B4A',

  // Primary
  primary: '#6366F1',
  primaryDark: '#4F46E5',
  primaryLight: '#818CF8',

  // Accent
  accent: '#06B6D4',
  accentLight: '#22D3EE',

  // Status
  success: '#10B981',
  successLight: '#34D399',
  successBg: 'rgba(16, 185, 129, 0.12)',
  warning: '#F59E0B',
  warningLight: '#FBBF24',
  warningBg: 'rgba(245, 158, 11, 0.12)',
  error: '#EF4444',
  errorLight: '#F87171',
  errorBg: 'rgba(239, 68, 68, 0.12)',

  // Text
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  textDark: '#334155',

  // Borders
  border: '#1E293B',
  cardBorder: '#252B4A',

  // Gradients
  gradientPrimary: ['#4F46E5', '#7C3AED', '#06B6D4'] as const,
  gradientHeader: ['#0F172A', '#1E1B4B', '#0F172A'] as const,
  gradientCard: ['#151933', '#1A1F3D'] as const,
  gradientSuccess: ['#059669', '#10B981'] as const,
  gradientWarning: ['#D97706', '#F59E0B'] as const,
  gradientError: ['#DC2626', '#EF4444'] as const,
};

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  button: {
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
};
