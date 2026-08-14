import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';
import SocialCueCard from '../../components/sensory/SocialCueCard';
import useSensoryStore from '../../store/sensoryStore';

export const SocialCueScreen = ({ navigation }) => {
  const { socialCues } = useSensoryStore();

  return (
    <SafeAreaWrapper>
      <AppHeader title="Social Cues Library" showBack onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {socialCues.map(cue => (
          <SocialCueCard key={cue.id} cue={cue} />
        ))}
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default SocialCueScreen;
