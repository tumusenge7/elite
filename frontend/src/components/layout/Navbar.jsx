import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaSun, FaMoon, FaBars, FaTimes } from 'react-icons/fa';
import logo from '../../logo.svg';

const Header = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    const navItems = [
        { name: 'Home', id: 'home' },
        { name: 'About', id: 'about' },
        { name: 'Services', id: 'services' },
        { name: 'Projects', id: 'projects' },
        { name: 'Contact', id: 'contact' },
    ];

    // Track which section is visible while scrolling
    useEffect(() => {
        if (location.pathname !== '/') return;

        const handleScroll = () => {
            setScrolled(window.scrollY > 50);

            const sections = navItems.map(item => document.getElementById(item.id));
            const scrollPos = window.scrollY + 100;

            for (let i = sections.length - 1; i >= 0; i--) {
                if (sections[i] && sections[i].offsetTop <= scrollPos) {
                    setActiveSection(navItems[i].id);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);

    // Dark mode
    useEffect(() => {
        if (localStorage.theme === 'dark' ||
            (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setDarkMode(true);
        }
    }, []);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
        }
    }, [darkMode]);

    // Smooth scroll to section
    const scrollToSection = (id) => {
        if (location.pathname !== '/') {
            // If on admin page, navigate home first
            window.location.href = `/#${id}`;
            return;
        }
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setMobileMenuOpen(false);
    };

    const isOnHomePage = location.pathname === '/';

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
            scrolled 
                ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg' 
                : 'bg-transparent'
        }`}>
            <div className="container-wide">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        <img src={logo} alt="Elite Construction Logo" className="h-12 w-auto" />
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                    isOnHomePage && activeSection === item.id
                                        ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                                        : scrolled
                                            ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                            : 'text-white/80 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                {item.name}
                            </button>
                        ))}

                        {/* Admin Link */}
                        <Link
                            to="/admin"
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ml-2 border ${
                                scrolled
                                    ? 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white'
                                    : 'border-white/50 text-white/80 hover:bg-white/10'
                            }`}
                        >
                            Admin
                        </Link>

                        {/* Dark Mode Toggle */}
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`p-2 ml-2 rounded-full transition-all duration-300 ${
                                scrolled
                                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                            }`}
                        >
                            {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
                        </button>
                    </div>

                    {/* Mobile Menu Buttons */}
                    <div className="md:hidden flex items-center space-x-3">
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`p-2 rounded-full ${scrolled ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300' : 'bg-white/10 text-white'}`}
                        >
                            {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
                        </button>
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className={`p-2 rounded-full ${scrolled ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300' : 'bg-white/10 text-white'}`}
                        >
                            {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <div className={`md:hidden transition-all duration-500 overflow-hidden ${
                mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
                <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 px-4 py-3 space-y-1">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className={`block w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                                isOnHomePage && activeSection === item.id
                                    ? 'bg-red-500 text-white'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                        >
                            {item.name}
                        </button>
                    ))}
                    <Link
                        to="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block w-full text-left px-4 py-3 rounded-lg text-base font-medium text-red-500 border border-red-500 hover:bg-red-500 hover:text-white transition-all"
                    >
                        Admin Panel
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Header;
