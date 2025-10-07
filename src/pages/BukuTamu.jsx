import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom"; // 1. Import Link
import { Search, PlusCircle, Camera, Eye } from "lucide-react";
import { motion } from "framer-motion";

// Impor komponen reusable
import Modal from "../components/Modal";

import axios from "axios";
const API_URL = "http://localhost:8000/api/bukutamu";
const IMG_URL = "http://localhost:8000/uploads/foto_tamu/";

// --- TAMBAHAN BARU: Komponen Ikon WhatsApp ---
const IconWhatsApp = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    viewBox="0 0 16 16"
    {...props}
  >
    <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
  </svg>
);

// Komponen kecil untuk menampilkan item detail di dalam modal
const DetailItem = ({ label, value, fullWidth = false }) => (
  <div className={fullWidth ? "md:col-span-2" : ""}>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-semibold text-gray-800 break-words">{value || "-"}</p>
  </div>
);

const LoadingTable = ({ rowCount }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full w-full table-auto animate-pulse">
      <thead className="bg-gray-800 text-white text-center">
        <tr>
          <th className="px-3 py-3 w-12 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
            No
          </th>
          <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
            Nama Tamu
          </th>
          <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
            Role
          </th>
          <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
            Nama Siswa
          </th>
          <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
            Bertemu Dengan
          </th>
          <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
            Keperluan
          </th>
          <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
            Foto
          </th>
          <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
            Tanggal Kunjungan
          </th>
          <th className="px-3 py-3 w-24 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
            Aksi
          </th>
        </tr>
      </thead>
      <tbody>
        {[...Array(rowCount)].map((_, index) => (
          <tr key={index} className="border-b border-gray-200">
            <td className="px-3 py-3">
              <div className="h-4 bg-gray-200 rounded"></div>
            </td>
            <td className="px-3 py-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </td>
            <td className="px-3 py-3">
              <div className="h-4 bg-gray-200 rounded"></div>
            </td>
            <td className="px-3 py-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </td>
            <td className="px-3 py-3">
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </td>
            <td className="px-3 py-3">
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </td>
            <td className="px-3 py-3">
              <div className="w-16 h-16 bg-gray-200 rounded-md mx-auto"></div>
            </td>
            <td className="px-3 py-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </td>
            <td className="px-3 py-3">
              <div className="h-4 bg-gray-200 rounded"></div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const BukuTamu = () => {
  const [bukuTamu, setBukuTamu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [modalState, setModalState] = useState({ type: null, data: null });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchBukuTamu = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL); // sesuaikan URL API kamu
      const data = response.data.data;

      // tambahkan nomor urut otomatis
      const dataWithNo = data.map((item, index) => ({
        ...item,
        no: page * rowsPerPage + index + 1,
      }));

      setBukuTamu(dataWithNo);
    } catch (error) {
      console.error("Gagal mengambil data buku tamu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBukuTamu();
  }, []);

  const filteredItems = useMemo(() => {
    return bukuTamu.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(filterText.toLowerCase())
    );
  }, [bukuTamu, filterText]);

  const paginatedItems = filteredItems.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const totalPages = Math.ceil(filteredItems.length / rowsPerPage);

  const closeModal = () => setModalState({ type: null, data: null });

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  // --- TAMBAHAN BARU: Fungsi untuk format nomor HP ke format wa.me ---
  const formatPhoneNumber = (phone) => {
    if (!phone) return "";
    let cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("0")) {
      cleaned = "62" + cleaned.substring(1);
    }
    return cleaned;
  };

  return (
    <>
      <motion.div
        className="bg-white shadow-xl rounded-2xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-800">
            Manajemen Buku Tamu
          </h1>
          <p className="text-gray-500 mt-1">
            Kelola dan lihat daftar kunjungan tamu di halaman ini.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari tamu..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="pl-11 pr-4 py-2.5 border border-gray-300 rounded-lg w-full bg-gray-50 focus:ring-2 focus:ring-sky-500 outline-none transition"
            />
          </div>
          {/* 3. Tombol diubah menjadi Link */}
          <Link
            to="/tambah-kunjungan"
            className="bg-sky-600 text-white px-5 py-2.5 rounded-lg hover:bg-sky-700 transition-all duration-300 flex items-center justify-center shadow-lg shadow-sky-200 hover:shadow-xl w-full md:w-auto"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            <span>Tambah Kunjungan</span>
          </Link>
        </div>

        {loading ? (
          <LoadingTable rowCount={rowsPerPage} />
        ) : (
          <div className="overflow-x-auto text-sm">
            <table className="min-w-full w-full table-auto border-collapse">
              <thead className="bg-gray-800 text-white text-center">
                {/* 5. Kolom tabel dikembalikan seperti semula */}
                <tr>
                  <th className="px-3 py-3 w-12 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider text-left">
                    Nama Tamu
                  </th>
                  <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider text-left">
                    Nama Siswa
                  </th>
                  <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider text-left">
                    Bertemu Dengan
                  </th>
                  <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider text-left">
                    Keperluan
                  </th>
                  <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
                    Foto
                  </th>
                  <th className="px-3 py-3 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-3 py-3 w-24 border-[0.5px] border-gray-600 text-xs font-medium uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedItems.map((tamu, index) => (
                  <tr key={tamu.id} className="hover:bg-gray-50 text-gray-700">
                    <td className="px-3 py-3 whitespace-nowrap text-center">
                      {page * rowsPerPage + index + 1}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap font-medium text-gray-900">
                      {tamu.nama}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-center">
                      {tamu.role === "ortu" ? "Orang Tua" : "Tamu Umum"}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-left">
                      {tamu.siswa?.namasiswa || "-"}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-left">
                      {tamu.pegawai?.nama_pegawai} ({tamu.jabatan?.nama_jabatan}
                      )
                    </td>
                    <td className="px-3 py-3 whitespace-normal max-w-xs">
                      {tamu.keperluan}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-center">
                      {tamu.foto_tamu ? (
                        <img
                          //   src={`https://placehold.co/80x80/E0E7FF/4338CA?text=Foto`}
                          src={`${IMG_URL}${tamu.foto_tamu}`}
                          alt="Foto Tamu"
                          className="w-16 h-16 object-cover rounded-md shadow-sm mx-auto"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center mx-auto">
                          <Camera size={24} className="text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-center">
                      {formatDate(tamu.created_at)}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-center">
                      {/* 4. Tombol aksi menjadi Detail */}
                      <button
                        onClick={() =>
                          setModalState({ type: "detail", data: tamu })
                        }
                        className="bg-sky-100 text-sky-800 font-semibold p-2 rounded-lg hover:bg-sky-200 transition flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Show Detail</span>
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
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(0);
              }}
              className="px-2 py-1 bg-transparent focus:outline-none border rounded-md"
            >
              <option value={5}>5</option> <option value={10}>10</option>{" "}
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
            <span>
              Hal {page + 1} dari {totalPages}
            </span>
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

      {/* --- MODAL DETAIL DATA --- */}
      <Modal
        isOpen={modalState.type === "detail"}
        onClose={closeModal}
        title={`Detail Kunjungan: ${modalState.data?.nama}`}
      >
        {modalState.data && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b">
              {modalState.data.foto_tamu ? (
                <img
                //   src={`https://placehold.co/100x100/E0E7FF/4338CA?text=Foto`}
                  src={`${IMG_URL}${modalState.data.foto_tamu}`}
                  alt="Foto Tamu"
                  className="w-24 h-24 object-cover rounded-full shadow-md"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                  <Camera size={40} className="text-gray-400" />
                </div>
              )}
              <div className="text-center sm:text-left">
                <h3 className="text-2xl font-bold text-gray-900">
                  {modalState.data.nama}
                </h3>
                <p className="text-gray-500 capitalize">
                  {modalState.data.role === "ortu"
                    ? `Orang Tua dari ${modalState.data.siswa?.namasiswa}`
                    : modalState.data.instansi}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div className="flex flex-col gap-2">
                <DetailItem label="Kontak" value={modalState.data.kontak} />
                <a
                  href={`https://wa.me/${formatPhoneNumber(
                    modalState.data.kontak
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500 text-white px-3 py-3 rounded-md hover:bg-green-600 transition-all duration-300 mt-2 text-xs shadow-md"
                >
                  <IconWhatsApp />
                  Chat WhatsApp
                </a>
              </div>

              {/* <DetailItem label="Kontak" value={modalState.data.kontak} /> */}
              <DetailItem label="Alamat" value={modalState.data.alamat} />
              <DetailItem
                label="Bertemu Dengan"
                value={`${modalState.data.pegawai?.nama_pegawai} (${modalState.data.jabatan?.nama_jabatan})`}
              />
              <DetailItem
                label="Tanggal Kunjungan"
                value={formatDate(modalState.data.created_at)}
              />
              <DetailItem
                label="Keperluan"
                value={modalState.data.keperluan}
                fullWidth={true}
              />
            </div>
            <div className="flex justify-end pt-4">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default BukuTamu;
