import React from 'react';
import { View, FlatList } from 'react-native';
import MemberItem from './MemberItem';

export const MemberList = ({ members }) => {
  return (
    <FlatList
      data={members}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <MemberItem member={item} />}
    />
  );
};

export default MemberList;
