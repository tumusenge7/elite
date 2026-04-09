import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
    {
        name: "Jean Paul Nkurunziza",
        role: "Real Estate Developer",
        content: "Elite Construction transformed our vision into reality. Their attention to detail and commitment to quality is unmatched in the Rwandan market. The luxury villa project was completed ahead of schedule with zero compromise on structural integrity.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"
    },
    {
        name: "Alice Murenzi",
        role: "Corporate Executive",
        content: "The level of professionalism displayed by the team was refreshing. From the initial design phase to the final handover, they kept us informed and involved. They are truly the best in heavy construction and consultancy.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200"
    },
    {
        name: "David Smith",
        role: "International Client",
        content: "Working with them was a seamless experience. They handled everything from permits to final finishing. I highly recommend them for anyone looking for reliable and high-quality construction services.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200"
    }
];

const TestimonialsSection = () => {
    return (
        <section id="testimonials" className="py-24 bg-white relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/20 to-transparent"></div>
            
            <div className="container-wide">
                <div className="text-center mb-16">
                    <motion.span 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-red-500 font-black uppercase tracking-[0.4em] text-sm mb-4 block"
                    >
                        Client Voice
                    </motion.span>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight"
                    >
                        Trusted by Professionals
                    </motion.h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-slate-50 p-10 rounded-[2.5rem] relative group hover:bg-slate-900 transition-all duration-500"
                        >
                            <div className="absolute top-8 right-8 text-red-500/10 group-hover:text-red-500/20 transition-colors">
                                <Quote size={60} fill="currentColor" />
                            </div>

                            <div className="flex gap-1 mb-6">
                                {[...Array(item.rating)].map((_, i) => (
                                    <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>

                            <p className="text-slate-600 group-hover:text-slate-300 transition-colors text-lg italic leading-relaxed mb-8 relative z-10">
                                "{item.content}"
                            </p>

                            <div className="flex items-center gap-4">
                                <img 
                                    src={item.image} 
                                    alt={item.name} 
                                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-lg"
                                />
                                <div>
                                    <h4 className="font-black text-slate-900 group-hover:text-white transition-colors">{item.name}</h4>
                                    <p className="text-sm text-slate-500 group-hover:text-red-400 transition-colors">{item.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
