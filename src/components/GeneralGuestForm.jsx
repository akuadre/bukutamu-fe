import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, RefreshCw } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const GeneralGuestForm = () => {
  const [formData, setFormData] = useState({
    nama: '',
    instansi: '',
    kontak: '',
    alamat: '',
    id_jabatan: '',
    id_pegawai: '',
    keperluan: '',
    foto_tamu: ''
  });

  const [formOptions, setFormOptions] = useState({
    jabatan: [],
    pegawai: []
  });

  const [pegawaiOptions, setPegawaiOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState(null);
  const [photoTaken, setPhotoTaken] = useState(false);

  // Load form data
  useEffect(() => {
    const loadFormData = async () => {
      try {
        const response = await axios.get(`${API_URL}/guestbook/data`);
        if (response.data.success) {
          setFormOptions(response.data.data);
        }
      } catch (error) {
        console.error('Gagal memuat data form:', error);
      }
    };

    loadFormData();
  }, []);

  // Load pegawai when jabatan changes
  useEffect(() => {
    if (formData.id_jabatan) {
      const loadPegawai = async () => {
        try {
          const response = await axios.get(`${API_URL}/get-pegawai/${formData.id_jabatan}`);
          if (response.data.success) {
            setPegawaiOptions(response.data.data);
            
            // Auto-select kepala sekolah jika jabatan = 1
            if (formData.id_jabatan == 1 && response.data.data.length > 0) {
              setFormData(prev => ({
                ...prev,
                id_pegawai: response.data.data[0].id
              }));
            }
          }
        } catch (error) {
          console.error('Gagal memuat data pegawai:', error);
        }
      };

      loadPegawai();
    }
  }, [formData.id_jabatan]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Camera functions (same as ParentForm)
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 320, 
          height: 240,
          facingMode: 'user' 
        } 
      });
      setStream(mediaStream);
      setCameraActive(true);
      
      const video = document.getElementById('camera-preview-general');
      if (video) {
        video.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Tidak dapat mengakses kamera. Pastikan izin kamera sudah diberikan.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  };

  const takePhoto = () => {
    const video = document.getElementById('camera-preview-general');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Mirror effect
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    
    const photoData = canvas.toDataURL('image/jpeg', 0.9);
    setFormData(prev => ({ ...prev, foto_tamu: photoData }));
    setPhotoTaken(true);
    stopCamera();
  };

  const retakePhoto = () => {
    setFormData(prev => ({ ...prev, foto_tamu: '' }));
    setPhotoTaken(false);
    startCamera();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        role: 'umum'
      };

      const response = await axios.post(`${API_URL}/guestbook/store`, submitData);
      
      if (response.data.success) {
        alert('✅ Data berhasil disimpan!');
        // Reset form
        setFormData({
          nama: '',
          instansi: '',
          kontak: '',
          alamat: '',
          id_jabatan: '',
          id_pegawai: '',
          keperluan: '',
          foto_tamu: ''
        });
        setPhotoTaken(false);
      } else {
        alert('❌ Gagal menyimpan data: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('❌ Terjadi kesalahan saat menyimpan data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Camera Section */}
      <div className="bg-gray-50 rounded-xl p-6">
        <label className="block text-sm font-semibold text-gray-700 mb-4">📷 Ambil Foto</label>
        <div className="flex flex-col md:flex-row items-center gap-6">
          {!photoTaken ? (
            <>
              {cameraActive ? (
                <div className="relative">
                  <video 
                    id="camera-preview-general" 
                    autoPlay 
                    playsInline
                    className="w-64 h-48 rounded-lg border-2 border-blue-500 object-cover"
                  />
                  <div className="flex gap-2 mt-4">
                    <button
                      type="button"
                      onClick={takePhoto}
                      className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
                    >
                      Ambil Foto
                    </button>
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={startCamera}
                  className="w-64 h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-400 transition"
                >
                  <Camera size={48} />
                  <span className="mt-2">Aktifkan Kamera</span>
                </button>
              )}
            </>
          ) : (
            <div className="relative">
              <img 
                src={formData.foto_tamu} 
                alt="Foto tamu" 
                className="w-64 h-48 rounded-lg border-2 border-green-500 object-cover"
              />
              <button
                type="button"
                onClick={retakePhoto}
                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition"
              >
                <RefreshCw size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            👤 Nama Lengkap *
          </label>
          <input
            type="text"
            name="nama"
            value={formData.nama}
            onChange={handleInputChange}
            required
            placeholder="Masukkan nama lengkap"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🏢 Asal Instansi *
          </label>
          <input
            type="text"
            name="instansi"
            value={formData.instansi}
            onChange={handleInputChange}
            required
            placeholder="Nama instansi/perusahaan"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            📞 Nomor Handphone *
          </label>
          <input
            type="tel"
            name="kontak"
            value={formData.kontak}
            onChange={handleInputChange}
            required
            placeholder="Contoh: 081234567890"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🏠 Alamat Instansi *
          </label>
          <textarea
            name="alamat"
            value={formData.alamat}
            onChange={handleInputChange}
            required
            rows="3"
            placeholder="Alamat lengkap instansi"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            💼 Bertemu Dengan (Jabatan) *
          </label>
          <select
            name="id_jabatan"
            value={formData.id_jabatan}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          >
            <option value="">Pilih Jabatan</option>
            {formOptions.jabatan.map(jabatan => (
              <option key={jabatan.id} value={jabatan.id}>
                {jabatan.nama_jabatan}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            👨‍🏫 Nama Pegawai/Guru *
          </label>
          <select
            name="id_pegawai"
            value={formData.id_pegawai}
            onChange={handleInputChange}
            required
            disabled={formData.id_jabatan == 1}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          >
            <option value="">Pilih Pegawai</option>
            {pegawaiOptions.map(pegawai => (
              <option key={pegawai.id} value={pegawai.id}>
                {pegawai.nama_pegawai}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          📝 Keperluan *
        </label>
        <textarea
          name="keperluan"
          value={formData.keperluan}
          onChange={handleInputChange}
          required
          rows="4"
          placeholder="Jelaskan keperluan kunjungan"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-lg hover:bg-gray-600 transition font-semibold"
        >
          Kembali
        </button>
        <button
          type="submit"
          disabled={loading || !formData.foto_tamu}
          className="flex-1 bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 disabled:bg-green-300 transition font-semibold flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Menyimpan...
            </>
          ) : (
            'Kirim Data'
          )}
        </button>
      </div>
    </form>
  );
};

export default GeneralGuestForm;