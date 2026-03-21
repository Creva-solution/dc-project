import { Link } from 'react-router-dom';
import { Target, Eye, ShieldCheck, Users, Briefcase } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

const About = () => {
    const [team, setTeam] = useState([]);
    const [loadingTeam, setLoadingTeam] = useState(true);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                setLoadingTeam(true);
                const { data, error } = await supabase
                    .from('team_members')
                    .select('*')
                    .order('order', { ascending: true });

                if (error) throw error;
                setTeam(data || []);
            } catch (error) {
                console.error("Error fetching team:", error.message);
            } finally {
                setLoadingTeam(false);
            }
        };

        fetchTeam();
    }, []);

    return (
        <>
            {/* Top Banner with Breadcrumbs */}
            <motion.section 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="bg-primary pt-32 pb-20 mt-0 relative overflow-hidden"
            >
                <div className="absolute inset-0 opacity-10 bg-[url('/images/project_2026-02-25_11.23.39_AM.webp')] bg-cover bg-center"></div>
                <div className="container mx-auto px-6 text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4">About Us</h1>
                    <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-300">
                        <Link to="/" className="hover:text-white transition">Home</Link>
                        <span>-</span>
                        <span className="text-white">About Us</span>
                    </div>
                </div>
            </motion.section>

            {/* Main Content - Two Column Layout */}
            <motion.section 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="py-24 bg-white"
            >
                <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left Side: Text */}
                    <div>
                        <span className="text-accent font-bold tracking-wider uppercase mb-2 block text-sm border-l-4 border-accent pl-3">About</span>
                        <h2 className="text-3xl md:text-5xl font-black text-primary mb-6 leading-tight">
                            DC Constructions
                        </h2>
                        <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                            At DC Constructions, we create more than homes — we craft timeless living spaces defined by elegance, precision, and uncompromising quality. Our end-to-end residential construction services are designed for clients who seek sophistication, structural excellence, and enduring value.
                        </p>
                        <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                            Every project is thoughtfully planned and meticulously executed, blending architectural beauty with engineering strength. From concept to completion, we ensure seamless coordination, superior materials, and flawless workmanship.
                        </p>

                        <div className="grid grid-cols-2 gap-6 mt-8 pt-8 border-t border-gray-100">
                            <div>
                                <h4 className="text-4xl font-black text-primary mb-2">6+</h4>
                                <p className="text-gray-500 font-medium text-sm">Years of Experience</p>
                            </div>
                            <div>
                                <h4 className="text-4xl font-black text-primary mb-2">30+</h4>
                                <p className="text-gray-500 font-medium text-sm">Projects Delivered</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Image */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary translate-x-4 translate-y-4 rounded-xl z-0"></div>
                        <img src="/images/About.webp" alt="DC Constructions Site" className="relative z-10 w-full rounded-xl shadow-xl object-cover h-[500px]" />

                        {/* Overlay badge */}
                        <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-xl shadow-2xl z-20 flex items-center gap-4 border border-gray-100 hidden md:flex">
                            <div className="bg-accent text-white p-4 rounded-full">
                                <Briefcase size={28} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Certified</p>
                                <p className="text-primary font-black text-xl">Professionals</p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Vision Section - Enhanced Brand Design */}
            <motion.section 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="relative py-20 bg-[#0E2C48] overflow-hidden"
            >
                {/* Geometric Pattern Overlays */}
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(30deg,#fff_12%,transparent_12.5%,transparent_87%,#fff_87.5%,#fff),linear-gradient(150deg,#fff_12%,transparent_12.5%,transparent_87%,#fff_87.5%,#fff),linear-gradient(30deg,#fff_12%,transparent_12.5%,transparent_87%,#fff_87.5%,#fff),linear-gradient(150deg,#fff_12%,transparent_12.5%,transparent_87%,#fff_87.5%,#fff),linear-gradient(60deg,#fff_25%,transparent_25.5%,transparent_75%,#fff_75%,#fff),linear-gradient(60deg,#fff_25%,transparent_25.5%,transparent_75%,#fff_75%,#fff)] bg-[length:80px_140px]"></div>
                </div>
                
                {/* Accent Red Dot */}
                <div className="absolute top-8 left-8 w-2 h-2 bg-red-600 rounded-full animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.8)]"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">Our Vision</h2>
                        <div className="w-16 h-1 bg-red-600 mx-auto mb-8"></div>
                        <p className="text-gray-100 text-[17px] md:text-lg leading-relaxed font-medium text-justify md:text-center">
                            To create spaces that enhance the quality of life we saw the stress and frustration people were enduring to accomplish what should be a joyful milestone in their lives. We simplified the custom and new home construction processes through thoughtful consideration and smart solutions.
                        </p>
                    </div>
                </div>
            </motion.section>

            {/* Core Values */}
            <motion.section 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="py-24 bg-gray-50 border-t border-gray-100"
            >
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-primary mb-16">Our Core Values</h2>

                    <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { icon: ShieldCheck, title: "Uncompromising Quality", desc: "Premium materials and standard procedures." },
                            { icon: Users, title: "Customer Centric", desc: "Your safety and budget are our priorities." },
                            { icon: Briefcase, title: "Team Work", desc: "Collaborative effort with leading architects." },
                            { icon: Target, title: "Innovation", desc: "Smart engineering and sustainable builds." }
                        ].map((Value, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-2xl shadow border border-gray-100 hover:shadow-xl transition duration-300">
                                <Value.icon className="text-secondary w-12 h-12 mx-auto mb-6" />
                                <h4 className="text-xl font-bold text-primary mb-3">{Value.title}</h4>
                                <p className="text-gray-500">{Value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Team CTA */}
            <motion.section 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="py-20 bg-primary text-center"
            >
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-white mb-6">Experience Excellence With Us</h2>
                    <p className="text-gray-300 mb-8 max-w-xl mx-auto">We back our projects with 6+ years of certified architectural expertise, crafting timeless living spaces since 2020.</p>
                    <Link to="/contact" className="bg-secondary text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-white hover:text-primary transition duration-300">
                        Get in Touch
                    </Link>
                </div>
            </motion.section>

            {/* Our Team Section */}
            <motion.section 
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="py-20 bg-gray-50 border-t border-gray-100"
            >
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-accent font-bold tracking-wider uppercase mb-2 block text-sm">Professional Experts</span>
                        <h2 className="text-3xl md:text-5xl font-black text-primary mb-6">Our Team</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                            Meet the experts behind our success.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {loadingTeam ? (
                            Array(4).fill(0).map((_, i) => (
                                <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-96 flex flex-col p-4">
                                    <div className="h-48 w-full skeleton rounded-lg mb-6"></div>
                                    <div className="h-6 w-3/4 mx-auto skeleton rounded-md mb-3"></div>
                                    <div className="h-4 w-1/2 mx-auto skeleton rounded-md mb-6"></div>
                                    <div className="h-3 w-full skeleton rounded-md mb-2"></div>
                                    <div className="h-3 w-5/6 mx-auto skeleton rounded-md"></div>
                                </div>
                            ))
                        ) : team.length === 0 ? (
                            <div className="col-span-1 sm:col-span-2 lg:col-span-4 text-center py-10 text-gray-400 font-bold border-2 border-dashed border-gray-200 rounded-xl">
                                Team members will be updated soon.
                            </div>
                        ) : (
                            team.map((member) => (
                                <div key={member.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition duration-300 group flex flex-col">
                                    <div className="h-64 bg-gray-200 overflow-hidden relative shrink-0">
                                        <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition duration-300 z-10"></div>
                                        {member.image ? (
                                            <img src={member.image} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-500" loading="lazy" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">No Image</div>
                                        )}
                                    </div>
                                    <div className="p-6 text-center flex-1 flex flex-col">
                                        <h4 className="text-xl font-bold text-primary mb-1">{member.name}</h4>
                                        <p className="text-accent font-semibold text-sm mb-3">{member.role}</p>
                                        <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto flex-1">{member.description}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </motion.section>
        </>
    );
};

export default About;

