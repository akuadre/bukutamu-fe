// src/components-guestbook/FormCard.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TabSwitcher from './TabSwitcher';

// Placeholder untuk form, akan kita isi nanti
const ParentForm = () => <div className="text-center p-8 bg-slate-50 rounded-lg">Form Orang Tua Akan Tampil di Sini</div>;
const GeneralGuestForm = () => <div className="text-center p-8 bg-slate-50 rounded-lg">Form Tamu Umum Akan Tampil di Sini</div>;


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
        {/* Logika untuk menampilkan form berdasarkan tab yang aktif */}
        {activeTab === 'parent' ? <ParentForm /> : <GeneralGuestForm />}
      </div>

    </motion.div>
  );
};

export default FormCard;