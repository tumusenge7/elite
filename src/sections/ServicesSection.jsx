import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useInView } from '../hooks/useInView';

const ServicesSection = () => {
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState(null);
    const [headerRef, headerVisible] = useInView({ threshold: 0.3 });

    useEffect(() => {
        const fetchServices = async () => {
            try {
                console.log('Fetching services...');
                const res = await API.get('/api/services');
                console.log('Services fetched:', res.data);
                setServices(res.data);
            } catch (err) {
                console.error('Error fetching services:', err);
            }
        };
        fetchServices();
    }, []);

    return (
        <div className="bg-white">
            <div className="py-20 bg-gradient-to-b from-slate-900 to-slate-800 text-center">
                <span className="text-red-400 font-bold uppercase tracking-[0.2em] text-sm">What We Offer</span>
                <h2 className="text-4xl md:text-5xl font-extrabold mt-4 text-white tracking-tight">Our Services</h2>
                <p className="text-slate-400 mt-4 max-w-2xl mx-auto px-4">Professional construction services tailored to your needs</p>
            </div>

            <div ref={headerRef} className={`container-wide py-16 transition-all duration-1000 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service) => (
                        <div key={service.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-2">
                            <div className="h-48 bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
                                <span className="text-white text-4xl font-bold">{service.name?.charAt(0)}</span>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                                <p className="text-gray-600">{service.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ServicesSection;