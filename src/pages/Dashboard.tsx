import React, { useState } from 'react';
import { useRoutines } from '../context/RoutineContext';
import { useWorkoutLogs } from '../context/WorkoutLogContext';
import { RoutineCard } from '../components/RoutineCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { RoutineForm } from '../components/RoutineForm';
import { WorkoutView } from '../components/WorkoutView';
import { Calendar, Plus, BarChart, History } from 'lucide-react';
import { muscleGroups } from '../data/initialData';
import { MuscleGroup } from '../types';

enum View {
  ROUTINES,
  CREATE_ROUTINE,
  EDIT_ROUTINE,
  WORKOUT,
}

export const Dashboard: React.FC = () => {
  const { routines, getRoutineById } = useRoutines();
  const { addWorkoutLog, getRecentLogs } = useWorkoutLogs();
  const [currentView, setCurrentView] = useState<View>(View.ROUTINES);
  const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(null);
  const [filterMuscleGroup, setFilterMuscleGroup] = useState<MuscleGroup | ''>('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  
  const selectedRoutine = selectedRoutineId ? getRoutineById(selectedRoutineId) : undefined;
  const recentLogs = getRecentLogs(5);
  
  const handleEditRoutine = (id: string) => {
    setSelectedRoutineId(id);
    setCurrentView(View.EDIT_ROUTINE);
  };
  
  const handleStartRoutine = (id: string) => {
    setSelectedRoutineId(id);
    setCurrentView(View.WORKOUT);
  };
  
  const handleWorkoutComplete = (completedExercises, duration) => {
    if (selectedRoutineId) {
      addWorkoutLog(selectedRoutineId, completedExercises, duration);
      setCurrentView(View.ROUTINES);
      setSelectedRoutineId(null);
    }
  };
  
  const filteredRoutines = routines
    .filter(routine => !filterMuscleGroup || 
      routine.exercises.some(ex => ex.muscleGroup === filterMuscleGroup))
    .filter(routine => !showFavoritesOnly || routine.isFavorite);
  
  // Group routines by day
  const routinesByDay = filteredRoutines.reduce((acc, routine) => {
    const day = routine.day || 'vacío';
    if (!acc[day]) acc[day] = [];
    acc[day].push(routine);
    return acc;
  }, {} as Record<string, typeof routines>);
  
  // Get days in order (with unscheduled at the end)
  const days = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo', 'vacío'];
  
  const renderContent = () => {
    switch (currentView) {
      case View.CREATE_ROUTINE:
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Crear Nueva Rutina</h2>
            <RoutineForm 
              onComplete={() => setCurrentView(View.ROUTINES)} 
            />
          </div>
        );
        
      case View.EDIT_ROUTINE:
        return selectedRoutine ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Editar Rutina</h2>
            <RoutineForm 
              routine={selectedRoutine} 
              onComplete={() => setCurrentView(View.ROUTINES)} 
            />
          </div>
        ) : null;
        
      case View.WORKOUT:
        return selectedRoutine ? (
          <WorkoutView 
            routine={selectedRoutine}
            onComplete={handleWorkoutComplete}
            onCancel={() => setCurrentView(View.ROUTINES)}
          />
        ) : null;
        
      case View.ROUTINES:
      default:
        return (
          <>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
              <div>
                <h1 className="text-2xl font-bold">Mis Rutinas</h1>
                <p className="text-gray-600">
                  {filteredRoutines.length} rutina{filteredRoutines.length !== 1 ? 's' : ''} disponible{filteredRoutines.length !== 1 ? 's' : ''}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex items-center">
                  <select
                    value={filterMuscleGroup}
                    onChange={(e) => setFilterMuscleGroup(e.target.value as MuscleGroup)}
                    className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm mr-2"
                  >
                    <option value="">Todos los grupos musculares</option>
                    {muscleGroups.map(group => (
                      <option key={group} value={group} className="capitalize">
                        {group}
                      </option>
                    ))}
                  </select>
                  
                  <label className="inline-flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={showFavoritesOnly}
                      onChange={(e) => setShowFavoritesOnly(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span className="ml-2">Sólo favoritos</span>
                  </label>
                </div>
                
                <Button 
                  onClick={() => setCurrentView(View.CREATE_ROUTINE)}
                  className="whitespace-nowrap"
                >
                  <Plus className="h-4 w-4 mr-1" /> Nueva Rutina
                </Button>
              </div>
            </div>
            
            {recentLogs.length > 0 && (
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                <h2 className="text-lg font-semibold mb-2 flex items-center">
                  <History className="h-5 w-5 mr-2 text-blue-500" />
                  Entrenamientos Recientes
                </h2>
                <div className="overflow-x-auto">
                  <div className="flex gap-3">
                    {recentLogs.map(log => {
                      const routine = getRoutineById(log.routineId);
                      const date = new Date(log.date);
                      return (
                        <div key={log.id} className="flex-shrink-0 bg-white p-3 rounded-md border border-gray-200 w-56">
                          <p className="font-medium">{routine?.name || 'Rutina Desconocida'}</p>
                          <p className="text-sm text-gray-500">
                            {date.toLocaleDateString()} • {log.duration} min
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {log.completedExercises.length} ejercicios completados
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
            
            {Object.keys(routinesByDay).length > 0 ? (
              days.map(day => {
                if (!routinesByDay[day]) return null;
                return (
                  <div key={day} className="mb-8">
                    <div className="flex items-center mb-4">
                      <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                      <h2 className="text-xl font-bold capitalize">
                        {day === 'vacío' ? 'Rutinas Vacías' : `Rutinas del ${day}`}
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {routinesByDay[day].map(routine => (
                        <RoutineCard
                          key={routine.id}
                          routine={routine}
                          onEdit={handleEditRoutine}
                          onStart={handleStartRoutine}
                        />
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 text-center">
                <p className="text-gray-500 mb-4">No se han encontrado rutinas con los filtros seleccionados.</p>
                <Button onClick={() => setCurrentView(View.CREATE_ROUTINE)}>
                  <Plus className="h-4 w-4 mr-1" /> Crear tu primera rutina
                </Button>
              </div>
            )}
          </>
        );
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {renderContent()}
      </div>
    </div>
  );
};