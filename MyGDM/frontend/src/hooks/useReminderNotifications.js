// src/hooks/useReminderNotifications.js
import { useEffect, useRef } from 'react';
import { getReminders } from '../services/reminderApi';
import toast from 'react-hot-toast';
import NotificationService from '../utils/NotificationService';


const useReminderNotifications = () => {
  const shownRef = useRef(new Set());

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const checkReminders = async () => {
      try {
        const reminders = await getReminders();
        const now = new Date();
        const offsetDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
        const currentTime = offsetDate.toISOString().slice(11, 16); // "HH:mm"

        reminders.forEach((reminder) => {
          const key = `${reminder._id}-${currentTime}`;
          if (reminder.time === currentTime && !shownRef.current.has(key)) {
            const message = reminder.message || 'Check your glucose levels!';
            toast(`Reminder: ${message}`);
            NotificationService.notify('🔔 Reminder', { body: message });

            shownRef.current.add(key);
          }
        });
      } catch (err) {
        console.error('Reminder check failed', err);
      }
    };

    checkReminders();
    const interval = setInterval(checkReminders, 60000);

    return () => clearInterval(interval);
  }, []);
};

export default useReminderNotifications;
