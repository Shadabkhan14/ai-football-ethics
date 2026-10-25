import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Sliders, 
  Zap,
  Info
} from 'lucide-react';
import { estimateInjuryRisk } from '../api';

const workloadPresets = [
  {
    name: "Safe Adaptation (Sweet Spot)",
    params: {
      acute_load: 4600, chronic_load: 4200, sprint_distance: 750,
      days_between_matches: 6, prev_injuries: 0, soreness: 2, sleep_hours: 8.5, age: 23
    }
  },
  {
    name: "Fixture Congestion Spike",
    params: {
      acute_load: 7200, chronic_load: 4400, sprint_distance: 1300,
      days_between_matches: 3, prev_injuries: 2, soreness: 7, sleep_hours: 5.8, age: 29
    }
  },
  {
    name: "Undertraining Hazard",
    params: {
      acute_load: 2200, chronic_load: 3900, sprint_distance: 400,
      days_between_matches: 7, prev_injuries: 1, soreness: 3, sleep_hours: 7.5, age: 26
    }
  }
];

export default function InjuryRiskTab() {
  const [params, setParams] = useState(workloadPresets[1].params);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculateRisk = () => {
    setLoading(true);
    estimateInjuryRisk(params)
      .then((res) => setResult(res))
      .catch((err) => console.error("Injury estimation failed:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    calculateRisk();
  }, []);

  const acwr = Math.round((params.acute_load / (params.chronic_load + 1e-5)) * 100) / 100;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.5vw, 24px)' }}>
      {/* Header Card */}
      <div className="glass-panel" style={{ padding: 'clamp(16px, 2.5vw, 24px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <Activity size={20} color="var(--amber-neon)" />
              <h3 style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.25rem)', fontWeight: 800 }}>
                Workload Telemetry & Tim Gabbett's ACWR Injury Engine
              </h3>
              <span className="badge badge-amber">Gradient Boosting Model</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Estimates neuromuscular strain and hamstring tear risk based on Acute:Chronic Workload Ratio (ACWR) and physiological load spikes.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {workloadPresets.map((p) => (
              <button
                key={p.name}
                onClick={() => setParams(p.params)}
                className="btn-secondary"
                style={{ fontSize: '0.76rem', padding: '5px 10px' }}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid-2col-responsive">
        {/* Left Column: Sliders */}
        <div className="glass-panel" style={{ padding: 'clamp(16px, 2.5vw, 26px)' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={17} color="var(--emerald-neon)" />
            Player Workload & Recovery Variables
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Acute Load vs Chronic Load */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--emerald-neon)', fontWeight: 600 }}>Acute 7d: {params.acute_load} AU</span>
                <span style={{ color: 'var(--cyan-neon)', fontWeight: 600 }}>Chronic 28d: {params.chronic_load} AU</span>
              </div>
              <div className="grid-slider-pair">
                <input
                  type="range" min="2000" max="8500" step="100"
                  value={params.acute_load}
                  onChange={(e) => setParams({ ...params, acute_load: parseFloat(e.target.value) })}
                  style={{ accentColor: 'var(--emerald-neon)' }}
                />
                <input
                  type="range" min="2000" max="7500" step="100"
                  value={params.chronic_load}
                  onChange={(e) => setParams({ ...params, chronic_load: parseFloat(e.target.value) })}
                  style={{ accentColor: 'var(--cyan-neon)' }}
                />
              </div>
            </div>

            {/* Sprint Distance */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Sprint Distance (&gt;25.2 km/h)</span>
                <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--amber-neon)' }}>{params.sprint_distance}m</span>
              </div>
              <input
                type="range" min="300" max="1800" step="50"
                value={params.sprint_distance}
                onChange={(e) => setParams({ ...params, sprint_distance: parseFloat(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--amber-neon)' }}
              />
            </div>

            {/* Fixture Congestion & Sleep Hours */}
            <div className="grid-slider-pair">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Match Gap</span>
                  <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{params.days_between_matches}d</span>
                </div>
                <input
                  type="range" min="2" max="8" step="1"
                  value={params.days_between_matches}
                  onChange={(e) => setParams({ ...params, days_between_matches: parseInt(e.target.value) })}
                  style={{ width: '100%', accentColor: 'var(--cyan-neon)' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Sleep Recovery</span>
                  <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{params.sleep_hours}h</span>
                </div>
                <input
                  type="range" min="4.5" max="10.0" step="0.5"
                  value={params.sleep_hours}
                  onChange={(e) => setParams({ ...params, sleep_hours: parseFloat(e.target.value) })}
                  style={{ width: '100%', accentColor: 'var(--purple-neon)' }}
                />
              </div>
            </div>

            {/* Soreness & Prior Strains */}
            <div className="grid-slider-pair">
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Soreness Scale</span>
                  <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{params.soreness} / 10</span>
                </div>
                <input
                  type="range" min="1" max="10" step="1"
                  value={params.soreness}
                  onChange={(e) => setParams({ ...params, soreness: parseInt(e.target.value) })}
                  style={{ width: '100%', accentColor: 'var(--crimson-neon)' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Prior Strains</span>
                  <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{params.prev_injuries} tears</span>
                </div>
                <input
                  type="range" min="0" max="4" step="1"
                  value={params.prev_injuries}
                  onChange={(e) => setParams({ ...params, prev_injuries: parseInt(e.target.value) })}
                  style={{ width: '100%', accentColor: 'var(--crimson-neon)' }}
                />
              </div>
            </div>

            <button
              onClick={calculateRisk}
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}
            >
              {loading ? 'Evaluating Biomechanical Model...' : 'Run Workload Risk Evaluation'}
            </button>
          </div>
        </div>

        {/* Right Column: ACWR Spectrum & Risk Prediction */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.5vw, 20px)' }}>
          {/* Gabbett ACWR Spectrum Gauge */}
          <div className="glass-panel" style={{ padding: 'clamp(16px, 2.5vw, 24px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '6px' }}>
              <h4 style={{ fontSize: '0.96rem', fontWeight: 700 }}>
                ACWR Index Spectrum (Tim Gabbett Consensus)
              </h4>
              <span className="badge" style={{ background: acwr > 1.45 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)', color: acwr > 1.45 ? 'var(--crimson-neon)' : 'var(--emerald-neon)' }}>
                ACWR: {acwr}
              </span>
            </div>

            {/* Spectrum Visual Bar */}
            <div style={{ position: 'relative', marginTop: '22px', marginBottom: '28px' }}>
              <div style={{ height: '12px', borderRadius: '6px', display: 'flex', overflow: 'hidden' }}>
                <div style={{ width: '25%', background: '#38bdf8' }} title="Undertraining (<0.8)" />
                <div style={{ width: '40%', background: '#10b981' }} title="Sweet Spot (0.8 - 1.3)" />
                <div style={{ width: '15%', background: '#f59e0b' }} title="Elevated (1.3 - 1.45)" />
                <div style={{ width: '20%', background: '#ef4444' }} title="Hazard Zone (>1.45)" />
              </div>

              {/* Cursor indicator */}
              <div style={{
                position: 'absolute',
                top: '-16px',
                left: `${Math.min(97, Math.max(3, (acwr / 2.0) * 100))}%`,
                transform: 'translateX(-50%)',
                textAlign: 'center',
                transition: 'left 0.2s ease'
              }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#ffffff', background: 'rgba(0,0,0,0.85)', padding: '2px 5px', borderRadius: '4px' }}>
                  ▼ {acwr}
                </div>
              </div>

              {/* Spectrum Labels */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'clamp(0.66rem, 1.6vw, 0.72rem)', color: 'var(--text-muted)', marginTop: '8px', flexWrap: 'wrap' }}>
                <span>&lt;0.8 Undertrained</span>
                <span style={{ color: 'var(--emerald-neon)', fontWeight: 600 }}>0.8 - 1.3 Sweet Spot</span>
                <span style={{ color: 'var(--amber-neon)' }}>1.3 - 1.45 Caution</span>
                <span style={{ color: 'var(--crimson-neon)', fontWeight: 600 }}>&gt;1.45 Danger</span>
              </div>
            </div>

            {/* Risk Output Summary */}
            {result && (
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${result.risk_color}`,
                borderRadius: 'var(--radius-sm)',
                padding: '14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>PREDICTED STRAIN RISK</div>
                  <div style={{ fontSize: 'clamp(1.3rem, 3.5vw, 1.6rem)', fontWeight: 900, color: result.risk_color, fontFamily: 'var(--font-mono)' }}>
                    {result.risk_score_percent}%
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: result.risk_color, marginTop: '2px' }}>
                    {result.risk_category}
                  </div>
                </div>

                <div style={{ maxWidth: '280px', textAlign: 'right', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                  {result.recommendation}
                </div>
              </div>
            )}
          </div>

          {/* Explainable AI Risk Drivers (SHAP) */}
          {result && (
            <div className="glass-panel" style={{ padding: 'clamp(16px, 2.5vw, 24px)' }}>
              <h4 style={{ fontSize: '0.96rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={17} color="var(--amber-neon)" />
                Workload Risk Contributing Factors (SHAP Breakdown)
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {result.top_drivers?.map((d, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', padding: '7px 10px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)' }}>
                    <div>
                      <span style={{ fontWeight: 600 }}>{d.factor}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginLeft: '6px' }}>({d.value})</span>
                    </div>
                    <span style={{ color: d.impact > 10 ? 'var(--crimson-neon)' : 'var(--amber-neon)', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                      +{d.impact}%
                    </span>
                  </div>
                ))}
              </div>

              {/* Research Connection Note */}
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
                  <strong>Ethical Governance Warning:</strong> While ACWR provides genuine physiological protection, 
                  clubs have increasingly leveraged proprietary injury hazard scores during wage negotiations to devalue players' contract 
                  extensions without independent medical audit rights.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
