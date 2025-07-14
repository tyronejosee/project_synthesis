import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import {
  Input,
  Textarea,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Chip,
} from "@heroui/react";
import { Plus, Edit, Trash2, Tag } from "lucide-react";
import { Card } from "../shared/ui/Card";
import { Button } from "../shared/ui/Button";
import { useKanbanStore, Task } from "../shared/stores/useKanbanStore";

export function KanbanPage() {
  const { columns, addColumn, addTask, updateTask, deleteTask, moveTask } =
    useKanbanStore();
  const {
    isOpen: isColumnModalOpen,
    onOpen: onColumnModalOpen,
    onClose: onColumnModalClose,
  } = useDisclosure();
  const {
    isOpen: isTaskModalOpen,
    onOpen: onTaskModalOpen,
    onClose: onTaskModalClose,
  } = useDisclosure();

  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [newColumnColor, setNewColumnColor] = useState("#64748b");
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high",
    tags: "",
  });
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleColumnSubmit = () => {
    if (newColumnTitle.trim()) {
      addColumn(newColumnTitle.trim(), newColumnColor);
      setNewColumnTitle("");
      setNewColumnColor("#64748b");
      onColumnModalClose();
    }
  };

  const handleTaskSubmit = () => {
    if (taskForm.title.trim() && selectedColumn) {
      const taskData = {
        title: taskForm.title.trim(),
        description: taskForm.description.trim(),
        priority: taskForm.priority,
        tags: taskForm.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      if (editingTask) {
        updateTask(editingTask.id, taskData);
      } else {
        addTask(selectedColumn, taskData);
      }

      setTaskForm({ title: "", description: "", priority: "medium", tags: "" });
      setEditingTask(null);
      onTaskModalClose();
    }
  };

  const openTaskModal = (columnId: string, task?: Task) => {
    setSelectedColumn(columnId);
    if (task) {
      setEditingTask(task);
      setTaskForm({
        title: task.title,
        description: task.description,
        priority: task.priority,
        tags: task.tags.join(", "),
      });
    } else {
      setEditingTask(null);
      setTaskForm({ title: "", description: "", priority: "medium", tags: "" });
    }
    onTaskModalOpen();
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      moveTask(
        draggableId,
        source.droppableId,
        destination.droppableId,
        destination.index
      );
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "danger";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  const sortedColumns = [...columns].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Kanban Board
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Organize your tasks visually
          </p>
        </div>
        <Button
          color="primary"
          startContent={<Plus className="w-4 h-4" />}
          onClick={onColumnModalOpen}
        >
          Add Column
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {sortedColumns.map((column) => (
            <div key={column.id} className="flex-shrink-0 w-80">
              <Card className="h-full">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: column.color }}
                      />
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {column.title}
                      </h3>
                      <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                        {column.tasks.length}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="light"
                      onClick={() => openTaskModal(column.id)}
                      startContent={<Plus className="w-4 h-4" />}
                    >
                      Add
                    </Button>
                  </div>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`p-4 space-y-3 min-h-[200px] ${
                        snapshot.isDraggingOver
                          ? "bg-blue-50 dark:bg-blue-900/20"
                          : ""
                      }`}
                    >
                      {column.tasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 ${
                                snapshot.isDragging ? "rotate-2" : ""
                              }`}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                                  {task.title}
                                </h4>
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="light"
                                    onClick={() =>
                                      openTaskModal(column.id, task)
                                    }
                                  >
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="light"
                                    color="danger"
                                    onClick={() => deleteTask(task.id)}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>

                              {task.description && (
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                  {task.description}
                                </p>
                              )}

                              <div className="flex items-center justify-between">
                                <div className="flex flex-wrap gap-1">
                                  {task.tags.map((tag) => (
                                    <Chip key={tag} size="sm" variant="flat">
                                      {tag}
                                    </Chip>
                                  ))}
                                </div>
                                <Chip
                                  size="sm"
                                  color={getPriorityColor(task.priority)}
                                  variant="flat"
                                >
                                  {task.priority}
                                </Chip>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Card>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* Add Column Modal */}
      <Modal isOpen={isColumnModalOpen} onClose={onColumnModalClose}>
        <ModalContent>
          <ModalHeader>Add New Column</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Column Title"
                placeholder="Enter column title"
                value={newColumnTitle}
                onValueChange={setNewColumnTitle}
              />
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Column Color
                </label>
                <input
                  type="color"
                  value={newColumnColor}
                  onChange={(e) => setNewColumnColor(e.target.value)}
                  className="w-full h-10 rounded border border-gray-300 dark:border-gray-600"
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onClick={onColumnModalClose}>
              Cancel
            </Button>
            <Button color="primary" onClick={handleColumnSubmit}>
              Add Column
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add/Edit Task Modal */}
      <Modal isOpen={isTaskModalOpen} onClose={onTaskModalClose}>
        <ModalContent>
          <ModalHeader>
            {editingTask ? "Edit Task" : "Add New Task"}
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Task Title"
                placeholder="Enter task title"
                value={taskForm.title}
                onValueChange={(value) =>
                  setTaskForm({ ...taskForm, title: value })
                }
              />
              <Textarea
                label="Description"
                placeholder="Enter task description (optional)"
                value={taskForm.description}
                onValueChange={(value) =>
                  setTaskForm({ ...taskForm, description: value })
                }
              />
              <Select
                label="Priority"
                selectedKeys={[taskForm.priority]}
                onSelectionChange={(keys) => {
                  const priority = Array.from(keys)[0] as
                    | "low"
                    | "medium"
                    | "high";
                  setTaskForm({ ...taskForm, priority });
                }}
              >
                <SelectItem key="low" value="low">
                  Low
                </SelectItem>
                <SelectItem key="medium" value="medium">
                  Medium
                </SelectItem>
                <SelectItem key="high" value="high">
                  High
                </SelectItem>
              </Select>
              <Input
                label="Tags"
                placeholder="Enter tags separated by commas"
                value={taskForm.tags}
                onValueChange={(value) =>
                  setTaskForm({ ...taskForm, tags: value })
                }
                startContent={<Tag className="w-4 h-4" />}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onClick={onTaskModalClose}>
              Cancel
            </Button>
            <Button variant="light" onClick={handleTaskSubmit}>
              {editingTask ? "Update" : "Add"} Task
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
