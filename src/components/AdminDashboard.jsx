import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
    Users, Activity, Eye, Settings, BarChart3, LogOut,
    Clock, Server, CheckCircle, Search, Download,
    Edit, Trash2, Plus, Globe, MessageSquare, Image,
    AlertCircle, RefreshCcw, ChevronRight, Layout,
    Shield, Database, X, Save
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

const AdminDashboard = () => {
    // --- State Management ---
    const [activeTab, setActiveTab] = useState('monitor');
    const [services, setServices] = useState([]);
    const [projects, setProjects] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [health, setHealth] = useState({ backend: 'checking', database: 'checking' });
    const [editor, setEditor] = useState({ show: false, type: 'project', mode: 'add', data: null });

    // --- API Unified Caller ---
    const apiCall = useCallback(async (method, url, data = null, isMultipart = false) => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/admin';
            return;
        }

        const config = {
            method,
            url: `${API_BASE}${url}`,
            headers: {
                Authorization: `Bearer ${token}`,
                ...(isMultipart ? { 'Content-Type': 'multipart/form-data' } : {})
            },
            data
        };

        try {
            const response = await axios(config);
            return response.data;
        } catch (error) {
            if (error.response?.status === 401 || error.response?.status === 403) {
                localStorage.removeItem('token');
                window.location.href = '/admin';
            }
            throw error;
        }
    }, []);

    // --- Initial Load ---
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [sData, pData, mData] = await Promise.all([
                apiCall('get', '/services'),
                apiCall('get', '/projects'),
                apiCall('get', '/messages')
            ]);
            setServices(sData);
            setProjects(pData);
            setMessages(mData);
            setHealth({ backend: 'online', database: 'online' });
        } catch (err) {
            console.error('Initial load failed:', err);
            setHealth({ backend: 'offline', database: 'unreachable' });
        } finally {
            setLoading(false);
        }
    }, [apiCall]);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000); // Auto-refresh every 30s
        return () => clearInterval(interval);
    }, [fetchData]);

    // --- Actions ---
    const toggleEditor = (type = 'project', mode = 'add', data = null) => {
        setEditor({ show: true, type, mode, data });
    };

    const handleDelete = async (type, id) => {
        if (!window.confirm(`Permanently delete this ${type}? This action cannot be undone.`)) return;
        try {
            await apiCall('delete', `/${type}s/${id}`);
            fetchData();
        } catch (err) {
            alert('Security clearance failed. Operation aborted.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('adminAuthenticated');
        window.location.href = '/admin';
    };

    // --- Renderers ---
    return (
        <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-rose-500/30">
            {/* Nav Sidebar */}
            <aside className="fixed left-0 top-0 w-72 h-full bg-[#0f172a] border-r border-slate-800/50 flex flex-col z-30 shadow-2xl">
                <div className="p-8 border-b border-slate-800/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-tr from-rose-600 to-orange-500 rounded-xl shadow-lg shadow-rose-600/20">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-white tracking-tighter">ELITE v2.0</h1>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Admin Terminal</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 p-6 space-y-2 mt-4 overflow-y-auto">
                    <NavButton id="monitor" label="System Health" icon={Activity} active={activeTab} onClick={setActiveTab} />
                    <NavDivider label="Business Data" />
                    <NavButton id="portfolio" label="Projects" icon={Image} active={activeTab} onClick={setActiveTab} />
                    <NavButton id="services" label="Services" icon={Settings} active={activeTab} onClick={setActiveTab} />
                    <NavButton id="inquiries" label="Pipeline" icon={MessageSquare} active={activeTab} onClick={setActiveTab} 
                               badge={messages.filter(m => m.status === 'new').length} />
                    <NavDivider label="Infrastructure" />
                    <NavButton id="users" label="User Access" icon={Users} active={activeTab} onClick={setActiveTab} />
                </nav>

                <div className="p-6 border-t border-slate-800/50">
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-rose-500 hover:bg-rose-500/5 transition-all rounded-xl font-bold text-sm"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out Session
                    </button>
                </div>
            </aside>

            {/* Main Surface */}
            <main className="pl-72 flex-1 min-h-screen pb-24">
                <header className="sticky top-0 h-24 border-b border-slate-800/50 bg-[#020617]/80 backdrop-blur-xl z-20 px-10 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-white capitalize">{activeTab} Interface</h2>
                        <div className="flex items-center gap-4 mt-1">
                            <StatusBadge label="API" status={health.backend} />
                            <StatusBadge label="Database" status={health.database} />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={fetchData} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors group">
                            <RefreshCcw className={`w-4 h-4 text-slate-400 group-hover:text-white ${loading ? 'animate-spin' : ''}`} />
                        </button>
                        <div className="h-10 w-[1px] bg-slate-800 mx-2"></div>
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-white leading-none">Command Center</p>
                            <p className="text-[10px] text-slate-500 mt-1 font-mono uppercase">Authorized User: Root</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-700 flex items-center justify-center font-black text-slate-300 shadow-inner">R</div>
                    </div>
                </header>

                <div className="p-10 max-w-7xl mx-auto space-y-10">
                    {loading && <LoaderOverlay />}
                    
                    {activeTab === 'monitor' && <MonitorTab stats={{ visitors: 4231, sessions: 841, dbSize: '12.4 MB' }} messages={messages} />}
                    {activeTab === 'portfolio' && <GridTab type="project" items={projects} onAdd={() => toggleEditor('project')} onEdit={(item) => toggleEditor('project', 'edit', item)} onDelete={(id) => handleDelete('project', id)} />}
                    {activeTab === 'services' && <GridTab type="service" items={services} onAdd={() => toggleEditor('service')} onEdit={(item) => toggleEditor('service', 'edit', item)} onDelete={(id) => handleDelete('service', id)} />}
                    {activeTab === 'inquiries' && <PipelineTab messages={messages} />}
                    {activeTab === 'users' && <UsersTab onRefresh={fetchData} />}
                </div>
            </main>

            {/* The Unified Editor Modal */}
            {editor.show && (
                <EditorModal 
                    config={editor} 
                    onClose={() => setEditor({...editor, show: false})} 
                    onSave={() => { setEditor({...editor, show: false}); fetchData(); }}
                    apiCall={apiCall}
                />
            )}
        </div>
    );
};

// --- Child Components ---

const NavButton = ({ id, label, icon: Icon, active, onClick, badge }) => (
    <button 
        onClick={() => onClick(id)}
        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all group ${
            active === id 
                ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-lg shadow-rose-500/5' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
        }`}
    >
        <div className="flex items-center gap-3">
            <Icon className={`w-5 h-5 ${active === id ? 'text-rose-500' : 'text-slate-500 group-hover:text-slate-300'} transition-colors`} />
            <span className="font-bold text-sm tracking-wide">{label}</span>
        </div>
        {badge > 0 && (
            <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-lg font-black animate-pulse">{badge}</span>
        )}
    </button>
);

const NavDivider = ({ label }) => (
    <div className="pt-6 pb-2 px-4">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 italic underline decoration-rose-500/50 underline-offset-4">{label}</span>
    </div>
);

const StatusBadge = ({ label, status }) => {
    const isOnline = status === 'online' || status === 'active';
    const isChecking = status === 'checking';
    return (
        <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-slate-900/50 border border-slate-800">
            <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : isChecking ? 'bg-amber-400 animate-pulse' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'}`}></span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{label}: <span className={isOnline ? 'text-emerald-400' : isChecking ? 'text-amber-400' : 'text-rose-400'}>{status}</span></span>
        </div>
    );
};

