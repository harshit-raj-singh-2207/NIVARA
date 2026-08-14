import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppButton from '../../components/common/AppButton';
import useAuthStore from '../../store/authStore';

const SLIDES = [
  {
    id: 1,
    title: 'Communicate Easily',
    description: 'Express your needs freely using voice, text, AAC icons, and visual communication tools customized for you.',
    icon: 'chatbubbles',
    color: '#5B8DEF',
  },
  {
    id: 2,
    title: 'Stay Connected',
    description: 'Establish secure connections with designated caregivers, manage notifications, and receive timely support when needed.',
    icon: 'heart-dislike',
    color: '#6FCF97',
  },
  {
    id: 3,
    title: 'Personalized Support',
    description: 'CareMate AI adapts seamlessly to your sensory preferences, routine schedules, and accessibility needs every step of the way.',
    icon: 'sparkles',
    color: '#F6D365',
  },
];

export const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { setOnboarded } = useAuthStore();

  const handleFinish = async () => {
    await setOnboarded(true);
    navigation.replace('Login');
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleFinish();
    }
  };

  const currentSlide = SLIDES[currentIndex];

  return (
    <SafeAreaWrapper className="justify-between p-6 bg-[#F5F9FF] dark:bg-slate-900">
      {/* Header Skip button */}
      <View className="flex-row justify-between items-center">
        <Text className="text-xs font-black text-[#5B8DEF] uppercase tracking-widest">
          CareMate AI
        </Text>
        <TouchableOpacity
          onPress={handleFinish}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Skip onboarding"
          className="p-2"
        >
          <Text className="text-sm font-bold text-[#64748B] dark:text-slate-400">
            Skip
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Slide Card */}
      <View className="items-center my-auto px-4 text-center">
        <View
          style={{ backgroundColor: `${currentSlide.color}20` }}
          className="w-36 h-36 rounded-full items-center justify-center mb-8 border-2 border-white dark:border-slate-800 shadow-sm"
        >
          <Ionicons name={currentSlide.icon} size={64} color={currentSlide.color === '#F6D365' ? '#E5BD45' : currentSlide.color} />
        </View>

        <Text className="text-2xl font-black text-[#1F2937] dark:text-white text-center mb-3">
          {currentSlide.title}
        </Text>
        <Text className="text-base font-medium text-[#64748B] dark:text-slate-300 text-center leading-relaxed max-w-xs">
          {currentSlide.description}
        </Text>
      </View>

      {/* Bottom Controls */}
      <View className="mb-2">
        {/* Page Indicators */}
        <View className="flex-row justify-center space-x-2 mb-8">
          {SLIDES.map((_, idx) => (
            <View
              key={idx}
              className={`h-2.5 rounded-full transition-all ${
                idx === currentIndex
                  ? 'w-8 bg-[#5B8DEF]'
                  : 'w-2.5 bg-slate-300 dark:bg-slate-700'
              }`}
            />
          ))}
        </View>

        {/* Buttons */}
        <AppButton
          title={currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          onPress={handleNext}
          size="lg"
        />
      </View>
    </SafeAreaWrapper>
  );
};

export default OnboardingScreen;
