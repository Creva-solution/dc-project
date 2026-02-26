import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { MailOpen, Phone, MapPin, Calendar, Clock, CheckCircle2, Circle } from 'lucide-react';
import toast from 'react-hot-toast';

const InquiriesConfigPage = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');

    const fetchInquiries = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('inquiries')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setInquiries(data || []);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInquiries();
    }, []);

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'Resolved' ? 'New' : 'Resolved';
        try {
            const { error } = await supabase
                .from('inquiries')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;
            toast.success(`Marked as ${newStatus}`);
            fetchInquiries();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this inquiry permanently?')) return;
        try {
            const { error } = await supabase.from('inquiries').delete().eq('id', id);
            if (error) throw error;
            toast.success('Inquiry deleted');
            fetchInquiries();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const filteredInquiries = inquiries.filter(inc => {
        if (filter === 'All') return true;
        if (filter === 'Contact') return inc.type === 'Contact';
        if (filter === 'Consultation') return inc.type === 'Consultation';
        if (filter === 'Resolved') return inc.status === 'Resolved';
        return true;
    });

    return (
        <div className="animate-fade-in max-w-7xl mx-auto pb-20 p-2 md:p-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-primary tracking-tight mb-2">Inquiries & Leads</h1>
                    <p className="text-gray-500 font-medium text-sm">Manage contacts and consultation requests.</p>
                </div>
                <div className="flex bg-white rounded-xl shadow-sm border border-gray-200 p-1">
                    {['All', 'Contact', 'Consultation', 'Resolved'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${filter === f ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-gray-800'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full shadow-lg"></div></div>
            ) : filteredInquiries.length === 0 ? (
                <div className="bg-white rounded-2xl p-16 text-center border border-gray-100 shadow-sm">
                    <MailOpen size={48} className="mx-auto text-blue-100 mb-4" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No Inquiries Found</h3>
                    <p className="text-gray-500 max-w-sm mx-auto">There are currently no submissions matching this filter.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredInquiries.map((inc) => (
                        <div key={inc.id} className="bg-white rounded-[20px] flex flex-col border border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all overflow-hidden relative">
                            {/* Header Stripe */}
                            <div className={`h-2 w-full absolute top-0 left-0 ${inc.type === 'Contact' ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>

                            <div className="p-6 pb-4 border-b border-gray-100 flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded bg-gray-50 border border-gray-200 ${inc.type === 'Contact' ? 'text-emerald-600' : 'text-blue-600'}`}>
                                            {inc.type}
                                        </span>
                                        <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded border flex items-center gap-1 cursor-pointer transition-colors ${inc.status === 'Resolved' ? 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100' : 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100'}`} onClick={() => toggleStatus(inc.id, inc.status)}>
                                            {inc.status === 'Resolved' ? <CheckCircle2 size={12} /> : <Circle size={12} />} {inc.status}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900 leading-tight">{inc.name}</h3>
                                    <div className="flex items-center gap-1.5 text-gray-500 text-xs mt-2 font-medium">
                                        <Clock size={12} /> {new Date(inc.created_at).toLocaleDateString('en-GB')} at {new Date(inc.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                                <button onClick={() => handleDelete(inc.id)} className="text-gray-400 hover:text-red-500 transition-colors p-2 -mr-2 -mt-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                                </button>
                            </div>

                            <div className="p-6 flex-1 bg-gray-50/50 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Phone</span>
                                        <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-800"><Phone size={14} className="text-gray-400" /> {inc.phone}</div>
                                    </div>
                                    {inc.email && (
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Email</span>
                                            <div className="text-sm font-semibold text-gray-800 break-words">{inc.email}</div>
                                        </div>
                                    )}
                                </div>

                                {inc.type === 'Consultation' ? (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Plot Size</span>
                                                <div className="text-sm font-semibold text-gray-800">{inc.plot_size || '-'}</div>
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Budget</span>
                                                <div className="text-sm font-semibold text-gray-800">{inc.budget || '-'}</div>
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Location</span>
                                            <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-800"><MapPin size={14} className="text-gray-400" /> {inc.location || '-'}</div>
                                        </div>
                                    </>
                                ) : (
                                    <div>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Service Required</span>
                                        <div className="inline-block bg-white border border-gray-200 text-primary text-xs font-bold px-2.5 py-1 rounded shadow-sm">{inc.service_required || 'Not Specified'}</div>
                                    </div>
                                )}

                                <div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Message Details</span>
                                    <div className="text-sm text-gray-600 bg-white border border-gray-100 p-3 rounded-lg shadow-sm font-medium">
                                        {inc.message || <span className="text-gray-400 italic">No message provided</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-white border-t border-gray-100">
                                <a
                                    href={`https://wa.me/91${inc.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${inc.name}, we received your inquiry regarding ${inc.type === 'Contact' ? inc.service_required : 'a Free Consultation'} on our website.`)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-2.5 rounded-xl transition text-sm shadow-sm"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" /></svg>
                                    Reply via WhatsApp
                                </a>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InquiriesConfigPage;
