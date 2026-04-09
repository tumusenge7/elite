import React from 'react';
import {
    LayoutDashboard,
    Briefcase,
    Wrench,
    MessageSquare,
    Star,
    Youtube,
    Settings,
    LogOut,
    Menu,
    X as LucideX
} from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'projects', label: 'Projects', icon: <Briefcase size={20} /> },
    { id: 'services', label: 'Services', icon: <Wrench size={20} /> },
    { id: 'messages', label: 'Inbox', icon: <MessageSquare size={20} /> },
    { id: 'testimonials', label: 'Feedback', icon: <Star size={20} /> },
    // { id: 'content', label: 'YouTube/SEO', icon: <Youtube size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
];

const DashboardNav = ({ activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen, onLogout }) => {
    return (
        <>
            {/* Sidebar for Desktop */}
            <aside className="hidden lg:flex flex-col w-64 bg-slate-900 border-r border-slate-800 h-screen sticky top-0">
                <div className="p-8">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-black text-white italic">E</div>
                        <h2 className="text-xl font-black text-white tracking-tighter uppercase">Elite Admin</h2>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${activeTab === item.id
                                ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                        >
                            <span className={`${activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-red-500'} transition-colors`}>
                                {item.icon}
                            </span>
                            <span className="font-bold text-sm tracking-wide">{item.label}</span>
                            {activeTab === item.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="ml-auto w-1.5 h-1.5 bg-white rounded-full"
                                />
                            )}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-red-500 transition-colors font-bold text-sm"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Mobile Nav Header */}
            <div className="lg:hidden bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-[60] flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center font-black text-white text-xs italic">E</div>
                    <h2 className="text-lg font-black text-white tracking-tighter uppercase">Elite</h2>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg"
                >
                    {isMobileMenuOpen ? <LucideX size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: isMobileMenuOpen ? 0 : '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="lg:hidden fixed inset-y-0 left-0 w-72 bg-slate-900 z-50 shadow-2xl overflow-y-auto pt-20 px-4"
            >
                <nav className="space-y-2">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl transition-all ${activeTab === item.id
                                ? 'bg-red-600 text-white'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                        >
                            {item.icon}
                            <span className="font-bold">{item.label}</span>
                        </button>
                    ))}
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-5 text-red-500 font-black border-t border-slate-800 mt-4"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>
                </nav>
            </motion.div>
        </>
    );
};

export default DashboardNav;
