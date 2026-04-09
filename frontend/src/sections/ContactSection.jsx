import React, { useState, useRef } from 'react';
import axios from 'axios';
import emailjs from '@emailjs/browser';
import { useInView } from '../hooks/useInView';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';

const ContactSection = () => {
    const formRef = useRef();
    const [sectionRef] = useInView({ threshold: 0.1 });
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        if (!formData.message.trim()) newErrors.message = 'Message is required';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();
        if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

        setIsSubmitting(true);
        setSubmitStatus(null);

        try {
            // 1. Send to Backend for Database logging
            await axios.post('http://localhost:5000/api/messages', formData);

            // 2. Send via EmailJS (User needs to configure these in .env)
            // Replace with actual keys: emailjs.sendForm('SERVICE_ID', 'TEMPLATE_ID', formRef.current, 'PUBLIC_KEY')
            const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID || 'service_test';
            const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || 'template_test';
            const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || 'public_key_test';

            if (serviceId !== 'service_test') {
                await emailjs.sendForm(serviceId, templateId, formRef.current, publicKey);
            }

            setSubmitStatus('success');
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
            setTimeout(() => setSubmitStatus(null), 8000);
        } catch (err) {
            console.error('Error sending message:', err);
            setSubmitStatus('error');
            setTimeout(() => setSubmitStatus(null), 8000);
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactInfo = [
        { title: 'Visit Our Office', content: 'KG 123 St, Kigali, Rwanda', icon: <MapPin className="w-6 h-6" />, color: 'bg-blue-50 text-blue-600' },
        { title: 'Emergency Call', content: '+250 786 495 227', icon: <Phone className="w-6 h-6" />, color: 'bg-green-50 text-green-600' },
        { title: 'Official Email', content: 'info@eliteconstruction.rw', icon: <Mail className="w-6 h-6" />, color: 'bg-red-50 text-red-600' },
        { title: 'Working Hours', content: 'Mon - Fri: 8AM - 5PM', icon: <Clock className="w-6 h-6" />, color: 'bg-purple-50 text-purple-600' }
    ];

    return (
        <div id="contact" className="bg-slate-50 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-red-500/5 blur-[120px] rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-500/5 blur-[120px] rounded-full -ml-20 -mb-20"></div>

            {/* Header */}
            <div className="py-24 bg-slate-900 text-center relative">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                >
                    <span className="text-red-500 font-black uppercase tracking-[0.4em] text-sm mb-4 block">Get In Touch</span>
                    <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter">Let's Build Your Dream</h2>
                    <p className="text-slate-400 mt-6 max-w-2xl mx-auto px-4 text-lg">
                        Ready to start your next high-end construction project? Reach out today for a professional consultation.
                    </p>
                </motion.div>
            </div>

            {/* Content */}
            <div
                ref={sectionRef}
                className="container-wide py-20 relative z-10"
            >
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Contact Cards */}
                    <div className="lg:col-span-1 space-y-6">
                        {contactInfo.map((card, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-5 group hover:shadow-xl hover:border-red-500/20 transition-all duration-500"
                            >
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-500 group-hover:scale-110 ${card.color}`}>
                                    {card.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-1">{card.title}</h3>
                                    <p className="text-slate-600 leading-relaxed">{card.content}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Form */}
                    <motion.div 
                        className="lg:col-span-2"
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <form ref={formRef} onSubmit={handleSubmit} className="bg-white shadow-2xl shadow-slate-200/50 rounded-3xl p-8 md:p-12 border border-slate-100">
                            <div className="grid md:grid-cols-2 gap-8 text-left">
                                {[
                                    { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe', icon: <Mail className="w-4 h-4" /> },
                                    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com' },
                                    { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+250 xxx xxx xxx' },
                                    { name: 'subject', label: 'Subject', type: 'text', placeholder: 'How can we help?' }
                                ].map((field) => (
                                    <div key={field.name} className="space-y-2">
                                        <label className="text-sm font-black text-slate-900 uppercase tracking-widest ml-1">{field.label}</label>
                                        <input
                                            type={field.type} 
                                            name={field.name} 
                                            value={formData[field.name]}
                                            onChange={handleChange} 
                                            placeholder={field.placeholder}
                                            className={`w-full px-6 py-4 bg-slate-50 border-[2px] rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/10 transition-all duration-300 font-medium ${errors[field.name] ? 'border-red-200 bg-red-50' : 'border-slate-100 focus:border-red-500'}`}
                                        />
                                        {errors[field.name] && (
                                            <p className="text-red-500 text-xs font-bold mt-1 flex items-center gap-1">
                                                <AlertCircle size={12} /> {errors[field.name]}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 text-left">
                                <label className="text-sm font-black text-slate-900 uppercase tracking-widest ml-1">Message Details</label>
                                <textarea
                                    name="message" 
                                    value={formData.message} 
                                    onChange={handleChange} 
                                    rows="6"
                                    placeholder="Tell us about your architectural vision..."
                                    className={`w-full px-6 py-4 bg-slate-50 border-[2px] rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/10 transition-all duration-300 font-medium resize-none ${errors.message ? 'border-red-200 bg-red-50' : 'border-slate-100 focus:border-red-500'}`}
                                ></textarea>
                                {errors.message && (
                                    <p className="text-red-500 text-xs font-bold mt-1 flex items-center gap-1">
                                        <AlertCircle size={12} /> {errors.message}
                                    </p>
                                )}
                            </div>

                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="mt-10 w-full bg-slate-900 hover:bg-red-600 text-white font-black py-5 px-10 rounded-xl transition-all duration-500 transform hover:scale-[1.02] flex items-center justify-center gap-3 disabled:opacity-50 group shadow-lg shadow-slate-900/10 hover:shadow-red-600/20"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Processing...
                                    </span>
                                ) : (
                                    <>
                                        Submit Request
                                        <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </>
                                )}
                            </button>

                            <AnimatePresence>
                                {submitStatus === 'success' && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="mt-6 flex items-center gap-3 bg-green-50 text-green-700 px-6 py-4 rounded-xl border border-green-100 font-bold"
                                    >
                                        <CheckCircle2 className="shrink-0" />
                                        Message Sent! We'll contact you within 24 hours.
                                    </motion.div>
                                )}
                                {submitStatus === 'error' && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="mt-6 flex items-center gap-3 bg-red-50 text-red-700 px-6 py-4 rounded-xl border border-red-100 font-bold"
                                    >
                                        <AlertCircle className="shrink-0" />
                                        Network Error. Please try again or call us directly.
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </form>
                    </motion.div>
                </div>

                {/* Map Section */}
                <motion.div 
                    className="mt-24"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <div className="bg-white p-4 rounded-[2rem] shadow-xl border border-slate-100 group">
                        <div className="rounded-[1.5rem] overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000">
                            <iframe
                                title="HQ Location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.221!2d-74.003!3d40.713!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0!2zMTPCsDQyJzQ3LjAiTiA3N8KwMDAnMTIuMyJX!5e0!3m2!1sen!2sus!4v1644262072453"
                                width="100%" height="500" style={{ border: 0 }} allowFullScreen="" loading="lazy"
                            ></iframe>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
export default ContactSection;
