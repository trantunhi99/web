'use client';

import { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { NeuralCanvas } from '@/components/3d/NeuralCanvas';
import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Terminal, Volume2, VolumeX } from 'lucide-react';

let audioCtx: AudioContext | null = null;
const playTechBeep = () => {
  if (typeof window === 'undefined') return;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(600 + Math.random() * 400, audioCtx.currentTime);
  
  gainNode.gain.setValueAtTime(0.015, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);
  
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + 0.03);
};

function TypewriterText({ text, isMuted }: { text: string, isMuted: boolean }) {
  const [displayedText, setDisplayedText] = useState('');
  const { setIsNarrating } = useStore();
  const mutedRef = useRef(isMuted);
  
  useEffect(() => {
    mutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    setDisplayedText('');
    setIsNarrating(true);
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      if (!mutedRef.current && (i % 2 === 0)) {
        playTechBeep();
      }
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setIsNarrating(false);
      }
    }, 12);
    
    return () => {
      clearInterval(interval);
      setIsNarrating(false);
    };
  }, [text, setIsNarrating]);

  return <>{displayedText}</>;
}

// ─── Skill bars ──────────────────────────────────────────────────────────────
const SKILLS = [
  { cat: 'Python / Data Science', pct: 92 },
  { cat: 'Data Visualization', pct: 88 },
  { cat: 'Machine Learning', pct: 78 },
  { cat: 'R / Bioinformatics', pct: 75 },
  { cat: 'Cloud / DevOps (AWS)', pct: 60 },
  { cat: 'SQL (In Progress)', pct: 45 },
];

const PROJECTS = [
  { title: 'Loki Interactive Inference Platform', sub: 'Full-Stack Deep Learning · Houston Methodist', tags: ['Dash', 'React', 'Deep Learning', 'LLM', 'Histopathology'], badge: 'Nature Methods ⭐' },
  { title: 'Mjolnir', sub: 'Gene Expression Viz Platform', tags: ['Dash', 'Plotly', 'Bioinformatics'], badge: 'Nature Communications' },
  { title: 'Visual–Omics', sub: 'Histology × Spatial Transcriptomics · 32 Organs', tags: ['ML', 'Data Curation', 'Python'], badge: 'Nature Methods' },
  { title: 'Macrophage Analysis', sub: 'Single-Cell Immune Clustering', tags: ['UMAP', 'Leiden', 'scRNA'], badge: 'Research' },
];

const PAPERS = [
  { journal: 'Nature Methods', year: '2025', title: 'A visual–omics foundation model to bridge histopathology with spatial transcriptomics', authors: 'Chen W., Zhang P., Tran T. N., et al.', doi: '10.1038/s41592-025-02707-1' },
  { journal: 'Nature Communications', year: '2025', title: 'Thor: a platform for cell-level investigation of spatial transcriptomics and histology', authors: 'Zhang P., Chen W., Tran T. N., et al.', doi: '10.1038/s41467-025-62593-1' },
];

const EXPERIENCES = [
  {
    title: 'Research Assistant',
    org: 'Houston Methodist — Dr. Guangyu Wang Lab',
    dept: 'Cardiovascular Regeneration Program',
    dates: 'Dec 2022 – Present',
    type: 'Research',
    highlights: [
      'Built data pipelines for large-scale single-cell and spatial omics datasets to support ML model development and evaluation',
      'Applied unsupervised learning and statistical analysis to identify patterns in high-dimensional biological data',
      'Assessed model predictions and validated outputs against biological signals for reliability and interpretability',
      'Developed interactive dashboards for visualization of model results by research teams',
      'Contributed to Nature Methods and Nature Communications publications',
    ],
  },
  {
    title: 'Marketing & Data Intern',
    org: 'Viet Power Solutions JSC',
    dept: 'Vietnam',
    dates: 'Jan 2022 – Aug 2022',
    type: 'Industry',
    highlights: [
      'Monitored digital engagement metrics with Google Analytics — +39.5% campaign performance improvement',
      'Designed and launched targeted LinkedIn, Facebook & Google Ads campaigns — +50% user engagement',
      'Produced clear, data-driven reports to inform leadership and refine product strategy',
    ],
  },
];

