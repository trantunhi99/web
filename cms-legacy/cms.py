import json
import os
import urllib.parse
from http.server import HTTPServer, SimpleHTTPRequestHandler

# Resolve paths relative to this script's location, regardless of where you run it from
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # .../cms/
ROOT_DIR = os.path.dirname(BASE_DIR)                   # .../personal/

CONTENT_FILE = os.path.join(BASE_DIR, 'content.json')
HTML_FILE     = os.path.join(ROOT_DIR, 'index.html')

def generate_index_html(data):
    # Header & Nav
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{data['hero']['name']} | Engineering Data Science</title>
    <meta name="description" content="Portfolio of {data['hero']['name']}, a Data Science graduate student.">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="icon" type="image/svg+xml" href="assets/media/favicon.svg?v=3">
    <link rel="stylesheet" href="css/styles.css?v=8">
</head>
<body>
    <canvas id="data-canvas"></canvas>
    <nav class="navbar">
        <div class="nav-content">
            <a href="#" class="logo">Alex.</a>
            <div class="menu-toggle" id="mobile-menu">
                <span class="bar"></span>
                <span class="bar"></span>
                <span class="bar"></span>
            </div>
            <ul class="nav-links">
                <li><a href="#about">About</a></li>
                <li><a href="#education">Education</a></li>
                <li><a href="#projects">Projects</a></li>
                <li><a href="#experience">Experience</a></li>
                <li><a href="#publications">Publications</a></li>
                <li><a href="#skills">Skills</a></li>
                <li><a href="#contact">Contact</a></li>
                <li><a href="{data.get('lab_url', 'https://guangyuwanglab.github.io/web/index.html')}" target="_blank" rel="noopener noreferrer" class="nav-lab-link">🔗 Lab Website</a></li>
            </ul>
        </div>
    </nav>
    <main>
"""
    # Hero Section
    html += f"""        <section id="hero" class="hero fade-in">
            <div class="hero-content">
                <h1>{data['hero']['name']}</h1>
                <h4 style="color: var(--accent); font-family: monospace; margin-bottom: 1rem; font-size: 1.1rem; letter-spacing: 0.05em;">{data['hero']['location']}</h4>
                <h2>{data['hero']['headline']}</h2>
                <div class="hero-actions" style="margin-top: 2rem; display: flex; gap: 1rem; flex-wrap: wrap;">
                    <a href="{data['hero']['button1_link']}" class="btn btn-primary">{data['hero']['button1_text']}</a>
                    <a href="{data['hero']['button2_link']}" class="btn btn-outline">{data['hero']['button2_text']}</a>
                    <a href="{data['hero'].get('resume_link', '#')}" target="_blank" rel="noopener noreferrer" class="btn btn-outline" style="border-color: var(--accent); color: var(--accent);">{data['hero'].get('resume_text', 'Download Resume')}</a>
                </div>
            </div>
        </section>
"""
    # Featured Showcase
    bullets_html = "\n                            ".join([f"<li>{b}</li>" for b in data['featured']['bullets']])
    tech_html = "\n                            ".join([f"<span>{t}</span>" for t in data['featured']['tech']])
    html += f"""
        <section id="featured" class="fade-in">
            <div class="section-container" style="max-width: 1200px;">
                <h2 class="section-title">{data['featured']['title']}</h2>
                <div class="featured-showcase">
                    <div class="showcase-text">
                        <a href="{data['featured'].get('paper_url', '#')}" target="_blank" rel="noopener noreferrer" class="pub-badge">📄 {data['featured'].get('paper_label', '')} — Co-author</a>
                        <p>{data['featured'].get('intro', '')}</p>
                        <ul class="research-list">
                            {bullets_html}
                        </ul>
                        <div class="tech-stack">
                            {tech_html}
                        </div>
                    </div>
                    <div class="video-wrapper" id="video-thumb" title="Click to expand" style="cursor: pointer;">
                        <div class="browser-bar"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span></div>
                        <div class="video-expand-hint">⛶ Click to expand</div>
                        <video autoplay loop muted playsinline>
                            <source src="{data['featured']['video']}" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            </div>
        </section>
