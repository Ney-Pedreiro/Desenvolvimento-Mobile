import React from 'react';
import { View, StyleSheet } from 'react-native';

import { AppText } from '@/components/atoms/AppText';
import { Input, type InputProps } from '@/components/atoms/Input';
import { useThemeColor } from '@/hooks/use-theme-color';

export type InputWithLabelProps = InputProps & {
  label: string;
};

export function InputWithLabel({ label, ...inputProps }: InputWithLabelProps) {
  // Cards are always white, so in dark mode we need a dark label color for contrast
  const labelColor = useThemeColor({ dark: '#374151' }, 'text');

  return (
    <View style={styles.container}>
      <AppText variant="caption" style={[styles.label, { color: labelColor }]}>
        {label}
      </AppText>
      <Input {...inputProps} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
  },
});
