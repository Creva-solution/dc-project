import { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, UploadCloud, GripVertical, Users } from 'lucide-react';

const AboutConfigPage = () => {
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({ id: null, name: '', role: '', description: '', image: '' });

    const fileInputRef = useRef(null);

    // Fetch team membes from Supabase table 'team_members'
    const fetchTeam = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('team_members')
                .select('*')
                .order('order', { ascending: true });

            if (error) throw error;
            setTeam(data || []);
        } catch (error) {
            console.error(error);
            // Fallback for UI visualization without real DB
            toast.error("Error fetching team or table missing");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeam();
    }, []);

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

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    // Supabase Storage Image Upload with WebP conversion
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error("Only image files are allowed.");
            return;
        }

        if (file.size > 3 * 1024 * 1024) {
            toast.error("File size must be less than 3MB.");
            return;
        }

        try {
            setUploading(true);
            const webpBlob = await processImage(file);
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;
            const filePath = `team-images/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(filePath, webpBlob, { contentType: 'image/webp' });

            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('images').getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, image: data.publicUrl }));
            toast.success("Image uploaded successfully!");

        } catch (error) {
            console.error(error);
            toast.error('Error processing or uploading image.');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (!formData.name || !formData.role) {
                toast.error("Name and Role are required");
                return;
            }

            if (formData.id) {
                // UPDATE
                const { error } = await supabase
                    .from('team_members')
                    .update({
                        name: formData.name,
                        role: formData.role,
                        description: formData.description,
                        image: formData.image
                    })
                    .eq('id', formData.id);

                if (error) throw error;
                toast.success("Team member updated!");
            } else {
                // INSERT
                const { error } = await supabase
                    .from('team_members')
                    .insert([{
                        name: formData.name,
                        role: formData.role,
                        description: formData.description,
                        image: formData.image,
                        order: team.length
                    }]);

                if (error) throw error;
                toast.success("Team member added!");
            }

            setIsModalOpen(false);
            fetchTeam();

        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this member?")) return;

        try {
            const { error } = await supabase
                .from('team_members')
                .delete()
                .eq('id', id);

            if (error) throw error;
            toast.success("Deleted successfully");
            fetchTeam();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const openEditModal = (member) => {
        setFormData(member);
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        setFormData({ id: null, name: '', role: '', description: '', image: '' });
        setIsModalOpen(true);
    };

    return (
        <div className="animate-fade-in max-w-7xl mx-auto">

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-4 border-b border-gray-200">
                <div>
                    <h1 className="text-3xl font-black text-primary tracking-tight">Team Management</h1>
                    <p className="text-gray-500 font-medium text-sm mt-1">Add, edit or reorder the team section shown on the About Us page.</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="mt-4 sm:mt-0 bg-primary hover:bg-secondary text-white font-bold py-2.5 px-6 rounded-lg transition-colors shadow flex items-center gap-2"
                >
                    <Plus size={20} /> Add Member
                </button>
            </div>

            {/* List Skeleton / Table */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-white border border-gray-100 rounded-xl shadow-sm animate-pulse"></div>
                    ))}
                </div>
            ) : team.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                    <div className="mx-auto w-16 h-16 bg-blue-50 text-blue-300 rounded-full flex items-center justify-center mb-4">
                        <Users size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No team members</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">You haven't added any team members yet. Click the "Add Member" button above to get started.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden text-sm">
                    <table className="w-full text-left">
                        <thead className="bg-[#f8fafc] border-b border-gray-200">
                            <tr>
                                <th className="p-4 w-12 text-gray-400"></th>
                                <th className="p-4 font-bold text-gray-600 uppercase tracking-wider text-xs">Member</th>
                                <th className="p-4 font-bold text-gray-600 uppercase tracking-wider text-xs hidden md:table-cell">Role</th>
                                <th className="p-4 font-bold text-gray-600 uppercase tracking-wider text-xs text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {team.map((member) => (
                                <tr key={member.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
                                    <td className="p-4 align-middle">
                                        <GripVertical size={20} className="text-gray-300 cursor-move hover:text-gray-500" />
                                    </td>
                                    <td className="p-4 flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden border border-gray-200 shrink-0">
                                            {member.image ? (
                                                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-blue-50 flex items-center justify-center text-primary font-black uppercase">{member.name.charAt(0)}</div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 text-base">{member.name}</p>
                                            <p className="text-gray-500 md:hidden">{member.role}</p>
                                        </div>
                                    </td>
                                    <td className="p-4 hidden md:table-cell">
                                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-primary font-bold text-xs">
                                            {member.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => openEditModal(member)} className="p-2 text-gray-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors">
                                                <Edit2 size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(member.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal Overlay Config */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-slide-up relative">

                        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-[#f8fafc]">
                            <h3 className="text-xl font-bold text-primary">{formData.id ? 'Edit Team Member' : 'Add Team Member'}</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-800 transition">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-6">

                            {/* Image Upload Area */}
                            <div className="mb-6 flex justify-center">
                                <div className="relative group cursor-pointer" onClick={handleUploadClick}>
                                    <div className="w-28 h-28 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden transition group-hover:border-primary group-hover:bg-blue-50">
                                        {formData.image ? (
                                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <UploadCloud size={28} className="text-gray-400 group-hover:text-primary transition" />
                                        )}
                                        {uploading && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                                                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                        accept="image/png, image/jpeg, image/jpg, image/webp"
                                        className="hidden"
                                    />
                                    <div className="mt-2 text-xs font-bold text-center text-primary group-hover:underline">Upload Photo</div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-gray-700">Full Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white"
                                            placeholder="D. Kishore"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-gray-700">Role / Position</label>
                                        <input
                                            type="text"
                                            value={formData.role}
                                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white"
                                            placeholder="Senior Architect"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-gray-700">Short Description</label>
                                    <textarea
                                        rows={3}
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white resize-none"
                                        placeholder="Crafting innovative and sustainable structures..."
                                    />
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-100">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-lg font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition">Cancel</button>
                                <button type="submit" className="px-6 py-2.5 rounded-lg font-bold text-white bg-primary hover:bg-secondary transition shadow-sm">
                                    {formData.id ? 'Save Changes' : 'Create Member'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AboutConfigPage;
