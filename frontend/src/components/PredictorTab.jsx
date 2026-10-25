import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Cpu, 
  Sliders, 
  Sparkles
} from 'lucide-react';
import { predictMatch } from '../api';

const presets = [
  {
    name: "Real Madrid vs Man City",
    params: {
      home_elo: 1880, away_elo: 1870,
      home_form: 2.5, away_form: 2.3,
      home_xg_avg: 2.3, away_xg_avg: 2.1,
      home_rest_days: 5, away_rest_days: 3
    }
  },
  {
    name: "Arsenal vs Liverpool",
    params: {
      home_elo: 1840, away_elo: 1835,
      home_form: 2.4, away_form: 2.2,
      home_xg_avg: 2.0, away_xg_avg: 1.9,
      home_rest_days: 4, away_rest_days: 4
    }
  },
  {
    name: "Heavy Favorite vs Underdog",
    params: {
      home_elo: 1950, away_elo: 1610,
      home_form: 2.8, away_form: 0.9,
      home_xg_avg: 2.8, away_xg_avg: 0.7,
      home_rest_days: 6, away_rest_days: 3
    }
  }
];

export default function PredictorTab() {
  const [params, setParams] = useState(presets[0].params);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePredict = () => {
    setLoading(true);
    predictMatch(params)
      .then((res) => setPrediction(res))
      .catch((err) => console.error("Prediction error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    handlePredict();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.5vw, 24px)' }}>
      {/* Header Info */}
      <div className="glass-panel" style={{ padding: 'clamp(16px, 2.5vw, 24px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <TrendingUp size={20} color="var(--emerald-neon)" />
              <h3 style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.25rem)', fontWeight: 800 }}>
                AI Match Outcome & Win Probability Engine
              </h3>
              <span className="badge badge-emerald">Scikit-Learn Calibrated Model</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Trained Random Forest Classifier estimating three-way outcomes (Home / Draw / Away) using Elo ratings, form, xG and rest.
            </p>
          </div>

          {/* Presets */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {presets.map((p) => (
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

      {/* Main Grid: Parameters on Left, Prediction Output on Right */}
      <div className="grid-2col-responsive">
        {/* Left Column: Interactive Sliders */}
        <div className="glass-panel" style={{ padding: 'clamp(16px, 2.5vw, 26px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sliders size={17} color="var(--cyan-neon)" />
              Match Simulation Parameters
            </h4>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Adjust to simulate</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Elo Rating */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--emerald-neon)', fontWeight: 600 }}>Home Elo: {params.home_elo}</span>
                <span style={{ color: 'var(--cyan-neon)', fontWeight: 600 }}>Away Elo: {params.away_elo}</span>
              </div>
              <div className="grid-slider-pair">
                <input
                  type="range" min="1500" max="2100" step="10"
                  value={params.home_elo}
                  onChange={(e) => setParams({ ...params, home_elo: parseFloat(e.target.value) })}
                  style={{ accentColor: 'var(--emerald-neon)' }}
                />
                <input
                  type="range" min="1500" max="2100" step="10"
                  value={params.away_elo}
                  onChange={(e) => setParams({ ...params, away_elo: parseFloat(e.target.value) })}
                  style={{ accentColor: 'var(--cyan-neon)' }}
                />
              </div>
            </div>

            {/* Recent Match Form */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--emerald-neon)', fontWeight: 600 }}>Home Form: {params.home_form} pts/g</span>
                <span style={{ color: 'var(--cyan-neon)', fontWeight: 600 }}>Away Form: {params.away_form} pts/g</span>
              </div>
              <div className="grid-slider-pair">
                <input
                  type="range" min="0.5" max="3.0" step="0.1"
                  value={params.home_form}
                  onChange={(e) => setParams({ ...params, home_form: parseFloat(e.target.value) })}
                  style={{ accentColor: 'var(--emerald-neon)' }}
                />
                <input
                  type="range" min="0.5" max="3.0" step="0.1"
                  value={params.away_form}
                  onChange={(e) => setParams({ ...params, away_form: parseFloat(e.target.value) })}
                  style={{ accentColor: 'var(--cyan-neon)' }}
                />
              </div>
            </div>

            {/* Expected Goals Created (xG) */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--emerald-neon)', fontWeight: 600 }}>Home Avg xG: {params.home_xg_avg}</span>
                <span style={{ color: 'var(--cyan-neon)', fontWeight: 600 }}>Away Avg xG: {params.away_xg_avg}</span>
              </div>
              <div className="grid-slider-pair">
                <input
                  type="range" min="0.5" max="3.5" step="0.1"
                  value={params.home_xg_avg}
                  onChange={(e) => setParams({ ...params, home_xg_avg: parseFloat(e.target.value) })}
                  style={{ accentColor: 'var(--emerald-neon)' }}
                />
                <input
                  type="range" min="0.5" max="3.5" step="0.1"
                  value={params.away_xg_avg}
                  onChange={(e) => setParams({ ...params, away_xg_avg: parseFloat(e.target.value) })}
                  style={{ accentColor: 'var(--cyan-neon)' }}
                />
              </div>
            </div>

            {/* Rest Days */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--emerald-neon)', fontWeight: 600 }}>Home Rest: {params.home_rest_days}d</span>
                <span style={{ color: 'var(--cyan-neon)', fontWeight: 600 }}>Away Rest: {params.away_rest_days}d</span>
              </div>
              <div className="grid-slider-pair">
                <input
                  type="range" min="2" max="10" step="1"
                  value={params.home_rest_days}
                  onChange={(e) => setParams({ ...params, home_rest_days: parseInt(e.target.value) })}
                  style={{ accentColor: 'var(--emerald-neon)' }}
                />
                <input
                  type="range" min="2" max="10" step="1"
                  value={params.away_rest_days}
                  onChange={(e) => setParams({ ...params, away_rest_days: parseInt(e.target.value) })}
                  style={{ accentColor: 'var(--cyan-neon)' }}
                />
              </div>
            </div>

            <button
              onClick={handlePredict}
              disabled={loading}
              className="btn-primary"
              style={{ marginTop: '6px', width: '100%', justifyContent: 'center' }}
            >
              {loading ? 'Evaluating Model...' : 'Calculate Win Probabilities'}
            </button>
          </div>
        </div>

        {/* Right Column: Prediction Outcomes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.5vw, 20px)' }}>
          {prediction ? (
            <>
              {/* Win Probability Bar Card */}
              <div className="glass-panel" style={{ padding: 'clamp(16px, 2.5vw, 26px)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>
                    Win Probability Distribution
                  </h4>
                  <span className="badge badge-purple" style={{ fontSize: '0.68rem' }}>
                    Confidence: {prediction.model_confidence}%
                  </span>
                </div>

                {/* Probability Horizontal Stack */}
                <div style={{ height: '34px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', display: 'flex', boxShadow: '0 4px 14px rgba(0,0,0,0.4)', marginBottom: '12px' }}>
                  <div 
                    style={{ 
                      width: `${prediction.probabilities.home_win}%`, 
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: '0.84rem', color: '#ffffff'
                    }}
                    title={`Home Win: ${prediction.probabilities.home_win}%`}
                  >
                    {prediction.probabilities.home_win > 14 && `${prediction.probabilities.home_win}%`}
                  </div>
                  <div 
                    style={{ 
                      width: `${prediction.probabilities.draw}%`, 
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: '0.84rem', color: '#ffffff'
                    }}
                    title={`Draw: ${prediction.probabilities.draw}%`}
                  >
                    {prediction.probabilities.draw > 14 && `${prediction.probabilities.draw}%`}
                  </div>
                  <div 
                    style={{ 
                      width: `${prediction.probabilities.away_win}%`, 
                      background: 'linear-gradient(135deg, #06b6d4, #0284c7)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: '0.84rem', color: '#ffffff'
                    }}
                    title={`Away Win: ${prediction.probabilities.away_win}%`}
                  >
                    {prediction.probabilities.away_win > 14 && `${prediction.probabilities.away_win}%`}
                  </div>
                </div>

                {/* Legend */}
                <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: 'clamp(0.72rem, 1.8vw, 0.8rem)', fontWeight: 600, flexWrap: 'wrap', gap: '6px' }}>
                  <span style={{ color: 'var(--emerald-neon)' }}>Home: {prediction.probabilities.home_win}%</span>
                  <span style={{ color: 'var(--amber-neon)' }}>Draw: {prediction.probabilities.draw}%</span>
                  <span style={{ color: 'var(--cyan-neon)' }}>Away: {prediction.probabilities.away_win}%</span>
                </div>

                {/* Expected Score & xG */}
                <div className="grid-slider-pair" style={{ marginTop: '16px' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>PROJECTED SCORE</div>
                    <div style={{ fontSize: 'clamp(1.3rem, 3.5vw, 1.6rem)', fontWeight: 900, color: '#ffffff', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                      {prediction.most_probable_score}
                    </div>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>PROJECTED xG</div>
                    <div style={{ fontSize: 'clamp(1.15rem, 3vw, 1.4rem)', fontWeight: 800, color: 'var(--emerald-neon)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                      {prediction.predicted_xg.home} <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>vs</span> {prediction.predicted_xg.away}
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature Importance / Explainability */}
              <div className="glass-panel" style={{ padding: 'clamp(16px, 2.5vw, 24px)' }}>
                <h4 style={{ fontSize: '0.96rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={17} color="var(--purple-neon)" />
                  Feature Importance Attribution (Explainable AI)
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {Object.entries(prediction.feature_importances || {}).map(([feature, weight]) => {
                    const pct = Math.round(weight * 100);
                    return (
                      <div key={feature}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '2px' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>{feature}</span>
                          <span style={{ fontWeight: 700, color: 'var(--purple-neon)', fontFamily: 'var(--font-mono)' }}>{pct}%</span>
                        </div>
                        <div style={{ height: '5px', borderRadius: '3px', background: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, var(--purple-neon), var(--cyan-neon))' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="glass-panel" style={{ padding: '30px', textAlign: 'center' }}>
              <div className="pulsing-dot" style={{ display: 'inline-block' }}>
                <Cpu size={28} color="var(--emerald-neon)" />
              </div>
              <p style={{ marginTop: '10px', fontSize: '0.84rem', color: 'var(--text-secondary)' }}>Evaluating probabilities...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
