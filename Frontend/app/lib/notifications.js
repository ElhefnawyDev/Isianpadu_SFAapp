import * as Notifications from "expo-notifications";

export const initializeNotifications = async () => {
  await Notifications.requestPermissionsAsync();
  
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  // Listener to handle incoming notifications
  Notifications.addNotificationReceivedListener((notification) => {
    console.log("Notification received:", notification);
  });

  Notifications.addNotificationResponseReceivedListener((response) => {
    console.log("Notification response:", response);
  });
};
