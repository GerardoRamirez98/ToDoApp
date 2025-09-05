"use client";

import { Task } from "../types";
import TaskItem from "./TaskItem";

type Props = {
  tasks: Task[];
  editingId: number | null;
  editText: string;
  editDescription: string;
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;
  startEditing: (id: number, text: string, description?: string) => void;
  saveEdit: (id: number) => void;
  cancelEdit: () => void;
  setEditText: (text: string) => void;
  setEditDescription: (desc: string) => void;
};

export default function TaskList({
  tasks,
  editingId,
  editText,
  editDescription,
  toggleTask,
  deleteTask,
  startEditing,
  saveEdit,
  cancelEdit,
  setEditText,
  setEditDescription,
}: Props) {
  if (tasks.length === 0) {
    return <p className="text-gray-400">No hay tareas aquí.</p>;
  }

  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          editingId={editingId}
          editText={editText}
          editDescription={editDescription}
          toggleTask={toggleTask}
          deleteTask={deleteTask}
          startEditing={startEditing}
          saveEdit={saveEdit}
          cancelEdit={cancelEdit}
          setEditText={setEditText}
          setEditDescription={setEditDescription}
        />
      ))}
    </ul>
  );
}
