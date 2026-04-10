import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Shield, Mail, Lock, AlertCircle } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://elite-backend-8hcx.onrender.com';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('admin@elite.com'); // Updated default email
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [debugInfo, setDebugInfo] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setDebugInfo(null);

        try {
            // Use the correct endpoint - same as user login but with admin credentials
            const response = await axios.post(`${API_BASE_URL}/api/users/login`, {
                email: email,
                password: password
            });

            console.log('Login response:', response.data);

            if (response.data.success && response.data.user.role === 'admin') {
                // Store admin authentication
                localStorage.setItem('adminAuthenticated', 'true');
                localStorage.setItem('adminToken', response.data.token);
                localStorage.setItem('adminUser', JSON.stringify(response.data.user));

                // Redirect to dashboard
                navigate('/admin/dashboard');
            } else if (response.data.success && response.data.user.role !== 'admin') {
                setError('Access denied. Admin privileges required.');
            } else {
                setError('Invalid credentials');
            }
        } catch (err) {
            console.error('Login error:', err);

            // Detailed error logging
            const debug = {
                apiUrl: `${API_BASE_URL}/api/users/login`,
                status: err.response?.status,
                statusText: err.response?.statusText,
                data: err.response?.data,
                message: err.message
            };
            setDebugInfo(debug);

            if (err.response?.status === 401) {
                setError('Invalid email or password');
            } else if (err.response?.status === 404) {
                setError('Backend server not found. Please make sure the backend is running on port 5000');
            } else {
                setError(err.response?.data?.error || 'Login failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600 rounded-2xl shadow-2xl mb-4">
                        <Shield size={40} className="text-white" />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">elite</h1>
                    <p className="text-slate-400 font-bold text-sm uppercase tracking-[0.3em] mt-2">CONSTRUCTION</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-3xl shadow-2xl p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Admin Access</h2>
                        <p className="text-slate-500 text-sm mt-1">Enter your credentials to continue</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                            <div className="flex items-start gap-3">
                                <AlertCircle size={20} className="text-red-600 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-red-600 font-semibold text-sm">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                                EMAIL / USERNAME
                            </label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-slate-100 rounded-2xl focus:border-red-500 focus:outline-none transition-colors font-medium"
                                    placeholder="admin@elite.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                                PASSWORD
                            </label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-slate-100 rounded-2xl focus:border-red-500 focus:outline-none transition-colors font-medium"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-600/30"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    AUTHENTICATING...
                                </div>
                            ) : (
                                'ACCESS DASHBOARD'
                            )}
                        </button>
                    </form>

                    {/* Debug Info */}
                    {debugInfo && (
                        <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Debug Info:</p>
                            <p className="text-xs text-slate-600 font-mono break-all">
                                API URL: {debugInfo.apiUrl}<br />
                                Status: {debugInfo.status} {debugInfo.statusText}<br />
                                {debugInfo.data?.error && `Error: ${debugInfo.data.error}`}
                            </p>
                        </div>
                    )}
                </div>

                {/* Demo Credentials */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-slate-500">
                        Demo Admin: admin@elite.com / admin123
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;