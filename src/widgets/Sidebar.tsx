import { Link, useLocation } from "react-router-dom";
import {
  Timer,
  Kanban,
  Clock,
  Bell,
  Calculator,
  LayoutDashboard,
  Zap,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Pomodoro", href: "/pomodoro", icon: Timer },
  { name: "Kanban", href: "/kanban", icon: Kanban },
  { name: "Timers", href: "/timers", icon: Clock },
  { name: "Alarms", href: "/alarms", icon: Bell },
  { name: "Calculators", href: "/calculators", icon: Calculator },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center w-8 h-8 bg-primary-500 rounded-lg">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Synthesis
        </h1>
      </div>

      <nav className="mt-6">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`
                flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors
                ${
                  isActive
                    ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-r-2 border-primary-500"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }
              `}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
