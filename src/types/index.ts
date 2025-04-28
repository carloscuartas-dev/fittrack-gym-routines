export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  sets: number;
  reps: number;
  weight: number;
  notes?: string;
}

export interface Routine {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
  day?: Day;
  isFavorite: boolean;
  createdAt: Date;
}

export type MuscleGroup = 
  | 'pecho'
  | 'espalda'
  | 'piernas'
  | 'hombros'
  | 'brazos'
  | 'core'
  | 'cardio';

export type Day = 
  | 'lunes'
  | 'martes'
  | 'miércoles'
  | 'jueves'
  | 'viernes'
  | 'sábado'
  | 'domingo';

export interface WorkoutLog {
  id: string;
  routineId: string;
  completedExercises: CompletedExercise[];
  date: Date;
  duration: number; // in minutes
  notes?: string;
}

export interface CompletedExercise {
  exerciseId: string;
  sets: CompletedSet[];
}

export interface CompletedSet {
  reps: number;
  weight: number;
}