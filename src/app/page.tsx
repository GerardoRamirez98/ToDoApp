"use client"; 
// 👆 NECESARIO en Next.js App Router para usar Hooks (useState, useEffect)

// ---------------------------------------------
// IMPORTACIONES
// ---------------------------------------------
import { useState, useEffect } from "react";

// ---------------------------------------------
// TIPADO (TypeScript)
// Creamos un tipo `Task` para definir cómo luce una tarea
// ---------------------------------------------
type Task = {
  id: number;
  text: string;
  completed: boolean;
};

// ---------------------------------------------
// COMPONENTE PRINCIPAL (Home)
// Aquí vive toda la app
// ---------------------------------------------
export default function Home() {
  // ------------------------------
  // ESTADOS (useState)
  // ------------------------------
  const [tasks, setTasks] = useState<Task[]>([]); // lista de tareas
  const [text, setText] = useState("");           // input para nueva tarea
  const [editingId, setEditingId] = useState<number | null>(null); // id de la tarea en edición
  const [editText, setEditText] = useState("");   // texto mientras editamos

  // ------------------------------
  // USEEFFECT → localStorage
  // ------------------------------

  // 1) Al iniciar la app, cargamos tareas guardadas
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []); // 👈 se ejecuta SOLO una vez al montar el componente

  // 2) Cada vez que cambian las tareas, las guardamos en localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]); // 👈 se ejecuta cuando `tasks` cambie

  // ------------------------------
  // FUNCIONES
  // ------------------------------

  // 👉 Agregar tarea
  const addTask = () => {
    if (!text.trim()) return; // validación: no aceptar vacío
    const newTask: Task = {
      id: Date.now(), // generamos id único con timestamp
      text,
      completed: false,
    };
    setTasks([...tasks, newTask]); // actualizamos lista
    setText(""); // limpiamos input
  };

  // 👉 Marcar tarea como completada
  const toggleTask = (id: number) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  // 👉 Eliminar tarea
  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // 👉 Iniciar edición
  const startEditing = (id: number, currentText: string) => {
    setEditingId(id);
    setEditText(currentText);
  };

  // 👉 Guardar cambios de edición
  const saveEdit = (id: number) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, text: editText } : t
    ));
    setEditingId(null); // salimos del modo edición
    setEditText("");
  };

  // 👉 Cancelar edición
  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  // ---------------------------------------------
  // RENDER (JSX)
  // Aquí se pinta la interfaz
  // ---------------------------------------------
  return (
    <main className="p-6 max-w-md mx-auto">
      {/* Título */}
      <h1 className="text-2xl font-bold mb-4">To-Do App ✅</h1>

      {/* --------------------------------------------- */}
      {/* INPUT para agregar nueva tarea */}
      {/* --------------------------------------------- */}
      <div className="flex gap-2 mb-4">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border p-2 rounded"
          placeholder="Nueva tarea..."
        />
        <button
          onClick={addTask}
          className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600"
        >
          Agregar
        </button>
      </div>

      {/* --------------------------------------------- */}
      {/* LISTA DE TAREAS */}
      {/* --------------------------------------------- */}
      <ul className="space-y-2">
        {tasks.map(task => (
          <li
            key={task.id}
            className="flex justify-between items-center bg-gray-100 p-2 rounded"
          >
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
              // MODO NORMAL (texto + botones)
              // ------------------------------
              <>
                <span
                  onClick={() => toggleTask(task.id)}
                  className={`cursor-pointer ${
                    task.completed ? "line-through text-gray-500" : ""
                  }`}
                >
                  {task.text}
                </span>
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
        ))}
      </ul>
    </main>
  );
}
