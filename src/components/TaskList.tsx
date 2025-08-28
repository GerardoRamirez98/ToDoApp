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

export default function TaskList(props: Props) {
  return (
    <ul className="space-y-2">
      {props.tasks.map(task => (
        <TaskItem key={task.id} {...props} task={task} />
      ))}
    </ul>
  );
}
