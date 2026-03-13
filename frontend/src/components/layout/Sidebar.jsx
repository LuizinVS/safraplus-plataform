import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  GlobeEuropeAfricaIcon,
  SparklesIcon,
  BellIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Propriedades', href: '/properties', icon: GlobeEuropeAfricaIcon },
  { name: 'Recomendações', href: '/recommendations', icon: SparklesIcon },
  { name: 'Notificações', href: '/notifications', icon: BellIcon },
];

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  const location = useLocation();

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-primary text-neutral-100 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
    >
      <div className="flex items-center justify-center h-16 bg-primary-dark">
        <h1 className="text-2xl font-bold">AgroSystem</h1>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-2">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            onClick={toggleSidebar}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md
              ${location.pathname.startsWith(item.href)
                ? 'bg-primary-dark text-white'
                : 'text-neutral-200 hover:bg-primary-light hover:text-white'
              }`}
          >
            <item.icon className="w-6 h-6 mr-3" aria-hidden="true" />
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-primary-dark">
        <button
          onClick={logout}
          className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md text-neutral-200 hover:bg-red-600 hover:text-white"
        >
          <ArrowLeftOnRectangleIcon className="w-6 h-6 mr-3" aria-hidden="true" />
          Sair
        </button>
      </div>
    </div>
  );
};

export default Sidebar;