import { useState } from 'react';
import { MapPin, Phone, Mail, Send, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Contact = () => {
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        service: '',
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
                type: 'Contact',
                name: formData.name,
                phone: formData.phone,
                email: formData.email,
                service_required: formData.service,
                message: formData.message
            }]);

            if (error) throw error;

            setStatus('success');

            // Pre-fill WhatsApp Message
            const waPhone = '917299114595';
            const waMessage = `*New Contact Inquiry*\n\n*Name:* ${formData.name}\n*Phone:* ${formData.phone}\n*Email:* ${formData.email}\n*Service:* ${formData.service}\n\n*Message:* ${formData.message}`;
            const encodedMessage = encodeURIComponent(waMessage);
            const waUrl = `https://wa.me/${waPhone}?text=${encodedMessage}`;

            // Open WhatsApp
            window.open(waUrl, '_blank');

            // Reset Form
            setFormData({ name: '', phone: '', email: '', service: '', message: '' });

        } catch (err) {
            console.error("Error submitting contact form:", err);
            alert("Failed to submit inquiry. Please try again.");
        } finally {
            setLoading(false);
            setTimeout(() => setStatus(''), 8000);
        }
    };

    return (
        <>
            <section className="bg-primary pt-32 pb-20 mt-0">
                <div className="container mx-auto px-6 text-center text-white">
                    <h1 className="text-4xl md:text-6xl font-black mb-6">Contact <span className="text-accent">DC CONSTRUCTIONS</span></h1>
                    <p className="text-xl max-w-2xl mx-auto opacity-90">Send us a message and we'll respond as soon as possible</p>
                </div>
            </section>

            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-6 max-w-6xl flex flex-col lg:flex-row gap-16">

                    <div className="lg:w-1/3">
                        <div className="mb-12">
                            <span className="text-secondary font-bold tracking-wider uppercase mb-2 block text-sm">Get in Touch</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Contact Information</h2>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-start gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                                <div className="bg-blue-50 p-4 rounded-xl text-secondary"><MapPin size={24} /></div>
                                <div>
                                    <h3 className="text-lg font-bold text-primary mb-1">Corporate Office</h3>
                                    <p className="text-gray-600 leading-relaxed text-sm">Chennai - Tiruvallur High Rd,<br />opposite to SRI VENKACHALAPATHY PALACE,<br />Veppambaattu, Annamalai Nagar,<br />Tamil Nadu 602024</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                                <div className="bg-blue-50 p-4 rounded-xl text-secondary"><Phone size={24} /></div>
                                <div>
                                    <h3 className="text-lg font-bold text-primary mb-1">Call Us</h3>
                                    <p className="text-gray-600">D.Kishore(Er): 7299114595</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                                <div className="bg-blue-50 p-4 rounded-xl text-secondary"><Mail size={24} /></div>
                                <div>
                                    <h3 className="text-lg font-bold text-primary mb-1">Email Now</h3>
                                    <p className="text-gray-600">dcconstructions22@gmail.com</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-2/3 bg-white p-10 md:p-14 rounded-3xl shadow-xl border border-gray-100">
                        <h3 className="text-2xl font-bold text-primary mb-8">Send a Message</h3>

                        {status === 'success' && (
                            <div className="mb-8 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl flex items-center gap-3 animate-fade-in text-sm font-semibold">
                                <CheckCircle2 className="text-green-500" /> Message sent successfully! Redirecting to WhatsApp...
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Name *</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-5 py-4 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white transition" placeholder="John Doe" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number *</label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-5 py-4 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white transition" placeholder="+91 XXXXX XXXXX" />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-5 py-4 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white transition" placeholder="john@example.com" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Service Required *</label>
                                    <select name="service" value={formData.service} onChange={handleChange} required className="w-full px-5 py-4 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white transition">
                                        <option value="">Select Service</option>
                                        <option value="Residential Construction">Residential Construction</option>
                                        <option value="Commercial Construction">Commercial Construction</option>
                                        <option value="Architectural Design">Architectural Design</option>
                                        <option value="Interiors">Interiors</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Your Message *</label>
                                <textarea name="message" value={formData.message} onChange={handleChange} required rows="5" className="w-full px-5 py-4 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:bg-white transition resize-none" placeholder="Tell us about your project..."></textarea>
                            </div>

                            <button type="submit" disabled={loading} className="bg-primary hover:bg-secondary disabled:opacity-50 text-white font-bold py-4 px-10 rounded-xl transition duration-300 shadow-md flex items-center gap-3 group">
                                {loading ? 'Processing...' : (
                                    <>Send Message <Send size={18} className="group-hover:translate-x-1 transition" /></>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="h-96 w-full bg-gray-200">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3197.4673109722135!2d79.98422227409917!3d13.128940387201089!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a528fa8b68dc99d%3A0x742c299c790c0522!2sDC%20Constructions!5e1!3m2!1sen!2sin!4v1773042871866!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Google Maps Location"
                ></iframe>
            </section>
        </>
    );
};

export default Contact;
