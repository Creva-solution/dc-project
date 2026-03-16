import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { FaInstagram, FaYoutube, FaFacebookF } from 'react-icons/fa';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false);
    const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);

    // desktop dropdown ref
    const desktopDropdownRef = useRef(null);
    const location = useLocation();

    const closeMenu = () => {
        setIsOpen(false);
        setIsDesktopDropdownOpen(false);
        setIsMobileDropdownOpen(false);
    };

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Close desktop dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (desktopDropdownRef.current && !desktopDropdownRef.current.contains(event.target)) {
                setIsDesktopDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Check if link is active
    const isActive = (path) => location.pathname === path;

    return (
        <>
            <nav className="sticky top-0 w-full z-40 bg-white shadow-sm border-b border-gray-100">
                <div className="container mx-auto px-4 lg:px-6 h-20 flex justify-between items-center text-sm font-semibold text-gray-800">

                    {/* LOGO */}
                    <Link to="/" className="flex items-center" onClick={closeMenu}>
                        <img src="/logo.svg" alt="DC Constructions" className="h-[46px] w-auto" />
                    </Link>

                    {/* MOBILE TOGGLE BUTTON */}
                    <button className="lg:hidden text-gray-800 p-2" onClick={() => setIsOpen(true)}>
                        <Menu size={28} />
                    </button>

                    {/* DESKTOP NAVIGATION LINKS */}
                    <ul className="hidden lg:flex items-center gap-6">
                        <li><Link to="/" className={`hover:text-accent transition ${isActive('/') ? 'text-accent' : ''}`}>Home</Link></li>
                        <li><Link to="/about" className={`hover:text-accent transition ${isActive('/about') ? 'text-accent' : ''}`}>About Us</Link></li>

                        <li className="relative flex items-center gap-1 cursor-pointer" ref={desktopDropdownRef}>
                            <div
                                onClick={() => setIsDesktopDropdownOpen(!isDesktopDropdownOpen)}
                                className={`hover:text-accent transition flex items-center py-2 ${location.pathname.includes('/packages') || isDesktopDropdownOpen ? 'text-accent' : ''}`}
                            >
                                <span>Packages</span>
                                <ChevronDown size={14} className={`ml-1 transition-transform duration-300 ${isDesktopDropdownOpen ? 'rotate-180' : ''}`} />
                            </div>

                            <ul className={`${isDesktopDropdownOpen ? 'max-h-64 opacity-100 visible mt-6 border border-gray-100' : 'max-h-0 opacity-0 invisible mt-0 border-transparent'} absolute top-full left-0 bg-white text-gray-800 rounded-md shadow-xl w-48 flex flex-col overflow-hidden transition-all duration-300 ease-in-out z-50`}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <li><Link to="/packages/construction" onClick={closeMenu} className="block px-5 py-3 hover:bg-gray-50 hover:text-accent transition text-sm">Construction</Link></li>
                                <li><Link to="/packages/construction#calculator-section" onClick={closeMenu} className="block px-5 py-3 hover:bg-gray-50 hover:text-accent transition text-sm">Cost Calculator</Link></li>
                                <li><Link to="/packages/architectural" onClick={closeMenu} className="block px-5 py-3 hover:bg-gray-50 hover:text-accent transition text-sm">Architectural</Link></li>
                            </ul>
                        </li>

                        <li><Link to="/interiors" className={`hover:text-accent transition ${isActive('/interiors') ? 'text-accent' : ''}`}>Interiors</Link></li>
                        <li><Link to="/project-management" className={`hover:text-accent transition ${isActive('/project-management') ? 'text-accent' : ''}`}>Project Management</Link></li>
                        <li><Link to="/works" className={`hover:text-accent transition ${isActive('/works') ? 'text-accent' : ''}`}>Our Works</Link></li>
                        <li><Link to="/contact" className={`hover:text-accent transition ${isActive('/contact') ? 'text-accent' : ''}`}>Contact Us</Link></li>
                    </ul>

                    {/* RIGHT ACTION BAR (DESKTOP) */}
                    <div className="hidden lg:flex items-center gap-5">
                        <Link to="/consultation" className="bg-accent text-white px-5 py-3 rounded text-sm font-bold flex items-center gap-2 hover:bg-[#113250] transition shadow-sm">
                            Free Consultation <span className="text-lg leading-none">&rarr;</span>
                        </Link>
                        <div className="flex items-center gap-3 text-gray-700">
                            <a href="https://www.instagram.com/dc.constructions_22?igsh=bDQ5YnNiN3Fxc3pj" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition"><FaInstagram size={18} /></a>
                            <a href="https://www.youtube.com/@Dc.Constructions_Kishore.D" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition"><FaYoutube size={18} /></a>
                            <a href="#" className="hover:text-accent transition"><FaFacebookF size={16} /></a>
                        </div>
                    </div>

                </div>
            </nav>

            {/* MOBILE NAVIGATION DRAWER OVERLAY */}
            <div
                className={`fixed inset-0 bg-black/60 z-[110] transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onClick={closeMenu}
            ></div>

            {/* MOBILE NAVIGATION DRAWER */}
            <div className={`fixed top-0 right-0 h-full w-[85vw] sm:w-[350px] bg-white z-[120] transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* Drawer Header */}
                <div className="px-6 py-5 flex justify-between items-center border-b border-gray-100">
                    <img src="/logo.svg" alt="DC Constructions" className="h-10 w-auto" />
                    <button onClick={closeMenu} className="p-2 -mr-2 text-gray-500 hover:text-accent transition-colors bg-gray-50 rounded-full">
                        <X size={24} />
                    </button>
                </div>

                {/* Drawer Scrollable Content */}
                <div className="flex-1 overflow-y-auto w-full flex flex-col justify-between">

                    {/* Drawer Links */}
                    <div className="py-8 px-6 flex flex-col gap-6">
                        <Link to="/" onClick={closeMenu} className={`text-[18px] font-semibold transition-colors ${isActive('/') ? 'text-accent' : 'text-[#0E2C48]'}`}>Home</Link>
                        <Link to="/about" onClick={closeMenu} className={`text-[18px] font-semibold transition-colors ${isActive('/about') ? 'text-accent' : 'text-[#0E2C48]'}`}>About Us</Link>

                        {/* Mobile Packages Dropdown */}
                        <div className="flex flex-col">
                            <button
                                onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                                className={`flex items-center justify-between text-[18px] font-semibold w-full text-left transition-colors ${location.pathname.includes('/packages') || isMobileDropdownOpen ? 'text-accent' : 'text-[#0E2C48]'}`}
                            >
                                <span>Packages</span>
                                <ChevronDown size={20} className={`transition-transform duration-300 ${isMobileDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Content */}
                            <div className={`flex flex-col gap-4 overflow-hidden transition-all duration-300 ease-in-out ${isMobileDropdownOpen ? 'max-h-[200px] mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <Link to="/packages/construction" onClick={closeMenu} className="text-[15px] font-medium text-gray-600 hover:text-accent pl-4 border-l-2 border-transparent hover:border-accent">Construction</Link>
                                <Link to="/packages/construction#calculator-section" onClick={closeMenu} className="text-[15px] font-medium text-gray-600 hover:text-accent pl-4 border-l-2 border-transparent hover:border-accent">Cost Calculator</Link>
                                <Link to="/packages/architectural" onClick={closeMenu} className="text-[15px] font-medium text-gray-600 hover:text-accent pl-4 border-l-2 border-transparent hover:border-accent">Architectural</Link>
                            </div>
                        </div>

                        <Link to="/interiors" onClick={closeMenu} className={`text-[18px] font-semibold transition-colors ${isActive('/interiors') ? 'text-accent' : 'text-[#0E2C48]'}`}>Interiors</Link>
                        <Link to="/project-management" onClick={closeMenu} className={`text-[18px] font-semibold transition-colors ${isActive('/project-management') ? 'text-accent' : 'text-[#0E2C48]'}`}>Project Management</Link>
                        <Link to="/works" onClick={closeMenu} className={`text-[18px] font-semibold transition-colors ${isActive('/works') ? 'text-accent' : 'text-[#0E2C48]'}`}>Our Works</Link>
                        <Link to="/contact" onClick={closeMenu} className={`text-[18px] font-semibold transition-colors ${isActive('/contact') ? 'text-accent' : 'text-[#0E2C48]'}`}>Contact Us</Link>
                    </div>

                    {/* Drawer Footer CTA */}
                    <div className="px-6 pb-12 pt-6 mt-8 border-t border-gray-100 w-full shrink-0">
                        <Link to="/consultation" onClick={closeMenu} className="w-full bg-accent text-white px-6 py-4 rounded-xl text-[16px] font-bold flex justify-center items-center shadow-md hover:shadow-lg hover:bg-[#113250] transition-colors">
                            Free Consultation
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
