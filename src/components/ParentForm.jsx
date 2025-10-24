// src/components-guestbook/ParentForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {
  User,
  Phone,
  MapPin,
  User as UserIcon,
  UserCheck,
  MessageSquare,
  BookOpen,
  Users
} from "lucide-react";
import { InputField, SelectField } from "./InputField";
import WebcamCapture from "./WebcamCapture";
import axios from "axios";

const API_URL = "http://localhost:8000/api";

const ParentForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nama: "",
    idsiswa: "",
    kontak: "",
    alamat: "",
    id_pegawai: "",
    keperluan: "",
    foto_tamu: "",
  });

  const [formOptions, setFormOptions] = useState({
    siswa: [],
    pegawai: [],
  });

  const [siswaData, setSiswaData] = useState({
    nis: "",
    nisn: "", 
    kelas: "-"
  });

  const [loading, setLoading] = useState(false);

  // Load form data dari API
  useEffect(() => {
    const loadFormData = async () => {
      try {
        const response = await axios.get(`${API_URL}/guestbook/data`);
        console.log('API Response:', response.data);
        
        if (response.data.success) {
          setFormOptions({
            siswa: Array.isArray(response.data.data.siswa) ? 
              response.data.data.siswa.map((s) => ({
                value: s.value || s.idsiswa,
                label: s.label || s.namasiswa,
                nis: s.nis,
                nisn: s.nisn,
                kelas: s.kelas
              })) : [],
            pegawai: Array.isArray(response.data.data.pegawai) ? 
              response.data.data.pegawai.map((p) => ({
                value: p.id,
                label: p.nama_pegawai,
              })) : [],
          });
        }
      } catch (error) {
        console.error("Gagal memuat data form:", error);
      }
    };

    loadFormData();
  }, []);

  // Load data siswa tambahan ketika siswa berubah (NIS, NISN, Kelas)
  useEffect(() => {
    if (formData.idsiswa) {
      // Set data siswa tambahan (NIS, NISN, Kelas)
      const selectedSiswa = formOptions.siswa.find(s => s.value == formData.idsiswa);
      console.log("Selected siswa:", selectedSiswa);
      
      if (selectedSiswa) {
        setSiswaData({
          nis: selectedSiswa.nis || "",
          nisn: selectedSiswa.nisn || "",
          kelas: selectedSiswa.kelas || "-"
        });
      }

      // Reset kontak dan alamat (tetap kosong)
      setFormData((prev) => ({
        ...prev,
        kontak: "", // Selalu dikosongkan
        alamat: "", // Selalu dikosongkan
        // NAMA TIDAK DIISI OTOMATIS - biarkan seperti yang sudah diisi user
      }));
    } else {
      // Reset semua data siswa jika tidak ada siswa yang dipilih
      setSiswaData({ nis: "", nisn: "", kelas: "-" });
      setFormData((prev) => ({
        ...prev,
        kontak: "",
        alamat: "",
      }));
    }
  }, [formData.idsiswa, formOptions.siswa]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, selectedOption) => {
    console.log(`Select ${name}:`, selectedOption);
    
    setFormData((prev) => ({
      ...prev,
      [name]: selectedOption ? selectedOption.value : "",
    }));

    // Jika yang dipilih adalah siswa, langsung set data siswa (NIS, NISN, Kelas)
    if (name === 'idsiswa' && selectedOption) {
      const selectedSiswa = formOptions.siswa.find(s => s.value == selectedOption.value);
      if (selectedSiswa) {
        setSiswaData({
          nis: selectedSiswa.nis || "",
          nisn: selectedSiswa.nisn || "",
          kelas: selectedSiswa.kelas || "-"
        });

        // Reset kontak dan alamat, tapi JANGAN reset nama
        setFormData((prev) => ({
          ...prev,
          kontak: "", // Reset kontak
          alamat: "", // Reset alamat
          // Nama tetap seperti yang sudah diisi user
        }));
      }
    }
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

      console.log('Submitting data:', submitData);

      const response = await axios.post(
        `${API_URL}/guestbook/store`,
        submitData
      );

      if (response.data.success) {
        alert("✅ Data berhasil disimpan!");
        setFormData({
          nama: "",
          idsiswa: "",
          kontak: "",
          alamat: "",
          id_pegawai: "",
          keperluan: "",
          foto_tamu: "",
        });
        setSiswaData({ nis: "", nisn: "", kelas: "-" });
        
        setTimeout(() => {
          navigate("/");
        }, 1000);
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
        {/* Dropdown Siswa */}
        <SelectField
          label="Orang Tua dari Siswa"
          icon={UserCheck}
          options={formOptions.siswa}
          value={
            formOptions.siswa.find((opt) => opt.value == formData.idsiswa) || null
          }
          onChange={(selected) => handleSelectChange("idsiswa", selected)}
          isSearchable={true}
          required
        />

        {/* Nama Orang Tua - TIDAK DIISI OTOMATIS */}
        <InputField
          label="Nama Orang Tua / Wali Yang Hadir"
          id="namaOrtu"
          icon={User}
          placeholder="Masukkan nama lengkap"
          name="nama"
          value={formData.nama}
          onChange={handleInputChange}
          required
        />

        {/* Display NIS dan NISN */}
        {(siswaData.nis || siswaData.nisn) && (
          <div className="md:col-span-2 grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                NIS
              </label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600" size={18} />
                <input
                  type="text"
                  value={siswaData.nis}
                  className="w-full pl-10 pr-4 py-2 border border-green-300 bg-green-50 rounded-lg text-green-700 font-medium"
                  readOnly
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                NISN
              </label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600" size={18} />
                <input
                  type="text"
                  value={siswaData.nisn}
                  className="w-full pl-10 pr-4 py-2 border border-green-300 bg-green-50 rounded-lg text-green-700 font-medium"
                  readOnly
                />
              </div>
            </div>
          </div>
        )}

        {/* Display Kelas Siswa */}
        <div className="md:col-span-2">
          <label className="block font-semibold text-slate-700 mb-1">
            Kelas
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600" size={18} />
            <input
              type="text"
              value={siswaData.kelas}
              className="w-full pl-10 pr-4 py-2 border border-blue-300 bg-blue-50 rounded-lg text-blue-700 font-medium"
              readOnly
            />
          </div>
        </div>

        {/* Field yang dikosongkan otomatis */}
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

        {/* Dropdown Pegawai */}
        <SelectField
          label="Bertemu Dengan"
          icon={UserIcon}
          options={formOptions.pegawai}
          value={
            formOptions.pegawai.find((opt) => opt.value == formData.id_pegawai) || null
          }
          onChange={(selected) => handleSelectChange("id_pegawai", selected)}
          isSearchable={true}
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