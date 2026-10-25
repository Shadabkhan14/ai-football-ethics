import React, { useState } from 'react';
import { 
  Users, 
  Search,
  CheckCircle,
  XCircle,
  FileBadge
} from 'lucide-react';

export default function PlayerAnalyticsTab({ players, setActiveTab }) {
  const [selectedPlayerId, setSelectedPlayerId] = useState(players?.[0]?.id || 1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPos, setFilterPos] = useState('ALL');

  const filteredPlayers = players?.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.team.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPos = filterPos === 'ALL' || p.position.toLowerCase().includes(filterPos.toLowerCase());
    return matchesSearch && matchesPos;
  });

  const selectedPlayer = players?.find((p) => p.id === selectedPlayerId) || players?.[0];

  const renderRadarChart = (p) => {
    if (!p) return null;
    const sprintNorm = Math.min(100, Math.max(30, (p.max_speed_kmh - 28) * 11));
    const passNorm = Math.min(100, p.pass_completion_rate);
    const tackleNorm = Math.min(100, p.tackle_success_rate * 1.15);
    const enduranceNorm = Math.min(100, Math.max(30, (p.sprint_distance_km - 8) * 18));
    const recoveryNorm = Math.min(100, p.recovery_score);

    const metrics = [
      { label: "Pace", val: sprintNorm, angle: -90 },
      { label: "Passing", val: passNorm, angle: -18 },
      { label: "Tackling", val: tackleNorm, angle: 54 },
      { label: "Stamina", val: enduranceNorm, angle: 126 },
      { label: "Recovery", val: recoveryNorm, angle: 198 }
    ];

    const center = 100;
    const r = 70;

    const points = metrics.map((m) => {
      const rad = (m.angle * Math.PI) / 180;
      const dist = (m.val / 100) * r;
      return `${center + dist * Math.cos(rad)},${center + dist * Math.sin(rad)}`;
    }).join(" ");

    return (
      <svg viewBox="0 0 200 200" style={{ width: '100%', maxWidth: '240px', margin: '0 auto', display: 'block' }}>
        {[0.3, 0.6, 1].map((scale, i) => (
          <polygon
            key={i}
            points={metrics.map(m => {
              const rad = (m.angle * Math.PI) / 180;
              const dist = scale * r;
              return `${center + dist * Math.cos(rad)},${center + dist * Math.sin(rad)}`;
            }).join(" ")}
            fill="none"
            stroke="rgba(255, 255, 255, 0.12)"
            strokeWidth="1"
          />
        ))}

        {metrics.map((m, i) => {
          const rad = (m.angle * Math.PI) / 180;
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={center + r * Math.cos(rad)}
              y2={center + r * Math.sin(rad)}
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="1"
            />
          );
        })}

        <polygon
          points={points}
          fill="rgba(16, 185, 129, 0.3)"
          stroke="var(--emerald-neon)"
          strokeWidth="2"
        />

        {metrics.map((m, i) => {
          const rad = (m.angle * Math.PI) / 180;
          const labelDist = r + 18;
          return (
            <text
              key={i}
              x={center + labelDist * Math.cos(rad)}
              y={center + labelDist * Math.sin(rad) + 4}
              fontSize="9"
              fill="var(--text-secondary)"
              textAnchor="middle"
              fontWeight="600"
            >
              {m.label} ({Math.round(m.val)})
            </text>
          );
        })}
      </svg>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.5vw, 24px)' }}>
      {/* Top Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: 'clamp(12px, 2vw, 16px) clamp(14px, 2.5vw, 20px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Users size={18} color="var(--emerald-neon)" />
          <span style={{ fontSize: 'clamp(0.85rem, 2vw, 0.96rem)', fontWeight: 700 }}>Squad Telemetry Database</span>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', width: '100%', maxWidth: '600px', justifyContent: 'flex-end' }}>
          {/* Position Filters */}
          <div style={{ display: 'flex', gap: '5px', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '2px' }}>
            {['ALL', 'Forward', 'Midfielder', 'Back', 'Scouting Pool'].map((pos) => (
              <button
                key={pos}
                onClick={() => setFilterPos(pos)}
                className={filterPos === pos ? 'btn-primary' : 'btn-secondary'}
                style={{ fontSize: '0.74rem', padding: '4px 10px', flexShrink: 0 }}
              >
                {pos}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '160px', flex: '1 1 180px' }}>
            <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
            <input
              type="text"
              placeholder="Search player or team..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-glass"
              style={{ paddingLeft: '30px', fontSize: '0.78rem', height: '34px' }}
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Player Directory on Left, Detailed Telemetry on Right */}
      <div className="grid-2col-responsive">
        {/* Left Column: Player Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '550px', overflowY: 'auto' }}>
          {filteredPlayers?.map((p) => {
            const isSelected = p.id === selectedPlayerId;
            const isHighRisk = p.injury_risk_category.includes("High") || p.acwr_ratio > 1.45;

            return (
              <div
                key={p.id}
                onClick={() => setSelectedPlayerId(p.id)}
                className="glass-panel"
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  borderColor: isSelected ? 'var(--emerald-neon)' : 'var(--border-glass)',
                  background: isSelected ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-card)',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>#{p.jersey_number}</span>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.team} • {p.position}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--emerald-neon)', fontSize: '0.86rem' }}>
                      €{p.market_value_m}M
                    </div>
                    <span 
                      className={isHighRisk ? "badge badge-crimson" : "badge badge-emerald"} 
                      style={{ fontSize: '0.62rem', marginTop: '3px' }}
                    >
                      ACWR {p.acwr_ratio}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Detailed Player Telemetry & Ethics Profile */}
        {selectedPlayer && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.5vw, 20px)' }}>
            {/* Player Bio Card */}
            <div className="glass-panel" style={{ padding: 'clamp(16px, 2.5vw, 24px)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: 'clamp(1.15rem, 3vw, 1.35rem)', fontWeight: 900 }}>{selectedPlayer.name}</h3>
                    <span className="badge badge-cyan">#{selectedPlayer.jersey_number}</span>
                    <span className="badge badge-purple">{selectedPlayer.nationality}</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {selectedPlayer.team} • {selectedPlayer.position} • Age: {selectedPlayer.age}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ESTIMATED VALUE</div>
                  <div style={{ fontSize: 'clamp(1.3rem, 3.5vw, 1.7rem)', fontWeight: 900, color: 'var(--emerald-neon)', fontFamily: 'var(--font-mono)' }}>
                    €{selectedPlayer.market_value_m}M
                  </div>
                </div>
              </div>

              {/* Radar & Metrics Split */}
              <div className="grid-2col-equal" style={{ marginTop: '20px', alignItems: 'center' }}>
                {/* Custom SVG Radar */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    MULTIDIMENSIONAL PROFILE
                  </div>
                  {renderRadarChart(selectedPlayer)}
                </div>

                {/* Biometric Telemetry */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>MAX SPRINT VELOCITY</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--cyan-neon)', fontFamily: 'var(--font-mono)' }}>
                      {selectedPlayer.max_speed_kmh} km/h
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>SPRINT VOLUME / MATCH</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                      {selectedPlayer.high_speed_runs} sprints ({selectedPlayer.sprint_distance_km} km)
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>PASS & TACKLE SUCCESS</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--emerald-neon)', fontFamily: 'var(--font-mono)' }}>
                      {selectedPlayer.pass_completion_rate}% / {selectedPlayer.tackle_success_rate}%
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ACWR WORKLOAD RISK</div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: selectedPlayer.acwr_ratio > 1.45 ? 'var(--crimson-neon)' : 'var(--emerald-neon)' }}>
                          {selectedPlayer.acwr_ratio} ({selectedPlayer.injury_risk_category})
                        </div>
                      </div>
                      <button 
                        onClick={() => setActiveTab('injury')}
                        className="btn-secondary" 
                        style={{ fontSize: '0.7rem', padding: '3px 8px' }}
                      >
                        Deep ACWR
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ethical Profile & Data Sovereignty Card */}
            <div className="glass-panel" style={{ padding: 'clamp(16px, 2.5vw, 24px)', borderLeft: '4px solid var(--purple-neon)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '6px' }}>
                <h4 style={{ fontSize: '0.96rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileBadge size={16} color="var(--purple-neon)" />
                  Athlete Data Sovereignty & GDPR Article 9 Profile
                </h4>
                <span className="badge badge-purple" style={{ fontSize: '0.66rem' }}>Compliance Profile</span>
              </div>

              <div className="grid-slider-pair" style={{ marginBottom: '12px' }}>
                <div style={{ background: 'rgba(168, 85, 247, 0.06)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>GDPR ARTICLE 9 CONSENT STATUS</div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, marginTop: '2px', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle size={14} color="var(--emerald-neon)" />
                    {selectedPlayer.gdpr_consent_status}
                  </div>
                </div>

                <div style={{ background: 'rgba(168, 85, 247, 0.06)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>BETTING & BROADCAST BIOMETRICS</div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, marginTop: '2px', color: selectedPlayer.biometric_commercial_opt_in ? 'var(--emerald-neon)' : 'var(--amber-neon)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {selectedPlayer.biometric_commercial_opt_in ? (
                      <>
                        <CheckCircle size={14} color="var(--emerald-neon)" />
                        Monetization Granted
                      </>
                    ) : (
                      <>
                        <XCircle size={14} color="var(--amber-neon)" />
                        Commercial Feeds Withheld
                      </>
                    )}
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {selectedPlayer.nationality === 'Senegal' ? (
                  <strong style={{ color: 'var(--amber-neon)' }}>
                    Ethical Highlight: Amadou Diallo represents emerging talents evaluated across developing leagues. 
                    Without high-resolution optical tracking, standard scouting models penalize his valuation by up to 34% compared 
                    to European academy counterparts.
                  </strong>
                ) : (
                  <span>
                    Under the EU AI Act (High-Risk Workplace AI) and GDPR Article 9, {selectedPlayer.name} retains the legal right 
                    to mandate cryptographic separation between on-pitch medical telemetry and management contract negotiations.
                  </span>
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
