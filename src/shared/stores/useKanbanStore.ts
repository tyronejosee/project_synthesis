import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Column {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
  order: number;
}

interface KanbanState {
  columns: Column[];
  addColumn: (title: string, color: string) => void;
  updateColumn: (id: string, updates: Partial<Column>) => void;
  deleteColumn: (id: string) => void;
  addTask: (columnId: string, task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  moveTask: (taskId: string, sourceColumnId: string, destinationColumnId: string, destinationIndex: number) => void;
  reorderColumns: (startIndex: number, endIndex: number) => void;
}

export const useKanbanStore = create<KanbanState>()(
  persist(
    (set, get) => ({
      columns: [
        {
          id: 'todo',
          title: 'To Do',
          color: '#64748b',
          tasks: [],
          order: 0
        },
        {
          id: 'in-progress',
          title: 'In Progress',
          color: '#f59e0b',
          tasks: [],
          order: 1
        },
        {
          id: 'done',
          title: 'Done',
          color: '#10b981',
          tasks: [],
          order: 2
        }
      ],

      addColumn: (title, color) => {
        const { columns } = get();
        const newColumn: Column = {
          id: Date.now().toString(),
          title,
          color,
          tasks: [],
          order: columns.length
        };
        set({ columns: [...columns, newColumn] });
      },

      updateColumn: (id, updates) => {
        const { columns } = get();
        set({
          columns: columns.map(col => 
            col.id === id ? { ...col, ...updates } : col
          )
        });
      },

      deleteColumn: (id) => {
        const { columns } = get();
        set({ columns: columns.filter(col => col.id !== id) });
      },

      addTask: (columnId, taskData) => {
        const { columns } = get();
        const newTask: Task = {
          ...taskData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date()
        };

        set({
          columns: columns.map(col =>
            col.id === columnId
              ? { ...col, tasks: [...col.tasks, newTask] }
              : col
          )
        });
      },

      updateTask: (taskId, updates) => {
        const { columns } = get();
        set({
          columns: columns.map(col => ({
            ...col,
            tasks: col.tasks.map(task =>
              task.id === taskId
                ? { ...task, ...updates, updatedAt: new Date() }
                : task
            )
          }))
        });
      },

      deleteTask: (taskId) => {
        const { columns } = get();
        set({
          columns: columns.map(col => ({
            ...col,
            tasks: col.tasks.filter(task => task.id !== taskId)
          }))
        });
      },

      moveTask: (taskId, sourceColumnId, destinationColumnId, destinationIndex) => {
        const { columns } = get();
        const sourceColumn = columns.find(col => col.id === sourceColumnId);
        const destinationColumn = columns.find(col => col.id === destinationColumnId);
        const task = sourceColumn?.tasks.find(t => t.id === taskId);

        if (!task || !sourceColumn || !destinationColumn) return;

        const newColumns = columns.map(col => {
          if (col.id === sourceColumnId) {
            return {
              ...col,
              tasks: col.tasks.filter(t => t.id !== taskId)
            };
          }
          if (col.id === destinationColumnId) {
            const newTasks = [...col.tasks];
            newTasks.splice(destinationIndex, 0, { ...task, updatedAt: new Date() });
            return {
              ...col,
              tasks: newTasks
            };
          }
          return col;
        });

        set({ columns: newColumns });
      },

      reorderColumns: (startIndex, endIndex) => {
        const { columns } = get();
        const result = Array.from(columns);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        const reorderedColumns = result.map((col, index) => ({
          ...col,
          order: index
        }));

        set({ columns: reorderedColumns });
      }
    }),
    {
      name: 'kanban-storage',
    }
  )
);