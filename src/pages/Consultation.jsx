import { useState } from 'react';
import { Sparkles, CalendarCheck, Home as HomeIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

const Consultation = () => {
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        plotSize: '',
        budget: '',
        location: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Save to database
            const { error } = await supabase.from('inquiries').insert([{
                type: 'Consultation',
                name: formData.name,
                phone: formData.phone,
                plot_size: formData.plotSize,
                budget: formData.budget,
                location: formData.location,
                message: formData.message
            }]);

            if (error) throw error;

            setStatus('success');

            // Pre-fill WhatsApp Message
            const waPhone = '917299114595';
            const waMessage = `*New Free Consultation Request*\n\n*Name:* ${formData.name}\n*Phone:* ${formData.phone}\n*Plot Size:* ${formData.plotSize || 'N/A'}\n*Budget:* ${formData.budget || 'N/A'}\n*Location:* ${formData.location}\n\n*Details:* ${formData.message || 'N/A'}`;
            const encodedMessage = encodeURIComponent(waMessage);
            const waUrl = `https://wa.me/${waPhone}?text=${encodedMessage}`;

            // Open WhatsApp
            window.open(waUrl, '_blank');

            // Reset Form
            setFormData({ name: '', phone: '', plotSize: '', budget: '', location: '', message: '' });

        } catch (err) {
            console.error("Error submitting consultation request:", err);
            alert("Failed to send request. Please try again.");
        } finally {
            setLoading(false);
            setTimeout(() => setStatus(''), 8000);
        }
    };

    return (
        <>
            <motion.section 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="bg-primary pt-32 pb-20 mt-0"
            >
                <div className="container mx-auto px-6 text-center text-white">
                    <h1 className="text-4xl md:text-6xl font-black mb-6">Free <span className="text-secondary">Consultation</span></h1>
                    <p className="text-xl max-w-2xl mx-auto opacity-90">Book an exclusive evaluation for your upcoming project.</p>
                </div>
            </motion.section>

            <section className="py-24 bg-blue-50">
                <div className="container mx-auto px-6 max-w-5xl">

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="grid lg:grid-cols-5 gap-12 items-center bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
                    >

                        <div className="lg:col-span-2 bg-gradient-to-br from-primary to-blue-900 p-12 text-white h-full relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <HomeIcon size={120} />
                            </div>
                            <div className="relative z-10">
                                <h2 className="text-3xl font-bold mb-6">Why Consult Us?</h2>
                                <ul className="space-y-6">
                                    <li className="flex gap-4 items-start">
                                        <CalendarCheck className="text-secondary shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">Expert Evaluation</h4>
                                            <p className="text-gray-300 text-sm">Professional review of your plot layout and feasibility.</p>
                                        </div>
                                    </li>
                                    <li className="flex gap-4 items-start">
                                        <Sparkles className="text-secondary shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">Clear Estimates</h4>
                                            <p className="text-gray-300 text-sm">No hidden costs, accurate BOQ breakdown.</p>
                                        </div>
                                    </li>
                                </ul>
                                <div className="mt-12 p-6 bg-white/10 rounded-xl backdrop-blur">
                                    <p className="italic text-sm text-gray-200">"They guided us from empty land to a dream home smoothly. Best decision ever."</p>
                                    <p className="font-bold mt-2">- Recent Client</p>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-3 p-10 md:p-14 bg-white relative">
                            <h3 className="text-2xl font-bold text-primary mb-8">Schedule Your Session</h3>

                            {status === 'success' && (
                                <div className="mb-8 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200 font-bold text-sm text-center">
                                    Thank you! Your request was saved. Redirecting to WhatsApp...
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Full Name *</label>
                                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Phone Number *</label>
                                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary" />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Plot Size (sq.ft)</label>
                                        <input type="number" name="plotSize" value={formData.plotSize} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary" placeholder="e.g. 1500" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Budget Range</label>
                                        <select name="budget" value={formData.budget} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary">
                                            <option value="">Select Range</option>
                                            <option value="Under ₹50 L">Under ₹50 L</option>
                                            <option value="₹50 L - ₹1 Cr">₹50 L - ₹1 Cr</option>
                                            <option value="Above ₹1 Cr">Above ₹1 Cr</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Project Location *</label>
                                    <input type="text" name="location" value={formData.location} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary" placeholder="City or Area" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Project Requirements details</label>
                                    <textarea name="message" value={formData.message} onChange={handleChange} rows="4" className="w-full px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary resize-none" placeholder="Elaborate your requirements..."></textarea>
                                </div>

                                <button type="submit" disabled={loading} className="w-full bg-secondary disabled:opacity-50 text-white font-bold py-4 rounded-xl hover:bg-primary transition shadow-md">
                                    {loading ? 'Processing...' : 'Request Free Consultation'}
                                </button>
                            </form>
                        </div>

                    </motion.div>

                </div>
            </section>
        </>
    );
};

export default Consultation;
