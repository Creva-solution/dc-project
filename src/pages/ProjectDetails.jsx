import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const ProjectDetails = () => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchProject = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('projects')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                setProject(data);
            } catch (error) {
                console.error("Error fetching project details:", error.message);
                setProject(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center bg-gray-50">
                <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full shadow-lg"></div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50">
                <h2 className="text-3xl font-bold text-primary mb-4">Project Not Found</h2>
                <Link to="/" className="text-accent hover:underline flex items-center gap-2">
                    <ArrowLeft size={20} /> Back to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Hero Section */}
            <section className="relative h-[60vh] lg:h-[75vh] w-full mt-0">
                <div className="absolute inset-0 bg-primary/40 z-10"></div>
                <img
                    src={project.images?.[0] || '/placeholder.webp'}
                    alt={project.title}
                    className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 z-20 flex flex-col justify-end container mx-auto px-6 pb-16 lg:pb-24">
                    <Link to="/works" className="text-white hover:text-accent flex items-center gap-2 mb-6 w-max font-medium transition-colors">
                        <ArrowLeft size={20} /> Back to Projects
                    </Link>
                    <div className="inline-flex max-w-max items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full px-4 py-1.5 text-sm font-bold tracking-widest uppercase mb-4">
                        {project.category}
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 drop-shadow-lg leading-tight">
                        {project.title}
                    </h1>
                    <div className="flex items-center gap-2 text-gray-200 text-lg font-medium drop-shadow-md">
                        <MapPin size={20} className="text-accent" /> {project.location} <span className="mx-2 opacity-50">|</span> {project.category}
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="container mx-auto px-6 py-16 lg:py-24">
                <div className="grid lg:grid-cols-3 gap-16">

                    {/* Left/Main Column */}
                    <div className="lg:col-span-2">
                        <h2 className="text-3xl font-extrabold text-primary mb-6">Project Overview</h2>
                        <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 mb-10">
                            <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">
                                {project.description || "No description provided."}
                            </p>
                        </div>

                        {project.images?.length > 1 && (
                            <>
                                <h2 className="text-3xl font-extrabold text-primary mb-6">Project Gallery</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {project.images.slice(1).map((imgUrl, idx) => (
                                        <div key={idx} className="aspect-[4/3] rounded-xl overflow-hidden shadow-sm group">
                                            <img
                                                src={imgUrl}
                                                alt={`${project.title} Gallery ${idx + 1}`}
                                                loading="lazy"
                                                className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500 ease-in-out"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Right/Sidebar Column */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-8 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-gray-100 sticky top-28 mt-2">
                            <h3 className="text-2xl font-bold text-primary mb-6">Key Approvals & Standards</h3>

                            <ul className="space-y-4 mb-10">
                                {[
                                    "Premium Construction Standards",
                                    "Vastu Compliant Design",
                                    "Safety Protocol Ensured",
                                    "High-Quality Materials Used"
                                ].map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                        <CheckCircle className="text-secondary shrink-0 mt-0.5" size={20} />
                                        <span className="text-gray-700 font-medium">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="bg-primary p-6 rounded-xl text-center">
                                <h4 className="text-white font-bold mb-2">Want to build something similar?</h4>
                                <p className="text-gray-300 text-sm mb-6">Let&apos;s discuss your unique ideas with our expert engineers.</p>
                                <Link to="/consultation" className="block w-full bg-accent text-white py-3 rounded-lg font-bold hover:bg-white hover:text-primary transition shadow-md">
                                    Book Free Consultation
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
};

export default ProjectDetails;
