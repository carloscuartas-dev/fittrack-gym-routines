import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Routine, Exercise, CompletedExercise, CompletedSet } from '../types';
import { CheckCircle, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface WorkoutViewProps {
  routine: Routine;
  onComplete: (completedExercises: CompletedExercise[], duration: number) => void;
  onCancel: () => void;
}

export const WorkoutView: React.FC<WorkoutViewProps> = ({ routine, onComplete, onCancel }) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<CompletedExercise[]>([]);
  const [startTime] = useState<number>(Date.now());
  const [timerDisplay, setTimerDisplay] = useState('00:00:00');
  const [currentSets, setCurrentSets] = useState<CompletedSet[]>([]);
  
  const currentExercise = routine.exercises[currentExerciseIndex];
  
  // Timer
  React.useEffect(() => {
    const timer = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
      const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
      
      setTimerDisplay(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    }, 1000);
    
    return () => clearInterval(timer);
  }, [startTime]);
  
  // Initialize sets for current exercise
  React.useEffect(() => {
    const initialSets = Array(currentExercise.sets).fill(null).map(() => ({
      reps: currentExercise.reps,
      weight: currentExercise.weight
    }));
    setCurrentSets(initialSets);
  }, [currentExerciseIndex, currentExercise]);
  
  const handleSetUpdate = (index: number, field: keyof CompletedSet, value: number) => {
    setCurrentSets(currentSets.map((set, i) => 
      i === index ? { ...set, [field]: value } : set
    ));
  };
  
  const handleNextExercise = () => {
    // Save current exercise progress
    setCompletedExercises([
      ...completedExercises,
      {
        exerciseId: currentExercise.id,
        sets: [...currentSets]
      }
    ]);
    
    if (currentExerciseIndex < routine.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      const duration = Math.floor((Date.now() - startTime) / (1000 * 60)); // in minutes
      onComplete([
        ...completedExercises, 
        {
          exerciseId: currentExercise.id,
          sets: [...currentSets]
        }
      ], duration);
    }
  };
  
  const handlePrevExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
    }
  };
  
  const progress = ((currentExerciseIndex) / routine.exercises.length) * 100;
  
  return (
    <div className="bg-white rounded-lg shadow-lg max-w-xl mx-auto">
      <div className="bg-blue-600 text-white p-4 rounded-t-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">{routine.name}</h2>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span className="text-sm font-mono">{timerDisplay}</span>
          </div>
        </div>
        
        <div className="mt-3 bg-blue-700 rounded-full h-2">
          <div 
            className="bg-green-400 h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-4 flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Ejercicio {currentExerciseIndex + 1} of {routine.exercises.length}
          </span>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePrevExercise}
              disabled={currentExerciseIndex === 0}
              className="px-2"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleNextExercise}
              className="px-2"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <h3 className="text-xl font-bold mb-1">{currentExercise.name}</h3>
        <p className="text-sm text-gray-500 capitalize mb-4">{currentExercise.muscleGroup}</p>
        
        <div className="overflow-hidden mb-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Serie
                </th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Repeticiones
                </th>
                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Peso (kg)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentSets.map((set, index) => (
                <tr key={index}>
                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                    {index + 1}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    <input
                      type="number"
                      min="0"
                      value={set.reps}
                      onChange={(e) => handleSetUpdate(index, 'reps', parseInt(e.target.value))}
                      className="w-16 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                    />
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                    <input
                      type="number"
                      min="0"
                      value={set.weight}
                      onChange={(e) => handleSetUpdate(index, 'weight', parseInt(e.target.value))}
                      className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex justify-between">
          <Button variant="outline" onClick={onCancel}>
            Cancelar Entrenamiento
          </Button>
          <Button 
            variant={currentExerciseIndex < routine.exercises.length - 1 ? 'primary' : 'secondary'}
            onClick={handleNextExercise}
          >
            {currentExerciseIndex < routine.exercises.length - 1 ? (
              'Siguiente Ejercicio'
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-1" /> Completar Entrenamiento
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};