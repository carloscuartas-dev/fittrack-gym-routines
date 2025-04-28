import { Exercise, MuscleGroup, Routine } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const muscleGroups: MuscleGroup[] = [
  'pecho',
  'espalda',
  'piernas',
  'hombros',
  'brazos',
  'core',
  'cardio'
];

export const initialExercises: Exercise[] = [
  {
    id: uuidv4(),
    name: 'Press Banco',
    muscleGroup: 'pecho',
    sets: 3,
    reps: 10,
    weight: 135
  },
  {
    id: uuidv4(),
    name: 'Sentadillas',
    muscleGroup: 'piernas',
    sets: 3,
    reps: 10,
    weight: 185
  },
  {
    id: uuidv4(),
    name: 'Peso Muerto',
    muscleGroup: 'espalda',
    sets: 3,
    reps: 8,
    weight: 225
  },
  {
    id: uuidv4(),
    name: 'Press Militar',
    muscleGroup: 'hombros',
    sets: 3,
    reps: 10,
    weight: 95
  },
  {
    id: uuidv4(),
    name: 'Curls Biceps',
    muscleGroup: 'brazos',
    sets: 3,
    reps: 12,
    weight: 35
  },
  {
    id: uuidv4(),
    name: 'Push-ups',
    muscleGroup: 'pecho',
    sets: 3,
    reps: 15,
    weight: 0
  },
  {
    id: uuidv4(),
    name: 'Pull-ups',
    muscleGroup: 'espalda',
    sets: 3,
    reps: 8,
    weight: 0
  },
  {
    id: uuidv4(),
    name: 'Lunges',
    muscleGroup: 'piernas',
    sets: 3,
    reps: 10,
    weight: 50
  }
];

export const initialRoutines: Routine[] = [
  {
    id: uuidv4(),
    name: 'Pecho y Tríceps',
    description: 'Rutina enfocada en pecho y tríceps',
    exercises: [initialExercises[0], initialExercises[3], initialExercises[5]],
    day: 'lunes',
    isFavorite: true,
    createdAt: new Date()
  },
  {
    id: uuidv4(),
    name: 'Lower Body Power',
    description: 'Heavy leg day with squats and deadlifts',
    exercises: [initialExercises[1], initialExercises[2], initialExercises[7]],
    day: 'miércoles',
    isFavorite: false,
    createdAt: new Date()
  },
  {
    id: uuidv4(),
    name: 'Espalda y Biceps',
    description: 'Focus on back strength and arm definition',
    exercises: [initialExercises[2], initialExercises[4], initialExercises[6]],
    day: 'viernes',
    isFavorite: true,
    createdAt: new Date()
  }
];