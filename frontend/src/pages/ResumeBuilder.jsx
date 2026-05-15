import React, { useState } from 'react';
import { Plus, Trash2, Cpu, Download } from 'lucide-react';

const ResumeBuilder = () => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    // Form State
    const [personalInfo, setPersonalInfo] = useState({
        fullName: '', email: '', phone: '', linkedin: '', github: ''
    });
    const [professionalSummary, setProfessionalSummary] = useState('');
    
    const [education, setEducation] = useState([
        { id: 1, degree: '', university: '', gradYear: '', cgpa: '' }
    ]);
    const [skills, setSkills] = useState('');

    const [projects, setProjects] = useState([
        { id: 1, title: '', description: '', technologies: '' }
    ]);
    const [experience, setExperience] = useState([
        { id: 1, company: '', role: '', duration: '', description: '' }
    ]);

    // Handlers for dynamic sections
    const addEducation = () => setEducation([...education, { id: Date.now(), degree: '', university: '', gradYear: '', cgpa: '' }]);
    const removeEducation = (id) => setEducation(education.filter(e => e.id !== id));
    const updateEducation = (id, field, value) => {
        setEducation(education.map(e => e.id === id ? { ...e, [field]: value } : e));
    };

    const addProject = () => setProjects([...projects, { id: Date.now(), title: '', description: '', technologies: '' }]);
    const removeProject = (id) => setProjects(projects.filter(p => p.id !== id));
    const updateProject = (id, field, value) => {
        setProjects(projects.map(p => p.id === id ? { ...p, [field]: value } : p));
    };

    const addExperience = () => setExperience([...experience, { id: Date.now(), company: '', role: '', duration: '', description: '' }]);
    const removeExperience = (id) => setExperience(experience.filter(e => e.id !== id));
    const updateExperience = (id, field, value) => {
        setExperience(experience.map(e => e.id === id ? { ...e, [field]: value } : e));
    };

    const [errorMsg, setErrorMsg] = useState('');
    const [generatedResume, setGeneratedResume] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);

    // AI ATS States
    const [jobDescription, setJobDescription] = useState('');
    const [atsScore, setAtsScore] = useState(null);
    const [missingSkills, setMissingSkills] = useState([]);

    const handleGenerate = async () => {
        setIsGenerating(true);
        setErrorMsg('');
        try {
            const response = await fetch('http://localhost:8000/api/resume/preview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    personal_info: personalInfo,
                    professional_summary: professionalSummary,
                    education: education,
                    skills: skills,
                    projects: projects,
                    experience: experience,
                    job_description: jobDescription,
                }),
            });
            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.detail || 'Server error');
            }

            const data = await response.json();
            setGeneratedResume(data.generated_resume);
            setAtsScore(data.ats_score);
            setMissingSkills(data.missing_skills || []);

            setShowPreview(true);
            setTimeout(() => {
                document.getElementById('resume-preview')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } catch (err) {
            setErrorMsg(`Failed to generate resume preview: ${err.message}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownloadPDF = async () => {
        setIsDownloading(true);
        setErrorMsg('');
        try {
            const response = await fetch('http://localhost:8000/api/resume/download', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    personal_info: personalInfo,
                    professional_summary: professionalSummary,
                    education: education,
                    skills: skills,
                    projects: projects,
                    experience: experience,
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
            link.download = `Resume_${personalInfo.fullName.replace(/\s+/g, '_') || 'Generated'}.pdf`;
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
        <div className="w-full max-w-5xl mx-auto py-10 px-4 sm:px-6">

            {/* Page Header */}
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">AI Resume Builder</h1>
                <p className="text-slate-500 text-lg">Enter your details below to generate a professional resume.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-12">
                <div className="p-6 md:p-8 space-y-10">

                    {/* Section 1: Personal Information */}
                    <section>
                        <h2 className="text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-6">1. Personal Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                <input type="text" className="w-full rounded-md border border-slate-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow" placeholder="John Doe" value={personalInfo.fullName} onChange={e => setPersonalInfo({ ...personalInfo, fullName: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                <input type="email" className="w-full rounded-md border border-slate-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow" placeholder="john@example.com" value={personalInfo.email} onChange={e => setPersonalInfo({ ...personalInfo, email: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                                <input type="tel" className="w-full rounded-md border border-slate-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow" placeholder="+1 (234) 567-8900" value={personalInfo.phone} onChange={e => setPersonalInfo({ ...personalInfo, phone: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn URL</label>
                                <input type="url" className="w-full rounded-md border border-slate-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow" placeholder="linkedin.com/in/johndoe" value={personalInfo.linkedin} onChange={e => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">GitHub URL</label>
                                <input type="url" className="w-full rounded-md border border-slate-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow" placeholder="github.com/johndoe" value={personalInfo.github} onChange={e => setPersonalInfo({ ...personalInfo, github: e.target.value })} />
                            </div>
                        </div>
                    </section>

                    {/* Section 1.5: Professional Summary */}
                    <section>
                        <h2 className="text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-6">2. Professional Summary</h2>
                        <div className="mb-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Summary <span className="text-slate-400 text-xs font-normal">(Optional - Leave blank to auto-generate using AI)</span></label>
                            <textarea
                                rows="3"
                                className="w-full rounded-md border border-slate-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                placeholder="Write a brief professional summary highlighting your top skills and experience, or leave it blank and we'll write one for you!"
                                value={professionalSummary} onChange={e => setProfessionalSummary(e.target.value)}
                            ></textarea>
                        </div>
                    </section>

                    {/* Section 2: Education */}
                    <section>
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-6">
                            <h2 className="text-xl font-semibold text-slate-800">3. Education</h2>
                            <button onClick={addEducation} className="text-sm flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium">
                                <Plus className="w-4 h-4" /> Add Education
                            </button>
                        </div>
                        <div className="space-y-6">
                            {education.map((edu, index) => (
                                <div key={edu.id} className="p-5 border border-slate-200 rounded-lg bg-slate-50 relative group transition-all hover:border-blue-200">
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => removeEducation(edu.id)} className="text-slate-400 hover:text-red-500 p-1" title="Remove Education">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Degree</label>
                                            <input type="text" className="w-full rounded-md border border-slate-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="B.S. Computer Science" value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">University</label>
                                            <input type="text" className="w-full rounded-md border border-slate-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Stanford University" value={edu.university} onChange={e => updateEducation(edu.id, 'university', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Graduation Year</label>
                                            <input type="text" className="w-full rounded-md border border-slate-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="2026" value={edu.gradYear} onChange={e => updateEducation(edu.id, 'gradYear', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">CGPA (optional)</label>
                                            <input type="text" className="w-full rounded-md border border-slate-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="3.8/4.0" value={edu.cgpa} onChange={e => updateEducation(edu.id, 'cgpa', e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Section 3: Skills & Job Description (AI) */}
                    <section>
                        <h2 className="text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-6">3. Skills</h2>
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Technical Skills</label>
                            <textarea
                                rows="3"
                                className="w-full rounded-md border border-slate-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                placeholder="Example: Python, Machine Learning, SQL, Data Structures..."
                                value={skills} onChange={e => setSkills(e.target.value)}
                            ></textarea>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1 text-purple-700">
                                <Cpu className="w-4 h-4" /> Target Job Description <span className="text-slate-400 text-xs font-normal">(Optional ATS Analysis)</span>
                            </label>
                            <textarea
                                rows="4"
                                className="w-full rounded-md border border-slate-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none bg-purple-50/30"
                                placeholder="Paste the job description here to analyze ATS compatibility (optional)"
                                value={jobDescription} onChange={e => setJobDescription(e.target.value)}
                            ></textarea>
                        </div>
                    </section>

                    {/* Section 4: Projects */}
                    <section>
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-6">
                            <h2 className="text-xl font-semibold text-slate-800">4. Projects</h2>
                            <button type="button" onClick={addProject} className="text-sm text-blue-600 font-medium hover:text-blue-800 flex items-center gap-1 transition-colors">
                                <Plus className="w-4 h-4" /> Add Project
                            </button>
                        </div>

                        <div className="space-y-6">
                            {projects.map((proj, index) => (
                                <div key={proj.id} className="relative bg-slate-50 p-5 rounded-lg border border-slate-100">
                                    {projects.length > 1 && (
                                        <button onClick={() => removeProject(proj.id)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 transition-colors" title="Remove Project">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )}
                                    <div className="grid grid-cols-1 gap-4 mb-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Project Title</label>
                                            <input type="text" className="w-full rounded-md border border-slate-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="E-commerce Website" value={proj.title} onChange={e => updateProject(proj.id, 'title', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Technologies Used</label>
                                            <input type="text" className="w-full rounded-md border border-slate-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="React, Node.js, MongoDB" value={proj.technologies} onChange={e => updateProject(proj.id, 'technologies', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Project Description</label>
                                            <textarea rows="3" className="w-full rounded-md border border-slate-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Describe your project, your role, and the outcomes..." value={proj.description} onChange={e => updateProject(proj.id, 'description', e.target.value)}></textarea>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Section 5: Experience */}
                    <section>
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-6">
                            <h2 className="text-xl font-semibold text-slate-800">5. Experience <span className="text-slate-400 text-sm font-normal">(Optional)</span></h2>
                            <button type="button" onClick={addExperience} className="text-sm text-blue-600 font-medium hover:text-blue-800 flex items-center gap-1 transition-colors">
                                <Plus className="w-4 h-4" /> Add Experience
                            </button>
                        </div>

                        <div className="space-y-6">
                            {experience.map((exp) => (
                                <div key={exp.id} className="relative bg-slate-50 p-5 rounded-lg border border-slate-100">
                                    {experience.length > 1 && (
                                        <button onClick={() => removeExperience(exp.id)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 transition-colors" title="Remove Experience">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                                            <input type="text" className="w-full rounded-md border border-slate-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Tech Innovations Inc." value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                                            <input type="text" className="w-full rounded-md border border-slate-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Software Engineer Intern" value={exp.role} onChange={e => updateExperience(exp.id, 'role', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Duration</label>
                                            <input type="text" className="w-full rounded-md border border-slate-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="June 2025 - Aug 2025" value={exp.duration} onChange={e => updateExperience(exp.id, 'duration', e.target.value)} />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                            <textarea rows="3" className="w-full rounded-md border border-slate-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" placeholder="Describe your responsibilities and achievements..." value={exp.description} onChange={e => updateExperience(exp.id, 'description', e.target.value)}></textarea>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                </div>

                {/* Generate Button Footer */}
                <div className="bg-slate-50 px-6 py-6 border-t border-slate-200">
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="w-full md:w-auto md:min-w-[300px] mx-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-8 rounded-lg transition-colors text-lg shadow-md hover:shadow-lg"
                    >
                        {isGenerating ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating Resume...
                            </>
                        ) : (
                            <>
                                <Cpu className="w-5 h-5" /> Generate Resume with AI
                            </>
                        )}
                    </button>
                </div>
                {/* Error Banner */}
                {errorMsg && (
                    <div className="mx-6 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        ⚠️ {errorMsg}
                    </div>
                )}
            </div>

            {/* Resume Preview Section */}
            {showPreview && generatedResume && (
                <div id="resume-preview" className="mt-16 animate-in fade-in slide-in-from-bottom-8 duration-500">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-slate-800">Your Generated Resume</h2>
                        <button
                            onClick={handleDownloadPDF}
                            disabled={!generatedResume || isDownloading}
                            className={`flex items-center gap-2 font-medium py-2 px-4 rounded-md transition-colors shadow-sm ${(!generatedResume || isDownloading) ? 'bg-slate-400 cursor-not-allowed text-white' : 'bg-slate-800 hover:bg-slate-900 text-white'}`}
                        >
                            {isDownloading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Generating PDF...
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4" /> Download PDF
                                </>
                            )}
                        </button>
                    </div>

                    {/* AI ATS Insights Banner */}
                    {atsScore !== null && (
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 p-6 rounded-lg mb-6 shadow-sm w-full max-w-[850px] mx-auto animate-in fade-in duration-700">
                            <h3 className="text-lg font-bold text-indigo-900 mb-3 flex items-center gap-2">
                                <Cpu className="w-5 h-5 text-indigo-600" /> ATS Match Analyzer
                            </h3>
                            <div className="flex flex-col md:flex-row gap-6 md:items-start">
                                <div className="bg-white px-5 py-4 rounded-md shadow-sm border border-indigo-50 flex flex-col items-center justify-center min-w-[140px]">
                                    <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Match Score</span>
                                    <span className={`text-4xl font-black ${atsScore >= 80 ? 'text-green-600' : atsScore >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                                        {atsScore}%
                                    </span>
                                </div>
                                
                                <div className="flex-1 flex flex-col gap-4">
                                    <div className={`px-4 py-3 rounded-md border font-medium ${
                                        atsScore >= 80 ? 'bg-green-50 text-green-700 border-green-100' :
                                        atsScore >= 60 ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                        atsScore >= 40 ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                        'bg-red-50 text-red-700 border-red-100'
                                    }`}>
                                        {atsScore >= 80 ? "🎉 Excellent! Your resume strongly matches the job description." :
                                         atsScore >= 60 ? "👍 Good match. Your resume aligns well with the job requirements." :
                                         atsScore >= 40 ? "⚠️ Moderate match. Consider adding more relevant skills." :
                                         "🚨 Low match. Your resume may not align well with the job description."}
                                    </div>
                                    
                                    {missingSkills && missingSkills.length > 0 && (
                                        <div>
                                            <p className="font-semibold text-slate-700 mb-2">Suggested Skills to Add:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {missingSkills.map((skill, i) => (
                                                    <span key={i} className="px-3 py-1 bg-white border border-rose-200 text-rose-700 text-sm rounded-full shadow-sm capitalize">
                                                        + {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Highly Styled Resume Preview */}
                    <div className="bg-white p-10 md:p-14 rounded-lg shadow-xl border border-slate-200 w-full max-w-[850px] mx-auto text-slate-800 font-sans leading-relaxed">

                        {/* HEADER */}
                        <div className="text-center border-b-2 border-slate-800 pb-4 mb-6">
                            <h1 className="text-4xl font-bold uppercase tracking-widest text-slate-900 mb-2">
                                {personalInfo.fullName || 'Your Name'}
                            </h1>
                            <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-slate-600">
                                {personalInfo.email && <span>{personalInfo.email}</span>}
                                {(personalInfo.email && personalInfo.phone) && <span>|</span>}
                                {personalInfo.phone && <span>{personalInfo.phone}</span>}
                                {(personalInfo.phone && personalInfo.linkedin) && <span>|</span>}
                                {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
                                {(personalInfo.linkedin && personalInfo.github) && <span>|</span>}
                                {personalInfo.github && <span>{personalInfo.github}</span>}
                            </div>
                        </div>

                        <div className="space-y-6 text-sm">
                            
                            {/* PROFESSIONAL SUMMARY */}
                            {(professionalSummary || (generatedResume && generatedResume.professional_summary)) && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-300 mb-3 uppercase tracking-wider pb-1">Summary</h3>
                                    <p className="text-slate-700 leading-relaxed text-justify">
                                        {professionalSummary || (generatedResume && generatedResume.professional_summary)}
                                    </p>
                                </div>
                            )}

                            {/* EDUCATION */}
                            {education.some(e => e.degree || e.university) && (
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-300 mb-3 uppercase tracking-wider pb-1">Education</h3>
                                    <div className="space-y-4">
                                        {education.map(edu => {
                                            if (!edu.degree && !edu.university) return null;
                                            return (
                                                <div key={`prev-edu-${edu.id}`} className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-bold text-slate-800">{edu.university || 'University Name'}</p>
                                                        <p className="italic text-slate-600">{edu.degree}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-slate-700">{edu.gradYear}</p>
                                                        {edu.cgpa && <p className="text-slate-600 text-xs mt-1">CGPA: {edu.cgpa}</p>}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* SKILLS */}
                            {skills && (
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-300 mb-3 uppercase tracking-wider pb-1">Technical Skills</h3>
                                    <p className="text-slate-700 leading-relaxed break-words">
                                        {skills}
                                    </p>
                                </div>
                            )}

                            {/* EXPERIENCE */}
                            {experience.some(e => e.company || e.role) && (
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-300 mb-3 uppercase tracking-wider pb-1">Professional Experience</h3>
                                    <div className="space-y-4">
                                        {experience.map(exp => {
                                            if (!exp.company && !exp.role) return null;
                                            return (
                                                <div key={`prev-exp-${exp.id}`}>
                                                    <div className="flex justify-between items-baseline mb-1">
                                                        <p className="font-bold text-slate-800">{exp.role || 'Role Title'}</p>
                                                        <p className="font-bold text-slate-600">{exp.duration}</p>
                                                    </div>
                                                    <p className="text-slate-700 italic mb-2">{exp.company || 'Company Name'}</p>
                                                    {exp.description && (
                                                        <p className="text-slate-700 leading-relaxed whitespace-pre-line ml-4">
                                                            {exp.description.split('\n').filter(b => b.trim()).map((b, i) => (
                                                                <span key={i} className="block mb-1">• {b.replace(/^•\s*/, '')}</span>
                                                            ))}
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* PROJECTS */}
                            {projects.some(p => p.title) && (
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-300 mb-3 uppercase tracking-wider pb-1">Projects</h3>
                                    <div className="space-y-4">
                                        {projects.map(proj => {
                                            if (!proj.title) return null;
                                            return (
                                                <div key={`prev-proj-${proj.id}`}>
                                                    <div className="flex items-baseline gap-2 mb-1">
                                                        <p className="font-bold text-slate-800">{proj.title}</p>
                                                        {proj.technologies && <span className="text-xs text-slate-500">[{proj.technologies}]</span>}
                                                    </div>
                                                    {proj.description && (
                                                        <p className="text-slate-700 leading-relaxed whitespace-pre-line ml-4">
                                                            {proj.description.split('\n').filter(b => b.trim()).map((b, i) => (
                                                                <span key={i} className="block mb-1">• {b.replace(/^•\s*/, '')}</span>
                                                            ))}
                                                        </p>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default ResumeBuilder;
