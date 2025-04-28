import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';
import { Exercise, MuscleGroup, Routine, Day } from '../types';
import { useRoutines } from '../context/RoutineContext';
import { X, Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { muscleGroups } from '../data/initialData';

interface RoutineFormProps {
  routine?: Routine;
  onComplete: () => void;
}

export const RoutineForm: React.FC<RoutineFormProps> = ({ routine, onComplete }) => {
  const { addRoutine, updateRoutine, exercises: availableExercises } = useRoutines();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [day, setDay] = useState<Day | ''>('');
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [muscleGroupFilter, setMuscleGroupFilter] = useState<MuscleGroup | ''>('');
  
  useEffect(() => {
    if (routine) {
      setName(routine.name);
      setDescription(routine.description);
      setDay(routine.day || '');
      setSelectedExercises(routine.exercises);
    }
  }, [routine]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const routineData = {
      name,
      description,
      exercises: selectedExercises,
      day: day || undefined,
      isFavorite: routine?.isFavorite || false
    };
    
    if (routine) {
      updateRoutine({
        ...routineData,
        id: routine.id,
        createdAt: routine.createdAt
      });
    } else {
      addRoutine(routineData);
    }
    
    onComplete();
  };
  
  const addExercise = (exercise: Exercise) => {
    const newExercise = { ...exercise, id: uuidv4() };
    setSelectedExercises([...selectedExercises, newExercise]);
  };
  
  const removeExercise = (id: string) => {
    setSelectedExercises(selectedExercises.filter(ex => ex.id !== id));
  };
  
  const updateExerciseDetail = (id: string, field: keyof Exercise, value: number) => {
    setSelectedExercises(
      selectedExercises.map(ex => 
        ex.id === id ? { ...ex, [field]: value } : ex
      )
    );
  };
  
  const filteredExercises = muscleGroupFilter 
    ? availableExercises.filter(ex => ex.muscleGroup === muscleGroupFilter)
    : availableExercises;
  
  const days: Day[] = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'];
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Rutina
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      
      <div>
        <label htmlFor="day" className="block text-sm font-medium text-gray-700">
          Día (Opcional)
        </label>
        <select
          id="day"
          value={day}
          onChange={(e) => setDay(e.target.value as Day)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Selecciona un día</option>
          {days.map(d => (
            <option key={d} value={d} className="capitalize">
              {d}
            </option>
          ))}
        </select>
      </div>
      
      <div className="border rounded-md p-4">
        <h3 className="font-medium mb-2">Ejercicios Seleccionados</h3>
        
        {selectedExercises.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No hay ejercicios seleccionados</p>
        ) : (
          <ul className="space-y-3">
            {selectedExercises.map(exercise => (
              <li key={exercise.id} className="bg-gray-50 rounded p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{exercise.name}</span>
                  <button
                    type="button"
                    onClick={() => removeExercise(exercise.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs text-gray-500">Series</label>
                    <input
                      type="number"
                      min="1"
                      value={exercise.sets}
                      onChange={(e) => updateExerciseDetail(exercise.id, 'sets', parseInt(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Repeticiones</label>
                    <input
                      type="number"
                      min="1"
                      value={exercise.reps}
                      onChange={(e) => updateExerciseDetail(exercise.id, 'reps', parseInt(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Peso (kg)</label>
                    <input
                      type="number"
                      min="0"
                      value={exercise.weight}
                      onChange={(e) => updateExerciseDetail(exercise.id, 'weight', parseInt(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="border rounded-md p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Añadir Ejercicios</h3>
          
          <select
            value={muscleGroupFilter}
            onChange={(e) => setMuscleGroupFilter(e.target.value as MuscleGroup)}
            className="text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Todos los grupos musculares</option>
            {muscleGroups.map(group => (
              <option key={group} value={group} className="capitalize">
                {group}
              </option>
            ))}
          </select>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {filteredExercises.map(exercise => (
            <button
              key={exercise.id}
              type="button"
              onClick={() => addExercise(exercise)}
              className="flex justify-between items-center p-2 border rounded-md hover:bg-gray-50 text-left"
            >
              <div>
                <p className="font-medium">{exercise.name}</p>
                <p className="text-xs text-gray-500 capitalize">{exercise.muscleGroup}</p>
              </div>
              <Plus className="h-4 w-4 text-blue-500" />
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onComplete}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary">
          {routine ? 'Actualizar Rutina' : 'Crear Rutina'}
        </Button>
      </div>
    </form>
  );
};