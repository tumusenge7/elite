import React, { useState } from 'react';

const Services = () => {
    const [selectedService, setSelectedService] = useState(null);

    const services = [
        {
            id: 1,
            name: "Residential Construction",
            image: "https://images.unsplash.com/photo-1503387762-592dea58ef23?q=80&w=800",
            description: "Expert residential construction services from concept to completion.",
            detailedImages: [
                "https://images.unsplash.com/photo-1503387762-592dea58ef23?q=80&w=800",
                "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800",
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800"
            ],
            detailedDescription: "We build custom homes, townhouses, and multi-family residences with exceptional craftsmanship. Our team works closely with you from design to completion, ensuring every detail meets your expectations. We use high-quality materials and the latest construction techniques to deliver homes that are both beautiful and durable."
        },
        {
            id: 2,
            name: "Commercial Building",
            image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800",
            description: "Full-service commercial construction for office buildings and retail spaces.",
            detailedImages: [
                "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800",
                "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=800",
                "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800"
            ],
            detailedDescription: "Our commercial construction division delivers projects on time and within budget. We specialize in office buildings, retail centers, hotels, and industrial facilities. With extensive experience in complex commercial projects, we ensure minimal disruption to operations while maintaining the highest quality standards."
        },
        {
            id: 3,
            name: "Renovation & Remodeling",
            image: "https://images.unsplash.com/photo-1554232456-8727aae91df4?q=80&w=800",
            description: "Transform your existing space with our comprehensive renovation services.",
            detailedImages: [
                "https://images.unsplash.com/photo-1554232456-8727aae91df4?q=80&w=800",
                "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800",
                "https://images.unsplash.com/photo-1581092335871-4b7e7fd7d2f8?q=80&w=800"
            ],
            detailedDescription: "Whether you want to update a single room or completely transform your property, our renovation experts deliver stunning results. We handle everything from design and permits to construction and finishing touches. Kitchen remodeling, bathroom renovation, basement finishing, and home additions are our specialties."
        },
        {
            id: 4,
            name: "Interior Design",
            image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800",
            description: "Professional interior design that blends aesthetics with functionality.",
            detailedImages: [
                "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800",
                "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800",
                "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?q=80&w=800"
            ],
            detailedDescription: "Our interior design team creates beautiful, functional spaces that reflect your personality. We handle space planning, color consultation, furniture selection, lighting design, and material selection. From concept to installation, we ensure a cohesive and stunning result that exceeds your expectations."
        },
        {
            id: 5,
            name: "Project Management",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800",
            description: "End-to-end project management ensuring on-time and on-budget delivery.",
            detailedImages: [
                "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800",
                "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800",
                "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800"
            ],
            detailedDescription: "Our professional project managers oversee every aspect of your construction project. We use industry-leading project management software and methodologies to ensure your project is delivered on time, within budget, and to the highest quality standards. Services include planning, budget management, schedule coordination, and quality control."
        },
        {
            id: 6,
            name: "Consultation",
            image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800",
            description: "Expert construction consultation including feasibility studies and cost estimation.",
            detailedImages: [
                "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800",
                "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800",
                "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800"
            ],
            detailedDescription: "Our consultation services provide expert guidance at every stage of your project. Whether you need help with initial planning, cost estimation, or technical challenges, our experienced consultants are here to help. Services include feasibility studies, cost estimation, technical guidance, permit assistance, and site analysis."
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section
                className="relative h-[300px] md:h-[400px] flex items-center justify-center bg-fixed bg-center bg-cover"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=1200')`
                }}
            >
                <div className="text-center">
                    <h1 className="text-white text-4xl md:text-6xl font-bold tracking-tight uppercase mb-4">
                        Our Services
                    </h1>
                    <p className="text-white text-lg md:text-xl max-w-2xl mx-auto px-4">
                        Comprehensive construction solutions tailored to your needs
                    </p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="max-w-7xl mx-auto px-6 py-16">
                <div className="mb-12 text-center">
                    <span className="text-red-400 font-bold uppercase tracking-[0.2em] text-sm border-l-4 border-red-400 pl-3">
                        What We Offer
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold mt-4 text-gray-900 tracking-tight">
                        Our Services
                    </h2>
                    <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                        Click on any service to see more details and photos
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 cursor-pointer group"
                            onClick={() => setSelectedService(service)}
                        >
                            <div className="h-64 overflow-hidden relative">
                                <img
                                    src={service.image}
                                    alt={service.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                                    <button className="bg-red-500 text-white px-6 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105">
                                        Read More
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                                    {service.name}
                                </h3>
                                <p className="text-gray-600 text-center text-sm">
                                    {service.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Detail Modal */}
            {selectedService && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 overflow-y-auto"
                    onClick={() => setSelectedService(null)}
                >
                    <div
                        className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">{selectedService.name}</h2>
                            <button
                                onClick={() => setSelectedService(null)}
                                className="text-gray-500 hover:text-gray-700 transition"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">Description</h3>
                                <p className="text-gray-700 leading-relaxed">
                                    {selectedService.detailedDescription}
                                </p>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Project Gallery</h3>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {selectedService.detailedImages.map((img, idx) => (
                                        <div key={idx} className="relative group overflow-hidden rounded-lg shadow-md">
                                            <img
                                                src={img}
                                                alt={`${selectedService.name} ${idx + 1}`}
                                                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">Key Features</h3>
                                <ul className="grid md:grid-cols-2 gap-3">
                                    {['Professional Team', 'Quality Guaranteed', 'On-Time Delivery', 'Best Value'].map((feature) => (
                                        <li key={feature} className="flex items-center text-gray-700">
                                            <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-6 text-center">
                                <h4 className="text-lg font-semibold text-gray-900 mb-3">Ready to get started?</h4>
                                <a
                                    href="/contact"
                                    className="inline-block bg-red-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-600 transition transform hover:scale-105"
                                >
                                    Request a Quote
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Services;