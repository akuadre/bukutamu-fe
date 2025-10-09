// src/components/ParentForm.jsx
import React from 'react';
import { User, Phone, MapPin, Briefcase, UserCheck, MessageSquare } from 'lucide-react';
import { InputField, SelectField } from './InputField';
import WebcamCapture from './WebcamCapture';

// Data dummy untuk dropdown, nanti diganti dengan data dari API
const studentOptions = [
  { value: '1', label: 'Ahmad Subarjo' },
  { value: '2', label: 'Budi Santoso' },
];
const positionOptions = [
  { value: '1', label: 'Kepala Sekolah' },
  { value: '2', label: 'Wakasek Kesiswaan' },
];
const employeeOptions = [
  { value: '1', label: 'Drs. H. Asep Suryana, M.Pd.' },
  { value: '2', label: 'Siti Nurhaliza, S.Pd.' },
];


const ParentForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Logika submit form di sini
    console.log('Form Orang Tua Submitted');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <WebcamCapture onCapture={(image) => console.log(image)} />
      <div className="grid md:grid-cols-2 gap-6">
        <SelectField label="Orang Tua dari Siswa" icon={UserCheck} options={studentOptions} />
        <InputField label="Nama Orang Tua" id="parentName" icon={User} placeholder="Nama lengkap Anda" />
        <InputField label="Nomor Handphone" id="parentContact" icon={Phone} placeholder="08..." />
        <InputField label="Alamat" id="parentAddress" icon={MapPin} placeholder="Alamat lengkap" />
        <SelectField label="Bertemu Dengan (Jabatan)" icon={Briefcase} options={positionOptions} />
        <SelectField label="Nama Pegawai / Guru" icon={User} options={employeeOptions} />
      </div>
      <InputField label="Keperluan" id="parentPurpose" icon={MessageSquare} type="textarea" placeholder="Tuliskan keperluan Anda..." />
      <div className="flex gap-4 justify-end pt-4">
        <button type="button" className="w-full md:w-auto text-center bg-slate-200 text-slate-700 font-semibold py-3 px-8 rounded-lg transition transform hover:scale-105">Kembali</button>
        <button type="submit" className="w-full md:w-auto bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-semibold py-3 px-8 rounded-lg shadow-lg shadow-sky-500/30 transition transform hover:scale-105">Kirim Data</button>
      </div>
    </form>
  );
};

export default ParentForm;