import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-white text-gray-800 border-t border-gray-100">
            <div className="pt-20 pb-16">
                <div className="container mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-1">
                        <img src="/logo.svg" alt="DC Constructions" className="h-10 w-auto mb-6" />
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                            Building excellence with trust and transparency. We provide premium end-to-end residential construction solutions.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-[#0E2C48] font-bold mb-6">Navigation</h4>
                        <ul className="space-y-3 text-sm font-medium text-gray-500">
                            <li><Link to="/" className="hover:text-[#0E2C48] transition">Home</Link></li>
                            <li><Link to="/about" className="hover:text-[#0E2C48] transition">About Us</Link></li>
                            <li><Link to="/works" className="hover:text-[#0E2C48] transition">Our Works</Link></li>
                            <li><Link to="/contact" className="hover:text-[#0E2C48] transition">Contact Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[#0E2C48] font-bold mb-6">Services</h4>
                        <ul className="space-y-3 text-sm font-medium text-gray-500">
                            <li><Link to="/packages/construction" className="hover:text-[#0E2C48] transition">Construction</Link></li>
                            <li><Link to="/packages/architectural" className="hover:text-[#0E2C48] transition">Architectural</Link></li>
                            <li><Link to="/interiors" className="hover:text-[#0E2C48] transition">Interiors</Link></li>
                            <li><Link to="/project-management" className="hover:text-[#0E2C48] transition">Project Management</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-[#0E2C48] font-bold mb-6">Connect</h4>
                        <ul className="space-y-4 text-sm font-medium text-gray-500">
                            <li className="flex items-start gap-3">
                                <MapPin className="text-[#0E2C48] shrink-0" size={18} />
                                <span>Chennai - Tiruvallur High Rd, Veppambaattu, Tamil Nadu 602024</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="text-[#0E2C48] shrink-0" size={18} />
                                <a href="tel:+917299114595" className="hover:text-[#0E2C48] transition">7299114595</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="text-[#0E2C48] shrink-0" size={18} />
                                <a href="mailto:dcconstructions22@gmail.com" className="hover:text-[#0E2C48] transition uppercase text-xs tracking-wider">Email Us</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 py-8 border-t border-gray-100">
                <div className="container mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-400">
                    <p>&copy; {year} DC Constructions. All Rights Reserved.</p>
                    <div className="flex gap-6">
                        <a href="https://www.instagram.com/dc.constructions_22" target="_blank" rel="noopener noreferrer" className="hover:text-[#0E2C48] transition"><Instagram size={20} /></a>
                        <a href="https://www.youtube.com/@Dc.Constructions_Kishore.D" target="_blank" rel="noopener noreferrer" className="hover:text-[#0E2C48] transition"><Youtube size={20} /></a>
                        <a href="#" className="hover:text-[#0E2C48] transition"><Facebook size={20} /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
