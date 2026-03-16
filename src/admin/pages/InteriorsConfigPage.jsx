import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, UploadCloud, Armchair, ChevronDown, ChevronUp, CheckCircle2, GripVertical } from 'lucide-react';

const InteriorsConfigPage = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Editing State
    const [editingPackage, setEditingPackage] = useState({
        id: null, name: '', price: '', price_suffix: '/sq.ft (Frame & Shutter)', image_url: '', is_active: true, display_order: 0, sections: []
    });

    const fileRef = useRef(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const { data: pkgData, error: pkgError } = await supabase
                .from('interior_packages')
                .select(`
                    id, name, price, price_suffix, image_url, is_active, display_order,
                    interior_sections(id, title, display_order, interior_items(id, content, display_order))
                `)
                .order('display_order', { ascending: true });

            if (pkgError) throw pkgError;

            // Sort nested arrays
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
        } catch (error) { toast.error(error.message); } finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const openModal = (pkg = null) => {
        if (pkg) {
            setEditingPackage(pkg);
        } else {
            setEditingPackage({
                id: null, name: '', price: '', price_suffix: '/sq.ft (Frame & Shutter)', image_url: '', is_active: true, display_order: packages.length, sections: []
            });
        }
        setIsModalOpen(true);
    };

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

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            const webpFile = await compressAndConvertToWebP(file);
            const fileName = `interior_${Date.now()}_${Math.random().toString(36).substring(7)}.webp`;
            const filePath = `interiors/${fileName}`;

            const { error: uploadError } = await supabase.storage.from('images').upload(filePath, webpFile);
            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('images').getPublicUrl(filePath);
            setEditingPackage(prev => ({ ...prev, image_url: data.publicUrl }));
            toast.success("Cover Image uploaded!");
        } catch (error) {
            toast.error('Error uploading image.');
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const addSection = () => {
        const newSection = {
            tempId: Date.now(), // For UI tracking before save
            title: 'New Section',
            display_order: editingPackage.sections.length,
            items: []
        };
        setEditingPackage(prev => ({ ...prev, sections: [...prev.sections, newSection] }));
    };

    const removeSection = (secIndex) => {
        if (!window.confirm("Remove this section and all its items?")) return;
        setEditingPackage(prev => ({
            ...prev,
            sections: prev.sections.filter((_, i) => i !== secIndex)
        }));
    };

    const updateSection = (secIndex, field, value) => {
        setEditingPackage(prev => {
            const newSections = [...prev.sections];
            newSections[secIndex] = { ...newSections[secIndex], [field]: value };
            return { ...prev, sections: newSections };
        });
    };

    const addItem = (secIndex) => {
        setEditingPackage(prev => {
            const newSections = [...prev.sections];
            newSections[secIndex].items.push({
                tempId: Date.now() + Math.random(),
                content: 'New Bullet Point',
                display_order: newSections[secIndex].items.length
            });
            return { ...prev, sections: newSections };
        });
    };

    const removeItem = (secIndex, itemIndex) => {
        setEditingPackage(prev => {
            const newSections = [...prev.sections];
            newSections[secIndex].items = newSections[secIndex].items.filter((_, i) => i !== itemIndex);
            return { ...prev, sections: newSections };
        });
    };

    const updateItem = (secIndex, itemIndex, content) => {
        setEditingPackage(prev => {
            const newSections = [...prev.sections];
            newSections[secIndex].items[itemIndex].content = content;
            return { ...prev, sections: newSections };
        });
    };

    const toggleActive = async (pkg) => {
        try {
            const { error } = await supabase.from('interior_packages').update({ is_active: !pkg.is_active }).eq('id', pkg.id);
            if (error) throw error;
            toast.success(pkg.is_active ? 'Package Deactivated' : 'Package Activated');
            fetchData();
        } catch (err) { toast.error(err.message); }
    };

    const deletePackage = async (id) => {
        if (!window.confirm("Are you sure you want to delete this packaging completely?")) return;
        try {
            const { error } = await supabase.from('interior_packages').delete().eq('id', id);
            if (error) throw error;
            toast.success("Package Deleted");
            fetchData();
        } catch (error) { toast.error(error.message); }
    };

    const handleSavePackage = async () => {
        try {
            setLoading(true);

            // 1. Save Package
            let packageId = editingPackage.id;
            const packagePayload = {
                name: editingPackage.name,
                price: editingPackage.price,
                price_suffix: editingPackage.price_suffix,
                image_url: editingPackage.image_url,
                display_order: editingPackage.display_order,
                is_active: editingPackage.is_active
            };

            if (packageId) {
                const { error: pError } = await supabase.from('interior_packages').update(packagePayload).eq('id', packageId);
                if (pError) throw pError;
            } else {
                const { data: pData, error: pError } = await supabase.from('interior_packages').insert([packagePayload]).select().single();
                if (pError) throw pError;
                packageId = pData.id;
            }

            // 2. Clear old DB sections/items (simplifies sync, deletes cascaded items)
            // For production, a differential upsert is better, but this works well for configuration forms.
            if (editingPackage.id) {
                await supabase.from('interior_sections').delete().eq('package_id', packageId);
            }

            // 3. Insert new sections & items
            if (editingPackage.sections && editingPackage.sections.length > 0) {
                for (let i = 0; i < editingPackage.sections.length; i++) {
                    const sec = editingPackage.sections[i];
                    const { data: secData, error: sError } = await supabase.from('interior_sections').insert([{
                        package_id: packageId,
                        title: sec.title,
                        display_order: i
                    }]).select().single();

                    if (sError) throw sError;

                    if (sec.items && sec.items.length > 0) {
                        const itemsPayload = sec.items.map((it, j) => ({
                            section_id: secData.id,
                            content: it.content,
                            display_order: j
                        }));
                        const { error: iError } = await supabase.from('interior_items').insert(itemsPayload);
                        if (iError) throw iError;
                    }
                }
            }

            toast.success("Package saved successfully!");
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            toast.error(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in max-w-7xl mx-auto pb-20 p-2 md:p-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-primary tracking-tight mb-2">Interiors Config</h1>
                    <p className="text-gray-500 font-medium text-sm">Control your interior service packages.</p>
                </div>
                <button onClick={() => openModal()} className="bg-primary hover:bg-secondary text-white shrink-0 font-bold px-6 py-3 rounded-xl flex items-center gap-2 shadow-sm transition">
                    <Plus size={20} /> Add Package
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="bg-gray-100 animate-pulse rounded-2xl h-80 w-full" />)}
                </div>
            ) : packages.length === 0 ? (
                <div className="bg-white rounded-2xl p-16 text-center border border-gray-100 shadow-sm">
                    <Armchair size={48} className="mx-auto text-blue-100 mb-4" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Configure Your Showroom</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">Create beautiful interior furnishing combinations combining custom wardrobes, kitchens, and decor.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {packages.map((pkg) => (
                        <div key={pkg.id} className="bg-white rounded-[24px] flex flex-col border border-gray-200 shadow-sm hover:shadow-[0_10px_40px_rgba(0,0,0,0.06)] transition-all overflow-hidden group">
                            <div className="h-56 bg-gray-100 relative overflow-hidden shrink-0">
                                {pkg.image_url ? (
                                    <img src={pkg.image_url} alt="Interior" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold bg-[#f8fafc]">No Cover Image</div>
                                )}
                                <div className="absolute top-4 right-4 flex gap-2 z-10">
                                    <button
                                        onClick={() => toggleActive(pkg)}
                                        className={`px-3 py-1 font-bold text-xs rounded-full shadow-md backdrop-blur-md transition ${pkg.is_active ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}`}
                                    >
                                        {pkg.is_active ? 'ACTIVE' : 'INACTIVE'}
                                    </button>
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col relative z-20 -mt-6 bg-white rounded-t-[24px]">
                                <h3 className="text-2xl font-black text-[#0E2C48]">{pkg.name}</h3>
                                <p className="text-secondary font-black text-xl mt-1">
                                    {pkg.price} <span className="text-gray-400 font-medium text-sm tracking-wide">{pkg.price_suffix}</span>
                                </p>

                                <div className="mt-6 flex gap-2">
                                    <button onClick={() => openModal(pkg)} className="flex-1 bg-gray-50 hover:bg-gray-100 text-primary border border-gray-200 font-bold py-2 rounded-xl flex items-center justify-center gap-2 transition">
                                        <Edit2 size={16} /> Edit Details
                                    </button>
                                    <button onClick={() => deletePackage(pkg.id)} className="w-12 h-10 flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition shrink-0 shrink-0">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Editing Form Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-4xl max-h-[96vh] flex flex-col overflow-hidden animate-slide-up">

                        {/* Header Box */}
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-[#f8fafc]">
                            <h3 className="font-black text-gray-900 text-xl flex items-center gap-2 tracking-tight">
                                <Armchair className="text-primary" />{editingPackage.id ? 'Edit Package Specs' : 'Assemble Interior Module'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-400 hover:text-gray-800 shadow-sm"><X size={18} strokeWidth={3} /></button>
                        </div>

                        {/* Scrolling Body */}
                        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-gray-50/30">

                            {/* Gen Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6">
                                {/* Cover Image */}
                                <div>
                                    <label className="text-[11px] font-black tracking-widest text-gray-400 uppercase block mb-2">Cover Image Render</label>
                                    <div
                                        className="w-full aspect-square bg-white border border-dashed border-gray-300 rounded-[20px] shadow-sm flex flex-col items-center justify-center overflow-hidden transition hover:border-primary cursor-pointer relative group"
                                        onClick={() => fileRef.current?.click()}
                                    >
                                        {editingPackage.image_url ? (
                                            <img src={editingPackage.image_url} alt="Cover" className="w-full h-full object-cover group-hover:opacity-60 transition" />
                                        ) : (
                                            <div className="text-center p-6 text-gray-400 group-hover:text-primary transition">
                                                <UploadCloud size={32} className="mx-auto mb-2 opacity-50 block" />
                                                <span className="text-xs font-bold block">Upload Cover</span>
                                            </div>
                                        )}
                                        {uploading && (
                                            <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center backdrop-blur-sm">
                                                <div className="animate-spin h-6 w-6 border-3 border-primary border-t-transparent rounded-full mb-2"></div>
                                            </div>
                                        )}
                                    </div>
                                    <input type="file" ref={fileRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                                </div>

                                {/* Text Details */}
                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <label className="text-[11px] font-black tracking-widest text-gray-400 uppercase block mb-1">Package Name</label>
                                            <input type="text" value={editingPackage.name} onChange={e => setEditingPackage({ ...editingPackage, name: e.target.value })} className="w-full p-3 font-bold border border-gray-200 bg-white rounded-xl focus:border-primary outline-none shadow-sm" placeholder="e.g. Silver Package" />
                                        </div>
                                        <div className="w-24 shrink-0">
                                            <label className="text-[11px] font-black tracking-widest text-gray-400 uppercase block mb-1">Order</label>
                                            <input type="number" value={editingPackage.display_order} onChange={e => setEditingPackage({ ...editingPackage, display_order: Number(e.target.value) })} className="w-full p-3 font-bold border border-gray-200 bg-white rounded-xl focus:border-primary outline-none text-center shadow-sm" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[11px] font-black tracking-widest text-gray-400 uppercase block mb-1">Pricing Format</label>
                                        <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                            <input type="text" value={editingPackage.price} onChange={e => setEditingPackage({ ...editingPackage, price: e.target.value })} className="w-1/3 p-3 font-bold bg-gray-50 border-r border-gray-200 focus:outline-none" placeholder="e.g. ₹1,200" />
                                            <input type="text" value={editingPackage.price_suffix} onChange={e => setEditingPackage({ ...editingPackage, price_suffix: e.target.value })} className="flex-1 p-3 font-medium text-gray-500 focus:outline-none" placeholder="e.g. /sq.ft (Frame & Shutter)" />
                                        </div>
                                    </div>

                                    <label className="flex flex-row items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm cursor-pointer mt-2">
                                        <input type="checkbox" checked={editingPackage.is_active} onChange={e => setEditingPackage({ ...editingPackage, is_active: e.target.checked })} className="w-5 h-5 accent-primary cursor-pointer shrink-0" />
                                        <div>
                                            <span className="font-bold text-gray-800 block">Package Activated</span>
                                            <span className="text-xs text-gray-500 font-medium tracking-wide">Visible to public on the website</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Package Sections Array */}
                            <div>
                                <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-5">
                                    <h4 className="font-black text-gray-800 flex items-center gap-2">
                                        <Armchair size={18} className="text-primary" /> Feature Sections Outline
                                    </h4>
                                    <button onClick={addSection} type="button" className="text-sm font-bold bg-white text-primary border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm"><Plus size={16} /> Add Section</button>
                                </div>

                                <div className="space-y-5">
                                    {editingPackage.sections && editingPackage.sections.map((sec, sIdx) => (
                                        <div key={sec.tempId || sec.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:border-primary/50 transition-colors">
                                            {/* Section Header */}
                                            <div className="bg-[#f8fafc] p-4 flex gap-3 items-center border-b border-gray-100 group">
                                                <GripVertical className="text-gray-300 cursor-grab shrink-0 hidden sm:block" size={20} />
                                                <input
                                                    type="text"
                                                    value={sec.title}
                                                    onChange={(e) => updateSection(sIdx, 'title', e.target.value)}
                                                    className="flex-1 font-bold text-primary bg-transparent focus:bg-white px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-primary/20"
                                                    placeholder="Section Title (e.g. Plywood)"
                                                />
                                                <button onClick={() => addItem(sIdx)} type="button" className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-green-600 hover:text-green-800 border border-gray-200" title="Add Bullet Item"><Plus size={14} /></button>
                                                <button onClick={() => removeSection(sIdx)} type="button" className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-red-400 hover:text-red-600 border border-gray-200" title="Delete Section"><Trash2 size={14} /></button>
                                            </div>

                                            {/* Section Items */}
                                            <div className="p-4 space-y-2">
                                                {sec.items && sec.items.map((it, iIdx) => (
                                                    <div key={it.tempId || it.id} className="flex gap-3 items-center group/item hover:bg-gray-50 p-1 -mx-1 rounded-lg transition-colors pr-2">
                                                        <div className="w-6 flex justify-center shrink-0">
                                                            <CheckCircle2 size={16} className="text-green-500" />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={it.content}
                                                            onChange={(e) => updateItem(sIdx, iIdx, e.target.value)}
                                                            className="flex-1 text-sm text-gray-700 bg-transparent border-b border-transparent focus:border-gray-200 py-1 focus:outline-none font-medium"
                                                            placeholder="Bullet point text..."
                                                        />
                                                        <button onClick={() => removeItem(sIdx, iIdx)} type="button" className="opacity-0 group-hover/item:opacity-100 text-gray-300 hover:text-red-500 transition"><X size={16} /></button>
                                                    </div>
                                                ))}
                                                <button onClick={() => addItem(sIdx)} type="button" className="flex items-center gap-1.5 text-xs font-bold text-accent hover:text-primary mt-2 pl-3 py-1 rounded-md transition"><Plus size={14} strokeWidth={3} /> Add Item Row</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* Footer Box */}
                        <div className="p-5 border-t border-gray-100 bg-white grid grid-cols-2 gap-4 shrink-0">
                            <button onClick={() => setIsModalOpen(false)} className="w-full bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 font-bold py-3.5 rounded-xl transition">Cancel Discard</button>
                            <button onClick={handleSavePackage} className="w-full bg-primary hover:bg-secondary text-white font-bold py-3.5 rounded-xl transition shadow-xl shadow-primary/20 uppercase tracking-widest flex items-center justify-center">Commit Layout</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InteriorsConfigPage;
