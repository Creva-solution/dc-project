import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import {
    Image as ImageIcon,
    Package as PackageIcon,
    MessageSquareQuote,
    Plus,
    Edit2,
    Trash2,
    X,
    UploadCloud,
    Star,
    Briefcase
} from 'lucide-react';

const HomeConfigPage = () => {
    const [activeTab, setActiveTab] = useState('logo');

    return (
        <div className="animate-fade-in max-w-7xl mx-auto">
            <h1 className="text-3xl font-black text-primary tracking-tight mb-2">Home Page Management</h1>
            <p className="text-gray-500 font-medium text-sm mb-8">Manage the homepage logic: logo, featured packages, and testimonials.</p>

            {/* Tabs */}
            <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 p-1 mb-6 gap-1 w-full md:w-fit cursor-pointer overflow-x-auto">
                {[
                    { id: 'logo', label: 'Logo Management', icon: ImageIcon },
                    { id: 'partnerLogos', label: 'Partner Logos', icon: Briefcase },
                    { id: 'packages', label: 'Packages Summary', icon: PackageIcon },
                    { id: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote },
                ].map(tab => (
                    <div
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all duration-200 shrink-0 ${activeTab === tab.id ? 'bg-blue-50 text-primary shadow-sm' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
                    >
                        <tab.icon size={18} /> {tab.label}
                    </div>
                ))}
            </div>

            {/* Render Tab Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[500px] overflow-hidden">
                {activeTab === 'logo' && <LogoManagementTab />}
                {activeTab === 'partnerLogos' && <PartnerLogosTab />}
                {activeTab === 'packages' && <PackagesManagementTab />}
                {activeTab === 'testimonials' && <TestimonialsManagementTab />}
            </div>
        </div>
    );
};

// ==========================================
// 1. LOGO MANAGEMENT TAB
// ==========================================
const LogoManagementTab = () => {
    const [uploading, setUploading] = useState(false);
    const [logoPreview, setLogoPreview] = useState('/images/dc-logo.svg'); // Default fallback
    const fileRef = useRef(null);

    // Try fetching the logo from Supabase Storage if it exists
    useEffect(() => {
        const { data } = supabase.storage.from('images').getPublicUrl('branding/logo.png');
        if (data && data.publicUrl) {
            // Basic check: we won't know if the file exists just from getPublicUrl, but we can try loading it.
            // To keep it simple, we just assume the default logo path unless updated online.
        }
    }, []);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);

            // Upload to Supabase replacing the generic "branding/logo.png"
            const { error } = await supabase.storage
                .from('images')
                .upload('branding/logo.png', file, { upsert: true, cacheControl: '0' });

            if (error) throw error;

            const { data } = supabase.storage.from('images').getPublicUrl('branding/logo.png');

            // Generate a random query param to force React to bypass image caching
            setLogoPreview(`${data.publicUrl}?t=${new Date().getTime()}`);
            toast.success("Logo successfully updated!");

        } catch (error) {
            toast.error("Failed to upload logo: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="p-8 animate-fade-in">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2"><ImageIcon size={20} className="text-primary" /> Update Brand Logo</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Current Preview */}
                <div className="bg-[#f8fafc] border border-gray-200 border-dashed rounded-xl p-8 flex flex-col items-center justify-center min-h-[250px]">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Live Preview</span>
                    <img src={logoPreview} alt="DC Logo Preview" className="max-h-20 w-auto object-contain drop-shadow" />
                </div>

                {/* Upload Action */}
                <div>
                    <h3 className="font-bold text-gray-800 mb-2">Upload New Identity</h3>
                    <p className="text-sm text-gray-500 mb-6">We recommend uploading a clean, transparent PNG or SVG format. The uploaded logo will propagate across the public website's navbar and footer.</p>

                    <button
                        onClick={() => fileRef.current?.click()}
                        disabled={uploading}
                        className="bg-primary hover:bg-secondary text-white font-bold py-3.5 px-6 rounded-xl transition shadow flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {uploading ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" /> : <UploadCloud size={20} />}
                        {uploading ? 'Processing File...' : 'Select & Replace Logo'}
                    </button>
                    <input type="file" ref={fileRef} accept=".png,.svg,.jpg,.jpeg" onChange={handleUpload} className="hidden" />
                </div>
            </div>
        </div>
    );
};

