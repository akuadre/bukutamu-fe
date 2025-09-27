import React, { useState, useEffect, useMemo } from "react";
import { Search, Edit, Trash2, PlusCircle, XCircle, CheckCircle, AlertTriangle } from "lucide-react";
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
const dummySiswa = [
    { idsiswa: 1, nis: "1001", nisn: "0011223344", namasiswa: "Ahmad Subarjo", tempatlahir: "Bandung", tgllahir: "2005-08-17", jk: "L", alamat: "Jl. Merdeka No. 1", agama: { agama: "Islam" }, kontak: "081234567890", thnajaran: { thnajaran: "2021/2022" } },
    { idsiswa: 2, nis: "1002", nisn: "0011223345", namasiswa: "Budi Santoso", tempatlahir: "Jakarta", tgllahir: "2005-04-21", jk: "L", alamat: "Jl. Pahlawan No. 10", agama: { agama: "Kristen" }, kontak: "081234567891", thnajaran: { thnajaran: "2021/2022" } },
    { idsiswa: 3, nis: "1003", nisn: "0011223346", namasiswa: "Citra Lestari", tempatlahir: "Surabaya", tgllahir: "2005-11-30", jk: "P", alamat: "Jl. Asia Afrika No. 5", agama: { agama: "Islam" }, kontak: "081234567892", thnajaran: { thnajaran: "2021/2022" } },
    { idsiswa: 4, nis: "1004", nisn: "0011223347", namasiswa: "Dewi Anggraini", tempatlahir: "Yogyakarta", tgllahir: "2006-01-15", jk: "P", alamat: "Jl. Diponegoro No. 8", agama: { agama: "Katolik" }, kontak: "081234567893", thnajaran: { thnajaran: "2022/2023" } },
    { idsiswa: 5, nis: "1005", nisn: "0011223348", namasiswa: "Eka Prasetya", tempatlahir: "Medan", tgllahir: "2005-02-28", jk: "L", alamat: "Jl. Gatot Subroto No. 12", agama: { agama: "Hindu" }, kontak: "081234567894", thnajaran: { thnajaran: "2021/2022" } },
    { idsiswa: 6, nis: "1006", nisn: "0011223349", namasiswa: "Fitriani", tempatlahir: "Makassar", tgllahir: "2006-07-07", jk: "P", alamat: "Jl. Sudirman No. 20", agama: { agama: "Islam" }, kontak: "081234567895", thnajaran: { thnajaran: "2022/2023" } }
];
// --- END DUMMY DATA ---

