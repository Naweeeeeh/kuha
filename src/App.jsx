import React, { useState } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Lock, X, ShieldAlert } from 'lucide-react';

import Navbar from './components/layout/Navbar';
import PageTransition from './components/PageTransition';

import Home from './pages/Home';
import RequestForm from './pages/RequestForm';
import Transactions from './pages/Transactions';
import AdminLogs from './pages/AdminLogs';

const tuyomPassword = import.meta.env.VITE_TUYOMPASSWORD



export default function App() {
    const location = useLocation();
    const navigate = useNavigate();

    // --- ADMIN AUTHENTICATION STATE ---
    const [isAdmin, setIsAdmin] = useState(localStorage.getItem('secretary_auth') === 'true');
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();

        // The Master Password
        if (password === tuyomPassword) {
            localStorage.setItem('secretary_auth', 'true');
            setIsAdmin(true);
            setShowAuthModal(false);
            setPassword('');
            setError('');
            navigate('/admin-logs'); // Auto-redirect to logs upon success
        } else {
            setError('Incorrect password. Access denied.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('secretary_auth');
        setIsAdmin(false);
        navigate('/'); // Bounce them to home when they lock the system
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative">

            {/* Pass the states to Navbar */}
            <Navbar isAdmin={isAdmin} onLogout={handleLogout} />

            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>

                    <Route path="/" element={<PageTransition><Home /></PageTransition>} />
                    <Route path="/request" element={<PageTransition><RequestForm /></PageTransition>} />
                    <Route path="/transactions" element={<PageTransition><Transactions /></PageTransition>} />

                    {/* Protected Route: If they aren't admin, bounce them to Home */}
                    <Route path="/admin-logs" element={
                        isAdmin ? <PageTransition><AdminLogs /></PageTransition> : <Navigate to="/" replace />
                    } />

                </Routes>
            </AnimatePresence>

            {!isAdmin && (
                <button
                    onClick={() => setShowAuthModal(true)}
                    className="fixed bottom-4 left-4 p-3 rounded-full text-slate-300 hover:text-[#2D5128] hover:bg-[#E4EB9C]/50 transition-all z-40 opacity-30 hover:opacity-100"
                    title="Secretary Access"
                >
                    <Lock size={16} />
                </button>
            )}

            {showAuthModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#142C14]/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2rem] p-8 w-full max-w-sm shadow-2xl border border-[#8DA750]/20 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 bg-[#E4EB9C]/40 flex items-center justify-center rounded-xl text-[#2D5128]">
                                <Lock size={24} />
                            </div>
                            <button onClick={() => { setShowAuthModal(false); setError(''); setPassword(''); }} className="p-2 text-slate-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <h3 className="font-heading font-black text-2xl text-[#142C14] mb-2">Secretary Login</h3>
                        <p className="text-sm text-slate-500 font-medium mb-6">Enter the master password to access the Barangay logs and records.</p>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <input
                                    type="password"
                                    autoFocus
                                    required
                                    placeholder="Enter password"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-sm text-slate-900 font-medium focus:ring-2 focus:ring-[#2D5128] focus:border-transparent outline-none transition-all shadow-sm"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                {error && <p className="text-xs text-red-500 font-bold mt-2 flex items-center gap-1"><ShieldAlert size={12}/> {error}</p>}
                            </div>
                            <button type="submit" className="w-full h-12 inline-flex items-center justify-center rounded-xl bg-[#2D5128] text-white font-bold transition-all hover:bg-[#142C14] shadow-lg active:scale-[0.98]">
                                Unlock Access
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}