import React, { useState, useRef } from 'react';
import { useInView } from '../hooks/useInView';

// Video import removed - using YouTube embeds instead

const VideoHighlightsSection = () => {
    const [headerRef, headerVisible] = useInView({ threshold: 0.2 });
    const [gridRef, gridVisible] = useInView({ threshold: 0.1 });
    const [activeVideo, setActiveVideo] = useState(null);

    const videos = [
        {
            id: 1,
            title: 'Site Progress Update',
            description: 'Watch the latest construction progress on our flagship project in Kigali.',
            thumbnail: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800',
            src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            type: 'youtube',
            date: 'April 2026',
            tag: 'Progress Update'
        },
        {
            id: 2,
            title: 'Modern Villa Completion',
            description: 'Tour our recently completed luxury villa in Nyarutarama.',
            thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800',
            src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            type: 'youtube',
            date: 'March 2026',
            tag: 'Completed'
        },
        {
            id: 3,
            title: 'Team at Work',
            description: 'Behind the scenes with our skilled construction team.',
            thumbnail: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800',
            src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            type: 'youtube',
            date: 'February 2026',
            tag: 'Behind the Scenes'
        }
    ];

    return (
        <div className="bg-gradient-to-b from-gray-900 via-gray-900 to-black py-24">
            {/* Header */}
            <div
                ref={headerRef}
                className={`container-wide mb-16 transition-all duration-1000 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-red-400 font-bold uppercase tracking-[0.2em] text-sm">Video Updates</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                            Project <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">Highlights</span>
                        </h2>
                        <p className="text-gray-400 mt-4 max-w-xl">
                            Watch our latest progress updates, completed projects, and behind-the-scenes footage.
                        </p>
                    </div>

                    {/* Video count badge */}
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2">
                        <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12.553 1.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                        </svg>
                        <span className="text-white font-semibold">{videos.length} Videos</span>
                    </div>
                </div>
            </div>

            {/* Video Grid */}
            <div
                ref={gridRef}
                className={`container-wide transition-all duration-1000 ${gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
                {/* Featured Video (first one, large) */}
                <div className="mb-8">
                    <VideoCard
                        video={videos[0]}
                        isFeatured={true}
                        onPlay={() => setActiveVideo(videos[0])}
                    />
                </div>

                {/* Other Videos Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                    {videos.slice(1).map((video) => (
                        <VideoCard
                            key={video.id}
                            video={video}
                            isFeatured={false}
                            onPlay={() => setActiveVideo(video)}
                        />
                    ))}
                </div>
            </div>

            {/* Video Player Modal */}
            {activeVideo && (
                <div
                    className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                    onClick={() => setActiveVideo(null)}
                >
                    <div
                        className="relative w-full max-w-5xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setActiveVideo(null)}
                            className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors flex items-center gap-2"
                        >
                            <span className="text-sm">Close</span>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Video Info */}
                        <div className="mb-4">
                            <span className="text-red-400 text-sm font-bold uppercase">{activeVideo.tag}</span>
                            <h3 className="text-2xl font-bold text-white mt-1">{activeVideo.title}</h3>
                        </div>

                        {/* Video Player */}
                        <div className="rounded-2xl overflow-hidden shadow-2xl bg-black aspect-video">
                            <iframe
                                src={`${activeVideo.src}?autoplay=1`}
                                title={activeVideo.title}
                                className="w-full h-full"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>

                        {/* Description */}
                        <p className="text-gray-400 mt-4">{activeVideo.description}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

// ─── Video Card Component ───────────────────────────────
const VideoCard = ({ video, isFeatured, onPlay }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <div
            className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/10 ${isFeatured ? 'h-[400px] md:h-[500px]' : 'h-[300px]'
                }`}
            onClick={onPlay}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Thumbnail */}
            <div className="absolute inset-0">
                <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
            </div>

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className={`bg-red-500/90 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:bg-red-500 shadow-2xl ${isFeatured ? 'w-20 h-20' : 'w-16 h-16'
                    }`}>
                    <svg className={`text-white ml-1 ${isFeatured ? 'w-8 h-8' : 'w-6 h-6'}`} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                </div>
            </div>

            {/* Tag */}
            <div className="absolute top-4 left-4">
                <span className="bg-red-500 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    {video.tag}
                </span>
            </div>

            {/* Date */}
            <div className="absolute top-4 right-4">
                <span className="bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">
                    {video.date}
                </span>
            </div>

            {/* Info at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className={`text-white font-bold mb-2 ${isFeatured ? 'text-2xl' : 'text-xl'}`}>
                    {video.title}
                </h3>
                <p className="text-gray-300 text-sm line-clamp-2">{video.description}</p>

                {/* Watch Now link */}
                <div className="flex items-center gap-2 mt-3 text-red-400 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0 -translate-x-4">
                    <span>Watch Now</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default VideoHighlightsSection;