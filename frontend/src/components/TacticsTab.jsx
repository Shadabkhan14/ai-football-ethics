import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Zap,
  Info
} from 'lucide-react';
import { fetchTactics } from '../api';

export default function TacticsTab() {
  const [tacticsList, setTacticsList] = useState([]);
  const [selectedTactic, setSelectedTactic] = useState(null);
  const [activePlayer, setActivePlayer] = useState(null);

  useEffect(() => {
    fetchTactics()
      .then((data) => {
        setTacticsList(data);
        if (data.length > 0) {
          setSelectedTactic(data[0]);
          setActivePlayer(data[0].player_nodes?.[7] || data[0].player_nodes?.[0]);
        }
      })
      .catch((err) => console.error("Error loading tactics:", err));
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.5vw, 24px)' }}>
      {/* Header Info */}
      <div className="glass-panel" style={{ padding: 'clamp(16px, 2.5vw, 24px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <Cpu size={20} color="var(--emerald-neon)" />
              <h3 style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.25rem)', fontWeight: 800 }}>
                Tactical Strategy Board & Spatial Formation Analysis
              </h3>
              <span className="badge badge-emerald">Positional AI Engine</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Simulates spatial configurations, rest defense structures, pressing zones, and passing lane connectivity.
            </p>
          </div>

          {/* Formation Toggle */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {tacticsList.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setSelectedTactic(t);
                  setActivePlayer(t.player_nodes?.[7] || t.player_nodes?.[0]);
                }}
                className={selectedTactic?.id === t.id ? "btn-primary" : "btn-secondary"}
                style={{ fontSize: '0.78rem', padding: '6px 12px' }}
              >
                {t.formation_name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {selectedTactic && (
        <div className="grid-2col-responsive">
          {/* Left Column: Interactive 2D Tactical Pitch */}
          <div className="glass-panel" style={{ padding: 'clamp(16px, 2.5vw, 24px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>
                  {selectedTactic.team_name} — {selectedTactic.formation_name}
                </h4>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                  Click any player node to view tactical role & spatial instructions
                </p>
              </div>

              <span className="badge badge-cyan" style={{ fontSize: '0.66rem' }}>{selectedTactic.system_philosophy}</span>
            </div>

            {/* Pitch Canvas (SVG) */}
            <div style={{
              width: '100%',
              aspectRatio: '16/11',
              background: 'linear-gradient(180deg, #114221 0%, #0d3419 100%)',
              borderRadius: 'var(--radius-sm)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.6)'
            }}>
              <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', position: 'absolute' }}>
                {/* Grass stripes */}
                {[...Array(8)].map((_, i) => (
                  <rect key={i} x={i * 12.5} y="0" width="6.25" height="100" fill="rgba(255, 255, 255, 0.03)" />
                ))}

                {/* Pitch Outlines */}
                <rect x="5" y="5" width="90" height="90" fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="0.8" />
                <line x1="50" y1="5" x2="50" y2="95" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="0.8" />
                <circle cx="50" cy="50" r="14" fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="0.8" />
                <circle cx="50" cy="50" r="1" fill="rgba(255, 255, 255, 0.6)" />

                {/* Left Penalty Area */}
                <rect x="5" y="24" width="16" height="52" fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="0.8" />
                <rect x="5" y="36" width="6" height="28" fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="0.8" />
                <path d="M 21 38 A 12 12 0 0 1 21 62" fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="0.8" />

                {/* Right Penalty Area */}
                <rect x="79" y="24" width="16" height="52" fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="0.8" />
                <rect x="89" y="36" width="6" height="28" fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="0.8" />
                <path d="M 79 38 A 12 12 0 0 0 79 62" fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="0.8" />

                {/* Draw Passing Lanes */}
                {activePlayer && selectedTactic.player_nodes?.map((other) => {
                  if (other.number === activePlayer.number) return null;
                  const dx = other.x - activePlayer.x;
                  const dy = other.y - activePlayer.y;
                  const dist = Math.sqrt(dx * dx + dy * dy);
                  if (dist < 32) {
                    return (
                      <line
                        key={`lane-${other.number}`}
                        x1={activePlayer.x}
                        y1={activePlayer.y}
                        x2={other.x}
                        y2={other.y}
                        stroke="rgba(16, 185, 129, 0.4)"
                        strokeWidth="0.6"
                        strokeDasharray="1.5,1.5"
                      />
                    );
                  }
                  return null;
                })}

                {/* Render Player Nodes */}
                {selectedTactic.player_nodes?.map((p) => {
                  const isCurrent = activePlayer?.number === p.number;
                  return (
                    <g
                      key={p.number}
                      onClick={() => setActivePlayer(p)}
                      style={{ cursor: 'pointer' }}
                    >
                      {isCurrent && (
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r="4.2"
                          fill="none"
                          stroke="var(--emerald-neon)"
                          strokeWidth="0.8"
                          className="pulsing-dot"
                        />
                      )}

                      <circle
                        cx={p.x}
                        cy={p.y}
                        r="3.2"
                        fill={isCurrent ? "var(--emerald-neon)" : "#1e293b"}
                        stroke={isCurrent ? "#ffffff" : "var(--cyan-neon)"}
                        strokeWidth="0.8"
                      />

                      <text
                        x={p.x}
                        y={p.y + 1.1}
                        fontSize="2.4"
                        fill={isCurrent ? "#000000" : "#ffffff"}
                        fontWeight="800"
                        textAnchor="middle"
                      >
                        {p.number}
                      </text>

                      <text
                        x={p.x}
                        y={p.y + 5.2}
                        fontSize="2.2"
                        fill="#f8fafc"
                        fontWeight="600"
                        textAnchor="middle"
                      >
                        {p.name}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Right Column: Selected Node Info & Tactical Settings */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.5vw, 20px)' }}>
            {/* Active Player Card */}
            {activePlayer && (
              <div className="glass-panel" style={{ padding: 'clamp(16px, 2.5vw, 24px)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, var(--emerald-neon), var(--cyan-neon))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 900, color: '#000000', fontSize: '0.9rem', fontFamily: 'var(--font-mono)'
                    }}>
                      {activePlayer.number}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800 }}>{activePlayer.name}</h4>
                      <div style={{ fontSize: '0.76rem', color: 'var(--emerald-neon)', fontWeight: 600 }}>
                        {activePlayer.role}
                      </div>
                    </div>
                  </div>
                  <span className="badge badge-emerald" style={{ fontSize: '0.64rem' }}>Node</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>POSITIONAL INSTRUCTION</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-primary)', marginTop: '2px', lineHeight: 1.4 }}>
                      Operates in the half-space channels to generate numerical overloads, drawing opposing pivots out of position.
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>COORDINATES (PITCH MATRIX)</div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--cyan-neon)', fontFamily: 'var(--font-mono)' }}>
                      X: {activePlayer.x}% • Y: {activePlayer.y}%
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tactical System Parameters */}
            <div className="glass-panel" style={{ padding: 'clamp(16px, 2.5vw, 24px)' }}>
              <h4 style={{ fontSize: '0.96rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={17} color="var(--cyan-neon)" />
                Team Tactical Constants
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 10px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Pressing Intensity:</span>
                  <span style={{ fontWeight: 700, color: 'var(--emerald-neon)' }}>{selectedTactic.pressing_intensity}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 10px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Defensive Line Height:</span>
                  <span style={{ fontWeight: 700, color: 'var(--cyan-neon)' }}>{selectedTactic.defensive_line}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 10px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Attacking Width:</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{selectedTactic.attacking_width}</span>
                </div>
              </div>

              {/* Research Connection */}
              <div style={{
                marginTop: '12px',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(168, 85, 247, 0.08)',
                border: '1px solid rgba(168, 85, 247, 0.25)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                fontSize: '0.74rem',
                color: 'var(--text-secondary)'
              }}>
                <Info size={14} color="var(--purple-neon)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  <strong>Ethical Dimension:</strong> Automated tactical AI systems must preserve managerial 
                  discretion. Rigid reliance on algorithms risks penalizing players who display creative spontaneity outside 
                  prescribed Euclidean positional heatmaps.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
