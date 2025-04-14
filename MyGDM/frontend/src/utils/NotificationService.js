// src/utils/NotificationService.js
import toast from 'react-hot-toast';

const NotificationService = {
  notify: ({ message, sound = true }) => {
    // Show toast always
    toast(message);

    // Show native notification (if permitted)
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification('🔔 MyGDM Reminder', {
        body: message,
        icon: '/icon.png',     // 96x96 or 128x128 icon
        badge: '/icon.png',    // optional, usually used on mobile
        vibrate: [200, 100, 200],
        tag: `reminder-${Date.now()}`, // prevent suppression
        renotify: true,
        requireInteraction: false, // set to true if you want it to stay until dismissed
      });

      // Optional: play sound manually (Notification API doesn't auto-play)
      if (sound) {
        const audio = new Audio('/notification.mp3');
        audio.play().catch((err) => {
          console.warn('Notification sound failed:', err.message);
        });
      }
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      // Try requesting permission if not denied
      Notification.requestPermission();
    }
  },

  requestPermission: async () => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      try {
        await Notification.requestPermission();
      } catch (err) {
        console.warn('Notification permission request failed:', err);
      }
    }
  },
};

export default NotificationService;
