import React, { useState, useEffect, useMemo } from "react";
import { Search, Edit, Trash2, PlusCircle, Loader, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

// Impor komponen baru
// Pastikan path ini sesuai dengan struktur folder Anda
import Modal from '../components/Modal';
import Notification from '../components/Notification';
import FormInput from '../components/FormInput';

// --- DUMMY DATA ---
const dummySiswa = [
    { idsiswa: 1, nis: "1001", nisn: "0011223344", namasiswa: "Ahmad Subarjo", tempatlahir: "Bandung", tgllahir: "2005-08-17", jk: "L", alamat: "Jl. Merdeka No. 1", agama: { idagama: 1, agama: "Islam" }, kontak: "081234567890", thnajaran: { idthnajaran: 1, thnajaran: "2021/2022" } },
    { idsiswa: 2, nis: "1002", nisn: "0011223345", namasiswa: "Budi Santoso", tempatlahir: "Jakarta", tgllahir: "2005-04-21", jk: "L", alamat: "Jl. Pahlawan No. 10", agama: { idagama: 2, agama: "Kristen" }, kontak: "081234567891", thnajaran: { idthnajaran: 1, thnajaran: "2021/2022" } },
    { idsiswa: 3, nis: "1003", nisn: "0011223346", namasiswa: "Citra Lestari", tempatlahir: "Surabaya", tgllahir: "2005-11-30", jk: "P", alamat: "Jl. Asia Afrika No. 5", agama: { idagama: 1, agama: "Islam" }, kontak: "081234567892", thnajaran: { idthnajaran: 1, thnajaran: "2021/2022" } },
    { idsiswa: 4, nis: "1004", nisn: "0011223347", namasiswa: "Dewi Anggraini", tempatlahir: "Yogyakarta", tgllahir: "2006-01-15", jk: "P", alamat: "Jl. Diponegoro No. 8", agama: { idagama: 3, agama: "Katolik" }, kontak: "081234567893", thnajaran: { idthnajaran: 2, thnajaran: "2022/2023" } },
    { idsiswa: 5, nis: "1005", nisn: "0011223348", namasiswa: "Eka Prasetya", tempatlahir: "Medan", tgllahir: "2005-02-28", jk: "L", alamat: "Jl. Gatot Subroto No. 12", agama: { idagama: 4, agama: "Hindu" }, kontak: "081234567894", thnajaran: { idthnajaran: 1, thnajaran: "2021/2022" } },
    { idsiswa: 6, nis: "1006", nisn: "0011223349", namasiswa: "Fitriani", tempatlahir: "Makassar", tgllahir: "2006-07-07", jk: "P", alamat: "Jl. Sudirman No. 20", agama: { idagama: 1, agama: "Islam" }, kontak: "081234567895", thnajaran: { idthnajaran: 2, thnajaran: "2022/2023" } }
];
// --- END DUMMY DATA ---

const Siswa = () => {
    const [siswa, setSiswa] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [filterText, setFilterText] = useState("");
    
    // State Modal yang disederhanakan
    const [modalState, setModalState] = useState({ type: null, data: null }); // type: 'add', 'edit', 'delete'
    
    // State Notifikasi
    const [notification, setNotification] = useState(null); // { type: 'success', text: 'Pesan' }
    
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const showNotif = (type, text) => {
        setNotification({ type, text });
    };

    const fetchSiswa = () => {
        setLoading(true);
        setTimeout(() => {
            const dataWithNo = dummySiswa.map((item, index) => ({ ...item, no: page * rowsPerPage + index + 1 }));
            setSiswa(dataWithNo);
            setLoading(false);
        }, 1500);
    };

    useEffect(() => { fetchSiswa() }, []);

    const filteredItems = useMemo(() => {
        return siswa.filter((item) => 
            JSON.stringify(item).toLowerCase().includes(filterText.toLowerCase())
        );
    }, [siswa, filterText]);

    const paginatedItems = filteredItems.slice(page * rowsPerPage, (page * rowsPerPage) + rowsPerPage);
    const totalPages = Math.ceil(filteredItems.length / rowsPerPage);

    const closeModal = () => setModalState({ type: null, data: null });

    const handleFormSubmit = (e, actionType) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            const formData = Object.fromEntries(new FormData(e.target));
            console.log(`${actionType} data siswa:`, formData);
            closeModal();
            setIsSubmitting(false);
            showNotif('success', `Data siswa berhasil di${actionType === 'Tambah' ? 'tambahkan' : 'perbarui'}!`);
            fetchSiswa(); // Refresh data
        }, 1000);
    };
    
    const confirmDelete = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            console.log("Hapus siswa:", modalState.data);
            closeModal();
            setIsSubmitting(false);
            showNotif('success', `Data ${modalState.data.namasiswa} berhasil dihapus.`);
            fetchSiswa(); // Refresh data
        }, 1000);
    };

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
        <Notification notification={notification} onDismiss={() => setNotification(null)} />
        
        <motion.div 
          className="bg-white shadow-xl rounded-2xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
            <div className="mb-6 border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-800">Manajemen Data Siswa</h1>
                <p className="text-gray-500 mt-1">Kelola daftar siswa Anda di halaman ini.</p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" placeholder="Cari siswa..." value={filterText} onChange={(e) => setFilterText(e.target.value)}
                        className="pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-sky-500 outline-none transition" />
                </div>
                <button onClick={() => setModalState({ type: 'add', data: null })}
                    className="bg-sky-600 text-white px-5 py-2.5 rounded-lg hover:bg-sky-700 transition-all duration-300 flex items-center justify-center shadow-lg shadow-sky-200 hover:shadow-xl w-full md:w-auto">
                    <PlusCircle className="w-5 h-5 mr-2" />
                    <span>Tambah Siswa</span>
                </button>
            </div>
            
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
                        {paginatedItems.map((s, index) => (
                            <tr key={s.idsiswa} className="hover:bg-gray-50 text-gray-700">
                                <td className="px-3 py-3 whitespace-nowrap text-center">{page * rowsPerPage + index + 1}</td>
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
                                    <button onClick={() => setModalState({ type: 'edit', data: s })}
                                        className="bg-amber-100 text-amber-800 font-semibold p-2 rounded-lg hover:bg-amber-200 transition">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => setModalState({ type: 'delete', data: s })}
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

        {/* --- MODAL TAMBAH DATA --- */}
        <Modal isOpen={modalState.type === 'add'} onClose={closeModal} title="Tambah Data Siswa Baru">
            <form onSubmit={(e) => handleFormSubmit(e, 'Tambah')} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <FormInput label="NIS" id="nis" name="nis" placeholder="Contoh: 1007" required />
                <FormInput label="NISN" id="nisn" name="nisn" placeholder="Contoh: 0011223350" required />
                <div className="md:col-span-2">
                    <FormInput label="Nama Lengkap Siswa" id="namasiswa" name="namasiswa" placeholder="Masukkan nama lengkap" required />
                </div>
                {/* Tambahkan input lain di sini sesuai kebutuhan */}
                <div className="md:col-span-2 flex justify-end gap-3 pt-4">
                    <button type="button" onClick={closeModal} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">Batal</button>
                    <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:bg-sky-300 flex items-center gap-2">
                        {isSubmitting && <Loader className="animate-spin w-4 h-4" />}
                        {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                    </button>
                </div>
            </form>
        </Modal>

        {/* --- MODAL EDIT DATA --- */}
        <Modal isOpen={modalState.type === 'edit'} onClose={closeModal} title={`Edit Data: ${modalState.data?.namasiswa}`}>
            {modalState.data && (
                <form onSubmit={(e) => handleFormSubmit(e, 'Edit')} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <FormInput label="NIS" id="nis_edit" name="nis" defaultValue={modalState.data.nis} required />
                    <FormInput label="NISN" id="nisn_edit" name="nisn" defaultValue={modalState.data.nisn} required />
                    <div className="md:col-span-2">
                         <FormInput label="Nama Lengkap Siswa" id="namasiswa_edit" name="namasiswa" defaultValue={modalState.data.namasiswa} required />
                    </div>
                    {/* Tambahkan input lain di sini */}
                    <div className="md:col-span-2 flex justify-end gap-3 pt-4">
                        <button type="button" onClick={closeModal} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">Batal</button>
                        <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:bg-sky-300 flex items-center gap-2">
                             {isSubmitting && <Loader className="animate-spin w-4 h-4" />}
                             {isSubmitting ? 'Memperbarui...' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            )}
        </Modal>

        {/* --- MODAL KONFIRMASI HAPUS --- */}
        <Modal isOpen={modalState.type === 'delete'} onClose={closeModal} title="Konfirmasi Hapus Data">
            {modalState.data && (
                <div className="text-center">
                    <AlertTriangle className="w-16 h-16 mx-auto text-red-500 mb-4" />
                    <p className="text-gray-600 text-lg mb-6">
                        Apakah Anda benar-benar yakin ingin menghapus data siswa
                        <br />
                        <span className="font-bold text-gray-900">{modalState.data.namasiswa}</span>?
                    </p>
                    <p className="text-sm text-gray-500">Tindakan ini tidak dapat dibatalkan.</p>
                    <div className="flex justify-center gap-4 mt-8">
                        <button onClick={closeModal} disabled={isSubmitting} className="px-8 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">Batal</button>
                        <button onClick={confirmDelete} disabled={isSubmitting} className="px-8 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-300 flex items-center gap-2">
                             {isSubmitting && <Loader className="animate-spin w-4 h-4" />}
                             {isSubmitting ? 'Menghapus...' : 'Ya, Hapus'}
                        </button>
                    </div>
                </div>
            )}
        </Modal>
    </>
    );
};

export default Siswa;