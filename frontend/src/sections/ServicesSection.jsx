import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useInView } from '../hooks/useInView';

const ServicesSection = () => {
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [headerRef, headerVisible] = useInView({ threshold: 0.3 });

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/services');
                const servicesWithFullUrl = res.data.map(s => ({
                    ...s,
                    image: s.main_image?.startsWith('http') ? s.main_image : `http://localhost:5000${s.main_image}`,
                    detailedImages: s.gallery_images ? s.gallery_images.split(',').map(img => img.trim().startsWith('http') ? img.trim() : `http://localhost:5000${img.trim()}`) : []
                }));
                setServices(servicesWithFullUrl);
            } catch (err) {
                console.error('Error fetching services:', err);
            }
        };
        fetchServices();
    }, []);

    return (
        <div className="bg-white">
            {/* Header */}
            <div className="py-20 bg-gradient-to-b from-slate-900 to-slate-800 text-center">
                <span className="text-red-400 font-bold uppercase tracking-[0.2em] text-sm">What We Offer</span>
                <h2 className="text-4xl md:text-5xl font-extrabold mt-4 text-white tracking-tight">Our Services</h2>
                <p className="text-slate-400 mt-4 max-w-2xl mx-auto px-4">Click on any service to see more details and photos</p>
            </div>

            {/* Grid */}
            <div
                ref={headerRef}
                className={`container-wide py-16 transition-all duration-1000 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-2"
                            onClick={() => setSelectedService(service)}
                        >
                            <div className="h-64 overflow-hidden relative">
                                <img src={service.image} alt={service.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                                    <button className="bg-red-500 text-white px-6 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105">
                                        Read More
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">{service.name}</h3>
                                <p className="text-gray-600 text-center text-sm">{service.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {selectedService && (
                <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setSelectedService(null)}>
                    <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center z-10">
                            <h2 className="text-2xl font-bold text-gray-900">{selectedService.name}</h2>
                            <button onClick={() => setSelectedService(null)} className="text-gray-500 hover:text-gray-700 transition">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-700 leading-relaxed mb-8">{selectedService.detailed_description}</p>
                            <div className="grid md:grid-cols-3 gap-4 mb-8">
                                {selectedService.detailedImages.map((img, idx) => (
                                    <div key={idx} className="relative group overflow-hidden rounded-lg shadow-md">
                                        <img src={img} alt={`${selectedService.name} ${idx + 1}`} className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110" />
                                    </div>
                                ))}
                            </div>
                            <div className="bg-gray-50 rounded-lg p-6 text-center">
                                <h4 className="text-lg font-semibold text-gray-900 mb-3">Ready to get started?</h4>
                                <button
                                    onClick={() => { setSelectedService(null); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }}
                                    className="inline-block bg-red-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600 transition transform hover:scale-105"
                                >
                                    Request a Quote
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServicesSection;
