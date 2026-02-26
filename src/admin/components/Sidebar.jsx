import { NavLink, Link } from 'react-router-dom';
import {
    LayoutDashboard,
    Home,
    Info,
    HardHat,
    Building2,
    Armchair,
    Images,
    Mail,
    X,
    ExternalLink
} from 'lucide-react';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Home Config', path: '/admin/home', icon: Home },
        { name: 'About Team', path: '/admin/about', icon: Info },
        { name: 'Construction', path: '/admin/construction', icon: HardHat },
        { name: 'Architectural', path: '/admin/architectural', icon: Building2 },
        { name: 'Interiors', path: '/admin/interiors', icon: Armchair },
        { name: 'Interior Gallery', path: '/admin/interior-gallery', icon: Images },
        { name: 'Projects DB', path: '/admin/projects', icon: Images },
        { name: 'Inquiries', path: '/admin/inquiries', icon: Mail },
    ];

    return (
        <>
            {/* Mobile overlay */}
            <div
                className={`fixed inset-0 bg-gray-900/60 z-20 xl:hidden transition-opacity duration-300 backdrop-blur-sm ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setSidebarOpen(false)}
            />

            {/* Sidebar content */}
            <aside className={`fixed xl:static inset-y-0 left-0 z-30 w-[260px] bg-white border-r border-gray-200 transform transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] xl:translate-x-0 flex flex-col shadow-2xl xl:shadow-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Logo & Close */}
                <div className="flex items-center justify-between h-20 px-6 border-b border-gray-100 shrink-0">
                    <img src="/images/dc-logo.svg" alt="Admin Logo" className="h-9 w-auto" />
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="xl:hidden text-gray-400 hover:text-gray-800 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <X size={22} />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto hide-scrollbar">
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-3">Main Navigation</div>

                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            onClick={() => setSidebarOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3.5 px-3 py-3 rounded-xl font-semibold transition-all duration-200 group ${isActive
                                    ? 'bg-blue-50 text-primary shadow-sm'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon size={20} className={`transition-colors ${isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-600'}`} strokeWidth={isActive ? 2.5 : 2} />
                                    {item.name}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Footer Link pointing back to live website */}
                <div className="p-4 border-t border-gray-100 shrink-0">
                    <Link to="/" target="_blank" className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold rounded-xl transition-colors border border-gray-200 text-sm">
                        <ExternalLink size={16} /> View Live Site
                    </Link>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
