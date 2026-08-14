import React from 'react';
import { View, FlatList } from 'react-native';
import AACButton from './AACButton';

export const AACGrid = ({ items, onItemPress }) => {
  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      numColumns={3}
      renderItem={({ item }) => (
        <AACButton item={item} onPress={onItemPress} />
      )}
      contentContainerStyle={{ padding: 6 }}
    />
  );
};

export default AACGrid;
