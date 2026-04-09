import React from 'react';
import { motion } from 'framer-motion';
import {
    Briefcase,
    MessageSquare,
    Wrench,
    TrendingUp,

    Users
} from 'lucide-react';

const StatCard = ({ title, value, icon, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 group"
    >
        <div className="flex justify-between items-start mb-6">
            <div className={`p-4 rounded-2xl ${color} bg-opacity-10 group-hover:scale-110 transition-transform duration-500`}>
                {React.cloneElement(icon, { className: `w-6 h-6 ${color.replace('bg-', 'text-')}` })}
            </div>
            <span className="text-green-500 font-black text-xs flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
                <TrendingUp size={12} />
                +12%
            </span>
        </div>
        <div className="space-y-1">
            <h3 className="text-slate-500 font-bold text-xs uppercase tracking-widest">{title}</h3>
            <p className="text-4xl font-black text-slate-900 tracking-tighter">{value}</p>
        </div>
    </motion.div>
);

const DashboardStats = ({ stats }) => {
    const defaultStats = [
        { title: 'Total Projects', value: stats?.projects || 0, icon: <Briefcase />, color: 'bg-indigo-600', delay: 0.1 },
        { title: 'Active Services', value: stats?.services || 0, icon: <Wrench />, color: 'bg-red-600', delay: 0.2 },
        { title: 'New Messages', value: stats?.messages || 0, icon: <MessageSquare />, color: 'bg-amber-500', delay: 0.3 },
        { title: 'Total Customers', value: '48', icon: <Users />, color: 'bg-emerald-600', delay: 0.4 },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {defaultStats.map((stat, i) => (
                <StatCard key={i} {...stat} />
            ))}
        </div>
    );
};

export default DashboardStats;
