import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, LogOut } from 'lucide-react';

// Taruh gambar ikon di folder `public/gambar/`
const logoIcon = '/gambar/icon2.png';

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // TODO: Ganti data ini dengan data user yang sedang login dari context atau state management
    const user = {
        id: '007',
        name: 'Administrator',
        role: 'Super Admin',
    };
    const tahunAjaran = '2024/2025 Genap';

    // Hook untuk menutup dropdown saat klik di luar area menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        // Menambahkan event listener saat komponen dimuat
        document.addEventListener('mousedown', handleClickOutside);
        // Membersihkan event listener saat komponen di-unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        // TODO: Tambahkan logika logout di sini
        console.log("Logout clicked!");
        setIsDropdownOpen(false);
    }

    return (
        <header className="fixed top-0 left-0 right-0 h-16 bg-[#213374] shadow-md border-b border-gray-700 z-20">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Sisi Kiri - Logo/Brand */}
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center">
                            <img className="h-8 w-auto" src={logoIcon} alt="School Guestbook" />
                            <Link to="/" className="ml-3 text-lg font-semibold text-white hover:text-blue-300 transition-colors">
                                School Guestbook
                            </Link>
                        </div>
                    </div>

                    {/* Sisi Kanan - Info dan User dropdown */}
                    <div className="flex items-center space-x-6">
                        {/* Tahun Ajaran */}
                        <div className="hidden md:flex items-center text-sm text-white">
                            <span>Tahun Ajaran Aktif: 
                                <strong className="ml-1 text-red-400">{tahunAjaran}</strong>
                            </span>
                        </div>

                        {/* User dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <div className="flex items-center">
                                <span className="text-sm text-white mr-2 hidden sm:inline">Anda Login sebagai:</span>
                                <button
                                    type="button"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center text-sm font-medium text-white hover:text-blue-300 focus:outline-none transition-colors"
                                >
                                    <span>{user.name}</span>
                                    <ChevronDown size={20} className={`ml-1 text-white transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                            </div>

                            {/* Menu Dropdown */}
                            {isDropdownOpen && (
                                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="py-1">
                                        <div className="px-4 py-2 text-sm text-gray-500">
                                            <p className="font-semibold">ID User: {user.id}</p>
                                            <p>Level: {user.role}</p>
                                        </div>
                                        <div className="border-t border-gray-100"></div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                        >
                                            <LogOut size={16} className="mr-2" />
                                            Log Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;