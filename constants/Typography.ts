import { TextStyle } from 'react-native';
import Colors from './Colors';

export const Typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 36,
    xxxl: 42,
  },
};

export const TextStyles: Record<string, TextStyle> = {
  heading1: {
    fontSize: Typography.fontSize.xxxl,
    fontWeight: 'bold',
    color: Colors.gray[900],
    lineHeight: Typography.lineHeight.xxxl,
  },
  heading2: {
    fontSize: Typography.fontSize.xxl,
    fontWeight: 'bold',
    color: Colors.gray[900],
    lineHeight: Typography.lineHeight.xxl,
  },
  heading3: {
    fontSize: Typography.fontSize.xl,
    fontWeight: 'bold',
    color: Colors.gray[900],
    lineHeight: Typography.lineHeight.xl,
  },
  subtitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '600',
    color: Colors.gray[700],
    lineHeight: Typography.lineHeight.lg,
  },
  body: {
    fontSize: Typography.fontSize.md,
    fontWeight: 'normal',
    color: Colors.gray[800],
    lineHeight: Typography.lineHeight.md,
  },
  bodySmall: {
    fontSize: Typography.fontSize.sm,
    fontWeight: 'normal',
    color: Colors.gray[700],
    lineHeight: Typography.lineHeight.sm,
  },
  caption: {
    fontSize: Typography.fontSize.xs,
    fontWeight: 'normal',
    color: Colors.gray[600],
    lineHeight: Typography.lineHeight.xs,
  },
  button: {
    fontSize: Typography.fontSize.md,
    fontWeight: '600',
    color: Colors.white,
    lineHeight: Typography.lineHeight.md,
  },
  buttonSmall: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.white,
    lineHeight: Typography.lineHeight.sm,
  },
};

export default Typography;