import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import AppLayout from "./layouts/AppLayout.jsx";

// Import komponen halaman baru sesuai sidebar
import Dashboard from "./pages/Dashboard.jsx";
import Siswa from "./pages/Siswa.jsx";
import OrangTua from "./pages/OrangTua.jsx";
import Jabatan from "./pages/Jabatan.jsx";
import Pegawai from "./pages/Pegawai.jsx";
import BukuTamu from "./pages/BukuTamu.jsx";
import About from "./pages/About.jsx";

import { GuestRoute, ProtectedRoute } from "./routes/AuthRoutes.jsx";

import GuestbookPage from "./pages/GuestbookPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rute untuk halaman Login (Guest Only) */}
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Rute yang dilindungi, butuh login */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            {/* Ganti '/dashboard' menjadi '/' untuk halaman utama */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/siswa" element={<Siswa />} />
            <Route path="/orangtua" element={<OrangTua />} />
            <Route path="/jabatan" element={<Jabatan />} />
            <Route path="/pegawai" element={<Pegawai />} />
            <Route path="/bukutamu" element={<BukuTamu />} />
            <Route path="/about" element={<About />} />
          </Route>
        </Route>

        {/* Rute input buku tamu */}
        <Route path="/input" element={<GuestbookPage />} />

        {/* Jika user sudah login dan mengakses /login, redirect ke dashboard */}
        <Route 
          path="/login" 
          element={
            <ProtectedRoute>
              <Navigate to="/" replace />
            </ProtectedRoute>
          } 
        />

        {/* Jika rute tidak ditemukan, arahkan ke halaman utama */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
