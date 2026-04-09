import React from 'react';

import project1 from "../assets/1.jpg";
import project2 from "../assets/2.jpg";
import project3 from "../assets/3.jpg";

const Projects = () => {
    const projectData = [
        { id: 1, title: 'In-Progress Site', image: project1, category: 'Construction' },
        { id: 2, title: 'Modern Apartments', image: project2, category: 'Residential' },
        { id: 3, title: 'Artright Investments', image: project3, category: 'Commercial' },
        { id: 4, title: 'Elite Plaza', image: 'https://images.unsplash.com/photo-1554232456-8727aae91df4?q=80&w=800', category: 'Commercial' },
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
                <h1 className="text-white text-4xl md:text-6xl font-bold tracking-tight uppercase">
                    Our Projects
                </h1>
            </section>

            {/* Content */}
            <section className="max-w-7xl mx-auto px-6 py-16">
                <div className="mb-12">
                    <span className="text-red-400 font-bold uppercase tracking-[0.2em] text-sm border-l-4 border-red-400 pl-3">
                        Our Projects
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold mt-4 text-gray-900 tracking-tight">
                        Our Latest Works
                    </h2>
                </div>

                {/* Image Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 shadow-2xl">
                    {projectData.map((project) => (
                        <div key={project.id} className="relative overflow-hidden group h-80 cursor-pointer">
                            <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found';
                                }}
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                <p className="text-red-300 text-xs font-bold uppercase mb-1">{project.category}</p>
                                <h3 className="text-white text-xl font-bold">{project.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Projects;
