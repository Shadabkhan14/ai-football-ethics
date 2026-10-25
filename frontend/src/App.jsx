import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import OverviewTab from './components/OverviewTab';
import MatchAnalysisTab from './components/MatchAnalysisTab';
import PredictorTab from './components/PredictorTab';
import PlayerAnalyticsTab from './components/PlayerAnalyticsTab';
import InjuryRiskTab from './components/InjuryRiskTab';
import ComputerVisionTab from './components/ComputerVisionTab';
import TacticsTab from './components/TacticsTab';
import EthicsCenterTab from './components/EthicsCenterTab';

import { fetchOverview, fetchMatches, fetchPlayers } from './api';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [backendStatus, setBackendStatus] = useState(false);
  const [overview, setOverview] = useState(null);
  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    // Initial fetch from backend
    const loadData = async () => {
      try {
        const [ovData, matchData, playerData] = await Promise.all([
          fetchOverview(),
          fetchMatches(),
          fetchPlayers()
        ]);
        setOverview(ovData);
        setMatches(matchData);
        setPlayers(playerData);
        setBackendStatus(true);
      } catch (err) {
        console.warn("Backend not yet connected or initializing:", err);
        setBackendStatus(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 10000); // Heartbeat ping every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendStatus={backendStatus}
      />

      {/* Main Content Area */}
      <main className="main-content-layout" style={{
        flex: 1,
        maxWidth: '1440px',
        margin: '0 auto',
        width: '100%'
      }}>
        {activeTab === 'overview' && (
          <OverviewTab
            overview={overview}
            matches={matches}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'matches' && (
          <MatchAnalysisTab matches={matches} />
        )}

        {activeTab === 'predictor' && (
          <PredictorTab />
        )}

        {activeTab === 'players' && (
          <PlayerAnalyticsTab players={players} setActiveTab={setActiveTab} />
        )}

        {activeTab === 'injury' && (
          <InjuryRiskTab />
        )}

        {activeTab === 'cv' && (
          <ComputerVisionTab />
        )}

        {activeTab === 'tactics' && (
          <TacticsTab />
        )}

        {activeTab === 'ethics' && (
          <EthicsCenterTab />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-glass)',
        background: 'rgba(11, 17, 32, 0.95)',
        padding: '24px',
        textAlign: 'center',
        fontSize: '0.82rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '8px' }}>
          <span>AURA FOOTBALL AI</span>
          <span>•</span>
          <span>Ethical Challenges and Future of AI in Football</span>
          <span>•</span>
          <span>FastAPI + OpenCV + Scikit-Learn + React</span>
        </div>
        <div>
          GDPR Article 9 & EU AI Act High-Risk Compliant Framework • Sports Analytics & Algorithmic Governance
        </div>
      </footer>
    </div>
  );
}
