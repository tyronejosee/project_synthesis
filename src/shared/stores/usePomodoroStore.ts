import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PomodoroSession {
  id: string;
  type: 'work' | 'break' | 'longBreak';
  duration: number;
  completedAt: Date;
}

interface PomodoroState {
  isRunning: boolean;
  isPaused: boolean;
  currentTime: number;
  currentSession: 'work' | 'break' | 'longBreak';
  sessionsCompleted: number;
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  sessions: PomodoroSession[];
  soundEnabled: boolean;
  
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  skipSession: () => void;
  updateSettings: (settings: Partial<Pick<PomodoroState, 'workDuration' | 'breakDuration' | 'longBreakDuration' | 'longBreakInterval' | 'soundEnabled'>>) => void;
  tick: () => void;
  completeSession: () => void;
}

export const usePomodoroStore = create<PomodoroState>()(
  persist(
    (set, get) => ({
      isRunning: false,
      isPaused: false,
      currentTime: 25 * 60, // 25 minutes in seconds
      currentSession: 'work',
      sessionsCompleted: 0,
      workDuration: 25,
      breakDuration: 5,
      longBreakDuration: 15,
      longBreakInterval: 4,
      sessions: [],
      soundEnabled: true,

      startTimer: () => set({ isRunning: true, isPaused: false }),
      
      pauseTimer: () => set({ isPaused: true }),
      
      resetTimer: () => {
        const { currentSession, workDuration, breakDuration, longBreakDuration } = get();
        const duration = currentSession === 'work' 
          ? workDuration 
          : currentSession === 'break' 
          ? breakDuration 
          : longBreakDuration;
        
        set({ 
          isRunning: false, 
          isPaused: false, 
          currentTime: duration * 60 
        });
      },
      
      skipSession: () => {
        get().completeSession();
      },
      
      updateSettings: (settings) => {
        set(settings);
        const { currentSession, workDuration, breakDuration, longBreakDuration } = get();
        const duration = currentSession === 'work' 
          ? workDuration 
          : currentSession === 'break' 
          ? breakDuration 
          : longBreakDuration;
        
        set({ currentTime: duration * 60 });
      },
      
      tick: () => {
        const { currentTime, isRunning, isPaused } = get();
        if (!isRunning || isPaused) return;
        
        if (currentTime <= 1) {
          get().completeSession();
        } else {
          set({ currentTime: currentTime - 1 });
        }
      },
      
      completeSession: () => {
        const { 
          currentSession, 
          sessionsCompleted, 
          workDuration, 
          breakDuration, 
          longBreakDuration,
          longBreakInterval,
          sessions,
          soundEnabled
        } = get();

        // Play notification sound
        if (soundEnabled && 'Audio' in window) {
          const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LKeCEIHnfH8N2QQAoUXrTp66hVFApGn+DyvmUHJH3J8tyOPAcXY7zn3pFCABNVo+TwumMHJIHM8n2CNA0UY7zs4ZFCACVVr+nzsJVHAApBn+PyvGUHJH3J8dyOPAcXY7zn3pFCABNVo+TwumMfNOIH') as HTMLAudioElement;
          audio.play().catch(() => {});
        }

        // Add completed session to history
        const newSession: PomodoroSession = {
          id: Date.now().toString(),
          type: currentSession,
          duration: currentSession === 'work' ? workDuration : currentSession === 'break' ? breakDuration : longBreakDuration,
          completedAt: new Date()
        };

        let nextSession: 'work' | 'break' | 'longBreak';
        let newSessionsCompleted = sessionsCompleted;

        if (currentSession === 'work') {
          newSessionsCompleted += 1;
          nextSession = (newSessionsCompleted % longBreakInterval === 0) ? 'longBreak' : 'break';
        } else {
          nextSession = 'work';
        }

        const nextDuration = nextSession === 'work' 
          ? workDuration 
          : nextSession === 'break' 
          ? breakDuration 
          : longBreakDuration;

        set({
          currentSession: nextSession,
          sessionsCompleted: newSessionsCompleted,
          currentTime: nextDuration * 60,
          isRunning: false,
          isPaused: false,
          sessions: [...sessions, newSession]
        });

        // Show browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(`${currentSession === 'work' ? 'Work' : 'Break'} session completed!`, {
            body: `Time for a ${nextSession === 'work' ? 'work session' : nextSession === 'break' ? 'short break' : 'long break'}`,
            icon: '/vite.svg'
          });
        }
      }
    }),
    {
      name: 'pomodoro-storage',
    }
  )
);