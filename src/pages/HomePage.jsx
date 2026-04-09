import React from 'react';

// Import all sections
import HeroSection from '../sections/HeroSection';
import AboutSection from '../sections/AboutSection';
import ServicesSection from '../sections/ServicesSection';
import ProjectsSection from '../sections/ProjectsSection';
import VideoHighlightsSection from '../sections/VideoHighlightsSection';
import TestimonialsSection from '../sections/TestimonialsSection';
import ContactSection from '../sections/ContactSection';
import ChatWidget from '../components/ChatWidget';

const HomePage = () => {
    return (
        <div className="overflow-hidden">
            <ChatWidget />
            {/* Each section flows into the next — no clicking needed */}
            <section id="home">
                <HeroSection />
            </section>

            <section id="about">
                <AboutSection />
            </section>

            <section id="services">
                <ServicesSection />
            </section>

            <section id="projects">
                <ProjectsSection />
            </section>

            <section id="highlights">
                <VideoHighlightsSection />
            </section>

            <section id="testimonials">
                <TestimonialsSection />
            </section>

            <section id="contact">
                <ContactSection />
            </section>
        </div>
    );
};

export default HomePage;
