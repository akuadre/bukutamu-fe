// src/components/GeneralGuestForm.jsx
import React from 'react';
import { User, Phone, Building, MapPin, Briefcase, MessageSquare } from 'lucide-react';
import { InputField, SelectField } from './InputField';
import WebcamCapture from './WebcamCapture';

// Data dummy untuk dropdown
const positionOptions = [
  { value: '1', label: 'Kepala Sekolah' },
  { value: '2', label: 'Humas' },
];
const employeeOptions = [
  { value: '1', label: 'Drs. H. Asep Suryana, M.Pd.' },
  { value: '2', label: 'Jajang, S.Kom.' },
];

const GeneralGuestForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Logika submit form di sini
    console.log('Form Tamu Umum Submitted');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <WebcamCapture onCapture={(image) => console.log(image)} />
      <div className="grid md:grid-cols-2 gap-6">
        <InputField label="Nama Lengkap" id="guestName" icon={User} placeholder="Nama lengkap Anda" />
        <InputField label="Nomor Handphone" id="guestContact" icon={Phone} placeholder="08..." />
        <InputField label="Asal Instansi" id="guestCompany" icon={Building} placeholder="Nama instansi" />
        <InputField label="Alamat Instansi" id="guestAddress" icon={MapPin} placeholder="Alamat instansi" />
        <SelectField label="Bertemu Dengan (Jabatan)" icon={Briefcase} options={positionOptions} />
        <SelectField label="Nama Pegawai / Guru" icon={User} options={employeeOptions} />
      </div>
      <InputField label="Keperluan" id="guestPurpose" icon={MessageSquare} type="textarea" placeholder="Tuliskan keperluan Anda..." />
      <div className="flex gap-4 justify-end pt-4">
        <button type="button" className="w-full md:w-auto text-center bg-slate-200 text-slate-700 font-semibold py-3 px-8 rounded-lg transition transform hover:scale-105">Kembali</button>
        <button type="submit" className="w-full md:w-auto bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-semibold py-3 px-8 rounded-lg shadow-lg shadow-sky-500/30 transition transform hover:scale-105">Kirim Data</button>
      </div>
    </form>
  );
};

export default GeneralGuestForm;