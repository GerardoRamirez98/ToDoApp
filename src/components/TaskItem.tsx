"use client";

import { Task } from "../types";

type Props = {
  task: Task;
  editingId: number | null;
  editText: string;
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;
  startEditing: (id: number, text: string) => void;
  saveEdit: (id: number) => void;
  cancelEdit: () => void;
  setEditText: (text: string) => void;
};

export default function TaskItem({
  task,
  editingId,
  editText,
  toggleTask,
  deleteTask,
  startEditing,
  saveEdit,
  cancelEdit,
  setEditText,
}: Props) {
  const now = new Date();
  const due = new Date(`${task.dueDate}T${task.dueTime}:00`);
  const diff = now.getTime() - due.getTime();

  let bgColor = "bg-gray-700";
  if (!task.completed && diff > 0 && diff <= 24 * 60 * 60 * 1000)
    bgColor = "bg-yellow-500";
  if (!task.completed && diff > 24 * 60 * 60 * 1000) bgColor = "bg-red-500";
  if (task.completed) bgColor = "bg-green-600";

  return (
    <li
      className={`flex justify-between items-center p-2 rounded shadow-md ${bgColor}`}
    >
      {editingId === task.id ? (
        <div className="flex gap-2 w-full">
          <input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="flex-1 border p-1 rounded"
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && saveEdit(task.id)}
          />
          <button
            onClick={() => saveEdit(task.id)}
            className="bg-green-500 text-white px-2 rounded"
          >
            Guardar
          </button>
          <button
            onClick={cancelEdit}
            className="bg-gray-400 text-white px-2 rounded"
          >
            Cancelar
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
              />
              <span
                className={`cursor-pointer ${
                  task.completed ? "line-through text-gray-400" : ""
                }`}
                onClick={() => toggleTask(task.id)}
              >
                {task.text}
              </span>
            </div>
            <span className="text-xs text-gray-300 ml-6">
              Creada: {task.createdDate} {task.createdTime}
            </span>
            <span className="text-xs text-yellow-300 ml-6">
              Vence: {task.dueDate} {task.dueTime}
            </span>
            {task.completedAt && (
              <span className="text-xs text-green-400 ml-6">
                Completada: {task.completedAt}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => startEditing(task.id, task.text)}
              className="text-blue-400 hover:underline"
            >
              Editar
            </button>
            <button
              onClick={() => deleteTask(task.id)}
              className="text-red-400 hover:underline"
            >
              Eliminar
            </button>
          </div>
        </>
      )}
    </li>
  );
}
