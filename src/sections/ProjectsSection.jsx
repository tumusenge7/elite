import React, { useState, useEffect } from 'react';
import API from '../services/api';  // Use the centralized API service

const ProjectsSection = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Helper function for image URLs
    const getImageUrl = (image) => {
        if (!image || typeof image !== 'string' || image.trim() === '') {
            return null;
        }

        if (image.startsWith('http://') || image.startsWith('https://')) {
            return image;
        }

        if (image.startsWith('data:image')) {
            return image;
        }

        // Use the backend URL for relative paths
        if (image.startsWith('/uploads')) {
            return `https://elite-backend-8hcx.onrender.com${image}`;
        }

        return image;
    };

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                console.log('Fetching projects from API...');

                // Use the API instance instead of axios directly
                const response = await API.get('/api/projects');

                console.log('API Response:', response.data);

                if (response.data && Array.isArray(response.data)) {
                    setProjects(response.data);
                    setError(null);
                } else {
                    setError('Invalid data format received');
                }
            } catch (err) {
                console.error('Error fetching projects:', err);
                setError(err.response?.data?.error || 'Failed to load projects');
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading projects...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 max-w-md mx-auto">
                    <p className="text-red-700">{error}</p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (projects.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 max-w-md mx-auto">
                    <p className="text-yellow-700">No projects found in database.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
                <div key={project.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
                    <div className="relative h-64 overflow-hidden bg-gray-100">
                        {getImageUrl(project.image) ? (
                            <img
                                src={getImageUrl(project.image)}
                                alt={project.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
                                }}
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                <div className="text-center p-4">
                                    <svg className="w-16 h-16 mx-auto text-gray-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-gray-500 text-sm">No Image</p>
                                </div>
                            </div>
                        )}
                        <div className="absolute top-4 right-4">
                            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                {project.category}
                            </span>
                        </div>
                    </div>
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                        {project.location && (
                            <p className="text-gray-600 mb-2 flex items-center gap-1 text-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {project.location}
                            </p>
                        )}
                        <p className="text-gray-500 text-sm mb-3">Year: {project.year}</p>
                        {project.description && (
                            <p className="text-gray-600 text-sm line-clamp-2">{project.description}</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProjectsSection;