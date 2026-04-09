// src/components/ServicesDropdown.jsx
import React, { useState, useRef, useEffect } from "react";

function ServicesDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const services = [
        { name: "Residential Construction", description: "Modern, quality home building solutions", icon: "🏠" },
        { name: "Commercial Buildings", description: "Office spaces and commercial complexes", icon: "🏢" },
        { name: "Renovation & Remodeling", description: "Transform existing spaces", icon: "🔨" },
        { name: "Interior Design", description: "Beautiful and functional interiors", icon: "🎨" },
        { name: "Project Management", description: "End-to-end project oversight", icon: "📋" },
        { name: "Consultation", description: "Expert construction advice", icon: "💡" },
    ];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="px-6 py-3 bg-infinite-red text-white font-semibold rounded-md hover:bg-infinite-dark transition"
            >
                Services ▼
            </button>

            {isOpen && (
                <div className="absolute mt-2 w-80 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="flex items-start p-4 hover:bg-gray-50 cursor-pointer transition"
                        >
                            <span className="text-2xl mr-3">{service.icon}</span>
                            <div>
                                <h3 className="font-semibold text-gray-800">{service.name}</h3>
                                <p className="text-gray-500 text-sm">{service.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ServicesDropdown;