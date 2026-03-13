import React from 'react';
import { BellIcon, Bars3Icon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNotificationStore } from '../../contexts/NotificationContext';
import { Link } from 'react-router-dom';

const Topbar = ({ toggleSidebar }) => {
    const { user, logout } = useAuth();
    const { unreadCount } = useNotificationStore();

    return (
        // --- CORREÇÃO AQUI: Removido o 'md:ml-64' ---
        <header className="sticky top-0 z-40 flex items-center justify-between h-16 px-4 bg-white shadow-sm">
            <div className="flex items-center">
                <button
                    type="button"
                    className="p-2 mr-2 text-gray-500 rounded-md md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                    onClick={toggleSidebar}
                >
                    <span className="sr-only">Open sidebar</span>
                    <Bars3Icon className="w-6 h-6" aria-hidden="true" />
                </button>
                <div className="relative hidden md:block">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                        id="search"
                        name="search"
                        className="block w-full py-2 pl-10 pr-3 leading-5 text-gray-900 placeholder-gray-500 bg-gray-100 border border-transparent rounded-md focus:outline-none focus:bg-white focus:border-gray-300 focus:ring-white focus:text-gray-900 sm:text-sm"
                        placeholder="Buscar..."
                        type="search"
                    />
                </div>
            </div>
            <div className="flex items-center space-x-4">
                <Link to="/notifications" className="relative p-1 text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-primary">
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="w-6 h-6" aria-hidden="true" />
                    {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
              {unreadCount}
            </span>
                    )}
                </Link>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                    <div>
                        <Menu.Button className="flex items-center max-w-xs text-sm bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 lg:rounded-md lg:p-2 lg:hover:bg-gray-50">
                            <span className="sr-only">Open user menu</span>
                            <div className="flex items-center justify-center w-8 h-8 text-white rounded-full bg-primary-dark">
                                {user?.email?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <span className="hidden ml-3 text-sm font-medium text-gray-700 lg:block">
                <span className="sr-only">Open user menu for </span>
                                {user?.name || user?.email}
              </span>
                        </Menu.Button>
                    </div>
                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                    >
                        <Menu.Items className="absolute right-0 z-10 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <Menu.Item>
                                {({ focus }) => (
                                    <a
                                        href="#"
                                        className={`block px-4 py-2 text-sm text-gray-700 ${focus ? 'bg-gray-100' : ''}`}
                                    >
                                        Seu Perfil
                                    </a>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ focus }) => (
                                    <button
                                        onClick={logout}
                                        className={`block w-full text-left px-4 py-2 text-sm text-gray-700 ${focus ? 'bg-gray-100' : ''}`}
                                    >
                                        Sair
                                    </button>
                                )}
                            </Menu.Item>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>
        </header>
    );
};

export default Topbar;