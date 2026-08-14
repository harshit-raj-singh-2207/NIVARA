import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';
import AppCard from '../../components/common/AppCard';
import NoiseMeter from '../../components/sensory/NoiseMeter';
import BrightnessMeter from '../../components/sensory/BrightnessMeter';
import CrowdIndicator from '../../components/sensory/CrowdIndicator';
import SensoryAlert from '../../components/sensory/SensoryAlert';
import SocialCueCard from '../../components/sensory/SocialCueCard';
import useSensoryStore from '../../store/sensoryStore';

export const SensoryHomeScreen = ({ navigation }) => {
  const { noiseLevelDb, brightnessLux, crowdDensity, sensoryAlert, dismissAlert, socialCues } = useSensoryStore();

  return (
    <SafeAreaWrapper>
      <AppHeader title="Sensory Regulation" />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <SensoryAlert alert={sensoryAlert} onDismiss={dismissAlert} />

        <Text className="text-lg font-bold text-slate-900 dark:text-white mb-3">Live Environment Monitor</Text>
        <View className="flex-row mb-3">
          <NoiseMeter decibels={noiseLevelDb} />
          <BrightnessMeter lux={brightnessLux} />
        </View>

        <View className="mb-6">
          <CrowdIndicator density={crowdDensity} />
        </View>

        {/* Soothing Soundtrack Card */}
        <AppCard className="bg-teal-600 border-transparent mb-6 p-5">
          <Text className="text-white font-black text-xl mb-1">🎧 Quick Decompression Sound</Text>
          <Text className="text-teal-100 text-xs mb-3">Play soothing brown noise or ocean waves to calm sensory overload.</Text>
        </AppCard>

        {/* Social Cues Guidance */}
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-lg font-bold text-slate-900 dark:text-white">Social Cue Explanations</Text>
          <Text onPress={() => navigation.navigate('SocialCue')} className="text-xs font-bold text-indigo-600">See All</Text>
        </View>
        {socialCues.map(cue => (
          <SocialCueCard key={cue.id} cue={cue} />
        ))}
      </ScrollView>
    </SafeAreaWrapper>
  );
};

export default SensoryHomeScreen;
