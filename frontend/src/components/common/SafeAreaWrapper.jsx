import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { lightTheme } from '../../theme/lightTheme';

const SafeAreaWrapper = ({ children, backgroundColor = lightTheme.colors.background }) => {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar barStyle="dark-content" backgroundColor={backgroundColor} />
      <View style={styles.childContainer}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  childContainer: {
    flex: 1,
  }
});

export default SafeAreaWrapper;
