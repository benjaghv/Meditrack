"use client";

import { useRouter } from 'next/navigation';

const Navigation = () => {
  const router = useRouter();

  const navigationItems = [
    {
      title: 'Diagnóstico Rápido',
      icon: '🔍',
      path: '/',
    },
    {
      title: 'Tratamientos',
      icon: '💊',
      path: '/treatments',
    },
    {
      title: 'Feedback',
      icon: '💬',
      path: '/comments',
    },
  ];

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-8 w-full">
      {navigationItems.map((item) => (
        <button
          key={item.path}
          onClick={() => router.push(item.path)}
          className="flex items-center gap-2 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <span className="text-xl">{item.icon}</span>
          <span className="text-sm sm:text-base">{item.title}</span>
        </button>
      ))}
    </div>
  );
};

export default Navigation;
