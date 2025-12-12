import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false); // Mobile menu state

    // Hide nav links on auth pages
    const isAuthPage = ['/login', '/register'].includes(location.pathname);


    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 border-b border-transparent ${scrolled
                ? 'bg-[#030712]/80 backdrop-blur-lg border-white/5 py-4'
                : 'bg-transparent py-6'
                }`}
        >
            <div className="container mx-auto px-6 flex justify-between items-center">
                <div className="flex items-center gap-6">
                    <Link to="/" className="text-2xl font-black tracking-tighter italic flex items-center gap-2 group">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 group-hover:from-blue-300 group-hover:to-purple-400 transition-all">
                            PD
                        </span>
                        <span className="text-white group-hover:text-blue-200 transition-colors">
                            SYSTEM
                        </span>
                    </Link>

                    {/* Conditional Back Button (Only on Dashboards) */}
                    {(location.pathname === '/traveller' || location.pathname === '/reporter') && (
                        <button
                            onClick={() => navigate('/')}
                            className={`px-4 py-1.5 rounded-full transition-all flex items-center gap-2 group font-medium text-xs border items-center
                                ${location.pathname === '/reporter'
                                    ? 'bg-white/10 hover:bg-white/20 text-white border-white/10 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.1)]' // Glassmorphic for Reporter
                                    : 'bg-black hover:bg-slate-900 text-white border-transparent shadow-lg shadow-black/20' // Black effect for Traveller
                                }`}
                        >
                            <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back
                        </button>
                    )}
                </div>

                {/* DESKTOP NAVIGATION */}
                <div className="hidden md:flex items-center space-x-8">
                    {user ? (
                        <>
                            <span className="text-slate-400 font-mono text-sm hidden md:block">
                                {user.name} <span className="text-blue-500">[{user.role}]</span>
                            </span>
                            {user.role === 'REPORTER' && (
                                <Link to="/reporter" className="text-slate-300 hover:text-white transition-colors text-sm font-medium tracking-wide uppercase">
                                    Dashboard
                                </Link>
                            )}
                            {user.role === 'TRAVELLER' && (
                                <Link to="/traveller" className="text-slate-300 hover:text-white transition-colors text-sm font-medium tracking-wide uppercase">
                                    Live Map
                                </Link>
                            )}
                            <button
                                onClick={handleLogout}
                                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-full text-sm font-bold transition-all shadow-[0_0_15px_rgba(220,38,38,0.5)] hover:shadow-[0_0_25px_rgba(220,38,38,0.7)]"
                            >
                                Logout This Session
                            </button>
                        </>
                    ) : (
                        // GUEST NAVIGATION
                        <>
                            <Link
                                to="/"
                                onClick={() => window.scrollTo(0, 0)}
                                className="text-slate-300 hover:text-white font-medium transition-colors mr-6"
                            >
                                Home
                            </Link>

                            {!isAuthPage && (
                                <a href="/#how-it-works" className="text-slate-300 hover:text-white font-medium transition-colors mr-6">
                                    How It Works
                                </a>
                            )}

                            <Link to="/login" className="text-slate-300 hover:text-white font-medium transition-colors link-login ml-2">
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="ml-6 px-6 py-2.5 bg-white text-black rounded-full font-bold hover:bg-blue-50 transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>

                {/* MOBILE HAMBURGER BUTTON */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                    {isOpen ? (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>
            </div>

            {/* MOBILE MENU DROPDOWN */}
            <div className={`md:hidden absolute top-full left-0 w-full bg-[#030712] border-b border-white/10 shadow-2xl transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="flex flex-col p-6 space-y-4">
                    {user ? (
                        <>
                            <div className="flex items-center justify-between pb-4 border-b border-white/5">
                                <span className="text-slate-400 font-mono text-sm">
                                    {user.name} <span className="text-blue-500">[{user.role}]</span>
                                </span>
                            </div>
                            {user.role === 'REPORTER' && (
                                <Link onClick={() => setIsOpen(false)} to="/reporter" className="text-slate-300 hover:text-white transition-colors text-lg font-medium py-2 block">
                                    Dashboard
                                </Link>
                            )}
                            {user.role === 'TRAVELLER' && (
                                <Link onClick={() => setIsOpen(false)} to="/traveller" className="text-slate-300 hover:text-white transition-colors text-lg font-medium py-2 block">
                                    Live Map
                                </Link>
                            )}
                            <button
                                onClick={() => { handleLogout(); setIsOpen(false); }}
                                className="w-full mt-4 px-5 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg text-base font-bold transition-all"
                            >
                                Logout This Session
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/"
                                onClick={() => { window.scrollTo(0, 0); setIsOpen(false); }}
                                className="text-slate-300 hover:text-white text-lg font-medium py-2 block"
                            >
                                Home
                            </Link>

                            {!isAuthPage && (
                                <a href="/#how-it-works" onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-white text-lg font-medium py-2 block">
                                    How It Works
                                </a>
                            )}

                            <div className="pt-4 flex flex-col gap-3">
                                <Link to="/login" onClick={() => setIsOpen(false)} className="text-center w-full py-3 rounded-lg border border-white/10 text-white font-semibold hover:bg-white/5 transition-all">
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setIsOpen(false)}
                                    className="text-center w-full py-3 bg-white text-black rounded-lg font-bold hover:bg-blue-50 transition-all"
                                >
                                    Register
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav >
    );
};

export default Navbar;
