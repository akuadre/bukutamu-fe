import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer"; // 1. Import komponen Footer

const AppLayout = () => {
  return (
    <div className="bg-gray-100">
      {/* Sidebar dan Navbar tetap di luar alur utama */}
      <Sidebar />
      <Navbar />

      {/* 2. Container utama diubah menjadi flex-col untuk sticky footer */}
      <div className="ml-72 pt-16 flex flex-col">
        {/* 3. Konten utama akan mengisi ruang yang tersedia */}
        <main className="flex-grow p-6 min-h-screen">
          <Outlet />
        </main>
        
        {/* 4. Footer akan selalu berada di bagian bawah */}
        <Footer />
      </div>
    </div>
  );
};

export default AppLayout;
