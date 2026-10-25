import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Target, 
  Clock, 
  Info
} from 'lucide-react';
import { fetchMatchDetail } from '../api';

export default function MatchAnalysisTab({ matches }) {
  const [selectedId, setSelectedId] = useState(matches?.[0]?.id || 1);
  const [matchDetail, setMatchDetail] = useState(null);
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedId) {
      setLoading(true);
      fetchMatchDetail(selectedId)
        .then((data) => setMatchDetail(data))
        .catch((err) => console.error("Error loading match:", err))
        .finally(() => setLoading(false));
    }
  }, [selectedId]);

  const activeMatch = matchDetail || matches?.find((m) => m.id === selectedId) || matches?.[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.5vw, 24px)' }}>
      {/* Top Selector Bar */}
      <div className="glass-panel" style={{ padding: 'clamp(12px, 2vw, 16px) clamp(14px, 2.5vw, 20px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart3 size={18} color="var(--emerald-neon)" />
          <span style={{ fontSize: 'clamp(0.85rem, 2vw, 0.95rem)', fontWeight: 700 }}>Select Match Analysis:</span>
        </div>

        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', maxWidth: '100%', paddingBottom: '4px', scrollbarWidth: 'none' }}>
          {matches?.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedId(m.id)}
              className={selectedId === m.id ? 'btn-primary' : 'btn-secondary'}
              style={{ fontSize: '0.78rem', padding: '6px 10px', flexShrink: 0 }}
            >
              {m.home_team} {m.home_score} - {m.away_score} {m.away_team}
            </button>
          ))}
        </div>
      </div>

      {activeMatch && (
        <div className="grid-2col-responsive">
          {/* Left Column: Match Scoreboard & Stat Comparison */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.5vw, 20px)' }}>
            {/* Header Score Card */}
            <div className="glass-panel" style={{ padding: 'clamp(16px, 2.5vw, 24px)', textAlign: 'center' }}>
              <span className="badge badge-purple" style={{ marginBottom: '10px', fontSize: '0.66rem' }}>
                {activeMatch.competition} • {activeMatch.match_date}
              </span>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', margin: '14px 0', gap: '8px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 'clamp(1rem, 2.5vw, 1.3rem)', fontWeight: 800 }}>{activeMatch.home_team}</div>
                  <span className="badge badge-emerald" style={{ marginTop: '4px', fontSize: '0.62rem' }}>Home</span>
                </div>

                <div style={{
                  padding: '8px clamp(12px, 3vw, 22px)',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(255, 255, 255, 0.07)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
                  fontWeight: 900,
                  letterSpacing: '0.06em',
                  flexShrink: 0
                }}>
                  {activeMatch.home_score} : {activeMatch.away_score}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 'clamp(1rem, 2.5vw, 1.3rem)', fontWeight: 800 }}>{activeMatch.away_team}</div>
                  <span className="badge badge-cyan" style={{ marginTop: '4px', fontSize: '0.62rem' }}>Away</span>
                </div>
              </div>

              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {activeMatch.tactical_summary}
              </p>
            </div>

            {/* In-depth Stats Comparison Grid */}
            <div className="glass-panel" style={{ padding: 'clamp(16px, 2.5vw, 24px)' }}>
              <h4 style={{ fontSize: '0.96rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Target size={17} color="var(--emerald-neon)" />
                Core Tactical Telemetry Comparison
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Expected Goals */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                    <span style={{ color: 'var(--emerald-neon)' }}>{activeMatch.xg_home} xG</span>
                    <span style={{ color: 'var(--text-muted)' }}>Expected Goals (xG)</span>
                    <span style={{ color: 'var(--cyan-neon)' }}>{activeMatch.xg_away} xG</span>
                  </div>
                  <div style={{ height: '7px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.08)', display: 'flex', overflow: 'hidden' }}>
                    <div style={{ width: `${(activeMatch.xg_home / (activeMatch.xg_home + activeMatch.xg_away + 0.01)) * 100}%`, background: 'var(--emerald-neon)' }} />
                    <div style={{ width: `${(activeMatch.xg_away / (activeMatch.xg_home + activeMatch.xg_away + 0.01)) * 100}%`, background: 'var(--cyan-neon)' }} />
                  </div>
                </div>

                {/* Possession */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 600, marginBottom: '4px' }}>
                    <span style={{ color: 'var(--emerald-neon)' }}>{activeMatch.possession_home}%</span>
                    <span style={{ color: 'var(--text-muted)' }}>Ball Possession</span>
                    <span style={{ color: 'var(--cyan-neon)' }}>{activeMatch.possession_away}%</span>
                  </div>
                  <div style={{ height: '7px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.08)', display: 'flex', overflow: 'hidden' }}>
                    <div style={{ width: `${activeMatch.possession_home}%`, background: 'var(--emerald-neon)' }} />
                    <div style={{ width: `${activeMatch.possession_away}%`, background: 'var(--cyan-neon)' }} />
                  </div>
                </div>

                {/* Shots & On Target */}
                <div className="grid-slider-pair" style={{ marginTop: '4px' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>TOTAL SHOTS</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                      <span style={{ color: 'var(--emerald-neon)' }}>{activeMatch.shots_home}</span> : <span style={{ color: 'var(--cyan-neon)' }}>{activeMatch.shots_away}</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      On Target: {activeMatch.shots_on_target_home} vs {activeMatch.shots_on_target_away}
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>PASS COMPLETION</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                      <span style={{ color: 'var(--emerald-neon)' }}>{activeMatch.pass_accuracy_home}%</span> : <span style={{ color: 'var(--cyan-neon)' }}>{activeMatch.pass_accuracy_away}%</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      Total: {activeMatch.passes_home} vs {activeMatch.passes_away}
                    </div>
                  </div>
                </div>

                {/* Corners & Fouls */}
                <div className="grid-slider-pair">
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>CORNERS</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                      <span style={{ color: 'var(--emerald-neon)' }}>{activeMatch.corners_home}</span> : <span style={{ color: 'var(--cyan-neon)' }}>{activeMatch.corners_away}</span>
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>FOULS COMMITTED</div>
                    <div style={{ fontSize: '1.15rem', fontWeight: 800, marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                      <span style={{ color: 'var(--emerald-neon)' }}>{activeMatch.fouls_home}</span> : <span style={{ color: 'var(--cyan-neon)' }}>{activeMatch.fouls_away}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Shot Map & Timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.5vw, 20px)' }}>
            {/* Interactive SVG Pitch Shot Map */}
            <div className="glass-panel" style={{ padding: 'clamp(16px, 2.5vw, 24px)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>
                    Attacking Half Shot & Event Map
                  </h4>
                  <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                    Visualizing Euclidean coordinates & xG radius
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px', fontSize: '0.72rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--emerald-neon)' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--emerald-neon)' }} />
                    Goal
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--cyan-neon)' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--cyan-neon)' }} />
                    Shot
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--purple-neon)' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--purple-neon)' }} />
                    VAR Check
                  </span>
                </div>
              </div>

              {/* Pitch Canvas (SVG) */}
              <div style={{
                width: '100%',
                aspectRatio: '16/10',
                background: 'linear-gradient(180deg, #123d20 0%, #0d2e18 100%)',
                borderRadius: 'var(--radius-sm)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.6)'
              }}>
                <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', position: 'absolute' }}>
                  {/* Pitch stripes */}
                  {[...Array(6)].map((_, i) => (
                    <rect key={i} x={i * 16.66} y="0" width="8.33" height="100" fill="rgba(255, 255, 255, 0.03)" />
                  ))}

                  {/* Pitch lines */}
                  <line x1="10" y1="0" x2="10" y2="100" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="0.8" />
                  <circle cx="10" cy="50" r="16" fill="none" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="0.8" />
                  <rect x="75" y="20" width="25" height="60" fill="none" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="0.8" />
                  <rect x="90" y="35" width="10" height="30" fill="none" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="0.8" />
                  <circle cx="85" cy="50" r="1" fill="rgba(255, 255, 255, 0.8)" />
                  <path d="M 75 38 A 12 12 0 0 0 75 62" fill="none" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="0.8" />
                  <rect x="98.5" y="42" width="2" height="16" fill="rgba(255, 255, 255, 0.6)" />

                  {/* Render Shot Events */}
                  {activeMatch.events?.map((e) => {
                    const isGoal = e.event_type === 'goal';
                    const isVAR = e.event_type === 'var_check';
                    const color = isGoal ? 'var(--emerald-neon)' : isVAR ? 'var(--purple-neon)' : 'var(--cyan-neon)';
                    const radius = isGoal ? Math.max(3.2, (e.xg_value || 0.4) * 5.5) : isVAR ? 3.5 : Math.max(2.2, (e.xg_value || 0.2) * 4.5);

                    return (
                      <g 
                        key={e.id}
                        onMouseEnter={() => setHoveredEvent(e)}
                        onMouseLeave={() => setHoveredEvent(null)}
                        onClick={() => setHoveredEvent(e)}
                        style={{ cursor: 'pointer' }}
                      >
                        <circle
                          cx={e.x_coord}
                          cy={e.y_coord}
                          r={radius + 1.5}
                          fill="none"
                          stroke={color}
                          strokeWidth="0.6"
                          opacity="0.6"
                          className={isGoal ? "pulsing-dot" : ""}
                        />
                        <circle
                          cx={e.x_coord}
                          cy={e.y_coord}
                          r={radius}
                          fill={color}
                        />
                        <text
                          x={e.x_coord}
                          y={e.y_coord - radius - 1.2}
                          fontSize="2.8"
                          fill="#ffffff"
                          textAnchor="middle"
                          fontWeight="700"
                        >
                          {e.minute}'
                        </text>
                      </g>
                    );
                  })}
                </svg>

                {/* Event Hover Card Tooltip */}
                {hoveredEvent && (
                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '8px',
                    right: '8px',
                    background: 'rgba(15, 23, 42, 0.94)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 12px',
                    fontSize: '0.78rem',
                    zIndex: 10,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <span style={{ fontWeight: 700, color: hoveredEvent.event_type === 'goal' ? 'var(--emerald-neon)' : 'var(--text-primary)' }}>
                        {hoveredEvent.minute}' • {hoveredEvent.player_name} ({hoveredEvent.team})
                      </span>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.74rem' }}>
                        {hoveredEvent.description}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>
                      <div style={{ color: 'var(--emerald-neon)', fontWeight: 800 }}>xG: {hoveredEvent.xg_value}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Key Timeline Events */}
            <div className="glass-panel" style={{ padding: 'clamp(16px, 2.5vw, 24px)' }}>
              <h4 style={{ fontSize: '0.96rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={17} color="var(--cyan-neon)" />
                Key Match Events & Officiating Review
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                {activeMatch.events?.map((ev) => (
                  <div 
                    key={ev.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      background: ev.event_type === 'var_check' ? 'rgba(168, 85, 247, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                      borderLeft: `3px solid ${ev.event_type === 'goal' ? 'var(--emerald-neon)' : ev.event_type === 'var_check' ? 'var(--purple-neon)' : 'var(--cyan-neon)'}`,
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      gap: '8px'
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 700, marginRight: '6px', fontFamily: 'var(--font-mono)' }}>
                        {ev.minute}'
                      </span>
                      <span style={{ fontWeight: 600 }}>{ev.player_name}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.74rem', marginLeft: '4px' }}>({ev.team})</span>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        {ev.description}
                      </div>
                    </div>

                    {ev.xg_value > 0 && (
                      <span className="badge badge-emerald" style={{ fontSize: '0.68rem', flexShrink: 0 }}>
                        {ev.xg_value} xG
                      </span>
                    )}
                    {ev.event_type === 'var_check' && (
                      <span className="badge badge-purple" style={{ fontSize: '0.68rem', flexShrink: 0 }}>
                        SAOT Margin
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Officiating Context Note */}
              <div style={{
                marginTop: '14px',
                padding: '10px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'rgba(168, 85, 247, 0.08)',
                border: '1px solid rgba(168, 85, 247, 0.25)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                fontSize: '0.76rem',
                color: 'var(--text-secondary)'
              }}>
                <Info size={15} color="var(--purple-neon)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  <strong>Officiating Analysis:</strong> Notice the 44' minute SAOT offside ruling. 
                  At 50Hz optical camera recording, player velocity of 8.5 m/s creates 
                  an inherent physical margin of error of ±4.2cm — demonstrating the risk of false precision in sub-centimeter offsides.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
