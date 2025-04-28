import React from 'react';
import { Dumbbell, LayoutDashboard, BarChart } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const Navbar: React.FC = () => {
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Dumbbell className="h-8 w-8 mr-2" />
            <span className="font-bold text-xl">Arianne</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            <NavLink
              to="/"
              className={({ isActive }) => 
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-blue-700 text-white' 
                    : 'text-blue-100 hover:bg-blue-500'
                }`
              }
            >
              <div className="flex items-center">
                <LayoutDashboard className="h-4 w-4 mr-1" />
                Panel
              </div>
            </NavLink>
            
            <NavLink
              to="/statistics"
              className={({ isActive }) => 
                `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-blue-700 text-white' 
                    : 'text-blue-100 hover:bg-blue-500'
                }`
              }
            >
              <div className="flex items-center">
                <BarChart className="h-4 w-4 mr-1" />
                Estadísticas
              </div>
            </NavLink>
          </div>
          
          <div className="md:hidden flex items-center">
            <div className="flex space-x-1">
              <NavLink
                to="/"
                className={({ isActive }) => 
                  `p-2 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-blue-700 text-white' 
                      : 'text-blue-100 hover:bg-blue-500'
                  }`
                }
              >
                <LayoutDashboard className="h-5 w-5" />
              </NavLink>
              
              <NavLink
                to="/statistics"
                className={({ isActive }) => 
                  `p-2 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-blue-700 text-white' 
                      : 'text-blue-100 hover:bg-blue-500'
                  }`
                }
              >
                <BarChart className="h-5 w-5" />
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};