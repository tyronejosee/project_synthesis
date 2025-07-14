import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Alarm {
  id: string;
  name: string;
  time: string; // HH:MM format
  date?: string; // YYYY-MM-DD format (optional for recurring alarms)
  isActive: boolean;
  isRecurring: boolean;
  daysOfWeek: number[]; // 0-6, Sunday is 0
  soundEnabled: boolean;
  createdAt: Date;
}

interface AlarmsState {
  alarms: Alarm[];
  addAlarm: (alarm: Omit<Alarm, "id" | "createdAt">) => void;
  updateAlarm: (id: string, updates: Partial<Alarm>) => void;
  deleteAlarm: (id: string) => void;
  toggleAlarm: (id: string) => void;
  checkAlarms: () => void;
}

export const useAlarmsStore = create<AlarmsState>()(
  persist(
    (set, get) => ({
      alarms: [],

      addAlarm: (alarmData) => {
        const { alarms } = get();
        const newAlarm: Alarm = {
          ...alarmData,
          id: Date.now().toString(),
          createdAt: new Date(),
        };
        set({ alarms: [...alarms, newAlarm] });
      },

      updateAlarm: (id, updates) => {
        const { alarms } = get();
        set({
          alarms: alarms.map((alarm) =>
            alarm.id === id ? { ...alarm, ...updates } : alarm
          ),
        });
      },

      deleteAlarm: (id) => {
        const { alarms } = get();
        set({ alarms: alarms.filter((alarm) => alarm.id !== id) });
      },

      toggleAlarm: (id) => {
        const { alarms } = get();
        set({
          alarms: alarms.map((alarm) =>
            alarm.id === id ? { ...alarm, isActive: !alarm.isActive } : alarm
          ),
        });
      },

      checkAlarms: () => {
        const { alarms } = get();
        const now = new Date();
        const currentDay = now.getDay();
        const currentTime = now.toTimeString().slice(0, 5); // HH:MM
        const currentDate = now.toISOString().slice(0, 10); // YYYY-MM-DD

        alarms.forEach((alarm) => {
          if (!alarm.isActive) return;

          let shouldTrigger = false;

          if (alarm.isRecurring) {
            // Check if today is one of the recurring days
            shouldTrigger =
              alarm.daysOfWeek.includes(currentDay) &&
              alarm.time === currentTime;
          } else if (alarm.date) {
            // One-time alarm with specific date
            shouldTrigger =
              alarm.date === currentDate && alarm.time === currentTime;
          } else {
            // One-time alarm for today
            shouldTrigger = alarm.time === currentTime;
          }

          if (shouldTrigger) {
            // Show notification
            if (
              "Notification" in window &&
              Notification.permission === "granted"
            ) {
              new Notification(`Alarm: ${alarm.name}`, {
                body: `It's ${alarm.time}!`,
                icon: "/vite.svg",
              });
            }

            // Play sound if enabled
            if (alarm.soundEnabled && "Audio" in window) {
              const audio = new Audio(
                "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LKeCEIHnfH8N2QQAoUXrTp66hVFApGn+DyvmUHJH3J8tyOPAcXY7zn3pFCABNVo+TwumMHJIHM8n2CNA0UY7zs4ZFCACVVr+nzsJVHAApBn+PyvGUHJH3J8dyOPAcXY7zn3pFCABNVo+TwumMfNOIH"
              ) as HTMLAudioElement;
              audio.play().catch(() => {});
            }

            // If not recurring, deactivate the alarm
            if (!alarm.isRecurring) {
              get().updateAlarm(alarm.id, { isActive: false });
            }
          }
        });
      },
    }),
    {
      name: "alarms-storage",
    }
  )
);
