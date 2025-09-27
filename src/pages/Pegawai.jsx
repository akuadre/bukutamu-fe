import React, { useState, useEffect, useMemo } from "react";
import { Search, Edit, Trash2, PlusCircle } from "lucide-react";
import { motion } from 'framer-motion';

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
// --- End Animation Variants ---

// --- DUMMY DATA ---
// Nanti, data ini akan diambil dari API Laravel
const dummyPegawai = [
    { id: 1, nama_pegawai: "Endang S.", jenis_kelamin: "P", jabatan: { nama_jabatan: "Kepala Sekolah" }, agama: { agama: "Islam" }, kontak: "081234567890" },
    { id: 2, nama_pegawai: "Joko Widodo", jenis_kelamin: "L", jabatan: { nama_jabatan: "Guru BP" }, agama: { agama: "Islam" }, kontak: "081234567891" },
    { id: 3, nama_pegawai: "Sri Mulyani", jenis_kelamin: "P", jabatan: { nama_jabatan: "Wali Kelas IX A" }, agama: { agama: "Kristen" }, kontak: "081234567892" },
    { id: 4, nama_pegawai: "Bambang Soesatyo", jenis_kelamin: "L", jabatan: { nama_jabatan: "Guru Matematika" }, agama: { agama: "Katolik" }, kontak: "081234567893" },
    { id: 5, nama_pegawai: "Puan Maharani", jenis_kelamin: "P", jabatan: { nama_jabatan: "Guru Bahasa Indonesia" }, agama: { agama: "Hindu" }, kontak: "081234567894" },
    { id: 6, nama_pegawai: "Prabowo Subianto", jenis_kelamin: "L", jabatan: { nama_jabatan: "Penjaga Sekolah" }, agama: { agama: "Islam" }, kontak: "081234567895" }
];
// --- END DUMMY DATA ---

const Pegawai = () => {
  const [pegawai, setPegawai] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filterText, setFilterText] = useState("");
  
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [pegawaiToDelete, setPegawaiToDelete] = useState(null);
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchPegawai = () => {
    setLoading(true);
    setTimeout(() => {
        const dataWithNo = dummyPegawai.map((item, index) => ({
            ...item,
            no: index + 1,
        }));
        setPegawai(dataWithNo);
        setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchPegawai();
  }, []);

  const filteredItems = useMemo(() => {
    return pegawai.filter((item) => 
        JSON.stringify(item).toLowerCase().includes(filterText.toLowerCase())
    );
  }, [pegawai, filterText]);

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredItems.length / rowsPerPage);

  const handleDelete = (p) => {
    setPegawaiToDelete(p);
    setShowDeleteConfirmModal(true);
  };

  const confirmDelete = () => {
    console.log("Hapus pegawai:", pegawaiToDelete);
    setShowDeleteConfirmModal(false);
    setPegawaiToDelete(null);
    // Nanti di sini akan ada logic untuk DELETE ke API
  };

  const LoadingTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full w-full table-auto animate-pulse">
        <thead className="bg-gray-800 text-white text-center">
          <tr>
            {['No', 'Nama Pegawai', 'JK', 'Jabatan', 'Agama', 'Kontak', 'Aksi'].map(h => 
              <th key={h} className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">{h}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {[...Array(rowsPerPage)].map((_, index) => (
            <tr key={index} className="border-b border-gray-200">
              {[...Array(7)].map((_, cellIndex) => (
                <td key={cellIndex} className="py-4 px-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-lg rounded-lg p-6"
    >
      <motion.div variants={containerVariants} className="mb-4 border-b pb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Manajemen Data Pegawai
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          Kelola daftar pegawai di halaman ini.
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari pegawai..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <button
          onClick={() => alert("Navigate to Tambah Pegawai page")}
          className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition flex items-center justify-center shadow-md"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          <span>Tambah Data Pegawai</span>
        </button>
      </div>

      {loading ? (
        <LoadingTable />
      ) : (
        <div className="overflow-x-auto text-sm">
          <table className="min-w-full w-full table-auto border-collapse">
            <thead className="bg-gray-800 text-white text-center">
              <tr>
                <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">No</th>
                <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">Nama Pegawai</th>
                <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">JK</th>
                <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">Jabatan</th>
                <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">Agama</th>
                <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">Kontak</th>
                <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedItems.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 text-gray-700">
                  <td className="px-3 py-3 whitespace-nowrap text-center">{p.no}</td>
                  <td className="px-3 py-3 whitespace-nowrap font-medium text-gray-900">{p.nama_pegawai}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-center">{p.jenis_kelamin}</td>
                  <td className="px-3 py-3 whitespace-nowrap">{p.jabatan?.nama_jabatan || '-'}</td>
                  <td className="px-3 py-3 whitespace-nowrap">{p.agama?.agama || '-'}</td>
                  <td className="px-3 py-3 whitespace-nowrap">{p.kontak}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-center space-x-2">
                    <button onClick={() => alert(`Edit pegawai: ${p.nama_pegawai}`)} className="bg-yellow-100 text-yellow-800 font-semibold p-2 rounded-lg hover:bg-yellow-200 transition">
                        <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(p)} className="bg-red-100 text-red-800 font-semibold p-2 rounded-lg hover:bg-red-200 transition">
                        <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center p-2 text-sm text-gray-600 border-t mt-4">
            <div className="flex items-center gap-2">
                <span>Baris per halaman:</span>
                <select value={rowsPerPage} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(0); }}
                    className="px-2 py-1 bg-transparent focus:outline-none border rounded-md">
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                </select>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={() => setPage((p) => Math.max(p - 1, 0))} disabled={page === 0}
                    className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed">
                    Sebelumnya
                </button>
                <span>
                    Hal {page + 1} dari {totalPages}
                </span>
                <button onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))} disabled={page >= totalPages - 1}
                    className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed">
                    Berikutnya
                </button>
            </div>
        </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && pegawaiToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Konfirmasi Hapus</h2>
            <p className="text-gray-600 mb-6">Anda yakin ingin menghapus data pegawai <strong className="text-gray-900">{pegawaiToDelete.nama_pegawai}</strong>?</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setShowDeleteConfirmModal(false)} className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition">
                Batal
              </button>
              <button onClick={confirmDelete} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                Ya, Hapus!
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Pegawai;
