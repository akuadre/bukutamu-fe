import React from 'react';

const Footer = () => {
  return (
    <footer className="p-6 text-center text-gray-200 text-sm bg-slate-900">
        <p>&copy; {new Date().getFullYear()} School Guestbook. All rights reserved.</p>
        <p className="mt-1">Dibuat dengan ❤️ di SMKN 1 Cimahi, Indonesia.</p>
    </footer>
  );
};

export default Footer;
