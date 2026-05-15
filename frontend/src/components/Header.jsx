import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, Wand2 } from 'lucide-react';

const Header = () => {
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-blue-500 transition-colors';
    };

    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                <div className="flex flex-col">
                    <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-slate-800 hover:text-blue-600 transition-colors">
                        <Wand2 className="w-8 h-8 text-blue-600" />
                        <span>AI Resume & Cover Letter Generator</span>
                    </Link>
                    <span className="text-sm text-slate-500 hidden sm:block mt-1">
                        Generate professional resumes and cover letters powered by AI.
                    </span>
                </div>

                <nav className="hidden md:flex items-center gap-6 font-medium">
                    <Link to="/" className={isActive('/')}>Home</Link>
                    <Link to="/resume-builder" className={isActive('/resume-builder')}>AI Resume Builder</Link>
                    <Link to="/cover-letter-generator" className={isActive('/cover-letter-generator')}>
                        Cover Letter Generator
                    </Link>
                </nav>

                {/* Mobile Nav Button (Could be expanded later) */}
                <div className="md:hidden">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">Beta</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
