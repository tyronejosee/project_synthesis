import { useState, useEffect } from "react";
import { Card } from "../shared/ui/Card";
import { Button } from "../shared/ui/Button";
import {
  Input,
  Switch,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Chip,
} from "@heroui/react";
import { Plus, Bell, Trash2, Edit, Volume2, VolumeX } from "lucide-react";
import { useAlarmsStore, Alarm } from "../shared/stores/useAlarmsStore";
import { getDayName } from "../shared/utils/time";

export function AlarmsPage() {
  const {
    alarms,
    addAlarm,
    updateAlarm,
    deleteAlarm,
    toggleAlarm,
    checkAlarms,
  } = useAlarmsStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [alarmForm, setAlarmForm] = useState({
    name: "",
    time: "",
    date: "",
    isRecurring: false,
    daysOfWeek: [] as number[],
    soundEnabled: true,
  });
  const [editingAlarm, setEditingAlarm] = useState<Alarm | null>(null);

  // Check alarms every minute
  useEffect(() => {
    const interval = setInterval(checkAlarms, 60000);
    return () => clearInterval(interval);
  }, [checkAlarms]);

  const handleSubmit = () => {
    if (alarmForm.name.trim() && alarmForm.time) {
      const alarmData = {
        name: alarmForm.name.trim(),
        time: alarmForm.time,
        date: alarmForm.isRecurring ? undefined : alarmForm.date || undefined,
        isActive: true,
        isRecurring: alarmForm.isRecurring,
        daysOfWeek: alarmForm.isRecurring ? alarmForm.daysOfWeek : [],
        soundEnabled: alarmForm.soundEnabled,
      };

      if (editingAlarm) {
        updateAlarm(editingAlarm.id, alarmData);
      } else {
        addAlarm(alarmData);
      }

      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setAlarmForm({
      name: "",
      time: "",
      date: "",
      isRecurring: false,
      daysOfWeek: [],
      soundEnabled: true,
    });
    setEditingAlarm(null);
  };

  const openEditModal = (alarm: Alarm) => {
    setEditingAlarm(alarm);
    setAlarmForm({
      name: alarm.name,
      time: alarm.time,
      date: alarm.date || "",
      isRecurring: alarm.isRecurring,
      daysOfWeek: alarm.daysOfWeek,
      soundEnabled: alarm.soundEnabled,
    });
    onOpen();
  };

  const toggleDay = (dayIndex: number) => {
    const newDays = alarmForm.daysOfWeek.includes(dayIndex)
      ? alarmForm.daysOfWeek.filter((d) => d !== dayIndex)
      : [...alarmForm.daysOfWeek, dayIndex];
    setAlarmForm({ ...alarmForm, daysOfWeek: newDays });
  };

  const formatAlarmSchedule = (alarm: Alarm) => {
    if (alarm.isRecurring) {
      if (alarm.daysOfWeek.length === 7) return "Every day";
      if (alarm.daysOfWeek.length === 0) return "No days selected";
      return alarm.daysOfWeek
        .map((day) => getDayName(day).slice(0, 3))
        .join(", ");
    }
    return alarm.date ? new Date(alarm.date).toLocaleDateString() : "Today";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Alarms & Reminders
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Set up notifications for important events
          </p>
        </div>
        <Button
          color="primary"
          startContent={<Plus className="w-4 h-4" />}
          onClick={() => {
            resetForm();
            onOpen();
          }}
        >
          Add Alarm
        </Button>
      </div>

      {alarms.length === 0 ? (
        <Card className="text-center p-12">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No alarms set
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Create your first alarm to get notified about important events
              </p>
              <Button
                color="primary"
                startContent={<Plus className="w-4 h-4" />}
                onClick={() => {
                  resetForm();
                  onOpen();
                }}
              >
                Add Your First Alarm
              </Button>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alarms.map((alarm) => (
            <Card key={alarm.id} className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-2 rounded-lg ${
                        alarm.isActive
                          ? "bg-green-100 dark:bg-green-900/20"
                          : "bg-gray-100 dark:bg-gray-700"
                      }`}
                    >
                      <Bell
                        className={`w-4 h-4 ${
                          alarm.isActive
                            ? "text-green-600 dark:text-green-400"
                            : "text-gray-400"
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                        {alarm.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatAlarmSchedule(alarm)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="light"
                      onClick={() => openEditModal(alarm)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="light"
                      color="danger"
                      onClick={() => deleteAlarm(alarm.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-3xl font-mono font-bold text-gray-900 dark:text-white mb-2">
                    {alarm.time}
                  </div>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Chip
                      size="sm"
                      color={alarm.isActive ? "success" : "default"}
                      variant="flat"
                    >
                      {alarm.isActive ? "Active" : "Inactive"}
                    </Chip>
                    {alarm.soundEnabled ? (
                      <Volume2 className="w-4 h-4 text-gray-400" />
                    ) : (
                      <VolumeX className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <Switch
                    isSelected={alarm.isActive}
                    onValueChange={() => toggleAlarm(alarm.id)}
                    size="lg"
                  />
                </div>

                {alarm.isRecurring && alarm.daysOfWeek.length > 0 && (
                  <div className="flex flex-wrap gap-1 justify-center">
                    {alarm.daysOfWeek.map((dayIndex) => (
                      <Chip key={dayIndex} size="sm" variant="flat">
                        {getDayName(dayIndex).slice(0, 3)}
                      </Chip>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Alarm Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalContent>
          <ModalHeader>
            {editingAlarm ? "Edit Alarm" : "Add New Alarm"}
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Alarm Name"
                placeholder="Enter alarm name"
                value={alarmForm.name}
                onValueChange={(value) =>
                  setAlarmForm({ ...alarmForm, name: value })
                }
              />

              <Input
                type="time"
                label="Time"
                value={alarmForm.time}
                onValueChange={(value) =>
                  setAlarmForm({ ...alarmForm, time: value })
                }
              />

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Recurring Alarm
                </label>
                <Switch
                  isSelected={alarmForm.isRecurring}
                  onValueChange={(checked) =>
                    setAlarmForm({ ...alarmForm, isRecurring: checked })
                  }
                />
              </div>

              {alarmForm.isRecurring ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Days of Week
                  </label>
                  <div className="grid grid-cols-7 gap-2">
                    {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => (
                      <Button
                        key={dayIndex}
                        size="sm"
                        variant={
                          alarmForm.daysOfWeek.includes(dayIndex)
                            ? "solid"
                            : "bordered"
                        }
                        color={
                          alarmForm.daysOfWeek.includes(dayIndex)
                            ? "primary"
                            : "default"
                        }
                        onClick={() => toggleDay(dayIndex)}
                      >
                        {getDayName(dayIndex).slice(0, 3)}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <Input
                  type="date"
                  label="Date (optional)"
                  placeholder="Leave empty for today"
                  value={alarmForm.date}
                  onValueChange={(value) =>
                    setAlarmForm({ ...alarmForm, date: value })
                  }
                />
              )}

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sound Notification
                </label>
                <Switch
                  isSelected={alarmForm.soundEnabled}
                  onValueChange={(checked) =>
                    setAlarmForm({ ...alarmForm, soundEnabled: checked })
                  }
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onClick={onClose}>
              Cancel
            </Button>
            <Button color="primary" onClick={handleSubmit}>
              {editingAlarm ? "Update" : "Add"} Alarm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
