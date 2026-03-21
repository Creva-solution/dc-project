import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { FaInstagram, FaYoutube, FaFacebookF } from 'react-icons/fa';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false);
    const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // desktop dropdown ref
    const desktopDropdownRef = useRef(null);
    const location = useLocation();

    const closeMenu = () => {
        setIsOpen(false);
        setIsDesktopDropdownOpen(false);
        setIsMobileDropdownOpen(false);
    };

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
            <nav className={`sticky top-0 w-full z-[100] transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md h-20 shadow-lg border-b border-gray-100' : 'bg-white h-[92px] border-b border-gray-200'}`}>
                <div className="container mx-auto px-4 lg:px-6 h-full flex justify-between items-center font-bold text-gray-800">

                    {/* LOGO */}
                    <Link to="/" className="flex items-center shrink-0" onClick={closeMenu}>
                        <img src="/logo.svg" alt="DC Constructions" className={`transition-all duration-300 ${scrolled ? 'h-[52px]' : 'h-[68px]'} w-auto`} />
                    </Link>

                    {/* DESKTOP NAVIGATION LINKS (Center) */}
                    <ul className="hidden lg:flex flex-1 items-center justify-center gap-5 xl:gap-8 text-[16px] tracking-tight">
                        <li>
                            <Link to="/" className={`px-2 py-1 transition-all relative group ${isActive('/') ? 'text-[#0E2C48]' : 'text-gray-600 hover:text-[#0E2C48]'}`}>
                                Home
                                <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#0E2C48] transition-transform duration-300 origin-left ${isActive('/') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/about" className={`px-2 py-1 transition-all relative group ${isActive('/about') ? 'text-[#0E2C48]' : 'text-gray-600 hover:text-[#0E2C48]'}`}>
                                About
                                <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#0E2C48] transition-transform duration-300 origin-left ${isActive('/about') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                            </Link>
                        </li>

                        <li className="relative" ref={desktopDropdownRef}>
                            <div
                                onMouseEnter={() => setIsDesktopDropdownOpen(true)}
                                className={`px-2 py-1 transition-all flex items-center cursor-pointer group ${location.pathname.includes('/packages') ? 'text-[#0E2C48]' : 'text-gray-600 hover:text-[#0E2C48]'}`}
                            >
                                <span>Packages</span>
                                <ChevronDown size={14} className={`ml-1 transition-transform duration-300 ${isDesktopDropdownOpen ? 'rotate-180' : ''}`} />
                            </div>

                            <ul
                                onMouseLeave={() => setIsDesktopDropdownOpen(false)}
                                className={`${isDesktopDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'} absolute top-full left-0 bg-white text-gray-800 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] w-60 flex flex-col overflow-hidden transition-all duration-300 ease-out z-50 border border-gray-100 mt-2`}
                            >
                                <li><Link to="/packages/construction" onClick={closeMenu} className="block px-6 py-4 hover:bg-gray-50 hover:text-[#0E2C48] transition-all text-[15px] font-bold border-b border-gray-50">Construction</Link></li>
                                <li><Link to="/packages/construction#calculator-section" onClick={closeMenu} className="block px-6 py-4 hover:bg-gray-50 hover:text-[#0E2C48] transition-all text-[15px] font-bold border-b border-gray-50">Cost Calculator</Link></li>
                                <li><Link to="/packages/architectural" onClick={closeMenu} className="block px-6 py-4 hover:bg-gray-50 hover:text-[#0E2C48] transition-all text-[15px] font-bold">Architectural Design</Link></li>
                            </ul>
                        </li>

                        <li>
                            <Link to="/interiors" className={`px-2 py-1 transition-all relative group ${isActive('/interiors') ? 'text-[#0E2C48]' : 'text-gray-600 hover:text-[#0E2C48]'}`}>
                                Interiors
                                <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#0E2C48] transition-transform duration-300 origin-left ${isActive('/interiors') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/project-management" className={`px-2 py-1 transition-all relative group ${isActive('/project-management') ? 'text-[#0E2C48]' : 'text-gray-600 hover:text-[#0E2C48]'}`}>
                                Project Management
                                <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#0E2C48] transition-transform duration-300 origin-left ${isActive('/project-management') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/works" className={`px-2 py-1 transition-all relative group ${isActive('/works') ? 'text-[#0E2C48]' : 'text-gray-600 hover:text-[#0E2C48]'}`}>
                                Projects
                                <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#0E2C48] transition-transform duration-300 origin-left ${isActive('/works') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/contact" className={`px-2 py-1 transition-all relative group ${isActive('/contact') ? 'text-[#0E2C48]' : 'text-gray-600 hover:text-[#0E2C48]'}`}>
                                Contact
                                <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#0E2C48] transition-transform duration-300 origin-left ${isActive('/contact') ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                            </Link>
                        </li>
                    </ul>

                    {/* ACTION BUTTON (Right Side) */}
                    <div className="hidden lg:flex shrink-0">
                        <Link to="/consultation" className="bg-[#0E2C48] text-white px-7 py-3 rounded-xl text-[15px] font-extrabold hover:bg-[#113250] transition-all duration-300 shadow-[0_10px_20px_rgba(14,44,72,0.15)] hover:-translate-y-0.5 active:translate-y-0">
                            Free Consultation
                        </Link>
                    </div>

                    {/* MOBILE TOGGLE BUTTON */}
                    <button className="lg:hidden text-gray-800 p-2 hover:bg-gray-50 rounded-lg transition-colors" onClick={() => setIsOpen(true)}>
                        <Menu size={28} />
                    </button>

                </div>
            </nav>

            {/* FULL-SCREEN MOBILE MENU */}
            <div className={`fixed inset-0 bg-white z-[1000] transform transition-transform duration-500 ease-[cubic-bezier(0.85,0,0.15,1)] lg:hidden flex flex-col ${isOpen ? 'translate-y-0' : '-translate-y-full'}`}>

                {/* Mobile Menu Header */}
                <div className="px-6 h-20 flex justify-between items-center border-b border-gray-50">
                    <img src="/logo.svg" alt="DC Constructions" className="h-[50px] w-auto" />
                    <button onClick={closeMenu} className="p-2 text-gray-800 hover:bg-gray-50 rounded-full transition-colors">
                        <X size={32} />
                    </button>
                </div>

                {/* Mobile Menu Content */}
                <div className="flex-1 overflow-y-auto px-8 py-10 flex flex-col">
                    <div className="flex flex-col gap-4 text-left">
                        <Link to="/" onClick={closeMenu} className={`text-[20px] font-medium transition-colors ${isActive('/') ? 'text-[#0E2C48]' : 'text-gray-400'}`}>Home</Link>
                        <Link to="/about" onClick={closeMenu} className={`text-[20px] font-medium transition-colors ${isActive('/about') ? 'text-[#0E2C48]' : 'text-gray-400'}`}>About Us</Link>

                        <div className="flex flex-col">
                            <button
                                onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                                className={`flex items-center gap-2 text-[20px] font-medium transform transition-colors ${location.pathname.includes('/packages') || isMobileDropdownOpen ? 'text-[#0E2C48]' : 'text-gray-400'}`}
                            >
                                <span>Packages</span>
                                <ChevronDown size={20} className={`transition-transform duration-300 ${isMobileDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <div className={`flex flex-col gap-2 overflow-hidden transition-all duration-500 ease-in-out ${isMobileDropdownOpen ? 'max-h-[300px] mt-2 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <Link to="/packages/construction" onClick={closeMenu} className="text-[16px] font-medium text-gray-400 hover:text-[#0E2C48] pl-4 border-l-2 border-gray-100">Construction</Link>
                                <Link to="/packages/construction#calculator-section" onClick={closeMenu} className="text-[16px] font-medium text-gray-400 hover:text-[#0E2C48] pl-4 border-l-2 border-gray-100">Cost Calculator</Link>
                                <Link to="/packages/architectural" onClick={closeMenu} className="text-[16px] font-medium text-gray-400 hover:text-[#0E2C48] pl-4 border-l-2 border-gray-100">Architectural Design</Link>
                            </div>
                        </div>

                        <Link to="/interiors" onClick={closeMenu} className={`text-[20px] font-medium transition-colors ${isActive('/interiors') ? 'text-[#0E2C48]' : 'text-gray-400'}`}>Interiors</Link>
                        <Link to="/project-management" onClick={closeMenu} className={`text-[20px] font-medium transition-colors ${isActive('/project-management') ? 'text-[#0E2C48]' : 'text-gray-400'}`}>Project Management</Link>
                        <Link to="/works" onClick={closeMenu} className={`text-[20px] font-medium transition-colors ${isActive('/works') ? 'text-[#0E2C48]' : 'text-gray-400'}`}>Our Projects</Link>
                        <Link to="/contact" onClick={closeMenu} className={`text-[20px] font-medium transition-colors ${isActive('/contact') ? 'text-[#0E2C48]' : 'text-gray-400'}`}>Contact Us</Link>
                    </div>

                    {/* Mobile CTA Button */}
                    <div className="mt-8 sm:mt-auto mb-10">
                        <Link to="/consultation" onClick={closeMenu} className="w-full bg-[#0E2C48] text-white py-4 rounded-xl text-lg font-extrabold flex justify-center items-center shadow-lg active:scale-[0.98] transition-all">
                            Free Consultation
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
