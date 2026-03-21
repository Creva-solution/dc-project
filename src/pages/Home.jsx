import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, Medal, Briefcase, Calculator, Building, LayoutTemplate, PenTool, CheckCircle, Star, Trophy, Calendar, Users, Clock, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';




const Home = () => {
    const [packages, setPackages] = useState([]);
    const [loadingPackages, setLoadingPackages] = useState(true);
    const [activeCardId, setActiveCardId] = useState(null);
    const [testimonials, setTestimonials] = useState([]);
    const [loadingTestimonials, setLoadingTestimonials] = useState(true);
    const [testimonialsError, setTestimonialsError] = useState(null);
    const [partnerLogos, setPartnerLogos] = useState([]);
    const [loadingPartnerLogos, setLoadingPartnerLogos] = useState(true);
    const [featuredProjects, setFeaturedProjects] = useState([]);
    const [loadingFeaturedProjects, setLoadingFeaturedProjects] = useState(true);
    const [activePackageId, setActivePackageId] = useState(null);

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (!e.target.closest('.interactive-card')) {
                setActiveCardId(null);
            }
            if (!e.target.closest('.package-card')) {
                setActivePackageId(null);
            }
        };
        document.addEventListener('click', handleOutsideClick);
        return () => document.removeEventListener('click', handleOutsideClick);
    }, []);

    useEffect(() => {
        const fetchLivePackages = async () => {
            try {
                const { data, error } = await supabase
                    .from('packages')
                    .select('*')
                    .order('display_order', { ascending: true })
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setPackages(data || []);
            } catch (error) {
                console.error("Error fetching packages:", error.message);
            } finally {
                setLoadingPackages(false);
            }
        };

        fetchLivePackages();
    }, []);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                setLoadingTestimonials(true);
                const { data, error } = await supabase
                    .from('testimonials')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setTestimonials(data || []);
            } catch (error) {
                console.error("Error fetching testimonials:", error.message);
                setTestimonialsError(error.message);
            } finally {
                setLoadingTestimonials(false);
            }
        };

        fetchTestimonials();
    }, []);

    useEffect(() => {
        const fetchPartnerLogos = async () => {
            try {
                setLoadingPartnerLogos(true);
                const { data, error } = await supabase
                    .from('partner_logos')
                    .select('*')
                    .order('display_order', { ascending: true });

                if (error) throw error;
                setPartnerLogos(data || []);
            } catch (error) {
                console.error("Error fetching partner logos:", error.message);
            } finally {
                setLoadingPartnerLogos(false);
            }
        };

        fetchPartnerLogos();
    }, []);

    useEffect(() => {
        const fetchFeaturedProjects = async () => {
            try {
                setLoadingFeaturedProjects(true);
                const { data, error } = await supabase
                    .from('projects')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(6);

                if (error) throw error;
                setFeaturedProjects(data || []);
            } catch (error) {
                console.error("Error fetching featured projects:", error.message);
            } finally {
                setLoadingFeaturedProjects(false);
            }
        };

        fetchFeaturedProjects();
    }, []);

    return (
        <>
            {/* Hero Section */}
            <section className="relative bg-white w-full pt-[40px] pb-[100px] lg:pt-[40px] lg:pb-[40px] h-auto flex flex-col justify-start overflow-hidden hero-bg-grid">
                <div className="container mx-auto px-4 lg:px-5 max-w-[1200px]">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-[20px] lg:gap-[40px]">
                        
                        {/* Left Column (Text Content) */}
                        <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-[48%] max-w-[600px] shrink-0 lg:ml-2">
                            <h1 className="text-[32px] md:text-[44px] lg:text-[56px] font-extrabold text-[#0E2C48] leading-[1.15] mb-4 tracking-tight">
                                Building Your <br className="hidden lg:block" /> Dream Home <br className="hidden lg:block" /> With Trust
                            </h1>
                            <p className="text-[16px] md:text-[18px] text-gray-600 max-w-[480px] leading-relaxed mb-6 font-medium">
                                We provide end-to-end construction services with quality and transparency.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                                <Link to="/consultation" className="w-full sm:w-auto bg-[#0E2C48] text-white px-7 h-[52px] rounded-xl flex items-center justify-center font-bold text-[16px] hover:bg-[#113250] transition-transform duration-300 shadow-xl hover:-translate-y-1 active:scale-95">
                                    Get Free Consultation
                                </Link>
                                <Link to="/works" className="w-full sm:w-auto bg-white border-2 border-gray-200 text-[#0E2C48] px-7 h-[52px] rounded-xl flex items-center justify-center font-bold text-[16px] hover:border-[#0E2C48] hover:bg-gray-50 transition-transform duration-300 shadow-sm hover:-translate-y-1 active:scale-95">
                                    View Projects
                                </Link>
                            </div>
                        </div>

                        {/* Right Column (Image Container) */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="w-full lg:w-[52%] flex justify-center items-center"
                        >
                            <div className="relative w-full max-w-[700px] lg:max-w-[900px] xl:max-w-[1100px] scale-100 md:scale-105 lg:scale-120">
                                <img 
                                    src="/cartoon.png" 
                                    alt="Construction Illustration"
                                    className="w-full h-auto object-contain object-center"
                                />
                                
                                {/* Interactive Markers */}
                                {[
                                    { id: 1, top: "28%", left: "30%", text: "Smart Space Planning" },
                                    { id: 2, top: "45%", left: "68%", text: "Premium Quality Builds" },
                                    { id: 3, top: "68%", left: "25%", text: "Modern Architecture" },
                                    { id: 4, top: "75%", left: "75%", text: "Eco-friendly Design" }
                                ].map(marker => (
                                    <div 
                                        key={marker.id} 
                                        className="absolute interactive-card z-10"
                                        style={{ top: marker.top, left: marker.left }}
                                    >
                                        <div className="relative flex justify-center items-center">
                                            {/* Pulsing background effect */}
                                            <div className="absolute inset-0 bg-[#0E2C48] rounded-full animate-ping opacity-40"></div>
                                            
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveCardId(activeCardId === marker.id ? null : marker.id);
                                                }}
                                                className="relative z-10 w-8 h-8 md:w-10 md:h-10 bg-[#0E2C48] text-white rounded-full flex items-center justify-center shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:scale-110 hover:bg-[#113250] transition-transform duration-300"
                                            >
                                                <Plus size={20} />
                                            </button>
                                            
                                            {/* Tooltip */}
                                            <div 
                                                className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-max max-w-[200px] bg-white text-[#0E2C48] text-sm md:text-base font-bold py-2 px-4 rounded-xl shadow-xl border border-gray-100 transition-all duration-300 transform origin-bottom ${activeCardId === marker.id ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-2 pointer-events-none'}`}
                                            >
                                                {marker.text}
                                                {/* Tooltip Arrow */}
                                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                    </div>
                    
                    {/* Integrated Logo Strip inside Hero */}
                    <div className="mt-4 lg:mt-8 border-t border-gray-100/30 pt-4 w-full overflow-hidden">
                        <div className="relative w-full overflow-hidden flex group">
                            {!loadingPartnerLogos && (partnerLogos.length > 0 ? (
                                <div className="flex gap-[40px] lg:gap-[80px] animate-scroll group-hover:[animation-play-state:paused] w-max items-center pr-[40px]" style={{ animationDuration: '30s' }}>
                                    {[...partnerLogos, ...partnerLogos, ...partnerLogos, ...partnerLogos].map((brand, idx) => (
                                        <div key={idx} className="flex items-center justify-center flex-shrink-0">
                                            <img
                                                src={brand.image_url}
                                                alt={`${brand.name} logo`}
                                                className="h-[32px] md:h-[42px] lg:h-[48px] w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex gap-[40px] animate-scroll group-hover:[animation-play-state:paused] w-max items-center opacity-20" style={{ animationDuration: '40s' }}>
                                    {Array(8).fill("DC • QUALITY • TRUST • INNOVATION • ").map((text, idx) => (
                                        <span key={idx} className="text-xl md:text-2xl font-black text-[#0E2C48] whitespace-nowrap">{text}</span>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Mobile Floating Bottom Bar */}
            <div className="lg:hidden fixed bottom-6 left-6 right-6 z-[90] flex gap-3 pointer-events-none">
                <a
                    href="tel:+918110006333"
                    className="flex-1 bg-white text-[#0E2C48] h-[52px] rounded-xl flex items-center justify-center gap-2 font-bold shadow-[0_8px_30px_rgb(0,0,0,0.15)] border border-gray-100 active:scale-95 transition-transform pointer-events-auto text-[15px]"
                >
                    Call Now
                </a>
                <a
                    href="https://wa.me/918110006333"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-[#25D366] text-white h-[52px] rounded-xl flex items-center justify-center gap-2 font-bold shadow-[0_8px_30px_rgb(37,211,102,0.2)] active:scale-95 transition-transform pointer-events-auto text-[15px]"
                >
                    WhatsApp
                </a>
            </div>



            {/* Premium About Us Section */}
            <motion.section 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="bg-white py-[40px] lg:py-[60px] w-full h-auto"
            >
                <div className="container mx-auto px-4 lg:px-5 max-w-[1200px]">
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-[40px] lg:gap-[50px] xl:gap-[70px]">
                        
                        {/* Left Side: Text Content */}
                        <div className="w-full lg:w-[45%] xl:w-[40%] flex flex-col items-center lg:items-start text-center lg:text-left">
                            <span className="text-[#0E2C48] font-bold text-[15px] mb-3 uppercase tracking-[0.15em]">
                                Welcome To
                            </span>
                            <h2 className="text-[36px] md:text-[42px] lg:text-[48px] xl:text-[56px] font-extrabold text-gray-900 leading-[1.1] mb-6">
                                DC Constructions
                            </h2>
                            
                            <p className="text-[16px] md:text-[17px] text-gray-500 leading-[1.8] mb-6 max-w-[500px] font-medium text-justify lg:text-left">
                                We offer end to end construction services. We build with the intention of exceeding our clients expectations for safety, quality, functionality, and aesthetics, and deliver assets that stand the test of time.
                            </p>
                            
                            <p className="text-[16px] md:text-[17px] text-gray-500 leading-[1.8] mb-10 max-w-[500px] font-medium text-justify lg:text-left">
                                DC Constructions was started as a turnkey construction and interior design company. Every project is carefully planned and meticulously executed to redefine architectural boundaries.
                            </p>
                            
                            <Link to="/about" className="inline-flex items-center gap-3 bg-[#0E2C48] text-white px-8 h-[56px] rounded-xl font-bold text-[17px] hover:bg-[#113250] transition-transform duration-300 shadow-xl hover:-translate-y-1 active:scale-95 w-full sm:w-auto justify-center">
                                Learn More <ArrowRight size={20} />
                            </Link>
                        </div>

                        {/* Subtle Vertical Divider */}
                        <div className="hidden lg:block w-[1px] h-[350px] bg-gradient-to-b from-transparent via-gray-200 to-transparent shrink-0 mx-2"></div>
                        
                        {/* Right Side: Image Content */}
                        <div className="w-full lg:w-[45%] flex justify-center lg:justify-start">
                            <div className="w-full max-w-[450px] xl:max-w-[500px] relative bg-[#EAF5FA] p-6 lg:p-10 rounded-[40px]">
                                <img
                                    src="/images/about_construction.png"
                                    alt="Professional Construction Site"
                                    className="w-full h-auto max-h-[350px] lg:max-h-[500px] object-cover rounded-[24px] shadow-[0_12px_40px_rgb(0,0,0,0.12)]"
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </motion.section>

            {/* Why Choose Us */}
            <motion.section 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="py-[40px] lg:py-[60px] bg-[#FAFBFF] border-y border-gray-100 overflow-hidden"
            >
                <div className="container mx-auto px-4 lg:px-5 max-w-[1200px]">
                    <div className="text-center mb-10 lg:mb-12">
                        <h2 className="text-[28px] md:text-[36px] lg:text-[40px] font-extrabold text-[#0E2C48] tracking-tight">Why Choose Us</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-[70px] max-w-[1050px] mx-auto">
                        {[
                            { title: 'Quality Materials', icon: Medal },
                            { title: 'Experienced Engineers', icon: Briefcase },
                            { title: 'Zero Time Delay', icon: Clock }
                        ].map((feature, i) => (
                            <div key={i} className="relative w-full py-2 group cursor-pointer z-10">
                                {/* Ribbon background (horizontal wings) */}
                                <div className="absolute top-1/2 -translate-y-1/2 -left-[12px] -right-[12px] lg:-left-[18px] lg:-right-[18px] h-[40px] lg:h-[46px] bg-[#DBEAFE] rounded-[10px] -z-10 transition-transform duration-300 group-hover:scale-y-110 opacity-90"></div>
                                
                                {/* Main White Card Base */}
                                <div className="relative z-10 bg-white rounded-[16px] shadow-[0_5px_20px_rgb(0,0,0,0.05)] flex items-center h-[80px] lg:h-[86px] w-full overflow-hidden transition-transform duration-300 group-hover:-translate-y-1 border border-white">
                                    
                                    {/* Left Text */}
                                    <div className="flex-1 flex items-center h-full pl-5 lg:pl-6 z-20">
                                        <h3 className="font-extrabold text-[14px] lg:text-[15px] xl:text-[16px] text-gray-900 select-none whitespace-nowrap">
                                            {feature.title}
                                        </h3>
                                    </div>
                                    
                                    {/* Right Geometric Shapes Container */}
                                    <div className="absolute right-0 top-0 bottom-0 w-[140px] pointer-events-none flex justify-end overflow-hidden rounded-r-[16px]">
                                        {/* Light Blue Inner Orbit Extends Left */}
                                        <div className="absolute right-[-15px] top-0 bottom-0 w-[100px] lg:w-[115px] bg-[#DBEAFE] rounded-l-full group-hover:scale-105 transition-transform duration-500 ease-out origin-right"></div>
                                        
                                        {/* Dark Blue Outer Shape Caps The Edge */}
                                        <div className="absolute right-0 top-0 bottom-0 w-[65px] lg:w-[75px] bg-[#0E2C48] rounded-l-full flex items-center justify-center transition-colors duration-500 group-hover:bg-[#113250]">
                                            <feature.icon className="text-white w-[22px] h-[22px] lg:w-[24px] lg:h-[24px] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-12 mr-[10px] lg:mr-[14px]" strokeWidth={1.5} />
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Service Packages */}
            <motion.section 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="py-[40px] lg:py-[60px] bg-white border-t border-gray-100 h-auto"
            >
                <div className="container mx-auto px-4 lg:px-5 max-w-[1200px]">
                    <div className="text-center mb-10 lg:mb-12">
                        <h2 className="text-[#0E2C48] text-[32px] md:text-[38px] font-extrabold mb-3 tracking-tight">Construction Packages</h2>
                        <p className="text-gray-500 text-[15px] md:text-[16px] max-w-[600px] mx-auto font-medium">Transparent pricing for every budget and requirement.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 items-stretch">
                        {loadingPackages ? (
                            Array(3).fill(0).map((_, i) => (
                                <div key={i} className="bg-white rounded-[16px] p-6 border border-gray-100 shadow-sm flex flex-col h-[400px]">
                                    <div className="w-14 h-14 rounded-full skeleton mb-6"></div>
                                    <div className="h-6 w-3/4 skeleton mb-4 rounded-md"></div>
                                    <div className="h-4 w-1/2 skeleton mb-8 rounded-md"></div>
                                    <div className="h-4 w-full skeleton mb-2 rounded-md"></div>
                                    <div className="h-4 w-full skeleton mb-2 rounded-md"></div>
                                    <div className="h-4 w-2/3 skeleton mb-auto rounded-md"></div>
                                    <div className="h-12 w-full skeleton rounded-xl mt-4"></div>
                                </div>
                            ))
                        ) : (
                            packages.slice(0, 3).map((pkg, idx) => {
                                const packageImages = [
                                    "/images/hero_construction_1771913977299.webp",
                                    "/images/interior_kitchen_1771914159653.webp",
                                    "/images/project_2026-02-25_11.23.33_AM_1.webp"
                                ];
                                
                                return (
                                    <div
                                        key={pkg.id}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActivePackageId(activePackageId === pkg.id ? null : pkg.id);
                                        }}
                                        className={`relative bg-white rounded-[16px] p-5 lg:p-6 transition-all duration-500 hover:-translate-y-2 flex flex-col group overflow-hidden h-auto package-card cursor-pointer lg:cursor-default ${
                                            idx === 1 
                                            ? 'shadow-[0_15px_35px_rgba(14,44,72,0.1)] scale-[1.03] border-2 border-[#0E2C48] z-10' 
                                            : 'shadow-[0_4px_15px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_12px_25px_rgba(0,0,0,0.06)]'
                                        } ${activePackageId === pkg.id ? '-translate-y-2' : ''}`}
                                    >
                                        {/* Hover Image Overlay */}
                                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0 ${activePackageId === pkg.id ? 'opacity-100' : ''}`}>
                                            <img 
                                                src={packageImages[idx] || pkg.image_url || `https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=800`} 
                                                alt={pkg.title}
                                                className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-[#0E2C48]/80 transition-colors duration-500"></div>
                                        </div>

                                        {/* Highlight Label for Premium Card */}
                                        {idx === 1 && (
                                            <div className={`absolute -top-[1px] right-[20px] bg-[#0E2C48] text-white px-4 py-1.5 rounded-b-xl text-[10px] font-black tracking-widest shadow-md z-20 group-hover:bg-white group-hover:text-[#0E2C48] transition-colors ${activePackageId === pkg.id ? 'bg-white text-[#0E2C48]' : ''}`}>
                                                MOST POPULAR
                                            </div>
                                        )}

                                        {/* Background Number */}
                                        <div className={`absolute top-2 right-4 text-[60px] lg:text-[70px] font-black text-[#0E2C48] opacity-[0.03] leading-none pointer-events-none select-none z-0 group-hover:text-white group-hover:opacity-[0.1] transition-all ${activePackageId === pkg.id ? 'text-white opacity-[0.1]' : ''}`}>
                                            0{idx + 1}
                                        </div>

                                        {/* Floating Icon with Glow Effect */}
                                        <div className={`w-[56px] h-[56px] rounded-full flex items-center justify-center mb-6 relative z-10 transition-all duration-500 group-hover:scale-110 ${
                                            idx === 1 
                                            ? 'bg-[#0E2C48] text-white' 
                                            : 'bg-white text-[#0E2C48] shadow-[0_8px_20px_rgba(0,0,0,0.06)]'
                                        }`}>
                                            {/* Glow Layer */}
                                            <div className={`absolute inset-0 rounded-full blur-xl opacity-40 transition-opacity duration-500 group-hover:opacity-70 ${
                                                idx === 1 ? 'bg-[#0E2C48]' : 'bg-[#0E2C48]/20'
                                            }`}></div>
                                            
                                            <Building className="w-[26px] h-[26px] relative z-20" strokeWidth={2} />
                                        </div>

                                        {/* Content */}
                                        <div className="relative z-10 flex flex-col flex-1">
                                            <h3 className={`text-[18px] lg:text-[20px] font-bold text-[#0E2C48] mb-1 group-hover:text-white transition-colors ${activePackageId === pkg.id ? 'text-white' : ''}`}>{pkg.title}</h3>
                                            
                                            <div className="flex items-baseline gap-1 mb-4">
                                                <span className={`text-[28px] lg:text-[32px] font-black text-[#0E2C48] tracking-tight group-hover:text-white transition-colors ${activePackageId === pkg.id ? 'text-white' : ''}`}>
                                                    ₹ {String(pkg.price).replace(/[^0-9]/g, '')}
                                                </span>
                                                <span className={`text-[12px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-white/60 transition-colors ${activePackageId === pkg.id ? 'text-white/60' : ''}`}>/ sq.ft</span>
                                            </div>
                                            
                                            <p className={`text-[14px] text-gray-600 leading-relaxed mb-6 flex-1 font-medium line-clamp-1 group-hover:text-white/80 transition-colors ${activePackageId === pkg.id ? 'text-white/80' : ''}`}>
                                                {pkg.description}
                                            </p>
                                            
                                            <Link 
                                                to="/packages/construction" 
                                                className={`w-full h-[48px] rounded-xl flex items-center justify-center font-bold text-[15px] transition-all duration-300 ${
                                                    idx === 1 
                                                    ? 'bg-[#0E2C48] text-white hover:bg-[#113250] shadow-md group-hover:bg-white group-hover:text-[#0E2C48]' 
                                                    : 'bg-[#FAFBFF] text-[#0E2C48] border border-gray-200 hover:border-[#0E2C48] hover:bg-white group-hover:bg-white group-hover:text-[#0E2C48] group-hover:border-white'
                                                } ${activePackageId === pkg.id ? 'bg-white text-[#0E2C48] border-white' : ''}`}
                                            >
                                                View Plan
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </motion.section>

            {/* Featured Projects Grid */}
            <motion.section 
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="py-[40px] lg:py-[60px] bg-[#FAFBFF] border-t border-gray-100 h-auto" 
                id="projects"
            >
                <div className="container mx-auto px-4 lg:px-5 max-w-[1200px] text-center">
                    <h2 className="text-[28px] md:text-[36px] font-extrabold text-[#0E2C48] mb-10 tracking-tight">Featured Projects</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 mb-10">
                        {loadingFeaturedProjects ? (
                            Array(3).fill(0).map((_, i) => (
                                <div key={i} className="rounded-xl aspect-[4/3] skeleton"></div>
                            ))
                        ) : (
                            featuredProjects.slice(0, 6).map((project) => (
                                <Link
                                    key={project.id}
                                    to={`/project/${project.id}`}
                                    className="group relative overflow-hidden rounded-xl shadow-md aspect-[4/3] bg-gray-100"
                                >
                                    <img
                                        src={project.images?.[0] || '/placeholder.webp'}
                                        alt={project.title}
                                        loading="lazy"
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                                    <div className="absolute inset-0 p-8 flex flex-col justify-end text-left">
                                        <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-2">{project.category}</p>
                                        <h3 className="text-white text-2xl font-bold mb-1">{project.title}</h3>
                                        <p className="text-white/80 text-sm">{project.location}</p>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                    <Link to="/works" className="inline-flex items-center gap-3 text-[#0E2C48] border-2 border-[#0E2C48] hover:bg-[#0E2C48] hover:text-white px-10 py-4 rounded-xl font-bold transition-all shadow-sm">
                        View All Projects <ArrowRight size={20} />
                    </Link>
                </div>
            </motion.section>

            {/* Testimonials */}
            <motion.section 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="py-[40px] lg:py-[60px] bg-white overflow-hidden border-y border-gray-100 h-auto"
            >
                <div className="container mx-auto px-4 lg:px-5 max-w-[1200px] mb-10 text-center">
                    <h2 className="text-[28px] md:text-[36px] font-extrabold text-[#0E2C48] mb-3 tracking-tight">What Our Clients Say</h2>
                    <p className="text-gray-500 text-[15px] md:text-[16px] font-medium">Trusted by homeowners across the city.</p>
                </div>

                {/* Scrolling Track */}
                <div className="relative w-full overflow-hidden flex">
                    <div className="flex gap-8 animate-scroll hover:[animation-play-state:paused] w-max pr-8 px-8">
                        {loadingTestimonials ? (
                            Array(4).fill(0).map((_, i) => (
                                <div key={i} className="bg-white rounded-xl p-8 min-w-[320px] max-w-[320px] lg:min-w-[400px] lg:max-w-[400px] border border-gray-100 flex flex-col">
                                    <div className="flex gap-1 mb-6">
                                        {Array(5).fill(0).map((_, j) => <div key={j} className="w-4 h-4 skeleton rounded-sm"></div>)}
                                    </div>
                                    <div className="h-4 w-full skeleton mb-3 rounded-md"></div>
                                    <div className="h-4 w-5/6 skeleton mb-3 rounded-md"></div>
                                    <div className="h-4 w-4/6 skeleton mb-8 rounded-md"></div>
                                    <div className="h-5 w-24 skeleton mb-2 rounded-md"></div>
                                    <div className="h-3 w-16 skeleton rounded-md"></div>
                                </div>
                            ))
                        ) : (
                            [...testimonials, ...testimonials].map((t, idx) => (
                                <div key={idx} className="bg-gray-50 rounded-xl p-8 min-w-[320px] max-w-[320px] lg:min-w-[400px] lg:max-w-[400px] border border-gray-100 transition-shadow hover:shadow-lg">
                                    <div className="flex gap-1 mb-6">
                                        {[...Array(t.stars)].map((_, i) => <Star key={i} size={16} className="fill-[#0E2C48] text-[#0E2C48]" />)}
                                    </div>
                                    <p className="text-gray-700 text-lg leading-relaxed mb-8 italic">"{t.review}"</p>
                                    <div>
                                        <div className="font-bold text-[#0E2C48] text-lg">{t.name}</div>
                                        <p className="text-sm text-gray-500">{t.location}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </motion.section>

            {/* Free Consultation CTA */}
            <motion.section 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="bg-[#0E2C48] text-white py-[40px] lg:py-[60px] text-center relative overflow-hidden h-auto"
            >
                {/* Subtle decorative circle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full pointer-events-none"></div>

                <div className="container mx-auto px-4 lg:px-5 max-w-[900px] relative z-10">
                    <h2 className="text-[28px] md:text-[38px] lg:text-[42px] font-extrabold mb-5 tracking-tight leading-[1.2]">Planning to Build Your Dream Home?</h2>
                    <p className="text-[16px] md:text-[17px] text-white/80 mb-8 mx-auto leading-relaxed font-medium">
                        Schedule a free consultation with our expert engineers today and take the first step towards your dream residence.
                    </p>
                    <Link to="/consultation" className="bg-white text-[#0E2C48] px-8 py-4 rounded-xl font-extrabold text-[16px] hover:bg-gray-100 transition-all shadow-lg hover:-translate-y-1 inline-flex items-center gap-3">
                        Book Free Consultation <ArrowRight size={20} className="text-[#0E2C48]" />
                    </Link>
                </div>
            </motion.section>

        </>
    );
};

export default Home;