const Siswa = () => {
  const [siswa, setSiswa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterText, setFilterText] = useState("");
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  
  const [siswaToDelete, setSiswaToDelete] = useState(null);
  const [editingSiswa, setEditingSiswa] = useState(null);

  // State untuk Notifikasi
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState({ type: '', text: '' });
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const showNotif = (type, text) => {
    setNotificationMessage({ type, text });
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000); // Notifikasi hilang setelah 3 detik
  };

  const fetchSiswa = () => {
    setLoading(true);
    setTimeout(() => {
        const dataWithNo = dummySiswa.map((item, index) => ({ ...item, no: index + 1 }));
        setSiswa(dataWithNo);
        setLoading(false);
    }, 1500); // Sedikit lebih lama untuk melihat efek skeleton
  };

  useEffect(() => { fetchSiswa() }, []);

  const filteredItems = useMemo(() => {
    return siswa.filter((item) => 
        JSON.stringify(item).toLowerCase().includes(filterText.toLowerCase())
    );
  }, [siswa, filterText]);

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredItems.length / rowsPerPage);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => { // Simulasi submit
        console.log("Tambah data siswa:", Object.fromEntries(new FormData(e.target)));
        setShowAddModal(false);
        setIsSubmitting(false);
        showNotif('success', 'Data siswa berhasil ditambahkan!');
    }, 1000);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => { // Simulasi submit
        console.log("Edit data siswa:", Object.fromEntries(new FormData(e.target)));
        setShowEditModal(false);
        setIsSubmitting(false);
        showNotif('success', 'Data siswa berhasil diperbarui!');
    }, 1000);
  };

  const handleDelete = (siswa) => {
    setSiswaToDelete(siswa);
    setShowDeleteConfirmModal(true);
  };

  const confirmDelete = () => {
    setIsSubmitting(true);
    setTimeout(() => { // Simulasi delete
        console.log("Hapus siswa:", siswaToDelete);
        setShowDeleteConfirmModal(false);
        setIsSubmitting(false);
        showNotif('success', `Data ${siswaToDelete.namasiswa} berhasil dihapus.`);
        setSiswaToDelete(null);
    }, 1000);
  };
  
  // Skeleton loader dengan header statis
  const LoadingTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full w-full table-auto animate-pulse">
        <thead className="bg-gray-800 text-white text-center">
          <tr>
            <th className="px-3 py-3 w-12 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">No</th>
            <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">NIS</th>
            <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">NISN</th>
            <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">Nama Siswa</th>
            <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">Tempat, Tgl Lahir</th>
            <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">JK</th>
            <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">Alamat</th>
            <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">Tahun Masuk</th>
            <th className="px-3 py-3 w-32 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(rowsPerPage)].map((_, index) => (
            <tr key={index} className="border-b border-gray-200">
                <td className="py-4 px-3"><div className="h-4 bg-gray-200 rounded"></div></td>
                <td className="py-4 px-3"><div className="h-4 bg-gray-200 rounded"></div></td>
                <td className="py-4 px-3"><div className="h-4 bg-gray-200 rounded"></div></td>
                <td className="py-4 px-3"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
                <td className="py-4 px-3"><div className="h-4 bg-gray-200 rounded w-5/6"></div></td>
                <td className="py-4 px-3"><div className="h-4 bg-gray-200 rounded"></div></td>
                <td className="py-4 px-3"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
                <td className="py-4 px-3"><div className="h-4 bg-gray-200 rounded"></div></td>
                <td className="py-4 px-3"><div className="h-4 bg-gray-200 rounded"></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      {showNotification && (
          <div className="fixed top-20 right-5 z-50 animate-fade-in-down">
              <div className={`p-4 rounded-lg shadow-lg flex items-center text-white ${notificationMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                  {notificationMessage.type === 'success' ? <CheckCircle className="w-6 h-6 mr-3" /> : <AlertTriangle className="w-6 h-6 mr-3" />}
                  <span>{notificationMessage.text}</span>
              </div>
          </div>
      )}

      <motion.div 
        className="bg-white shadow-lg rounded-lg p-6"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <div className="mb-4 border-b pb-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Manajemen Data Siswa</h1>
              <p className="text-gray-600 text-sm mt-1">Kelola daftar siswa Anda di halaman ini.</p>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" placeholder="Cari siswa..." value={filterText} onChange={(e) => setFilterText(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <button onClick={() => setShowAddModal(true)}
                className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition flex items-center justify-center shadow-md">
                <PlusCircle className="w-5 h-5 mr-2" />
                <span>Tambah Data Siswa</span>
              </button>
            </div>
        </motion.div>

        {loading ? <LoadingTable /> : (
            <div className="overflow-x-auto text-sm">
                <table className="min-w-full w-full table-auto border-collapse">
                    <thead className="bg-gray-800 text-white text-center">
                        <tr>
                            <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">No</th>
                            <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">NIS</th>
                            <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">NISN</th>
                            <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">Nama Siswa</th>
                            <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">Tempat, Tgl Lahir</th>
                            <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">JK</th>
                            <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">Alamat</th>
                            <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">Agama</th>
                            <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">HP</th>
                            <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">Tahun Masuk</th>
                            <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedItems.map((s) => (
                        <tr key={s.idsiswa} className="hover:bg-gray-50 text-gray-700">
                            <td className="px-3 py-3 whitespace-nowrap text-center">{s.no}</td>
                            <td className="px-3 py-3 whitespace-nowrap text-center">{s.nis}</td>
                            <td className="px-3 py-3 whitespace-nowrap text-center">{s.nisn}</td>
                            <td className="px-3 py-3 whitespace-nowrap font-medium text-gray-900">{s.namasiswa}</td>
                            <td className="px-3 py-3 whitespace-nowrap">{s.tempatlahir}, {new Date(s.tgllahir).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
                            <td className="px-3 py-3 whitespace-nowrap text-center">{s.jk}</td>
                            <td className="px-3 py-3 whitespace-nowrap">{s.alamat}</td>
                            <td className="px-3 py-3 whitespace-nowrap">{s.agama?.agama}</td>
                            <td className="px-3 py-3 whitespace-nowrap">{s.kontak}</td>
                            <td className="px-3 py-3 whitespace-nowrap text-center">{s.thnajaran?.thnajaran}</td>
                            <td className="px-3 py-3 whitespace-nowrap text-center space-x-2">
                                <button onClick={() => { setEditingSiswa(s); setShowEditModal(true); }}
                                    className="bg-yellow-100 text-yellow-800 font-semibold p-2 rounded-lg hover:bg-yellow-200 transition">
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(s)}
                                    className="bg-red-100 text-red-800 font-semibold p-2 rounded-lg hover:bg-red-200 transition">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        )}

        <div className="flex justify-between items-center p-2 text-sm text-gray-600 border-t mt-4">
            <div className="flex items-center gap-2">
                <span>Baris per halaman:</span>
                <select value={rowsPerPage} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(0); }}
                    className="px-2 py-1 bg-transparent focus:outline-none border rounded-md">
                    <option value={5}>5</option> <option value={10}>10</option> <option value={25}>25</option>
                </select>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={() => setPage((p) => Math.max(p - 1, 0))} disabled={page === 0}
                    className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed">
                    Sebelumnya
                </button>
                <span>Hal {page + 1} dari {totalPages}</span>
                <button onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))} disabled={page >= totalPages - 1}
                    className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed">
                    Berikutnya
                </button>
            </div>
        </div>
      </motion.div>

      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Tambah Data Siswa</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><XCircle className="w-7 h-7" /></button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <input name="nis" placeholder="NIS" className="w-full border p-2 rounded" required/>
              <input name="nisn" placeholder="NISN" className="w-full border p-2 rounded" required/>
              <input name="namasiswa" placeholder="Nama Siswa" className="w-full border p-2 rounded" required/>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Batal</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
                  {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editingSiswa && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Edit Data Siswa</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600"><XCircle className="w-7 h-7" /></button>
            </div>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <input name="nis" defaultValue={editingSiswa.nis} placeholder="NIS" className="w-full border p-2 rounded" required/>
              <input name="nisn" defaultValue={editingSiswa.nisn} placeholder="NISN" className="w-full border p-2 rounded" required/>
              <input name="namasiswa" defaultValue={editingSiswa.namasiswa} placeholder="Nama Siswa" className="w-full border p-2 rounded" required/>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Batal</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
                  {isSubmitting ? 'Memperbarui...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteConfirmModal && siswaToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Konfirmasi Hapus</h2>
            <p className="text-gray-600 mb-6">Anda yakin ingin menghapus data <strong className="text-gray-900">{siswaToDelete.namasiswa}</strong>?</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setShowDeleteConfirmModal(false)} disabled={isSubmitting} className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Batal</button>
              <button onClick={confirmDelete} disabled={isSubmitting} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-300">
                {isSubmitting ? 'Menghapus...' : 'Ya, Hapus!'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Siswa;

