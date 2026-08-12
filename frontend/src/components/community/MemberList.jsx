/**
 * MemberList.jsx
 * Scrollable list component displaying group members.
 */

import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import MemberItem from './MemberItem';
import { SPACING } from '../../constants/spacing';
import { FONT_SIZES, FONT_WEIGHTS } from '../../constants/typography';

export const MemberList = ({ members = [], onMemberPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Group Members ({members.length})</Text>
      <FlatList
        data={members}
        keyExtractor={(item, index) => item.id || String(index)}
        renderItem={({ item }) => (
          <MemberItem member={item} onPress={() => onMemberPress && onMemberPress(item)} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#0F172A',
    marginBottom: SPACING.xs,
  },
});

export default MemberList;
