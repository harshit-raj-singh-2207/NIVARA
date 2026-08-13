/**
 * ChatBubble.jsx
 * Individual chat message bubble component supporting user/partner messages.
 */

import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { BRAND_COLORS } from '../../constants/colors';
import { SPACING, BORDER_RADIUS } from '../../constants/spacing';
import { FONT_SIZES } from '../../constants/typography';
import { formatTime12Hour } from '../../utils/dateUtils';

export const ChatBubble = ({ message, isMe = false }) => {
  if (!message) return null;

  const { text, content, timestamp, media_url, mediaUrl } = message;
  const displayText = text || content || '';
  const media = media_url || mediaUrl;

  return (
    <View style={[styles.container, isMe ? styles.myContainer : styles.partnerContainer]}>
      <View style={[styles.bubble, isMe ? styles.myBubble : styles.partnerBubble]}>
        {media ? (
          <Image source={{ uri: media }} style={styles.mediaImage} resizeMode="cover" />
        ) : null}
        {displayText ? (
          <Text style={[styles.text, isMe ? styles.myText : styles.partnerText]}>
            {displayText}
          </Text>
        ) : null}
        <Text style={[styles.timeText, isMe ? styles.myTimeText : styles.partnerTimeText]}>
          {timestamp ? formatTime12Hour(timestamp) : ''}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.xs,
    flexDirection: 'row',
  },
  myContainer: {
    justifyContent: 'flex-end',
  },
  partnerContainer: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
  },
  myBubble: {
    backgroundColor: BRAND_COLORS.primary,
    borderBottomRightRadius: 2,
  },
  partnerBubble: {
    backgroundColor: '#F1F5F9',
    borderBottomLeftRadius: 2,
  },
  text: {
    fontSize: FONT_SIZES.sm,
    lineHeight: 20,
  },
  myText: {
    color: '#FFFFFF',
  },
  partnerText: {
    color: '#0F172A',
  },
  mediaImage: {
    width: 200,
    height: 150,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xs,
  },
  timeText: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  myTimeText: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  partnerTimeText: {
    color: '#94A3B8',
  },
});

export default ChatBubble;
