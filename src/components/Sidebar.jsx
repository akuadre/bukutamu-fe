import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';

// Import icons from lucide-react (lebih modern untuk React)
import { 
    LayoutDashboard, 
    GraduationCap, 
    Users, 
    BookOpen, 
    ChevronDown,
    Building,
    User,
    ClipboardList
} from 'lucide-react';

// Taruh gambar ikon di folder `public/gambar/`
const userIcon = '/gambar/icon2.png';

const Sidebar = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    // State untuk dropdown, nilai awal ini untuk render pertama kali
    const [siswaOpen, setSiswaOpen] = useState(currentPath.startsWith('/siswa') || currentPath.startsWith('/orangtua'));
    const [pegawaiOpen, setPegawaiOpen] = useState(currentPath.startsWith('/pegawai') || currentPath.startsWith('/jabatan'));
    const [bukuTamuOpen, setBukuTamuOpen] = useState(currentPath.startsWith('/bukutamu'));

    // --- TAMBAHAN BARU ---
    // useEffect ini akan mengawasi perubahan 'currentPath' (URL)
    useEffect(() => {
        if (currentPath.startsWith('/siswa') || currentPath.startsWith('/orangtua')) {
            setSiswaOpen(true);
        }
        if (currentPath.startsWith('/pegawai') || currentPath.startsWith('/jabatan')) {
            setPegawaiOpen(true);
        }
        if (currentPath.startsWith('/bukutamu')) {
            setBukuTamuOpen(true);
        }
    }, [currentPath]); // Dependency: Jalankan efek ini setiap kali currentPath berubah

    // Fungsi untuk styling NavLink yang aktif
    const getNavLinkClass = ({ isActive }) =>
        `flex items-center justify-between p-2 rounded-lg transition-colors text-sm ${
        isActive
            ? 'bg-blue-100 text-blue-700 font-semibold'
            : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
        }`;

    return (
        <aside className="fixed top-16 left-0 w-72 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 shadow-sm overflow-y-auto">
            {/* User Panel */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                    <img src={userIcon} alt="User" className="h-10 w-10 rounded-full" />
                    <Link to="/about" className="font-medium text-gray-700 hover:text-blue-600 transition-colors">
                        Tentang Aplikasi
                    </Link>
                </div>
            </div>

            {/* Navigation Menu */}
            <nav className="p-4 space-y-2">
                {/* Dashboard */}
                <NavLink to="/" className={getNavLinkClass}>
                    <div className="flex items-center">
                        <LayoutDashboard size={20} className="text-gray-500" />
                        <span className="ml-3">Dashboard</span>
                    </div>
                </NavLink>

                {/* Siswa Menu */}
                <div className="space-y-2">
                    <button onClick={() => setSiswaOpen(!siswaOpen)} className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-blue-600 transition-colors">
                        <div className="flex items-center">
                            <GraduationCap size={20} className="text-gray-500" />
                            <span className="ml-3">Siswa</span>
                        </div>
                        <ChevronDown size={18} className={`transition-transform text-gray-500 ${siswaOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {siswaOpen && (
                        <div className="pl-8 space-y-2">
                            <NavLink to="/siswa" className={getNavLinkClass}>
                                <div className="flex items-center gap-2">
                                    <User size={18} className="text-gray-500" />
                                    <span>Data Siswa</span>
                                </div>
                                <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">2000</span> {/* TODO: Ganti dengan data dari API */}
                            </NavLink>
                            <NavLink to="/orangtua" className={getNavLinkClass}>
                                <div className="flex items-center gap-2">
                                    <Users size={18} className="text-gray-500" />
                                    <span>Data Orang Tua</span>
                                </div>
                                <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">98</span> {/* TODO: Ganti dengan data dari API */}
                            </NavLink>
                        </div>
                    )}
                </div>

                {/* Pegawai Menu */}
                <div className="space-y-2">
                    <button onClick={() => setPegawaiOpen(!pegawaiOpen)} className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-blue-600 transition-colors">
                        <div className="flex items-center">
                            <Building size={20} className="text-gray-500" />
                            <span className="ml-3">Pegawai</span>
                        </div>
                        <ChevronDown size={18} className={`transition-transform text-gray-500 ${pegawaiOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {pegawaiOpen && (
                        <div className="pl-8 space-y-2">
                            <NavLink to="/jabatan" className={getNavLinkClass}>
                                <div className="flex items-center gap-2">
                                    <ClipboardList size={18} className="text-gray-500" />
                                    <span>Data Jabatan</span>
                                </div>
                                <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">8</span> {/* TODO: Ganti dengan data dari API */}
                            </NavLink>
                            <NavLink to="/pegawai" className={getNavLinkClass}>
                                <div className="flex items-center gap-2">
                                    <Users size={18} className="text-gray-500" />
                                    <span>Data Pegawai</span>
                                </div>
                                <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">15</span> {/* TODO: Ganti dengan data dari API */}
                            </NavLink>
                        </div>
                    )}
                </div>

                {/* Buku Tamu Menu */}
                <div className="space-y-2">
                    <button onClick={() => setBukuTamuOpen(!bukuTamuOpen)} className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-blue-600 transition-colors">
                        <div className="flex items-center">
                            <BookOpen size={20} className="text-gray-500" />
                            <span className="ml-3">Buku Tamu</span>
                        </div>
                        <ChevronDown size={18} className={`transition-transform text-gray-500 ${bukuTamuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {bukuTamuOpen && (
                        <div className="pl-8 space-y-2">
                            <NavLink to="/bukutamu" className={getNavLinkClass}>
                                <div className="flex items-center gap-2">
                                    <BookOpen size={18} className="text-gray-500" />
                                    <span>Data Buku Tamu</span>
                                </div>
                                <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">50</span> {/* TODO: Ganti dengan data dari API */}
                            </NavLink>
                        </div>
                    )}
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;