import React, { createContext, useContext, useState, useEffect } from 'react';
import { WorkoutLog, CompletedExercise } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface WorkoutLogContextType {
  logs: WorkoutLog[];
  addWorkoutLog: (routineId: string, completedExercises: CompletedExercise[], duration: number, notes?: string) => void;
  getLogsByRoutineId: (routineId: string) => WorkoutLog[];
  getRecentLogs: (limit?: number) => WorkoutLog[];
}

const WorkoutLogContext = createContext<WorkoutLogContextType | undefined>(undefined);

export const useWorkoutLogs = () => {
  const context = useContext(WorkoutLogContext);
  if (!context) {
    throw new Error('useWorkoutLogs must be used within a WorkoutLogProvider');
  }
  return context;
};

export const WorkoutLogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<WorkoutLog[]>(() => {
    const savedLogs = localStorage.getItem('workoutLogs');
    return savedLogs ? JSON.parse(savedLogs) : [];
  });
  
  useEffect(() => {
    localStorage.setItem('workoutLogs', JSON.stringify(logs));
  }, [logs]);
  
  const addWorkoutLog = (
    routineId: string, 
    completedExercises: CompletedExercise[], 
    duration: number, 
    notes?: string
  ) => {
    const newLog: WorkoutLog = {
      id: uuidv4(),
      routineId,
      completedExercises,
      date: new Date(),
      duration,
      notes
    };
    
    setLogs([newLog, ...logs]);
  };
  
  const getLogsByRoutineId = (routineId: string) => {
    return logs.filter(log => log.routineId === routineId);
  };
  
  const getRecentLogs = (limit = 10) => {
    // Sort by date (newest first) and limit the results
    return [...logs]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  };
  
  return (
    <WorkoutLogContext.Provider value={{
      logs,
      addWorkoutLog,
      getLogsByRoutineId,
      getRecentLogs
    }}>
      {children}
    </WorkoutLogContext.Provider>
  );
};