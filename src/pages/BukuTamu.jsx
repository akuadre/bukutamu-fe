import React, { useState, useEffect, useMemo } from "react";
import { Search, Edit, Trash2, PlusCircle, XCircle, Camera } from "lucide-react";
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
const dummyBukuTamu = [
    { id: 1, nama: "Agus Setiawan", role: "ortu", siswa: { namasiswa: "Ahmad Subarjo" }, instansi: "-", alamat: "Jl. Cendrawasih No. 15", kontak: "081122334455", pegawai: { nama_pegawai: "Endang S." }, jabatan: { nama_jabatan: "Kepala Sekolah" }, keperluan: "Konsultasi nilai anak", foto_tamu: "foto1.jpg", created_at: "2025-09-26T09:30:00" },
    { id: 2, nama: "Bambang Pamungkas", role: "umum", siswa: { namasiswa: "-" }, instansi: "Dinas Pendidikan", alamat: "Jl. Gatot Subroto No. 1", kontak: "082233445566", pegawai: { nama_pegawai: "Endang S." }, jabatan: { nama_jabatan: "Kepala Sekolah" }, keperluan: "Koordinasi Acara", foto_tamu: null, created_at: "2025-09-25T14:00:00" },
    { id: 3, nama: "Rina Nose", role: "ortu", siswa: { namasiswa: "Citra Lestari" }, instansi: "-", alamat: "Jl. Kenari No. 2", kontak: "083344556677", pegawai: { nama_pegawai: "Sri Mulyani" }, jabatan: { nama_jabatan: "Wali Kelas IX A" }, keperluan: "Pengambilan Rapor", foto_tamu: "foto3.jpg", created_at: "2025-09-24T11:15:00" },
    { id: 4, nama: "Sule", role: "umum", siswa: { namasiswa: "-" }, instansi: "Komite Sekolah", alamat: "Jl. Pahlawan No. 99", kontak: "085566778899", pegawai: { nama_pegawai: "Joko Widodo" }, jabatan: { nama_jabatan: "Guru BP" }, keperluan: "Rapat Komite", foto_tamu: "foto4.jpg", created_at: "2025-09-23T08:45:00" }
];
// --- END DUMMY DATA ---

const BukuTamu = () => {
  const [bukuTamu, setBukuTamu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filterText, setFilterText] = useState("");
  
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [tamuToDelete, setTamuToDelete] = useState(null);
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchBukuTamu = () => {
    setLoading(true);
    setTimeout(() => {
        const dataWithNo = dummyBukuTamu.map((item, index) => ({
            ...item,
            no: index + 1,
        }));
        setBukuTamu(dataWithNo);
        setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchBukuTamu();
  }, []);

  const filteredItems = useMemo(() => {
    return bukuTamu.filter((item) => 
        JSON.stringify(item).toLowerCase().includes(filterText.toLowerCase())
    );
  }, [bukuTamu, filterText]);

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredItems.length / rowsPerPage);

  const handleDelete = (tamu) => {
    setTamuToDelete(tamu);
    setShowDeleteConfirmModal(true);
  };

  const confirmDelete = () => {
    console.log("Hapus tamu:", tamuToDelete);
    setShowDeleteConfirmModal(false);
    setTamuToDelete(null);
    // Nanti di sini akan ada logic untuk DELETE ke API
  };

  const formatDate = (dateString) => {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
      return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const LoadingTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full w-full table-auto animate-pulse">
        <thead className="bg-gray-800 text-white text-center">
          <tr>
            <th className="px-3 py-3 w-12 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">No</th>
            <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">Nama Tamu</th>
            <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">Role</th>
            <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">Siswa</th>
            <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">Bertemu</th>
            <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">Keperluan</th>
            <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">Foto</th>
            <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">Tanggal</th>
            <th className="px-3 py-3 w-32 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(rowsPerPage)].map((_, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="py-4 px-3"><div className="h-4 bg-gray-200 rounded"></div></td>
              <td className="py-4 px-3"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
              <td className="py-4 px-3"><div className="h-4 bg-gray-200 rounded"></div></td>
              <td className="py-4 px-3"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
              <td className="py-4 px-3"><div className="h-4 bg-gray-200 rounded w-2/3"></div></td>
              <td className="py-4 px-3"><div className="h-4 bg-gray-200 rounded w-5/6"></div></td>
              <td className="py-4 px-3"><div className="w-20 h-20 bg-gray-200 rounded mx-auto"></div></td>
              <td className="py-4 px-3"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
              <td className="py-4 px-3"><div className="h-4 bg-gray-200 rounded"></div></td>
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
          Manajemen Buku Tamu
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          Kelola daftar kunjungan tamu di halaman ini.
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Cari tamu..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <button
          onClick={() => alert("Navigate to Tambah Buku Tamu page")} // Aksi ini mungkin navigasi ke halaman form terpisah
          className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition flex items-center justify-center shadow-md"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          <span>Tambah Data Tamu</span>
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
                <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">Nama Tamu</th>
                <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">Role</th>
                <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">Nama Siswa</th>
                <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">Bertemu Dengan</th>
                <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">Keperluan</th>
                <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">Foto</th>
                <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">Tanggal Kunjungan</th>
                <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedItems.map((tamu) => (
                <tr key={tamu.id} className="hover:bg-gray-50 text-gray-700">
                  <td className="px-3 py-3 whitespace-nowrap text-center">{tamu.no}</td>
                  <td className="px-3 py-3 whitespace-nowrap font-medium text-gray-900">{tamu.nama}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-center">{tamu.role === 'ortu' ? 'Orang Tua' : 'Tamu Umum'}</td>
                  <td className="px-3 py-3 whitespace-nowrap">{tamu.siswa?.namasiswa || '-'}</td>
                  <td className="px-3 py-3 whitespace-nowrap">{tamu.pegawai?.nama_pegawai} ({tamu.jabatan?.nama_jabatan})</td>
                  <td className="px-3 py-3 whitespace-normal max-w-xs">{tamu.keperluan}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-center">
                    {tamu.foto_tamu ? (
                        <img src={`https://placehold.co/80x80/E0E7FF/4338CA?text=Foto`} alt="Foto Tamu" className="w-16 h-16 object-cover rounded-md shadow-sm mx-auto"/>
                    ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center mx-auto">
                            <Camera size={24} className="text-gray-400"/>
                        </div>
                    )}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-center">{formatDate(tamu.created_at)}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-center space-x-2">
                    <button onClick={() => alert(`Edit tamu: ${tamu.nama}`)} className="bg-yellow-100 text-yellow-800 font-semibold p-2 rounded-lg hover:bg-yellow-200 transition">
                        <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(tamu)} className="bg-red-100 text-red-800 font-semibold p-2 rounded-lg hover:bg-red-200 transition">
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
      {showDeleteConfirmModal && tamuToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Konfirmasi Hapus</h2>
            <p className="text-gray-600 mb-6">Apakah Anda yakin ingin menghapus data tamu <strong className="text-gray-900">{tamuToDelete.nama}</strong>?</p>
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

export default BukuTamu;
