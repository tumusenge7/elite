import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Bell,
    RefreshCw,
    CheckCircle2,
    Activity,
    MessageSquare,
    Star,
    Wrench,
    X as LucideX
} from 'lucide-react';

// Components
import DashboardNav from './components/DashboardNav';
import DashboardStats from './components/DashboardStats';
import CRUDModal from './components/CRUDModal';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Configure axios interceptor for token handling
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('adminAuthenticated');
            localStorage.removeItem('adminToken');
            window.location.href = '/admin/login';
        }
        return Promise.reject(error);
    }
);

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [statusMessage, setStatusMessage] = useState(null);
    const statusTimeoutRef = useRef(null);

    // Modal Control
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [modalType, setModalType] = useState('Project');

    // Data states
    const [projects, setProjects] = useState([]);
    const [messages, setMessages] = useState([]);
    const [services, setServices] = useState([]);
    const [sysStats, setSysStats] = useState({
        projects: 0,
        messages: 0,
        services: 0,
        status: 'online'
    });

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (statusTimeoutRef.current) {
                clearTimeout(statusTimeoutRef.current);
            }
        };
    }, []);

    // Authentication check
    useEffect(() => {
        const isAuthenticated = localStorage.getItem('adminAuthenticated');
        const token = localStorage.getItem('adminToken');

        if (!isAuthenticated || !token) {
            navigate('/admin/login');
            return;
        }
        fetchAllData();
    }, [navigate]);

    const showStatus = useCallback((text, type = 'success') => {
        if (statusTimeoutRef.current) {
            clearTimeout(statusTimeoutRef.current);
        }
        setStatusMessage({ text, type });
        statusTimeoutRef.current = setTimeout(() => setStatusMessage(null), 4000);
    }, []);

    // FIXED: Added proper type checking for path parameter
    const getImageUrl = useCallback((path) => {
        // Check if path is valid
        if (!path || typeof path !== 'string') {
            return '/placeholder-image.jpg';
        }

        if (path.startsWith('http')) return path;
        if (path.startsWith('data:image')) return path;

        // Remove duplicate slashes and ensure proper formatting
        const cleanPath = path.startsWith('/') ? path : `/${path}`;
        return `${API_BASE_URL}${cleanPath}`;
    }, []);

    const handleLogout = useCallback(() => {
        if (statusTimeoutRef.current) {
            clearTimeout(statusTimeoutRef.current);
        }
        localStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    }, [navigate]);

    const getAuthConfig = useCallback(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            throw new Error('No authentication token found');
        }
        return {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };
    }, []);

    const fetchAllData = useCallback(async () => {
        setIsLoading(true);

        try {
            // Fetch projects
            const projRes = await axios.get(`${API_BASE_URL}/api/projects`);

            // Fetch services
            const servRes = await axios.get(`${API_BASE_URL}/api/services`);

            // Fetch messages (requires auth)
            let msgRes = { data: [] };
            try {
                const config = getAuthConfig();
                msgRes = await axios.get(`${API_BASE_URL}/api/messages`, config);
            } catch (error) {
                console.error('Failed to fetch messages:', error);
            }

            setProjects(Array.isArray(projRes.data) ? projRes.data : []);
            setServices(Array.isArray(servRes.data) ? servRes.data : []);
            setMessages(Array.isArray(msgRes.data) ? msgRes.data : []);

            setSysStats({
                projects: Array.isArray(projRes.data) ? projRes.data.length : 0,
                services: Array.isArray(servRes.data) ? servRes.data.length : 0,
                messages: Array.isArray(msgRes.data) ? msgRes.data.length : 0,
                status: 'online'
            });

        } catch (error) {
            console.error('Data sync failed:', error);
            if (error.response?.status === 401) {
                handleLogout();
                return;
            }
            setSysStats(prev => ({ ...prev, status: 'error' }));
            showStatus('Backend Sync Failed', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [showStatus, getAuthConfig, handleLogout]);

    const handleSave = useCallback(async (formData, id) => {
        try {
            const config = getAuthConfig();

            if (modalType === 'Project') {
                const projectData = {
                    title: formData.title,
                    category: formData.category,
                    location: formData.location || '',
                    image: formData.image || '',
                    description: formData.description || '',
                    year: parseInt(formData.year) || new Date().getFullYear()
                };

                if (id) {
                    await axios.put(`${API_BASE_URL}/api/projects/${id}`, projectData, config);
                    showStatus('Project Updated Successfully');
                } else {
                    await axios.post(`${API_BASE_URL}/api/projects`, projectData, config);
                    showStatus('Project Added Successfully');
                }
            } else if (modalType === 'Service') {
                if (id) {
                    await axios.put(`${API_BASE_URL}/api/services/${id}`, formData, config);
                    showStatus('Service Updated Successfully');
                } else {
                    await axios.post(`${API_BASE_URL}/api/services`, formData, config);
                    showStatus('Service Added Successfully');
                }
            }

            await fetchAllData();
            setIsModalOpen(false);
            setCurrentItem(null);

        } catch (error) {
            console.error('Save error:', error);
            const errorMsg = error.response?.data?.error || 'Save Failed';
            showStatus(errorMsg, 'error');
        }
    }, [modalType, showStatus, fetchAllData, getAuthConfig]);

    const handleDelete = useCallback(async (type, id) => {
        if (!window.confirm(`⚠️ Permanently delete this ${type}?`)) return;

        try {
            const config = getAuthConfig();

            if (type === 'Project') {
                await axios.delete(`${API_BASE_URL}/api/projects/${id}`, config);
                showStatus('Project Deleted Successfully');
            } else if (type === 'Service') {
                await axios.delete(`${API_BASE_URL}/api/services/${id}`, config);
                showStatus('Service Deleted Successfully');
            } else if (type === 'Inbox') {
                await axios.delete(`${API_BASE_URL}/api/messages/${id}`, config);
                showStatus('Message Archived Successfully');
            }

            await fetchAllData();

        } catch (error) {
            console.error('Delete error:', error);
            showStatus('Delete Failed', 'error');
        }
    }, [showStatus, fetchAllData, getAuthConfig]);

    const openModal = useCallback((type, item = null) => {
        setModalType(type);
        setCurrentItem(item);
        setIsModalOpen(true);
    }, []);

    const StatusRow = useCallback(({ label, value, status }) => (
        <div className="flex justify-between items-center p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 transition-all hover:bg-white hover:shadow-md group">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">{label}</span>
            <span className={`flex items-center gap-2 font-black italic uppercase text-[10px] tracking-widest ${status === 'online' ? 'text-green-500' : 'text-red-500'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${status === 'online' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'} animate-pulse`}></div>
                {value}
            </span>
        </div>
    ), []);

    const renderTabContent = useCallback(() => {
        if (isLoading) return (
            <div className="flex flex-col items-center justify-center h-96 gap-4">
                <div className="w-12 h-12 border-4 border-red-600/30 border-t-red-600 rounded-full animate-spin"></div>
                <p className="text-slate-500 font-black animate-pulse uppercase tracking-widest text-xs">Syncing Elite Systems...</p>
            </div>
        );

        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-12">
                        <DashboardStats stats={sysStats} />

                        <div className="grid lg:grid-cols-2 gap-8">
                            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <Activity className="text-red-500" size={24} />
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">System Health</h3>
                                </div>
                                <div className="space-y-4">
                                    <StatusRow label="Database Sync" value={sysStats.status === 'online' ? 'Stable' : 'Error'} status={sysStats.status} />
                                    <StatusRow label="API Node" value="Online" status="online" />
                                    <StatusRow label="Frontend Load" value="Optimal" status="online" />
                                </div>
                            </div>

                            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <Bell className="text-amber-500" size={24} />
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Real-time Feed</h3>
                                </div>
                                <div className="space-y-6">
                                    {messages.slice(0, 3).map((m, i) => (
                                        <div key={m.id || i} className="flex gap-4 items-start pb-4 border-b border-slate-50 last:border-0">
                                            <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center shrink-0">
                                                <div className="w-2 h-2 bg-red-600 rounded-full animate-ping"></div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">{m.name}</p>
                                                <p className="text-xs text-slate-500 font-medium italic">Message received concerning {m.subject || 'Inquiry'}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {messages.length === 0 && <p className="text-slate-400 font-medium italic text-sm">No new entries</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'projects':
                return (
                    <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex flex-wrap justify-between items-center gap-4">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Portfolio Manager</h2>
                                <p className="text-sm font-medium text-slate-500">Manage {projects.length} construction cases</p>
                            </div>
                            <button
                                onClick={() => openModal('Project')}
                                className="bg-red-600 hover:bg-black text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-xl shadow-red-600/20 active:scale-95"
                            >
                                <Plus size={20} />
                                New Case
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Showcase</th>
                                        <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Category</th>
                                        <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Location</th>
                                        <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Year</th>
                                        <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {projects.map((project) => (
                                        <tr key={project.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-12 rounded-xl bg-slate-100 overflow-hidden shrink-0 shadow-sm ring-2 ring-white">
                                                        <img
                                                            src={getImageUrl(project.image)}
                                                            alt={project.title || 'Project'}
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = '/placeholder-image.jpg';
                                                            }}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-900 uppercase italic tracking-tight">{project.title}</p>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{project.year || '2024'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                                    {project.category}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{project.location || 'N/A'}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{project.year || '2024'}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex gap-4">
                                                    <button onClick={() => openModal('Project', project)} className="text-[10px] font-black text-slate-900 uppercase hover:text-red-500 transition-colors">Edit</button>
                                                    <button onClick={() => handleDelete('Project', project.id)} className="text-[10px] font-black text-slate-400 uppercase hover:text-red-600 transition-colors">Remove</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {projects.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-8 py-12 text-center text-slate-400">
                                                No projects found. Click "New Case" to add your first project.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                );

            case 'services':
                return (
                    <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex flex-wrap justify-between items-center gap-4">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Core Services</h2>
                                <p className="text-sm font-medium text-slate-500">Service hierarchy management</p>
                            </div>
                            <button
                                onClick={() => openModal('Service')}
                                className="bg-slate-900 hover:bg-red-600 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95"
                            >
                                <Plus size={20} />
                                New Service
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Service Identity</th>
                                        <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">State</th>
                                        <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {services.map((service) => (
                                        <tr key={service.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-red-500 flex items-center justify-center font-black">
                                                        <Wrench size={24} />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-900 uppercase italic tracking-tight">{service.name}</p>
                                                        <p className="text-[10px] font-medium text-slate-400 truncate max-w-xs">{service.description}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="flex items-center gap-2 text-[10px] font-black text-green-600 uppercase italic tracking-widest">
                                                    <div className="w-1.5 h-1.5 bg-green-600 rounded-full scale-125"></div>
                                                    Live
                                                </span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex gap-4">
                                                    <button onClick={() => openModal('Service', service)} className="text-[10px] font-black text-slate-900 uppercase hover:text-red-500">Edit</button>
                                                    <button onClick={() => handleDelete('Service', service.id)} className="text-[10px] font-black text-slate-400 uppercase hover:text-red-500">Delete</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                );

            case 'messages':
                return (
                    <section className="space-y-6">
                        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-50 via-white to-white">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Inbox</h2>
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">{messages.length} Active Conversations</p>
                            </div>
                            <div className="w-16 h-16 bg-red-600 text-white rounded-3xl flex items-center justify-center shadow-xl shadow-red-600/20">
                                <MessageSquare size={32} />
                            </div>
                        </div>

                        <div className="grid gap-8">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden"
                                >
                                    <div className="flex flex-wrap justify-between gap-8 mb-8">
                                        <div className="flex gap-6">
                                            <div className="w-20 h-20 bg-slate-900 rounded-[1.5rem] flex items-center justify-center text-white font-black text-4xl italic uppercase">
                                                {msg.name?.charAt(0) || '?'}
                                            </div>
                                            <div>
                                                <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{msg.name}</h4>
                                                <p className="text-sm font-bold text-slate-400">{msg.email}</p>
                                                <div className="mt-2 flex gap-2">
                                                    <span className="px-3 py-1 bg-red-600 text-white rounded-full text-[10px] font-black uppercase italic tracking-widest">{msg.subject || 'Elite Inq'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDelete('Inbox', msg.id)}
                                            className="h-12 px-8 bg-slate-900 hover:bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                                        >
                                            Archive Message
                                        </button>
                                    </div>
                                    <div className="bg-slate-50/50 p-8 rounded-[2rem] border border-slate-100 font-bold text-slate-600 italic leading-relaxed text-lg">
                                        "{msg.message}"
                                    </div>
                                </motion.div>
                            ))}
                            {messages.length === 0 && (
                                <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-slate-100">
                                    <MessageSquare size={48} className="mx-auto text-slate-200 mb-6" />
                                    <p className="text-slate-500 font-bold">No messages found</p>
                                </div>
                            )}
                        </div>
                    </section>
                );

            case 'testimonials':
                return (
                    <section className="bg-white p-20 rounded-[3rem] border-2 border-dashed border-slate-100 text-center relative overflow-hidden max-w-4xl mx-auto mt-12">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full blur-[100px] -mr-32 -mt-32 opacity-50"></div>
                        <Star className="mx-auto text-amber-500 mb-8 drop-shadow-lg" size={80} fill="currentColor" />
                        <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Feedback Engine</h2>
                        <p className="text-slate-500 font-bold text-sm uppercase tracking-[0.3em] mt-4 mb-10 max-w-lg mx-auto">
                            The reputation management module is currently being calibrated for high-volume production.
                        </p>
                        <button className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-transform shadow-2xl">
                            Unlock Module
                        </button>
                    </section>
                );

            case 'content':
                return (
                    <section className="bg-white p-12 rounded-[3rem] border border-slate-50 shadow-sm max-w-5xl mx-auto">
                        <div className="flex items-center gap-4 mb-12">
                            <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white">
                                <Activity size={24} />
                            </div>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Showcase Hub</h2>
                        </div>
                        <div className="grid lg:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] ml-1">Elite Highlight ID</label>
                                    <input
                                        type="text"
                                        className="w-full px-8 py-5 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:border-red-600 outline-none font-black text-slate-900 italic"
                                        placeholder="Enter YouTube ID"
                                    />
                                </div>
                                <button className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black uppercase text-xs tracking-widest hover:bg-red-600 transition-all shadow-xl shadow-slate-900/10">
                                    Update Global Stream
                                </button>
                            </div>
                            <div className="bg-slate-900 rounded-[2.5rem] aspect-video flex items-center justify-center shadow-2xl overflow-hidden group">
                                <div className="text-slate-700 font-black italic tracking-widest text-4xl opacity-20 rotate-[-15deg] group-hover:rotate-0 transition-transform duration-700 uppercase">Live Review</div>
                            </div>
                        </div>
                    </section>
                );

            default:
                return (
                    <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-slate-100">
                        <Activity size={48} className="mx-auto text-slate-200 mb-6" />
                        <h2 className="text-2xl font-black text-slate-900 uppercase italic">Void Space</h2>
                    </div>
                );
        }
    }, [activeTab, isLoading, projects, services, messages, sysStats, openModal, handleDelete, getImageUrl, StatusRow]);

    return (
        <div className="min-h-screen bg-[#fafafa] flex font-['Outfit',sans-serif]">
            <DashboardNav
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isMobileMenuOpen={isMobileMenuOpen}
                setIsMobileMenuOpen={setIsMobileMenuOpen}
                onLogout={handleLogout}
            />

            <main className="flex-1 min-w-0 h-screen overflow-y-auto">
                <header className="sticky top-0 bg-white/70 backdrop-blur-2xl border-b border-slate-50 z-40 px-10 py-6">
                    <div className="flex justify-between items-center max-w-[1600px] mx-auto">
                        <div className="flex items-center gap-6">
                            <div className="h-4 w-4 rounded-full bg-red-600 animate-pulse"></div>
                            <span className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic drop-shadow-sm flex items-center gap-2">
                                {activeTab}
                            </span>
                        </div>

                        <div className="flex items-center gap-8">
                            <AnimatePresence>
                                {statusMessage && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0 }}
                                        className={`px-6 py-3 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest italic flex items-center gap-3 shadow-lg ${statusMessage.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-white text-green-600 border-green-50'}`}
                                    >
                                        {statusMessage.type === 'error' ? <LucideX size={14} /> : <CheckCircle2 size={14} />}
                                        {statusMessage.text}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button
                                onClick={fetchAllData}
                                className="p-4 text-slate-400 hover:text-red-500 bg-white border border-slate-100 rounded-2xl transition-all shadow-sm hover:shadow-xl active:rotate-180 duration-700"
                                disabled={isLoading}
                            >
                                <RefreshCw size={22} className={isLoading ? 'animate-spin text-red-600' : ''} />
                            </button>

                            <div className="h-14 w-14 rounded-[1.5rem] bg-slate-900 border-4 border-white shadow-2xl flex items-center justify-center font-black text-white italic text-xl ring-2 ring-slate-50">
                                AD
                            </div>
                        </div>
                    </div>
                </header>

                <div className="p-10 xl:p-16 max-w-[1600px] mx-auto">
                    <motion.div key={activeTab} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                        {renderTabContent()}
                    </motion.div>
                </div>

                <footer className="mt-20 p-12 text-center text-slate-300 font-black text-[9px] uppercase tracking-[0.5em] border-t border-slate-50">
                    &copy; 2026 ELITE CONSTRUCTION
                </footer>
            </main>

            <CRUDModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setCurrentItem(null);
                }}
                onSave={handleSave}
                item={currentItem}
                type={modalType}
            />
        </div>
    );
};

export default AdminDashboard;