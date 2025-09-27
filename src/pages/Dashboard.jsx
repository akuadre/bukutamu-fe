import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Users, GraduationCap, Building, Briefcase, BookOpen, BarChart2, UserCheck } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Registrasi komponen Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
);

// --- Animation Variants for Framer Motion ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};
// --- End Animation Variants ---


// Helper functions for date and chart data
const getTodayString = () => {
  const today = new Date();
  today.setHours(today.getHours() + 7); // Adjust for WIB if needed, depending on environment
  return today.toISOString().split('T')[0];
};

const generateChartData = (filterType, options) => {
    let labels = [];
    let data = [];
    const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    switch (filterType) {
        case 'harian':
            labels = ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
            data = labels.map(() => random(0, 15));
            break;
        case 'mingguan':
            labels = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
            data = labels.map(() => random(5, 25));
            break;
        case 'bulanan':
            const daysInMonth = new Date(options.year, options.month + 1, 0).getDate();
            labels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);
            data = labels.map(() => random(10, 50));
            break;
        case 'tahunan':
            labels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
            data = labels.map(() => random(100, 500));
            break;
        default:
            break;
    }
    return {
        labels,
        datasets: [{
            label: 'Jumlah Tamu', data, borderColor: 'rgba(59, 130, 246, 0.8)', backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true, tension: 0.4, pointBackgroundColor: 'rgba(59, 130, 246, 1)', pointBorderColor: '#fff', pointHoverRadius: 7,
            pointHoverBackgroundColor: '#fff', pointHoverBorderColor: 'rgba(59, 130, 246, 1)',
        }],
    };
};


// Komponen Kartu Statistik
const StatCard = ({ title, value, icon, color, link }) => (
  <div className={`bg-gradient-to-br ${color} rounded-xl shadow-lg text-white overflow-hidden transform hover:-translate-y-1 transition-transform duration-300`}>
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-1">
          <h3 className="text-3xl font-bold">{value}</h3>
          <p className="opacity-80">{title}</p>
        </div>
        <div className="text-white opacity-50">
          {icon}
        </div>
      </div>
    </div>
    <Link to={link} className="block bg-black bg-opacity-20 hover:bg-opacity-30 text-white text-center py-2.5 px-4 transition-colors">
      <span className="flex items-center justify-center text-sm">
        Lihat Detail <ArrowRight className="w-4 h-4 ml-1.5" />
      </span>
    </Link>
  </div>
);

// Komponen Skeleton untuk Kartu
const StatCardSkeleton = () => (
    <div className="bg-gray-200 rounded-xl shadow-lg h-36 animate-pulse"></div>
);

