export type Task = {
  id: number;
  text: string;
  description?: string; // 👈 Nueva propiedad opcional
  completed: boolean;
  createdDate: string; // fecha de creación
  createdTime: string; // hora de creación
  dueDate: string; // fecha de vencimiento
  dueTime: string; // hora de vencimiento
  completedAt?: string; // fecha/hora de completado
};
