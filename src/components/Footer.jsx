import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#F5F7FA] text-[#333333] border-t-[6px] border-[#0B3D91]">
            <div className="pt-16 pb-12">
                <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h4 className="text-lg font-bold mb-4 border-b-2 border-[#0B3D91] text-[#0B3D91] inline-block pb-1">About Us</h4>
                        <p className="text-[#333333] text-sm mb-4 leading-relaxed">
                            We offer end to end construction services. We build with the intention of exceeding our clients expectations for safety, quality, functionality, and aesthetics.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-4 border-b-2 border-[#0B3D91] text-[#0B3D91] inline-block pb-1">Quick Links</h4>
                        <ul className="space-y-2 text-sm font-medium">
                            <li><Link to="/about" className="text-[#333333] hover:text-[#0B3D91] transition">About Us</Link></li>
                            <li><Link to="/project-management" className="text-[#333333] hover:text-[#0B3D91] transition">Project Management</Link></li>
                            <li><Link to="/works" className="text-[#333333] hover:text-[#0B3D91] transition">Our Works</Link></li>
                            <li><Link to="/contact" className="text-[#333333] hover:text-[#0B3D91] transition">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-4 border-b-2 border-[#0B3D91] text-[#0B3D91] inline-block pb-1">Our Packages</h4>
                        <ul className="space-y-2 text-sm font-medium">
                            <li><Link to="/packages/construction" className="text-[#333333] hover:text-[#0B3D91] transition">For Construction</Link></li>
                            <li><Link to="/packages/architectural" className="text-[#333333] hover:text-[#0B3D91] transition">For Architectural</Link></li>
                            <li><Link to="/interiors" className="text-[#333333] hover:text-[#0B3D91] transition">For Interiors</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-4 border-b-2 border-[#0B3D91] text-[#0B3D91] inline-block pb-1">Contact Us</h4>
                        <ul className="space-y-4 text-sm flex flex-col font-medium text-[#333333]">
                            <li className="flex items-start gap-3 w-full">
                                <MapPin className="text-[#0B3D91] shrink-0 mt-1" size={18} strokeWidth={2} />
                                <span className="text-sm">Chennai - Tiruvallur High Rd,<br />opposite to SRI VENKACHALAPATHY PALACE, Veppambaattu, Annamalai Nagar,<br />Tamil Nadu 602024</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="text-[#0B3D91] shrink-0" size={18} strokeWidth={2} />
                                <a href="tel:+917299114595" className="hover:text-[#0B3D91] transition">D.Kishore(Er): 7299114595</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="text-[#0B3D91] shrink-0" size={18} strokeWidth={2} />
                                <a href="mailto:dcconstructions22@gmail.com" className="hover:text-[#0B3D91] transition">dcconstructions22@gmail.com</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar Segment */}
            <div className="bg-[#EAEAEA] py-6 border-t border-gray-200">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-0 text-sm font-medium text-[#333333]">
                    {/* Left Side: Logo & Copyright */}
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        <Link to="/">
                            <img src="/images/dc-logo.svg" alt="DC Constructions" className="h-[46px] w-auto" />
                        </Link>
                        <span className="hidden md:inline-block text-gray-400">|</span>
                        <p className="text-gray-500 font-normal">&copy; {new Date().getFullYear()} DC Constructions. All Rights Reserved.</p>
                    </div>

                    {/* Right Side: Social Icons & Links */}
                    <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto mt-2 md:mt-0">
                        <div className="flex gap-4">
                            <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-[#0B3D91] hover:bg-[#0B3D91] hover:text-white transition shadow-sm">
                                <Facebook size={16} />
                            </a>
                            <a href="https://www.instagram.com/dc.constructions_22?igsh=bDQ5YnNiN3Fxc3pj" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-[#0B3D91] hover:bg-[#0B3D91] hover:text-white transition shadow-sm">
                                <Instagram size={16} />
                            </a>
                            <a href="https://www.youtube.com/@Dc.Constructions_Kishore.D" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-[#0B3D91] hover:bg-[#0B3D91] hover:text-white transition shadow-sm">
                                <Youtube size={16} />
                            </a>
                            <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-[#0B3D91] hover:bg-[#0B3D91] hover:text-white transition shadow-sm">
                                <Linkedin size={16} />
                            </a>
                        </div>
                        <div className="flex gap-4 text-xs text-gray-400 mt-2">
                            <Link to="#" className="hover:text-[#0B3D91] transition">Privacy Policy</Link>
                            <Link to="#" className="hover:text-[#0B3D91] transition">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
