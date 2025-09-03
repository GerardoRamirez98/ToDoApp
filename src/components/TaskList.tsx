"use client";

import { Task } from "../types";
import TaskItem from "./TaskItem";

type Props = {
  tasks: Task[];
  editingId: number | null;
  editText: string;
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;
  startEditing: (id: number, text: string) => void;
  saveEdit: (id: number) => void;
  cancelEdit: () => void;
  setEditText: (text: string) => void;
};

export default function TaskList({
  tasks,
  editingId,
  editText,
  toggleTask,
  deleteTask,
  startEditing,
  saveEdit,
  cancelEdit,
  setEditText,
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
          toggleTask={toggleTask}
          deleteTask={deleteTask}
          startEditing={startEditing}
          saveEdit={saveEdit}
          cancelEdit={cancelEdit}
          setEditText={setEditText}
        />
      ))}
    </ul>
  );
}