function SkillsPanel() {
  return (
    <div className="w-full px-4 sm:px-0 max-w-[95vw] md:w-96">
      <div className="text-blue-400 text-base tracking-wider font-bold mb-4 uppercase">Skills</div>
      {SKILLS.map((s, i) => (
        <div key={s.cat} className="mb-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-white/80">{s.cat}</span>
            <span className="text-blue-400">{s.pct}%</span>
          </div>
          <div className="h-[2px] bg-white/10 rounded">
            <motion.div
              className="h-full rounded"
              style={{ background: 'linear-gradient(90deg, #c8a06a, #ece3d2)', boxShadow: '0 0 6px #ece3d2' }}
              initial={{ width: 0 }}
              animate={{ width: `${s.pct}%` }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: 'easeOut' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function ProjectsPanel() {
  return (
    <div className="w-full px-4 sm:px-0 max-w-[95vw] md:w-[500px]">
      <div className="text-pink-500 text-base tracking-wider font-bold mb-4 uppercase">Projects</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {PROJECTS.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#170c11]/80 backdrop-blur-xl rounded-xl border border-white/10 p-4"
            style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}
          >
            <div className="flex justify-between items-start mb-1">
              <span className="text-white text-sm font-semibold">{p.title}</span>
              <span className="text-pink-400 text-[11px] px-2 py-0.5 bg-pink-500/10 rounded-full font-mono">{p.badge}</span>
            </div>
            <div className="text-white/70 text-sm mb-2">{p.sub}</div>
            <div className="flex flex-wrap gap-1">
              {p.tags.map(t => (
                <span key={t} className="text-[11px] px-2 py-0.5 bg-white/5 text-purple-400 rounded-full font-mono">{t}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function ResearchPanel() {
  return (
    <div className="w-full px-4 sm:px-0 max-w-[95vw] md:w-96">
      <div className="text-teal-400 text-base tracking-wider font-bold mb-4 uppercase">Publications</div>
      {PAPERS.map((p, i) => (
        <motion.div
          key={p.doi}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15 }}
          className="bg-[#170c11]/80 backdrop-blur-xl rounded-xl border border-white/10 p-5 mb-4"
          style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}
        >
          <div className="flex justify-between mb-2">
            <span className="text-teal-400 text-sm tracking-wider font-semibold">{p.journal}</span>
            <span className="text-teal-700 text-sm font-semibold">{p.year}</span>
          </div>
          <div className="text-white text-sm leading-relaxed mb-2">{p.title}</div>
          <div className="text-white/70 text-sm mb-2">{p.authors}</div>
          <a 
            href={`https://doi.org/${p.doi}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-teal-700/60 hover:text-teal-400 text-[9px] tracking-wider transition-colors inline-block cursor-pointer font-mono"
          >
            doi:{p.doi}
          </a>
        </motion.div>
      ))}
    </div>
  );
}

function ExperiencePanel() {
  return (
    <div className="w-full px-4 sm:px-0 max-w-[95vw] md:w-[460px]">
      <div className="text-blue-400 text-base tracking-wider font-bold mb-4 uppercase">Experience</div>
      {EXPERIENCES.map((exp, i) => (
        <motion.div
          key={exp.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15 }}
          className="bg-[#170c11]/80 backdrop-blur-xl rounded-xl border border-white/10 p-5 mb-4"
          style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}
        >
          <div className="flex justify-between items-start mb-1">
            <span className="text-white text-base font-semibold">{exp.title}</span>
            <span className="text-[11px] px-2 py-0.5 bg-blue-500/10 rounded-full text-blue-400 font-mono">{exp.type}</span>
          </div>
          <div className="text-blue-400 leading-relaxed text-sm mb-0.5">{exp.org}</div>
          <div className="text-white/50 text-[11px] mb-3">{exp.dept} · {exp.dates}</div>
          <ul className="space-y-1.5">
            {exp.highlights.map((h, j) => (
              <motion.li
                key={j}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 + j * 0.06 }}
                className="flex gap-2 text-white/80 text-sm leading-relaxed"
              >
                <span className="text-blue-700/50 flex-shrink-0 mt-0.5">▸</span>
                <span>{h}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}

const EDUCATION: { degree: string; school: string; dates: string; gpa: string; location: string; minors?: string[] }[] = [
  {
    degree: 'Master of Science in Engineering Data Science and AI',
    school: 'University of Houston, Cullen College of Engineering',
    dates: 'Expected January 2027',
    gpa: '3.63',
    location: 'Houston, TX',
  },
  {
    degree: 'Bachelor of Science in Mathematics',
    school: 'University of Massachusetts Lowell',
    dates: 'Aug 2017 – Aug 2021',
    gpa: '3.135',
    location: 'Lowell, MA',
    minors: ['Minor: Finance', "Dean's List 2020–2021"]
  }
];

function EducationPanel() {
  return (
    <div className="w-full px-4 sm:px-0 max-w-[95vw] md:w-[460px]">
      <div className="text-blue-400 text-base tracking-wider font-bold mb-4 uppercase">Education</div>
      {EDUCATION.map((edu, i) => (
        <motion.div
          key={edu.degree}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15 }}
          className="bg-[#170c11]/80 backdrop-blur-xl rounded-xl border border-white/10 p-5 mb-4"
          style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}
        >
          <div className="text-white text-base font-semibold mb-1 leading-tight">{edu.degree}</div>
          <div className="text-blue-400 text-sm mb-1">{edu.school}</div>
          <div className="flex justify-between items-center text-white/50 text-[11px] mb-3">
            <span>{edu.location}</span>
            <span>{edu.dates}</span>
          </div>
          <ul className="space-y-1.5 border-t border-white/5 pt-3 mt-1">
            <li className="flex gap-2 text-white/80 text-sm">
              <span className="text-blue-700/50 flex-shrink-0 mt-0.5">▸</span>
              <span><strong>GPA:</strong> {edu.gpa}</span>
            </li>
            {edu.minors?.map((m, j) => (
              <li key={j} className="flex gap-2 text-white/80 text-sm">
                <span className="text-blue-700/50 flex-shrink-0 mt-0.5">▸</span>
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}

function OverviewPanel() {
  const stats = [
    { label: 'Degree', value: 'MS Eng. Data Science & AI' },
    { label: 'School', value: 'Univ. of Houston' },
    { label: 'GPA', value: '3.63 / 4.0' },
    { label: 'Publications', value: '2 (Nature tier)' },
    { label: 'Current Role', value: 'Research Assistant' },
    { label: 'Status', value: 'Seeking Internship' },
  ];
  return (
    <div className="w-full px-4 sm:px-0 max-w-[95vw] md:w-[380px]">
      <div className="text-purple-400 text-base tracking-wider font-bold mb-1 uppercase">Overview</div>
      <div className="text-white text-2xl font-bold mb-1">Tu N. (Alex) Tran</div>
      <div className="text-white/70 text-sm mb-4 font-medium">Houston Methodist · UH Engineering</div>
      <div className="grid grid-cols-2 gap-2">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.07 }}
            className="bg-[#170c11]/60 backdrop-blur-md rounded-lg border border-white/5 p-3"
          >
            <div className="text-teal-600 text-[11px] uppercase font-semibold tracking-wider mb-1">{s.label}</div>
            <div className="text-white text-xs">{s.value}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function DataPanel({ mode }: { mode: string }) {
  const panels: Record<string, React.ReactNode> = {
    skills: <SkillsPanel />,
    projects: <ProjectsPanel />,
    research: <ResearchPanel />,
    experience: <ExperiencePanel />,
    education: <EducationPanel />,
    overview: <OverviewPanel />,
    role_fit: <OverviewPanel />,
  };
  return <>{panels[mode] ?? <OverviewPanel />}</>;
}

// ─── Main App ────────────────────────────────────────────────────────────────
export default function App() {
  const { narratorText, mode, isNarrating, updateStateFromAI, setCameraTarget } = useStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [isSoundMuted, setIsSoundMuted] = useState(true);
  const [hasAskedWho, setHasAskedWho] = useState(false);

  useEffect(() => {
    if (mode === 'overview') setCameraTarget([0, 0, 0]);
    else if (mode === 'projects') setCameraTarget([2, 0, 0]);
    else if (mode === 'skills') setCameraTarget([-2, -1, 0]);
    else if (mode === 'research') setCameraTarget([0, 2, 0]);
    else if (mode === 'experience') setCameraTarget([-2, 2, 0]);
    else if (mode === 'education') setCameraTarget([0, -2, 0]);
  }, [mode, setCameraTarget]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const query = input;
    setInput('');
    const userMessage = { role: 'user', content: query };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    if (query.toLowerCase().includes('who is alex')) setHasAskedWho(true);
    
    setIsLoading(true);
    setHasInteracted(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      
      setMessages([...newMessages, { role: 'assistant', content: data.content || 'Processing...' }]);
      let safeMode = 'overview';
      if (data.mode && typeof data.mode === 'string') {
        const lowerMode = data.mode.toLowerCase();
        if (lowerMode.includes('skill')) safeMode = 'skills';
        else if (lowerMode.includes('project')) safeMode = 'projects';
        else if (lowerMode.includes('research') || lowerMode.includes('paper')) safeMode = 'research';
        else if (lowerMode.includes('experience') || lowerMode.includes('work')) safeMode = 'experience';
        else if (lowerMode.includes('education') || lowerMode.includes('degree') || lowerMode.includes('school')) safeMode = 'education';
        else if (lowerMode.includes('role')) safeMode = 'role_fit';
        else safeMode = 'overview';
      }
      updateStateFromAI((safeMode as any), data.focusId || null, data.content || 'Processing...');
    } catch (err) {
      console.error(err);
      useStore.getState().setNarratorText('Network anomaly. Connection lost.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-[100dvh] bg-[#0a0609] overflow-hidden relative text-white">
      {/* WebGL Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <NeuralCanvas />
        </Canvas>
      </div>

      {/* UI Overlay — grid on mobile keeps input pinned, flex-col on desktop */}
      <div className="absolute inset-0 z-10 pointer-events-none grid grid-rows-[auto_1fr_auto] md:flex md:flex-col p-4 md:p-6 gap-3">
        {/* Header */}
        <div className="flex justify-between items-center text-base font-bold text-purple-400">
          <div className="flex items-center gap-2">
            <Terminal size={12} className="animate-pulse text-pink-500" />
            <span>Digital Assistant</span>
          </div>
          <div>Mode: <span className="text-teal-400">{mode}</span></div>
        </div>

        {/* Data + Narrator panels — row 2 fills remaining space */}
        <div className="flex flex-col md:flex-row md:flex-1 md:items-center gap-3 md:gap-8 min-h-0 w-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: -24, filter: 'blur(8px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -16, filter: 'blur(4px)' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="pointer-events-auto h-1/2 md:h-full flex-1 overflow-y-auto pr-4 md:pb-12"
              style={{ scrollbarWidth: 'none' }}
            >
              <DataPanel mode={mode} />
            </motion.div>
          </AnimatePresence>

          {/* Narration Text — right side terminal readout, always visible */}
          <AnimatePresence mode="wait">
            {narratorText && (
              <motion.div
                key={narratorText}
                initial={{ opacity: 0, x: 24, filter: 'blur(8px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: 16, filter: 'blur(4px)' }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="pointer-events-none md:ml-auto w-full md:max-w-sm h-1/2 md:h-full flex-1 min-h-0"
              >
                <div className="border border-white/10 flex flex-col h-full max-h-full min-h-0 py-2 bg-[#0a0609]/92 md:bg-transparent backdrop-blur-[48px] md:backdrop-blur-none rounded-xl md:rounded-none px-3 md:px-0 md:border-0 md:border-l md:border-white/10 md:pl-4">
                  <div className="flex items-center justify-between mb-3 flex-shrink-0 mt-2 md:mt-0">
                    <div className="text-purple-400 text-xs tracking-wider font-bold uppercase">System Narration</div>
                    <button 
                      onClick={() => setIsSoundMuted(!isSoundMuted)}
                      className="text-teal-700 hover:text-teal-400 transition-colors pointer-events-auto"
                      title={isSoundMuted ? "Unmute AI Voice" : "Mute AI Voice"}
                    >
                      {isSoundMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    </button>
                  </div>
                  <div className="overflow-y-auto pr-2 pointer-events-auto min-h-0 flex-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#ece3d2 transparent' }}>
                    <p className="text-white text-sm leading-relaxed whitespace-pre-wrap font-medium">
                      <TypewriterText text={narratorText} isMuted={isSoundMuted} />
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom bar — row 3, always visible */}
        <div className="pointer-events-auto space-y-2 max-w-xl mx-auto w-full">

          {/* Quick prompt chips */}
          <div className="flex flex-wrap gap-2 justify-center mb-1">
            {[
              'Who is Alex?',
              ...(hasAskedWho ? ['Show his projects'] : []),
              'What are his skills?',
              'Research & publications',
              'Work experience',
              'Education background'
            ].map((prompt) => (
              <button
                key={prompt}
                onClick={() => {
                  setInput(prompt);
                  // auto-submit
                  setTimeout(() => {
                    const form = document.getElementById('chat-form') as HTMLFormElement;
                    form?.requestSubmit();
                  }, 50);
                }}
                disabled={isLoading}
                className="text-[11px] uppercase font-semibold px-3 py-1.5 border border-white/10 rounded-full text-white/70 hover:border-blue-500/50 hover:text-blue-400 hover:bg-[#170c11]/80 transition-all disabled:opacity-30"
              >
                {prompt}
              </button>
            ))}
          </div>
          {isLoading && (
            <p className="text-purple-500/60 text-xs tracking-widest text-center animate-pulse">
              PROCESSING QUERY...
            </p>
          )}
          <form id="chat-form" onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              placeholder="Ask me anything... try 'projects', 'skills', 'research'..."
              className="w-full bg-[#170c11]/80 backdrop-blur-2xl border border-white/10 rounded-xl mb-4 text-white placeholder-white/30 px-4 py-3 focus:outline-none focus:border-pink-500/60 focus:ring-1 focus:ring-pink-500/30 transition-all text-sm shadow-xl"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-pink-700/60 hover:text-pink-500 disabled:opacity-0 transition-colors"
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
