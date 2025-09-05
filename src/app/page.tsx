"use client";

import { useState, useEffect } from "react";
import { Task } from "../types";
import TaskList from "../components/TaskList";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./LPage.css"; // Para estilos extra

export default function LPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [text, setText] = useState(""); // título obligatorio
  const [description, setDescription] = useState(""); // descripción opcional

  const now = new Date();
  const [dueDate, setDueDate] = useState<Date | null>(new Date());
  const [dueHour, setDueHour] = useState(
    now.getHours() % 12 === 0 ? 12 : now.getHours() % 12
  );
  const [dueMinute, setDueMinute] = useState(
    Math.floor(now.getMinutes() / 15) * 15
  );
  const [dueAMPM, setDueAMPM] = useState(now.getHours() >= 12 ? "PM" : "AM");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [editDescription, setEditDescription] = useState(""); // 👈 para edición de descripción
  const [error, setError] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) setTasks(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!text.trim() || !dueDate || dueHour == null || dueMinute == null) {
      setError(true);
      return;
    }
    setError(false);

    const hour24 = dueAMPM === "PM" ? (dueHour % 12) + 12 : dueHour;
    const dueTime = `${hour24.toString().padStart(2, "0")}:${dueMinute
      .toString()
      .padStart(2, "0")}`;

    const nowDate = new Date();
    const newTask: Task = {
      id: Date.now(),
      text,
      description: description.trim() || "", // 👈 guardamos la descripción si hay
      completed: false,
      createdDate: nowDate.toISOString().slice(0, 10),
      createdTime: nowDate.toTimeString().slice(0, 5),
      dueDate: dueDate.toISOString().slice(0, 10),
      dueTime,
    };

    setTasks([...tasks, newTask]);
    setText("");
    setDescription(""); // limpiamos descripción
    setDueDate(new Date());
    setDueHour(now.getHours() % 12 === 0 ? 12 : now.getHours() % 12);
    setDueMinute(Math.floor(now.getMinutes() / 15) * 15);
    setDueAMPM(now.getHours() >= 12 ? "PM" : "AM");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") addTask();
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((t) => {
        if (t.id === id) {
          if (!t.completed) {
            const now = new Date();
            return {
              ...t,
              completed: true,
              completedAt: now.toISOString().replace("T", " ").slice(0, 16),
            };
          } else {
            return { ...t, completed: false, completedAt: undefined };
          }
        }
        return t;
      })
    );
  };

  const deleteTask = (id: number) => setTasks(tasks.filter((t) => t.id !== id));
  const startEditing = (id: number, text: string, description: string = "") => {
    setEditingId(id);
    setEditText(text);
    setEditDescription(description);
  };
  const saveEdit = (id: number) => {
    if (!editText.trim()) return; // no permitir guardar vacío el título
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, text: editText, description: editDescription } : t
      )
    );
    setEditingId(null);
    setEditText("");
    setEditDescription("");
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
    setEditDescription("");
  };

  const pendingTasks = tasks
    .filter((t) => !t.completed)
    .sort((a, b) =>
      (a.dueDate + a.dueTime).localeCompare(b.dueDate + b.dueTime)
    );
  const completedTasks = tasks
    .filter((t) => t.completed)
    .sort((a, b) => (a.completedAt || "").localeCompare(b.completedAt || ""));

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">ToDo App 📝</h1>

      {/* Inputs de nueva tarea */}
      <div className="flex flex-col gap-2 mb-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Título de la tarea"
          className={`border p-2 rounded ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        />

        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción de la tarea (opcional)"
          className="border p-2 rounded border-gray-300"
        />

        {/* Controles de fecha y hora */}
        <div className="flex gap-2 items-end flex-wrap">
          <DatePicker
            selected={dueDate}
            onChange={(date: Date | null) => setDueDate(date)}
            minDate={new Date()}
            dateFormat="yyyy-MM-dd"
            className={`border p-2 rounded ${
              error ? "border-red-500" : "border-gray-300"
            }`}
          />

          <select
            value={dueHour}
            onChange={(e) => setDueHour(Number(e.target.value))}
            className="border p-2 rounded text-black"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
              <option key={h} value={h} className="text-black">
                {h}
              </option>
            ))}
          </select>

          <input
            type="number"
            min={0}
            max={59}
            value={dueMinute}
            onChange={(e) => setDueMinute(Number(e.target.value))}
            className="border p-2 rounded w-16"
          />

          <select
            value={dueAMPM}
            onChange={(e) => setDueAMPM(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>

          <button
            onClick={addTask}
            className="bg-blue-500 px-4 py-2 rounded text-white hover:bg-blue-600"
          >
            Agregar
          </button>
        </div>
      </div>

      {/* Pendientes / Completadas */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-2">Pendientes</h2>
          <TaskList
            tasks={pendingTasks}
            editingId={editingId}
            editText={editText}
            toggleTask={toggleTask}
            deleteTask={deleteTask}
            startEditing={startEditing}
            saveEdit={saveEdit}
            cancelEdit={cancelEdit}
            setEditText={setEditText}
            editDescription={editDescription} // 👈 pasamos descripción editable
            setEditDescription={setEditDescription}
          />
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-2">Completadas</h2>
          <TaskList
            tasks={completedTasks}
            editingId={editingId}
            editText={editText}
            toggleTask={toggleTask}
            deleteTask={deleteTask}
            startEditing={startEditing}
            saveEdit={saveEdit}
            cancelEdit={cancelEdit}
            setEditText={setEditText}
            editDescription={editDescription}
            setEditDescription={setEditDescription}
          />
        </div>
      </div>
    </main>
  );
}
