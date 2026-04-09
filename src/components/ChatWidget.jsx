import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send, User, Mail, Lock, LogIn, UserPlus } from 'lucide-react';

// Remove the API_BASE_URL - use relative paths for Vercel
const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const messagesEndRef = useRef(null);

    // Form states
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [registerName, setRegisterName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Check login status on mount
    useEffect(() => {
        const token = localStorage.getItem('chatToken');
        const savedUser = localStorage.getItem('chatUser');
        if (token && savedUser) {
            const userData = JSON.parse(savedUser);
            setIsLoggedIn(true);
            setUser(userData);
            fetchChatHistory(userData.id);
        }
    }, []);

    const getAuthConfig = () => {
        const token = localStorage.getItem('chatToken');
        if (!token) throw new Error('No token');
        return {
            headers: { 'Authorization': `Bearer ${token}` }
        };
    };

    const fetchChatHistory = async (userId) => {
        try {
            const config = getAuthConfig();
            // Use relative URL
            const response = await axios.get(`/api/users/chat-history/${userId}`, config);
            if (response.data && response.data.messages) {
                setMessages(response.data.messages);
            }
        } catch (error) {
            console.error('Error fetching chat history:', error);
            if (error.response?.status === 401) {
                handleLogout();
            }
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Use relative URL
            const response = await axios.post('/api/users/register', {
                name: registerName,
                email: registerEmail,
                password: registerPassword
            });

            if (response.data.success) {
                localStorage.setItem('chatToken', response.data.token);
                localStorage.setItem('chatUser', JSON.stringify(response.data.user));
                setIsLoggedIn(true);
                setUser(response.data.user);
                setShowRegister(false);
                setMessages([]);

                setRegisterName('');
                setRegisterEmail('');
                setRegisterPassword('');
            }
        } catch (error) {
            setError(error.response?.data?.error || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Use relative URL
            const response = await axios.post('/api/users/login', {
                email: loginEmail,
                password: loginPassword
            });

            if (response.data.success) {
                localStorage.setItem('chatToken', response.data.token);
                localStorage.setItem('chatUser', JSON.stringify(response.data.user));
                setIsLoggedIn(true);
                setUser(response.data.user);
                await fetchChatHistory(response.data.user.id);

                setLoginEmail('');
                setLoginPassword('');
            }
        } catch (error) {
            setError(error.response?.data?.error || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim() || !user) return;

        setLoading(true);
        setError('');

        try {
            const config = getAuthConfig();
            // Use relative URL
            const response = await axios.post('/api/users/send-message', {
                user_id: user.id,
                message: message
            }, config);

            if (response.data.success) {
                const newMessage = {
                    id: response.data.message.id || Date.now(),
                    message: message,
                    created_at: new Date().toISOString(),
                    is_admin_reply: false
                };
                setMessages(prev => [...prev, newMessage]);
                setMessage('');
            }
        } catch (error) {
            console.error('Send error:', error);
            setError(error.response?.data?.error || 'Failed to send message');
            if (error.response?.status === 401) {
                handleLogout();
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('chatToken');
        localStorage.removeItem('chatUser');
        setIsLoggedIn(false);
        setUser(null);
        setMessages([]);
        setMessage('');
    };

    const chatConfig = {
        name: "Elite Construction Support",
        shortName: "Elite Chat",
        welcomeMessage: "Welcome! How can we help you today?",
        agentName: "Support Team"
    };

    return (
        <>
            {/* Chat Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 left-6 bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition-all z-50 group"
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 left-6 w-96 bg-white rounded-2xl shadow-2xl z-50 flex flex-col max-h-[600px]">
                    {/* Header */}
                    <div className="bg-red-600 text-white p-4 rounded-t-2xl">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold">{chatConfig.name}</h3>
                                <p className="text-xs opacity-90">{chatConfig.agentName} • Typically replies within minutes</p>
                            </div>
                            {isLoggedIn && (
                                <button onClick={handleLogout} className="text-xs bg-red-700 px-2 py-1 rounded hover:bg-red-800">
                                    Logout
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="mx-4 mt-4 p-2 bg-red-50 text-red-600 text-xs rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px] max-h-[400px] bg-gray-50">
                        {isLoggedIn ? (
                            messages.length > 0 ? (
                                messages.map((msg) => (
                                    <div key={msg.id} className={`flex ${msg.is_admin_reply ? 'justify-start' : 'justify-end'}`}>
                                        <div className={`max-w-[80%] rounded-lg px-3 py-2 ${msg.is_admin_reply ? 'bg-gray-200 text-gray-800' : 'bg-red-100 text-gray-800'
                                            }`}>
                                            <p className="text-sm">{msg.message}</p>
                                            <span className="text-[10px] text-gray-500">
                                                {new Date(msg.created_at).toLocaleTimeString()}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10">
                                    <MessageCircle size={40} className="mx-auto mb-2 text-red-400" />
                                    <p className="text-gray-600">No messages yet</p>
                                    <p className="text-sm text-gray-500">Send a message to start the conversation</p>
                                </div>
                            )
                        ) : (
                            <div className="text-center py-10">
                                <MessageCircle size={40} className="mx-auto mb-2 text-gray-400" />
                                <p className="text-gray-600 mb-2">Welcome to Elite Construction</p>
                                <p className="text-sm text-gray-500">Please login or register to start chatting</p>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="border-t p-4 bg-white rounded-b-2xl">
                        {!isLoggedIn ? (
                            <>
                                {!showRegister ? (
                                    <form onSubmit={handleLogin} className="space-y-3">
                                        <h4 className="font-semibold text-gray-800">Login to Chat</h4>
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            value={loginEmail}
                                            onChange={(e) => setLoginEmail(e.target.value)}
                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                            required
                                        />
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            value={loginPassword}
                                            onChange={(e) => setLoginPassword(e.target.value)}
                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                            required
                                        />
                                        <button type="submit" disabled={loading} className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">
                                            {loading ? 'Logging in...' : 'Login'}
                                        </button>
                                        <button type="button" onClick={() => setShowRegister(true)} className="w-full text-center text-sm text-red-600">
                                            Don't have an account? Register
                                        </button>
                                    </form>
                                ) : (
                                    <form onSubmit={handleRegister} className="space-y-3">
                                        <h4 className="font-semibold text-gray-800">Create Account</h4>
                                        <input
                                            type="text"
                                            placeholder="Full Name"
                                            value={registerName}
                                            onChange={(e) => setRegisterName(e.target.value)}
                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                            required
                                        />
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            value={registerEmail}
                                            onChange={(e) => setRegisterEmail(e.target.value)}
                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                            required
                                        />
                                        <input
                                            type="password"
                                            placeholder="Password (min 6 characters)"
                                            value={registerPassword}
                                            onChange={(e) => setRegisterPassword(e.target.value)}
                                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                            required
                                            minLength="6"
                                        />
                                        <button type="submit" disabled={loading} className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">
                                            {loading ? 'Creating account...' : 'Register'}
                                        </button>
                                        <button type="button" onClick={() => setShowRegister(false)} className="w-full text-center text-sm text-red-600">
                                            Already have an account? Login
                                        </button>
                                    </form>
                                )}
                            </>
                        ) : (
                            <form onSubmit={handleSendMessage} className="flex gap-2">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder={`Type your message, ${user?.name}...`}
                                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    disabled={loading}
                                />
                                <button type="submit" disabled={loading || !message.trim()} className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50">
                                    {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send size={18} />}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatWidget;