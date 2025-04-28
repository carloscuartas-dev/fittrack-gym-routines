import React from 'react';
import { useWorkoutLogs } from '../context/WorkoutLogContext';
import { useRoutines } from '../context/RoutineContext';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { BarChart, Clock, Calendar, TrendingUp, Activity, Dumbbell } from 'lucide-react';

export const Statistics: React.FC = () => {
  const { logs } = useWorkoutLogs();
  const { routines, getRoutineById } = useRoutines();
  
  // Calculate stats
  const totalWorkouts = logs.length;
  const totalMinutes = logs.reduce((total, log) => total + log.duration, 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;
  
  // Calculate workouts per routine
  const workoutsByRoutine = logs.reduce((acc, log) => {
    const routineId = log.routineId;
    if (!acc[routineId]) acc[routineId] = 0;
    acc[routineId]++;
    return acc;
  }, {} as Record<string, number>);
  
  // Sort routines by workout count (descending)
  const routineStats = Object.entries(workoutsByRoutine)
    .map(([routineId, count]) => ({
      routine: getRoutineById(routineId),
      count,
    }))
    .filter(stat => stat.routine) // Filter out undefined routines
    .sort((a, b) => b.count - a.count);

  // Calculate workouts by day of week
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const workoutsByDay = logs.reduce((acc, log) => {
    const date = new Date(log.date);
    const day = dayNames[date.getDay()];
    if (!acc[day]) acc[day] = 0;
    acc[day]++;
    return acc;
  }, {} as Record<string, number>);
  
  // Calculate most frequent exercises
  const exerciseFrequency = logs.reduce((acc, log) => {
    log.completedExercises.forEach(exercise => {
      const routine = getRoutineById(log.routineId);
      if (!routine) return;
      
      const exerciseDetails = routine.exercises.find(ex => ex.id === exercise.exerciseId);
      if (!exerciseDetails) return;
      
      if (!acc[exerciseDetails.name]) acc[exerciseDetails.name] = 0;
      acc[exerciseDetails.name]++;
    });
    return acc;
  }, {} as Record<string, number>);
  
  // Sort exercises by frequency
  const topExercises = Object.entries(exerciseFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  // Recent activities
  const recentActivities = [...logs]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
    .map(log => {
      const routine = getRoutineById(log.routineId);
      return {
        id: log.id,
        routineName: routine?.name || 'Unknown Routine',
        date: new Date(log.date),
        duration: log.duration,
        exercisesCount: log.completedExercises.length
      };
    });
  
  // Only show statistics if there are logs
  if (totalWorkouts === 0) {
    return (
      <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Estadísticas de Entreno</h1>
            <p className="text-gray-600">Sigue tu progreso a través del tiempo</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex justify-center mb-4">
              <BarChart className="h-16 w-16 text-blue-300" />
            </div>
            <h2 className="text-xl font-bold mb-2">Aún no hay datos</h2>
            <p className="text-gray-500 mb-4">
              Complete algún entrenamiento para ver sus estadísticas.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Estadísticas de Entreno</h1>
          <p className="text-gray-600">Sigue tu progreso a través del tiempo</p>
        </div>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-6 flex items-center">
              <div className="bg-blue-100 p-4 rounded-full mr-4">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Entrenamientos Totales</p>
                <p className="text-2xl font-bold">{totalWorkouts}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center">
              <div className="bg-green-100 p-4 rounded-full mr-4">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tiempo Total</p>
                <p className="text-2xl font-bold">
                  {totalHours}h {remainingMinutes}m
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex items-center">
              <div className="bg-orange-100 p-4 rounded-full mr-4">
                <Dumbbell className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Rutinas Activas</p>
                <p className="text-2xl font-bold">{routineStats.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Most Used Routines */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-6">
              <h2 className="text-xl font-bold">Rutinas Populares</h2>
              <BarChart className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {routineStats.length > 0 ? (
                <div className="space-y-4">
                  {routineStats.slice(0, 5).map(({ routine, count }) => (
                    <div key={routine?.id} className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{routine?.name}</p>
                        <p className="text-sm text-gray-500">
                          {routine?.exercises.length} ejercicios
                        </p>
                      </div>
                      <div className="bg-blue-100 text-blue-800 font-medium rounded-full px-3 py-1 text-sm">
                        {count} {count === 1 ? 'workout' : 'workouts'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No hay datos de rutinas disponibles</p>
              )}
            </CardContent>
          </Card>
          
          {/* Workouts by Day */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-6">
              <h2 className="text-xl font-bold">Frequencia de Entreno</h2>
              <Calendar className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {Object.keys(workoutsByDay).length > 0 ? (
                <div className="space-y-3">
                  {dayNames.map(day => (
                    <div key={day} className="flex items-center">
                      <div className="w-20 text-sm">{day}</div>
                      <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-5 bg-blue-500 rounded-full"
                          style={{ 
                            width: `${(workoutsByDay[day] || 0) / Math.max(...Object.values(workoutsByDay)) * 100}%` 
                          }}
                        />
                      </div>
                      <div className="w-8 text-right text-sm font-medium">
                        {workoutsByDay[day] || 0}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No hay datos de frecuencias disponible</p>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Exercises */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-6">
              <h2 className="text-xl font-bold">Ejercicios Top</h2>
              <TrendingUp className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {topExercises.length > 0 ? (
                <div className="space-y-4">
                  {topExercises.map(([name, count]) => (
                    <div key={name} className="flex justify-between items-center">
                      <p className="font-medium">{name}</p>
                      <div className="bg-green-100 text-green-800 font-medium rounded-full px-3 py-1 text-sm">
                        {count} {count === 1 ? 'time' : 'times'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No hay datos de ejercicios disponibles</p>
              )}
            </CardContent>
          </Card>
          
          {/* Recent Activities */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-6">
              <h2 className="text-xl font-bold">Actividades Recientes</h2>
              <Activity className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent className="px-6 pb-6">
              {recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {recentActivities.map(activity => (
                    <div key={activity.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <p className="font-medium">{activity.routineName}</p>
                        <p className="text-xs text-gray-500">
                          {activity.date.toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {activity.duration} min • {activity.exercisesCount} ejercicios
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No hay actividades recientes</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};