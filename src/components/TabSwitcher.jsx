import React from 'react';
import { motion } from 'framer-motion';

const TabSwitcher = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex bg-gray-100 rounded-full p-1 w-fit mx-auto">
      <button
        onClick={() => setActiveTab('parent')}
        className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
          activeTab === 'parent'
            ? 'bg-white text-slate-800 shadow-md'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        👨‍👩‍👧‍👦 Orang Tua
      </button>
      <button
        onClick={() => setActiveTab('general')}
        className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 ${
          activeTab === 'general'
            ? 'bg-white text-slate-800 shadow-md'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        🏢 Tamu Umum
      </button>
    </div>
  );
};

export default TabSwitcher;