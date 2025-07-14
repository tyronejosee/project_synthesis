import { Slider, Switch } from "@heroui/react";
import { Play, Pause, RotateCcw, SkipForward, Settings } from "lucide-react";
import { usePomodoroStore } from "../shared/stores/usePomodoroStore";
import { useTimer } from "../shared/hooks/useTimer";
import { useNotifications } from "../shared/hooks/useNotifications";
import { Card } from "../shared/ui/Card";
import { Button } from "../shared/ui/Button";
import { formatTime } from "../shared/utils/time";

export function PomodoroPage() {
  const {
    isRunning,
    isPaused,
    currentTime,
    currentSession,
    sessionsCompleted,
    workDuration,
    breakDuration,
    longBreakDuration,
    longBreakInterval,
    soundEnabled,
    sessions,
    startTimer,
    pauseTimer,
    resetTimer,
    skipSession,
    updateSettings,
    tick,
  } = usePomodoroStore();

  useNotifications();
  useTimer(tick, isRunning && !isPaused ? 1000 : null, [isRunning, isPaused]);

  const progress =
    currentSession === "work"
      ? ((workDuration * 60 - currentTime) / (workDuration * 60)) * 100
      : currentSession === "break"
      ? ((breakDuration * 60 - currentTime) / (breakDuration * 60)) * 100
      : ((longBreakDuration * 60 - currentTime) / (longBreakDuration * 60)) *
        100;

  const nextSession =
    currentSession === "work"
      ? (sessionsCompleted + 1) % longBreakInterval === 0
        ? "Long Break"
        : "Short Break"
      : "Work";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Pomodoro Timer
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Stay focused with the Pomodoro Technique
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="text-center p-8">
          <div className="space-y-6">
            <div>
              <div className="text-6xl font-mono font-bold text-primary-600 dark:text-primary-400 mb-4">
                {formatTime(currentTime)}
              </div>
              <div className="text-xl capitalize text-gray-600 dark:text-gray-400 mb-2">
                {currentSession === "longBreak" ? "Long Break" : currentSession}
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-primary-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              {!isRunning && !isPaused ? (
                <Button
                  size="lg"
                  color="primary"
                  startContent={<Play className="w-5 h-5" />}
                  onClick={startTimer}
                >
                  Start
                </Button>
              ) : (
                <Button
                  size="lg"
                  color="warning"
                  startContent={<Pause className="w-5 h-5" />}
                  onClick={pauseTimer}
                >
                  Pause
                </Button>
              )}

              <Button
                size="lg"
                variant="bordered"
                startContent={<RotateCcw className="w-5 h-5" />}
                onClick={resetTimer}
              >
                Reset
              </Button>

              <Button
                size="lg"
                variant="light"
                startContent={<SkipForward className="w-5 h-5" />}
                onClick={skipSession}
              >
                Skip
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {sessionsCompleted}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Sessions Completed
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {nextSession}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Next Session
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card
          header={
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </div>
          }
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Work Duration: {workDuration} minutes
              </label>
              <Slider
                size="sm"
                step={1}
                minValue={1}
                maxValue={60}
                value={workDuration}
                onChange={(value) =>
                  updateSettings({
                    workDuration: Array.isArray(value) ? value[0] : value,
                  })
                }
                className="max-w-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Short Break: {breakDuration} minutes
              </label>
              <Slider
                size="sm"
                step={1}
                minValue={1}
                maxValue={30}
                value={breakDuration}
                onChange={(value) =>
                  updateSettings({
                    breakDuration: Array.isArray(value) ? value[0] : value,
                  })
                }
                className="max-w-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Long Break: {longBreakDuration} minutes
              </label>
              <Slider
                size="sm"
                step={1}
                minValue={1}
                maxValue={60}
                value={longBreakDuration}
                onChange={(value) =>
                  updateSettings({
                    longBreakDuration: Array.isArray(value) ? value[0] : value,
                  })
                }
                className="max-w-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Long Break Interval: Every {longBreakInterval} sessions
              </label>
              <Slider
                size="sm"
                step={1}
                minValue={2}
                maxValue={10}
                value={longBreakInterval}
                onChange={(value) =>
                  updateSettings({
                    longBreakInterval: Array.isArray(value) ? value[0] : value,
                  })
                }
                className="max-w-md"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Sound Notifications
              </label>
              <Switch
                isSelected={soundEnabled}
                onValueChange={(checked) =>
                  updateSettings({ soundEnabled: checked })
                }
              />
            </div>
          </div>
        </Card>
      </div>

      {sessions.length > 0 && (
        <Card
          header={<h3 className="text-lg font-semibold">Session History</h3>}
        >
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {sessions
              .slice(-10)
              .reverse()
              .map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        session.type === "work"
                          ? "bg-red-500"
                          : session.type === "break"
                          ? "bg-green-500"
                          : "bg-blue-500"
                      }`}
                    />
                    <span className="text-sm font-medium capitalize">
                      {session.type === "longBreak"
                        ? "Long Break"
                        : session.type}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {/* {session.completedAt.toLocaleTimeString()} */}
                    {session.completedAt instanceof Date
                      ? session.completedAt.toLocaleTimeString()
                      : new Date(session.completedAt).toLocaleTimeString()}
                  </div>
                </div>
              ))}
          </div>
        </Card>
      )}
    </div>
  );
}