// Komponen Skeleton untuk Tabel
const SkeletonTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full w-full table-auto animate-pulse">
        <thead className="text-left text-gray-500 uppercase text-xs font-semibold border-b border-gray-200">
            <tr>
                <th className="py-3 px-4 w-2/5">Nama Tamu</th>
                <th className="py-3 px-4 w-2/5">Keperluan</th>
                <th className="py-3 px-4 w-1/5 text-right">Tanggal</th>
            </tr>
        </thead>
        <tbody>
          {[...Array(5)].map((_, index) => (
            <tr key={index} className="border-b border-gray-100 last:border-b-0">
                <td className="py-4 px-4"><div className="h-4 bg-gray-200 rounded"></div></td>
                <td className="py-4 px-4"><div className="h-4 bg-gray-200 rounded w-5/6"></div></td>
                <td className="py-4 px-4"><div className="h-4 bg-gray-200 rounded w-full ml-auto"></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
);

// Komponen Skeleton untuk Chart dan Tamu Terbaru
const MainContentSkeleton = () => (
    <>
        <div className="bg-white shadow-lg rounded-xl p-6 lg:col-span-2 animate-pulse">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-9 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="mb-4 p-3 bg-gray-100 rounded-lg flex flex-wrap items-center gap-4 text-sm">
                <div className="h-9 bg-gray-200 rounded w-32"></div>
            </div>
            <div className="h-80 bg-gray-200 rounded-lg"></div>
        </div>
        <div className="bg-white shadow-lg rounded-xl p-6">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4 animate-pulse"></div>
            <SkeletonTable />
        </div>
    </>
);


const Dashboard = () => {
    const [stats, setStats] = useState({});
    const [chartData, setChartData] = useState({});
    const [recentGuests, setRecentGuests] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // State untuk filter
    const [filterType, setFilterType] = useState('harian');
    const [selectedDate, setSelectedDate] = useState(getTodayString());
    const [selectedWeek, setSelectedWeek] = useState({ year: 2025, month: 8, week: 4 }); // September, Minggu ke-4
    const [selectedMonth, setSelectedMonth] = useState({ year: 2025, month: 8 }); // September
    const [selectedYear, setSelectedYear] = useState(2025);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setStats({ totalSiswa: 2000, totalOrangtua: 98, totalJabatan: 8, totalPegawai: 15, totalBukuTamu: 50, });
            setRecentGuests([
                { id: 1, nama: "Agus Setiawan", keperluan: "Konsultasi nilai", tanggal: "26 Sep" },
                { id: 2, nama: "Bambang Pamungkas", keperluan: "Koordinasi Acara", tanggal: "25 Sep" },
                { id: 3, nama: "Rina Nose", keperluan: "Pengambilan Rapor", tanggal: "24 Sep" },
                { id: 4, nama: "Sule", keperluan: "Rapat Komite", tanggal: "23 Sep" },
                { id: 5, nama: "Anya Geraldine", keperluan: "Studi Banding", tanggal: "22 Sep" },
            ]);
            const initialOptions = { 'harian': { date: selectedDate } };
            setChartData(generateChartData('harian', initialOptions.harian));
            setLoading(false);
        }, 1500);
    }, []);

    useEffect(() => {
        if (!loading) {
            const options = {
                'harian': { date: selectedDate }, 'mingguan': selectedWeek,
                'bulanan': selectedMonth, 'tahunan': { year: selectedYear }
            };
            setChartData(generateChartData(filterType, options[filterType]));
        }
    }, [filterType, selectedDate, selectedWeek, selectedMonth, selectedYear, loading]);

    const chartOptions = {
        responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } },
        scales: { x: { grid: { display: false } }, y: { beginAtZero: true, ticks: { stepSize: 5 } } },
    };

    const welcomeMessage = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Selamat Pagi, Admin!";
        if (hour < 18) return "Selamat Siang, Admin!";
        return "Selamat Malam, Admin!";
    };

    const getChartTitle = () => {
        switch(filterType) {
            case 'harian': return `Statistik Kunjungan - ${new Date(selectedDate + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`;
            case 'mingguan': return `Statistik Kunjungan - Minggu ke-${selectedWeek.week}, ${new Date(selectedWeek.year, selectedWeek.month).toLocaleString('id-ID', { month: 'long', year: 'numeric' })}`;
            case 'bulanan': return `Statistik Kunjungan - ${new Date(selectedMonth.year, selectedMonth.month).toLocaleString('id-ID', { month: 'long', year: 'numeric' })}`;
            case 'tahunan': return `Statistik Kunjungan - Tahun ${selectedYear}`;
            default: return "Statistik Kunjungan Tamu";
        }
    }

  return (
    <div className="space-y-8">
        <div>
            <motion.h1 className="text-3xl font-bold text-gray-800" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                {welcomeMessage()}
            </motion.h1>
            <motion.p className="text-gray-500 mt-1" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                Berikut adalah ringkasan data dari sistem Anda.
            </motion.p>
        </div>

      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6" variants={containerVariants} initial="hidden" animate="visible">
        {loading ? Array.from({ length: 5 }).map((_, i) => <StatCardSkeleton key={i} />) : (
            <>
                <motion.div variants={itemVariants}><StatCard title="Total Siswa" value={stats.totalSiswa} icon={<GraduationCap size={48} />} color="from-blue-500 to-blue-600" link="/siswa" /></motion.div>
                <motion.div variants={itemVariants}><StatCard title="Total Orang Tua" value={stats.totalOrangtua} icon={<Users size={48} />} color="from-green-500 to-green-600" link="/orangtua" /></motion.div>
                <motion.div variants={itemVariants}><StatCard title="Total Jabatan" value={stats.totalJabatan} icon={<Building size={48} />} color="from-indigo-500 to-indigo-600" link="/jabatan" /></motion.div>
                <motion.div variants={itemVariants}><StatCard title="Total Pegawai" value={stats.totalPegawai} icon={<Briefcase size={48} />} color="from-red-500 to-red-600" link="/pegawai" /></motion.div>
                <motion.div variants={itemVariants}><StatCard title="Total Tamu" value={stats.totalBukuTamu} icon={<BookOpen size={48} />} color="from-gray-700 to-gray-800" link="/bukutamu" /></motion.div>
            </>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
        {loading ? <MainContentSkeleton /> : (
            <motion.div className="contents" variants={containerVariants} initial="hidden" animate="visible">
                <motion.div variants={itemVariants} className="bg-white shadow-lg rounded-xl p-6 lg:col-span-2">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center">
                            <BarChart2 className="w-6 h-6 mr-2 text-blue-500" />
                            {getChartTitle()}
                        </h2>
                        <div className="flex items-center gap-2">
                            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                                <option value="harian">Harian</option> <option value="mingguan">Mingguan</option>
                                <option value="bulanan">Bulanan</option> <option value="tahunan">Tahunan</option>
                            </select>
                        </div>
                    </div>
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg flex flex-wrap items-center gap-4 text-sm">
                        {filterType === 'harian' && <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} max={getTodayString()} className="border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"/>}
                        {filterType === 'mingguan' && (<>
                            <select value={selectedWeek.month} onChange={e => setSelectedWeek(s => ({...s, month: parseInt(e.target.value)}))} className="border border-gray-300 rounded-md px-3 py-1.5">
                                {Array.from({length: 12}).map((_, i) => <option key={i} value={i}>{new Date(0, i).toLocaleString('id-ID', {month: 'long'})}</option>)}
                            </select>
                            <select value={selectedWeek.year} onChange={e => setSelectedWeek(s => ({...s, year: parseInt(e.target.value)}))} className="border border-gray-300 rounded-md px-3 py-1.5">
                                {[2023, 2024, 2025].map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                            <select value={selectedWeek.week} onChange={e => setSelectedWeek(s => ({...s, week: parseInt(e.target.value)}))} className="border border-gray-300 rounded-md px-3 py-1.5">
                                {[1, 2, 3, 4].map(w => <option key={w} value={w}>Minggu ke-{w}</option>)}
                            </select>
                        </>)}
                        {filterType === 'bulanan' && (<>
                            <select value={selectedMonth.month} onChange={e => setSelectedMonth(s => ({...s, month: parseInt(e.target.value)}))} className="border border-gray-300 rounded-md px-3 py-1.5">
                                {Array.from({length: 12}).map((_, i) => <option key={i} value={i}>{new Date(0, i).toLocaleString('id-ID', {month: 'long'})}</option>)}
                            </select>
                            <select value={selectedMonth.year} onChange={e => setSelectedMonth(s => ({...s, year: parseInt(e.target.value)}))} className="border border-gray-300 rounded-md px-3 py-1.5">
                                {[2023, 2024, 2025].map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </>)}
                        {filterType === 'tahunan' && (
                            <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} className="border border-gray-300 rounded-md px-3 py-1.5">
                                {[2023, 2024, 2025].map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        )}
                    </div>
                    <div className="h-80">
                        {loading || !chartData.labels ? <div className="w-full h-full bg-gray-200 rounded-lg animate-pulse"></div> : <Line data={chartData} options={chartOptions} />}
                    </div>
                </motion.div>
                <motion.div variants={itemVariants} className="bg-white shadow-lg rounded-xl p-6">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center mb-4">
                        <UserCheck className="w-6 h-6 mr-2 text-green-500" /> Tamu Terbaru
                    </h2>
                    <div>
                        <table className="w-full text-sm">
                            <thead className="text-left text-gray-500 uppercase text-xs font-semibold border-b-2 border-gray-200">
                                <tr>
                                    <th className="py-2 px-3 w-2/5">Nama Tamu</th>
                                    <th className="py-2 px-3 w-2/5">Keperluan</th>
                                    <th className="py-2 px-3 w-1/5 text-right">Tanggal</th>
                                </tr>
                            </thead>
                            <motion.tbody variants={containerVariants} initial="hidden" animate="visible">
                                {recentGuests.map(guest => (
                                    <motion.tr key={guest.id} variants={itemVariants} className="border-b border-gray-100 last:border-b-0">
                                        <td className="py-3 px-3 font-medium text-gray-800">{guest.nama}</td>
                                        <td className="py-3 px-3 text-gray-600">{guest.keperluan}</td>
                                        <td className="py-3 px-3 text-gray-500 text-right">{guest.tanggal}</td>
                                    </motion.tr>
                                ))}
                            </motion.tbody>
                        </table>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

