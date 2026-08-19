import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { lightTheme } from '../../theme';
import AppCard from '../common/AppCard';
import Avatar from '../common/Avatar';

/**
 * Reusable Contact Card component.
 * Displays an emergency contact's details with quick actions to call or message them.
 * Optional delete button if in "edit mode".
 *
 * @param {Object} props
 * @param {import('../../types/safety').EmergencyContact} props.contact 
 * @param {Function} [props.onDelete] - Action to delete the contact (shows trash icon if provided)
 */
const ContactCard = ({ contact, onDelete }) => {
  if (!contact) return null;

  // Handle Quick Actions
  const handleCall = () => {
    if (contact.phone) {
      Linking.openURL(`tel:${contact.phone}`).catch(err => {
        console.warn('Cannot open phone dialer', err);
      });
    }
  };

  const handleMessage = () => {
    if (contact.phone) {
      Linking.openURL(`sms:${contact.phone}`).catch(err => {
        console.warn('Cannot open messaging app', err);
      });
    }
  };

  return (
    <AppCard style={styles.card} noPadding>
      <View style={styles.container}>
        
        {/* Left: Avatar & Info */}
        <View style={styles.infoSection}>
          <Avatar 
            name={contact.name} 
            size={48} 
            style={styles.avatar} 
          />
          <View style={styles.textContainer}>
            <Text style={styles.nameText} numberOfLines={1}>{contact.name}</Text>
            
            <View style={styles.detailsRow}>
              {contact.relationship && (
                <Text style={styles.relationshipText}>
                  {contact.relationship}
                </Text>
              )}
              {contact.relationship && contact.phone && (
                <Text style={styles.dotSeparator}> • </Text>
              )}
              {contact.phone && (
                <Text style={styles.phoneText}>
                  {contact.phone}
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Right: Quick Actions */}
        <View style={styles.actionsSection}>
          {/* Action: Call */}
          <TouchableOpacity 
            style={[styles.actionButton, styles.callButton]} 
            onPress={handleCall}
          >
            <Ionicons name="call" size={20} color={lightTheme.colors.primary} />
          </TouchableOpacity>
          
          {/* Action: Message */}
          <TouchableOpacity 
            style={[styles.actionButton, styles.messageButton]} 
            onPress={handleMessage}
          >
            <Ionicons name="chatbubble" size={20} color={lightTheme.colors.primary} />
          </TouchableOpacity>

          {/* Action: Delete (optional edit mode) */}
          {onDelete && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.deleteButton]} 
              onPress={() => onDelete(contact.id)}
            >
              <Ionicons name="trash-outline" size={20} color={lightTheme.colors.status.emergency} />
            </TouchableOpacity>
          )}
        </View>
        
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: lightTheme.spacing.md,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: lightTheme.spacing.md,
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    marginRight: lightTheme.spacing.md,
  },
  textContainer: {
    flex: 1,
    paddingRight: lightTheme.spacing.sm,
  },
  nameText: {
    ...lightTheme.typography.body1,
    fontWeight: '700',
    color: lightTheme.colors.text.primary,
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  relationshipText: {
    ...lightTheme.typography.caption,
    color: lightTheme.colors.primary,
    fontWeight: '500',
  },
  dotSeparator: {
    ...lightTheme.typography.caption,
    color: lightTheme.colors.text.tertiary,
  },
  phoneText: {
    ...lightTheme.typography.caption,
    color: lightTheme.colors.text.secondary,
  },
  actionsSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: lightTheme.colors.primaryLight,
    marginLeft: lightTheme.spacing.xs,
  },
  callButton: {
    // Uses default primaryLight bg
  },
  messageButton: {
    backgroundColor: lightTheme.colors.surfaceHover,
  },
  deleteButton: {
    backgroundColor: lightTheme.colors.status.emergencyBg,
  },
});

export default ContactCard;
