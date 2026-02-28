import React, { useState } from 'react';
import { Plus, Trash2, Cpu, Download } from 'lucide-react';

const ResumeBuilder = () => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    // Form State
    const [personalInfo, setPersonalInfo] = useState({
        fullName: '', email: '', phone: '', linkedin: '', github: ''
    });
    const [education, setEducation] = useState({
        degree: '', university: '', gradYear: '', cgpa: ''
    });
    const [skills, setSkills] = useState('');

    const [projects, setProjects] = useState([
        { id: 1, title: '', description: '', technologies: '' }
    ]);
    const [experience, setExperience] = useState([
        { id: 1, company: '', role: '', duration: '', description: '' }
    ]);

    // Handlers for dynamic sections
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

    const handleGenerate = () => {
        setIsGenerating(true);
        // Simulate AI processing time
        setTimeout(() => {
            setIsGenerating(false);
            setShowPreview(true);
            // Scroll to preview somewhat nicely
            setTimeout(() => {
                document.getElementById('resume-preview')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }, 2000);
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

                    {/* Section 2: Education */}
                    <section>
                        <h2 className="text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-6">2. Education</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Degree</label>
                                <input type="text" className="w-full rounded-md border border-slate-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="B.S. Computer Science" value={education.degree} onChange={e => setEducation({ ...education, degree: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">University</label>
                                <input type="text" className="w-full rounded-md border border-slate-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Stanford University" value={education.university} onChange={e => setEducation({ ...education, university: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Graduation Year</label>
                                <input type="text" className="w-full rounded-md border border-slate-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="2026" value={education.gradYear} onChange={e => setEducation({ ...education, gradYear: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">CGPA (optional)</label>
                                <input type="text" className="w-full rounded-md border border-slate-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="3.8/4.0" value={education.cgpa} onChange={e => setEducation({ ...education, cgpa: e.target.value })} />
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Skills */}
                    <section>
                        <h2 className="text-xl font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-6">3. Skills</h2>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Technical Skills</label>
                            <textarea
                                rows="3"
                                className="w-full rounded-md border border-slate-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                placeholder="Example: Python, Machine Learning, SQL, Data Structures..."
                                value={skills} onChange={e => setSkills(e.target.value)}
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
            </div>

            {/* Resume Preview Section */}
            {showPreview && (
                <div id="resume-preview" className="mt-16 animate-in fade-in slide-in-from-bottom-8 duration-500">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-slate-800">Your Generated Resume</h2>
                        <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-medium py-2 px-4 rounded-md transition-colors shadow-sm">
                            <Download className="w-4 h-4" /> Download PDF
                        </button>
                    </div>

                    {/* Printable Resume Canvas */}
                    <div className="bg-white p-10 md:p-14 rounded-lg shadow-xl border border-slate-200 aspect-[8.5/11] max-w-4xl mx-auto text-slate-800 font-sans">

                        {/* Template Header */}
                        <div className="text-center mb-8 border-b-2 border-slate-800 pb-6">
                            <h1 className="text-4xl font-bold uppercase tracking-wide text-slate-900 mb-2">
                                {personalInfo.fullName || 'John Doe'}
                            </h1>
                            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-slate-600">
                                {personalInfo.email && <span>{personalInfo.email}</span>}
                                {(personalInfo.email && personalInfo.phone) && <span>|</span>}
                                {personalInfo.phone && <span>{personalInfo.phone}</span>}
                                {(personalInfo.phone && personalInfo.linkedin) && <span>|</span>}
                                {personalInfo.linkedin && <span>{personalInfo.linkedin}</span>}
                                {(personalInfo.linkedin && personalInfo.github) && <span>|</span>}
                                {personalInfo.github && <span>{personalInfo.github}</span>}
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Template Education */}
                            {education.degree && (
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-300 mb-3 uppercase tracking-wider">Education</h3>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-slate-800">{education.university || 'University Name'}</p>
                                            <p className="italic text-slate-600">{education.degree}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-slate-700">{education.gradYear}</p>
                                            {education.cgpa && <p className="text-slate-600">CGPA: {education.cgpa}</p>}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Template Skills */}
                            {skills && (
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-300 mb-3 uppercase tracking-wider">Skills</h3>
                                    <p className="text-slate-700 leading-relaxed max-w-full break-words">
                                        {skills}
                                    </p>
                                </div>
                            )}

                            {/* Template Experience */}
                            {experience.some(e => e.company || e.role) && (
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-300 mb-3 uppercase tracking-wider">Experience</h3>
                                    <div className="space-y-4">
                                        {experience.map(exp => (
                                            <div key={`prev-exp-${exp.id}`}>
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <p className="font-semibold text-slate-800">{exp.role || 'Role Title'}</p>
                                                    <p className="text-sm font-medium text-slate-600">{exp.duration}</p>
                                                </div>
                                                <p className="text-slate-700 italic mb-2">{exp.company || 'Company Name'}</p>
                                                {exp.description && (
                                                    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line ml-4 border-l-2 border-slate-200 pl-3">
                                                        {exp.description}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Template Projects */}
                            {projects.some(p => p.title) && (
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 border-b border-slate-300 mb-3 uppercase tracking-wider">Projects</h3>
                                    <div className="space-y-4">
                                        {projects.map(proj => (
                                            <div key={`prev-proj-${proj.id}`}>
                                                <div className="flex items-baseline gap-2 mb-1">
                                                    <p className="font-semibold text-slate-800">{proj.title || 'Project Title'}</p>
                                                    {proj.technologies && <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded">{proj.technologies}</span>}
                                                </div>
                                                {proj.description && (
                                                    <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line ml-4 border-l-2 border-slate-200 pl-3">
                                                        {proj.description}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
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
