import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HowItWorks from '../components/HowItWorks';
import StatisticsSection from '../components/StatisticsSection';
import UserActionCards from '../components/UserActionCards';
import Footer from '../components/Footer';

const LandingPage = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    // Scroll To Top Logic
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const checkScroll = () => {
            if (!user && window.scrollY > 300) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };
        window.addEventListener('scroll', checkScroll);
        return () => window.removeEventListener('scroll', checkScroll);
    }, [user]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleStartDetection = (e) => {
        e.preventDefault();
        navigate('/register');
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setMousePosition({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                });
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div
            ref={containerRef}
            className="min-h-screen bg-[#030712] overflow-x-hidden relative font-sans text-white selection:bg-blue-500/30"
        >
            {/* --- GLOBAL BACKGROUND EFFECTS --- */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-purple-900/20 rounded-full blur-[100px] animate-blob"></div>
                <div className="absolute top-[40%] right-[-10%] w-[50vw] h-[50vw] bg-blue-900/10 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
                <div
                    className="absolute inset-0 z-0 transition-opacity duration-300"
                    style={{
                        background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`
                    }}
                ></div>
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
            </div>

            {/* --- HERO SECTION (PERSISTENT) --- */}
            <div className={`relative z-10 flex flex-col justify-center ${user ? 'min-h-[50vh]' : 'min-h-screen'}`}>


                {/* Background & Effects */}

                <div className="container mx-auto px-6 relative z-10 pt-20">
                    <div className="max-w-4xl mx-auto text-center space-y-12">
                        {/* Badge */}
                        <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 backdrop-blur-md shadow-lg animate-fade-in-down">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            <span className="text-sm font-medium text-slate-300 tracking-wide uppercase">AI Network Active</span>
                        </div>

                        {/* Heading */}
                        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter leading-tight animate-fade-in-up">
                            <span className="inline-block bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
                                Smooth
                            </span>
                            <br />
                            <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 animate-gradient-x bg-[length:200%_auto]">
                                Journeys.
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-100">
                            Detect potholes instantly using AI.
                            Experience the future of safe navigation with real-time analytics.
                        </p>


                        {/* Only show these marketing buttons if NOT logged in */}
                        {!user && (
                            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8 animate-fade-in-up delay-300">
                                <button
                                    onClick={handleStartDetection}
                                    className="w-full sm:w-auto group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg overflow-hidden transition-all hover:shadow-[0_0_40px_rgba(37,99,235,0.4)]"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        Start Detection
                                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </span>
                                </button>
                                <Link
                                    to="/login"
                                    className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 hover:border-white/40 text-white font-semibold rounded-lg transition-all hover:bg-white/5 text-center"
                                >
                                    Access Console
                                </Link>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* --- LOGGED IN CONTENT: Action Cards (For ALL roles) --- */}
            {user ? (
                <div className="animate-fade-in-up delay-300 pb-20">
                    <UserActionCards />
                </div>
            ) : (
                /* --- GUEST CONTENT: Marketing Sections --- */
                <>
                    {/* --- HOW IT WORKS SECTION --- */}
                    <HowItWorks />

                    {/* --- STATISTICS SECTION --- */}
                    <StatisticsSection />
                </>
            )}

            {!user && <Footer />}

            {/* Scroll To Top Button (Guest Only) */}
            {!user && (
                <button
                    onClick={scrollToTop}
                    className={`fixed bottom-8 right-8 z-50 bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-full shadow-lg transition-all transform duration-300 ${showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
                    aria-label="Scroll to top"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                </button>
            )}

        </div>
    );
};

export default LandingPage;
