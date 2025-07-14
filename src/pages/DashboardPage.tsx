import { Link } from "react-router-dom";
import {
  Timer,
  Kanban,
  Clock,
  Bell,
  Calculator,
  TrendingUp,
  CheckCircle2,
  Activity,
} from "lucide-react";
import { Card } from "../shared/ui/Card";
import { Button } from "../shared/ui/Button";
import { usePomodoroStore } from "../shared/stores/usePomodoroStore";
import { useKanbanStore } from "../shared/stores/useKanbanStore";
import { useTimersStore } from "../shared/stores/useTimersStore";
import { useAlarmsStore } from "../shared/stores/useAlarmsStore";
import { formatTime } from "../shared/utils/time";

export function DashboardPage() {
  const { sessionsCompleted, currentTime, currentSession, isRunning } =
    usePomodoroStore();
  const { columns } = useKanbanStore();
  const { timers } = useTimersStore();
  const { alarms } = useAlarmsStore();

  const totalTasks = columns.reduce((sum, col) => sum + col.tasks.length, 0);
  const completedTasks =
    columns.find((col) => col.title === "Done")?.tasks.length || 0;
  const activeTimers = timers.filter((t) => t.isRunning).length;
  const activeAlarms = alarms.filter((a) => a.isActive).length;

  const quickActions = [
    {
      name: "Start Pomodoro",
      href: "/pomodoro",
      icon: Timer,
      color: "bg-red-500",
    },
    {
      name: "Open Kanban",
      href: "/kanban",
      icon: Kanban,
      color: "bg-blue-500",
    },
    {
      name: "Add Timer",
      href: "/timers",
      icon: Clock,
      color: "bg-green-500",
    },
    {
      name: "Set Alarm",
      href: "/alarms",
      icon: Bell,
      color: "bg-yellow-500",
    },
    {
      name: "Calculators",
      href: "/calculators",
      icon: Calculator,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <Timer className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {sessionsCompleted}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Pomodoro Sessions
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {completedTasks}/{totalTasks}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Tasks Completed
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {activeTimers}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Active Timers
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <Bell className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {activeAlarms}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Active Alarms
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          header={<h3 className="text-lg font-semibold">Current Session</h3>}
        >
          <div className="space-y-4">
            {isRunning ? (
              <div className="text-center p-6">
                <div className="text-4xl font-mono font-bold text-primary-600 dark:text-primary-400 mb-2">
                  {formatTime(currentTime)}
                </div>
                <div className="text-lg capitalize text-gray-600 dark:text-gray-400">
                  {currentSession === "longBreak"
                    ? "Long Break"
                    : currentSession}
                </div>
                <div className="mt-4">
                  <Link to="/pomodoro">
                    <Button size="sm">View Pomodoro</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center p-6">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No active session
                </p>
                <Link to="/pomodoro">
                  <Button startContent={<Timer className="w-4 h-4" />}>
                    Start Pomodoro
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </Card>

        <Card header={<h3 className="text-lg font-semibold">Quick Actions</h3>}>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Link key={action.name} to={action.href}>
                <Button
                  variant="light"
                  className="w-full h-16 flex-col gap-2"
                  startContent={
                    <div className={`p-2 rounded-lg ${action.color}`}>
                      <action.icon className="w-4 h-4 text-white" />
                    </div>
                  }
                >
                  <span className="text-xs">{action.name}</span>
                </Button>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          header={<h3 className="text-lg font-semibold">Recent Activity</h3>}
        >
          <div className="space-y-3">
            {sessionsCompleted === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                No recent activity. Start your first Pomodoro session!
              </p>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Completed {sessionsCompleted} Pomodoro session
                    {sessionsCompleted !== 1 ? "s" : ""}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Great progress!
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card header={<h3 className="text-lg font-semibold">Today's Focus</h3>}>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
              <div>
                <p className="text-sm font-medium text-primary-900 dark:text-primary-100">
                  Stay Productive
                </p>
                <p className="text-xs text-primary-600 dark:text-primary-400">
                  Use the Pomodoro technique to maintain focus
                </p>
              </div>
              <TrendingUp className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Organize Tasks
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  Keep your Kanban board updated
                </p>
              </div>
              <Kanban className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
