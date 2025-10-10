import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink } from 'react-router-dom';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';

// Ikon dari Lucide React
import { 
  Menu, 
  X, 
  ArrowUp, 
  Keyboard, 
  BarChart2, 
  Database, 
  Calendar, 
  Instagram, 
  Mail, 
  Github 
} from 'lucide-react';

// Aset gambar (pastikan path-nya benar di proyek React-mu)
import logoSekolah from '/gambar/iconsekolah.png';
import logoGuestbook from '/gambar/icon2.png';
import adreImage from '/gambar/people/adre.png';
import evliyaImage from '/gambar/people/evliya.jpg';


const LandingPage = () => {
  // State untuk Navbar
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // State untuk Tombol Scroll-to-Top
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // State untuk data berita dari API
  const [posts, setPosts] = useState([]);
  const [newsError, setNewsError] = useState(null);

  // --- LOGIKA & EFEK ---

  // Efek untuk handle scroll (mengubah navbar & tombol scroll-to-top)
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
      setShowScrollTop(scrollPosition > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Efek untuk mengambil data berita dari API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('https://www.smkn1-cmi.sch.id/wp-json/wp/v2/posts?per_page=10&_embed&orderby=date&order=desc');
        const postsWithImages = response.data.filter(post => 
          post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0].source_url
        );
        setPosts(postsWithImages);
      } catch (err) {
        setNewsError('Gagal mengambil data berita.');
        console.error(err);
      }
    };
    fetchPosts();
  }, []);

  // --- DATA UNTUK RENDER ---
  const navItems = [
    { name: 'Beranda', to: 'beranda' },
    { name: 'Fitur', to: 'fitur' },
    { name: 'Tentang', to: 'tentang' },
    { name: 'Kontak', to: 'kontak' },
  ];

  const features = [
    { icon: Keyboard, title: "Input Otomatis", desc: "Nama orang tua siswa terisi otomatis setelah memilih nama siswa, mempercepat proses pengisian data tamu." },
    { icon: BarChart2, title: "Rekap Kunjungan", desc: "Semua data tamu tersimpan rapi dalam sistem, memudahkan sekolah untuk melihat riwayat kunjungan kapan saja." },
    { icon: Database, title: "Pengelolaan Data", desc: "Fitur pengelolaan data penting seperti pegawai, jabatan, dan siswa, agar sistem tetap terorganisir." },
  ];

  const contacts = [
    {
      name: 'Adrenalin M.D.',
      role: 'Fullstack Web Developer',
      quote: '"Engineer by logic, artist by code."',
      image: adreImage,
      social: {
        instagram: 'https://instagram.com/akuadre',
        email: 'mailto:dreenation21@gmail.com',
        github: 'https://github.com/akuadre'
      }
    },
    {
      name: 'Evliya S.N.',
      role: 'Frontend & UI/UX Designer',
      quote: '"Design is not just how it looks, but how it feels."',
      image: evliyaImage,
      social: {
        instagram: 'https://instagram.com/liyayyaya',
        email: 'mailto:evliyasatarii@gmail.com',
        github: 'https://github.com/evliyasatari'
      }
    }
  ];

  // Varian animasi untuk Framer Motion
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const staggeredContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } },
  };

  return (
    <div className="bg-gray-50 text-gray-800 font-sans">
      {/* CSS Animasi Keyframes diletakkan di sini */}
      <style>{`
        @keyframes pulse-glow { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
        @keyframes float { 0% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-10px) rotate(5deg); } 100% { transform: translateY(0px) rotate(0deg); } }
        @keyframes drift { 0% { transform: translateY(0px) translateX(0px) rotate(0deg); } 30% { transform: translateY(-5px) translateX(10px) rotate(10deg); } 70% { transform: translateY(5px) translateX(-10px) rotate(-5deg); } 100% { transform: translateY(0px) translateX(0px) rotate(0deg); } }
        .pulse-glow { animation: pulse-glow 15s infinite ease-in-out; }
        .float-animation { animation: float 6s infinite ease-in-out; }
        .drift { animation: drift 8s infinite ease-in-out; }
      `}</style>

      {/* ----------- NAVBAR ----------- */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled || isMenuOpen ? 'bg-slate-800 shadow-lg' : 'bg-transparent'}`}>
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <ScrollLink to="beranda" smooth={true} duration={500} className="flex items-center gap-2 group cursor-pointer">
            <img src={logoSekolah} alt="Logo" className="w-8 h-8 drop-shadow-xl" />
            <h1 className="text-2xl font-semibold text-white drop-shadow-xl">GuestBook</h1>
          </ScrollLink>
          <nav className="hidden md:flex items-center gap-6 text-white">
            {navItems.map((item) => (
              <ScrollLink key={item.name} to={item.to} smooth={true} duration={500} offset={-80} className="cursor-pointer hover:text-sky-300 transition">{item.name}</ScrollLink>
            ))}
            <RouterLink to="/login" className="ml-4 bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded-full transition transform hover:scale-105">Login Admin</RouterLink>
          </nav>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">{isMenuOpen ? <X size={28} /> : <Menu size={28} />}</button>
          </div>
        </div>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="md:hidden bg-slate-800 text-white flex flex-col items-center gap-4 py-4">
            {navItems.map((item) => (
              <ScrollLink key={item.name} to={item.to} smooth={true} duration={500} offset={-80} onClick={() => setIsMenuOpen(false)} className="cursor-pointer py-2">{item.name}</ScrollLink>
            ))}
            <RouterLink to="/login" className="mt-2 bg-sky-500 hover:bg-sky-600 text-white px-6 py-2 rounded-full">Login Admin</RouterLink>
          </motion.div>
        )}
      </header>

      <main>
        {/* ----------- HERO SECTION ----------- */}
        <section id="beranda" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-800 text-white pt-24">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200vw] h-[200vw] rounded-full pulse-glow" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 40%)' }} />
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff20_1px,transparent_1px)] [background-size:20px_20px]" />
            <motion.div className="absolute top-20 left-20 w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl opacity-20 float-animation" />
            <motion.div className="absolute top-40 right-32 w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-25 float-animation" style={{ animationDelay: '1s' }} />
            <motion.div className="absolute bottom-32 left-40 w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rotate-45 opacity-15 drift" style={{ animationDelay: '2s' }}/>
          </div>

          <div className="relative z-10 w-full container mx-auto px-6 flex flex-col items-center">
            {/* News Slider */}
            <div className="w-full max-w-4xl mb-12">
              {newsError && <div className="text-center text-red-300 p-4 bg-red-500/20 rounded-lg">{newsError}</div>}
              {posts.length > 0 && (
                <div className="w-full bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-2 shadow-lg">
                    <Splide options={{ type: 'loop', perPage: 1, autoplay: true, interval: 4000, arrows: true, pagination: false, pauseOnHover: true }}>
                      {posts.map(post => (
                        <SplideSlide key={post.id}>
                          <a href={post.link} target="_blank" rel="noopener noreferrer" className="block h-[400px] rounded-lg relative overflow-hidden group">
                            <img src={post._embedded['wp:featuredmedia'][0].source_url} alt={post.title.rendered} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
                              <h3 className="text-2xl font-bold leading-tight mb-2" dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                              <div className="flex items-center text-sm text-gray-300"><Calendar size={14} className="mr-2" /><span>{new Date(post.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
                            </div>
                          </a>
                        </SplideSlide>
                      ))}
                    </Splide>
                </div>
              )}
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-between w-full">
              <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="w-full lg:w-1/2 flex flex-col items-center text-center space-y-8">
                <img src={logoSekolah} alt="Guestbook Icon" className="w-36 h-36 drop-shadow-2xl" />
                <div className="space-y-4"><h2 className="text-5xl font-bold leading-tight">Selamat Datang di SMKN 1 Cimahi</h2><p className="text-xl text-blue-200">Silakan mengisi buku tamu digital kami.</p></div>
                <div className="flex items-center justify-center gap-3 p-2 rounded-full">
                  {/* [!] Perubahan: Link disesuaikan dengan route '/input' di App.jsx */}
                  <RouterLink to="/input#parent" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium px-8 py-4 text-lg rounded-full shadow-lg hover:scale-105 transition">Orang Tua</RouterLink>
                  {/* [!] Perubahan: Link disesuaikan dengan route '/input' di App.jsx */}
                  <RouterLink to="/input#general" className="bg-gradient-to-r from-green-500 to-green-600 text-white font-medium px-8 py-4 text-lg rounded-full shadow-lg hover:scale-105 transition">Tamu Umum</RouterLink>
                </div>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.7 }} className="w-full lg:w-1/2 flex items-center justify-center lg:pl-12 mt-12 lg:mt-0">
                <div className="w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-2xl p-4 shadow-2xl border border-white/20">
                  <div className="relative aspect-video rounded-xl overflow-hidden shadow-xl">
                    <iframe className="w-full h-full" src="https://www.youtube.com/embed/j-vz3ZuL3jw?autoplay=1&mute=1&controls=0&loop=1&playlist=j-vz3ZuL3jw" title="Video Profil Sekolah" allow="autoplay; encrypted-media" allowFullScreen></iframe>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ----------- FEATURES SECTION ----------- */}
        <section id="fitur" className="py-28 bg-white">
          <div className="container mx-auto px-6 text-center">
            <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }}>
              <h2 className="text-4xl font-bold">Fitur Unggulan</h2><p className="text-lg text-gray-600 mt-2">Solusi cerdas untuk pengalaman yang lebih sederhana 🛠️</p>
            </motion.div>
            <motion.div variants={staggeredContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              {features.map((feature, index) => (
                <motion.div key={index} variants={sectionVariants} className="group bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                  <feature.icon className="w-12 h-12 mx-auto text-sky-500 mb-4 transition-transform group-hover:scale-110" />
                  <h3 className="text-2xl font-semibold mb-2">{feature.title}</h3><p className="text-gray-600">{feature.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ----------- ABOUT SECTION ----------- */}
        <section id="tentang" className="py-28">
            <div className="container mx-auto px-6 text-center">
              <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }}>
                <h2 className="text-4xl font-bold">Tentang Aplikasi</h2><p className="text-lg text-gray-600 mt-2">Kisah di balik kode kami 📖</p>
              </motion.div>
              <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} className="mt-12 flex flex-col items-center">
                <img src={logoGuestbook} alt="Guestbook Icon" className="w-48 h-w-48 mx-auto drop-shadow-xl transition duration-300 hover:scale-110" />
                <p className="text-lg text-gray-600 max-w-4xl mx-auto mt-8">Aplikasi Buku Tamu Digital ini dirancang untuk mempermudah pengelolaan kunjungan di SMKN 1 Cimahi. Sistem ini memungkinkan pencatatan tamu—mulai dari orang tua hingga pihak industri—secara efisien dan terstruktur. Semua data tersimpan digital, memudahkan rekapitulasi dan pelaporan.</p>
              </motion.div>
            </div>
        </section>
        
        {/* ----------- CONTACT SECTION ----------- */}
        <section id="kontak" className="py-28 bg-white">
          <div className="container mx-auto px-6 text-center">
            <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }}>
              <h2 className="text-4xl font-bold">Hubungi Kami</h2><p className="text-lg text-gray-600 mt-2">Kenali para pengembang di baliknya 🧑🏻‍💻</p>
            </motion.div>
            <motion.div variants={staggeredContainer} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto mt-16">
              {contacts.map((contact, index) => (
                <motion.div key={index} variants={sectionVariants} className="group bg-gray-50 p-8 rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center">
                  <img src={contact.image} alt={contact.name} className="w-32 h-32 mx-auto rounded-full object-cover mb-4 shadow-lg border-4 border-white"/>
                  <h3 className="text-2xl font-semibold">{contact.name}</h3>
                  <p className="text-sky-600 font-medium">{contact.role}</p>
                  <p className="italic text-sm mt-4 text-gray-500">"{contact.quote}"</p>
                  <div className="flex justify-center space-x-6 mt-6 text-gray-500">
                    <a href={contact.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition"><Instagram /></a>
                    <a href={contact.social.email} className="hover:text-blue-500 transition"><Mail /></a>
                    <a href={contact.social.github} target="_blank" rel="noopener noreferrer" className="hover:text-black transition"><Github /></a>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>

      {/* ----------- FOOTER ----------- */}
      <footer className="bg-slate-800 text-white text-center py-8">
        <p>© {new Date().getFullYear()} Buku Tamu Digital. Development by Software Engineer SMKN 1 Cimahi.</p>
      </footer>

      {/* ----------- SCROLL TO TOP BUTTON ----------- */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 bg-sky-500 text-white p-4 rounded-full shadow-lg hover:bg-sky-600 transition z-50"
          >
            <ArrowUp />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;