import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SafeAreaWrapper from '../../components/common/SafeAreaWrapper';
import AppHeader from '../../components/common/AppHeader';
import AppCard from '../../components/common/AppCard';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import useNotificationStore from '../../store/notificationStore';

const CATEGORIES = ['All', 'Emergency', 'Caregiver', 'System', 'General'];

export const NotificationsScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const {
    notifications,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const filteredNotifications = notifications.filter((item) => {
    if (selectedCategory === 'All') return true;
    return item.category?.toUpperCase() === selectedCategory.toUpperCase();
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getCategoryColor = (cat) => {
    switch (cat?.toUpperCase()) {
      case 'EMERGENCY': return 'text-[#E57373] bg-[#E57373]/15 border-[#E57373]/30';
      case 'CAREGIVER': return 'text-[#4DB97A] bg-[#6FCF97]/20 border-[#6FCF97]/40';
      case 'SYSTEM': return 'text-[#5B8DEF] bg-[#5B8DEF]/15 border-[#5B8DEF]/30';
      case 'GENERAL':
      default: return 'text-slate-600 bg-slate-100 border-slate-200';
    }
  };

  return (
    <SafeAreaWrapper className="bg-[#F5F9FF] dark:bg-slate-900">
      <AppHeader
        title="Notification Center"
        subtitle={`${unreadCount} unread alert${unreadCount === 1 ? '' : 's'}`}
        showBack
        onBackPress={() => navigation.goBack()}
        rightAction={
          unreadCount > 0 ? (
            <TouchableOpacity
              onPress={markAllAsRead}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Mark all notifications as read"
              className="px-3 py-1.5 rounded-xl bg-[#5B8DEF]/15 border border-[#5B8DEF]/30"
            >
              <Text className="text-xs font-bold text-[#5B8DEF]">Mark All Read</Text>
            </TouchableOpacity>
          ) : null
        }
      />

      {/* Category Pills */}
      <View className="py-3 px-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row space-x-2">
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl mr-2 border ${
                selectedCategory === cat
                  ? 'bg-[#5B8DEF] border-[#5B8DEF]'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  selectedCategory === cat ? 'text-white' : 'text-[#64748B] dark:text-slate-300'
                }`}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content Area */}
      {isLoading ? (
        <Loading text="Loading notifications..." />
      ) : error ? (
        <View className="flex-1 items-center justify-center p-6 text-center">
          <Ionicons name="alert-circle" size={48} color="#E57373" />
          <Text className="text-base font-bold text-[#1F2937] dark:text-white mt-3">
            Unable to load notifications
          </Text>
          <Text className="text-xs text-[#64748B] mt-1 mb-4 text-center">{error}</Text>
          <TouchableOpacity
            onPress={fetchNotifications}
            className="px-5 py-2.5 rounded-xl bg-[#5B8DEF]"
          >
            <Text className="text-white font-bold text-xs">Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : filteredNotifications.length === 0 ? (
        <EmptyState
          icon="notifications-off-outline"
          title="No Notifications"
          description={`No ${selectedCategory === 'All' ? '' : selectedCategory.toLowerCase()} alerts available at the moment.`}
        />
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={isLoading} onRefresh={fetchNotifications} />}
        >
          {filteredNotifications.map((item) => (
            <AppCard
              key={item.id}
              onPress={() => markAsRead(item.id)}
              className={`flex-row items-start p-4 ${
                !item.read ? 'bg-white border-[#5B8DEF]/40 dark:bg-slate-800' : 'bg-slate-50/60 dark:bg-slate-850'
              }`}
            >
              <View className="w-10 h-10 rounded-2xl bg-[#5B8DEF]/15 items-center justify-center mr-3.5 mt-0.5">
                <Ionicons name={item.icon || 'notifications'} size={20} color="#5B8DEF" />
              </View>

              <View className="flex-1 mr-2">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-sm font-black text-[#1F2937] dark:text-white flex-1 mr-2" numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text className="text-[11px] font-semibold text-[#64748B]">
                    {item.time}
                  </Text>
                </View>

                <Text className="text-xs text-[#64748B] dark:text-slate-300 leading-relaxed mb-2">
                  {item.message}
                </Text>

                <View className="flex-row items-center space-x-2">
                  <View className={`px-2.5 py-0.5 rounded-md border ${getCategoryColor(item.category)}`}>
                    <Text className="text-[10px] font-black uppercase">
                      {item.category || 'General'}
                    </Text>
                  </View>
                  {!item.read && (
                    <View className="w-2 h-2 rounded-full bg-[#5B8DEF]" />
                  )}
                </View>
              </View>
            </AppCard>
          ))}
        </ScrollView>
      )}
    </SafeAreaWrapper>
  );
};

export default NotificationsScreen;
