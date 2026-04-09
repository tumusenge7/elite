import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send, User, Mail, Lock, LogIn, UserPlus } from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Form states
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [registerName, setRegisterName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [error, setError] = useState('');

    // Auto-scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Check if user is logged in on mount
    useEffect(() => {
        const token = localStorage.getItem('chatToken');
        const savedUser = localStorage.getItem('chatUser');
        if (token && savedUser) {
            setIsLoggedIn(true);
            setUser(JSON.parse(savedUser));
            fetchChatHistory(JSON.parse(savedUser).id);
        }
    }, []);

    const fetchChatHistory = async (userId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/users/chat-history/${userId}`);
            setMessages(response.data.messages);
        } catch (error) {
            console.error('Error fetching chat history:', error);
        }
    };

    const checkEmailExists = async (email) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/users/check-email`, { email });
            return response.data.exists;
        } catch (error) {
            console.error('Error checking email:', error);
            return false;
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Check if email exists
            const emailExists = await checkEmailExists(registerEmail);
            if (emailExists) {
                setError('Email already registered. Please login instead.');
                setShowRegister(false);
                return;
            }

            const response = await axios.post(`${API_BASE_URL}/api/users/register`, {
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
                setError('');

                // Clear form
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
            const response = await axios.post(`${API_BASE_URL}/api/users/login`, {
                email: loginEmail,
                password: loginPassword
            });

            if (response.data.success) {
                localStorage.setItem('chatToken', response.data.token);
                localStorage.setItem('chatUser', JSON.stringify(response.data.user));
                setIsLoggedIn(true);
                setUser(response.data.user);
                fetchChatHistory(response.data.user.id);
                setError('');

                // Clear form
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
        if (!message.trim()) return;

        setLoading(true);

        try {
            await axios.post(`${API_BASE_URL}/api/users/send-message`, {
                user_id: user.id,
                message: message
            });

            // Add message to local state
            setMessages([...messages, {
                id: Date.now(),
                message: message,
                created_at: new Date().toISOString()
            }]);
            setMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
            setError('Failed to send message');
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

    // Chat configuration - You can change these values
    const chatConfig = {
        name: "Elite Construction Support", // Main chat name
        shortName: "Elite Chat", // Short name for button tooltip
        welcomeMessage: "Welcome to Elite Construction! How can we help you today?",
        agentName: "Support Team"
    };

    return (
        <>
            {/* Chat Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 left-6 bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition-all z-50 group"
                title={chatConfig.shortName}
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
                {!isOpen && (
                    <>
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                        {/* Tooltip with chat name */}
                        <span className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            {chatConfig.shortName}
                        </span>
                    </>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-24 left-6 w-96 bg-white rounded-2xl shadow-2xl z-50 flex flex-col max-h-[600px]">
                    {/* Header - Added chat name prominently */}
                    <div className="bg-red-600 text-white p-4 rounded-t-2xl">
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <MessageCircle size={18} className="text-white" />
                                    <h3 className="font-bold text-lg">{chatConfig.name}</h3>
                                </div>
                                <p className="text-xs opacity-90 mt-1">
                                    {chatConfig.agentName} • Typically replies within minutes
                                </p>
                            </div>
                            {isLoggedIn && (
                                <button
                                    onClick={handleLogout}
                                    className="text-xs bg-red-700 px-2 py-1 rounded hover:bg-red-800 transition-colors"
                                >
                                    Logout
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px] max-h-[400px] bg-gray-50">
                        {isLoggedIn ? (
                            messages.length > 0 ? (
                                <>
                                    {/* Optional: Show welcome message as first system message */}
                                    {messages.length === 0 && (
                                        <div className="flex justify-start">
                                            <div className="bg-gray-200 text-gray-800 rounded-lg px-3 py-2 max-w-[80%]">
                                                <p className="text-sm">{chatConfig.welcomeMessage}</p>
                                            </div>
                                        </div>
                                    )}
                                    {messages.map((msg) => (
                                        <div key={msg.id} className="flex justify-end">
                                            <div className="bg-red-100 text-gray-800 rounded-lg px-3 py-2 max-w-[80%]">
                                                <p className="text-sm">{msg.message}</p>
                                                <span className="text-[10px] text-gray-500">
                                                    {new Date(msg.created_at).toLocaleTimeString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <div className="text-center py-10">
                                    <MessageCircle size={40} className="mx-auto mb-2 text-red-400" />
                                    <p className="text-gray-600 mb-2 font-medium">{chatConfig.name}</p>
                                    <p className="text-sm text-gray-500">{chatConfig.welcomeMessage}</p>
                                </div>
                            )
                        ) : (
                            <div className="text-center py-10">
                                <MessageCircle size={40} className="mx-auto mb-2 text-red-400" />
                                <p className="text-gray-800 font-bold mb-1">{chatConfig.name}</p>
                                <p className="text-gray-600 mb-2">Connect with our support team</p>
                                <p className="text-sm text-gray-500">Please login or register to start chatting</p>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Auth Forms or Message Input */}
                    <div className="border-t p-4 bg-white rounded-b-2xl">
                        {!isLoggedIn ? (
                            <>
                                {!showRegister ? (
                                    // Login Form
                                    <form onSubmit={handleLogin} className="space-y-3">
                                        <h4 className="font-semibold text-gray-800 mb-2">Login to {chatConfig.shortName}</h4>
                                        <div className="relative">
                                            <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="email"
                                                placeholder="Email"
                                                value={loginEmail}
                                                onChange={(e) => setLoginEmail(e.target.value)}
                                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                                required
                                            />
                                        </div>
                                        <div className="relative">
                                            <Lock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="password"
                                                placeholder="Password"
                                                value={loginPassword}
                                                onChange={(e) => setLoginPassword(e.target.value)}
                                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                                required
                                            />
                                        </div>
                                        {error && <p className="text-red-500 text-xs">{error}</p>}
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
                                        >
                                            <LogIn size={16} />
                                            {loading ? 'Logging in...' : 'Login'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowRegister(true);
                                                setError('');
                                            }}
                                            className="w-full text-center text-sm text-red-600 hover:text-red-700"
                                        >
                                            Don't have an account? Register
                                        </button>
                                    </form>
                                ) : (
                                    // Register Form
                                    <form onSubmit={handleRegister} className="space-y-3">
                                        <h4 className="font-semibold text-gray-800 mb-2">Create Account for {chatConfig.shortName}</h4>
                                        <div className="relative">
                                            <User size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Full Name"
                                                value={registerName}
                                                onChange={(e) => setRegisterName(e.target.value)}
                                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                                required
                                            />
                                        </div>
                                        <div className="relative">
                                            <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="email"
                                                placeholder="Email"
                                                value={registerEmail}
                                                onChange={(e) => setRegisterEmail(e.target.value)}
                                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                                required
                                            />
                                        </div>
                                        <div className="relative">
                                            <Lock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="password"
                                                placeholder="Password (min 6 characters)"
                                                value={registerPassword}
                                                onChange={(e) => setRegisterPassword(e.target.value)}
                                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                                required
                                                minLength="6"
                                            />
                                        </div>
                                        {error && <p className="text-red-500 text-xs">{error}</p>}
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
                                        >
                                            <UserPlus size={16} />
                                            {loading ? 'Creating account...' : 'Register'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowRegister(false);
                                                setError('');
                                            }}
                                            className="w-full text-center text-sm text-red-600 hover:text-red-700"
                                        >
                                            Already have an account? Login
                                        </button>
                                    </form>
                                )}
                            </>
                        ) : (
                            // Message Input with agent name
                            <form onSubmit={handleSendMessage} className="flex gap-2">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder={`Message ${chatConfig.agentName}...`}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !message.trim()}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                                >
                                    <Send size={18} />
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