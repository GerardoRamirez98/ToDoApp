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
  return (
    <li className="flex justify-between items-center bg-gray-600 p-2 rounded">
      {editingId === task.id ? (
        // ------------------------------
        // MODO EDICIÓN
        // ------------------------------
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
        // ------------------------------
        // MODO NORMAL
        // ------------------------------
        <>
          <div className="flex items-center gap-2">
            {/* Checkbox para marcar como completada */}
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
            />
            <span
              className={`cursor-pointer ${
                task.completed ? "line-through text-gray-500" : ""
              }`}
              onClick={() => toggleTask(task.id)}
            >
              {task.text}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => startEditing(task.id, task.text)}
              className="text-blue-500 hover:underline"
            >
              Editar
            </button>
            <button
              onClick={() => deleteTask(task.id)}
              className="text-red-500 hover:underline"
            >
              Eliminar
            </button>
          </div>
        </>
      )}
    </li>
  );
}
