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
                <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl border border-slate-200 transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full">
                    <div className="w-14 h-14 bg-slate-200 rounded-xl flex items-center justify-center mb-6">
                        <PenTool className="w-7 h-7 text-slate-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-700 mb-3">Cover Letter Generator</h2>
                    <p className="text-slate-500 leading-relaxed mb-8 flex-grow">
                        Generate customized cover letters tailored to specific job descriptions. Our AI crafts a persuasive narrative highlighting your unique strengths.
                    </p>
                    <button
                        onClick={() => navigate('/cover-letter-generator')}
                        className="w-full group bg-slate-600 hover:bg-slate-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        Generate Cover Letter
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Home;
