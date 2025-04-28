import React, { createContext, useContext, useState, useEffect } from 'react';
import { Exercise, MuscleGroup, Routine } from '../types';
import { initialRoutines, initialExercises } from '../data/initialData';
import { v4 as uuidv4 } from 'uuid';

interface RoutineContextType {
  routines: Routine[];
  exercises: Exercise[];
  addRoutine: (routine: Omit<Routine, 'id' | 'createdAt'>) => void;
  updateRoutine: (routine: Routine) => void;
  deleteRoutine: (id: string) => void;
  toggleFavorite: (id: string) => void;
  getRoutinesByMuscleGroup: (muscleGroup: MuscleGroup) => Routine[];
  getRoutineById: (id: string) => Routine | undefined;
}

const RoutineContext = createContext<RoutineContextType | undefined>(undefined);

export const useRoutines = () => {
  const context = useContext(RoutineContext);
  if (!context) {
    throw new Error('useRoutines must be used within a RoutineProvider');
  }
  return context;
};

export const RoutineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [routines, setRoutines] = useState<Routine[]>(() => {
    const savedRoutines = localStorage.getItem('routines');
    return savedRoutines ? JSON.parse(savedRoutines) : initialRoutines;
  });
  
  const [exercises] = useState<Exercise[]>(initialExercises);

  useEffect(() => {
    localStorage.setItem('routines', JSON.stringify(routines));
  }, [routines]);

  const addRoutine = (routine: Omit<Routine, 'id' | 'createdAt'>) => {
    const newRoutine: Routine = {
      ...routine,
      id: uuidv4(),
      createdAt: new Date()
    };
    setRoutines([...routines, newRoutine]);
  };

  const updateRoutine = (updatedRoutine: Routine) => {
    setRoutines(routines.map(routine => 
      routine.id === updatedRoutine.id ? updatedRoutine : routine
    ));
  };

  const deleteRoutine = (id: string) => {
    setRoutines(routines.filter(routine => routine.id !== id));
  };

  const toggleFavorite = (id: string) => {
    setRoutines(routines.map(routine => 
      routine.id === id ? { ...routine, isFavorite: !routine.isFavorite } : routine
    ));
  };

  const getRoutinesByMuscleGroup = (muscleGroup: MuscleGroup) => {
    return routines.filter(routine => 
      routine.exercises.some(exercise => exercise.muscleGroup === muscleGroup)
    );
  };

  const getRoutineById = (id: string) => {
    return routines.find(routine => routine.id === id);
  };

  return (
    <RoutineContext.Provider value={{
      routines,
      exercises,
      addRoutine,
      updateRoutine,
      deleteRoutine,
      toggleFavorite,
      getRoutinesByMuscleGroup,
      getRoutineById
    }}>
      {children}
    </RoutineContext.Provider>
  );
};