"""
    # About Section
    paras_html = "\n                        ".join([f"<p>{p}</p>" for p in data['about']['paragraphs']])
    html += f"""
        <section id="about" class="fade-in">
            <div class="section-container">
                <h2 class="section-title">Summary</h2>
                <div class="about-grid">
                    <div class="about-image"><img src="{data['about']['image']}" alt="{data['hero']['name']}"></div>
                    <div class="about-text">
                        {paras_html}
                    </div>
                </div>
            </div>
        </section>
"""
    # Education
    html += """        <section id="education" class="fade-in">
            <div class="section-container">
                <h2 class="section-title">Education</h2>\n"""
    for edu in data['education']:
        html += f"""                <div class="experience-block">
                    <div class="experience-header">
                        <div class="experience-title"><h3>{edu['degree']}</h3><h4>{edu['school']}</h4></div>
                        <div class="experience-date">{edu['date']}</div>
                    </div>
                    <ul class="experience-list">\n"""
        for ext in edu.get('extra', []):
            if ':' in ext:
                p = ext.split(':')
                html += f"                        <li><strong>{p[0]}:</strong> {p[1].strip()}</li>\n"
            else:
                html += f"                        <li>{ext}</li>\n"
        if edu.get('gpa'):
            html += f"                        <li><strong>GPA:</strong> {edu['gpa']}</li>\n"
        html += f"                        <li>{edu['location']}</li>\n                    </ul>\n                </div>\n"
    html += "            </div>\n        </section>\n"
    
    # Projects
    html += """        <section id="projects" class="fade-in">
            <div class="section-container">
                <h2 class="section-title">Relevant Projects</h2>
                <div class="projects-grid">\n"""
    for proj in data['projects']:
        t_html = "\n                                ".join([f"<span>{t}</span>" for t in proj['tech']])
        html += f"""                    <div class="project-card">
                        <div class="project-content">
                            <span class="project-tag">{proj['tag']}</span>
                            <h3>{proj['title']}</h3>
                            <p>{proj['description']}</p>
                            <div class="tech-stack">
                                {t_html}
                            </div>
                        </div>
                    </div>\n"""
    html += "                </div>\n            </div>\n        </section>\n"

    # Experience
    html += """        <section id="experience" class="fade-in">
            <div class="section-container">
                <h2 class="section-title">Work Experience</h2>\n"""
    for exp in data['experience']:
        b_html = "\n                        ".join([f"<li>{b}</li>" for b in exp['bullets']])
        html += f"""                <div class="experience-block">
                    <div class="experience-header">
                        <div class="experience-title"><h3>{exp['role']}</h3><h4>{exp['company']}</h4></div>
                        <div class="experience-date">{exp['date']}</div>
                    </div>
                    <ul class="experience-list">
                        {b_html}
                    </ul>
                </div>\n"""
    html += "            </div>\n        </section>\n"

    # Publications
    html += """        <section id="publications" class="fade-in">
            <div class="section-container" style="padding-top: 2rem;">
                <h2 class="section-title">Publications</h2>
                <div class="publications-list">\n"""
    for pub in data['publications']:
        html += f"""                    <div class="publication-item">
                        <a href="{pub['url']}" target="_blank" rel="noopener noreferrer" style="color: var(--text-primary);">
                            <strong>{pub['title']}</strong>
                        </a><br>
                        <span style="color: var(--text-secondary);">{pub['authors']} <a href="{pub['url']}" target="_blank" rel="noopener noreferrer" style="color: var(--accent);">{pub['doi']}</a></span>
                    </div>\n"""
    html += "                </div>\n            </div>\n        </section>\n"

    # Skills
    html += """        <section id="skills" class="fade-in">
            <div class="section-container">
                <h2 class="section-title">Skills</h2>
                <div class="skills-grid">\n"""
    for s in data['skills']:
        i_html = "\n                            ".join([f"<li>{i}</li>" for i in s['items']])
        html += f"""                    <div class="skill-category">
                        <h3>{s['category']}</h3>
                        <ul>
                            {i_html}
                        </ul>
                    </div>\n"""
    html += "                </div>\n            </div>\n        </section>\n"

    # Contact & Footer
    html += f"""        <section id="contact" class="fade-in">
            <div class="section-container">
                <h2 class="section-title">Contact</h2>
                <div class="contact-content">
                    <p>{data['contact']['paragraph']}</p>
                    <div class="contact-links">
                        <a href="mailto:{data['contact']['email']}" class="btn btn-outline contact-btn" aria-label="Email"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg></a>
                        <a href="tel:{data['contact']['phone']}" class="btn btn-outline contact-btn" aria-label="Phone"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg></a>
                        <a href="{data['contact']['linkedin']}" target="_blank" rel="noopener noreferrer" class="btn btn-outline contact-btn" aria-label="LinkedIn"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <!-- Floating AI Widget -->
    <a href="ai.html" id="ai-nav-btn" class="floating-ai-btn">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"></path>
            <path d="M12 8a6 6 0 0 0-6 6v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-4a6 6 0 0 0-6-6z"></path>
            <path d="M8 12h8"></path>
        </svg>
        <span>Chat with AI</span>
    </a>
    <!-- Page Transition Overlay (Balloon Cluster) -->
    <div id="page-transition" style="position: fixed; inset: 0; z-index: 9999; background: #05070a; opacity: 0; pointer-events: none; transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);">
        <canvas id="balloon-canvas" style="position: absolute; inset: 0; width: 100%; height: 100%;"></canvas>
        <div style="position: absolute; bottom: 36%; left: 50%; transform: translateX(-50%); color: rgba(255,255,255,0.25); font-family: monospace; font-size: 0.65rem; letter-spacing: 0.28em; white-space: nowrap;">LOADING...</div>
    </div>

    <footer>
        <div class="footer-content">
            <p>&copy; {data['hero']['name']}. Designed &amp; Built manually with raw code.</p>
        </div>
    </footer>
    <script src="js/script.js"></script>
