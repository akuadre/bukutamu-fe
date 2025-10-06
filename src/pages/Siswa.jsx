// Siswa.jsx
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Search, Edit, Trash2, PlusCircle, Loader, AlertTriangle, UploadCloud } from "lucide-react";
import { motion } from "framer-motion";

import Modal from "../components/Modal";
import Notification from "../components/Notification";
import FormInput from "../components/FormInput";

const API_URL = "http://localhost:8000/api";

const fallbackAgamas = [
  { idagama: 1, agama: "Islam" },
  { idagama: 2, agama: "Kristen" },
  { idagama: 3, agama: "Katolik" },
  { idagama: 4, agama: "Hindu" },
  { idagama: 5, agama: "Budha" },
];

const fallbackThn = [
  { idthnajaran: 1, thnajaran: "2021/2022" },
  { idthnajaran: 2, thnajaran: "2022/2023" },
  { idthnajaran: 3, thnajaran: "2023/2024" },
];

const Siswa = () => {
  const [siswa, setSiswa] = useState([]);
  const [agamas, setAgamas] = useState([]);
  const [tahunAjarans, setTahunAjarans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [modalState, setModalState] = useState({ type: null, data: null }); // type: add, edit, delete
  const [notification, setNotification] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const showNotif = (type, text) => {
    setNotification({ type, text });
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [siswaRes, agamaRes, thnRes] = await Promise.all([
        axios.get(`${API_URL}/siswa`).catch(() => null),
        axios.get(`${API_URL}/agama`).catch(() => null),
        axios.get(`${API_URL}/thnajaran`).catch(() => null),
      ]);

      // siswa
      if (siswaRes && (siswaRes.data?.success || Array.isArray(siswaRes.data))) {
        // some APIs return { success: true, data: [...] } or just [...]
        const data = siswaRes.data?.data ?? siswaRes.data;
        setSiswa(Array.isArray(data) ? data : []);
      } else {
        setSiswa([]); // no data or error
        if (!siswaRes) showNotif("error", "Tidak dapat terhubung ke endpoint /siswa");
      }

      // agama
      if (agamaRes && (agamaRes.data?.success || Array.isArray(agamaRes.data))) {
        const data = agamaRes.data?.data ?? agamaRes.data;
        setAgamas(Array.isArray(data) ? data : fallbackAgamas);
      } else {
        setAgamas(fallbackAgamas);
      }

      // tahun ajaran
      if (thnRes && (thnRes.data?.success || Array.isArray(thnRes.data))) {
        const data = thnRes.data?.data ?? thnRes.data;
        setTahunAjarans(Array.isArray(data) ? data : fallbackThn);
      } else {
        setTahunAjarans(fallbackThn);
      }
    } catch (err) {
      console.error("fetchData error:", err);
      showNotif("error", "Gagal mengambil data dari server.");
      setAgamas(fallbackAgamas);
      setTahunAjarans(fallbackThn);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filtering & pagination
  const filteredItems = useMemo(() => {
    return siswa.filter((item) => JSON.stringify(item).toLowerCase().includes(filterText.toLowerCase()));
  }, [siswa, filterText]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / rowsPerPage));
  // ensure page in bounds if rowsPerPage changed
  useEffect(() => {
    if (page > totalPages - 1) setPage(totalPages - 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowsPerPage, filteredItems.length, totalPages]);

  const paginatedItems = filteredItems.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const closeModal = () => setModalState({ type: null, data: null });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target);
    const actionType = modalState.type; // 'add' or 'edit'
    const siswaId = modalState.data?.idsiswa;

    try {
      let response;
      if (actionType === "add") {
        response = await axios.post(`${API_URL}/siswa`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // edit
        // Some APIs use PUT/PATCH — your code used POST to edit, so we keep POST for compatibility.
        response = await axios.post(`${API_URL}/siswa/${siswaId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      const success = response?.data?.success ?? (response?.status >= 200 && response?.status < 300);
      const message = response?.data?.message ?? (actionType === "add" ? "Berhasil menambahkan." : "Berhasil memperbarui.");

      if (success) {
        showNotif("success", message);
        await fetchData();
        closeModal();
      } else {
        showNotif("error", message || "Operasi gagal.");
      }
    } catch (error) {
      console.error("handleFormSubmit error:", error.response ?? error);
      const errorMsg = error.response?.data?.message || `Gagal ${actionType === "add" ? "menambahkan" : "memperbarui"} data.`;
      showNotif("error", errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    setIsSubmitting(true);
    const siswaToDelete = modalState.data;
    try {
      const response = await axios.delete(`${API_URL}/siswa/${siswaToDelete.idsiswa}`);
      const success = response?.data?.success ?? (response?.status >= 200 && response?.status < 300);
      if (success) {
        showNotif("success", `Data ${siswaToDelete.namasiswa} berhasil dihapus.`);
        await fetchData();
        closeModal();
      } else {
        showNotif("error", response?.data?.message || "Gagal menghapus data.");
      }
    } catch (error) {
      console.error("confirmDelete error:", error);
      showNotif("error", "Gagal menghapus data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reusable Form Fields (ke mirror desainmu)
  const SiswaFormFields = ({ defaultData = {} }) => (
    <>
      <FormInput label="NIS" id="nis" name="nis" defaultValue={defaultData.nis || ""} required />
      <FormInput label="NISN" id="nisn" name="nisn" defaultValue={defaultData.nisn || ""} required />
      <div className="md:col-span-2">
        <FormInput label="Nama Lengkap" id="namasiswa" name="namasiswa" defaultValue={defaultData.namasiswa || ""} required />
      </div>
      <FormInput label="Tempat Lahir" id="tempatlahir" name="tempatlahir" defaultValue={defaultData.tempatlahir || ""} required />
      <FormInput label="Tanggal Lahir" id="tgllahir" name="tgllahir" type="date" defaultValue={defaultData.tgllahir ? defaultData.tgllahir.split("T")[0] : ""} required />
      <div className="flex flex-col">
        <label htmlFor="jk" className="mb-1 text-sm font-medium text-gray-700">Jenis Kelamin</label>
        <select id="jk" name="jk" defaultValue={defaultData.jk || "L"} required className="form-input">
          <option value="L">Laki-laki</option>
          <option value="P">Perempuan</option>
        </select>
      </div>
      <div className="flex flex-col">
        <label htmlFor="idagama" className="mb-1 text-sm font-medium text-gray-700">Agama</label>
        <select id="idagama" name="idagama" defaultValue={defaultData.idagama ?? defaultData.agama?.idagama ?? (agamas[0]?.idagama ?? "")} required className="form-input">
          {agamas.map((a) => (
            <option key={a.idagama} value={a.idagama}>{a.agama}</option>
          ))}
        </select>
      </div>
      <div className="md:col-span-2">
        <FormInput label="Alamat" id="alamat" name="alamat" defaultValue={defaultData.alamat || ""} required />
      </div>
      <FormInput label="Kontak (HP)" id="kontak" name="kontak" defaultValue={defaultData.kontak || ""} required />
      <div className="flex flex-col">
        <label htmlFor="idthnmasuk" className="mb-1 text-sm font-medium text-gray-700">Tahun Masuk</label>
        <select id="idthnmasuk" name="idthnmasuk" defaultValue={defaultData.idthnmasuk ?? defaultData.thnajaran?.idthnajaran ?? (tahunAjarans[0]?.idthnajaran ?? "")} required className="form-input">
          {tahunAjarans.map((t) => (
            <option key={t.idthnajaran} value={t.idthnajaran}>{t.thnajaran}</option>
          ))}
        </select>
      </div>
      <div className="md:col-span-2">
        <label htmlFor="photosiswa" className="mb-1 text-sm font-medium text-gray-700">Foto Siswa (Opsional)</label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label htmlFor="photosiswa" className="relative cursor-pointer bg-white rounded-md font-medium text-sky-600 hover:text-sky-500 focus-within:outline-none">
                <span>Upload file</span>
                <input id="photosiswa" name="photosiswa" type="file" className="sr-only" accept="image/*" />
              </label>
              <p className="pl-1">atau drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF hingga 2MB</p>
          </div>
        </div>
      </div>
    </>
  );

  // Loading skeleton table (versi kamu)
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
      <style>{`.form-input { padding: 0.5rem 0.75rem; border: 1px solid #D1D5DB; border-radius: 0.5rem; width: 100%; background-color: #F9FAFB; transition: all 0.2s; } .form-input:focus { outline: 2px solid transparent; outline-offset: 2px; border-color: #38BDF8; box-shadow: 0 0 0 2px #38BDF8; }`}</style>

      <Notification notification={notification} onDismiss={() => setNotification(null)} />

      <motion.div
        className="bg-white shadow-xl rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <div className="mb-6 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-800">Manajemen Data Siswa</h1>
          <p className="text-gray-500 mt-1">Kelola daftar siswa melalui API Laravel.</p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari siswa..."
              value={filterText}
              onChange={(e) => { setFilterText(e.target.value); setPage(0); }}
              className="pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-sky-500 outline-none transition"
            />
          </div>
          <button
            onClick={() => setModalState({ type: "add", data: null })}
            className="bg-sky-600 text-white px-5 py-2.5 rounded-lg hover:bg-sky-700 transition-all duration-300 flex items-center justify-center shadow-lg shadow-sky-200 hover:shadow-xl w-full md:w-auto"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            <span>Tambah Siswa</span>
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
                    <td className="px-3 py-3 whitespace-nowrap">{s.tempatlahir}, {s.tgllahir ? new Date(s.tgllahir).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : ''}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-center">{s.jk}</td>
                    <td className="px-3 py-3 whitespace-nowrap">{s.alamat}</td>
                    <td className="px-3 py-3 whitespace-nowrap">{s.agama?.agama ?? s.agama}</td>
                    <td className="px-3 py-3 whitespace-nowrap">{s.kontak}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-center">{s.thnajaran?.thnajaran ?? s.tahun_ajaran_masuk?.thnajaran}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-center space-x-2">
                      <button
                        onClick={() => setModalState({ type: "edit", data: s })}
                        className="bg-amber-100 text-amber-800 font-semibold p-2 rounded-lg hover:bg-amber-200 transition"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setModalState({ type: "delete", data: s })}
                        className="bg-red-100 text-red-800 font-semibold p-2 rounded-lg hover:bg-red-200 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {paginatedItems.length === 0 && (
                  <tr>
                    <td colSpan={11} className="text-center py-6 text-gray-500">Tidak ada data.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-between items-center p-2 text-sm text-gray-600 border-t mt-4">
          <div className="flex items-center gap-2">
            <span>Baris per halaman:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(0); }}
              className="px-2 py-1 bg-transparent focus:outline-none border rounded-md"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
              disabled={page === 0}
              className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Sebelumnya
            </button>
            <span>Hal {page + 1} dari {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1 border rounded-md hover:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              Berikutnya
            </button>
          </div>
        </div>
      </motion.div>

      {/* MODAL ADD / EDIT */}
      <Modal isOpen={modalState.type === "add" || modalState.type === "edit"} onClose={closeModal} title={modalState.type === "add" ? "Tambah Siswa Baru" : `Edit: ${modalState.data?.namasiswa || ""}`}>
        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <SiswaFormFields defaultData={modalState.data || {}} />
          <div className="md:col-span-2 flex justify-end gap-3 pt-4">
            <button type="button" onClick={closeModal} className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">Batal</button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:bg-sky-300 flex items-center gap-2">
              {isSubmitting && <Loader className="animate-spin w-4 h-4" />}
              {isSubmitting ? (modalState.type === "add" ? "Menyimpan..." : "Memperbarui...") : "Simpan"}
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL DELETE */}
      <Modal isOpen={modalState.type === "delete"} onClose={closeModal} title="Konfirmasi Hapus">
        {modalState.data && (
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 mx-auto text-red-500 mb-4" />
            <p className="text-gray-600 text-lg mb-6">
              Yakin ingin menghapus data siswa <br />
              <span className="font-bold text-gray-900">{modalState.data.namasiswa}</span>?
            </p>
            <div className="flex justify-center gap-4 mt-8">
              <button onClick={closeModal} disabled={isSubmitting} className="px-8 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition">Batal</button>
              <button onClick={confirmDelete} disabled={isSubmitting} className="px-8 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-300 flex items-center gap-2">
                {isSubmitting && <Loader className="animate-spin w-4 h-4" />}
                {isSubmitting ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default Siswa;
