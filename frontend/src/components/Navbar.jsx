import React from 'react';
import { 
  BarChart3, 
  Activity, 
  Eye, 
  ShieldAlert, 
  Cpu, 
  Users, 
  TrendingUp, 
  Layers 
} from 'lucide-react';

const navItems = [
  { id: 'overview', label: 'Overview', icon: Layers },
  { id: 'matches', label: 'Match Analytics & xG', icon: BarChart3 },
  { id: 'predictor', label: 'AI Match Predictor', icon: TrendingUp },
  { id: 'players', label: 'Player Telemetry', icon: Users },
  { id: 'injury', label: 'Workload & ACWR', icon: Activity },
  { id: 'cv', label: 'Computer Vision Lab', icon: Eye },
  { id: 'tactics', label: 'Tactical Board', icon: Cpu },
  { id: 'ethics', label: 'Ethical AI Center', icon: ShieldAlert },
];

export default function Navbar({ activeTab, setActiveTab, backendStatus }) {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-glass)',
      background: 'rgba(11, 17, 32, 0.92)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '0 clamp(12px, 3vw, 24px)'
    }}>
      {/* Top Brand Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        {/* Brand Logo & Name */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #10b981, #06b6d4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(16, 185, 129, 0.4)',
            flexShrink: 0
          }}>
            <Cpu size={20} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ 
                fontSize: 'clamp(1.05rem, 3.5vw, 1.25rem)', 
                fontWeight: 800, 
                letterSpacing: '-0.02em', 
                color: '#ffffff' 
              }}>
                AURA <span style={{ color: 'var(--emerald-neon)' }}>FOOTBALL AI</span>
              </h1>
            </div>
            <p style={{ 
              fontSize: 'clamp(0.7rem, 2vw, 0.78rem)', 
              color: 'var(--text-secondary)' 
            }}>
              Ethical Challenges and Future of AI in Football
            </p>
          </div>
        </div>

        {/* Backend & Model Status Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(15, 23, 42, 0.65)',
            padding: '5px 12px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-glass)',
            fontSize: '0.74rem'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: backendStatus ? 'var(--emerald-neon)' : 'var(--amber-neon)',
              boxShadow: backendStatus ? '0 0 8px var(--emerald-neon)' : 'none',
              flexShrink: 0
            }} className="pulsing-dot" />
            <span style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
              {backendStatus ? 'FastAPI & OpenCV Active' : 'Connecting Engine...'}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Pills (Horizontally Scrollable on Mobile) */}
      <nav style={{
        display: 'flex',
        gap: '6px',
        overflowX: 'auto',
        padding: '8px 0',
        scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch'
      }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                padding: '7px 12px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: isActive ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.15))' : 'transparent',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                borderBottom: isActive ? '2px solid var(--emerald-neon)' : '2px solid transparent',
                fontSize: 'clamp(0.78rem, 2vw, 0.84rem)',
                fontWeight: isActive ? 600 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.18s ease',
                flexShrink: 0
              }}
            >
              <Icon size={15} color={isActive ? 'var(--emerald-neon)' : 'currentColor'} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
