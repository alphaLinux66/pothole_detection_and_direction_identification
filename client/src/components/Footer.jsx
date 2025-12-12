import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="w-full bg-[#030712] border-t border-white/5 py-8 relative z-10">
            <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                {/* Logo */}
                <Link to="/" className="text-xl font-black tracking-tighter italic flex items-center gap-2 group">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 group-hover:from-blue-300 group-hover:to-purple-400 transition-all">
                        PD
                    </span>
                    <span className="text-white group-hover:text-blue-200 transition-colors">
                        SYSTEM
                    </span>
                </Link>

                {/* Copyright */}
                <p className="text-slate-500 text-sm font-medium">
                    &copy; 2024 PD System. Building safer roads through AI innovation.
                </p>

                {/* Links */}
                <div className="flex items-center gap-8">
                    {['Privacy', 'Terms', 'Contact'].map((item) => (
                        <a
                            key={item}
                            href="#"
                            className="text-slate-500 hover:text-white text-sm font-medium transition-colors"
                        >
                            {item}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
};

export default Footer;
