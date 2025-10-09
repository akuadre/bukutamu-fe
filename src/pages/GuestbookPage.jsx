// src/pages/GuestbookPage.jsx
import React from 'react';
import Header from '../components/GuestbookHeader';
import Footer from '../components/GuestbookFooter';
import FormCard from '../components/FormCard';

const GuestbookPage = () => {
  return (
    <div className="bg-gradient-to-br from-gray-100 to-blue-100 min-h-screen text-slate-800 flex flex-col antialiased font-sans">
      <Header />
      <main className="flex-grow flex items-center justify-center pt-28 pb-12">
        {/* Kartu utama yang menampung form */}
        <FormCard />
      </main>
      <Footer />
    </div>
  );
};

export default GuestbookPage;