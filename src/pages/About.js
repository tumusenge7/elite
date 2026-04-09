
import React from 'react';

import backgroundImage from '../assets/ec782500-9c29-4dbc-8b39-27acba75a178.jpg';

function About() {
    return (
        <div className="min-h-screen bg-white selection:bg-yellow-400 selection:text-black font-sans">


            {/* --- HERO SECTION --- */}
            <section
                className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-20 px-6"
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed'
                }}
            >
                {/* Overlays for readability */}
                <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[2px]"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50"></div>

                <div className="container mx-auto relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                        {/* Left: Branding & Intro */}
                        <div className="space-y-8 animate-in fade-in slide-in-from-left duration-1000">
                            <div className="inline-flex items-center space-x-2 bg-yellow-400/10 border border-yellow-400/20 px-4 py-2 rounded-full">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                                </span>
                                <span className="text-yellow-400 text-xs font-bold uppercase tracking-widest">Est. 2017</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1]">
                                07 Years of <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                                    Structural Integrity
                                </span>
                            </h1>

                            <p className="text-lg md:text-xl text-slate-300 max-w-xl leading-relaxed border-l-4 border-yellow-500 pl-6 py-2">
                                At <span className="text-white font-semibold">Nkuru Construction</span>, we don't just build structures; we engineer the foundations of the future with a focus on precision and safety.
                            </p>

                            <div className="flex flex-wrap gap-4 pt-4">
                                <a href="#services" className="group relative px-8 py-4 bg-red-600 text-white font-bold rounded-lg transition-all duration-300 hover:bg-red-700 hover:ring-4 hover:ring-red-600/30 active:scale-95">
                                    Explore Our Services
                                    <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-2">→</span>
                                </a>
                            </div>
                        </div>

                        {/* Right: Mission & Vision Cards */}
                        <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-right duration-1000">
                            <div className="group relative p-8 rounded-2xl bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
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

                            <div className="group relative p-8 rounded-2xl bg-white transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
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
            </section>

            {/* --- SERVICES SECTION --- */}
            <section id="services" className="py-24 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mb-16">
                        <h2 className="text-sm font-bold text-red-600 uppercase tracking-[0.2em] mb-4">What We Offer</h2>
                        <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">Expertise Across the Real Estate Spectrum</h3>
                        <p className="text-lg text-slate-600">Comprehensive solutions for the modern real estate landscape, driven by quality and ROI.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Service 1 */}
                        <div className="group p-10 bg-white border border-slate-100 rounded-3xl hover:shadow-2xl hover:border-transparent transition-all duration-300">
                            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-red-600 group-hover:text-white group-hover:rotate-12 transition-all">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a11 11 0 003 3h10a1 1 0 001-1V10M9 21h6" /></svg>
                            </div>
                            <h4 className="text-2xl font-bold text-slate-900 mb-4">Residential Development</h4>
                            <p className="text-slate-600 leading-relaxed mb-6">
                                We redefine the concept of 'home' by blending architectural innovation with uncompromising craftsmanship. From villas to complexes, we manage every detail.
                            </p>
                            <ul className="space-y-3 text-sm text-slate-500 font-medium mb-8">
                                <li className="flex items-center gap-2 font-semibold text-slate-700">✓ Bespoke Private Villas</li>
                                <li className="flex items-center gap-2">✓ Multi-family Housing</li>
                                <li className="flex items-center gap-2">✓ Sustainable Finishes</li>
                            </ul>
                        </div>

                        {/* Service 2 */}
                        <div className="group p-10 bg-white border border-slate-100 rounded-3xl hover:shadow-2xl hover:border-transparent transition-all duration-300">
                            <div className="w-16 h-16 bg-yellow-50 text-yellow-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-yellow-500 group-hover:text-white group-hover:rotate-12 transition-all">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                            </div>
                            <h4 className="text-2xl font-bold text-slate-900 mb-4">Commercial Projects</h4>
                            <p className="text-slate-600 leading-relaxed mb-6">
                                Delivering high-performance workspaces and retail hubs designed to drive business growth. Every square foot optimized for functionality and safety.
                            </p>
                            <ul className="space-y-3 text-sm text-slate-500 font-medium mb-8">
                                <li className="flex items-center gap-2 font-semibold text-slate-700">✓ Modern Office Fit-outs</li>
                                <li className="flex items-center gap-2">✓ Industrial Warehouse Units</li>
                                <li className="flex items-center gap-2">✓ Retail Storefront Excellence</li>
                            </ul>
                        </div>

                        {/* Service 3 */}
                        <div className="group p-10 bg-white border border-slate-100 rounded-3xl hover:shadow-2xl hover:border-transparent transition-all duration-300">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-12 transition-all">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                            </div>
                            <h4 className="text-2xl font-bold text-slate-900 mb-4">Strategic Consulting</h4>
                            <p className="text-slate-600 leading-relaxed mb-6">
                                We act as your strategic partner, mitigating risks and ensuring that every project is delivered on time, within budget, and to structural code.
                            </p>
                            <ul className="space-y-3 text-sm text-slate-500 font-medium mb-8">
                                <li className="flex items-center gap-2 font-semibold text-slate-700">✓ 3D Structural Modeling</li>
                                <li className="flex items-center gap-2">✓ Feasibility & Cost Estimation</li>
                                <li className="flex items-center gap-2">✓ Safety Audits & Quality Control</li>
                            </ul>
                        </div>
                    </div>

                    {/* Final CTA */}
                    <div className="mt-20 p-12 bg-slate-900 rounded-[3rem] text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                        <h4 className="text-3xl font-bold text-white mb-6 relative z-10">Ready to build your vision?</h4>
                        <button className="bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-black px-10 py-4 rounded-full transition-all relative z-10">
                            Book a Free Consultation
                        </button>
                    </div>
                </div>
            </section>

            {/* --- MARQUEE BAR --- */}
            <div className="bg-slate-900 border-y border-white/10 py-6 overflow-hidden flex whitespace-nowrap">
                <div className="flex animate-marquee space-x-12 items-center">
                    <span className="text-white/40 font-bold text-xl uppercase tracking-widest">✦ Residential Excellence</span>
                    <span className="text-white/40 font-bold text-xl uppercase tracking-widest">✦ Commercial Innovation</span>
                    <span className="text-white/40 font-bold text-xl uppercase tracking-widest">✦ 100% Safety Record</span>
                    <span className="text-white/40 font-bold text-xl uppercase tracking-widest">✦ Sustainable Building</span>
                </div>
                {/* Duplicate for seamless loop */}
                <div className="flex animate-marquee space-x-12 items-center ml-12">
                    <span className="text-white/40 font-bold text-xl uppercase tracking-widest">✦ Residential Excellence</span>
                    <span className="text-white/40 font-bold text-xl uppercase tracking-widest">✦ Commercial Innovation</span>
                    <span className="text-white/40 font-bold text-xl uppercase tracking-widest">✦ 100% Safety Record</span>
                    <span className="text-white/40 font-bold text-xl uppercase tracking-widest">✦ Sustainable Building</span>
                </div>
            </div>
        </div>
    );
}

export default About;