import React, { useState } from 'react';
import {
    User,
    Briefcase,
    AlignLeft,
    PenTool,
    FileText,
    Settings2,
    Loader2,
    Copy,
    Download,
    RefreshCcw,
    Wand2
} from 'lucide-react';

const CoverLetterGenerator = () => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [generatedLetter, setGeneratedLetter] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        linkedin: '',
        jobTitle: '',
        companyName: '',
        companyLocation: '',
        jobDescription: '',
        skills: '',
        experience: '',
        tone: 'Professional',
        length: 'Medium'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const [errorMsg, setErrorMsg] = useState('');
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(generatedLetter);
        } else {
            const ta = document.createElement('textarea');
            ta.value = generatedLetter;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.focus();
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleGenerate = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        setIsGenerating(true);
        setErrorMsg('');
        try {
            const response = await fetch('/api/cover-letter/preview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    full_name: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    linkedin: formData.linkedin,
                    job_title: formData.jobTitle,
                    company_name: formData.companyName,
                    company_location: formData.companyLocation,
                    job_description: formData.jobDescription,
                    skills: formData.skills,
                    experience: formData.experience,
                    tone: formData.tone,
                    length: formData.length,
                }),
            });
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.detail || 'Server error');
            }
            const data = await response.json();
            setGeneratedLetter(data.generated_letter);
        } catch (err) {
            setErrorMsg(`Failed to generate cover letter: ${err.message}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownloadPDF = async () => {
        setIsDownloading(true);
        setErrorMsg('');
        try {
            const response = await fetch('/api/cover-letter/download', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    full_name: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    linkedin: formData.linkedin,
                    job_title: formData.jobTitle,
                    company_name: formData.companyName,
                    company_location: formData.companyLocation,
                    job_description: formData.jobDescription,
                    skills: formData.skills,
                    experience: formData.experience,
                    tone: formData.tone,
                    length: formData.length,
                }),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.detail || 'Server error');
            }

            const blob = await response.blob();
            const fileUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = fileUrl;
            link.download = `CoverLetter_${formData.fullName.replace(/\s+/g, '_') || 'Generated'}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            setErrorMsg(`Failed to download PDF: ${err.message}`);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto space-y-8 animate-fade-in pb-12">
            <div className="text-center space-y-2 mt-8">
                <h1 className="text-4xl font-bold text-slate-800 tracking-tight">AI Cover Letter Generator</h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                    Generate customized, job-specific cover letters powered by AI.
                </p>
            </div>

            {errorMsg && (
                <div className="max-w-7xl mx-auto px-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    ⚠️ {errorMsg}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Side: Input Form */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
                    <form onSubmit={handleGenerate} className="space-y-6">

                        {/* Section 1: Personal Details */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                                <User className="w-5 h-5 text-blue-500" />
                                Personal Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" placeholder="John Doe" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" placeholder="john@example.com" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" placeholder="+1 (555) 000-0000" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn URL <span className="text-slate-400 font-normal">(Optional)</span></label>
                                    <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" placeholder="linkedin.com/in/johndoe" />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Job Details */}
                        <div className="space-y-4 pt-4">
                            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                                <Briefcase className="w-5 h-5 text-blue-500" />
                                Job Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
                                    <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" placeholder="Software Engineer" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                                    <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" placeholder="Tech Innovations Inc." required />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Company Location <span className="text-slate-400 font-normal">(Optional)</span></label>
                                    <input type="text" name="companyLocation" value={formData.companyLocation} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" placeholder="San Francisco, CA" />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Job Description */}
                        <div className="space-y-4 pt-4">
                            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                                <AlignLeft className="w-5 h-5 text-blue-500" />
                                Job Description
                            </h2>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Job Details</label>
                                <textarea name="jobDescription" value={formData.jobDescription} onChange={handleChange} rows="4" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow resize-none" placeholder="Paste the job description here for better personalization. This is important for AI customization." required></textarea>
                            </div>
                        </div>

                        {/* Section 4: Key Skills */}
                        <div className="space-y-4 pt-4">
                            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                                <Settings2 className="w-5 h-5 text-blue-500" />
                                Key Skills
                            </h2>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Relevant Skills</label>
                                <textarea name="skills" value={formData.skills} onChange={handleChange} rows="2" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow resize-none" placeholder="Example: Python, React, Machine Learning, Data Analysis"></textarea>
                            </div>
                        </div>

                        {/* Section 5: Experience Summary */}
                        <div className="space-y-4 pt-4">
                            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                                <PenTool className="w-5 h-5 text-blue-500" />
                                Experience Summary
                            </h2>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Experience Overview</label>
                                <textarea name="experience" value={formData.experience} onChange={handleChange} rows="3" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow resize-none" placeholder="Briefly describe your experience and achievements."></textarea>
                            </div>
                        </div>

                        {/* Smart Features */}
                        <div className="space-y-4 pt-4">
                            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                                <Wand2 className="w-5 h-5 text-blue-500" />
                                Cover Letter Preferences
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Tone</label>
                                    <select name="tone" value={formData.tone} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow bg-white text-slate-700 cursor-pointer">
                                        <option value="Professional">Professional</option>
                                        <option value="Confident">Confident</option>
                                        <option value="Enthusiastic">Enthusiastic</option>
                                        <option value="Formal">Formal</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Length</label>
                                    <select name="length" value={formData.length} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow bg-white text-slate-700 cursor-pointer">
                                        <option value="Short">Short</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Detailed">Detailed</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isGenerating}
                            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm shadow-blue-600/20 hover:shadow-md hover:shadow-blue-600/40 transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Wand2 className="w-5 h-5" />
                                    Generate Cover Letter
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Right Side: Generated Preview */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 flex flex-col h-full min-h-[500px]">
                    <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-6 border-b border-slate-100 pb-2">
                        <FileText className="w-5 h-5 text-blue-500" />
                        Generated Preview
                    </h2>

                    {generatedLetter ? (
                        <div className="flex-grow flex flex-col">
                            <div className="flex-grow p-6 bg-slate-50 border border-slate-200 rounded-lg whitespace-pre-wrap text-slate-800 text-sm md:text-base leading-relaxed overflow-y-auto max-h-[600px] shadow-inner font-serif">
                                {generatedLetter}
                            </div>

                            <div className="flex flex-wrap gap-3 mt-6">
                                <button className="flex-1 py-2 px-4 bg-white border border-slate-300 hover:border-blue-500 hover:text-blue-600 text-slate-700 font-medium rounded-lg shadow-sm transition-all flex items-center justify-center gap-2" onClick={handleCopy}>
                                    <Copy className="w-4 h-4" />
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                                <button
                                    onClick={handleDownloadPDF}
                                    disabled={!generatedLetter || isDownloading}
                                    className={`flex-1 py-2 px-4 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 font-medium ${(!generatedLetter || isDownloading) ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-200' : 'bg-white border border-slate-300 hover:border-blue-500 hover:text-blue-600 text-slate-700'}`}
                                >
                                    {isDownloading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" /> Fetching
                                        </>
                                    ) : (
                                        <>
                                            <Download className="w-4 h-4" /> PDF
                                        </>
                                    )}
                                </button>
                                <button onClick={handleGenerate} className="flex-1 py-2 px-4 bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 font-medium rounded-lg shadow-sm transition-all flex items-center justify-center gap-2">
                                    <RefreshCcw className="w-4 h-4" />
                                    Regenerate
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-grow flex flex-col items-center justify-center text-slate-400 p-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                            <FileText className="w-16 h-16 text-slate-300 mb-4" />
                            <p className="text-center font-medium text-slate-500">Your cover letter will appear here</p>
                            <p className="text-center text-sm mt-2 max-w-xs">Fill out the details on the left and click 'Generate Cover Letter' to create a customized professional letter.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CoverLetterGenerator;
