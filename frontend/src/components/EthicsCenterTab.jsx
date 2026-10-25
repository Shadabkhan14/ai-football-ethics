import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Scale, 
  Sparkles
} from 'lucide-react';
import { fetchEthicalAudits, simulateBias, simulateGovernance } from '../api';

export default function EthicsCenterTab() {
  const [data, setData] = useState(null);
  const [debiasingActive, setDebiasingActive] = useState(false);
  const [biasResult, setBiasResult] = useState(null);
  const [biasLoading, setBiasLoading] = useState(false);

  const [levers, setLevers] = useState({
    gdpr_strict_consent: true,
    bias_auditing_active: true,
    xai_explanation_required: true,
    betting_biometrics_banned: false,
    referee_tolerance_zone: true
  });
  const [govResult, setGovResult] = useState(null);

  useEffect(() => {
    fetchEthicalAudits()
      .then((res) => setData(res))
      .catch((err) => console.error("Error loading audits:", err));

    runBiasSim(false);
    runGovSim(levers);
  }, []);

  const runBiasSim = (enabled) => {
    setBiasLoading(true);
    simulateBias(enabled)
      .then((res) => setBiasResult(res))
      .catch((err) => console.error("Bias simulation error:", err))
      .finally(() => setBiasLoading(false));
  };

  const runGovSim = (updatedLevers) => {
    simulateGovernance(updatedLevers)
      .then((res) => setGovResult(res))
      .catch((err) => console.error("Governance error:", err));
  };

  const handleLeverToggle = (key) => {
    const updated = { ...levers, [key]: !levers[key] };
    setLevers(updated);
    runGovSim(updated);
  };

  const handleDebiasToggle = () => {
    const next = !debiasingActive;
    setDebiasingActive(next);
    runBiasSim(next);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(18px, 3vw, 28px)' }}>
      {/* Header Info Banner */}
      <div className="glass-panel" style={{
        padding: 'clamp(18px, 3vw, 28px)',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(88, 28, 135, 0.25))',
        border: '1px solid rgba(168, 85, 247, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
          <ShieldAlert size={24} color="var(--purple-neon)" />
          <h3 style={{ fontSize: 'clamp(1.15rem, 3vw, 1.4rem)', fontWeight: 800 }}>
            Ethical AI Governance & Algorithmic Audit Center
          </h3>
          <span className="badge badge-purple" style={{ fontSize: '0.66rem' }}>Regulatory Sandbox</span>
        </div>

        <p style={{ fontSize: 'clamp(0.82rem, 1.8vw, 0.92rem)', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '900px' }}>
          Investigating the intersection of Artificial Intelligence, labor dignity, and regulation in professional football. 
          Examines GDPR Article 9 compliance for continuous biometric surveillance, algorithmic fairness in scouting pipelines, 
          explainability in contract negotiations, and athlete data ownership against betting syndicates.
        </p>
      </div>

      {/* Simulator Row: Bias Simulator & Governance Index */}
      <div className="grid-2col-responsive">
        {/* Module 1: Interactive Scouting Bias Simulator */}
        <div className="glass-panel" style={{ padding: 'clamp(16px, 2.5vw, 26px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Scale size={18} color="var(--purple-neon)" />
                Algorithmic Scouting Bias Simulator
              </h4>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                Simulating Disparate Impact across European vs Global South youth prospects
              </p>
            </div>

            <button
              onClick={handleDebiasToggle}
              className={debiasingActive ? "btn-primary" : "btn-secondary"}
              style={{ fontSize: '0.76rem', padding: '5px 12px' }}
            >
              {debiasingActive ? "Debiasing: ON" : "Debiasing: OFF"}
            </button>
          </div>

          {biasResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Disparate Impact Result Card */}
              <div style={{
                background: biasResult.four_fifths_rule_passed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                border: `1px solid ${biasResult.four_fifths_rule_passed ? 'var(--emerald-neon)' : 'var(--crimson-neon)'}`,
                borderRadius: 'var(--radius-sm)',
                padding: '14px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>DISPARATE IMPACT RATIO (EEOC 80% RULE)</div>
                    <div style={{ fontSize: 'clamp(1.4rem, 3.5vw, 1.8rem)', fontWeight: 900, fontFamily: 'var(--font-mono)', color: biasResult.four_fifths_rule_passed ? 'var(--emerald-neon)' : 'var(--crimson-neon)' }}>
                      {biasResult.disparate_impact_ratio}
                    </div>
                  </div>
                  <span className={biasResult.four_fifths_rule_passed ? "badge badge-emerald" : "badge badge-crimson"}>
                    {biasResult.four_fifths_rule_passed ? "PASSED (Compliant)" : "BIAS DETECTED"}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, marginTop: '4px', color: biasResult.four_fifths_rule_passed ? 'var(--emerald-neon)' : 'var(--crimson-neon)' }}>
                  {biasResult.fairness_verdict}
                </div>
              </div>

              {/* Group Comparison Bars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '3px' }}>
                    <span>Group A (European Academies — 4K Optical)</span>
                    <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{biasResult.group_a_selection_rate}%</span>
                  </div>
                  <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                    <div style={{ width: `${biasResult.group_a_selection_rate}%`, height: '100%', background: 'var(--cyan-neon)' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '3px' }}>
                    <span>Group B (Global South Prospects — Standard Video)</span>
                    <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: biasResult.four_fifths_rule_passed ? 'var(--emerald-neon)' : 'var(--crimson-neon)' }}>
                      {biasResult.group_b_selection_rate}%
                    </span>
                  </div>
                  <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                    <div style={{ width: `${biasResult.group_b_selection_rate}%`, height: '100%', background: biasResult.four_fifths_rule_passed ? 'var(--emerald-neon)' : 'var(--crimson-neon)' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '4px', flexWrap: 'wrap', gap: '6px' }}>
                  <span>Unprivileged Discard Rate: <strong style={{ color: 'var(--crimson-neon)' }}>{biasResult.unprivileged_false_negative_rate}%</strong></span>
                  <span>Privileged: {biasResult.privileged_false_negative_rate}%</span>
                </div>
              </div>

              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5, borderTop: '1px solid var(--border-glass)', paddingTop: '10px' }}>
                {biasResult.research_insight}
              </p>
            </div>
          )}
        </div>

        {/* Module 2: Interactive Governance Score Simulator */}
        <div className="glass-panel" style={{ padding: 'clamp(16px, 2.5vw, 26px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={18} color="var(--emerald-neon)" />
                Regulatory Governance Index
              </h4>
              <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                Toggle compliance safeguards to calculate club rating
              </p>
            </div>

            {govResult && (
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 'clamp(1.3rem, 3.5vw, 1.6rem)', fontWeight: 900, color: govResult.tier_color, fontFamily: 'var(--font-mono)' }}>
                  {govResult.compliance_score} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ 100</span>
                </div>
              </div>
            )}
          </div>

          {/* Toggle Levers */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', gap: '10px' }}>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>GDPR Article 9 Biometric Opt-In</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Requires affirmative consent for off-pitch telemetry</div>
              </div>
              <input
                type="checkbox"
                checked={levers.gdpr_strict_consent}
                onChange={() => handleLeverToggle('gdpr_strict_consent')}
                style={{ width: '18px', height: '18px', accentColor: 'var(--emerald-neon)', flexShrink: 0 }}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', gap: '10px' }}>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>Mandatory Disparate Impact Auditing</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Enforces 80% parity standard on scouting models</div>
              </div>
              <input
                type="checkbox"
                checked={levers.bias_auditing_active}
                onChange={() => handleLeverToggle('bias_auditing_active')}
                style={{ width: '18px', height: '18px', accentColor: 'var(--emerald-neon)', flexShrink: 0 }}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', gap: '10px' }}>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>Explainable AI (XAI) Contract Right</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Bans black-box automated justifications in wage cuts</div>
              </div>
              <input
                type="checkbox"
                checked={levers.xai_explanation_required}
                onChange={() => handleLeverToggle('xai_explanation_required')}
                style={{ width: '18px', height: '18px', accentColor: 'var(--emerald-neon)', flexShrink: 0 }}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', gap: '10px' }}>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>Ban Live Biometric Betting Feeds</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Prohibits selling player fatigue data to sportsbooks</div>
              </div>
              <input
                type="checkbox"
                checked={levers.betting_biometrics_banned}
                onChange={() => handleLeverToggle('betting_biometrics_banned')}
                style={{ width: '18px', height: '18px', accentColor: 'var(--emerald-neon)', flexShrink: 0 }}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', gap: '10px' }}>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>SAOT Referee ±5cm Tolerance Band</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Protects human discretion during optical frame latency</div>
              </div>
              <input
                type="checkbox"
                checked={levers.referee_tolerance_zone}
                onChange={() => handleLeverToggle('referee_tolerance_zone')}
                style={{ width: '18px', height: '18px', accentColor: 'var(--emerald-neon)', flexShrink: 0 }}
              />
            </label>
          </div>

          {govResult && (
            <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.76rem', flexWrap: 'wrap', gap: '6px' }}>
              <span>EU AI Act Annex III: <strong style={{ color: govResult.tier_color }}>{govResult.eu_ai_act_status}</strong></span>
              <span>FIFA Ethics: <strong style={{ color: govResult.tier_color }}>{govResult.fifa_ethics_status}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* The 6 Core Ethical Pillars */}
      <div>
        <h4 style={{ fontSize: 'clamp(1.15rem, 2.5vw, 1.25rem)', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="var(--purple-neon)" />
          The Six Ethical Pillars in Modern Football
        </h4>

        <div className="grid-cards-3col">
          {data?.pillars?.map((p) => (
            <div key={p.id} className="glass-panel" style={{ padding: 'clamp(16px, 2.5vw, 24px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="badge badge-purple" style={{ fontSize: '0.64rem' }}>{p.code}</span>
                  <span className={p.urgency === 'Critical' ? "badge badge-crimson" : p.urgency === 'High' ? "badge badge-amber" : "badge badge-cyan"} style={{ fontSize: '0.64rem' }}>
                    {p.urgency}
                  </span>
                </div>

                <h5 style={{ fontSize: '1.02rem', fontWeight: 800, marginTop: '4px' }}>{p.title}</h5>
                <div style={{ fontSize: '0.78rem', color: 'var(--emerald-neon)', fontWeight: 600, marginBottom: '8px' }}>
                  {p.subtitle}
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
                  {p.description}
                </p>
              </div>

              <div>
                <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', marginBottom: '8px' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>LEGAL CONTEXT</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-primary)', fontWeight: 600 }}>{p.legal_context}</div>
                </div>

                <div style={{ background: 'rgba(16, 185, 129, 0.06)', borderLeft: '3px solid var(--emerald-neon)', padding: '8px 10px', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--emerald-neon)', fontWeight: 700 }}>RECOMMENDED SAFEGUARD</div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{p.research_recommendation}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