""" + """
    <script>
        var bCanvas = document.getElementById('balloon-canvas');
        var bCtx = bCanvas.getContext('2d');
        var bRAF = null, bStart = null;
        var bPalette = ['#f43f5e','#ec4899','#a855f7','#7c3aed','#3b82f6','#2dd4bf'];
        var bCells = [
            {bx:0,   by:0,   r:28, col:'#f43f5e', sp:0.50, off:0.0, fr:3, glow:false},
            {bx:-27, by:-9,  r:18, col:'#7c3aed', sp:0.70, off:1.2, fr:3, glow:false},
            {bx:25,  by:-21, r:13, col:'#2dd4bf', sp:0.90, off:2.1, fr:3, glow:true },
            {bx:-17, by:27,  r:15, col:'#3b82f6', sp:0.60, off:3.5, fr:3, glow:false},
            {bx:30,  by:12,  r:11, col:'#ec4899', sp:1.10, off:0.8, fr:3, glow:false},
            {bx:6,   by:31,  r:13, col:'#a855f7', sp:0.80, off:4.2, fr:3, glow:false},
            {bx:-36, by:6,   r:15, col:'#3b82f6', sp:0.65, off:1.8, fr:3, glow:false},
            {bx:-7,  by:-35, r:10, col:'#f43f5e', sp:1.00, off:2.6, fr:3, glow:false},
            {bx:13,  by:-37, r:12, col:'#a855f7', sp:0.75, off:5.1, fr:3, glow:false},
            {bx:42,  by:21,  r:8,  col:'#ec4899', sp:1.20, off:3.0, fr:2, glow:false},
            {bx:-29, by:37,  r:11, col:'#f43f5e', sp:0.85, off:0.5, fr:2, glow:false},
            {bx:33,  by:-39, r:8,  col:'#2dd4bf', sp:1.30, off:1.4, fr:2, glow:true },
            {bx:-48, by:-17, r:7,  col:'#ec4899', sp:0.95, off:3.8, fr:2, glow:false},
            {bx:48,  by:-7,  r:6,  col:'#7c3aed', sp:1.10, off:2.4, fr:2, glow:false},
            {bx:-57, by:24,  r:5,  col:'#f43f5e', sp:1.40, off:4.6, fr:2, glow:false},
            {bx:57,  by:13,  r:4,  col:'#3b82f6', sp:1.50, off:0.2, fr:1, glow:false},
            {bx:-12, by:57,  r:6,  col:'#a855f7', sp:1.20, off:2.9, fr:2, glow:false},
            {bx:21,  by:54,  r:5,  col:'#ec4899', sp:1.60, off:5.5, fr:1, glow:false},
            {bx:-60, by:-7,  r:4,  col:'#2dd4bf', sp:1.10, off:1.1, fr:2, glow:true },
            {bx:51,  by:-42, r:6,  col:'#7c3aed', sp:0.90, off:4.0, fr:2, glow:false},
            {bx:-31, by:-54, r:4,  col:'#3b82f6', sp:1.30, off:2.2, fr:1, glow:false},
        ];
        var bStars = [];
        for (var i = 0; i < 160; i++) {
            bStars.push({x:Math.random(),y:Math.random(),r:Math.random()<0.2?1.5:0.7,col:bPalette[Math.floor(Math.random()*bPalette.length)],op:0.1+Math.random()*0.22,tw:Math.random()*10});
        }
        function resizeBCanvas() { bCanvas.width=window.innerWidth; bCanvas.height=window.innerHeight; }
        resizeBCanvas(); window.addEventListener('resize', resizeBCanvas);
        function drawBalloons(ts) {
            if (!bStart) bStart=ts; var t=(ts-bStart)/1000;
            var w=bCanvas.width, h=bCanvas.height, cx=w/2, cy=h/2;
            bCtx.clearRect(0,0,w,h); bCtx.fillStyle='#05070a'; bCtx.fillRect(0,0,w,h);
            bStars.forEach(function(s) {
                bCtx.beginPath(); bCtx.arc(s.x*w,s.y*h,s.r,0,Math.PI*2);
                bCtx.globalAlpha=s.op*(0.5+0.5*Math.sin(t*1.5+s.tw)); bCtx.fillStyle=s.col; bCtx.fill();
            });
            bCtx.globalAlpha=1;
            var bounce=Math.abs(Math.sin(t*1.1));
            var jumpY=bounce*45;
            var sqX=1.0+(1-bounce)*0.06, sqY=1.0-(1-bounce)*0.06;
            bCtx.save();
            bCtx.translate(cx, cy-jumpY);
            bCtx.scale(sqX, sqY);
            bCells.forEach(function(c) {
                var fx=Math.sin(t*c.sp+c.off)*c.fr, fy=Math.cos(t*c.sp*0.8+c.off)*c.fr;
                var x=c.bx+fx, y=c.by+fy;
                if (c.glow) {
                    var g=bCtx.createRadialGradient(x,y,0,x,y,c.r*2.8);
                    g.addColorStop(0,c.col+'99'); g.addColorStop(1,'transparent');
                    bCtx.beginPath(); bCtx.arc(x,y,c.r*2.8,0,Math.PI*2); bCtx.fillStyle=g; bCtx.fill();
                }
                bCtx.beginPath(); bCtx.arc(x,y,c.r,0,Math.PI*2); bCtx.fillStyle=c.col; bCtx.fill();
            });
            bCtx.restore();
            bRAF=requestAnimationFrame(drawBalloons);
        }
        function startBalloons() { bStart=null; bRAF=requestAnimationFrame(drawBalloons); }
        function stopBalloons() { if(bRAF){ cancelAnimationFrame(bRAF); bRAF=null; } }
        document.getElementById('ai-nav-btn').addEventListener('click', function(e) {
            e.preventDefault();
            var overlay=document.getElementById('page-transition');
            overlay.style.pointerEvents='all'; overlay.style.opacity='1';
            startBalloons();
            setTimeout(function() { window.location.href='ai.html'; }, 600);
        });
        window.addEventListener('pageshow', function() {
            var overlay=document.getElementById('page-transition');
            overlay.style.opacity='0'; overlay.style.pointerEvents='none';
            stopBalloons();
        });
    </script>
