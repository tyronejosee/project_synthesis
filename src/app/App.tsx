import { Routes, Route } from "react-router-dom";
import { Layout } from "./Layout";
import { DashboardPage } from "../pages/DashboardPage";
import { PomodoroPage } from "../pages/PomodoroPage";
import { KanbanPage } from "../pages/KanbanPage";
import { TimersPage } from "../pages/TimersPage";
import { AlarmsPage } from "../pages/AlarmsPage";
import { CalculatorsPage } from "../pages/CalculatorsPage";
import { useThemeStore } from "../shared/stores/useThemeStore";

function App() {
  const { isDark } = useThemeStore();

  return (
    <div className={isDark ? "dark" : ""}>
      <div className="min-h-screen bg-background text-foreground">
        <Layout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/pomodoro" element={<PomodoroPage />} />
            <Route path="/kanban" element={<KanbanPage />} />
            <Route path="/timers" element={<TimersPage />} />
            <Route path="/alarms" element={<AlarmsPage />} />
            <Route path="/calculators" element={<CalculatorsPage />} />
          </Routes>
        </Layout>
      </div>
    </div>
  );
}

export default App;
