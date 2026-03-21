import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Construction from './pages/Construction';
import Architectural from './pages/Architectural';
import Interiors from './pages/Interiors';
import ProjectManagement from './pages/ProjectManagement';
import Works from './pages/Works';
import Contact from './pages/Contact';
import Consultation from './pages/Consultation';
import { Phone } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import ConstructionLoader from './components/ConstructionLoader';
import ProjectDetails from './pages/ProjectDetails';
import ScrollToTop from './components/ScrollToTop';
import { Toaster } from 'react-hot-toast';

// Admin Imports
import { AuthProvider } from './admin/hooks/useAuth';
import ProtectedRoute from './admin/components/ProtectedRoute';
import AdminLayout from './admin/layouts/AdminLayout';
import LoginPage from './admin/pages/LoginPage';
import DashboardPage from './admin/pages/DashboardPage';
import AboutConfigPage from './admin/pages/AboutConfigPage';
import HomeConfigPage from './admin/pages/HomeConfigPage';
import ConstructionConfigPage from './admin/pages/ConstructionConfigPage';
import ArchitecturalConfigPage from './admin/pages/ArchitecturalConfigPage';
import InteriorsConfigPage from './admin/pages/InteriorsConfigPage';
import InteriorsGalleryConfigPage from './admin/pages/InteriorsGalleryConfigPage';
import ProjectsConfigPage from './admin/pages/ProjectsConfigPage';
import InquiriesConfigPage from './admin/pages/InquiriesConfigPage';

function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen relative font-sans">
        <ScrollToTop />
        <Toaster position="top-right" />
        <main className="flex-grow w-full">
          <Routes>
            {/* Public Website Routes wrapped with Loaders and Navbars inline so Admin mode hides them */}
            <Route path="/" element={<><ConstructionLoader /><Navbar /><Home /></>} />
            <Route path="/about" element={<><ConstructionLoader /><Navbar /><About /></>} />
            <Route path="/packages/construction" element={<><ConstructionLoader /><Navbar /><Construction /></>} />
            <Route path="/packages/architectural" element={<><ConstructionLoader /><Navbar /><Architectural /></>} />
            <Route path="/interiors" element={<><ConstructionLoader /><Navbar /><Interiors /></>} />
            <Route path="/project-management" element={<><ConstructionLoader /><Navbar /><ProjectManagement /></>} />
            <Route path="/project/:id" element={<><ConstructionLoader /><Navbar /><ProjectDetails /></>} />
            <Route path="/works" element={<><ConstructionLoader /><Navbar /><Works /></>} />
            <Route path="/contact" element={<><ConstructionLoader /><Navbar /><Contact /></>} />
            <Route path="/consultation" element={<><ConstructionLoader /><Navbar /><Consultation /></>} />

            {/* Admin Routes - No Public Nav/Footer/Loaders injected */}
            <Route path="/admin/login" element={<LoginPage />} />

            <Route path="/admin" element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="about" element={<AboutConfigPage />} />
                <Route path="home" element={<HomeConfigPage />} />
                <Route path="construction" element={<ConstructionConfigPage />} />
                <Route path="architectural" element={<ArchitecturalConfigPage />} />
                <Route path="interiors" element={<InteriorsConfigPage />} />
                <Route path="interior-gallery" element={<InteriorsGalleryConfigPage />} />
                <Route path="projects" element={<ProjectsConfigPage />} />
                <Route path="inquiries" element={<InquiriesConfigPage />} />
              </Route>
            </Route>
          </Routes>
        </main>

        <Routes>
          <Route path="/admin/*" element={null} />
          <Route path="*" element={<Footer />} />
        </Routes>

        {/* Floating Buttons - Hidden on Mobile/Tablet due to bottom bar */}
        <div className="hidden lg:flex fixed bottom-6 right-6 flex flex-col gap-4 z-[100]">
          <a href="tel:+1234567890" className="w-14 h-14 bg-accent text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
            <Phone fill="white" size={24} />
          </a>
          <a href="https://wa.me/1234567890" target="_blank" rel="noreferrer" className="w-14 h-14 bg-green-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
            <FaWhatsapp size={28} />
          </a>
        </div>
      </div>
    </AuthProvider >
  );
}

export default App;
