import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Works = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    const categories = ['All', 'Residential', 'Commercial', 'Ongoing', 'Completed', 'Interiors'];

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
                if (error) throw error;
                setProjects(data || []);
            } catch (error) {
                console.error("Error fetching projects:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const filteredProjects = filter === 'All'
        ? projects
        : projects.filter(p => p.category === filter);

    return (
        <>
            <motion.section 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="bg-primary pt-32 pb-20 mt-0"
            >
                <div className="container mx-auto px-6 text-center text-white">
                    <h1 className="text-4xl md:text-6xl font-black mb-6">Our Master <span className="text-secondary">Projects</span></h1>
                    <p className="text-xl max-w-2xl mx-auto opacity-90">A gallery showcasing our commitment to quality.</p>
                </div>
            </motion.section>

            <motion.section 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="py-24 bg-gray-50"
            >
                <div className="container mx-auto px-6">
                    <div className="flex flex-wrap justify-center gap-4 mb-16">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-[300ms] ease-in-out ${filter === cat
                                    ? 'bg-secondary text-[#FFFFFF] shadow-sm'
                                    : 'bg-white text-gray-700 hover:bg-secondary hover:text-[#FFFFFF] hover:shadow-sm'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {loading ? (
                            Array(6).fill(0).map((_, i) => (
                                <div key={i} className="rounded-[1.5rem] w-full aspect-[4/3] skeleton"></div>
                            ))
                        ) : filteredProjects.length === 0 ? (
                            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-10 text-gray-400 font-bold border-2 border-dashed border-gray-200 rounded-xl">
                                No projects found matching the selected category.
                            </div>
                        ) : (
                            filteredProjects.map(project => (
                                <Link to={`/project/${project.id}`} key={project.id} className="relative group overflow-hidden rounded-[1.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.06)] block w-full aspect-[4/3] bg-primary">
                                    <img src={project.images?.[0] || '/placeholder.webp'} alt={project.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-[400ms] ease-out" />

                                    {/* Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.75)] via-[rgba(0,0,0,0.4)] to-transparent opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-[400ms] pointer-events-none"></div>

                                    {/* Content Details */}
                                    <div className="absolute inset-0 flex flex-col justify-end items-start p-6 md:p-8 z-10 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-[400ms]">
                                        <div className="transform translate-y-0 lg:translate-y-6 lg:group-hover:translate-y-0 transition-all duration-[400ms] ease-out flex flex-col items-start w-full">

                                            <div className="text-white font-bold tracking-widest uppercase text-[10px] mb-3 px-3 py-1 bg-white/20 rounded backdrop-blur-md border border-white/30 shadow-sm">
                                                {project.category}
                                            </div>

                                            <h3 className="text-[22px] md:text-[28px] font-extrabold mb-2 text-[#FFFFFF] drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] tracking-wide font-['Poppins',_sans-serif] leading-tight">
                                                {project.title}
                                            </h3>

                                            <p className="text-[#F1F5F9] font-medium flex items-center gap-1.5 drop-shadow-sm mb-0 lg:mb-5 text-[14px]">
                                                <MapPin size={16} className="text-white" /> {project.location}
                                            </p>

                                            <span className="hidden lg:inline-flex items-center gap-2 text-white font-bold tracking-widest uppercase border border-white/40 hover:border-white bg-white/10 hover:bg-white hover:text-black backdrop-blur-md px-6 py-2.5 rounded-lg transition-colors shadow-lg text-[12px]">
                                                Explore Project <ArrowRight size={16} />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </motion.section>
        </>
    );
};

export default Works;
