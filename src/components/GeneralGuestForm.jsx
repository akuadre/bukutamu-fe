// src/components/GeneralGuestForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // TAMBAHKAN INI
import {
  User,
  Phone,
  Building,
  MapPin,
  Briefcase,
  MessageSquare,
} from "lucide-react";
import { InputField, SelectField } from "./InputField";
import WebcamCapture from "./WebcamCapture";
import axios from "axios";

const API_URL = "http://localhost:8000/api";

const GeneralGuestForm = () => {
  const navigate = useNavigate(); // TAMBAHKAN INI

  const [formData, setFormData] = useState({
    nama: "",
    instansi: "",
    kontak: "",
    alamat: "",
    id_jabatan: "",
    id_pegawai: "",
    keperluan: "",
    foto_tamu: "",
  });

  const [formOptions, setFormOptions] = useState({
    jabatan: [],
    pegawai: [],
  });

  const [pegawaiOptions, setPegawaiOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load form data dari API
  useEffect(() => {
    const loadFormData = async () => {
      try {
        const response = await axios.get(`${API_URL}/guestbook/data`);
        if (response.data.success) {
          setFormOptions({
            jabatan: response.data.data.jabatan.map((j) => ({
              value: j.id,
              label: j.nama_jabatan,
            })),
            pegawai: response.data.data.pegawai.map((p) => ({
              value: p.id,
              label: p.nama_pegawai,
            })),
          });
        }
      } catch (error) {
        console.error("Gagal memuat data form:", error);
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
        role: "umum",
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
          instansi: "",
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
        <InputField
          label="Nama Lengkap"
          id="guestName"
          icon={User}
          placeholder="Nama lengkap Anda"
          name="nama"
          value={formData.nama}
          onChange={handleInputChange}
          required
        />

        <InputField
          label="Nomor Handphone"
          id="guestContact"
          icon={Phone}
          placeholder="08..."
          name="kontak"
          value={formData.kontak}
          onChange={handleInputChange}
          required
        />

        <InputField
          label="Asal Instansi"
          id="guestCompany"
          icon={Building}
          placeholder="Nama instansi"
          name="instansi"
          value={formData.instansi}
          onChange={handleInputChange}
          required
        />

        <InputField
          label="Alamat Instansi"
          id="guestAddress"
          icon={MapPin}
          type="textarea"
          placeholder="Alamat instansi"
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
        id="guestPurpose"
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

export default GeneralGuestForm;
