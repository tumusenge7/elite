import React, { useState, useEffect } from 'react';


// Import your actual project images here if they are in your assets folder
import project1 from "../assets/1.jpg";
import project2 from "../assets/2.jpg";
import project3 from "../assets/3.jpg";

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://elite-backend-8hcx.onrender.com';

const ProjectsPage = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fallback static data in case API fails
    const staticProjectData = [
        { id: 1, title: 'In-Progress Site', image: project1, category: 'Construction', location: 'Downtown', year: 2024 },
        { id: 2, title: 'Modern Apartments', image: project2, category: 'Residential', location: 'Suburb Area', year: 2024 },
        { id: 3, title: 'Artright Investments', image: project3, category: 'Commercial', location: 'Business District', year: 2023 },
        { id: 4, title: 'Elite Plaza', image: 'https://images.unsplash.com/photo-1554232456-8727aae91df4?q=80&w=800', category: 'Commercial', location: 'City Center', year: 2024 },
    ];

    // Fetch projects from API
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_BASE_URL}/api/projects`);

                if (response.data && Array.isArray(response.data)) {
                    // Map API data to match component structure
                    const mappedProjects = response.data.map(project => ({
                        id: project.id,
                        title: project.title,
                        image: getImageUrl(project.image),
                        category: project.category,
                        location: project.location,
                        year: project.year,
                        description: project.description
                    }));
                    setProjects(mappedProjects);
                } else {
                    // Use static data as fallback
                    setProjects(staticProjectData);
                }
            } catch (err) {
                console.error('Error fetching projects:', err);
                setError('Failed to load projects. Showing demo content.');
                setProjects(staticProjectData);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    // Helper function to get proper image URL
    const getImageUrl = (imagePath) => {
        if (!imagePath) return 'https://via.placeholder.com/800x600?text=No+Image';
        if (imagePath.startsWith('http')) return imagePath;
        if (imagePath.startsWith('data:image')) return imagePath;
        if (imagePath.startsWith('/uploads')) return `${API_BASE_URL}${imagePath}`;
        return imagePath;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading projects...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* --- HERO SECTION --- */}
            <section
                className="relative h-[300px] md:h-[400px] flex items-center justify-center bg-fixed bg-center bg-cover"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=1200')`
                }}
            >
                <div className="text-center">
                    <h1 className="text-white text-4xl md:text-6xl font-bold tracking-tight uppercase mb-4">
                        Our Projects
                    </h1>
                    <p className="text-gray-300 text-lg max-w-2xl mx-auto px-4">
                        Showcasing our finest construction and development work
                    </p>
                </div>
            </section>

            {/* --- CONTENT HEADER --- */}
            <section className="max-w-7xl mx-auto px-6 py-16">
                <div className="mb-12">
                    <span className="text-red-600 font-bold uppercase tracking-[0.2em] text-sm border-l-4 border-red-600 pl-3">
                        Our Portfolio
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold mt-4 text-gray-900 tracking-tight">
                        Latest Projects
                    </h2>
                    <p className="text-gray-600 mt-4 max-w-2xl">
                        Explore our recent construction projects that showcase our expertise and commitment to excellence.
                    </p>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700">
                        <p>{error}</p>
                    </div>
                )}

                {/* --- IMAGE GRID --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 shadow-2xl">
                    {projects.map((project) => (
                        <div key={project.id} className="relative overflow-hidden group h-80 cursor-pointer">
                            <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                <p className="text-red-400 text-xs font-bold uppercase mb-1 tracking-wider">
                                    {project.category}
                                </p>
                                <h3 className="text-white text-xl font-bold mb-1">{project.title}</h3>
                                {project.location && (
                                    <p className="text-gray-300 text-sm">{project.location}</p>
                                )}
                                {project.year && (
                                    <p className="text-gray-400 text-xs mt-2">{project.year}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Optional: View More Button */}
                <div className="text-center mt-12">
                    <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105">
                        View All Projects
                    </button>
                </div>
            </section>
        </div>
    );
};

export default ProjectsPage;