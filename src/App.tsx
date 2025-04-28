import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Statistics } from './pages/Statistics';
import { Layout } from './layout/Layout';
import { RoutineProvider } from './context/RoutineContext';
import { WorkoutLogProvider } from './context/WorkoutLogContext';

function App() {
  return (
    <BrowserRouter>
      <RoutineProvider>
        <WorkoutLogProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="statistics" element={<Statistics />} />
            </Route>
          </Routes>
        </WorkoutLogProvider>
      </RoutineProvider>
    </BrowserRouter>
  );
}

export default App;