import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const AppLayout = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Sidebar akan memiliki posisi fixed di kiri */}
      <Sidebar />
      
      {/* Navbar akan memiliki posisi fixed di atas */}
      <Navbar />

      {/* Konten Utama */}
      {/* ml-72 memberikan ruang untuk sidebar */}
      {/* pt-16 memberikan ruang untuk navbar */}
      <main className="ml-72 pt-16">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;