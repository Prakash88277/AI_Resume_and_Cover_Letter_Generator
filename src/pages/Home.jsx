import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileDown, PenTool, ArrowRight } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <div className="text-center mb-16 space-y-4">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                    Supercharge your <span className="text-blue-600">Career Profile</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
                    Create standout, ATS-friendly resumes and tailored cover letters in minutes with the power of Artificial Intelligence.
                </p>
            </div>

            {/* Feature Cards Section */}
            <div className="grid md:grid-cols-2 gap-8 w-full">
                {/* Card 1: Resume Builder */}
                <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl border border-slate-200 transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">
                    <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                        <FileDown className="w-7 h-7 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-3">AI Resume Builder</h2>
                    <p className="text-slate-500 leading-relaxed mb-8 flex-grow">
                        Build a professional, ATS-friendly resume in minutes using AI assistance. Optimize your skills and experience to get noticed by recruiters.
                    </p>
                    <button
                        onClick={() => navigate('/resume-builder')}
                        className="w-full group bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        Start Building Resume
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {/* Card 2: Cover Letter Generator */}
                <div className="bg-slate-50 rounded-2xl p-8 shadow-sm border border-slate-200 transition-all duration-300 flex flex-col h-full opacity-80">
                    <div className="w-14 h-14 bg-slate-200 rounded-xl flex items-center justify-center mb-6">
                        <PenTool className="w-7 h-7 text-slate-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-700 mb-3">Cover Letter Generator</h2>
                    <p className="text-slate-500 leading-relaxed mb-8 flex-grow">
                        Generate customized cover letters tailored to specific job descriptions. Our AI crafts a persuasive narrative highlighting your unique strengths.
                    </p>
                    <button
                        disabled
                        className="w-full bg-slate-200 text-slate-400 font-medium py-3 px-6 rounded-lg cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        Coming Soon
                    </button>
                </div>
            </div>

            {/* Decorative / Info Section */}
            <div className="mt-20 text-center">
                <p className="text-sm font-medium text-slate-400 tracking-wider uppercase mb-4">Trusted by students & job seekers</p>
                <div className="flex flex-wrap justify-center gap-8 opacity-40 grayscale">
                    {/* Mock company logos or text could go here, for now just decorative dots/badges */}
                    <div className="h-8 md:h-10 text-xl font-bold text-slate-300">Google</div>
                    <div className="h-8 md:h-10 text-xl font-bold text-slate-300">Microsoft</div>
                    <div className="h-8 md:h-10 text-xl font-bold text-slate-300">Amazon</div>
                    <div className="h-8 md:h-10 text-xl font-bold text-slate-300">Meta</div>
                </div>
            </div>
        </div>
    );
};

export default Home;
