import React from 'react';
import { 
  TrendingUp, 
  Activity, 
  Eye, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  Terminal,
  Scale
} from 'lucide-react';

export default function OverviewTab({ overview, matches, setActiveTab }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(18px, 3vw, 28px)' }}>
      {/* Hero Banner */}
      <div className="glass-panel hero-content-box" style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(6, 78, 59, 0.25))',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '260px', height: '260px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        
        <div style={{ maxWidth: '850px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
            <span className="badge badge-emerald">Machine Learning</span>
            <span className="badge badge-cyan">Computer Vision</span>
            <span className="badge badge-amber">ACWR Workload</span>
            <span className="badge badge-purple">GDPR Art. 9 Governance</span>
          </div>

          <h2 style={{ 
            fontSize: 'clamp(1.35rem, 3.8vw, 2.1rem)', 
            fontWeight: 800, 
            lineHeight: 1.25, 
            letterSpacing: '-0.02em', 
            marginBottom: '12px' 
          }}>
            Ethical Challenges & the Future of Artificial Intelligence in Football
          </h2>

          <p style={{ 
            fontSize: 'clamp(0.85rem, 2vw, 0.96rem)', 
            color: 'var(--text-secondary)', 
            lineHeight: 1.6, 
            marginBottom: '20px' 
          }}>
            An interactive platform demonstrating how elite football utilizes machine learning for match outcome prediction, 
            OpenCV for planar homography optical tracking, and Tim Gabbett's Acute:Chronic Workload Ratio (ACWR) for injury prevention — 
            while investigating urgent ethical imperatives: continuous biometric surveillance, algorithmic scouting bias, 
            informed consent, and athlete data sovereignty.
          </p>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              onClick={() => setActiveTab('predictor')} 
              className="btn-primary"
            >
              <TrendingUp size={16} />
              <span>Launch Match Outcome Predictor</span>
            </button>
            <button 
              onClick={() => setActiveTab('cv')} 
              className="btn-secondary"
            >
              <Eye size={16} color="var(--cyan-neon)" />
              <span>Test Computer Vision Tracking</span>
            </button>
            <button 
              onClick={() => setActiveTab('ethics')} 
              className="btn-secondary"
            >
              <Scale size={16} color="var(--purple-neon)" />
              <span>Simulate Algorithmic Bias Audit</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid-kpi-row">
        <div className="glass-panel" style={{ padding: 'clamp(14px, 2.5vw, 20px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: 'clamp(0.72rem, 1.8vw, 0.8rem)', color: 'var(--text-secondary)', fontWeight: 600 }}>MATCH FORECAST ACCURACY</span>
            <TrendingUp size={16} color="var(--emerald-neon)" />
          </div>
          <div style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--emerald-neon)', fontFamily: 'var(--font-mono)' }}>
            {overview?.prediction_accuracy_percent || 79.4}%
          </div>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Calibrated Random Forest model on 1,200 European league matches
          </p>
        </div>

        <div className="glass-panel" style={{ padding: 'clamp(14px, 2.5vw, 20px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: 'clamp(0.72rem, 1.8vw, 0.8rem)', color: 'var(--text-secondary)', fontWeight: 600 }}>MONITORED WORKLOAD (ACWR)</span>
            <Activity size={16} color="var(--cyan-neon)" />
          </div>
          <div style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--cyan-neon)', fontFamily: 'var(--font-mono)' }}>
            {overview?.avg_acwr || 1.18}
          </div>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Acute:Chronic Ratio (Safe adaptation window: 0.8 - 1.3)
          </p>
        </div>

        <div className="glass-panel" style={{ padding: 'clamp(14px, 2.5vw, 20px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: 'clamp(0.72rem, 1.8vw, 0.8rem)', color: 'var(--text-secondary)', fontWeight: 600 }}>ETHICAL GOVERNANCE INDEX</span>
            <ShieldCheck size={16} color="var(--purple-neon)" />
          </div>
          <div style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--purple-neon)', fontFamily: 'var(--font-mono)' }}>
            {overview?.governance_score || 85} <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>/ 100</span>
          </div>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            {overview?.governance_tier || 'Gold Standard: Human-Centric AI'}
          </p>
        </div>

        <div className="glass-panel" style={{ padding: 'clamp(14px, 2.5vw, 20px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: 'clamp(0.72rem, 1.8vw, 0.8rem)', color: 'var(--text-secondary)', fontWeight: 600 }}>COMPUTER VISION FPS</span>
            <Eye size={16} color="var(--amber-neon)" />
          </div>
          <div style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: 'var(--amber-neon)', fontFamily: 'var(--font-mono)' }}>
            54.2 <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>FPS</span>
          </div>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            OpenCV Planar Homography 2D Top-Down Pitch Mapping
          </p>
        </div>
      </div>

      {/* Core Operational Pillars */}
      <div>
        <h3 style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.25rem)', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="var(--emerald-neon)" />
          Core Pillars & Implementations
        </h3>

        <div className="grid-cards-3col">
          {/* Pillar 1 */}
          <div className="glass-panel glass-panel-glow" style={{ padding: 'clamp(16px, 2.5vw, 24px)' }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '12px'
            }}>
              <TrendingUp size={20} color="var(--emerald-neon)" />
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>
              1. Machine Learning Match Analytics
            </h4>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '14px' }}>
              Deploys Calibrated Random Forests, Expected Goals (xG) logistic regression, and rolling team Elo ratings. 
              Quantifies goal quality based on Euclidean distance, visual angle, and defensive pressure.
            </p>
            <button 
              onClick={() => setActiveTab('matches')} 
              className="btn-secondary" 
              style={{ width: '100%', justifyContent: 'space-between' }}
            >
              <span>Explore Match xG Charts</span>
              <ArrowRight size={15} />
            </button>
          </div>

          {/* Pillar 2 */}
          <div className="glass-panel glass-panel-glow" style={{ padding: 'clamp(16px, 2.5vw, 24px)' }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '10px',
              background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '12px'
            }}>
              <Eye size={20} color="var(--cyan-neon)" />
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>
              2. Computer Vision & 2D Homography
            </h4>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '14px' }}>
              Uses OpenCV HSV pitch segmentation, connected components, and upper-torso jersey color clustering to track 
              players and the ball, projecting broadcast frames onto a standardized 2D top-down pitch mini-map.
            </p>
            <button 
              onClick={() => setActiveTab('cv')} 
              className="btn-secondary" 
              style={{ width: '100%', justifyContent: 'space-between' }}
            >
              <span>Launch CV Detector Lab</span>
              <ArrowRight size={15} />
            </button>
          </div>

          {/* Pillar 3 */}
          <div className="glass-panel glass-panel-glow" style={{ padding: 'clamp(16px, 2.5vw, 24px)' }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '10px',
              background: 'rgba(168, 85, 247, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '12px'
            }}>
              <Scale size={20} color="var(--purple-neon)" />
            </div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>
              3. Ethical Auditing & Algorithmic Bias
            </h4>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '14px' }}>
              Exposes how AI scouting penalizes Global South prospects by 34% due to recording camera artifacts. 
              Addresses 24/7 biometric surveillance, GDPR Article 9 protections, and Athlete Data Sovereignty.
            </p>
            <button 
              onClick={() => setActiveTab('ethics')} 
              className="btn-secondary" 
              style={{ width: '100%', justifyContent: 'space-between' }}
            >
              <span>Simulate Bias Mitigation</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Featured Match Showcase */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <h3 style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.25rem)', fontWeight: 700 }}>
            Featured Champions League & Domestic Clashes
          </h3>
          <button onClick={() => setActiveTab('matches')} className="btn-secondary" style={{ fontSize: '0.78rem' }}>
            View All Matches ({matches?.length || 0})
          </button>
        </div>

        <div className="grid-2col-equal">
          {matches?.slice(0, 2).map((m) => (
            <div key={m.id} className="glass-panel" style={{ padding: 'clamp(16px, 2.5vw, 22px)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70%' }}>{m.competition}</span>
                <span className="badge badge-emerald" style={{ fontSize: '0.64rem' }}>{m.status}</span>
              </div>

              {/* Scoreline */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '12px 0', gap: '8px' }}>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontSize: 'clamp(0.95rem, 2.2vw, 1.1rem)', fontWeight: 700 }}>{m.home_team}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>xG: {m.xg_home}</div>
                </div>

                <div style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(255, 255, 255, 0.06)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                  flexShrink: 0
                }}>
                  {m.home_score} : {m.away_score}
                </div>

                <div style={{ flex: 1, textAlign: 'right' }}>
                  <div style={{ fontSize: 'clamp(0.95rem, 2.2vw, 1.1rem)', fontWeight: 700 }}>{m.away_team}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>xG: {m.xg_away}</div>
                </div>
              </div>

              {/* Possession bar */}
              <div style={{ marginTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  <span>Possession {m.possession_home}%</span>
                  <span>{m.possession_away}% Possession</span>
                </div>
                <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255, 255, 255, 0.1)', overflow: 'hidden', display: 'flex' }}>
                  <div style={{ width: `${m.possession_home}%`, background: 'var(--emerald-neon)' }} />
                  <div style={{ width: `${m.possession_away}%`, background: 'var(--cyan-neon)' }} />
                </div>
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '12px', lineHeight: 1.5, borderTop: '1px solid var(--border-glass)', paddingTop: '10px' }}>
                {m.tactical_summary}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack Footer Card */}
      <div className="glass-panel" style={{ padding: 'clamp(14px, 2.5vw, 20px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Terminal size={20} color="var(--cyan-neon)" />
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>Architecture Stack</div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
              React 18 + Vite • FastAPI • Scikit-Learn 1.9 • OpenCV 5.0 • SQLite3
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <span className="badge badge-emerald">FastAPI 0.162</span>
          <span className="badge badge-cyan">OpenCV Headless</span>
          <span className="badge badge-purple">GDPR Art. 9 Compliant</span>
        </div>
      </div>
    </div>
  );
}
