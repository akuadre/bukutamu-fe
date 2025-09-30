import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, Settings, CalendarDays, Clock } from 'lucide-react';

const logoIcon = '/gambar/icon2.png';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // 1. Ubah state awal menjadi `null` untuk mendeteksi state "loading" awal
  const [currentTime, setCurrentTime] = useState(null); 
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const user = {
    name: 'Tata Usaha',
    role: 'Admin SMKN 1 Cimahi',
    avatar: null,
  };
  const tahunAjaran = '2024/2025 Genap';

  useEffect(() => {
    // 2. Buat fungsi untuk update jam
    const updateClock = () => {
      const now = new Date();
      // Menggunakan `replace` agar formatnya selalu "HH.MM" (lebih stabil untuk animasi)
      setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':'));
    };

    // 3. Panggil fungsi sekali di awal untuk menghilangkan jeda 1 detik
    updateClock(); 
    
    // 4. Jalankan interval untuk update selanjutnya
    const timer = setInterval(updateClock, 1000); 
    
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const names = name.split(' ');
    if (names.length === 1) return names[0][0].toUpperCase();
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  return (
    <motion.header 
      className="fixed top-0 left-72 right-0 h-20 bg-white/80 backdrop-blur-lg border-b border-gray-200/80 z-30"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="flex justify-between items-center h-full px-8">
        <div className="flex items-center gap-6">
            {/* --- BAGIAN JAM YANG DIPERBAIKI --- */}
            <div className='flex items-center gap-2 text-gray-600'>
                <Clock size={20} />
                <div className="font-medium text-sm w-12 h-5 flex items-center overflow-hidden">
                    {currentTime ? (
                        // Menggunakan AnimatePresence untuk animasi keluar-masuk saat digit berubah
                        <AnimatePresence>
                            {currentTime.split('').map((char, index) => (
                                <motion.span
                                    key={`${char}-${index}`} // Key unik agar Framer Motion mendeteksi perubahan
                                    initial={{ y: '100%' }}
                                    animate={{ y: '0%' }}
                                    exit={{ y: '-100%' }}
                                    transition={{ ease: 'backIn', duration: 0.3 }}
                                    className={char === ':' ? 'motion-colon' : ''} // Class khusus untuk colon
                                >
                                    {/* Gunakan non-breaking space agar layout tidak rusak */}
                                    {char === ' ' ? '\u00A0' : char}
                                </motion.span>
                            ))}
                        </AnimatePresence>
                    ) : (
                        // Skeleton loader yang hanya tampil sesaat sebelum jam pertama muncul
                        <span className="w-10 h-4 bg-gray-300 rounded animate-pulse"></span>
                    )}
                </div>
            </div>
            {/* --- END BAGIAN JAM --- */}

             <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                <CalendarDays size={20} />
                <span className='font-medium'>
                    TA: <strong className="text-sky-600">{tahunAjaran}</strong>
                </span>
            </div>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200/60 transition-colors duration-200 focus:outline-none"
          >
            <div className="text-right hidden sm:block">
              <p className="font-semibold text-sm text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold text-lg">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <span>{getInitials(user.name)}</span>
              )}
            </div>
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                className="origin-top-right absolute right-0 mt-3 w-64 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <div className="py-2">
                    <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-900">Signed in as</p>
                        <p className="text-sm text-gray-700 truncate">{user.name}</p>
                    </div>
                    <div className="py-1">
                        <Link to="/" className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors pointer-events-none opacity-50">
                            <User size={16} className="mr-3 text-gray-500" /> Profil Saya
                        </Link>
                        <Link to="/" className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors pointer-events-none opacity-50">
                            <Settings size={16} className="mr-3 text-gray-500" /> Pengaturan
                        </Link>
                    </div>
                    <div className="border-t border-gray-200 py-1">
                        <button
                            onClick={handleLogout}
                            className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <LogOut size={16} className="mr-3" /> Keluar
                        </button>
                    </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;