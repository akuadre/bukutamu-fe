import React, { useState, useEffect, useMemo, useRef } from "react";
import { Search, Edit, Trash2, PlusCircle, XCircle } from "lucide-react";
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
const dummyJabatan = [
    { id: 1, nama_jabatan: "Kepala Sekolah" },
    { id: 2, nama_jabatan: "Wakil Kepala Sekolah" },
    { id: 3, nama_jabatan: "Guru BP" },
    { id: 4, nama_jabatan: "Wali Kelas IX A" },
    { id: 5, nama_jabatan: "Staf TU" },
    { id: 6, nama_jabatan: "Guru Matematika" },
    { id: 7, nama_jabatan: "Guru Bahasa Indonesia" },
    { id: 8, nama_jabatan: "Penjaga Sekolah" },
];
// --- END DUMMY DATA ---

const Jabatan = () => {
  const [jabatan, setJabatan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [filterText, setFilterText] = useState("");
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  
  const [editingJabatan, setEditingJabatan] = useState(null);
  const [jabatanToDelete, setJabatanToDelete] = useState(null);
  const [newJabatanName, setNewJabatanName] = useState("");

  const addInputRef = useRef(null);
  const editInputRef = useRef(null);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchJabatan = () => {
    setLoading(true);
    setTimeout(() => {
      const dataWithNo = dummyJabatan.map((item, index) => ({
        ...item,
        no: index + 1,
      }));
      setJabatan(dataWithNo);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchJabatan();
  }, []);

  // Auto-focus input when modal opens
  useEffect(() => {
    if (showAddModal) {
      setTimeout(() => addInputRef.current?.focus(), 100);
    }
    if (showEditModal) {
      setTimeout(() => editInputRef.current?.focus(), 100);
    }
  }, [showAddModal, showEditModal]);

  const filteredItems = useMemo(() => {
    return jabatan.filter((item) =>
      item.nama_jabatan.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [jabatan, filterText]);

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredItems.length / rowsPerPage);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    console.log("Tambah jabatan:", newJabatanName);
    setNewJabatanName("");
    setShowAddModal(false);
    // Logic untuk POST ke API
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    console.log("Edit jabatan:", editingJabatan);
    setShowEditModal(false);
    // Logic untuk PUT ke API
  };

  const handleDelete = (j) => {
    setJabatanToDelete(j);
    setShowDeleteConfirmModal(true);
  };

  const confirmDelete = () => {
    console.log("Hapus jabatan:", jabatanToDelete);
    setShowDeleteConfirmModal(false);
    setJabatanToDelete(null);
    // Logic untuk DELETE ke API
  };

  const LoadingTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full w-full table-auto animate-pulse">
        <thead className="bg-gray-800 text-white text-center">
          <tr>
            <th className="w-14 px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">No</th>
            <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">Nama Jabatan</th>
            <th className="w-32 px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(rowsPerPage)].map((_, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="py-4 px-4"><div className="h-4 bg-gray-200 rounded"></div></td>
              <td className="py-4 px-4"><div className="h-4 bg-gray-200 rounded"></div></td>
              <td className="py-4 px-4"><div className="h-4 bg-gray-200 rounded"></div></td>
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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Manajemen Data Jabatan</h1>
        <p className="text-gray-600 text-sm mt-1">Kelola daftar jabatan di halaman ini.</p>
      </motion.div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Cari jabatan..." value={filterText} onChange={(e) => setFilterText(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 outline-none"/>
        </div>
        <button onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition flex items-center justify-center shadow-md">
          <PlusCircle className="w-5 h-5 mr-2" />
          <span>Tambah Data Jabatan</span>
        </button>
      </div>

      {loading ? <LoadingTable /> : (
        <div className="overflow-x-auto text-sm">
          <table className="min-w-full w-full table-auto border-collapse">
            <thead className="bg-gray-800 text-white text-center">
              <tr>
                <th className="w-14 px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">No</th>
                <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider text-center">Nama Jabatan</th>
                <th className="w-32 px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedItems.map((j) => (
                <tr key={j.id} className="hover:bg-gray-50 text-gray-700">
                  <td className="px-3 py-3 whitespace-nowrap text-center">{j.no}</td>
                  <td className="px-3 py-3 whitespace-nowrap font-medium text-gray-900">{j.nama_jabatan}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-center space-x-2">
                    <button onClick={() => { setEditingJabatan(j); setShowEditModal(true); }}
                      className="bg-yellow-100 text-yellow-800 font-semibold p-2 rounded-lg hover:bg-yellow-200 transition">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(j)}
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

      {/* Pagination */}
      <div className="flex justify-between items-center p-2 text-sm text-gray-600 border-t mt-4">
            <div className="flex items-center gap-2">
                <span>Baris per halaman:</span>
                <select value={rowsPerPage} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(0); }}
                    className="px-2 py-1 bg-transparent focus:outline-none border rounded-md">
                    <option value={5}>5</option><option value={10}>10</option><option value={25}>25</option>
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

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Tambah Jabatan</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><XCircle className="w-7 h-7" /></button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <label htmlFor="newJabatan" className="block text-gray-700 font-medium mb-2">Nama Jabatan</label>
              <input ref={addInputRef} id="newJabatan" type="text" value={newJabatanName} onChange={(e) => setNewJabatanName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition">Batal</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingJabatan && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Edit Jabatan</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600"><XCircle className="w-7 h-7" /></button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <label htmlFor="editJabatan" className="block text-gray-700 font-medium mb-2">Nama Jabatan</label>
              <input ref={editInputRef} id="editJabatan" type="text" value={editingJabatan.nama_jabatan} onChange={(e) => setEditingJabatan({...editingJabatan, nama_jabatan: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition">Batal</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && jabatanToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Konfirmasi Hapus</h2>
            <p className="text-gray-600 mb-6">Anda yakin ingin menghapus jabatan <strong className="text-gray-900">{jabatanToDelete.nama_jabatan}</strong>?</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setShowDeleteConfirmModal(false)} className="px-6 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition">Batal</button>
              <button onClick={confirmDelete} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Ya, Hapus!</button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Jabatan;
