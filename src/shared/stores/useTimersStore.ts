import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Timer {
  id: string;
  name: string;
  duration: number; // in seconds
  currentTime: number;
  isRunning: boolean;
  isPaused: boolean;
  type: 'countdown' | 'stopwatch';
  createdAt: Date;
}

interface TimersState {
  timers: Timer[];
  addTimer: (name: string, duration: number, type: 'countdown' | 'stopwatch') => void;
  updateTimer: (id: string, updates: Partial<Timer>) => void;
  deleteTimer: (id: string) => void;
  startTimer: (id: string) => void;
  pauseTimer: (id: string) => void;
  resetTimer: (id: string) => void;
  tick: (id: string) => void;
}

export const useTimersStore = create<TimersState>()(
  persist(
    (set, get) => ({
      timers: [],

      addTimer: (name, duration, type) => {
        const { timers } = get();
        const newTimer: Timer = {
          id: Date.now().toString(),
          name,
          duration,
          currentTime: type === 'countdown' ? duration : 0,
          isRunning: false,
          isPaused: false,
          type,
          createdAt: new Date()
        };
        set({ timers: [...timers, newTimer] });
      },

      updateTimer: (id, updates) => {
        const { timers } = get();
        set({
          timers: timers.map(timer =>
            timer.id === id ? { ...timer, ...updates } : timer
          )
        });
      },

      deleteTimer: (id) => {
        const { timers } = get();
        set({ timers: timers.filter(timer => timer.id !== id) });
      },

      startTimer: (id) => {
        const { timers } = get();
        set({
          timers: timers.map(timer =>
            timer.id === id 
              ? { ...timer, isRunning: true, isPaused: false }
              : timer
          )
        });
      },

      pauseTimer: (id) => {
        const { timers } = get();
        set({
          timers: timers.map(timer =>
            timer.id === id 
              ? { ...timer, isRunning: false, isPaused: true }
              : timer
          )
        });
      },

      resetTimer: (id) => {
        const { timers } = get();
        set({
          timers: timers.map(timer =>
            timer.id === id 
              ? { 
                  ...timer, 
                  isRunning: false, 
                  isPaused: false,
                  currentTime: timer.type === 'countdown' ? timer.duration : 0
                }
              : timer
          )
        });
      },

      tick: (id) => {
        const { timers } = get();
        const timer = timers.find(t => t.id === id);
        if (!timer || !timer.isRunning || timer.isPaused) return;

        set({
          timers: timers.map(t => {
            if (t.id === id) {
              if (t.type === 'countdown') {
                const newTime = Math.max(0, t.currentTime - 1);
                if (newTime === 0) {
                  // Timer finished
                  if ('Notification' in window && Notification.permission === 'granted') {
                    new Notification(`Timer "${t.name}" finished!`, {
                      body: 'Your countdown has reached zero.',
                      icon: '/vite.svg'
                    });
                  }
                  return { ...t, currentTime: newTime, isRunning: false, isPaused: false };
                }
                return { ...t, currentTime: newTime };
              } else {
                return { ...t, currentTime: t.currentTime + 1 };
              }
            }
            return t;
          })
        });
      }
    }),
    {
      name: 'timers-storage',
    }
  )
);