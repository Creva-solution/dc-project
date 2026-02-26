import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X, ZoomIn, Plus, Minus, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const AccordionItem = ({ title, content, isOpen, onClick }) => (
    <div className="border border-gray-100 rounded-lg mb-3 overflow-hidden">
        <button
            className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
            onClick={onClick}
        >
            <span className="font-bold text-primary">{title}</span>
            {isOpen ? <Minus size={18} className="text-accent shrink-0" /> : <Plus size={18} className="text-gray-400 shrink-0" />}
        </button>
        <div className={`px-4 bg-white transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'py-4 opacity-100 max-h-[1000px]' : 'max-h-0 opacity-0 py-0'}`}>
            <ul className="space-y-3">
                {content.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-gray-600">
                        <CheckCircle2 size={18} className="text-green-500 mt-0.5 shrink-0" />
                        <span className="leading-snug">{item.content}</span>
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

const PackageCard = ({ image_url, name, price, price_suffix, sections }) => {
    // Default open the first section if it exists
    const [openSection, setOpenSection] = useState(sections?.[0]?.title || null);

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col hover:-translate-y-1 transition-transform duration-300">
            <div className="h-64 overflow-hidden relative shrink-0">
                <img src={image_url || '/placeholder.png'} alt={name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8">
                    <h3 className="text-3xl font-black text-white">{name}</h3>
                </div>
            </div>
            <div className="p-8 flex-grow">
                <div className="mb-8 flex flex-wrap items-baseline gap-2 pb-6 border-b border-gray-100">
                    <span className="text-4xl font-black text-secondary">{price}</span>
                    {price_suffix && <span className="text-gray-500 font-medium tracking-wide">{price_suffix}</span>}
                </div>

                <div className="space-y-1">
                    {sections && sections.map((section, idx) => (
                        <AccordionItem
                            key={section.id || idx}
                            title={section.title}
                            content={section.items || []}
                            isOpen={openSection === section.title}
                            onClick={() => setOpenSection(openSection === section.title ? null : section.title)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

const Interiors = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [packages, setPackages] = useState([]);
    const [loadingPkgs, setLoadingPkgs] = useState(true);

    // Gallery States
    const [galleryImages, setGalleryImages] = useState([]);
    const [loadingGallery, setLoadingGallery] = useState(true);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const { data: pkgData, error: pkgError } = await supabase
                    .from('interior_packages')
                    .select(`
                        id, name, price, price_suffix, image_url, display_order,
                        interior_sections(id, title, display_order, interior_items(id, content, display_order))
                    `)
                    .eq('is_active', true)
                    .order('display_order', { ascending: true });

                if (pkgError) throw pkgError;

                const sortedPackages = (pkgData || []).map(p => ({
                    ...p,
                    sections: (p.interior_sections || [])
                        .sort((a, b) => a.display_order - b.display_order)
                        .map(s => ({
                            ...s,
                            items: (s.interior_items || []).sort((a, b) => a.display_order - b.display_order)
                        }))
                }));

                setPackages(sortedPackages);
            } catch (err) {
                console.error("Error fetching packages:", err);
            } finally {
                setLoadingPkgs(false);
            }
        };

        const fetchGallery = async () => {
            try {
                const { data, error } = await supabase
                    .from('interior_gallery')
                    .select('*')
                    .eq('is_active', true)
                    .order('display_order', { ascending: true });

                if (error) throw error;
                setGalleryImages(data || []);
            } catch (err) {
                console.error("Error fetching gallery:", err);
            } finally {
                setLoadingGallery(false);
            }
        };

        fetchPackages();
        fetchGallery();
    }, []);

    const openModal = (index) => setSelectedImage(index);
    const closeModal = () => setSelectedImage(null);

    const handlePrev = (e) => {
        e.stopPropagation();
        setSelectedImage(prev => (prev === 0 ? galleryImages.length - 1 : prev - 1));
    };

    const handleNext = (e) => {
        e.stopPropagation();
        setSelectedImage(prev => (prev === galleryImages.length - 1 ? 0 : prev + 1));
    };

    return (
        <>
            {/* Top Banner with Breadcrumbs */}
            <section className="bg-primary pt-32 pb-20 mt-0 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('/images/project_2026-02-25_11.23.39_AM.jpeg')] bg-cover bg-center"></div>
                <div className="container mx-auto px-6 text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Interiors</h1>
                    <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-300">
                        <Link to="/" className="hover:text-white transition">Home</Link>
                        <span>-</span>
                        <span className="text-white">Interiors</span>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-accent font-bold tracking-wider uppercase mb-2 block text-sm">Design Solutions</span>
                        <h2 className="text-3xl md:text-5xl font-black text-primary mb-6">Our Interior Packages</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                            Structured modular concepts tailored to transform your blank spaces into elegant living areas.
                        </p>
                    </div>

                    {loadingPkgs ? (
                        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                            {[1, 2].map(i => <div key={i} className="bg-gray-100 animate-pulse rounded-2xl h-[500px]" />)}
                        </div>
                    ) : packages.length === 0 ? (
                        <div className="text-center py-12 px-6 border border-gray-100 rounded-3xl bg-gray-50 max-w-3xl mx-auto">
                            <h3 className="text-2xl font-bold text-gray-400">Interior packages are currently being updated.</h3>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                            {packages.map((pkg) => (
                                <PackageCard key={pkg.id} {...pkg} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Interior Gallery Section */}
            <section className="py-24 bg-gray-50 border-t border-gray-100">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-accent font-bold tracking-wider uppercase mb-2 block text-sm">Portfolio</span>
                        <h2 className="text-3xl md:text-5xl font-black text-primary mb-6">Interior Gallery</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                            Explore Our Recent Interior Projects.
                        </p>
                    </div>

                    {loadingGallery ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map(i => <div key={i} className="bg-gray-200 animate-pulse rounded-2xl aspect-square w-full" />)}
                        </div>
                    ) : galleryImages.length === 0 ? (
                        <div className="text-center py-12 px-6 text-gray-400 font-bold">More projects arriving soon.</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {galleryImages.map((image, idx) => (
                                <div
                                    key={image.id}
                                    className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer aspect-square"
                                    onClick={() => openModal(idx)}
                                >
                                    <img
                                        src={image.image_url}
                                        alt={image.title || 'Interior Gallery Image'}
                                        loading="lazy"
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                        <h4 className="text-white font-bold text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{image.title}</h4>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Lightbox Modal */}
            {selectedImage !== null && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12 animate-fade-in"
                    onClick={closeModal}
                >
                    <button
                        className="absolute top-6 right-6 text-white/70 hover:text-white transition bg-white/10 p-2 rounded-full hover:bg-red-500 z-50"
                        onClick={closeModal}
                    >
                        <X size={32} />
                    </button>

                    <div className="relative w-full max-w-6xl flex items-center justify-center h-full">
                        <button
                            className="absolute left-0 md:-left-8 text-white/50 hover:text-white hover:scale-110 transition p-2 bg-black/50 rounded-full z-50"
                            onClick={handlePrev}
                        >
                            <ChevronLeft size={48} />
                        </button>

                        <div
                            className="relative max-h-[85vh] w-auto animate-scale-in"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={galleryImages[selectedImage].image_url}
                                alt={galleryImages[selectedImage].title || 'Gallery Focus'}
                                className="max-h-[85vh] max-w-full object-contain rounded-xl shadow-2xl"
                            />

                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent rounded-b-xl">
                                <h3 className="text-white text-xl font-bold">{galleryImages[selectedImage].title}</h3>
                            </div>
                        </div>

                        <button
                            className="absolute right-0 md:-right-8 text-white/50 hover:text-white hover:scale-110 transition p-2 bg-black/50 rounded-full z-50"
                            onClick={handleNext}
                        >
                            <ChevronRight size={48} />
                        </button>
                    </div>

                    <div className="absolute top-6 left-6 text-white/70 font-bold tracking-widest bg-white/10 px-4 py-2 rounded-full text-sm">
                        {selectedImage + 1} / {galleryImages.length}
                    </div>
                </div>
            )}
        </>
    );
};

export default Interiors;
