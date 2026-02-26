import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { UploadCloud, Image as ImageIcon, Trash2, Edit2, X, Plus } from 'lucide-react';

const InteriorsGalleryConfigPage = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    // Modal state for editing title/order
    const [isEditModal, setIsEditModal] = useState(false);
    const [editingImage, setEditingImage] = useState(null);
    const fileRef = useRef(null);

    const fetchGallery = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('interior_gallery')
                .select('*')
                .order('display_order', { ascending: true })
                .order('created_at', { ascending: false });

            if (error) throw error;
            setImages(data || []);
        } catch (error) { toast.error(error.message); } finally { setLoading(false); }
    };

    useEffect(() => { fetchGallery(); }, []);

    // -------- WEBP CONVERSION & COMPRESSION --------
    const compressAndConvertToWebP = (file) => {
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
                    const MAX_WIDTH = 1600;

                    if (width > MAX_WIDTH) {
                        height = Math.round((height * MAX_WIDTH) / width);
                        width = MAX_WIDTH;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    // High compress to webp
                    canvas.toBlob(
                        (blob) => {
                            if (!blob) return reject(new Error('Canvas is empty'));
                            resolve(new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", { type: 'image/webp' }));
                        },
                        'image/webp',
                        0.75
                    );
                };
                img.onerror = reject;
            };
            reader.onerror = reject;
        });
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            const webpFile = await compressAndConvertToWebP(file);

            const fileName = `interior_gallery/int_gal_${Date.now()}_${Math.random().toString(36).substring(7)}.webp`;
            const { error: uploadError } = await supabase.storage.from('images').upload(fileName, webpFile);

            if (uploadError) throw uploadError;

            const { data: publicUrlData } = supabase.storage.from('images').getPublicUrl(fileName);

            // Auto insert to DB
            const { error: dbError } = await supabase.from('interior_gallery').insert([{
                image_url: publicUrlData.publicUrl,
                title: '',
                display_order: images.length,
                is_active: true
            }]);

            if (dbError) throw dbError;

            toast.success("Image uploaded, compressed to WebP and saved!");
            fetchGallery();
        } catch (error) {
            toast.error(error.message || "Error processing image.");
            console.error("UPLOAD ERROR DETAILS:", error);
        } finally {
            if (fileRef.current) fileRef.current.value = "";
            setUploading(false);
        }
    };

    const toggleActive = async (img) => {
        try {
            const { error } = await supabase.from('interior_gallery').update({ is_active: !img.is_active }).eq('id', img.id);
            if (error) throw error;
            toast.success(`Image ${img.is_active ? 'Hidden' : 'Activated'}`);
            fetchGallery();
        } catch (error) { toast.error(error.message); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Remove this image entirely?")) return;
        try {
            const { error } = await supabase.from('interior_gallery').delete().eq('id', id);
            if (error) throw error;
            toast.success("Image Deleted");
            fetchGallery();
        } catch (error) { toast.error(error.message); }
    };

    const openEditModal = (img) => {
        setEditingImage(img);
        setIsEditModal(true);
    };

    const saveEdits = async () => {
        try {
            const { error } = await supabase.from('interior_gallery').update({
                title: editingImage.title,
                display_order: editingImage.display_order
            }).eq('id', editingImage.id);

            if (error) throw error;
            toast.success("Details updated");
            setIsEditModal(false);
            fetchGallery();
        } catch (error) { toast.error(error.message); }
    };

    return (
        <div className="animate-fade-in max-w-7xl mx-auto pb-20 p-2 md:p-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-primary tracking-tight mb-2">Interior Gallery Config</h1>
                    <p className="text-gray-500 font-medium text-sm">Control the showcase images for the public gallery.</p>
                </div>
                <div>
                    <input type="file" ref={fileRef} onChange={handleUpload} accept="image/*" className="hidden" />
                    <button disabled={uploading} onClick={() => fileRef.current?.click()} className="bg-primary hover:bg-secondary disabled:opacity-50 text-white shrink-0 font-bold px-6 py-3 rounded-xl flex items-center gap-2 shadow-sm transition">
                        {uploading ? (
                            <><div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div> Processing...</>
                        ) : (
                            <><Plus size={20} /> Add Image</>
                        )}
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <div key={i} className="bg-gray-100 animate-pulse rounded-2xl aspect-square w-full" />)}
                </div>
            ) : images.length === 0 ? (
                <div className="bg-white rounded-2xl p-16 text-center border border-gray-100 shadow-sm">
                    <ImageIcon size={48} className="mx-auto text-blue-100 mb-4" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Populate Gallery</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">Upload interior photography. Images are auto-compressed to WebP for maximum website speed.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {images.map((img) => (
                        <div key={img.id} className="bg-white rounded-[20px] flex flex-col border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all overflow-hidden group">

                            <div className="aspect-square bg-gray-100 relative overflow-hidden group shrink-0 border-b border-gray-100">
                                <img src={img.image_url} alt="Gallery" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

                                {/* Status badge */}
                                <div className="absolute top-4 right-4 z-10 flex gap-2">
                                    <button
                                        onClick={() => toggleActive(img)}
                                        className={`px-3 py-1 font-black text-[10px] uppercase rounded-full shadow-lg backdrop-blur-md transition ${img.is_active ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                                    >
                                        {img.is_active ? 'Active' : 'Hidden'}
                                    </button>
                                </div>
                                <div className="absolute top-4 left-4 z-10">
                                    <span className="bg-white/90 backdrop-blur-md border border-gray-200 text-primary font-bold px-2.5 py-1 rounded text-xs shadow-sm">Order: {img.display_order}</span>
                                </div>
                            </div>

                            <div className="p-4 flex gap-2 shrink-0 bg-[#f8fafc]">
                                <button onClick={() => openEditModal(img)} className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-bold py-2 rounded-xl flex items-center justify-center gap-2 transition text-sm shadow-sm">
                                    <Edit2 size={14} /> Adjust Options
                                </button>
                                <button onClick={() => handleDelete(img.id)} className="w-[44px] h-[40px] flex items-center justify-center bg-white border border-gray-200 text-red-500 hover:bg-red-50 rounded-xl transition shrink-0 shadow-sm">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Modal */}
            {isEditModal && editingImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-sm flex flex-col overflow-hidden animate-slide-up">
                        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-[#f8fafc]">
                            <h3 className="font-black text-gray-900 text-lg">Adjust Metadata</h3>
                            <button onClick={() => setIsEditModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-400 hover:text-gray-800 shadow-sm"><X size={16} strokeWidth={3} /></button>
                        </div>
                        <div className="p-5 space-y-4">
                            <div>
                                <label className="text-[11px] font-black tracking-widest text-gray-400 uppercase block mb-1">Image Title / Description (Optional)</label>
                                <input type="text" value={editingImage.title || ''} onChange={(e) => setEditingImage({ ...editingImage, title: e.target.value })} className="w-full p-3 font-bold border border-gray-200 bg-gray-50 rounded-xl focus:bg-white focus:border-primary outline-none shadow-sm" placeholder="e.g. Master Bedroom View" />
                            </div>
                            <div>
                                <label className="text-[11px] font-black tracking-widest text-gray-400 uppercase block mb-1">Display Sort Order</label>
                                <input type="number" value={editingImage.display_order} onChange={(e) => setEditingImage({ ...editingImage, display_order: Number(e.target.value) })} className="w-full p-3 font-bold border border-gray-200 bg-gray-50 rounded-xl focus:bg-white focus:border-primary outline-none shadow-sm" />
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-100 bg-white grid grid-cols-2 gap-3 shrink-0">
                            <button onClick={() => setIsEditModal(false)} className="bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 font-bold py-2.5 rounded-xl transition text-sm">Cancel</button>
                            <button onClick={saveEdits} className="bg-primary hover:bg-secondary text-white font-bold py-2.5 rounded-xl transition shadow shadow-primary/20 text-sm">Save Config</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InteriorsGalleryConfigPage;
