import React from 'react';
import { ExternalLink } from 'lucide-react';

// Taruh gambar ikon di folder `public/gambar/`
const appLogo = '/gambar/icon2.png';

// Komponen Card untuk reusable
const InfoCard = ({ name, website, linkColorClass }) => (
    <div className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <h3 className={`text-xl font-semibold ${linkColorClass || 'text-gray-800'}`}>{name}</h3>
        <a 
            href={`https://${website}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 transition-colors inline-flex items-center group mt-1"
        >
            <span>{website}</span>
            <ExternalLink className="h-4 w-4 ml-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>
    </div>
);

const About = () => {
    return (
        <div className="bg-white shadow-lg rounded-lg p-6 md:p-8">
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    {/* Logo Aplikasi */}
                    <div className="flex justify-center mb-6">
                        <img 
                            src={appLogo} 
                            alt="App Logo" 
                            className="rounded-full h-40 w-40 object-cover shadow-lg border-4 border-white ring-4 ring-blue-500"
                        />
                    </div>
                    
                    {/* Judul */}
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                        Tentang Aplikasi School Guestbook
                    </h1>
                    <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
                        Sebuah sistem modern untuk manajemen data sekolah yang efisien dan terintegrasi.
                    </p>
                </div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10 text-center">
                    {/* Pembimbing */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800">Pembimbing</h2>
                        <InfoCard 
                            name="Agus Suratna Permadi, S.Pd."
                            website="agussuratna.net"
                            linkColorClass="text-blue-700"
                        />
                    </div>

                    {/* Pengembang */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-800">Dikembangkan oleh</h2>
                        <div className="space-y-4">
                           <InfoCard 
                                name="Adrenalin Muhammad Dewangga"
                                website="adre.my.id"
                                linkColorClass="text-sky-600"
                            />
                            <InfoCard 
                                name="Evliya Satari Nurarifah"
                                website="evliya.my.id"
                                linkColorClass="text-pink-600"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-16 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} School Guestbook. All rights reserved.</p>
                    <p className="mt-1">Dibuat dengan ❤️ di Cimahi, Indonesia.</p>
                </div>
            </div>
        </div>
    );
};

export default About;
