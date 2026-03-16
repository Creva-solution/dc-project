import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { Target, Crown, ShieldCheck, Plus, Edit2, Trash2, X, Check, XCircle, GripVertical, Save, Minus, Building2, FileSpreadsheet, ClipboardPaste } from 'lucide-react';

const ArchitecturalConfigPage = () => {
    const [packages, setPackages] = useState([]);
    const [features, setFeatures] = useState([]);
    const [featureValues, setFeatureValues] = useState([]);

    // For Feature Values local edits
    const [localFeatureValues, setLocalFeatureValues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isBulkModal, setIsBulkModal] = useState(false);
    const [bulkData, setBulkData] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [pkgRes, featRes, valRes] = await Promise.all([
                supabase.from('arch_packages').select('*').order('display_order', { ascending: true }),
                supabase.from('arch_features').select('*').order('display_order', { ascending: true }),
                supabase.from('arch_feature_values').select('*')
            ]);
            setPackages(pkgRes.data || []);
            setFeatures(featRes.data || []);
            setFeatureValues(valRes.data || []);
            setLocalFeatureValues(valRes.data || []);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // --- PACKAGES CRUD ---
    const [pkgForm, setPkgForm] = useState({ id: null, name: '', price: '', min_area: '', is_active: true, display_order: 0 });
    const [isPkgModal, setIsPkgModal] = useState(false);

    const savePackage = async (e) => {
        e.preventDefault();
        try {
            if (pkgForm.id) {
                const { id, ...updatePayload } = pkgForm;
                const { error } = await supabase.from('arch_packages').update(updatePayload).eq('id', pkgForm.id);
                if (error) throw error;
                toast.success("Package Updated");
            } else {
                const { id, ...insertPayload } = pkgForm;
                const { error } = await supabase.from('arch_packages').insert([insertPayload]);
                if (error) throw error;
                toast.success("Package Created");
            }
            setIsPkgModal(false);
            fetchData();
        } catch (e) { toast.error(e.message); }
    };

    const deletePackage = async (id) => {
        if (!window.confirm("Delete package? This removes all associated feature values.")) return;
        const { error } = await supabase.from('arch_packages').delete().eq('id', id);
        if (error) toast.error(error.message);
        else fetchData();
    };

    const togglePackageActive = async (pkg) => {
        try {
            const { error } = await supabase.from('arch_packages').update({ is_active: !pkg.is_active }).eq('id', pkg.id);
            if (error) throw error;
            toast.success(`Package ${pkg.is_active ? 'Hidden' : 'Activated'}`);
            fetchData();
        } catch (e) { toast.error(e.message); }
    };

    // --- FEATURES CRUD ---
    const [featForm, setFeatForm] = useState({ id: null, title: '', type: 'feature', value_mode: 'boolean', display_order: 0 });
    const [isFeatModal, setIsFeatModal] = useState(false);

    const saveFeature = async (e) => {
        e.preventDefault();
        try {
            if (featForm.id) {
                const { id, ...updatePayload } = featForm;
                const { error } = await supabase.from('arch_features').update(updatePayload).eq('id', featForm.id);
                if (error) throw error;
                toast.success("Feature Updated");
            } else {
                const { id, ...insertPayload } = featForm;
                const { error } = await supabase.from('arch_features').insert([insertPayload]);
                if (error) throw error;
                toast.success("Feature Added");
            }
            setIsFeatModal(false);
            fetchData();
        } catch (e) { toast.error(e.message); }
    };

    const deleteFeature = async (id) => {
        if (!window.confirm("Delete feature? Removes values across all packages.")) return;
        const { error } = await supabase.from('arch_features').delete().eq('id', id);
        if (error) toast.error(error.message);
        else fetchData();
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        if (!window.confirm(`Delete ${selectedIds.length} selected items? This will remove all associated values.`)) return;

        try {
            setLoading(true);
            const { error } = await supabase.from('arch_features').delete().in('id', selectedIds);
            if (error) throw error;
            toast.success("Selected items deleted!");
            setSelectedIds([]);
            fetchData();
        } catch (err) {
            toast.error(err.message);
            setLoading(false);
        }
    };

    const toggleSelect = (id) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === features.length) setSelectedIds([]);
        else setSelectedIds(features.map(f => f.id));
    };

    // --- FEATURE VALUES EDIT ---
    const handleLocalValueChange = (pkgId, featId, type, value) => {
        setLocalFeatureValues(prev => {
            const existing = prev.find(v => v.package_id === pkgId && v.feature_id === featId);
            if (existing) {
                return prev.map(v => v.id === existing.id ? { ...v, type, value } : v);
            } else {
                return [...prev, { package_id: pkgId, feature_id: featId, type, value }];
            }
        });
    };

    const saveFeatureValues = async () => {
        try {
            setLoading(true);
            const toUpsert = localFeatureValues.map(v => {
                const payload = {
                    package_id: v.package_id,
                    feature_id: v.feature_id,
                    type: v.type,
                    value: v.value
                };
                if (v.id) payload.id = v.id;
                return payload;
            });

            if (toUpsert.length > 0) {
                const { error } = await supabase.from('arch_feature_values').upsert(toUpsert, { onConflict: 'package_id,feature_id' });
                if (error) throw error;
                toast.success("Feature Values Saved!");
            }
            fetchData();
        } catch (err) {
            toast.error(err.message);
            setLoading(false);
        }
    };

    const handleBulkImport = async () => {
        try {
            if (!bulkData.trim()) return;
            setLoading(true);
            const lines = bulkData.split('\n').filter(l => l.trim());
            let currentOrder = features.length > 0 ? Math.max(...features.map(f => f.display_order)) + 1 : 1;

            for (const line of lines) {
                const trimmedLine = line.trim();
                // Skip Excel headers that match package names or generic "Feature"
                if (trimmedLine.toLowerCase().startsWith('feature\t') || trimmedLine.toLowerCase() === 'feature') continue;

                const headingMatch = trimmedLine.match(/^(\d+)\.\s*(.*)/);
                if (headingMatch) {
                    const title = headingMatch[2].trim();
                    const { data: feat, error } = await supabase.from('arch_features').insert({
                        title,
                        type: 'heading',
                        display_order: currentOrder++
                    }).select().single();
                    if (error) throw error;
                } else {
                    const parts = line.split('\t').map(p => p.trim());
                    if (parts.length === 0 || !parts[0]) continue;

                    const title = parts[0];
                    const packageValues = parts.slice(1);

                    // Detect if it should be text mode
                    const isTextMode = packageValues.some(v => {
                        const low = v.toLowerCase();
                        return v && !['tick', '✔', '✅', 'yes', 'y', '-', 'dash', '—', 'no', 'n', '/', 'basic', 'premium', 'luxury'].includes(low);
                    });

                    const { data: feat, error: featError } = await supabase.from('arch_features').insert({
                        title,
                        type: 'feature',
                        value_mode: isTextMode ? 'text' : 'boolean',
                        display_order: currentOrder++
                    }).select().single();
                    if (featError) throw featError;

                    if (packageValues.length > 0) {
                        const valuesToInsert = packageValues.map((val, idx) => {
                            const pkg = packages[idx];
                            if (!pkg) return null;

                            let type = 'dash';
                            let value = '';

                            const lowVal = val.toLowerCase();
                            if (['tick', '✔', '✅', 'yes', 'y'].includes(lowVal)) {
                                type = 'tick';
                            } else if (['-', 'dash', '—', 'no', 'n', '/', ''].includes(lowVal)) {
                                type = 'dash';
                            } else {
                                type = 'text';
                                value = val;
                            }

                            return {
                                package_id: pkg.id,
                                feature_id: feat.id,
                                type,
                                value
                            };
                        }).filter(Boolean);

                        if (valuesToInsert.length > 0) {
                            const { error: valError } = await supabase.from('arch_feature_values').insert(valuesToInsert);
                            if (valError) throw valError;
                        }
                    }
                }
            }
            toast.success("Bulk Import Successful!");
            setIsBulkModal(false);
            setBulkData('');
            fetchData();
        } catch (err) {
            toast.error("Import Error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const colorSets = [
        { icon: ShieldCheck, color: 'text-blue-600', bgColor: 'bg-blue-50', bgHighlight: 'lg:bg-blue-50/20' },
        { icon: Target, color: 'text-accent', bgColor: 'bg-red-50', bgHighlight: 'lg:bg-red-50/20' },
        { icon: Crown, color: 'text-yellow-600', bgColor: 'bg-yellow-50', bgHighlight: 'lg:bg-yellow-50/20' },
        { icon: Building2, color: 'text-emerald-600', bgColor: 'bg-emerald-50', bgHighlight: 'lg:bg-emerald-50/20' }
    ];

    if (loading) {
        return <div className="h-64 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
    }

    return (
        <div className="animate-fade-in max-w-7xl mx-auto pb-20 p-2 md:p-0">
            <h1 className="text-3xl font-black text-primary tracking-tight mb-2">Architectural Packages</h1>
            <p className="text-gray-500 font-medium text-sm mb-8">Design and configure your architectural comparison matrix here.</p>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[500px]">
                <div className="animate-fade-in p-6 bg-gray-50/50 space-y-8 rounded-2xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Active Design Matrix</h2>
                            <p className="text-gray-500 text-sm mt-1">Make direct edits to your architectural pricing matrix. Changes autosave to local state, press Save when done to push live.</p>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <button onClick={() => { setPkgForm({ id: null, name: '', price: '', min_area: '', is_active: true, display_order: packages.length + 1 }); setIsPkgModal(true); }} className="bg-white border border-gray-200 text-gray-700 font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50 text-sm shadow-sm transition-colors">
                                <Plus size={16} /> Add Package
                            </button>
                            <button onClick={() => { setFeatForm({ id: null, title: '', type: 'feature', value_mode: 'boolean', display_order: features.length + 1 }); setIsFeatModal(true); }} className="bg-white border border-gray-200 text-gray-700 font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50 text-sm shadow-sm transition-colors">
                                <Plus size={16} /> Add Feature Row
                            </button>
                            <button onClick={() => { setBulkData(''); setIsBulkModal(true); }} className="bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-100 text-sm shadow-sm transition-colors">
                                <FileSpreadsheet size={16} /> Bulk Excel Add
                            </button>
                            <button onClick={saveFeatureValues} className="bg-primary text-white font-bold px-6 py-2 rounded-lg flex items-center gap-2 shadow-md hover:bg-secondary transition-all text-sm ml-auto md:ml-0">
                                <Save size={16} /> Save All Layout
                            </button>
                            {selectedIds.length > 0 && (
                                <button onClick={handleBulkDelete} className="bg-red-500 text-white font-bold px-4 py-2 rounded-lg flex items-center gap-2 shadow-md hover:bg-red-600 transition-all text-sm">
                                    <Trash2 size={16} /> Delete Selected ({selectedIds.length})
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Desktop Admin Comparison Table */}
                    <div className="hidden lg:block border border-gray-100 rounded-[16px] shadow-lg bg-white overflow-x-auto relative min-w-max">
                        {packages.length === 0 ? (
                            <div className="p-10 text-center text-gray-500 bg-white">
                                Architecture Packages are currently being configured. Check back later!
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr>
                                        <th className="p-6 border-b border-gray-100 bg-white align-bottom w-1/4 min-w-[300px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] z-20 relative sticky left-0">
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 rounded accent-primary cursor-pointer"
                                                    checked={selectedIds.length === features.length && features.length > 0}
                                                    onChange={toggleSelectAll}
                                                />
                                                <div>
                                                    <h3 className="text-xl font-bold text-primary">Features Outline</h3>
                                                    <p className="text-sm font-normal text-gray-500 mt-1">Configure rows horizontally</p>
                                                </div>
                                            </div>
                                        </th>
                                        {packages.map((pkg, idx) => {
                                            const colorSet = colorSets[idx % colorSets.length];
                                            const Icon = colorSet.icon;
                                            return (
                                                <th key={pkg.id} className={`p-6 border-b border-gray-100 border-l border-gray-50 text-center min-w-[280px] transition-all bg-white relative group ${!pkg.is_active && 'opacity-70'}`}>
                                                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => { setPkgForm(pkg); setIsPkgModal(true); }} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-md hover:text-primary"><Edit2 size={14} /></button>
                                                        <button onClick={() => deletePackage(pkg.id)} className="p-1.5 text-gray-400 hover:bg-red-50 rounded-md hover:text-red-500"><Trash2 size={14} /></button>
                                                    </div>
                                                    <div className={`mx-auto w-12 h-12 rounded-full ${colorSet.bgColor} ${colorSet.color} flex items-center justify-center mb-3 shadow-sm`}>
                                                        <Icon className="w-6 h-6" />
                                                    </div>
                                                    <div className="flex items-center justify-center gap-2 mb-1">
                                                        <h3 className="text-xl font-black text-primary">{pkg.name}</h3>
                                                        <span className={`text-[9px] uppercase font-black px-1.5 py-0.5 rounded-full ${pkg.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                            {pkg.is_active ? 'Active' : 'Hidden'}
                                                        </span>
                                                    </div>
                                                    <div className="text-2xl font-black text-secondary leading-none mb-1">{pkg.price}</div>
                                                    <span className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded inline-block mt-1 font-semibold">{pkg.min_area}</span>
                                                </th>
                                            );
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {features.map((feat) => {
                                        if (feat.type === 'heading') {
                                            return (
                                                <tr key={feat.id} className="bg-gray-100/80 group">
                                                    <td colSpan={packages.length + 1} className="p-4 px-6 border-b border-gray-200 font-black text-gray-800 text-sm uppercase tracking-wider relative group/feat">
                                                        <div className="flex justify-between items-center sticky left-0 max-w-max gap-3">
                                                            <input
                                                                type="checkbox"
                                                                className="w-4 h-4 rounded accent-primary cursor-pointer"
                                                                checked={selectedIds.includes(feat.id)}
                                                                onChange={() => toggleSelect(feat.id)}
                                                            />
                                                            <span>{feat.title}</span>
                                                            <div className="flex gap-1 opacity-0 group-hover/feat:opacity-100 transition-opacity ml-6">
                                                                <button
                                                                    onClick={() => {
                                                                        setFeatForm({ id: null, title: '', type: 'feature', value_mode: 'boolean', display_order: feat.display_order + 1 });
                                                                        setIsFeatModal(true);
                                                                    }}
                                                                    className="p-1 text-gray-500 hover:text-green-600 hover:bg-white rounded"
                                                                    title="Add Item to this section"
                                                                >
                                                                    <Plus size={14} />
                                                                </button>
                                                                <button onClick={() => { setFeatForm(feat); setIsFeatModal(true); }} className="p-1 text-gray-500 hover:text-primary hover:bg-white rounded"><Edit2 size={14} /></button>
                                                                <button onClick={() => deleteFeature(feat.id)} className="p-1 text-gray-500 hover:text-red-500 hover:bg-white rounded"><Trash2 size={14} /></button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        }

                                        return (
                                            <tr key={feat.id} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="p-4 px-6 border-b border-gray-100 font-bold text-gray-700 text-sm bg-white group-hover:bg-gray-50/50 relative z-10 sticky left-0 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                                                    <div className="flex justify-between items-center group/feat gap-3">
                                                        <div className="flex items-center gap-3">
                                                            <input
                                                                type="checkbox"
                                                                className="w-4 h-4 rounded accent-primary cursor-pointer"
                                                                checked={selectedIds.includes(feat.id)}
                                                                onChange={() => toggleSelect(feat.id)}
                                                            />
                                                            <span>{feat.title}</span>
                                                        </div>
                                                        <div className="flex gap-1 opacity-0 group-hover/feat:opacity-100 transition-opacity">
                                                            <button onClick={() => { setFeatForm(feat); setIsFeatModal(true); }} className="p-1 text-gray-400 hover:text-primary hover:bg-white rounded"><Edit2 size={14} /></button>
                                                            <button onClick={() => deleteFeature(feat.id)} className="p-1 text-gray-400 hover:text-red-500 hover:bg-white rounded"><Trash2 size={14} /></button>
                                                        </div>
                                                    </div>
                                                </td>
                                                {packages.map((pkg, pIdx) => {
                                                    const colorSet = colorSets[pIdx % colorSets.length];
                                                    const val = localFeatureValues.find(v => v.package_id === pkg.id && v.feature_id === feat.id) || { type: 'dash', value: '' };

                                                    return (
                                                        <td key={pkg.id} className={`p-4 border-b border-gray-100 border-l border-gray-50 text-center transition-colors duration-300 relative ${colorSet.bgHighlight}`}>
                                                            {feat.value_mode === 'text' ? (
                                                                <input
                                                                    type="text" value={val.type === 'text' ? (val.value || '') : ''}
                                                                    onChange={(e) => handleLocalValueChange(pkg.id, feat.id, 'text', e.target.value)}
                                                                    placeholder="Type value..."
                                                                    className="w-full text-[13px] font-medium border-b border-primary/30 bg-white/50 px-2 py-1 outline-none focus:border-primary focus:bg-white text-center shadow-sm rounded-sm"
                                                                />
                                                            ) : (
                                                                <div className="flex items-center justify-center gap-2">
                                                                    <label className={`cursor-pointer w-8 h-8 flex flex-col items-center justify-center rounded-full transition-all hover:bg-white/80 ${val.type === 'tick' ? 'bg-white shadow border border-green-200' : ''}`} title="Tick">
                                                                        <input type="radio" className="sr-only" checked={val.type === 'tick'} onChange={() => handleLocalValueChange(pkg.id, feat.id, 'tick', '')} />
                                                                        <Check size={16} className={val.type === 'tick' ? 'text-green-500' : 'text-gray-400'} />
                                                                    </label>
                                                                    <label className={`cursor-pointer w-8 h-8 flex flex-col items-center justify-center rounded-full transition-all hover:bg-white/80 ${val.type === 'dash' ? 'bg-white shadow border border-gray-200' : ''}`} title="Dash">
                                                                        <input type="radio" className="sr-only" checked={val.type === 'dash'} onChange={() => handleLocalValueChange(pkg.id, feat.id, 'dash', '')} />
                                                                        <Minus size={16} className={val.type === 'dash' ? 'text-gray-700' : 'text-gray-400'} />
                                                                    </label>
                                                                </div>
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Mobile Admin Layout Placeholder (Simplified for logic) */}
                    <div className="block lg:hidden space-y-4">
                        <div className="p-6 bg-red-50 text-red-600 rounded-xl border border-red-200 text-sm font-bold text-center">
                            Admin Matrix Editor is best experienced on Desktop. Please switch to a larger screen to edit the architectural matrix easily.
                        </div>
                    </div>

                </div>
            </div>

            {/* PACKAGE MODAL */}
            {isPkgModal && (
                <div className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center p-4">
                    <form onSubmit={savePackage} className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-slide-up">
                        <h3 className="font-bold text-lg mb-4">{pkgForm.id ? 'Edit Package' : 'New Package'}</h3>
                        <div className="space-y-3 mb-6">
                            <div><label className="text-xs font-bold text-gray-500">Name</label><input required type="text" value={pkgForm.name} onChange={e => setPkgForm({ ...pkgForm, name: e.target.value })} className="w-full border rounded p-2 text-sm mt-1 focus:border-primary outline-none" placeholder="Basic" /></div>
                            <div><label className="text-xs font-bold text-gray-500">Price</label><input required type="text" value={pkgForm.price} onChange={e => setPkgForm({ ...pkgForm, price: e.target.value })} className="w-full border rounded p-2 text-sm mt-1 focus:border-primary outline-none" placeholder="₹50" /></div>
                            <div><label className="text-xs font-bold text-gray-500">Min Area Text Location</label><input required type="text" value={pkgForm.min_area} onChange={e => setPkgForm({ ...pkgForm, min_area: e.target.value })} className="w-full border rounded p-2 text-sm mt-1 focus:border-primary outline-none" placeholder="Min. 1000 sq.ft built-up area" /></div>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="text-xs font-bold text-gray-500">Display Order</label><input required type="number" value={pkgForm.display_order} onChange={e => setPkgForm({ ...pkgForm, display_order: Number(e.target.value) })} className="w-full border rounded p-2 text-sm mt-1 focus:border-primary outline-none" /></div>
                                <div className="flex flex-col gap-1 mt-6">
                                    <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={pkgForm.is_active} onChange={e => setPkgForm({ ...pkgForm, is_active: e.target.checked })} /> Active</label>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setIsPkgModal(false)} className="px-4 py-2 border rounded-md text-sm font-bold">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md text-sm font-bold">Save Package</button>
                        </div>
                    </form>
                </div>
            )}

            {/* FEATURE MODAL */}
            {isFeatModal && (
                <div className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center p-4">
                    <form onSubmit={saveFeature} className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 animate-slide-up">
                        <h3 className="font-bold text-lg mb-4">{featForm.id ? 'Edit Arch Feature' : 'New Arch Feature'}</h3>
                        <div className="space-y-4 mb-6">
                            <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Feature Title</label><input required type="text" value={featForm.title} onChange={e => setFeatForm({ ...featForm, title: e.target.value })} className="w-full border rounded-lg shadow-sm p-3 text-sm mt-1 focus:border-primary outline-none focus:ring-1 focus:ring-primary/20" placeholder="e.g. 2D Floor Plan" /></div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Type</label>
                                <select required value={featForm.type || 'feature'} onChange={e => setFeatForm({ ...featForm, type: e.target.value, value_mode: e.target.value === 'heading' ? 'boolean' : (featForm.value_mode || 'boolean') })} className="w-full border rounded-lg shadow-sm p-3 text-sm mt-1 focus:border-primary outline-none focus:ring-1 focus:ring-primary/20">
                                    <option value="feature">Standard Feature (Row with values)</option>
                                    <option value="heading">Section Heading (Full width title)</option>
                                </select>
                            </div>
                            {featForm.type === 'feature' && (
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Feature Value Input Type</label>
                                    <select required value={featForm.value_mode || 'boolean'} onChange={e => setFeatForm({ ...featForm, value_mode: e.target.value })} className="w-full border rounded-lg shadow-sm p-3 text-sm mt-1 focus:border-primary outline-none focus:ring-1 focus:ring-primary/20 bg-gray-50">
                                        <option value="boolean">Boolean (Tick ✔️ / Dash ➖)</option>
                                        <option value="text">Text (Custom Custom Value 📝)</option>
                                    </select>
                                </div>
                            )}
                            <div><label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Sort Order</label><input required type="number" value={featForm.display_order} onChange={e => setFeatForm({ ...featForm, display_order: Number(e.target.value) })} className="w-full border rounded-lg shadow-sm p-3 text-sm mt-1 focus:border-primary outline-none focus:ring-1 focus:ring-primary/20" /></div>
                        </div>
                        <div className="flex justify-end gap-3 mt-8">
                            <button type="button" onClick={() => setIsFeatModal(false)} className="px-5 py-2 border rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
                            <button type="submit" className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-md hover:bg-secondary">Save Feature</button>
                        </div>
                    </form>
                </div>
            )}

            {/* BULK IMPORT MODAL */}
            {isBulkModal && (
                <div className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-[#f8fafc]">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                                    <FileSpreadsheet size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">Bulk Excel Spreadsheet Import</h3>
                                    <p className="text-xs text-gray-500 font-medium">Paste rows directly from your Excel sheets.</p>
                                </div>
                            </div>
                            <button onClick={() => setIsBulkModal(false)} className="text-gray-400 hover:text-gray-800 transition"><X size={24} /></button>
                        </div>
                        
                        <div className="p-6 flex-1 overflow-y-auto space-y-4">
                            <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3">
                                <div className="text-amber-600 shrink-0"><Check size={20} /></div>
                                <div className="text-xs text-amber-800 leading-relaxed font-medium">
                                    <p className="font-bold mb-1">Copying Rules:</p>
                                    <ul className="list-disc pl-4 space-y-1">
                                        <li>Lines starting with <span className="font-black">1.</span> (or any number) become <strong>headings</strong>.</li>
                                        <li>Rows with tabs (copied from Excel) become <strong>feature rows</strong>.</li>
                                        <li>Column 1 is the title, subsequent columns match your active packages.</li>
                                        <li>Use <span className="font-bold">✔</span> or <span className="font-bold">tick</span> for checkmarks, <span className="font-bold">-</span> for dashes.</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="relative">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Data Input Area</label>
                                <textarea
                                    className="w-full h-80 p-4 font-mono text-sm border border-gray-200 rounded-xl focus:border-emerald-500 outline-none shadow-inner bg-gray-50/50"
                                    placeholder={`1. Structure\nSteel\tGBR/Pulkit\tARS Steel\tTATA\nRCC Grade\tM20/M25\tM20/M25\tM25`}
                                    value={bulkData}
                                    onChange={(e) => setBulkData(e.target.value)}
                                ></textarea>
                                <div className="absolute top-8 right-2 p-2 pointer-events-none opacity-20">
                                    <ClipboardPaste size={64} className="text-gray-400" />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-white grid grid-cols-2 gap-3 shrink-0">
                            <button onClick={() => setIsBulkModal(false)} className="px-5 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition">Discard</button>
                            <button 
                                onClick={handleBulkImport} 
                                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 transition"
                            >
                                <FileSpreadsheet size={18} /> Parse & Inject into Matrix
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ArchitecturalConfigPage;
