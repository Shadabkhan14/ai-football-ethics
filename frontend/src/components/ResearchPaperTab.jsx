import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Copy, 
  Check, 
  Download, 
  ExternalLink, 
  FileText, 
  Layers, 
  Sparkles,
  Award
} from 'lucide-react';
import { fetchResearchPaper } from '../api';

export default function ResearchPaperTab() {
  const [paper, setPaper] = useState(null);
  const [activeSection, setActiveSection] = useState(1);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchResearchPaper()
      .then((data) => setPaper(data))
      .catch((err) => console.error("Error loading paper:", err));
  }, []);

  const handleCopyCitation = () => {
    const citation = `Lead Researcher et al. (2026). Ethical Challenges and Future of AI in Football: Bridging Machine Learning, Computer Vision, and Algorithmic Governance in Elite Sports. International Journal of Sports Analytics & AI Ethics.`;
    navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header Academic Banner */}
      <div className="glass-panel" style={{
        padding: '32px',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 27, 75, 0.4))',
        border: '1px solid rgba(168, 85, 247, 0.35)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ maxWidth: '820px' }}>
            <span className="badge badge-purple" style={{ marginBottom: '12px' }}>
              College Research Paper Demonstration Companion
            </span>

            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: '8px' }}>
              {paper?.title || "Ethical Challenges and Future of AI in Football"}
            </h2>

            <div style={{ fontSize: '1.05rem', color: 'var(--emerald-neon)', fontWeight: 600, marginBottom: '12px' }}>
              {paper?.subtitle}
            </div>

            <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
              Author: <strong>Department of Sports Analytics & Artificial Intelligence</strong> • Peer-Review Demonstration
            </div>
          </div>

          <button
            onClick={handleCopyCitation}
            className="btn-secondary"
            style={{ fontSize: '0.82rem' }}
          >
            {copied ? <Check size={16} color="var(--emerald-neon)" /> : <Copy size={16} />}
            <span>{copied ? "Citation Copied!" : "Copy APA Citation"}</span>
          </button>
        </div>
      </div>

      {/* Abstract Card */}
      {paper && (
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h4 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} color="var(--emerald-neon)" />
            Abstract
          </h4>
          <p style={{ fontSize: '0.94rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '18px' }}>
            {paper.abstract}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>KEYWORDS:</span>
            {paper.keywords?.map((kw, idx) => (
              <span key={idx} className="badge badge-cyan" style={{ fontSize: '0.72rem' }}>
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Main Reader: Section Index on Left, Section Reader on Right */}
      {paper && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 1fr) minmax(400px, 2.2fr)', gap: '24px' }}>
          {/* Chapter Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '4px' }}>
              RESEARCH CHAPTERS
            </div>
            {paper.sections?.map((sec) => (
              <button
                key={sec.number}
                onClick={() => setActiveSection(sec.number)}
                className="glass-panel"
                style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderColor: activeSection === sec.number ? 'var(--emerald-neon)' : 'var(--border-glass)',
                  background: activeSection === sec.number ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-card)',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ fontSize: '0.72rem', color: activeSection === sec.number ? 'var(--emerald-neon)' : 'var(--text-muted)', fontWeight: 700 }}>
                  SECTION {sec.number}
                </div>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: activeSection === sec.number ? '#ffffff' : 'var(--text-secondary)', marginTop: '2px' }}>
                  {sec.title}
                </div>
              </button>
            ))}
          </div>

          {/* Section Detail Reader */}
          <div className="glass-panel" style={{ padding: '32px' }}>
            {(() => {
              const sec = paper.sections?.find((s) => s.number === activeSection) || paper.sections?.[0];
              if (!sec) return null;
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge badge-emerald">Chapter {sec.number}</span>
                  </div>

                  <h3 style={{ fontSize: '1.45rem', fontWeight: 800 }}>
                    {sec.title}
                  </h3>

                  <p style={{ fontSize: '0.96rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
                    {sec.content}
                  </p>

                  {/* Mathematical Formulation Block */}
                  {sec.math_formula && (
                    <div style={{
                      background: 'rgba(0, 0, 0, 0.5)',
                      border: '1px solid var(--border-glass)',
                      borderLeft: '4px solid var(--cyan-neon)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '18px 24px',
                      marginTop: '10px'
                    }}>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 700 }}>
                        MATHEMATICAL FORMULATION
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '1.05rem',
                        color: 'var(--cyan-neon)',
                        fontWeight: 600,
                        letterSpacing: '0.04em'
                      }}>
                        {sec.math_formula}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* AI Technique Methodology Table */}
      {paper?.methodology_table && (
        <div className="glass-panel" style={{ padding: '28px' }}>
          <h4 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} color="var(--cyan-neon)" />
            AI Techniques, Football Domains & Ethical Safeguards Matrix
          </h4>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-glass)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px 14px' }}>AI TECHNIQUE</th>
                  <th style={{ padding: '12px 14px' }}>FOOTBALL DOMAIN</th>
                  <th style={{ padding: '12px 14px' }}>ETHICAL SAFEGUARD IMPLEMENTED</th>
                </tr>
              </thead>
              <tbody>
                {paper.methodology_table.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--emerald-neon)' }}>{row.technique}</td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-primary)' }}>{row.domain}</td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>{row.safeguard}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
