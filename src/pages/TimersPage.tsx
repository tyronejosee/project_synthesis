import { useState, useEffect } from "react";
import {
  Input,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import {
  Plus,
  Play,
  Pause,
  RotateCcw,
  Trash2,
  Clock,
  Timer as TimerIcon,
} from "lucide-react";
import { Card } from "../shared/ui/Card";
import { Button } from "../shared/ui/Button";
import { useTimersStore, Timer } from "../shared/stores/useTimersStore";
import { formatTime, parseDuration } from "../shared/utils/time";

export function TimersPage() {
  const {
    timers,
    addTimer,
    deleteTimer,
    startTimer,
    pauseTimer,
    resetTimer,
    tick,
  } = useTimersStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [timerForm, setTimerForm] = useState({
    name: "",
    duration: "05:00",
    type: "countdown" as "countdown" | "stopwatch",
  });

  // Tick all running timers
  useEffect(() => {
    const interval = setInterval(() => {
      timers.forEach((timer) => {
        if (timer.isRunning && !timer.isPaused) {
          tick(timer.id);
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timers, tick]);

  const handleSubmit = () => {
    if (timerForm.name.trim()) {
      const duration =
        timerForm.type === "countdown" ? parseDuration(timerForm.duration) : 0;
      addTimer(timerForm.name.trim(), duration, timerForm.type);
      setTimerForm({ name: "", duration: "05:00", type: "countdown" });
      onClose();
    }
  };

  const getProgress = (timer: Timer) => {
    if (timer.type === "stopwatch") return 0;
    return timer.duration > 0
      ? ((timer.duration - timer.currentTime) / timer.duration) * 100
      : 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Multi-Timer Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage multiple timers for different tasks
          </p>
        </div>
        <Button
          color="primary"
          startContent={<Plus className="w-4 h-4" />}
          onClick={onOpen}
        >
          Add Timer
        </Button>
      </div>

      {timers.length === 0 ? (
        <Card className="text-center p-12">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No timers yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Create your first timer to start tracking time for different
                tasks
              </p>
              <Button
                color="primary"
                startContent={<Plus className="w-4 h-4" />}
                onClick={onOpen}
              >
                Add Your First Timer
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {timers.map((timer) => (
            <Card key={timer.id} className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-2 rounded-lg ${
                        timer.type === "countdown"
                          ? "bg-orange-100 dark:bg-orange-900/20"
                          : "bg-blue-100 dark:bg-blue-900/20"
                      }`}
                    >
                      {timer.type === "countdown" ? (
                        <TimerIcon
                          className={`w-4 h-4 ${
                            timer.type === "countdown"
                              ? "text-orange-600 dark:text-orange-400"
                              : "text-blue-600 dark:text-blue-400"
                          }`}
                        />
                      ) : (
                        <Clock
                          className={`w-4 h-4 ${
                            timer.type === "countdown"
                              ? "text-orange-600 dark:text-orange-400"
                              : "text-blue-600 dark:text-blue-400"
                          }`}
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                        {timer.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {timer.type}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="light"
                    color="danger"
                    onClick={() => deleteTimer(timer.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-mono font-bold text-gray-900 dark:text-white mb-2">
                    {formatTime(timer.currentTime)}
                  </div>
                  {timer.type === "countdown" && timer.duration > 0 && (
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
                      <div
                        className={`h-2 rounded-full transition-all duration-1000 ${
                          timer.currentTime === 0
                            ? "bg-red-500"
                            : "bg-primary-500"
                        }`}
                        style={{ width: `${getProgress(timer)}%` }}
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center gap-2">
                  {!timer.isRunning ? (
                    <Button
                      size="sm"
                      color="primary"
                      startContent={<Play className="w-4 h-4" />}
                      onClick={() => startTimer(timer.id)}
                      disabled={
                        timer.type === "countdown" && timer.currentTime === 0
                      }
                    >
                      Start
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      color="warning"
                      startContent={<Pause className="w-4 h-4" />}
                      onClick={() => pauseTimer(timer.id)}
                    >
                      Pause
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="bordered"
                    startContent={<RotateCcw className="w-4 h-4" />}
                    onClick={() => resetTimer(timer.id)}
                  >
                    Reset
                  </Button>
                </div>

                {timer.isRunning && (
                  <div className="flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-green-600 dark:text-green-400 ml-2">
                      Running
                    </span>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Timer Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Add New Timer</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Timer Name"
                placeholder="Enter timer name"
                value={timerForm.name}
                onValueChange={(value) =>
                  setTimerForm({ ...timerForm, name: value })
                }
              />

              <Select
                label="Timer Type"
                selectedKeys={[timerForm.type]}
                onSelectionChange={(keys) => {
                  const type = Array.from(keys)[0] as "countdown" | "stopwatch";
                  setTimerForm({ ...timerForm, type });
                }}
              >
                <SelectItem key="countdown" value="countdown">
                  Countdown Timer
                </SelectItem>
                <SelectItem key="stopwatch" value="stopwatch">
                  Stopwatch
                </SelectItem>
              </Select>

              {timerForm.type === "countdown" && (
                <Input
                  label="Duration (MM:SS)"
                  placeholder="05:00"
                  value={timerForm.duration}
                  onValueChange={(value) =>
                    setTimerForm({ ...timerForm, duration: value })
                  }
                />
              )}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onClick={onClose}>
              Cancel
            </Button>
            <Button color="primary" onClick={handleSubmit}>
              Add Timer
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