const GridTab = ({ type, items, onAdd, onEdit, onDelete }) => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex justify-between items-end bg-[#0f172a]/30 p-8 rounded-3xl border border-slate-800/50 border-dashed">
            <div>
                <h3 className="text-4xl font-black text-white italic tracking-tighter">MANAGE {type.toUpperCase()}S</h3>
                <p className="text-slate-500 text-sm mt-1 uppercase font-bold tracking-[0.2em]">Full CRUD access enabled</p>
            </div>
            <button onClick={onAdd} className="bg-rose-600 hover:bg-rose-500 text-white px-8 py-3.5 rounded-2xl font-black flex items-center gap-2 shadow-2xl shadow-rose-600/20 active:scale-95 transition-all text-sm tracking-widest uppercase">
                <Plus className="w-5 h-5" /> Initialize {type}
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map(item => {
                const img = item.main_image || item.image || '/placeholder.jpg';
                const fullPath = img.startsWith('http') ? img : `http://localhost:5000${img}`;
                return (
                    <div key={item.id} className="group bg-[#0f172a] rounded-3xl overflow-hidden border border-slate-800/50 hover:border-rose-500/30 transition-all duration-500 hover:-translate-y-2">
                        <div className="h-64 relative overflow-hidden">
                            <img src={fullPath} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent opacity-80"></div>
                            <div className="absolute bottom-4 left-6">
                                <span className="bg-rose-500/10 text-rose-500 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest border border-rose-500/20">{item.category || 'Service Module'}</span>
                            </div>
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                                <button onClick={() => onEdit(item)} className="p-3 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-rose-500 transition-colors shadow-xl"><Edit className="w-5 h-5" /></button>
                                <button onClick={() => onDelete(item.id)} className="p-3 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-slate-900 transition-colors shadow-xl"><Trash2 className="w-5 h-5" /></button>
                            </div>
                        </div>
                        <div className="p-8">
                            <h4 className="text-xl font-black text-white uppercase tracking-tight line-clamp-1">{item.title || item.name}</h4>
                            <p className="text-slate-500 text-sm mt-3 line-clamp-3 leading-relaxed font-medium">{item.description}</p>
                            <div className="mt-8 pt-6 border-t border-slate-800/50 flex justify-between items-center text-[10px] font-black text-slate-600 uppercase tracking-widest italic">
                                <span>Ref: ID-{item.id.toString().padStart(4, '0')}</span>
                                <ChevronRight className="w-4 h-4 text-rose-500/30" />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
);

const MonitorTab = ({ stats, messages }) => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <QuickStat label="Network Visitors" value={stats.visitors} unit="LIVE" trend="+8.4%" icon={Globe} color="bg-blue-600" />
            <QuickStat label="Compute Tasks" value={stats.sessions} unit="ACTV" trend="-1.2%" icon={Server} color="bg-emerald-600" />
            <QuickStat label="Archive Size" value={stats.dbSize} unit="SQL" trend="STBL" icon={Database} color="bg-orange-600" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-[#0f172a] rounded-[40px] p-10 border border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 -rotate-12">
                    <MessageSquare className="w-64 h-64 text-rose-500" />
                </div>
                <div className="relative z-10">
                    <h3 className="text-3xl font-black text-white italic tracking-tighter mb-8">Pipeline Activity</h3>
                    <div className="space-y-4">
                        {messages.slice(0, 5).map(m => (
                            <div key={m.id} className="bg-[#020617]/50 p-6 rounded-3xl border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between group">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center font-black text-slate-500 text-xl shadow-inner group-hover:bg-rose-500/10 group-hover:text-rose-500">{m.name[0]}</div>
                                    <div>
                                        <h5 className="font-bold text-white text-base tracking-tight">{m.name}</h5>
                                        <p className="text-slate-500 text-xs font-medium uppercase tracking-widest mt-1">{m.subject || 'Standard Inquiry'}</p>
                                    </div>
                                </div>
                                <span className="text-[10px] font-mono text-slate-700 font-bold uppercase tracking-tighter">{new Date(m.created_at).toLocaleTimeString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="bg-[#0f172a] rounded-[40px] p-10 border border-slate-800">
                <h3 className="text-3xl font-black text-white italic tracking-tighter mb-8">Terminal Health</h3>
                <div className="space-y-12">
                    <HealthRow label="Query Latency" value="12ms" percent={10} isInverse />
                    <HealthRow label="Engine Utilization" value="34.2%" percent={34} />
                    <HealthRow label="VRAM Allocated" value="1.2 GB" percent={60} />
                    <HealthRow label="Security Clearance" value="Pass" percent={100} isStatic />
                </div>
            </div>
        </div>
    </div>
);

const EditorModal = ({ config, onClose, onSave, apiCall }) => {
    const { type, mode, data } = config;
    const [formData, setFormData] = useState(data || { name: '', title: '', description: '', category: '' });
    const [file, setFile] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');

        const fd = new FormData();
        Object.entries(formData).forEach(([k, v]) => {
            if (v !== null) fd.append(k, v);
        });
        if (file) fd.append('image', file);

        const method = mode === 'add' ? 'post' : 'put';
        const url = `/${type}s${mode === 'edit' ? '/' + data.id : ''}`;

        try {
            await apiCall(method, url, fd, true);
            onSave();
        } catch (err) {
            setError(err.response?.data?.error || 'Execution failed. Check your payload parameters.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-[#020617]/90 backdrop-blur-lg animate-in fade-in duration-300">
            <div className="bg-[#0f172a] w-full max-w-2xl rounded-[40px] border border-slate-800 p-12 shadow-2xl relative animate-in zoom-in-95 duration-500">
                <button onClick={onClose} className="absolute top-10 right-10 p-2 text-slate-500 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
                
                <div className="mb-10">
                    <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase">{mode} {type}</h3>
                    <p className="text-slate-500 text-xs mt-2 uppercase tracking-[0.3em] font-bold italic underline decoration-rose-500 underline-offset-4 decoration-2">Initialize Data Transfer Protocol</p>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-500 text-sm font-bold animate-shake">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2 italic">Entity Label</label>
                            <input 
                                value={formData.name || formData.title || ''} 
                                onChange={e => setFormData({...formData, [type === 'service' ? 'name' : 'title']: e.target.value})}
                                placeholder={`${type} Title`} 
                                className="w-full bg-[#020617] border border-slate-800 rounded-2xl px-6 py-4 text-white focus:border-rose-500 focus:outline-none transition-all font-bold placeholder:text-slate-700 shadow-inner" required 
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2 italic">Taxonomy Category</label>
                            <input 
                                value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})}
                                placeholder="e.g. Infrastructure" 
                                className="w-full bg-[#020617] border border-slate-800 rounded-2xl px-6 py-4 text-white focus:border-rose-500 focus:outline-none transition-all font-bold placeholder:text-slate-700 shadow-inner" 
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2 italic">Technical Abstract</label>
                        <textarea 
                            value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})}
                            rows="4" 
                            className="w-full bg-[#020617] border border-slate-800 rounded-2xl px-6 py-4 text-white focus:border-rose-500 focus:outline-none transition-all font-bold placeholder:text-slate-700 shadow-inner resize-none" 
                            placeholder="Provide deep technical insights..." required
                        ></textarea>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2 italic">Visual Manifest</label>
                        <div className="group relative border-2 border-dashed border-slate-800 rounded-[28px] p-10 flex flex-col items-center justify-center text-slate-600 bg-[#020617]/50 hover:border-rose-500/50 hover:bg-rose-500/5 transition-all cursor-pointer">
                            <Plus className="w-12 h-12 mb-4 opacity-20 group-hover:text-rose-500 group-hover:scale-110 transition-all duration-500" />
                            <input type="file" onChange={e => setFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
                            {file ? <span className="text-rose-500 font-black text-sm">{file.name}</span> : <span className="text-xs font-bold uppercase tracking-widest italic font-mono">Drag & Drop or Mount File System</span>}
                        </div>
                    </div>

                    <div className="flex gap-6 pt-6">
                        <button 
                            disabled={isSaving}
                            type="submit" 
                            className="flex-1 bg-rose-600 text-white font-black py-4 rounded-2xl hover:bg-rose-500 shadow-2xl shadow-rose-600/30 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 text-sm tracking-[0.2em] uppercase italic"
                        >
                            {isSaving ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            Commit Data Changes
                        </button>
                        <button type="button" onClick={onClose} className="px-8 border border-slate-800 text-slate-500 font-black rounded-2xl hover:bg-slate-800 transition-colors">ABORT</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Shared Utilities ---

const QuickStat = ({ label, value, unit, trend, icon: Icon, color }) => (
    <div className="bg-[#0f172a] rounded-[40px] p-8 border border-slate-800 relative overflow-hidden group">
        <div className={`absolute top-0 right-0 w-32 h-32 ${color} opacity-0 group-hover:opacity-10 transition-opacity blur-3xl rounded-full`}></div>
        <div className="flex justify-between items-start mb-6 font-black italic">
            <div className={`p-4 rounded-[20px] ${color} shadow-2xl`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <span className={trend.includes('+') ? 'text-emerald-500' : 'text-rose-500'}>{trend}</span>
        </div>
        <div>
            <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] italic pr-2 border-r-2 border-rose-500/20 inline-block mb-3">{label}</p>
            <div className="flex items-baseline gap-2 mt-1">
                <p className="text-5xl font-black text-white italic tracking-tighter">{value}</p>
                <span className="text-slate-600 font-mono font-bold text-xs">{unit}</span>
            </div>
        </div>
    </div>
);

const HealthRow = ({ label, value, percent, isInverse, isStatic }) => {
    let color = 'bg-blue-500';
    if (!isStatic) {
        if (isInverse) color = percent > 50 ? 'bg-rose-500 shadow-rose-500/20' : 'bg-emerald-500 shadow-emerald-500/20';
        else color = percent > 90 ? 'bg-emerald-500 shadow-emerald-500/20' : (percent > 60 ? 'bg-amber-500 shadow-amber-500/20' : 'bg-rose-500 shadow-rose-500/20');
    } else {
        color = 'bg-emerald-500 shadow-emerald-500/20';
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-end text-xs font-black uppercase tracking-widest text-slate-500 italic">
                <span>{label}</span>
                <span className="text-white bg-slate-800 px-3 py-1 rounded-lg shadow-inner">{value}</span>
            </div>
            <div className="h-4 w-full bg-[#020617] rounded-full overflow-hidden shadow-inner flex items-center px-1">
                <div 
                    className={`h-2 ${color} transition-all duration-1000 rounded-full shadow-lg`} 
                    style={{ width: `${percent}%` }}
                ></div>
            </div>
        </div>
    );
};

const PipelineTab = ({ messages }) => (
    <div className="bg-[#0f172a] rounded-[40px] overflow-hidden border border-slate-800 shadow-2xl animate-in fade-in slide-in-from-bottom-8">
        <div className="p-10 border-b border-slate-800 flex justify-between items-end italic">
            <div>
                <h3 className="text-3xl font-black text-white tracking-tighter">INQUIRY PIPELINE</h3>
                <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest font-bold">Encrypted Lead Data Management</p>
            </div>
            <div className="px-5 py-2 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-xs font-black">
                {messages.length} ACTIVE LEADS
            </div>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-slate-900/50 border-b border-slate-800">
                    <tr>
                        <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Origin / Source</th>
                        <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Technical Intent</th>
                        <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">Current Status</th>
                        <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic text-right italic">Timestamp</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                    {messages.map(m => (
                        <tr key={m.id} className="hover:bg-slate-800/30 transition-all cursor-pointer group">
                            <td className="px-10 py-8">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-lg font-black italic shadow-inner">{m.name[0]}</div>
                                    <div>
                                        <div className="text-base font-black text-white tracking-tight italic">{m.name}</div>
                                        <div className="text-[11px] text-slate-600 font-bold uppercase tracking-widest mt-1">{m.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-10 py-8 text-sm text-slate-400 group-hover:text-slate-200 transition-colors font-medium max-w-xs truncate italic underline decoration-slate-800 underline-offset-4">{m.subject || '(No Specific Intent Specified)'}</td>
                            <td className="px-10 py-8">
                                <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${m.status === 'new' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-slate-800 text-slate-600 border border-slate-800'}`}>
                                    {m.status} NODE
                                </span>
                            </td>
                            <td className="px-10 py-8 text-right text-[10px] font-black font-mono text-slate-600 uppercase italic">{new Date(m.created_at).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const UsersTab = ({ onRefresh }) => {
    const [regData, setRegData] = useState({ username: '', password: '' });
    const [status, setStatus] = useState({ type: '', msg: '' });

    const handleRegister = async (e) => {
        e.preventDefault();
        setStatus({ type: 'info', msg: 'Processing Authorized Access Request...' });
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${API_BASE}/register`, regData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStatus({ type: 'success', msg: 'CLEARANCE GRANTED: New Identity Registered.' });
            setRegData({ username: '', password: '' });
            onRefresh();
        } catch (err) {
            setStatus({ type: 'error', msg: err.response?.data?.error || 'AUTHORIZATION FAILED: Manual Override Required.' });
        }
    };

    return (
        <div className="max-w-xl mx-auto space-y-10 animate-in zoom-in-95 duration-500">
            <div className="bg-[#0f172a] rounded-[50px] p-12 border border-slate-800 relative overflow-hidden shadow-2xl">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-rose-600/10 rounded-full blur-[80px]"></div>
                
                <div className="mb-10 text-center italic">
                    <div className="p-4 bg-rose-600 rounded-3xl w-min mx-auto shadow-2xl shadow-rose-600/30 mb-6">
                        <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-4xl font-black text-white tracking-tighter uppercase italic">Identity Forge</h3>
                    <p className="text-slate-500 text-xs mt-2 uppercase tracking-[0.2em] font-bold underline decoration-rose-500/50 underline-offset-8">Generate Authorized Credentials</p>
                </div>
                
                <form onSubmit={handleRegister} className="space-y-6 relative z-10">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-4 italic">Login Identifier</label>
                        <input 
                            type="text" 
                            value={regData.username} 
                            onChange={e => setRegData({...regData, username: e.target.value})}
                            className="w-full bg-[#020617] border border-slate-800 rounded-3xl px-8 py-4.5 text-white focus:border-rose-500 focus:outline-none transition-all font-bold placeholder:text-slate-800 italic"
                            placeholder="username@domain.com"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-4 italic">Cryptographic Secret</label>
                        <input 
                            type="password" 
                            value={regData.password} 
                            onChange={e => setRegData({...regData, password: e.target.value})}
                            className="w-full bg-[#020617] border border-slate-800 rounded-3xl px-8 py-4.5 text-white focus:border-rose-500 focus:outline-none transition-all font-bold placeholder:text-slate-800 italic"
                            placeholder="••••••••••••"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-slate-100 hover:bg-rose-500 hover:text-white text-[#020617] font-black py-5 rounded-3xl shadow-2xl shadow-rose-600/10 transition-all active:scale-95 text-sm tracking-[0.3em] uppercase italic mt-4">
                        Forge Access Key
                    </button>
                    {status.msg && (
                        <p className={`text-[10px] text-center font-black uppercase tracking-[0.1em] mt-6 italic p-3 rounded-2xl border ${status.type === 'error' ? 'text-rose-500 bg-rose-500/5 border-rose-500/10' : 'text-emerald-500 bg-emerald-500/5 border-emerald-500/10'}`}>
                            {status.msg}
                        </p>
                    )}
                </form>
            </div>
            
            <div className="text-center italic">
                <p className="text-[10px] text-slate-700 font-bold uppercase tracking-[0.4em]">Section 4.12: Credential Policy v2.0</p>
            </div>
        </div>
    );
};

const LoaderOverlay = () => (
    <div className="fixed inset-0 z-[200] bg-[#020617]/50 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-300">
        <div className="flex flex-col items-center">
            <RefreshCcw className="w-12 h-12 text-rose-500 animate-spin mb-4" />
            <p className="text-[10px] font-black text-white tracking-[0.5em] uppercase italic">Synchronizing Terminal...</p>
        </div>
    </div>
);

export default AdminDashboard;