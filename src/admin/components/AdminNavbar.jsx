import { Menu, LogOut, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminNavbar = ({ setSidebarOpen }) => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut();
            toast.success('Logged out successfully');
            navigate('/admin/login');
        } catch (error) {
            toast.error('Failed to logout');
        }
    };

    return (
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-6 lg:px-8 shrink-0">
            {/* Mobile menu button */}
            <button
                onClick={() => setSidebarOpen(true)}
                className="xl:hidden p-2 -ml-2 text-gray-400 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
            >
                <Menu size={24} />
            </button>

            {/* Desktop blank space / Mobile Logo area if needed */}
            <div className="flex-1 xl:flex-none"></div>

            {/* Right side profile */}
            <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col items-end mr-2">
                    <span className="text-sm font-bold text-gray-900">{user?.email || 'Admin User'}</span>
                    <span className="text-xs font-semibold text-green-500 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online
                    </span>
                </div>

                <div className="h-10 w-10 bg-blue-50 text-primary rounded-full flex items-center justify-center font-bold shadow-sm shadow-blue-100 border border-blue-100">
                    <User size={18} />
                </div>

                <div className="w-px h-8 bg-gray-200 mx-2 hidden sm:block"></div>

                <button
                    onClick={handleLogout}
                    title="Logout"
                    className="flex flex-col items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 p-2.5 rounded-xl transition-colors duration-200"
                >
                    <LogOut size={20} />
                </button>
            </div>
        </header>
    );
};

export default AdminNavbar;
