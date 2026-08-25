'use client';

import { Html } from '@react-three/drei';

// ─── Skills Visualization ──────────────────────────────────────────────────
const SKILLS = [
  { cat: 'Python / Data Science', pct: 92 },
  { cat: 'Machine Learning', pct: 78 },
  { cat: 'R / Bioinformatics', pct: 75 },
  { cat: 'Data Visualization', pct: 88 },
  { cat: 'Cloud / DevOps (AWS)', pct: 60 },
  { cat: 'SQL / Databases', pct: 45 },
];

function SkillsViz() {
  return (
    <Html center position={[0, 1, 0]} className="pointer-events-none" style={{ width: 420 }}>
      <div style={{
        background: 'rgba(0,0,0,0.85)',
        border: '1px solid rgba(92,21,38,0.4)',
        padding: '20px',
        boxShadow: '0 0 30px rgba(92,21,38,0.2)',
        fontFamily: "var(--font-space-mono), 'Space Mono', monospace",
      }}>
        <div style={{ color: '#b08d57', fontSize: 11, letterSpacing: 3, marginBottom: 16, textTransform: 'uppercase' }}>
          // Skill Matrix — Alex Tran
        </div>
        {SKILLS.map((s) => (
          <div key={s.cat} style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ffffff99', fontSize: 11, marginBottom: 4 }}>
              <span>{s.cat}</span>
              <span style={{ color: '#b08d57' }}>{s.pct}%</span>
            </div>
            <div style={{ height: 3, background: 'rgba(92,21,38,0.15)', borderRadius: 2 }}>
              <div style={{
                height: '100%',
                width: `${s.pct}%`,
                background: 'linear-gradient(90deg, #7a613b, #b08d57)',
                boxShadow: '0 0 8px #b08d57',
                borderRadius: 2,
                transition: 'width 1s ease',
              }} />
            </div>
          </div>
        ))}
      </div>
    </Html>
  );
}

// ─── Projects Visualization ────────────────────────────────────────────────
const PROJECTS = [
  {
    id: 'mjolnir',
    title: 'Mjolnir',
    subtitle: 'Gene Expression Viz Platform',
    tags: ['Dash', 'Plotly', 'Bioinformatics'],
    badge: 'Preprint',
  },
  {
    id: 'visual-omics',
    title: 'Visual–Omics',
    subtitle: 'Histology × Spatial Transcriptomics',
    tags: ['ML', 'Data Curation', '32 Organs'],
    badge: 'Nature Methods',
  },
  {
    id: 'macrophage',
    title: 'Macrophage Analysis',
    subtitle: 'Single-Cell Immune Clustering',
    tags: ['UMAP', 'Leiden', 'scRNA'],
    badge: 'Research',
  },
  {
    id: 'covid-rnaseq',
    title: 'COVID-19 RNA-seq',
    subtitle: 'Differential Expression Pipeline',
    tags: ['TopHat', 'Cuffdiff', 'Python'],
    badge: 'Research',
  },
];