// ==========================================
// 2. PACKAGES SUMMARY TAB
// ==========================================
const PackagesManagementTab = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ id: null, title: '', price: '', description: '', highlighted: false, display_order: 3 });

    const fetchPackages = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase.from('packages')
                .select('*')
                .order('display_order', { ascending: true })
                .order('created_at', { ascending: false });
            if (error) throw error;
            setPackages(data || []);
        } catch (error) { toast.error(error.message); } finally { setLoading(false); }
    };

    useEffect(() => { fetchPackages(); }, []);

    const openModal = (pkg = null) => {
        if (pkg) {
            setFormData({ ...pkg, price: String(pkg.price).replace(/\D/g, '') });
        } else {
            setFormData({ id: null, title: '', price: '', description: '', highlighted: false, display_order: 3 });
        }
        setIsModalOpen(true);
    };

    const handlePriceChange = (e) => {
        const numericVal = e.target.value.replace(/\D/g, '');
        setFormData(prev => ({ ...prev, price: numericVal }));
    };

    const formatPriceDisplay = (price) => {
        if (!price) return '';
        return `₹ ${price} / sq.ft`;
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const { id, ...payload } = formData;
            if (id) {
                const { error } = await supabase.from('packages').update(payload).eq('id', id);
                if (error) throw error;
                toast.success("Package updated!");
            } else {
                const { error } = await supabase.from('packages').insert([payload]);
                if (error) throw error;
                toast.success("Package added!");
            }
            setIsModalOpen(false);
            fetchPackages();
        } catch (error) { toast.error(error.message); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this package?")) return;
        try {
            const { error } = await supabase.from('packages').delete().eq('id', id);
            if (error) throw error;
            toast.success("Deleted!");
            fetchPackages();
        } catch (error) { toast.error(error.message); }
    };

    return (
        <div className="animate-fade-in p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Featured Packages</h2>
                <button onClick={() => openModal()} className="bg-blue-50 text-primary font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary hover:text-white transition">
                    <Plus size={18} /> Add Package
                </button>
            </div>

            {loading ? <div className="animate-pulse h-32 bg-gray-100 rounded-xl" /> : packages.length === 0 ? (
                <div className="text-center p-8 border border-dashed border-gray-300 rounded-xl text-gray-400">No packages created yet.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {packages.map(pkg => (
                        <div key={pkg.id} className={`p-6 bg-white rounded-xl border ${pkg.highlighted ? 'border-primary ring-1 ring-primary/20 shadow-md' : 'border-gray-200 shadow-sm'} group relative`}>
                            {pkg.highlighted && <span className="absolute -top-3 left-4 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md">Badge Active</span>}
                            <div className="absolute top-4 right-4 flex opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                                <button onClick={() => openModal(pkg)} className="p-1.5 bg-gray-100 hover:bg-blue-100 hover:text-primary rounded-md text-gray-500"><Edit2 size={14} /></button>
                                <button onClick={() => handleDelete(pkg.id)} className="p-1.5 bg-gray-100 hover:bg-red-100 hover:text-red-500 rounded-md text-gray-500"><Trash2 size={14} /></button>
                            </div>
                            <h3 className="font-bold text-lg text-gray-900 mt-2">{pkg.title}</h3>
                            <p className="text-primary font-black text-xl my-2">₹ {pkg.price} <span className="text-sm font-medium text-gray-500">/ sq.ft</span></p>
                            <p className="text-gray-500 text-sm">{pkg.description}</p>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up">
                        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-[#f8fafc]">
                            <h3 className="font-bold text-gray-900">{formData.id ? 'Edit Package' : 'New Package'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-800"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Package Name</label>
                                <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="e.g. Essential Plan" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Price</label>
                                <input type="text" required value={formatPriceDisplay(formData.price)} onChange={handlePriceChange} className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="₹ 1850 / sq.ft" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Short Description</label>
                                <textarea required rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none" placeholder="Best suited for..." />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Display Position</label>
                                <select required value={formData.display_order} onChange={e => setFormData({ ...formData, display_order: parseInt(e.target.value) })} className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white">
                                    <option value={1}>1 (Show First)</option>
                                    <option value={2}>2 (Show Second)</option>
                                    <option value={3}>3 (Show Third)</option>
                                </select>
                            </div>
                            <label className="flex items-center gap-3 cursor-pointer p-4 border rounded-xl hover:bg-gray-50 transition">
                                <input type="checkbox" checked={formData.highlighted} onChange={e => setFormData({ ...formData, highlighted: e.target.checked })} className="w-5 h-5 accent-primary" />
                                <div>
                                    <div className="font-bold text-gray-900 text-sm">Highlight Badge</div>
                                    <div className="text-xs text-gray-500">Draws visual attention to this package card.</div>
                                </div>
                            </label>
                            <button type="submit" className="w-full bg-primary hover:bg-secondary text-white font-bold py-3 mt-2 rounded-xl transition">Save Package</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// ==========================================
// 3. TESTIMONIALS TAB
// ==========================================
const TestimonialsManagementTab = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ id: null, name: '', location: '', review: '', stars: 5 });

    const fetchTestimonials = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            setTestimonials(data || []);
        } catch (error) { toast.error(error.message); } finally { setLoading(false); }
    };

    useEffect(() => { fetchTestimonials(); }, []);

    const openModal = (item = null) => {
        if (item) setFormData(item);
        else setFormData({ id: null, name: '', location: '', review: '', stars: 5 });
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                name: formData.name,
                location: formData.location,
                review: formData.review,
                stars: formData.stars
            };

            if (formData.id) {
                const { error } = await supabase.from('testimonials').update(payload).eq('id', formData.id);
                if (error) throw error;
                toast.success("Testimonial updated!");
            } else {
                const { error } = await supabase.from('testimonials').insert([payload]);
                if (error) throw error;
                toast.success("Testimonial added!");
            }
            setIsModalOpen(false);
            fetchTestimonials();
        } catch (error) { toast.error(error.message); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this review?")) return;
        try {
            const { error } = await supabase.from('testimonials').delete().eq('id', id);
            if (error) throw error;
            toast.success("Deleted!");
            fetchTestimonials();
        } catch (error) { toast.error(error.message); }
    };

    return (
        <div className="animate-fade-in p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Client Reviews</h2>
                <button onClick={() => openModal()} className="bg-blue-50 text-primary font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary hover:text-white transition">
                    <Plus size={18} /> Add Review
                </button>
            </div>

            {loading ? <div className="animate-pulse h-32 bg-gray-100 rounded-xl" /> : testimonials.length === 0 ? (
                <div className="text-center p-8 border border-dashed border-gray-300 rounded-xl text-gray-400">No testimonials published.</div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {testimonials.map(item => (
                        <div key={item.id} className="p-6 bg-white rounded-xl border border-gray-100 shadow-sm flex items-start gap-4 hover:shadow-md transition group">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                                <span className="text-gray-400 font-bold uppercase">{item.name.charAt(0)}</span>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <h3 className="font-bold text-gray-900">{item.name}</h3>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                        <button onClick={() => openModal(item)} className="text-gray-400 hover:text-primary"><Edit2 size={14} /></button>
                                        <button onClick={() => handleDelete(item.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                                <div className="flex text-yellow-400 my-1">
                                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill={i < item.stars ? 'currentColor' : 'none'} />)}
                                </div>
                                <p className="text-gray-600 text-sm mt-2 italic">"{item.review}"</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up">
                        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-[#f8fafc]">
                            <h3 className="font-bold text-gray-900">{formData.id ? 'Edit Testimonial' : 'New Testimonial'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-800"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Client Name</label>
                                <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Location</label>
                                <input type="text" required value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="e.g. Velachery" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Message / Review</label>
                                <textarea required rows={4} value={formData.review} onChange={e => setFormData({ ...formData, review: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none" placeholder="They did an amazing job..." />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Rating (1-5)</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button
                                            key={star} type="button"
                                            onClick={() => setFormData({ ...formData, stars: star })}
                                            className="p-1"
                                        >
                                            <Star size={24} className={`${star <= formData.stars ? 'text-yellow-400' : 'text-gray-300'}`} fill={star <= formData.stars ? 'currentColor' : 'none'} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-primary hover:bg-secondary text-white font-bold py-3 mt-4 rounded-xl transition">Save Testimonial</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// ==========================================
// 4. PARTNER LOGOS TAB
// ==========================================
const PartnerLogosTab = () => {
    const [logos, setLogos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({ id: null, name: '', image_url: '', display_order: 1 });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    const fetchLogos = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase.from('partner_logos').select('*').order('display_order', { ascending: true });
            if (error) throw error;
            setLogos(data || []);
        } catch (error) { toast.error(error.message); } finally { setLoading(false); }
    };

    useEffect(() => { fetchLogos(); }, []);

    const processImage = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    const MAX_WIDTH = 600;
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
            };
        });
    };

    const openModal = (item = null) => {
        setFormData(item || { id: null, name: '', image_url: '', display_order: 1 });
        setSelectedFile(null);
        setPreviewUrl(item ? item.image_url : '');
        setIsModalOpen(true);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            toast.error("File size must be less than 2MB");
            return;
        }
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            setUploading(true);
            let finalImageUrl = formData.image_url;

            if (selectedFile) {
                const webpBlob = await processImage(selectedFile);
                const fileName = `${Date.now()}-${formData.name.replace(/[^a-zA-Z0-9]/g, '_')}.webp`;

                const { error: uploadError } = await supabase.storage
                    .from('images')
                    .upload(`partner-logos/${fileName}`, webpBlob, { contentType: 'image/webp' });

                if (uploadError) throw uploadError;

                const { data } = supabase.storage.from('images').getPublicUrl(`partner-logos/${fileName}`);
                finalImageUrl = data.publicUrl;
            }

            if (!finalImageUrl && !formData.id) {
                throw new Error("Please upload an image.");
            }

            const payload = {
                name: formData.name,
                image_url: finalImageUrl,
                display_order: formData.display_order
            };

            if (formData.id) {
                const { error } = await supabase.from('partner_logos').update(payload).eq('id', formData.id);
                if (error) throw error;
                toast.success("Logo updated!");
            } else {
                const { error } = await supabase.from('partner_logos').insert([payload]);
                if (error) throw error;
                toast.success("Logo added!");
            }

            setIsModalOpen(false);
            fetchLogos();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id, imageUrl) => {
        if (!window.confirm("Delete this partner logo?")) return;
        try {
            if (imageUrl) {
                const urlParts = imageUrl.split('/');
                let fileName = urlParts[urlParts.length - 1];
                fileName = fileName.split('?')[0]; // Remove query params if any
                if (fileName) {
                    await supabase.storage.from('images').remove([`partner-logos/${fileName}`]);
                }
            }

            const { error } = await supabase.from('partner_logos').delete().eq('id', id);
            if (error) throw error;
            toast.success("Deleted!");
            fetchLogos();
        } catch (error) { toast.error(error.message); }
    };

    return (
        <div className="animate-fade-in p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Partner Logos</h2>
                <button onClick={() => openModal()} className="bg-blue-50 text-primary font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary hover:text-white transition">
                    <Plus size={18} /> Add Logo
                </button>
            </div>

            {loading ? <div className="animate-pulse h-32 bg-gray-100 rounded-xl" /> : logos.length === 0 ? (
                <div className="text-center p-8 border border-dashed border-gray-300 rounded-xl text-gray-400">No partner logos added.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {logos.map(item => (
                        <div key={item.id} className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition group">
                            <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center shrink-0 border p-2">
                                <img src={item.image_url} alt={item.name} className="max-w-full max-h-full object-contain" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <h3 className="font-bold text-gray-900">{item.name}</h3>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                        <button onClick={() => openModal(item)} className="text-gray-400 hover:text-primary"><Edit2 size={14} /></button>
                                        <button onClick={() => handleDelete(item.id, item.image_url)} className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                                <p className="text-gray-500 text-sm mt-1">Order: {item.display_order}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up">
                        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-[#f8fafc]">
                            <h3 className="font-bold text-gray-900">{formData.id ? 'Edit Logo' : 'New Logo'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-800"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Partner Name</label>
                                <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" placeholder="e.g. Havells" />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Logo Image (PNG/JPG)</label>
                                <div className="mt-1 flex items-center gap-4">
                                    <div className="w-20 h-20 bg-gray-50 border rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                                        {previewUrl ? <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain p-2" /> : <ImageIcon className="text-gray-300" />}
                                    </div>
                                    <label className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg cursor-pointer text-sm font-medium transition shrink-0">
                                        Choose File
                                        <input type="file" accept=".png,.jpg,.jpeg" onChange={handleFileChange} className="hidden" />
                                    </label>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Max 2MB. Image converted to WebP (max 600px).</p>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Display Order</label>
                                <select required value={formData.display_order} onChange={e => setFormData({ ...formData, display_order: parseInt(e.target.value) })} className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white">
                                    {[...Array(10)].map((_, i) => (
                                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                                    ))}
                                </select>
                            </div>

                            <button type="submit" disabled={uploading} className="w-full bg-primary hover:bg-secondary text-white font-bold py-3 mt-4 rounded-xl transition disabled:opacity-70 disabled:cursor-not-allowed">
                                {uploading ? 'Processing & Saving...' : 'Save Partner Logo'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomeConfigPage;
