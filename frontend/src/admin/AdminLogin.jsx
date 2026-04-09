import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Your backend uses /api/login from authRoutes
            const response = await axios.post(`${API_BASE_URL}/api/login`, {
                username: email,  // Your authRoutes likely expects 'username'
                password: password
            });

            console.log('Login response:', response.data); // Debug log

            // Check the response structure from your authRoutes
            if (response.data.token) {
                // Store using the keys that Dashboard expects
                localStorage.setItem('adminToken', response.data.token);
                localStorage.setItem('adminAuthenticated', 'true');

                // Store user info if provided
                if (response.data.user) {
                    localStorage.setItem('adminData', JSON.stringify(response.data.user));
                }

                console.log('✅ Login successful, redirecting...');
                navigate('/admin/dashboard');
            } else {
                setError('Invalid response from server');
            }
        } catch (err) {
            console.error('❌ Login error:', err);

            // Handle different error responses
            if (err.response) {
                // Server responded with error
                const errorMsg = err.response.data?.error ||
                    err.response.data?.message ||
                    `Login failed: ${err.response.status}`;
                setError(errorMsg);
            } else if (err.request) {
                // Request made but no response
                setError('Cannot connect to server. Please check if backend is running on port 5000');
            } else {
                setError('Login failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-2xl">
                <div>
                    <div className="text-center">
                        <div className="w-20 h-20 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-white font-black text-3xl">EC</span>
                        </div>
                        <div className="text-3xl font-black tracking-tighter text-gray-900">elite</div>
                        <div className="text-xs tracking-[0.3em] text-gray-500 mt-1 font-bold">CONSTRUCTION</div>
                    </div>
                    <h2 className="mt-6 text-center text-2xl font-black text-gray-900 tracking-tight">
                        Admin Access
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter your credentials to continue
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-md text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                                Email / Username
                            </label>
                            <input
                                type="text"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                                placeholder="admin@example.com"
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:z-10 sm:text-sm"
                                placeholder="••••••••"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-black uppercase tracking-widest rounded-xl text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'AUTHENTICATING...' : 'ACCESS DASHBOARD'}
                        </button>
                    </div>
                </form>

                {/* Debug info - shows in development */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-4 p-3 bg-gray-100 rounded-lg text-xs">
                        <p className="font-mono text-gray-600">🔧 Debug Info:</p>
                        <p className="font-mono text-gray-600">API URL: {API_BASE_URL}</p>
                        <p className="font-mono text-gray-600">Endpoint: /api/login</p>
                        <p className="font-mono text-gray-600 mt-2">💡 Check your authRoutes.js for expected credentials</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminLogin;