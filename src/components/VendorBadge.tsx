import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { VendorInfo } from '../types';
import { getVendorTypeLabel, getVendorTypeColor } from '../utils/vendorDatabase';

interface VendorBadgeProps {
  vendor: VendorInfo;
  compact?: boolean;
}

export const VendorBadge: React.FC<VendorBadgeProps> = ({
  vendor,
  compact = false,
}) => {
  const typeColor = getVendorTypeColor(vendor.type);
  const typeLabel = getVendorTypeLabel(vendor.type);

  if (compact) {
    return (
      <View style={[styles.compactBadge, { borderColor: typeColor }]}>
        <View style={[styles.compactDot, { backgroundColor: typeColor }]} />
        <Text style={styles.compactName}>{vendor.name}</Text>
      </View>
    );
  }

  return (
    <View style={styles.badge}>
      <View style={styles.badgeHeader}>
        <View style={[styles.typePill, { backgroundColor: `${typeColor}20` }]}>
          <View style={[styles.typeDot, { backgroundColor: typeColor }]} />
          <Text style={[styles.typeText, { color: typeColor }]}>
            {typeLabel}
          </Text>
        </View>
        {vendor.confidence === 'high' && (
          <Text style={styles.confidenceIcon}>✓</Text>
        )}
      </View>
      <Text style={styles.vendorName}>{vendor.name}</Text>
      {vendor.description && (
        <Text style={styles.vendorDesc}>{vendor.description}</Text>
      )}
    </View>
  );
};

interface VendorListProps {
  vendors: VendorInfo[];
  title?: string;
}

export const VendorList: React.FC<VendorListProps> = ({ vendors, title }) => {
  if (vendors.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No vendors detected</Text>
      </View>
    );
  }

  return (
    <View style={styles.listContainer}>
      {title && <Text style={styles.listTitle}>{title}</Text>}
      <View style={styles.badgeGrid}>
        {vendors.map((vendor, index) => (
          <VendorBadge key={`${vendor.name}-${index}`} vendor={vendor} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  badgeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  typePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 6,
  },
  typeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  typeText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  confidenceIcon: {
    color: colors.success,
    fontSize: 14,
    fontWeight: '700',
  },
  vendorName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  vendorDesc: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },

  // Compact variant
  compactBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  compactDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  compactName: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '500',
  },

  // List
  listContainer: {
    gap: 4,
  },
  listTitle: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  badgeGrid: {
    gap: 8,
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
    fontStyle: 'italic',
  },
});
