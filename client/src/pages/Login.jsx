import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth) * 2 - 1,
                y: (e.clientY / window.innerHeight) * 2 - 1
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(email, password);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="relative min-h-screen bg-[#030712] text-white overflow-hidden flex items-center justify-center p-4">

            {/* --- Ambient Background --- */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[100px] animate-pulse delay-1000" />

                {/* Radial Gradient Follows Mouse */}
                <div
                    className="absolute inset-0 opacity-40 transition-opacity duration-300"
                    style={{
                        background: `radial-gradient(circle at ${50 + mousePosition.x * 20}% ${50 + mousePosition.y * 20}%, rgba(59, 130, 246, 0.15), transparent 60%)`
                    }}
                />
            </div>

            {/* --- Login Card --- */}
            <div className="relative w-full max-w-md">
                {/* Glow Border */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>

                <form
                    onSubmit={handleSubmit}
                    className="relative bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-2xl shadow-2xl z-10"
                >
                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
                            Welcome Back
                        </h2>
                        <p className="text-slate-400 text-sm">Access the advanced detection system</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {error}
                        </div>
                    )}

                    <div className="space-y-5">
                        <div className="group">
                            <label className="block text-xs uppercase tracking-wider text-slate-500 mb-1 group-focus-within:text-blue-400 transition-colors">Email Address</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                                    placeholder="name@example.com"
                                    required
                                />
                                <div className="absolute right-3 top-3 text-slate-600">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                                </div>
                            </div>
                        </div>

                        <div className="group">
                            <label className="block text-xs uppercase tracking-wider text-slate-500 mb-1 group-focus-within:text-purple-400 transition-colors">Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                                <div className="absolute right-3 top-3 text-slate-600">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Initialize Login
                    </button>

                    <p className="mt-6 text-center text-slate-500 text-sm">
                        New to the system?{' '}
                        <span
                            onClick={() => navigate('/register')}
                            className="text-blue-400 cursor-pointer hover:text-blue-300 font-bold hover:underline"
                        >
                            Create Access ID
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
