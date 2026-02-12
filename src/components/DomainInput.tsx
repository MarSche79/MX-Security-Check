import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { colors, shadows } from '../theme/colors';

interface DomainInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onScan: () => void;
  isLoading: boolean;
}

export const DomainInput: React.FC<DomainInputProps> = ({
  value,
  onChangeText,
  onScan,
  isLoading,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <Text style={styles.inputIcon}>🌐</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter domain (e.g., example.com)"
          placeholderTextColor={colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="off"
          keyboardType="url"
          returnKeyType="search"
          onSubmitEditing={onScan}
          editable={!isLoading}
          maxLength={253}
        />
      </View>
      <TouchableOpacity
        style={[styles.scanButton, isLoading && styles.scanButtonDisabled]}
        onPress={onScan}
        disabled={isLoading}
        activeOpacity={0.7}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.text} />
        ) : (
          <>
            <Text style={styles.scanIcon}>🔍</Text>
            <Text style={styles.scanText}>Scan</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    fontWeight: '400',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryDark,
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 20,
    gap: 6,
    ...shadows.button,
  },
  scanButtonDisabled: {
    backgroundColor: colors.surfaceLight,
    shadowOpacity: 0,
  },
  scanIcon: {
    fontSize: 16,
  },
  scanText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});
