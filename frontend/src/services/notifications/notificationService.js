export const notificationService = {
  scheduleLocalNotification: async (title, body, delaySeconds = 0) => {
    console.log(`[Notification Scheduled]: ${title} - ${body} (In ${delaySeconds}s)`);
    return `notif_id_${Date.now()}`;
  },
  cancelNotification: async (id) => {
    console.log(`[Notification Canceled]: ${id}`);
  }
};

export default notificationService;
