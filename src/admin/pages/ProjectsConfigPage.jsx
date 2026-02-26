import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, UploadCloud, Images, Edit3 } from 'lucide-react';

const CATEGORIES = ['Residential', 'Commercial', 'Ongoing', 'Completed', 'Interiors'];

const ProjectsConfigPage = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        id: null,
        title: '',
        category: 'Residential',
        location: '',
        description: '',
        images: []
    });

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            setProjects(data || []);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const openModal = (proj = null) => {
        if (proj) {
            setFormData(proj); // 'images' will map to array of URLs cleanly
        } else {
            setFormData({
                id: null, title: '', category: 'Residential', location: '', description: '', images: []
            });
        }
        setIsModalOpen(true);
    };

    const processImage = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    const MAX_WIDTH = 800;
                    if (width > MAX_WIDTH) {
                        height = Math.round((height * MAX_WIDTH) / width);
                        width = MAX_WIDTH;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        resolve(blob);
                    }, 'image/webp', 0.7);
                };
                img.onerror = (err) => reject(err);
            };
            reader.onerror = (err) => reject(err);
        });
    };

    const handleMultipleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        try {
            setUploading(true);
            const uploadedUrls = [];

            // Upload each file and get public URL
            for (const file of files) {
                if (!file.type.startsWith('image/')) {
                    toast.error(`File ${file.name} is not an image.`);
                    continue;
                }

                if (file.size > 3 * 1024 * 1024) {
                    toast.error(`File ${file.name} size safely exceeds 3MB limit.`);
                    continue;
                }

                const webpBlob = await processImage(file);
                const fileName = `prj_${Date.now()}_${Math.random().toString(36).substring(7)}.webp`;
                const filePath = `projects/${fileName}`;

                const { error: uploadError } = await supabase.storage.from('images').upload(filePath, webpBlob, { contentType: 'image/webp' });

                if (uploadError) throw uploadError;

                const { data } = supabase.storage.from('images').getPublicUrl(filePath);
                uploadedUrls.push(data.publicUrl);
            }

            if (uploadedUrls.length > 0) {
                setFormData(prev => ({
                    ...prev,
                    images: [...(prev.images || []), ...uploadedUrls] // Append new URLs
                }));
                toast.success(`${uploadedUrls.length} images uploaded!`);
            }

        } catch (error) {
            toast.error('Error uploading images');
            console.error(error);
        } finally {
            setUploading(false);
            // Reset input so identical files can be selected again if needed
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const removeImage = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, idx) => idx !== indexToRemove)
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (formData.id) {
                const { error } = await supabase.from('projects').update({
                    title: formData.title,
                    category: formData.category,
                    location: formData.location,
                    description: formData.description,
                    images: formData.images,
                }).eq('id', formData.id);

                if (error) throw error;
                toast.success("Project updated successfully!");
            } else {
                const { error } = await supabase.from('projects').insert([{
                    title: formData.title,
                    category: formData.category,
                    location: formData.location,
                    description: formData.description,
                    images: formData.images,
                    status: 'Completed' // default per schema
                }]);

                if (error) throw error;
                toast.success("Project created successfully!");
            }
            setIsModalOpen(false);
            fetchProjects();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to permanently delete this project?")) return;
        try {
            const { error } = await supabase.from('projects').delete().eq('id', id);
            if (error) throw error;
            toast.success("Project deleted!");
            fetchProjects();
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="animate-fade-in max-w-7xl mx-auto pb-20 p-2 md:p-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-primary tracking-tight mb-2">Projects Portfolio</h1>
                    <p className="text-gray-500 font-medium text-sm">Upload architectural imagery and assign categories to display on the "Our Works" page.</p>
                </div>
                <button onClick={() => openModal()} className="bg-primary hover:bg-secondary text-white shrink-0 font-bold px-6 py-3 rounded-xl flex items-center gap-2 shadow-sm transition">
                    <Plus size={20} /> Add New Project
                </button>
            </div>

            {loading ? (
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                    {[1, 2, 3, 4, 5].map(i => <div key={i} className="bg-gray-200 animate-pulse rounded-2xl w-full h-[250px]" />)}
                </div>
            ) : projects.length === 0 ? (
                <div className="bg-white rounded-2xl p-16 text-center border border-gray-100 shadow-sm">
                    <Images size={48} className="mx-auto text-blue-100 mb-4" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Your Portfolio is Empty</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">Upload beautiful project imagery, define categories, and showcase your best work directly to users.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {projects.map((proj) => (
                        <div key={proj.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-lg transition-all duration-300 flex flex-col">
                            {/* Image Container */}
                            <div className="relative h-48 bg-gray-100 overflow-hidden">
                                {proj.images && proj.images.length > 0 ? (
                                    <>
                                        <img src={proj.images[0]} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        {proj.images.length > 1 && (
                                            <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                                                <Images size={12} /> +{proj.images.length - 1} View
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold bg-[#f8fafc]">No Cover Image</div>
                                )}

                                {/* Hover Actions Overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                                    <button onClick={() => openModal(proj)} className="w-10 h-10 bg-white rounded-full text-blue-600 flex items-center justify-center hover:scale-110 transition shadow-lg"><Edit3 size={18} strokeWidth={2.5} /></button>
                                    <button onClick={() => handleDelete(proj.id)} className="w-10 h-10 bg-white rounded-full text-red-500 flex items-center justify-center hover:scale-110 transition shadow-lg"><Trash2 size={18} strokeWidth={2.5} /></button>
                                </div>
                            </div>

                            {/* Card Details */}
                            <div className="p-5 flex-1 flex flex-col">
                                <span className={`inline-block px-2.5 py-1 rounded flex-wrap text-[10px] uppercase font-black tracking-wider w-fit mb-3 ${proj.category === 'Residential' ? 'bg-blue-50 text-blue-600' :
                                    proj.category === 'Commercial' ? 'bg-orange-50 text-orange-600' :
                                        proj.category === 'Interiors' ? 'bg-purple-50 text-purple-600' :
                                            'bg-emerald-50 text-emerald-600'
                                    }`}>
                                    {proj.category}
                                </span>
                                <h3 className="font-extrabold text-gray-900 text-lg leading-tight truncate">{proj.title}</h3>
                                <p className="text-gray-500 text-sm mt-1 mb-3">{proj.location}</p>

                                <p className="text-gray-400 text-xs mt-auto line-clamp-2 leading-relaxed">
                                    {proj.description || "No description provided. Click edit to add project details."}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Configurations */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-slide-up my-8 h-fit max-h-[90vh] flex flex-col">

                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-[#f8fafc] shrink-0">
                            <h3 className="text-2xl font-black text-primary tracking-tight items-center flex gap-2">
                                <Images className="text-blue-400" /> {formData.id ? 'Edit Masterpiece' : 'Upload New Project'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-800 transition bg-white p-1 rounded-md shadow-sm border border-gray-200"><X size={20} /></button>
                        </div>

                        {/* Body Scrollable */}
                        <div className="p-6 md:p-8 overflow-y-auto flex-1 hide-scrollbar">
                            <form id="project-form" onSubmit={handleSave} className="space-y-6">

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Project Title</label>
                                        <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium" placeholder="E.g. The Sapphire Villa" />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Global Category</label>
                                        <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium appearance-none">
                                            {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Site Location</label>
                                    <input type="text" required value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium" placeholder="E.g. OMR, Chennai" />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Deep Description</label>
                                    <textarea rows={4} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium resize-none" placeholder="Elaborate on the architectural significance, client demands, and core materials utilized..." />
                                </div>

                                {/* MULTIPLE IMAGE GALLERY BUILDER */}
                                <div className="pt-4 border-t border-gray-100">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center justify-between mb-4">
                                        Image Gallery ({formData.images?.length || 0})

                                        {/* Hidden Input controlled by custom visually appealing button */}
                                        <input type="file" ref={fileInputRef} multiple accept="image/png, image/jpeg, image/jpg, image/webp" onChange={handleMultipleImageUpload} className="hidden" />

                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={uploading}
                                            className="bg-blue-50 text-primary font-bold px-3 py-1.5 rounded-lg flex items-center gap-2 hover:bg-blue-100 transition disabled:opacity-50"
                                        >
                                            {uploading ? <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" /> : <UploadCloud size={16} />}
                                            {uploading ? 'Processing files...' : 'Upload Photos'}
                                        </button>
                                    </label>

                                    {/* Previews Array */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {(formData.images || []).map((url, idx) => (
                                            <div key={idx} className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-square bg-gray-50">
                                                <img src={url} alt={`Upload ${idx}`} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                                    <button type="button" onClick={() => removeImage(idx)} className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:scale-110 shadow-lg">
                                                        <Trash2 size={14} strokeWidth={3} />
                                                    </button>
                                                </div>
                                                {/* Hero Image Marker */}
                                                {idx === 0 && <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-[9px] font-black uppercase px-2 py-0.5 rounded shadow">Cover</div>}
                                            </div>
                                        ))}

                                        {/* Dropzone Skeleton */}
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="border-2 border-dashed border-gray-300 rounded-xl aspect-square flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-primary hover:border-primary hover:bg-blue-50 cursor-pointer transition"
                                        >
                                            <Plus size={24} />
                                            <span className="text-xs font-bold">Add Image</span>
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-gray-400 mt-3 font-medium">The first image applied acts as the <strong className="text-gray-500">primary cover photo</strong> globally. Drag and drop features coming soon. Recommended ratio: 4:3 or 16:9.</p>
                                </div>

                            </form>
                        </div>

                        {/* Sticky Footer */}
                        <div className="p-6 border-t border-gray-100 bg-[#f8fafc] flex justify-end gap-3 shrink-0">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition">Cancel</button>
                            <button type="submit" form="project-form" className="px-8 py-3 rounded-xl font-bold text-white bg-primary hover:bg-secondary transition shadow-md shadow-primary/20">
                                {formData.id ? 'Save Map to DB' : 'Publish Portfolio'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectsConfigPage;
