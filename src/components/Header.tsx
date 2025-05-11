'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

const Header = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const navigationItems = [
    {
      title: 'Diagnóstico Rápido',
      icon: '🔍',
      path: '/',
    },
    {
      title: 'Asistente Inteligente',
      icon: '🤖',
      path: '/treatments',
    },
    {
      title: 'Diagnósticos',
      icon: '📝',
      path: '/diagnostics',
    },
    {
      title: 'Feedback',
      icon: '💬',
      path: '/comments',
    },
    {
      title: 'Acerca del Sistema',
      icon: 'ℹ️',
      path: '/about',
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="flex justify-center">
        <div className="flex w-full max-w-5xl items-center justify-between px-4 py-4">
          <h1 className="text-2xl font-bold text-red-500">MediTrack</h1>

          {/* Botón menú móvil */}
          <button
            className="md:hidden text-gray-700 focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Navegación para escritorio */}
          <div className="hidden md:flex gap-4">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm sm:text-base">{item.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menú desplegable para móviles */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t shadow-inner">
          {navigationItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                setMenuOpen(false);
                router.push(item.path);
              }}
              className="w-full flex items-center gap-2 px-4 py-3 border-b text-gray-700 hover:bg-gray-100"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-base">{item.title}</span>
            </button>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
