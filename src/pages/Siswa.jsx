import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Search, Info, X, ChevronLeft, ChevronRight, User, School, BookUser, Home, Phone, Briefcase, FileText, HeartHandshake, Banknote, ShieldCheck, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = 'http://localhost:8000/api';
const PHOTO_BASE_URL = 'http://localhost:8001';

// =================================================================
// KOMPONEN-KOMPONEN HELPER (MODAL & NOTIFICATION)
// =================================================================

const Modal = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl z-10">
              <h3 className="text-xl font-bold text-gray-800">{title}</h3>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Notification = ({ notification, onDismiss }) => {
  const icons = {
    success: <CheckCircle className="w-6 h-6" />,
    error: <XCircle className="w-6 h-6" />,
    warning: <AlertTriangle className="w-6 h-6" />,
    info: <Info className="w-6 h-6" />,
  };
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-sky-500',
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => { onDismiss(); }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification, onDismiss]);

  return (
    <AnimatePresence>
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="fixed top-5 left-1/2 -translate-x-1/2 z-50"
        >
          <div className={`flex items-center gap-4 text-white p-4 rounded-xl shadow-2xl ${colors[notification.type]}`}>
            {icons[notification.type]}
            <span className="font-medium">{notification.text}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// =================================================================
// KOMPONEN LOADING & DETAIL
// =================================================================

const LoadingTable = ({ rowsPerPage }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full w-full table-auto animate-pulse">
      <thead className="bg-gray-800 text-white text-center">
        <tr>
          <th className="px-3 py-3 w-12 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">No</th>
          <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">NIS</th>
          <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">NISN</th>
          <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">Nama Siswa</th>
          <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">JK</th>
          <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">Tahun Masuk</th>
          <th className="px-3 py-3 w-32 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {[...Array(rowsPerPage)].map((_, index) => (
          <tr key={index} className="border-b border-gray-200">
            <td className="py-4 px-3 text-center"><div className="h-4 bg-gray-200 rounded mx-auto" style={{width: '20px'}}></div></td>
            <td className="py-4 px-3"><div className="h-4 bg-gray-200 rounded"></div></td>
            <td className="py-4 px-3"><div className="h-4 bg-gray-200 rounded"></div></td>
            <td className="py-4 px-3"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
            <td className="py-4 px-3 text-center"><div className="h-4 bg-gray-200 rounded mx-auto" style={{width: '30px'}}></div></td>
            <td className="py-4 px-3 text-center"><div className="h-4 bg-gray-200 rounded mx-auto" style={{width: '60px'}}></div></td>
            <td className="py-4 px-3 text-center"><div className="h-8 bg-gray-200 rounded mx-auto" style={{width: '80px'}}></div></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const DetailRow = ({ label, value }) => (
  <div className="flex flex-col sm:flex-row justify-between py-2.5 border-b border-gray-100 last:border-b-0">
    <dt className="text-sm font-medium text-gray-500 w-full sm:w-2/5">{label}</dt>
    <dd className="text-sm text-gray-900 text-left sm:text-right w-full sm:w-3/5">{value || '-'}</dd>
  </div>
);

const DetailSection = ({ title, icon, children }) => (
  <div className="mb-6">
    <h4 className="text-base font-bold text-gray-700 mb-2 flex items-center">{icon} <span className="ml-2">{title}</span></h4>
    <dl className="bg-gray-50 p-4 rounded-lg">{children}</dl>
  </div>
);

// MODAL DETAIL YANG SUPER LENGKAP
const SiswaDetailModal = ({ siswa, onClose, loading }) => {
  if (!siswa && !loading) return null;

  return (
    <Modal isOpen={true} onClose={onClose} title="Detail Lengkap Siswa">
      {loading ? (
        <div className="p-8 text-center flex items-center justify-center flex-grow"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <div className="space-y-6">
          <div className="text-center">
            <img 
              src={`${PHOTO_BASE_URL}/PhotoSiswa/${siswa.idthnmasuk}/${siswa.photosiswa}`}
              alt={`Foto ${siswa.namasiswa}`} className="w-32 h-40 object-cover rounded-lg mx-auto shadow-md border-4 border-white"
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/128x160/e2e8f0/64748b?text=No+Image'; }}
            />
            <h3 className="text-2xl font-bold mt-4 text-gray-900">{siswa.namasiswa}</h3>
            <p className="text-gray-500">NIS: {siswa.nis}</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-2">
              <DetailSection title="Identitas" icon={<User size={18} className="text-blue-500"/>}>
                  <DetailRow label="ID Siswa" value={siswa.idsiswa} />
                  <DetailRow label="NISN" value={siswa.nisn} />
                  <DetailRow label="NIK" value={siswa.nik} />
                  <DetailRow label="Tempat, Tgl Lahir" value={`${siswa.tmplahir}, ${new Date(siswa.tgllahir).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}`} />
                  <DetailRow label="Jenis Kelamin" value={siswa.jk === 'L' ? 'Laki-laki' : 'Perempuan'} />
                  <DetailRow label="Agama" value={siswa.idagama} />
              </DetailSection>

              <DetailSection title="Informasi Akademik" icon={<School size={18} className="text-green-500"/>}>
                  <DetailRow label="Tahun Masuk" value={siswa.thnajaran?.thnajaran || siswa.idthnmasuk} />
                  <DetailRow label="Asal Sekolah" value={siswa.asalsekolah} />
                  <DetailRow label="Nomor Ijazah" value={siswa.nomorijazah} />
                  <DetailRow label="Nomor UN" value={siswa.nomorun} />
              </DetailSection>
              
              <DetailSection title="Riwayat Kelas" icon={<BookUser size={18} className="text-purple-500"/>}>
                  {siswa.riwayat_kelas_formatted && siswa.riwayat_kelas_formatted.length > 0 ? (
                      siswa.riwayat_kelas_formatted.map((rk, index) => (
                          <DetailRow key={index} label={rk.tahun_ajaran} value={`${rk.nama_kelas} (Wali: ${rk.wali_kelas})`} />
                      ))
                  ) : <p className="text-sm text-gray-500 p-2">Tidak ada riwayat kelas.</p>}
              </DetailSection>

              <DetailSection title="Alamat & Kontak" icon={<Home size={18} className="text-yellow-500"/>}>
                  <DetailRow label="Alamat" value={`${siswa.jalan || ''} RT ${siswa.rt}/${siswa.rw}, ${siswa.desa}, ${siswa.kecamatan}`} />
                  <DetailRow label="Kabupaten/Kota" value={`${siswa.kabupaten}, ${siswa.kodepos}`} />
                  <DetailRow label="No. HP" value={siswa.hpsiswa} />
                  <DetailRow label="Email" value={siswa.email} />
              </DetailSection>

              {siswa.ortu && 
              <DetailSection title="Orang Tua / Wali" icon={<Briefcase size={18} className="text-red-500"/>}>
                  <DetailRow label="Nama Ayah" value={siswa.ortu.nama_ayah} />
                  <DetailRow label="Pekerjaan Ayah" value={siswa.ortu.pekerjaan_ayah} />
                  <DetailRow label="Nama Ibu" value={siswa.ortu.nama_ibu} />
                  <DetailRow label="Pekerjaan Ibu" value={siswa.ortu.pekerjaan_ibu} />
                  {siswa.ortu.nama_wali && <DetailRow label="Nama Wali" value={siswa.ortu.nama_wali} />}
              </DetailSection>}

              <DetailSection title="Bantuan & Kesejahteraan" icon={<HeartHandshake size={18} className="text-teal-500"/>}>
                  <DetailRow label="Penerima KIP" value={siswa.penerimakip} />
                  <DetailRow label="Nomor KIP" value={siswa.nomorkip} />
                  <DetailRow label="Layak PIP" value={siswa.layakpip} />
                  <DetailRow label="Alasan Layak PIP" value={siswa.alasanlayakpip} />
              </DetailSection>

              <DetailSection title="Kesehatan" icon={<ShieldCheck size={18} className="text-cyan-500"/>}>
                  <DetailRow label="Anak Berkebutuhan Khusus" value={siswa.abk} />
                  <DetailRow label="Tinggi / Berat Badan" value={`${siswa.tinggibadan} cm / ${siswa.beratbadan} kg`} />
              </DetailSection>

              <DetailSection title="Informasi Bank" icon={<Banknote size={18} className="text-lime-500"/>}>
                  <DetailRow label="Bank" value={siswa.bank} />
                  <DetailRow label="No. Rekening" value={siswa.nomorrekening} />
                  <DetailRow label="Atas Nama" value={siswa.atasnamarekening} />
              </DetailSection>
          </div>
        </div>
      )}
    </Modal>
  );
};

// =================================================================
// KOMPONEN UTAMA HALAMAN SISWA
// =================================================================

const Siswa = () => {
  const [siswa, setSiswa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  
  // ✅ STATE PAGINATION BARU dengan baris per halaman
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');

  // State untuk Modal Detail
  const [selectedSiswa, setSelectedSiswa] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const showNotif = (type, text) => setNotification({ type, text });

  // Debouncing untuk input search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
      setCurrentPage(1); // Selalu reset ke halaman 1 saat search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fungsi utama untuk fetch data dengan server-side logic
  const fetchData = useCallback(async (page, search, perPage) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/siswa`, {
        params: { 
          page, 
          search,
          rows_per_page: perPage // ✅ Kirim parameter rows_per_page ke backend
        }
      });
      setSiswa(response.data.data || []);
      setPagination({
        current_page: response.data.current_page, 
        last_page: response.data.last_page,
        total: response.data.total, 
        from: response.data.from, 
        to: response.data.to,
      });
    } catch (err) {
      showNotif("error", "Gagal mengambil data siswa dari server.");
      setSiswa([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchData(currentPage, debouncedTerm, rowsPerPage);
  }, [currentPage, debouncedTerm, rowsPerPage, fetchData]);

  // Fungsi untuk membuka modal dan fetch detail
  const handleViewDetail = async (idsiswa) => {
    setIsModalOpen(true);
    setLoadingDetail(true);
    try {
      const response = await axios.get(`${API_URL}/siswa/${idsiswa}`);
      if (response.data.success) {
        setSelectedSiswa(response.data.data);
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      showNotif('error', 'Gagal mengambil detail siswa.');
      setIsModalOpen(false);
    } finally {
      setLoadingDetail(false);
    }
  };

  const closeModal = () => { 
    setIsModalOpen(false); 
    setSelectedSiswa(null); 
  };

  // ✅ Hitung nomor urut berdasarkan halaman saat ini
  const getRowNumber = (index) => {
    return (currentPage - 1) * rowsPerPage + index + 1;
  };

  return (
    <>
      <Notification notification={notification} onDismiss={() => setNotification(null)} />
      
      <motion.div 
        className="bg-white shadow-xl rounded-2xl p-6" 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.45 }}
      >
        <div className="mb-6 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-800">Manajemen Data Siswa</h1>
          <p className="text-gray-500 mt-1">Menampilkan data siswa yang telah disinkronkan.</p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama, NIS, atau NISN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-sky-500 outline-none transition"
            />
          </div>
        </div>

        {loading ? (
          <LoadingTable rowsPerPage={rowsPerPage} />
        ) : (
          <div className="overflow-x-auto text-sm">
            <table className="min-w-full w-full table-auto border-collapse">
              <thead className="bg-gray-800 text-white text-center">
                <tr>
                  <th className="px-3 py-3 w-12 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">No</th>
                  <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">NIS</th>
                  <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">NISN</th>
                  <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider text-left">Nama Siswa</th>
                  <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">JK</th>
                  <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">Tahun Masuk</th>
                  <th className="px-3 py-3 w-32 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {siswa.map((s, index) => (
                  <tr key={s.idsiswa} className="hover:bg-gray-50 text-gray-700">
                    <td className="px-3 py-3 whitespace-nowrap text-center">{getRowNumber(index)}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-center">{s.nis}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-center">{s.nisn}</td>
                    <td className="px-3 py-3 whitespace-nowrap font-medium text-gray-900">
                      <button onClick={() => handleViewDetail(s.idsiswa)} className="text-blue-600 hover:text-blue-800 hover:underline text-left">
                        {s.namasiswa}
                      </button>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-center">{s.jk}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-center">{s.thnajaran?.thnajaran || s.idthnmasuk}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-center">
                      <button onClick={() => handleViewDetail(s.idsiswa)} className="bg-sky-100 text-sky-800 font-semibold p-2 rounded-lg hover:bg-sky-200 transition flex items-center gap-1 mx-auto">
                        <Info className="w-4 h-4" /> Detail
                      </button>
                    </td>
                  </tr>
                ))}
                {!loading && siswa.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-500">
                      {debouncedTerm ? "Tidak ada data yang cocok dengan pencarian." : "Tidak ada data."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ✅ PAGINATION DENGAN BARIS PER HALAMAN */}
        {pagination && pagination.total > 0 && (
          <div className="flex justify-between items-center p-2 text-sm text-gray-600 border-t mt-4">
            <div className="flex items-center gap-2">
              <span>Baris per halaman:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => { 
                  setRowsPerPage(Number(e.target.value)); 
                  setCurrentPage(1); // Reset ke halaman 1 saat ganti rows per page
                }}
                className="px-2 py-1 bg-transparent focus:outline-none border rounded-md"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span>Menampilkan <strong>{pagination.from}-{pagination.to}</strong> dari <strong>{pagination.total}</strong></span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => p - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Sebelumnya
              </button>
              <span>Hal {pagination.current_page} dari {pagination.last_page}</span>
              <button
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={currentPage === pagination.last_page}
                className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                Berikutnya
              </button>
            </div>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {isModalOpen && <SiswaDetailModal siswa={selectedSiswa} onClose={closeModal} loading={loadingDetail} />}
      </AnimatePresence>
    </>
  );
};

export default Siswa;