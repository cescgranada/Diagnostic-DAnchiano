
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-indigo-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-white p-2 rounded-lg shadow-inner">
            <svg className="w-8 h-8 text-indigo-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Analista Model D'Anchiano</h1>
        </div>
        <div className="flex items-center gap-2 text-indigo-100 text-sm italic">
          Expert en Talent Coŀlectiu i Recursos Humans
        </div>
      </div>
    </header>
  );
};

export default Header;
