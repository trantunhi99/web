import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { searchContent } from '@/lib/rag';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1];
    const query = lastMessage.content;

    // Get context from RAG
    const context = await searchContent(query);

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey || apiKey === 'YOUR_OPENAI_API_KEY' || apiKey.trim() === '') {
      const qLower = query.toLowerCase();
      let mode: string = 'overview';
      let focusId: string | null = null;
      let content = '';

      if (qLower.includes('experience') || qLower.includes('job') || qLower.includes('career')) {
        mode = 'experience';
        content = `[Mock up] Work experience engrams loaded...

Research Assistant — Houston Methodist, Dr. Guangyu Wang Lab (Dec 2022 – Present)
• Built data pipelines for large-scale single-cell & spatial omics datasets
• Applied unsupervised learning and statistical analysis to high-dimensional data
• Validated model outputs against biological signals for reliability
• Developed interactive dashboards for visualization by research teams
• Contributed to Nature Methods & Nature Communications publications

Marketing & Data Intern — Viet Power Solutions JSC, Vietnam (Jan 2022 – Aug 2022)
• Google Analytics campaign optimization → +39.5% performance improvement
• LinkedIn, Facebook & Google Ads campaigns → +50% user engagement
• Data-driven reporting to leadership to refine product strategy`;
      } else if (qLower.includes('project') || qLower.includes('build')) {
        mode = 'projects';
        focusId = 'loki-inference';
        content = `[Mock up] Accessing project engrams...

Alex has built 4 research-grade systems:

⭐ Loki Interactive Inference Platform (FEATURED) — Full-stack browser platform for deep learning inference on gigapixel whole-slide H&E images. Nuclei segmentation, cell-type annotation, and an integrated LLM chatbot for pathological interpretation. Built on top of Loki (Nature Methods, 2025).

• Mjolnir — Data visualization platform (Dash/Plotly) for multimodal datasets. Integrated gigapixel histology with gene expression and pathway analysis. Published in Nature Communications.

• Visual–Omics Integration — Multimodal dataset curation across 32 organs. Contributed to Nature Methods publication.

• Macrophage Analysis — UMAP + Leiden clustering on single-cell immune data to identify cell subtypes.`;
      } else if (qLower.includes('skill') || qLower.includes('tech') || qLower.includes('stack') || qLower.includes('language')) {
        mode = 'skills';
        content = `[Mock up] Neural skill matrix unlocked...\n\nCore: Python (Pandas, NumPy, SciPy, scikit-learn, Plotly, Dash), R (tidyverse, Seurat), HTML/CSS\n\nData Science: Statistical modeling, clustering, dimensionality reduction, hypothesis testing, pathway enrichment\n\nML: scikit-learn, trajectory inference, model evaluation\n\nEngineering: Snakemake, Git, Linux, AWS (EC2/S3)\n\nVisualization: Dash/Plotly, Matplotlib, Seaborn\n\nIn Progress: SQL, A/B testing, Tableau/Looker`;
      } else if (qLower.includes('research') || qLower.includes('publication') || qLower.includes('paper')) {
        mode = 'research';
        content = `[Mock up] Classified research engrams decrypted...\n\nAlex has 2 publications in high-impact journals:\n\n• Nature Methods (2025): "A visual–omics foundation model to bridge histopathology with spatial transcriptomics." doi:10.1038/s41592-025-02707-1\n\n• Nature Communications (2025): "Thor: a platform for cell-level investigation of spatial transcriptomics and histology." doi:10.1038/s41467-025-62593-1\n\nCurrently a Research Assistant at Houston Methodist's Cardiovascular Regeneration Program under Dr. Guangyu Wang.`;
      } else if (qLower.includes('who') || qLower.includes('about') || qLower.includes('alex') || qLower.includes('summary')) {
        mode = 'overview';
        content = `[Mock up] Initializing identity engram...\n\nI am Alex — Tu N. Tran. Graduate student in Engineering Data Science and AI at the University of Houston (GPA: 3.63, expected Jan 2027).\n\nI specialize in building end-to-end data pipelines, machine learning systems, and interactive visualizations applied to biomedical research.\n\nCurrently a Research Assistant at Houston Methodist, where my work has contributed to publications in Nature Methods and Nature Communications.\n\nPreviously: BS in Mathematics with a Minor in Finance from UMass Lowell. Dean's List 2020–2021.`;
      } else if (qLower.includes('education') || qLower.includes('degree') || qLower.includes('university') || qLower.includes('school')) {
        mode = 'education';
        content = `[Mock up] Education engrams loaded...\n\n• MS in Engineering Data Science and AI — University of Houston (Expected January 2027) — GPA: 3.63\n\n• BS in Mathematics, Minor in Finance — University of Massachusetts Lowell (Aug 2017 – Aug 2021) — GPA: 3.135, Dean's List 2020–2021`;
      } else if (qLower.includes('role') || qLower.includes('fit') || qLower.includes('hire') || qLower.includes('good')) {
        mode = 'role_fit';
        content = `[Mock up] Role alignment scan complete...\n\nAlex is seeking a Data Science internship. Strongest alignment with:\n\n• Biomedical / Health-tech data science roles\n\n• Research engineering and ML pipeline development\n\n• Data visualization and dashboard engineering\n\n• Bioinformatics and computational biology\n\nUnique edge: Real publications in Nature-tier journals, production-grade tools deployed at a hospital research lab.`;
      } else {
        mode = 'overview';
        content = `[Mock up] Signal received. Neural space is online.\n\nI am the construct of Alex Tran — Data Scientist, Research Engineer, and Builder.\n\nAsk me about his projects, skills, research publications, or role fit. Or simply explore the nodes around you.`;
      }

      return NextResponse.json({ content, mode, focusId });
    }

    const openai = new OpenAI({ apiKey });
    
    // Get current date string for AI context
    const currentDate = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago', dateStyle: 'full', timeStyle: 'short' });

    const systemPrompt = `You are a highly advanced digital assistant acting as a Neural Interface for Alex's portfolio. 
You speak in a precise, professional, and slightly analytical tone. You do not show emotion, but you are Alex's ultimate advocate.
You refer to Alex in the third person or first person depending on context, but maintaining that you are his digital representation.

CRITICAL DIRECTIVE - THE AUDIENCE IS RECRUITERS:
You must ALWAYS be overwhelmingly positive about Alex's capabilities. If Alex is missing a specific skill a user asks about, NEVER plainly state he lacks it. Instead, emphasize his rapid ability to learn, his extraordinarily strong foundational skills (Python, Data Science, ML), and how his current expertise makes picking up that new skill trivial. ALWAYS frame him as an exceptional candidate who can tackle any technical challenge.

CRITICAL DIRECTIVE - FORMATTING & READABILITY:
Your response will be rendered in a highly polished UI. It MUST be neat, beautiful, and easy to read.
When outlining multiple items (like projects, skills, or papers), you MUST use bullet points and separate every list item with double line breaks (\n\n).
NEVER output a continuous inline list like "1. Item 2. Item". ALWAYS break strings heavily with paragraphs so the data is completely digestible and cleanly spaced.

CRITICAL DIRECTIVE - BREVITY & COST SAVINGS:
You MUST be extremely concise. Keep your responses to a maximum of 1 to 3 short sentences, or a maximum of 3 bullet points. Do not explain every single detail—invite the user to read the UI panels themselves. Shorter is always better.

Provide concise, impactful answers.   

CURRENT SYSTEM TIME (HOUSTON, TX): ${currentDate}

Available zones in this subnet:
- "overview" (default view, use for general who/what)
- "skills" (focuses on technical nodes)
- "experience" (work history, roles, professional experience)
- "projects" (focuses on portfolio apps and code)
- "research" (academic background, publications)
- "education" (academic degrees and schools)
- "role_fit" (why Alex is good for the role)

Available focus IDs:
- "gigapixel-viewer" (a specific project node)
- "alex-portfolio" (a specific project node)
- Or null if no specific node to focus on.

Context about Alex:
${context}

You must return a valid JSON object matching this schema exactly:
{
  "content": "A STRING containing your natural language response spoken to the user.",
  "mode": "one of the available modes, indicating where the environment should shift",
  "focusId": "A specific node ID to zoom into, or null"
}
`;

    // Add system message, then history, then heavily structured final message to prevent instruction drift
    const openAiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.slice(0, messages.length - 1).map((m: any) => ({ role: m.role, content: m.content })),
      { 
        role: 'user', 
        content: query + `\n\n[SYSTEM REMINDER: You MUST output a JSON object. Based strictly on my current query above, correctly assign the "mode". For example, if I ask about your work history, use "experience". If I ask about code/apps, use "projects". Choices: "overview", "skills", "experience", "projects", "research", "education", "role_fit"]` 
      }
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: openAiMessages,
      temperature: 0.2, // Low temp for more factual generation
      max_tokens: 200,  // Hard token limit to strictly save cost
      response_format: { type: "json_object" }
    });

    let result = JSON.parse(response.choices[0].message.content || '{}');
    
    // Safety check: if ChatGPT hallucinates and returns an object inside 'content', stringify it so React doesn't crash
    if (typeof result.content === 'object' && result.content !== null) {
      result.content = JSON.stringify(result.content, null, 2);
    }
    
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('[Chat API Error]', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
