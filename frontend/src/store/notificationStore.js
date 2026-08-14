import { create } from 'zustand';

export const useNotificationStore = create((set, get) => ({
  notifications: [
    {
      id: 'n1',
      title: '🚨 Safe Zone Alert',
      message: 'You have arrived safely at Delhi Public School Campus.',
      time: '5 mins ago',
      read: false,
      category: 'EMERGENCY', // 'EMERGENCY', 'CAREGIVER', 'SYSTEM', 'GENERAL'
      icon: 'shield-checkmark',
    },
    {
      id: 'n2',
      title: 'Caregiver Connection',
      message: 'Priya Sharma updated your afternoon sensory break schedule.',
      time: '25 mins ago',
      read: false,
      category: 'CAREGIVER',
      icon: 'person',
    },
    {
      id: 'n3',
      title: 'Routine Reminder',
      message: 'Time for 15-minute quiet reading session.',
      time: '1 hour ago',
      read: true,
      category: 'SYSTEM',
      icon: 'calendar',
    },
    {
      id: 'n4',
      title: 'Community Update',
      message: 'Dr. Rahul Mehta posted new sensory regulation tips in Autism Support Group.',
      time: '3 hours ago',
      read: true,
      category: 'GENERAL',
      icon: 'people',
    },
  ],
  isLoading: false,
  error: null,

  getUnreadCount: () => {
    return get().notifications.filter(n => !n.read).length;
  },

  fetchNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      await new Promise(res => setTimeout(res, 500));
      set({ isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: err.message });
    }
  },

  markAsRead: (id) => set(state => ({
    notifications: state.notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    )
  })),

  markAllAsRead: () => set(state => ({
    notifications: state.notifications.map(n => ({ ...n, read: true }))
  })),

  clearNotifications: () => set({ notifications: [] }),

  addNotification: (notif) => set(state => ({
    notifications: [
      {
        id: `n_${Date.now()}`,
        read: false,
        time: 'Just now',
        category: notif.category || 'GENERAL',
        icon: notif.icon || 'notifications',
        ...notif,
      },
      ...state.notifications,
    ]
  }))
}));

export default useNotificationStore;