</body>
</html>
"""
    with open(HTML_FILE, 'w') as f:
        f.write(html)


def get_admin_ui():
    return """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Portfolio Builder</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
        <style>
            :root { --bg: #0e0e10; --panel: #18181b; --text: #efeff1; --border: #303032; --accent: #0070f3; }
            body { margin: 0; display: flex; height: 100vh; font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); overflow: hidden; }
            .sidebar { width: 350px; background: var(--panel); display: flex; flex-direction: column; border-right: 1px solid var(--border); z-index: 10;}
            .sidebar-header { padding: 1.5rem; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
            .sidebar-header h1 { font-size: 1.2rem; margin: 0; font-weight: 600; font-family: monospace; }
            .publish-btn { background: var(--accent); color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 500; cursor: pointer; transition: 0.2s; }
            .publish-btn:hover { filter: brightness(1.1); }
            .editor-content { flex: 1; overflow-y: auto; padding: 10px; }
            .preview { flex: 1; background: #fff; display: flex; flex-direction: column; }
            .preview-header { height: 50px; background: #f3f3f3; border-bottom: 1px solid #ddd; display: flex; align-items: center; justify-content: center; color: #666; font-size: 0.9rem; }
            iframe { width: 100%; height: 100%; border: none; }
            
            /* Form Styles */
            .section-card { border: 1px solid var(--border); border-radius: 6px; margin-bottom: 10px; overflow: hidden; background: #1f1f23; }
            .section-header { padding: 12px 15px; font-weight: 600; font-size: 0.85rem; letter-spacing: 0.05em; background: #26262c; cursor: pointer; display: flex; justify-content: space-between; user-select: none; }
            .section-header:hover { background: #2d2d34; }
            .section-content { padding: 15px; }
            .section-content.hidden { display: none; }
            
            .form-group { margin-bottom: 15px; }
            .form-group label { display: block; font-size: 0.75rem; color: #adadb8; padding-bottom: 5px; font-weight: 500; text-transform: uppercase; }
            input, textarea { width: 100%; box-sizing: border-box; background: var(--bg); border: 1px solid var(--border); color: var(--text); padding: 8px 10px; border-radius: 4px; font-family: 'Inter', sans-serif; font-size: 0.85rem; }
            input:focus, textarea:focus { outline: none; border-color: var(--accent); }
            textarea { resize: vertical; min-height: 60px; }
            
            .array-container { border-left: 2px solid var(--border); padding-left: 10px; margin-top: 5px; }
            .array-item { margin-bottom: 15px; background: rgba(255,255,255,0.02); padding: 10px; border-radius: 4px; border: 1px solid var(--border); }
            .array-header { font-size: 0.75rem; color: #adadb8; margin-bottom: 10px; font-weight: 600; text-transform: uppercase; }
            
            /* Scrollbar */
            ::-webkit-scrollbar { width: 8px; }
            ::-webkit-scrollbar-track { background: var(--panel); }
            ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
            ::-webkit-scrollbar-thumb:hover { background: #4a4a4e; }

            /* Mobile Responsiveness */
            @media (max-width: 768px) {
                body { flex-direction: column; }
                .sidebar { width: 100%; height: 50vh; flex: none; border-right: none; border-bottom: 1px solid var(--border); }
                .preview { flex: 1; width: 100%; }
            }
        </style>
    </head>
    <body>
        <div class="sidebar">
            <div class="sidebar-header">
                <h1>CMS Builder</h1>
                <button id="publish-btn" class="publish-btn" onclick="publish()">Publish</button>
            </div>
            <div class="editor-content" id="editor-panel">
                <div style="padding: 20px; text-align: center; color: #888;">Loading...</div>
            </div>
        </div>
        <div class="preview">
            <div class="preview-header">
                <span style="background: white; padding: 4px 12px; border-radius: 12px; font-family: monospace; border: 1px solid #ddd; font-size: 12px;">Live Preview</span>
            </div>
            <iframe id="preview-frame" src="/"></iframe>
        </div>

        <script>
            let currentData = {};
            let openSection = null;

            async function init() {
                try {
                    const res = await fetch('/data');
                    currentData = await res.json();
                    renderEditor();
                } catch(e) {
                    document.getElementById('editor-panel').innerHTML = '<div style="padding: 20px; color: red;">Failed to load data</div>';
                }
            }

            function toggleSection(sectionName, element) {
                const content = element.nextElementSibling;
                content.classList.toggle('hidden');
                if (!content.classList.contains('hidden')) {
                    openSection = sectionName;
                } else {
                    if (openSection === sectionName) openSection = null;
                }
            }

            function renderEditor() {
                const editor = document.getElementById('editor-panel');
                let html = '';
                for (let section in currentData) {
                    const isHidden = (openSection === section) ? '' : 'hidden';
                    html += `
                    <div class="section-card">
                        <div class="section-header" onclick="toggleSection('${section}', this)">
                            ${section.toUpperCase()}
                            <span class="toggle-icon">▼</span>
                        </div>
                        <div class="section-content ${isHidden}">
                            ${generateForm(currentData[section], [section])}
                        </div>
                    </div>
                    `;
                }
                editor.innerHTML = html;
            }

            function generateForm(data, path = []) {
                let html = '';
                const pathStr = JSON.stringify(path).replace(/"/g, '&quot;');
                if (Array.isArray(data)) {
                    html += `<div class="array-container">`;
                    data.forEach((item, index) => {
                        html += `<div class="array-item">
                                   <div class="array-header" style="display:flex; justify-content:space-between;">
                                       <span>Item ${index + 1}</span>
                                       <button onclick="deleteArrayItem(${pathStr}, ${index})" style="background:none; border:none; color:#ff4d4f; cursor:pointer; font-size:0.75rem; font-weight:600;">Delete</button>
                                   </div>`;
                        html += generateForm(item, [...path, index]);
                        html += `</div>`;
                    });
                    html += `<button onclick="addArrayItem(${pathStr})" style="width:100%; padding:8px; border-radius:4px; border:1px dashed var(--border); background:rgba(255,255,255,0.05); color:var(--text); cursor:pointer; margin-top:5px; font-weight:500;">+ Add New Item</button>`;
                    html += `</div>`;
                } else if (typeof data === 'object' && data !== null) {
                    html += `<div class="obj-container">`;
                    for (let key in data) {
                        html += `<div class="form-group">
                            <label>${key.replace(/_/g, ' ')}</label>`;
                        html += generateForm(data[key], [...path, key]);
                        html += `</div>`;
                    }
                    html += `</div>`;
                } else {
                    const val = (data === null) ? '' : data;
                    // Using onchange instead of oninput to reduce extreme lag for large updates
                    if (typeof val === 'string' && val.length > 50) {
                        html += `<textarea onchange="updateData(${pathStr}, this.value)">${val}</textarea>`;
                    } else {
                        html += `<input type="text" value="${val.toString().replace(/"/g, '&quot;')}" onchange="updateData(${pathStr}, this.value)" />`;
                    }
                }
                return html;
            }

            function updateData(path, value) {
                let ref = currentData;
                for (let i = 0; i < path.length - 1; i++) {
                    ref = ref[path[i]];
                }
                ref[path[path.length - 1]] = value;
            }

            function clearObject(obj) {
                for (let k in obj) {
                    if (Array.isArray(obj[k])) {
                        obj[k] = [];
                    } else if (typeof obj[k] === 'object' && obj[k] !== null) {
                        clearObject(obj[k]);
                    } else if (typeof obj[k] === 'string') {
                        obj[k] = '';
                    } else if (typeof obj[k] === 'number') {
                        obj[k] = 0;
                    }
                }
            }

            function addArrayItem(path) {
                let ref = currentData;
                for (let i = 0; i < path.length; i++) {
                    ref = ref[path[i]];
                }
                let template = {};
                if (ref.length > 0) {
                    template = JSON.parse(JSON.stringify(ref[ref.length - 1]));
                    if (typeof template === 'object' && template !== null) {
                        clearObject(template);
                    } else if (typeof template === 'string') {
                        template = '';
                    }
                } else {
                    template = ''; 
                }
                ref.push(template);
                renderEditor();
            }

            function deleteArrayItem(path, index) {
                let ref = currentData;
                for (let i = 0; i < path.length; i++) {
                    ref = ref[path[i]];
                }
                ref.splice(index, 1);
                renderEditor();
            }

            async function publish() {
                const btn = document.getElementById('publish-btn');
                const originalText = btn.innerText;
                btn.innerText = "Saving...";
                try {
                    const res = await fetch('/save', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(currentData)
                    });
                    if (res.ok) {
                        btn.innerText = "Published!";
                        document.getElementById('preview-frame').contentWindow.location.reload();
                        setTimeout(() => btn.innerText = originalText, 2000);
                    } else {
                        btn.innerText = "Error";
                        setTimeout(() => btn.innerText = originalText, 2000);
                    }
                } catch(e) {
                    btn.innerText = "Error";
                    setTimeout(() => btn.innerText = originalText, 2000);
                }
            }

            init();
        </script>
    </body>
    </html>
    """

class CMSHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT_DIR, **kwargs)

    def do_GET(self):
        if self.path == '/admin':
            response_body = get_admin_ui().encode('utf-8')
            self.send_response(200)
            self.send_header('Content-type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(response_body)))
            self.end_headers()
            try:
                self.wfile.write(response_body)
            except BrokenPipeError:
                pass
        elif self.path == '/data':
            with open(CONTENT_FILE, 'r') as f:
                data = f.read()
            response_body = data.encode('utf-8')
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Content-Length', str(len(response_body)))
            self.end_headers()
            try:
                self.wfile.write(response_body)
            except BrokenPipeError:
                pass
        else:
            # Fall back to SimpleHTTPRequestHandler to serve index.html, JS, CSS, etc.
            super().do_GET()

    def do_POST(self):
        if self.path == '/save':
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length).decode('utf-8')
            try:
                # Expecting raw JSON object body
                parsed_data = json.loads(post_data)
                with open(CONTENT_FILE, 'w') as f:
                    json.dump(parsed_data, f, indent=2)
                
                # Rebuild index.html
                generate_index_html(parsed_data)
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"status": "ok"}).encode('utf-8'))
            except Exception as e:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

if __name__ == '__main__':
    host = '127.0.0.1'
    port = 5000
    print(f"✅ Website preview running at → http://{host}:{port}/")
    print(f"✅ CMS Builder running at   → http://{host}:{port}/admin")
    print("Press Ctrl+C to stop.")
    server = HTTPServer((host, port), CMSHandler)
    server.serve_forever()
