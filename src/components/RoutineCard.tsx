import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Routine } from '../types';
import { Star, Trash2, Edit, PlayCircle } from 'lucide-react';
import { useRoutines } from '../context/RoutineContext';

interface RoutineCardProps {
  routine: Routine;
  onEdit: (id: string) => void;
  onStart: (id: string) => void;
}

export const RoutineCard: React.FC<RoutineCardProps> = ({ routine, onEdit, onStart }) => {
  const { toggleFavorite, deleteRoutine } = useRoutines();
  
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(routine.id);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('¿Estás segura de querer borrar esta rutina?')) {
      deleteRoutine(routine.id);
    }
  };
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(routine.id);
  };
  
  const handleStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStart(routine.id);
  };
  
  const muscleGroups = [...new Set(routine.exercises.map(ex => ex.muscleGroup))];
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row justify-between items-start pb-2">
        <div>
          <h3 className="text-lg font-semibold">{routine.name}</h3>
          {routine.day && (
            <p className="text-sm text-gray-500 capitalize">{routine.day}</p>
          )}
        </div>
        <button 
          onClick={handleToggleFavorite}
          className="text-gray-400 hover:text-yellow-500 focus:outline-none transition-colors"
          aria-label={routine.isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
        >
          <Star className={`h-5 w-5 ${routine.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
        </button>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600 mb-3">{routine.description}</p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {muscleGroups.map(group => (
            <Badge key={group} variant="default" className="capitalize">
              {group}
            </Badge>
          ))}
        </div>
        
        <div className="mt-2">
          <p className="text-sm font-medium mb-1">Ejercicios: {routine.exercises.length}</p>
          <ul className="text-sm text-gray-600 space-y-1">
            {routine.exercises.slice(0, 3).map(exercise => (
              <li key={exercise.id} className="flex justify-between">
                <span>{exercise.name}</span>
                <span>{exercise.sets} × {exercise.reps}</span>
              </li>
            ))}
            {routine.exercises.length > 3 && (
              <li className="text-sm text-blue-600">+{routine.exercises.length - 3} más</li>
            )}
          </ul>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDelete}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 mr-1" /> Borrar
        </Button>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-1" /> Editar
          </Button>
          <Button variant="primary" size="sm" onClick={handleStart}>
            <PlayCircle className="h-4 w-4 mr-1" /> Iniciar
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};