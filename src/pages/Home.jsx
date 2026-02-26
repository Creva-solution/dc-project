import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, Medal, Briefcase, Calculator, Building, LayoutTemplate, PenTool, CheckCircle, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';




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

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (!e.target.closest('.interactive-card')) {
                setActiveCardId(null);
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
            <section className="relative overflow-hidden bg-white min-h-[85vh] flex items-center">
                {/* Mobile Background Image & Overlay */}
                <div className="absolute inset-0 md:hidden z-0">
                    <img src="/images/project_2026-02-25_11.23.42_AM_1.jpeg" alt="Construction Site" className="w-full h-full object-cover" />
                    <div className="absolute inset-0" style={{ backgroundColor: 'rgba(11, 61, 145, 0.75)' }}></div>
                </div>

                {/* Subtle Grid Background (Desktop only) */}
                <div className="hidden md:block absolute inset-0 hero-bg-grid z-0 pointer-events-none"></div>

                <div className="container mx-auto px-6 grid md:grid-cols-2 items-center gap-12 relative z-10 py-[120px] md:py-0">
                    {/* Left Text */}
                    <div className="max-w-2xl text-left flex flex-col items-start w-full">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white md:text-gray-900 leading-[1.2] mb-6 drop-shadow-lg md:drop-shadow-none">
                            Quality Construction, <br className="hidden md:block" />Honest Service, <br className="hidden md:block" />Great Value
                        </h1>
                        <p className="text-lg md:text-xl text-gray-200 md:text-gray-500 mb-8 font-medium max-w-lg">
                            We offer End to End Construction Services For Every Budget !!!
                        </p>
                        <Link to="/about" className="bg-white text-[#0B3D91] md:bg-accent md:text-white px-8 py-4 rounded-md font-bold hover:bg-gray-100 md:hover:bg-[#113250] transition shadow-lg hover:shadow-xl inline-flex items-center gap-3">
                            Discover More <ArrowRight size={20} />
                        </Link>
                    </div>

                    {/* Right Image/Illustration Area (Desktop) */}
                    <div className="hidden md:flex relative w-full h-[500px] lg:h-[600px] justify-center items-center">
                        <img src="/images/project_2026-02-25_11.23.42_AM_1.jpeg" alt="Construction Illustration" className="max-w-full max-h-full object-cover rounded-3xl shadow-xl border-4 border-white transform rotate-2" />
                    </div>
                </div>
            </section>

            {/* Brand Partners Section (Logo Strip) */}
            <section className="py-12 bg-[#F5F7FA] overflow-hidden border-b border-gray-100 border-t">
                {/* Scroll Container with Fade Edges */}
                <div className="relative w-full overflow-hidden max-w-[100vw] flex group">
                    {/* Left & Right Gradients */}
                    <div className="absolute top-0 left-0 w-16 md:w-32 h-full bg-gradient-to-r from-[#F5F7FA] to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute top-0 right-0 w-16 md:w-32 h-full bg-gradient-to-l from-[#F5F7FA] to-transparent z-10 pointer-events-none"></div>

                    {/* Scrolling Track */}
                    {!loadingPartnerLogos && partnerLogos.length > 0 && (
                        <div className="flex gap-[60px] animate-scroll group-hover:[animation-play-state:paused] w-max pr-[60px] items-center text-2xl md:text-3xl font-black text-[#D1D5DB] tracking-tighter uppercase" style={{ animationDuration: '25s' }}>
                            {[...partnerLogos, ...partnerLogos, ...partnerLogos, ...partnerLogos].map((brand, idx) => (
                                <div key={idx} className="flex items-center justify-center flex-shrink-0 cursor-pointer select-none">
                                    <img
                                        src={brand.image_url}
                                        alt={`${brand.name} logo`}
                                        loading="lazy"
                                        className="h-[40px] md:h-[50px] lg:h-[60px] w-auto object-contain grayscale opacity-80 hover:grayscale-0 hover:opacity-100 hover:scale-105 transition-all duration-300 ease-in-out"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Premium About Us Section */}
            <section className="py-28 bg-white relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                        {/* Premium Image Layout */}
                        <div className="relative group">
                            {/* Decorative Background Block */}
                            <div className="absolute -inset-4 bg-gray-50 border border-gray-100 rounded-[2rem] transform -rotate-2 group-hover:rotate-0 transition duration-1000 ease-in-out -z-10"></div>

                            {/* Main Image Container */}
                            <div className="relative rounded-[1.5rem] overflow-hidden shadow-[0_15px_50px_rgba(0,0,0,0.1)]">
                                <img
                                    src="/images/project_2026-02-25_11.23.41_AM_1.jpeg"
                                    alt="Luxury Construction & Interiors"
                                    className="w-full object-cover transform scale-105 group-hover:scale-100 transition duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                                />
                                <div className="absolute inset-0 bg-[#0E2C48]/5 mix-blend-multiply"></div>
                            </div>

                            {/* Floating Prestige Badge */}
                            <div className="absolute -bottom-8 -right-4 lg:-right-8 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hidden md:block animate-float">
                                <div className="text-primary text-5xl font-black mb-1">6+</div>
                                <div className="text-gray-500 font-medium tracking-wide text-sm">Years of Excellence</div>
                            </div>
                        </div>

                        {/* Premium Content Body */}
                        <div className="flex flex-col justify-center">

                            {/* Tagline Badge */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-[2px] w-12 bg-secondary"></div>
                                <span className="text-secondary font-bold tracking-widest uppercase text-sm">Where Vision Meets Craftsmanship</span>
                            </div>

                            <h2 className="text-4xl md:text-5xl lg:text-[44px] font-extrabold text-[#0E2C48] leading-[1.2] mb-8 tracking-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
                                Built with Precision. <br />Defined by Elegance.
                            </h2>

                            <div className="space-y-6">
                                <p className="text-gray-600 leading-relaxed text-[17px]">
                                    At DC Constructions, we create more than homes — we craft timeless living spaces defined by elegance, precision, and uncompromising quality. Our end-to-end residential construction services are designed for clients who seek sophistication, structural excellence, and enduring value.
                                </p>
                                <p className="text-gray-600 leading-relaxed text-[17px]">
                                    Every project is thoughtfully planned and meticulously executed, blending architectural beauty with engineering strength. From concept to completion, we ensure seamless coordination, superior materials, and flawless workmanship — delivering residences that reflect prestige and permanence.
                                </p>
                                <p className="text-gray-600 leading-relaxed text-[17px]">
                                    We believe luxury is not just about aesthetics; it is about detail, durability, and distinction. With a commitment to transparency, refined execution, and on-time delivery, DC Constructions transforms your vision into an exceptional living experience.
                                </p>
                                <p className="text-[#0E2C48] font-bold italic text-[18px] border-l-4 border-secondary pl-4 py-1 mt-4">
                                    “Engineering Luxury Living. Where Quality Becomes a Statement.”
                                </p>
                            </div>

                            <div className="mt-10">
                                <Link to="/about" className="inline-flex items-center gap-3 text-white bg-[#0E2C48] hover:bg-secondary px-8 py-4 rounded-xl font-bold transition-colors duration-300 shadow-lg hover:shadow-[0_10px_20px_rgba(21,72,117,0.2)]">
                                    Discover Our Heritage <ArrowRight size={20} />
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="section-title">Why Choose Us</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
                        {[
                            { title: 'Quality Materials', icon: Medal },
                            { title: 'Experienced Engineers', icon: Briefcase },
                            { title: 'On-Time Delivery', icon: CheckCircle2 },
                            { title: 'Transparent Pricing', icon: Calculator },
                            { title: 'Dedicated Manager', icon: Building }
                        ].map((feature, i) => (
                            <div key={i} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-lg transition">
                                <feature.icon className="mx-auto text-accent mb-4 w-12 h-12" strokeWidth={1.5} />
                                <h3 className="font-bold text-gray-800">{feature.title}</h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Service Packages */}
            <section className="py-24 bg-white border-t border-gray-100">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16 animate-fade-in">
                        <h2 className="text-[#0E2C48] text-4xl md:text-5xl mb-4" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: '700' }}>Our Service Packages</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto text-lg">Choose the perfect construction package that suits your budget and requirements.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-[30px] items-stretch">

                        {loadingPackages ? (
                            <>
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="animate-pulse bg-gray-100 rounded-[16px] h-[400px] border border-gray-200"></div>
                                ))}
                            </>
                        ) : packages.length === 0 ? (
                            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-10 text-gray-400 font-bold border-2 border-dashed border-gray-200 rounded-xl">
                                Service packages are currently being updated. Check back soon.
                            </div>
                        ) : (
                            packages.slice(0, 3).map((pkg, idx) => {
                                const isActive = activeCardId === `pkg-${pkg.id}`;
                                return (
                                    <div
                                        key={pkg.id}
                                        onClick={() => {
                                            if (window.innerWidth < 1024) {
                                                setActiveCardId(isActive ? null : `pkg-${pkg.id}`);
                                            }
                                        }}
                                        className={`interactive-card relative rounded-[16px] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-300 lg:hover:scale-[1.03] p-10 flex flex-col group bg-white border cursor-pointer lg:cursor-default ${pkg.highlighted ? 'border-primary ring-2 ring-primary/20 shadow-xl' : 'border-gray-100'}`}
                                    >
                                        {/* Optional Badge */}
                                        {pkg.highlighted && (
                                            <div className="absolute top-0 right-0 bg-primary z-20 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-xl shadow-md">
                                                Most Popular
                                            </div>
                                        )}

                                        {/* Hover Graphics */}
                                        <div className={`absolute inset-0 z-0 transition-opacity duration-300 pointer-events-none lg:group-hover:opacity-100 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                                            <img src="/images/project_2026-02-25_11.23.39_AM.jpeg" alt="background" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-gradient-to-br from-[#0E2C48]/95 to-[#184166]/95"></div>
                                        </div>

                                        <span className={`absolute top-2 right-6 text-[100px] lg:text-[110px] font-black transition-colors duration-300 select-none pointer-events-none lg:group-hover:text-white/10 ${isActive ? 'text-white/10' : 'text-gray-900/5'}`}>
                                            0{idx + 1}
                                        </span>

                                        {/* Text Body */}
                                        <div className="relative z-10 flex flex-col h-full items-start pointer-events-none lg:pointer-events-auto">
                                            <div className={`w-16 h-16 bg-[#154875] rounded-full flex items-center justify-center shadow-md mb-8 transition-shadow duration-300 lg:group-hover:shadow-[0_0_30px_rgba(21,72,117,0.8)] animate-float ${isActive ? 'shadow-[0_0_30px_rgba(21,72,117,0.8)]' : ''}`}>
                                                <Building className="text-white w-8 h-8" strokeWidth={1.5} />
                                            </div>
                                            <h3 className={`text-[26px] md:text-[28px] leading-tight font-bold mb-3 transition-colors duration-300 tracking-tight lg:group-hover:text-white ${isActive ? 'text-white' : 'text-[#0E2C48]'}`} style={{ fontFamily: "'Poppins', sans-serif" }}>
                                                {pkg.title}
                                            </h3>
                                            <div className={`text-[19px] font-bold transition-colors duration-300 mb-5 tracking-wide lg:group-hover:text-white ${isActive ? 'text-white' : 'text-[#154875]'}`}>
                                                ₹ {pkg.price} <span className="text-sm font-medium">/ sq.ft</span>
                                            </div>
                                            <p className={`mb-8 text-[15px] leading-relaxed transition-colors duration-300 flex-grow lg:group-hover:text-white/90 ${isActive ? 'text-white/90' : 'text-gray-500'}`}>
                                                {pkg.description}
                                            </p>

                                            <div className={`mt-auto pt-2 overflow-hidden transition-all duration-300 lg:group-hover:max-h-12 lg:group-hover:opacity-100 lg:group-hover:translate-y-0 ${isActive ? 'max-h-12 opacity-100 translate-y-0 pointer-events-auto' : 'max-h-0 opacity-0 translate-y-4 pointer-events-none'} lg:pointer-events-auto`}>
                                                <Link to="/packages/construction" className="inline-flex items-center gap-2 font-bold text-white relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] after:bg-white pb-1" onClick={(e) => e.stopPropagation()}>
                                                    View Complete Details <ArrowRight size={20} />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </section>

            {/* Featured Projects Grid */}
            <section className="py-24 bg-gray-50 border-t border-gray-200" id="projects">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="section-title mb-16">Featured Projects</h2>
                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        {loadingFeaturedProjects ? (
                            Array(6).fill(0).map((_, i) => (
                                <div key={i} className="animate-pulse rounded-[1.5rem] w-full aspect-[4/3] bg-gray-200"></div>
                            ))
                        ) : featuredProjects.length === 0 ? (
                            <div className="col-span-1 md:col-span-3 text-center py-10 text-gray-400 font-bold border-2 border-dashed border-gray-200 rounded-xl">
                                Featured projects loading soon.
                            </div>
                        ) : (
                            featuredProjects.map((project) => {
                                const isActive = activeCardId === `proj-${project.id}`;
                                return (
                                    <div
                                        key={project.id}
                                        onClick={() => {
                                            if (window.innerWidth < 1024) {
                                                setActiveCardId(isActive ? null : `proj-${project.id}`);
                                            }
                                        }}
                                        className="interactive-card relative group overflow-hidden rounded-[1.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.06)] block w-full aspect-[4/3] bg-primary cursor-pointer lg:cursor-default"
                                    >
                                        <Link to={`/project/${project.id}`} className="absolute inset-0 z-0 hidden lg:block" />

                                        <img src={project.images?.[0] || '/placeholder.png'} alt={project.title} loading="lazy" className={`absolute inset-0 w-full h-full object-cover transform transition-transform duration-[400ms] ease-out lg:group-hover:scale-105 ${isActive ? 'scale-105' : 'scale-100'}`} />

                                        <div className={`absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.75)] via-[rgba(0,0,0,0.4)] to-transparent pointer-events-none transition-opacity duration-[400ms] lg:group-hover:opacity-100 ${isActive ? 'opacity-100' : 'opacity-0'}`}></div>

                                        <div className={`absolute inset-0 flex flex-col justify-end items-start p-6 md:p-8 z-10 transition-opacity duration-[400ms] lg:group-hover:opacity-100 ${isActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none lg:pointer-events-auto'}`}>
                                            <div className={`transform transition-all duration-[400ms] ease-out flex flex-col items-start w-full lg:group-hover:translate-y-0 ${isActive ? 'translate-y-0' : 'translate-y-6'}`}>

                                                <div className="text-white font-bold tracking-widest uppercase text-[10px] mb-3 px-3 py-1 bg-white/20 rounded backdrop-blur-md border border-white/30 shadow-sm pointer-events-none">
                                                    {project.category}
                                                </div>

                                                <h3 className="text-[22px] md:text-[28px] font-extrabold mb-2 text-[#FFFFFF] drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] tracking-wide font-['Poppins',_sans-serif] leading-tight pointer-events-none">
                                                    {project.title}
                                                </h3>

                                                <p className="text-[#F1F5F9] font-medium flex items-center gap-1.5 drop-shadow-sm mb-5 text-[14px] pointer-events-none">
                                                    {project.location}
                                                </p>

                                                <Link
                                                    to={`/project/${project.id}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="inline-flex items-center gap-2 text-white font-bold tracking-widest uppercase border border-white/40 hover:border-white bg-white/10 hover:bg-white hover:text-black backdrop-blur-md px-6 py-2.5 rounded-lg transition-colors shadow-lg text-[12px]"
                                                >
                                                    Explore Project <ArrowRight size={16} />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                    <Link to="/works" className="inline-flex items-center gap-3 text-white bg-[#0E2C48] hover:bg-secondary px-8 py-4 rounded-xl font-bold transition-colors duration-300 shadow-lg hover:shadow-[0_10px_20px_rgba(21,72,117,0.2)]">View All Projects <ArrowRight size={20} /></Link>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-[80px] bg-[#F5F7FA] overflow-hidden">
                <div className="container mx-auto px-6 mb-12 text-center">
                    <h2 className="text-[#0E2C48] text-4xl md:text-5xl font-black mb-4">What Our Clients Say</h2>
                    <p className="text-gray-500 text-lg">Trusted by homeowners and developers across the city.</p>
                </div>

                {/* Scroll Container with Fade Edges */}
                <div className="relative w-full overflow-hidden max-w-[100vw] flex group">
                    {/* Left & Right Gradients */}
                    <div className="absolute top-0 left-0 w-16 md:w-32 h-full bg-gradient-to-r from-[#F5F7FA] to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute top-0 right-0 w-16 md:w-32 h-full bg-gradient-to-l from-[#F5F7FA] to-transparent z-10 pointer-events-none"></div>

                    {/* Scrolling Track */}
                    <div className="flex gap-[30px] animate-scroll group-hover:[animation-play-state:paused] w-max pr-[30px]">
                        {loadingTestimonials ? (
                            <div className="px-6 py-10 w-full text-center text-gray-500 font-medium">Loading testimonials...</div>
                        ) : testimonialsError ? (
                            <div className="px-6 py-10 w-full text-center text-red-500 font-medium">Error loading testimonials: {testimonialsError}</div>
                        ) : testimonials.length === 0 ? (
                            <div className="px-6 py-10 w-full text-center text-gray-500 font-medium">No testimonials available.</div>
                        ) : (
                            [...testimonials, ...testimonials].map((t, idx) => (
                                <div key={idx} className="bg-white rounded-[16px] shadow-[0_10px_30px_rgba(0,0,0,0.08)] p-[25px] min-w-[320px] max-w-[320px] lg:min-w-[400px] lg:max-w-[400px] hover:scale-[1.05] hover:shadow-[0_15px_40px_rgba(0,0,0,0.12)] transition-all duration-300 flex flex-col justify-between cursor-pointer">
                                    <div>
                                        <div className="flex gap-1 mb-4">
                                            {[...Array(t.stars)].map((_, i) => <Star key={i} size={20} fill="#154875" stroke="none" />)}
                                        </div>
                                        <p className="text-[#333] text-[16px] leading-relaxed mb-6 font-medium">"{t.review}"</p>
                                    </div>
                                    <div>
                                        <div className="font-bold text-[#154875] text-lg">{t.name}</div>
                                        <p className="text-sm text-gray-500">{t.location}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* Free Consultation Banner Full Width Blue */}
            <section className="bg-primary text-white py-20 text-center border-b-8 border-accent">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl lg:text-5xl font-black mb-8">Planning to Build Your Dream Home?</h2>
                    <p className="text-lg text-blue-200 mb-10 max-w-2xl mx-auto font-medium">Schedule a free consultation with our expert engineers today and take the first step towards a stress-free construction experience.</p>
                    <Link to="/consultation" className="bg-accent text-white px-10 py-5 rounded font-bold text-lg hover:bg-white hover:text-accent transition shadow-xl inline-flex items-center gap-3">
                        Book Free Consultation <ArrowRight size={24} />
                    </Link>
                </div>
            </section>

        </>
    );
};

export default Home;
