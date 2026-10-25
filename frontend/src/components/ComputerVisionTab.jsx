import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  Upload, 
  Compass, 
  Info,
  RefreshCw,
  Camera
} from 'lucide-react';
import { runCVDetection } from '../api';

const scenarios = [
  {
    id: "counter_attack",
    name: "Fast-Break Counter Attack",
    desc: "Real Madrid vs Man City — High-speed transitional sprint, tracking Mbappé, Vinícius, Walker & Dias."
  },
  {
    id: "corner_kick",
    name: "Congested Corner Set-Piece",
    desc: "In-swinging corner kick, testing entity separation in crowded penalty box with goalkeeper."
  },
  {
    id: "midfield_press",
    name: "Midfield Pressing Trap",
    desc: "Compact pressing zone 14, isolating De Bruyne, Camavinga, and Match Official."
  }
];

export default function ComputerVisionTab() {
  const [activeScenario, setActiveScenario] = useState("counter_attack");
  const [cvResult, setCvResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(null);

  const executeDetection = (scenarioId, file = null) => {
    setLoading(true);
    runCVDetection(scenarioId, file)
      .then((data) => {
        setCvResult(data);
        setSelectedEntity(null);
      })
      .catch((err) => console.error("CV pipeline error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    executeDetection(activeScenario);
  }, [activeScenario]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      executeDetection("custom", file);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.5vw, 24px)' }}>
      {/* Header Info */}
      <div className="glass-panel" style={{ padding: 'clamp(16px, 2.5vw, 24px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <Eye size={20} color="var(--cyan-neon)" />
              <h3 style={{ fontSize: 'clamp(1.1rem, 2.5vw, 1.25rem)', fontWeight: 800 }}>
                Computer Vision & 2D Planar Homography Tracking Lab
              </h3>
              <span className="badge badge-cyan">OpenCV 5.0 Core Pipeline</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Executes pitch turf segmentation, player contour detection, jersey HSV clustering, and planar homography 2D top-down projection.
            </p>
          </div>

          {/* Upload Button */}
          <label className="btn-secondary" style={{ cursor: 'pointer', fontSize: '0.8rem' }}>
            <Upload size={15} color="var(--emerald-neon)" />
            <span>Upload Match Photo / Frame</span>
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleFileUpload} 
              style={{ display: 'none' }} 
            />
          </label>
        </div>
      </div>

      {/* Scenario Selector Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
        {scenarios.map((sc) => (
          <button
            key={sc.id}
            onClick={() => setActiveScenario(sc.id)}
            className={activeScenario === sc.id ? "btn-primary" : "btn-secondary"}
            style={{ fontSize: '0.78rem', padding: '6px 12px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flexShrink: 0 }}
          >
            <span style={{ fontWeight: 700 }}>{sc.name}</span>
            <span style={{ fontSize: '0.68rem', opacity: 0.8 }}>{sc.id === 'counter_attack' ? 'Transitional Phase' : sc.id === 'corner_kick' ? 'Set Piece' : 'Pressing Zone'}</span>
          </button>
        ))}
      </div>

      {/* Main CV View: Left Canvas/Annotated Image, Right Telemetry */}
      <div className="grid-2col-responsive">
        {/* Left Column: CV Render Canvas */}
        <div className="glass-panel" style={{ padding: 'clamp(16px, 2.5vw, 24px)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Camera size={17} color="var(--emerald-neon)" />
              <h4 style={{ fontSize: '0.96rem', fontWeight: 700 }}>
                Annotated Optical Tracking Stream
              </h4>
            </div>
            {loading && (
              <span className="badge badge-amber" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.68rem' }}>
                <RefreshCw size={11} className="pulsing-dot" /> Processing...
              </span>
            )}
          </div>

          {/* Rendered Image Box */}
          <div style={{
            position: 'relative',
            borderRadius: 'var(--radius-sm)',
            overflow: 'hidden',
            border: '2px solid rgba(255, 255, 255, 0.12)',
            background: '#090e17',
            minHeight: 'clamp(220px, 35vw, 360px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {cvResult?.annotated_image ? (
              <img
                src={cvResult.annotated_image}
                alt="OpenCV Annotated Match Frame"
                style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'contain' }}
              />
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                <Eye size={32} color="var(--cyan-neon)" className="pulsing-dot" />
                <p style={{ marginTop: '8px', fontSize: '0.8rem' }}>Awaiting video feed frames...</p>
              </div>
            )}

            {/* Scan beam animation overlay */}
            <div className="scan-beam" />
          </div>

          {/* Visual Legend */}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-glass)', paddingTop: '10px', flexWrap: 'wrap', gap: '8px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#f8fafc', border: '1px solid #aaa' }} />
              Alpha (White)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#38bdf8' }} />
              Beta (Sky Blue)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#eab308' }} />
              Referee (Yellow)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#facc15' }} />
              Smart Ball
            </span>
          </div>
        </div>

        {/* Right Column: Detections & Homography Matrix */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(14px, 2.5vw, 20px)' }}>
          {/* Telemetry Stats Card */}
          <div className="glass-panel" style={{ padding: 'clamp(16px, 2.5vw, 22px)' }}>
            <h4 style={{ fontSize: '0.96rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Compass size={17} color="var(--cyan-neon)" />
              Optical Detection Telemetry
            </h4>

            <div className="grid-slider-pair" style={{ marginBottom: '14px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>PLAYERS DETECTED</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--emerald-neon)', fontFamily: 'var(--font-mono)' }}>
                  {cvResult?.players_detected || 0}
                </div>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>BALL TRACKING</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--amber-neon)', fontFamily: 'var(--font-mono)' }}>
                  {cvResult?.ball_detected ? 'LOCKED' : 'SEARCHING'}
                </div>
              </div>
            </div>

            {/* List of Tracked Entities */}
            <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
              TRACKED NODES & HOMOGRAPHY COORDINATES (X, Y %)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
              {cvResult?.detections?.map((d) => (
                <div
                  key={d.id}
                  onClick={() => setSelectedEntity(d)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '7px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: selectedEntity?.id === d.id ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${selectedEntity?.id === d.id ? 'var(--cyan-neon)' : 'var(--border-glass)'}`,
                    cursor: 'pointer',
                    fontSize: '0.76rem',
                    gap: '6px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: d.color, flexShrink: 0 }} />
                    <span style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.label}</span>
                    <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>({d.team})</span>
                  </div>

                  <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--cyan-neon)', fontWeight: 700, fontSize: '0.72rem', flexShrink: 0 }}>
                    [{d.pitch_coord[0]}, {d.pitch_coord[1]}]
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Homography Math Card */}
          <div className="glass-panel" style={{ padding: 'clamp(16px, 2.5vw, 22px)', borderLeft: '4px solid var(--cyan-neon)' }}>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <Info size={15} color="var(--cyan-neon)" />
              Planar Projective Homography Matrix
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Broadcast optical angles suffer from perspective distortion. By computing the 3x3 homography matrix 
              <strong> H </strong> between broadcast keypoints and the 105m x 68m top-down pitch canvas, 
              we project entities into metric space at 54 FPS without specialized stadium ceiling riggings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
