// src/components/ParentForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'; // TAMBAHKAN INI
import {
  User,
  Phone,
  MapPin,
  Briefcase,
  UserCheck,
  MessageSquare,
} from "lucide-react";
import { InputField, SelectField } from "./InputField";
import WebcamCapture from "./WebcamCapture";
import axios from "axios";

const API_URL = "http://localhost:8000/api";

const ParentForm = () => {
  const navigate = useNavigate(); // TAMBAHKAN INI

  const [formData, setFormData] = useState({
    nama: "",
    idsiswa: "",
    kontak: "",
    alamat: "",
    id_jabatan: "",
    id_pegawai: "",
    keperluan: "",
    foto_tamu: "",
  });

  const [formOptions, setFormOptions] = useState({
    siswa: [],
    jabatan: [],
    pegawai: [],
  });

  const [pegawaiOptions, setPegawaiOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load form data dari API - DENGAN FALLBACK
  useEffect(() => {
    const loadFormData = async () => {
      try {
        const response = await axios.get(`${API_URL}/guestbook/data`);
        if (response.data.success) {
          const { siswa, jabatan, pegawai } = response.data.data;
          
          console.log("Jabatan data structure:", jabatan); // DEBUG
          
          // VALIDASI: Pastikan data jabatan ada dan format benar
          const validatedJabatan = Array.isArray(jabatan) 
            ? jabatan.map((j) => ({
                value: j.id || j.idjabatan || j.value, // Multiple fallback
                label: j.nama_jabatan || j.jabatan || j.label || 'Unknown' // Multiple fallback
              }))
            : [];

          console.log("Validated jabatan options:", validatedJabatan); // DEBUG

          setFormOptions({
            siswa: Array.isArray(siswa) ? siswa.map((s) => ({
              value: s.idsiswa,
              label: s.namasiswa,
            })) : [],
            jabatan: validatedJabatan,
            pegawai: Array.isArray(pegawai) ? pegawai.map((p) => ({
              value: p.id,
              label: p.nama_pegawai,
            })) : [],
          });
        }
      } catch (error) {
        console.error("Gagal memuat data form:", error);
        // Set default empty arrays jika error
        setFormOptions({
          siswa: [],
          jabatan: [],
          pegawai: [],
        });
      }
    };

    loadFormData();
  }, []);

  // Load pegawai ketika jabatan berubah
  useEffect(() => {
    if (formData.id_jabatan) {
      const loadPegawai = async () => {
        try {
          const response = await axios.get(
            `${API_URL}/get-pegawai/${formData.id_jabatan}`
          );
          if (response.data.success) {
            const pegawaiData = response.data.data.map((p) => ({
              value: p.id,
              label: p.nama_pegawai,
            }));
            setPegawaiOptions(pegawaiData);

            // Auto-select kepala sekolah jika jabatan = 1
            if (formData.id_jabatan == 1 && pegawaiData.length > 0) {
              setFormData((prev) => ({
                ...prev,
                id_pegawai: pegawaiData[0].value,
              }));
            }
          }
        } catch (error) {
          console.error("Gagal memuat data pegawai:", error);
        }
      };

      loadPegawai();
    } else {
      setPegawaiOptions([]);
    }
  }, [formData.id_jabatan]);

  // Load data orangtua ketika siswa berubah - DENGAN VALIDASI
  useEffect(() => {
    if (formData.idsiswa) {
      const loadOrangtua = async () => {
        try {
          console.log("Loading orangtua for siswa ID:", formData.idsiswa);
          const response = await axios.get(
            `${API_URL}/get-orangtua/${formData.idsiswa}`
          );
          console.log("Orangtua API Response:", response.data);

          if (response.data.success) {
            const { nama_ortu, kontak, alamat } = response.data.data;
            console.log("Raw data from API:", { nama_ortu, kontak, alamat });

            // VALIDASI: Hanya set nilai yang tidak kosong atau "-"
            const validatedData = {
              nama: !isEmptyValue(nama_ortu) ? nama_ortu : "",
              kontak: !isEmptyValue(kontak) ? kontak : "",
              alamat: !isEmptyValue(alamat) ? alamat : "",
            };

            console.log("Validated data:", validatedData);

            setFormData((prev) => ({
              ...prev,
              ...validatedData,
            }));
          } else {
            console.warn("API returned success: false");
            resetOrangtuaFields();
          }
        } catch (error) {
          console.error("Gagal memuat data orangtua:", error);
          console.error("Error details:", error.response?.data);
          resetOrangtuaFields();
        }
      };

      loadOrangtua();
    } else {
      // Reset jika siswa dipilih kosong
      resetOrangtuaFields();
    }
  }, [formData.idsiswa]);

  // Fungsi validasi untuk mengecek nilai kosong
  const isEmptyValue = (value) => {
    if (!value) return true;
    if (value.toString().trim() === "") return true;
    if (value.toString().trim() === "-") return true;
    if (value.toString().trim() === "null") return true;
    if (value.toString().trim() === "undefined") return true;
    return false;
  };

  // Fungsi untuk reset field orangtua
  const resetOrangtuaFields = () => {
    setFormData((prev) => ({
      ...prev,
      nama: "",
      kontak: "",
      alamat: "",
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, selectedOption) => {
    setFormData((prev) => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : "",
    }));
  };

  const handlePhotoCapture = (photoData) => {
    setFormData((prev) => ({ ...prev, foto_tamu: photoData }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        role: "ortu",
      };

      const response = await axios.post(
        `${API_URL}/guestbook/store`,
        submitData
      );

      if (response.data.success) {
        alert("✅ Data berhasil disimpan!");
        // Reset form
        setFormData({
          nama: "",
          idsiswa: "",
          kontak: "",
          alamat: "",
          id_jabatan: "",
          id_pegawai: "",
          keperluan: "",
          foto_tamu: "",
        });
        
        // REDIRECT KE ROUTE / SETELAH BERHASIL
        setTimeout(() => {
          navigate("/"); // INI YANG DITAMBAHKAN
        }, 1000); // Delay 1 detik agar user bisa baca alert
      } else {
        alert("❌ Gagal menyimpan data: " + response.data.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("❌ Terjadi kesalahan saat menyimpan data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <WebcamCapture onCapture={handlePhotoCapture} />

      <div className="grid md:grid-cols-2 gap-6">
        <SelectField
          label="Orang Tua dari Siswa"
          icon={UserCheck}
          options={formOptions.siswa}
          value={
            formOptions.siswa.find((opt) => opt.value === formData.idsiswa) ||
            null
          }
          onChange={(selected) => handleSelectChange("idsiswa", selected)}
          isSearchable={true}
          required
        />

        <InputField
          label="Nama Orang Tua"
          id="namaOrtu"
          icon={User}
          placeholder="Masukkan nama lengkap"
          name="nama"
          value={formData.nama}
          onChange={handleInputChange}
          required
        />

        <InputField
          label="Nomor Handphone"
          id="kontakOrtu"
          icon={Phone}
          placeholder="Contoh: 081234567890"
          name="kontak"
          value={formData.kontak}
          onChange={handleInputChange}
          required
        />

        <InputField
          label="Alamat"
          id="alamatOrtu"
          icon={MapPin}
          type="textarea"
          placeholder="Masukkan alamat lengkap"
          name="alamat"
          value={formData.alamat}
          onChange={handleInputChange}
          required
        />

        <SelectField
          label="Bertemu Dengan (Jabatan)"
          icon={Briefcase}
          options={formOptions.jabatan}
          value={
            formOptions.jabatan.find(
              (opt) => opt.value === formData.id_jabatan
            ) || null
          }
          onChange={(selected) => handleSelectChange("id_jabatan", selected)}
          isSearchable={true}
          required
        />

        <SelectField
          label="Nama Pegawai / Guru"
          icon={User}
          options={pegawaiOptions}
          value={
            pegawaiOptions.find((opt) => opt.value === formData.id_pegawai) ||
            null
          }
          onChange={(selected) => handleSelectChange("id_pegawai", selected)}
          isSearchable={true}
          isDisabled={formData.id_jabatan == 1}
          required
        />
      </div>

      <InputField
        label="Keperluan"
        id="keperluan"
        icon={MessageSquare}
        type="textarea"
        placeholder="Tuliskan keperluan Anda..."
        name="keperluan"
        value={formData.keperluan}
        onChange={handleInputChange}
        required
      />

      <div className="flex gap-4 justify-end pt-4">
        <button
          type="button"
          className="w-full md:w-auto text-center bg-slate-200 text-slate-700 font-semibold py-3 px-8 rounded-lg transition transform hover:scale-105"
          onClick={() => window.history.back()}
        >
          Kembali
        </button>
        <button
          type="submit"
          disabled={loading || !formData.foto_tamu}
          className="w-full md:w-auto bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-semibold py-3 px-8 rounded-lg shadow-lg shadow-sky-500/30 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Menyimpan..." : "Kirim Data"}
        </button>
      </div>
    </form>
  );
};

export default ParentForm;