function ProjectsViz() {
  return (
    <Html center position={[0, 1, 0]} className="pointer-events-none" style={{ width: 540 }}>
      <div style={{ fontFamily: "var(--font-space-mono), 'Space Mono', monospace" }}>
        <div style={{ color: '#b08d57', fontSize: 11, letterSpacing: 3, marginBottom: 12, textTransform: 'uppercase' }}>
          // Project Engrams — Alex Tran
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {PROJECTS.map((p) => (
            <div key={p.id} style={{
              background: 'rgba(0,0,0,0.85)',
              border: '1px solid rgba(92,21,38,0.3)',
              padding: '14px',
              boxShadow: '0 0 20px rgba(92,21,38,0.1)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div style={{ color: '#ffffff', fontSize: 12, fontWeight: 'bold' }}>{p.title}</div>
                <div style={{ background: 'rgba(92,21,38,0.2)', color: '#b08d57', fontSize: 9, padding: '2px 6px', letterSpacing: 1 }}>
                  {p.badge}
                </div>
              </div>
              <div style={{ color: '#ffffff66', fontSize: 10, marginBottom: 8 }}>{p.subtitle}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {p.tags.map((t) => (
                  <span key={t} style={{ background: 'rgba(92,21,38,0.1)', color: '#9a8f8699', fontSize: 9, padding: '2px 6px' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Html>
  );
}

// ─── Research Visualization ─────────────────────────────────────────────────
const PAPERS = [
  {
    journal: 'Nature Methods',
    year: '2025',
    title: 'A visual–omics foundation model to bridge histopathology with spatial transcriptomics',
    authors: 'Chen W., Zhang P., Tran T. N., et al.',
    doi: '10.1038/s41592-025-02707-1',
    impact: 'IF ~48',
  },
  {
    journal: 'Nature Communications',
    year: '2025',
    title: 'Thor: a platform for cell-level investigation of spatial transcriptomics and histology',
    authors: 'Zhang P., Chen W., Tran T. N., et al.',
    doi: '10.1038/s41467-025-62593-1',
    impact: 'IF ~16',
  },
];

function ResearchViz() {
  return (
    <Html center position={[0, 1, 0]} className="pointer-events-none" style={{ width: 480 }}>
      <div style={{ fontFamily: "var(--font-space-mono), 'Space Mono', monospace" }}>
        <div style={{ color: '#b08d57', fontSize: 11, letterSpacing: 3, marginBottom: 12, textTransform: 'uppercase' }}>
          // Publication Log — Alex Tran
        </div>
        {PAPERS.map((p) => (
          <div key={p.doi} style={{
            background: 'rgba(0,0,0,0.85)',
            border: '1px solid rgba(92,21,38,0.3)',
            padding: '16px',
            marginBottom: 10,
            boxShadow: '0 0 20px rgba(92,21,38,0.1)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: '#b08d57', fontSize: 11, letterSpacing: 1 }}>{p.journal}</span>
              <span style={{ color: '#b08d5744', fontSize: 11 }}>{p.year} · {p.impact}</span>
            </div>
            <div style={{ color: '#ffffff', fontSize: 11, lineHeight: 1.5, marginBottom: 6 }}>
              {p.title}
            </div>
            <div style={{ color: '#ffffff55', fontSize: 10, marginBottom: 8 }}>{p.authors}</div>
            <div style={{ color: '#b08d5766', fontSize: 9, letterSpacing: 1 }}>doi:{p.doi}</div>
          </div>
        ))}
      </div>
    </Html>
  );
}

// ─── Overview / Identity Card ───────────────────────────────────────────────
function OverviewViz() {
  const stats = [
    { label: 'MS GPA', value: '3.63' },
    { label: 'Publications', value: '2' },
    { label: 'Journal Tier', value: 'Nature' },
    { label: 'Role', value: 'Researcher' },
    { label: 'Location', value: 'Houston TX' },
    { label: 'Status', value: 'Seeking Intern' },
  ];

  return (
    <Html center position={[0, 1, 0]} className="pointer-events-none" style={{ width: 420 }}>
      <div style={{
        background: 'rgba(0,0,0,0.85)',
        border: '1px solid rgba(92,21,38,0.4)',
        padding: '20px',
        boxShadow: '0 0 30px rgba(92,21,38,0.2)',
        fontFamily: "var(--font-space-mono), 'Space Mono', monospace",
      }}>
        <div style={{ color: '#b08d57', fontSize: 11, letterSpacing: 3, marginBottom: 4, textTransform: 'uppercase' }}>
          // Identity Engram
        </div>
        <div style={{ color: '#ffffff', fontSize: 20, fontWeight: 'bold', marginBottom: 4 }}>Tu N. (Alex) Tran</div>
        <div style={{ color: '#ffffff66', fontSize: 11, marginBottom: 16 }}>
          Engineering Data Science · Houston Methodist Research
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {stats.map((s) => (
            <div key={s.label} style={{ background: 'rgba(92,21,38,0.05)', padding: '10px 12px', border: '1px solid rgba(92,21,38,0.15)' }}>
              <div style={{ color: '#b08d5777', fontSize: 9, letterSpacing: 2, marginBottom: 4, textTransform: 'uppercase' }}>{s.label}</div>
              <div style={{ color: '#ffffff', fontSize: 13 }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>
    </Html>
  );
}

// ─── Export ─────────────────────────────────────────────────────────────────
export type VizMode = 'overview' | 'skills' | 'projects' | 'research' | 'role_fit' | 'qa';

export function DataVisualization({ mode }: { mode: VizMode }) {
  if (mode === 'skills') return <SkillsViz />;
  if (mode === 'projects') return <ProjectsViz />;
  if (mode === 'research') return <ResearchViz />;
  return <OverviewViz />;
}
