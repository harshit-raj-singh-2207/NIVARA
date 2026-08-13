import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { lightTheme } from '../../theme';

/**
 * Reusable Divider line.
 * Can be used as a simple line, or with a text label in the middle (e.g. "OR").
 *
 * @param {Object} props
 * @param {string} [props.orientation='horizontal'] - 'horizontal' or 'vertical'
 * @param {string} [props.label] - Optional text to center over the divider
 * @param {number} [props.marginVertical] - Custom spacing above and below
 * @param {number} [props.marginHorizontal] - Custom spacing left and right
 * @param {string} [props.color] - Override default border color
 */
const Divider = ({
  orientation = 'horizontal',
  label,
  marginVertical = lightTheme.spacing.md,
  marginHorizontal = 0,
  color = lightTheme.colors.border,
  style,
}) => {
  
  const isHorizontal = orientation === 'horizontal';

  const lineStyle = [
    styles.line,
    { backgroundColor: color },
    isHorizontal ? { height: 1, width: '100%' } : { width: 1, height: '100%' },
  ];

  // Simple clean line if no label
  if (!label) {
    return (
      <View 
        style={[
          lineStyle,
          { marginVertical, marginHorizontal },
          style
        ]} 
      />
    );
  }

  // If a label is provided, we need the "Line -- Text -- Line" layout
  return (
    <View 
      style={[
        styles.containerWithLabel,
        { marginVertical, marginHorizontal },
        style
      ]}
    >
      <View style={styles.flexLine}>
        <View style={lineStyle} />
      </View>
      
      <Text style={styles.label}>
        {label}
      </Text>
      
      <View style={styles.flexLine}>
        <View style={lineStyle} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  line: {
    // Width/Height set dynamically based on orientation
  },
  containerWithLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  flexLine: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    ...lightTheme.typography.caption,
    color: lightTheme.colors.text.secondary,
    paddingHorizontal: lightTheme.spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});

export default Divider;
