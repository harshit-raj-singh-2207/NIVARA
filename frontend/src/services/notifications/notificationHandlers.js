export const handleNotificationClick = (notificationData, navigation) => {
  if (notificationData?.type === 'SAFETY') {
    navigation.navigate('SafetyTab');
  } else if (notificationData?.type === 'ROUTINE') {
    navigation.navigate('LearningTab');
  }
};
