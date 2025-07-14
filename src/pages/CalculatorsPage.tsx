import { useState } from "react";
import { Input, Tabs, Tab } from "@heroui/react";
import { Calculator, Clock, Target, TrendingUp } from "lucide-react";
import { Card } from "../shared/ui/Card";
import { Button } from "../shared/ui/Button";
import { calculateTimeDifference } from "../shared/utils/time";

export function CalculatorsPage() {
  const [timeDiff, setTimeDiff] = useState({
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    result: "",
  });

  const [storyPoints, setStoryPoints] = useState({
    points: "",
    velocity: "",
    result: "",
  });

  const [estimation, setEstimation] = useState({
    optimistic: "",
    mostLikely: "",
    pessimistic: "",
    result: "",
  });

  const [sprintPlanning, setSprintPlanning] = useState({
    totalStoryPoints: "",
    teamSize: "",
    sprintDays: "",
    workingHours: "",
    result: "",
  });

  const calculateTimeDiff = () => {
    if (
      timeDiff.startDate &&
      timeDiff.startTime &&
      timeDiff.endDate &&
      timeDiff.endTime
    ) {
      const start = new Date(`${timeDiff.startDate}T${timeDiff.startTime}`);
      const end = new Date(`${timeDiff.endDate}T${timeDiff.endTime}`);
      const result = calculateTimeDifference(start, end);
      setTimeDiff({ ...timeDiff, result });
    }
  };

  const calculateStoryPointsToHours = () => {
    if (storyPoints.points && storyPoints.velocity) {
      const points = parseFloat(storyPoints.points);
      const velocity = parseFloat(storyPoints.velocity);
      const hours = (points / velocity) * 40; // Assuming 40 hours per sprint
      setStoryPoints({ ...storyPoints, result: `${hours.toFixed(1)} hours` });
    }
  };

  const calculateThreePointEstimate = () => {
    if (
      estimation.optimistic &&
      estimation.mostLikely &&
      estimation.pessimistic
    ) {
      const o = parseFloat(estimation.optimistic);
      const m = parseFloat(estimation.mostLikely);
      const p = parseFloat(estimation.pessimistic);
      const estimate = (o + 4 * m + p) / 6;
      const standardDeviation = (p - o) / 6;
      setEstimation({
        ...estimation,
        result: `${estimate.toFixed(1)} hours (±${standardDeviation.toFixed(
          1
        )})`,
      });
    }
  };

  const calculateSprintCapacity = () => {
    if (
      sprintPlanning.totalStoryPoints &&
      sprintPlanning.teamSize &&
      sprintPlanning.sprintDays &&
      sprintPlanning.workingHours
    ) {
      const totalPoints = parseFloat(sprintPlanning.totalStoryPoints);
      const team = parseFloat(sprintPlanning.teamSize);
      const days = parseFloat(sprintPlanning.sprintDays);
      const hours = parseFloat(sprintPlanning.workingHours);

      const totalCapacity = team * days * hours;
      const pointsPerHour = totalPoints / totalCapacity;
      const hoursPerPoint = totalCapacity / totalPoints;

      setSprintPlanning({
        ...sprintPlanning,
        result: `Capacity: ${totalCapacity}h | ${pointsPerHour.toFixed(
          2
        )} pts/h | ${hoursPerPoint.toFixed(2)} h/pt`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Developer Calculators
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Useful calculators for development and project management
        </p>
      </div>

      <Tabs aria-label="Calculator tabs" className="w-full">
        <Tab
          key="time-diff"
          title={
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Time Difference</span>
            </div>
          }
        >
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Time Difference Calculator
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300">
                    Start Time
                  </h4>
                  <Input
                    type="date"
                    label="Start Date"
                    value={timeDiff.startDate}
                    onValueChange={(value) =>
                      setTimeDiff({ ...timeDiff, startDate: value })
                    }
                  />
                  <Input
                    type="time"
                    label="Start Time"
                    value={timeDiff.startTime}
                    onValueChange={(value) =>
                      setTimeDiff({ ...timeDiff, startTime: value })
                    }
                  />
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300">
                    End Time
                  </h4>
                  <Input
                    type="date"
                    label="End Date"
                    value={timeDiff.endDate}
                    onValueChange={(value) =>
                      setTimeDiff({ ...timeDiff, endDate: value })
                    }
                  />
                  <Input
                    type="time"
                    label="End Time"
                    value={timeDiff.endTime}
                    onValueChange={(value) =>
                      setTimeDiff({ ...timeDiff, endTime: value })
                    }
                  />
                </div>
              </div>

              <Button color="primary" onClick={calculateTimeDiff}>
                Calculate Difference
              </Button>

              {timeDiff.result && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                    Time Difference: {timeDiff.result}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </Tab>

        <Tab
          key="story-points"
          title={
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span>Story Points</span>
            </div>
          }
        >
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Story Points to Hours Converter
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="number"
                  label="Story Points"
                  placeholder="Enter story points"
                  value={storyPoints.points}
                  onValueChange={(value) =>
                    setStoryPoints({ ...storyPoints, points: value })
                  }
                />
                <Input
                  type="number"
                  label="Team Velocity (points/sprint)"
                  placeholder="Enter team velocity"
                  value={storyPoints.velocity}
                  onValueChange={(value) =>
                    setStoryPoints({ ...storyPoints, velocity: value })
                  }
                />
              </div>

              <Button color="primary" onClick={calculateStoryPointsToHours}>
                Convert to Hours
              </Button>

              {storyPoints.result && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-lg font-semibold text-green-900 dark:text-green-100">
                    Estimated Time: {storyPoints.result}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </Tab>

        <Tab
          key="estimation"
          title={
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>3-Point Estimate</span>
            </div>
          }
        >
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Three-Point Estimation
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Calculate project estimates using optimistic, most likely, and
                pessimistic scenarios
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  type="number"
                  label="Optimistic (hours)"
                  placeholder="Best case"
                  value={estimation.optimistic}
                  onValueChange={(value) =>
                    setEstimation({ ...estimation, optimistic: value })
                  }
                />
                <Input
                  type="number"
                  label="Most Likely (hours)"
                  placeholder="Expected case"
                  value={estimation.mostLikely}
                  onValueChange={(value) =>
                    setEstimation({ ...estimation, mostLikely: value })
                  }
                />
                <Input
                  type="number"
                  label="Pessimistic (hours)"
                  placeholder="Worst case"
                  value={estimation.pessimistic}
                  onValueChange={(value) =>
                    setEstimation({ ...estimation, pessimistic: value })
                  }
                />
              </div>

              <Button color="primary" onClick={calculateThreePointEstimate}>
                Calculate Estimate
              </Button>

              {estimation.result && (
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <p className="text-lg font-semibold text-purple-900 dark:text-purple-100">
                    Estimated Time: {estimation.result}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </Tab>

        <Tab
          key="sprint-planning"
          title={
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              <span>Sprint Planning</span>
            </div>
          }
        >
          <Card className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Sprint Capacity Calculator
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="number"
                  label="Total Story Points"
                  placeholder="Sprint backlog points"
                  value={sprintPlanning.totalStoryPoints}
                  onValueChange={(value) =>
                    setSprintPlanning({
                      ...sprintPlanning,
                      totalStoryPoints: value,
                    })
                  }
                />
                <Input
                  type="number"
                  label="Team Size"
                  placeholder="Number of developers"
                  value={sprintPlanning.teamSize}
                  onValueChange={(value) =>
                    setSprintPlanning({ ...sprintPlanning, teamSize: value })
                  }
                />
                <Input
                  type="number"
                  label="Sprint Duration (days)"
                  placeholder="Working days in sprint"
                  value={sprintPlanning.sprintDays}
                  onValueChange={(value) =>
                    setSprintPlanning({ ...sprintPlanning, sprintDays: value })
                  }
                />
                <Input
                  type="number"
                  label="Daily Working Hours"
                  placeholder="Hours per day per person"
                  value={sprintPlanning.workingHours}
                  onValueChange={(value) =>
                    setSprintPlanning({
                      ...sprintPlanning,
                      workingHours: value,
                    })
                  }
                />
              </div>

              <Button color="primary" onClick={calculateSprintCapacity}>
                Calculate Sprint Metrics
              </Button>

              {sprintPlanning.result && (
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <p className="text-lg font-semibold text-orange-900 dark:text-orange-100">
                    {sprintPlanning.result}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
}
