import React from 'react';
import { useInView } from '../hooks/useInView';
import backgroundImage from '../assets/ec782500-9c29-4dbc-8b39-27acba75a178.jpg';

const AboutSection = () => {
    const [missionRef, missionVisible] = useInView({ threshold: 0.2 });
    const [visionRef, visionVisible] = useInView({ threshold: 0.2 });
    const [servicesRef, servicesVisible] = useInView({ threshold: 0.1 });

    const scrollToContact = () => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="bg-white">
            {/* Hero */}
            <div
                className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-20 px-6"
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed'
                }}
            >
                <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[2px]"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50"></div>

                <div className="container-wide relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                        {/* Left: Branding */}
                        <div className="space-y-8">
                            <div className="inline-flex items-center space-x-2 bg-yellow-400/10 border border-yellow-400/20 px-4 py-2 rounded-full">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                                </span>
                                <span className="text-yellow-400 text-xs font-bold uppercase tracking-widest">Est. 2017</span>
                            </div>

                            <h2 className="text-5xl md:text-7xl font-black text-white leading-[1.1]">
                                20 Years of <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                                    Structural Integrity
                                </span>
                            </h2>

                            <p className="text-lg md:text-xl text-slate-300 max-w-xl leading-relaxed border-l-4 border-yellow-500 pl-6 py-2">
                                At <span className="text-white font-semibold">Elite Construction</span>, we don't just build structures; we engineer the foundations of the future with a focus on precision and safety.
                            </p>

                            <div className="flex flex-wrap gap-4 pt-4">
                                <button
                                    onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="group relative px-8 py-4 bg-red-600 text-white font-bold rounded-lg transition-all duration-300 hover:bg-red-700 hover:ring-4 hover:ring-red-600/30 active:scale-95"
                                >
                                    Explore Our Services
                                    <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-2">→</span>
                                </button>
                            </div>
                        </div>

                        {/* Right: Mission & Vision */}
                        <div className="grid grid-cols-1 gap-6">
                            <div
                                ref={missionRef}
                                className={`group relative p-8 rounded-2xl bg-white transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl ${missionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <span className="text-8xl font-black italic">01</span>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                    <span className="text-3xl">🏗️</span> Our Mission
                                </h3>
                                <p className="text-slate-600 leading-relaxed">
                                    Deliver high-quality construction services with a focus on safety, innovation, and sustainability. We create lasting value for our clients through every brick laid.
                                </p>
                                <div className="mt-6 h-1 w-0 bg-yellow-500 transition-all duration-500 group-hover:w-full"></div>
                            </div>

                            <div
                                ref={visionRef}
                                className={`group relative p-8 rounded-2xl bg-white transition-all duration-700 delay-200 hover:-translate-y-2 hover:shadow-2xl ${visionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <span className="text-8xl font-black italic">02</span>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                    <span className="text-3xl">🌟</span> Our Vision
                                </h3>
                                <p className="text-slate-600 leading-relaxed">
                                    To be a leading global construction firm, transforming communities through innovative design and cutting-edge building technology.
                                </p>
                                <div className="mt-6 h-1 w-0 bg-red-500 transition-all duration-500 group-hover:w-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Services Preview */}
            <div
                ref={servicesRef}
                className={`py-24 bg-slate-50 transition-all duration-1000 ${servicesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
                <div className="container-wide">
                    <div className="max-w-3xl mb-16">
                        <h2 className="text-sm font-bold text-red-600 uppercase tracking-[0.2em] mb-4">What We Offer</h2>
                        <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">Expertise Across the Real Estate Spectrum</h3>
                        <p className="text-lg text-slate-600">Comprehensive solutions for the modern real estate landscape, driven by quality and ROI.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Residential Development',
                                desc: 'We redefine the concept of \'home\' by blending architectural innovation with uncompromising craftsmanship.',
                                features: ['Bespoke Private Villas', 'Multi-family Housing', 'Sustainable Finishes'],
                                color: 'red',
                                icon: (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a11 11 0 003 3h10a1 1 0 001-1V10M9 21h6" /></svg>
                                )
                            },
                            {
                                title: 'Commercial Projects',
                                desc: 'Delivering high-performance workspaces and retail hubs designed to drive business growth.',
                                features: ['Modern Office Fit-outs', 'Industrial Warehouse Units', 'Retail Storefront Excellence'],
                                color: 'yellow',
                                icon: (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                )
                            },
                            {
                                title: 'Strategic Consulting',
                                desc: 'We act as your strategic partner, mitigating risks and ensuring every project is delivered on time.',
                                features: ['3D Structural Modeling', 'Feasibility & Cost Estimation', 'Safety Audits & Quality Control'],
                                color: 'blue',
                                icon: (
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                )
                            }
                        ].map((service, idx) => (
                            <div key={idx} className="group p-10 bg-white border border-slate-100 rounded-3xl hover:shadow-2xl hover:border-transparent transition-all duration-300">
                                <div className={`w-16 h-16 bg-${service.color}-50 text-${service.color}-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-${service.color}-600 group-hover:text-white group-hover:rotate-12 transition-all`}>
                                    {service.icon}
                                </div>
                                <h4 className="text-2xl font-bold text-slate-900 mb-4">{service.title}</h4>
                                <p className="text-slate-600 leading-relaxed mb-6">{service.desc}</p>
                                <ul className="space-y-3 text-sm text-slate-500 font-medium">
                                    {service.features.map((f, i) => (
                                        <li key={i} className={`flex items-center gap-2 ${i === 0 ? 'font-semibold text-slate-700' : ''}`}>✓ {f}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-20 p-12 bg-slate-900 rounded-[3rem] text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                        <h4 className="text-3xl font-bold text-white mb-6 relative z-10">Ready to build your vision?</h4>
                        <button
                            onClick={scrollToContact}
                            className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black px-10 py-4 rounded-full transition-all relative z-10"
                        >
                            Book a Free Consultation
                        </button>
                    </div>
                </div>
            </div>

            {/* Marquee Bar */}
            <div className="bg-slate-900 border-y border-white/10 py-6 overflow-hidden flex whitespace-nowrap">
                <div className="flex animate-marquee space-x-12 items-center">
                    {['Residential Excellence', 'Commercial Innovation', '100% Safety Record', 'Sustainable Building'].map((text, i) => (
                        <span key={i} className="text-white/40 font-bold text-xl uppercase tracking-widest">✦ {text}</span>
                    ))}
                </div>
                <div className="flex animate-marquee space-x-12 items-center ml-12">
                    {['Residential Excellence', 'Commercial Innovation', '100% Safety Record', 'Sustainable Building'].map((text, i) => (
                        <span key={i} className="text-white/40 font-bold text-xl uppercase tracking-widest">✦ {text}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AboutSection;
