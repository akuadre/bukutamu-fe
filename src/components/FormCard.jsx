// src/components-guestbook/FormCard.jsx (File yang diperbarui)
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TabSwitcher from './TabSwitcher';

// Import komponen form yang baru
import ParentForm from './ParentForm';
import GeneralGuestForm from './GeneralGuestForm';

const FormCard = () => {
  const [activeTab, setActiveTab] = useState('parent'); // 'parent' or 'general'

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="bg-white/70 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-8 w-full max-w-4xl mx-4"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Buku Tamu Digital</h2>
        <p className="text-slate-500 mt-1">SMK Negeri 1 Cimahi</p>
      </div>

      <TabSwitcher activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="mt-8 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Mengganti placeholder dengan komponen form asli */}
            {activeTab === 'parent' ? <ParentForm /> : <GeneralGuestForm />}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default FormCard;