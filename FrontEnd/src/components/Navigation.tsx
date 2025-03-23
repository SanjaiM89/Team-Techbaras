import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Dumbbell, Apple, Settings } from 'lucide-react';

function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-dark-light border-t border-dark-lighter p-4">
      <div className="flex justify-around items-center">
        <Link to="/" className={`flex flex-col items-center ${isActive('/') ? 'text-primary' : 'text-gray-400'}`}>
          <Home size={24} />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link to="/workout" className={`flex flex-col items-center ${isActive('/workout') ? 'text-primary' : 'text-gray-400'}`}>
          <Dumbbell size={24} />
          <span className="text-xs mt-1">Workout</span>
        </Link>
        <Link to="/meals" className={`flex flex-col items-center ${isActive('/meals') ? 'text-primary' : 'text-gray-400'}`}>
          <Apple size={24} />
          <span className="text-xs mt-1">Meals</span>
        </Link>
        <Link to="/settings" className={`flex flex-col items-center ${isActive('/settings') ? 'text-primary' : 'text-gray-400'}`}>
          <Settings size={24} />
          <span className="text-xs mt-1">Settings</span>
        </Link>
      </div>
    </nav>
  );
}

export default Navigation;