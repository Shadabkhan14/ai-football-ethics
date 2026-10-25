import sqlite3
import os
import json
from datetime import datetime, timedelta

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "football_analytics.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Matches table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS matches (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        match_date TEXT NOT NULL,
        competition TEXT NOT NULL,
        home_team TEXT NOT NULL,
        away_team TEXT NOT NULL,
        home_score INTEGER NOT NULL,
        away_score INTEGER NOT NULL,
        status TEXT NOT NULL,
        possession_home REAL NOT NULL,
        possession_away REAL NOT NULL,
        shots_home INTEGER NOT NULL,
        shots_away INTEGER NOT NULL,
        shots_on_target_home INTEGER NOT NULL,
        shots_on_target_away INTEGER NOT NULL,
        passes_home INTEGER NOT NULL,
        passes_away INTEGER NOT NULL,
        pass_accuracy_home REAL NOT NULL,
        pass_accuracy_away REAL NOT NULL,
        xg_home REAL NOT NULL,
        xg_away REAL NOT NULL,
        fouls_home INTEGER NOT NULL,
        fouls_away INTEGER NOT NULL,
        corners_home INTEGER NOT NULL,
        corners_away INTEGER NOT NULL,
        tactical_summary TEXT
    )
    """)

    # Match events table (shots, goals, VAR interventions, key passes)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS match_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        match_id INTEGER NOT NULL,
        minute INTEGER NOT NULL,
        team TEXT NOT NULL,
        event_type TEXT NOT NULL,
        player_name TEXT NOT NULL,
        x_coord REAL NOT NULL,
        y_coord REAL NOT NULL,
        xg_value REAL,
        description TEXT,
        FOREIGN KEY (match_id) REFERENCES matches (id)
    )
    """)

    # Players table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS players (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        team TEXT NOT NULL,
        position TEXT NOT NULL,
        jersey_number INTEGER NOT NULL,
        age INTEGER NOT NULL,
        nationality TEXT NOT NULL,
        market_value_m REAL NOT NULL,
        matches_played INTEGER NOT NULL,
        minutes_played INTEGER NOT NULL,
        goals INTEGER NOT NULL,
        assists INTEGER NOT NULL,
        sprint_distance_km REAL NOT NULL,
        high_speed_runs INTEGER NOT NULL,
        max_speed_kmh REAL NOT NULL,
        pass_completion_rate REAL NOT NULL,
        tackle_success_rate REAL NOT NULL,
        avg_heart_rate INTEGER NOT NULL,
        recovery_score REAL NOT NULL,
        acwr_ratio REAL NOT NULL,
        injury_risk_category TEXT NOT NULL,
        gdpr_consent_status TEXT NOT NULL,
        biometric_commercial_opt_in INTEGER NOT NULL
    )
    """)

    # Injury & Workload telemetry table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS injury_telemetry (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        player_id INTEGER NOT NULL,
        recorded_date TEXT NOT NULL,
        acute_load_7d REAL NOT NULL,
        chronic_load_28d REAL NOT NULL,
        acwr_index REAL NOT NULL,
        sprint_fatigue_score REAL NOT NULL,
        muscle_soreness_scale INTEGER NOT NULL,
        sleep_hours REAL NOT NULL,
        heart_rate_variability REAL NOT NULL,
        predicted_risk_percent REAL NOT NULL,
        risk_level TEXT NOT NULL,
        ai_recommendation TEXT NOT NULL,
        FOREIGN KEY (player_id) REFERENCES players (id)
    )
    """)

    # Tactical formations table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS tactical_presets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        formation_name TEXT NOT NULL,
        team_name TEXT NOT NULL,
        system_philosophy TEXT NOT NULL,
        pressing_intensity TEXT NOT NULL,
        defensive_line TEXT NOT NULL,
        attacking_width TEXT NOT NULL,
        player_nodes_json TEXT NOT NULL
    )
    """)

    # Ethical Audits & Case Studies table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS ethical_audits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        case_code TEXT NOT NULL,
        pillar_title TEXT NOT NULL,
        severity_level TEXT NOT NULL,
        impact_summary TEXT NOT NULL,
        affected_stakeholders TEXT NOT NULL,
        bias_disparity_metric REAL NOT NULL,
        gdpr_compliance_score REAL NOT NULL,
        ethical_safeguard_recommendation TEXT NOT NULL
    )
    """)

    conn.commit()
    conn.close()

def seed_db_if_empty():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM matches")
    if cursor.fetchone()[0] > 0:
        conn.close()
        return

    # Seed Matches
    matches_data = [
        (
            "2026-04-18", "UEFA Champions League Semi-Final", "Real Madrid", "Manchester City",
            3, 2, "Full Time", 44.5, 55.5, 14, 18, 7, 6, 420, 612, 85.2, 91.4, 2.34, 1.88,
            11, 8, 5, 8,
            "High-tempo tactical masterclass. Real Madrid exploited rapid transitional counter-attacks against City's high-defensive line."
        ),
        (
            "2026-04-12", "Premier League Super Sunday", "Arsenal", "Liverpool",
            2, 2, "Full Time", 51.0, 49.0, 16, 15, 6, 5, 510, 485, 88.0, 86.5, 1.95, 1.72,
            14, 12, 7, 6,
            "Intense midfield pressing duel. Tactical counter-pressing created rapid turnovers in the half-spaces."
        ),
        (
            "2026-04-05", "La Liga Clásico", "FC Barcelona", "Real Madrid",
            1, 2, "Full Time", 58.2, 41.8, 12, 11, 4, 6, 640, 390, 89.6, 82.1, 1.45, 1.82,
            9, 13, 6, 4,
            "Barcelona dominated territorial possession in zone 14, but Real Madrid executed clinical vertical direct transitions."
        ),
        (
            "2026-03-29", "Bundesliga Topspiel", "Bayern Munich", "Bayer Leverkusen",
            3, 1, "Full Time", 53.4, 46.6, 17, 10, 8, 3, 580, 490, 87.5, 84.0, 2.78, 0.95,
            10, 10, 9, 3,
            "Overloaded right flank dynamics allowed Bayern to isolate wingers in high xG 1v1 shooting situations."
        ),
        (
            "2026-03-22", "Serie A Derby", "Inter Milan", "AC Milan",
            2, 0, "Full Time", 47.8, 52.2, 13, 9, 6, 2, 460, 520, 84.1, 86.0, 1.82, 0.68,
            15, 16, 4, 5,
            "Disciplined low-block structure with aggressive central traps stifled AC Milan's build-up progression."
        )
    ]

    for m in matches_data:
        cursor.execute("""
        INSERT INTO matches (
            match_date, competition, home_team, away_team, home_score, away_score, status,
            possession_home, possession_away, shots_home, shots_away, shots_on_target_home,
            shots_on_target_away, passes_home, passes_away, pass_accuracy_home, pass_accuracy_away,
            xg_home, xg_away, fouls_home, fouls_away, corners_home, corners_away, tactical_summary
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, m)

    # Seed Match Events for Real Madrid vs Man City
    events = [
        (1, 12, "Manchester City", "shot", "Erling Haaland", 88.5, 48.2, 0.42, "Header from corner, saved by goalkeeper"),
        (1, 24, "Real Madrid", "goal", "Vinícius Júnior", 82.0, 38.4, 0.31, "Cut-in from left wing, curler into top right corner"),
        (1, 37, "Manchester City", "goal", "Kevin De Bruyne", 77.2, 54.1, 0.18, "Long-range strike from edge of box into lower left"),
        (1, 44, "Real Madrid", "var_check", "Jude Bellingham", 92.0, 50.0, 0.0, "VAR Semi-Automated Offside review: Goal disallowed by 1.8cm margin"),
        (1, 58, "Real Madrid", "goal", "Rodrygo", 89.1, 52.0, 0.65, "Tap-in after cut-back from byline"),
        (1, 71, "Manchester City", "goal", "Phil Foden", 81.4, 46.3, 0.28, "Direct shot through crowded penalty area"),
        (1, 88, "Real Madrid", "goal", "Jude Bellingham", 94.2, 49.5, 0.74, "Late dramatic header following fast break counter-attack")
    ]
    for e in events:
        cursor.execute("""
        INSERT INTO match_events (match_id, minute, team, event_type, player_name, x_coord, y_coord, xg_value, description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, e)

    # Seed Players (diverse across teams, positions, workloads and consent profiles)
    players_data = [
        ("Jude Bellingham", "Real Madrid", "Central Midfielder", 5, 22, "England", 180.0, 32, 2840, 16, 11, 11.8, 48, 34.2, 89.4, 76.5, 164, 88.5, 1.12, "Low (Optimal)", "Full Consent Granted", 0),
        ("Erling Haaland", "Manchester City", "Striker", 9, 25, "Norway", 180.0, 30, 2610, 28, 6, 9.4, 52, 35.8, 77.2, 42.0, 158, 82.0, 1.25, "Moderate (Monitor)", "Full Consent Granted", 1),
        ("Vinícius Júnior", "Real Madrid", "Left Winger", 7, 25, "Brazil", 170.0, 29, 2450, 18, 12, 10.9, 65, 36.1, 82.5, 55.4, 168, 79.0, 1.42, "Elevated (Sprint Fatigue)", "Consent with Biometric Opt-Out", 0),
        ("Rodri Hernandez", "Manchester City", "Defensive Midfielder", 16, 29, "Spain", 110.0, 35, 3120, 7, 9, 12.4, 32, 31.5, 93.8, 84.2, 162, 68.0, 1.58, "High (Congestion Risk)", "Full Consent Granted", 0),
        ("Bukayo Saka", "Arsenal", "Right Winger", 7, 24, "England", 140.0, 31, 2750, 15, 14, 10.6, 58, 34.7, 85.1, 62.1, 166, 74.5, 1.38, "Moderate (Monitor)", "Full Consent Granted", 1),
        ("Lamine Yamal", "FC Barcelona", "Right Winger", 19, 18, "Spain", 150.0, 28, 2280, 10, 13, 10.2, 54, 34.0, 84.6, 58.0, 160, 91.0, 1.05, "Low (Optimal)", "Minor - Guardian Consent", 0),
        ("Kylian Mbappé", "Real Madrid", "Forward", 9, 27, "France", 180.0, 31, 2700, 26, 8, 10.4, 68, 36.7, 83.2, 48.0, 165, 84.0, 1.18, "Low (Optimal)", "Commercial Opt-Out", 0),
        ("William Saliba", "Arsenal", "Centre Back", 2, 25, "France", 85.0, 34, 3060, 2, 1, 9.8, 28, 33.1, 92.5, 88.0, 155, 86.0, 1.15, "Low (Optimal)", "Full Consent Granted", 0),
        ("Kevin De Bruyne", "Manchester City", "Attacking Midfielder", 17, 34, "Belgium", 50.0, 22, 1780, 6, 15, 9.7, 34, 31.8, 86.8, 59.0, 161, 71.0, 1.62, "High (Age & Hamstring Vulnerability)", "Consent with Strict Club Medical Only", 0),
        ("Eduardo Camavinga", "Real Madrid", "Central Midfielder", 6, 23, "France", 90.0, 27, 2190, 3, 5, 11.2, 42, 33.6, 90.1, 81.5, 165, 87.0, 1.14, "Low (Optimal)", "Full Consent Granted", 1),
        ("Amadou Diallo", "Scouting Pool (West Africa)", "Defensive Midfielder", 21, 19, "Senegal", 4.5, 24, 2100, 4, 3, 11.5, 38, 33.0, 86.2, 79.1, 159, 89.0, 1.08, "Low (Optimal)", "Consent Pending International Audit", 0),
        ("Mateo Rossi", "Scouting Pool (Serie B)", "Centre Back", 4, 22, "Italy", 5.0, 26, 2340, 1, 0, 9.5, 24, 32.2, 88.0, 82.4, 157, 85.0, 1.12, "Low (Optimal)", "Full Consent Granted", 0)
    ]

    for p in players_data:
        cursor.execute("""
        INSERT INTO players (
            name, team, position, jersey_number, age, nationality, market_value_m, matches_played,
            minutes_played, goals, assists, sprint_distance_km, high_speed_runs, max_speed_kmh,
            pass_completion_rate, tackle_success_rate, avg_heart_rate, recovery_score, acwr_ratio,
            injury_risk_category, gdpr_consent_status, biometric_commercial_opt_in
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, p)

    # Seed Injury Telemetry for Bellingham, Rodri, De Bruyne, Haaland
    telemetry_data = [
        # Jude Bellingham (Optimal sweet spot)
        (1, "2026-04-18", 42.5, 38.0, 1.12, 28.5, 2, 8.2, 78.4, 14.2, "Low", "Optimal training load. Player is in the functional adaptation window."),
        # Rodri (Severe workload congestion)
        (4, "2026-04-18", 68.4, 43.2, 1.58, 64.0, 4, 6.1, 52.0, 68.5, "High", "High acute workload spike detected (ACWR > 1.5). Immediate rest or 50% minutes restriction advised."),
        # Kevin De Bruyne (Fatigue & high recovery latency)
        (9, "2026-04-18", 54.0, 33.3, 1.62, 71.2, 5, 5.8, 48.0, 74.0, "High", "Critical hamstring load threshold crossed. Previous scar tissue risk elevated by 3.2x under current sprint intensity."),
        # Erling Haaland (Moderate monitor)
        (2, "2026-04-18", 46.0, 36.8, 1.25, 42.0, 3, 7.5, 68.0, 32.5, "Moderate", "Workload is acceptable but high-speed sprint bursts need monitored post-match active recovery.")
    ]
    for t in telemetry_data:
        cursor.execute("""
        INSERT INTO injury_telemetry (
            player_id, recorded_date, acute_load_7d, chronic_load_28d, acwr_index, sprint_fatigue_score,
            muscle_soreness_scale, sleep_hours, heart_rate_variability, predicted_risk_percent,
            risk_level, ai_recommendation
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, t)

    # Seed Tactical Presets
    tactics_data = [
        (
            "4-3-3 Attacking Overload", "Real Madrid", "Direct Transitional Verticality",
            "Mid-High Block with sudden pressing triggers in wide channels", "High (42m)", "Wide (68m)",
            json.dumps([
                {"number": 1, "name": "Courtois", "role": "Sweeper GK", "x": 10, "y": 50},
                {"number": 2, "name": "Carvajal", "role": "Inverted RB", "x": 30, "y": 82},
                {"number": 3, "name": "Militão", "role": "Covering CB", "x": 26, "y": 62},
                {"number": 22, "name": "Rüdiger", "role": "Aggressive Stopper CB", "x": 26, "y": 38},
                {"number": 23, "name": "Mendy", "role": "Defensive LB", "x": 30, "y": 18},
                {"number": 14, "name": "Tchouaméni", "role": "Anchor CDM", "x": 45, "y": 50},
                {"number": 15, "name": "Valverde", "role": "Box-to-Box RCM", "x": 58, "y": 72},
                {"number": 5, "name": "Bellingham", "role": "Shadow Striker LCM", "x": 66, "y": 32},
                {"number": 11, "name": "Rodrygo", "role": "Inside Forward RW", "x": 78, "y": 80},
                {"number": 9, "name": "Mbappé", "role": "Mobile Central Striker", "x": 86, "y": 50},
                {"number": 7, "name": "Vinícius Jr", "role": "Isolated Dribbler LW", "x": 80, "y": 18}
            ])
        ),
        (
            "3-2-4-1 Positional Fluidity", "Manchester City", "Juego de Posición (Positional Play)",
            "Aggressive Rest Defense with instant counter-pressing within 5 seconds", "Ultra High (52m)", "Structured (58m)",
            json.dumps([
                {"number": 31, "name": "Ederson", "role": "Playmaking GK", "x": 12, "y": 50},
                {"number": 25, "name": "Akanji", "role": "Wide CB", "x": 28, "y": 78},
                {"number": 3, "name": "Rúben Dias", "role": "Central CB", "x": 25, "y": 50},
                {"number": 24, "name": "Gvardiol", "role": "Wide CB / Overlapping", "x": 28, "y": 22},
                {"number": 5, "name": "Stones", "role": "Inverted Stopper / Pivot", "x": 44, "y": 65},
                {"number": 16, "name": "Rodri", "role": "Deep-lying Playmaker", "x": 44, "y": 35},
                {"number": 20, "name": "Bernardo", "role": "Right Half-Space Roamer", "x": 65, "y": 75},
                {"number": 17, "name": "De Bruyne", "role": "Creative Free 8", "x": 68, "y": 55},
                {"number": 47, "name": "Foden", "role": "Inside Pocket CAM", "x": 68, "y": 42},
                {"number": 10, "name": "Grealish", "role": "Touchline Pauser LW", "x": 72, "y": 15},
                {"number": 9, "name": "Haaland", "role": "Box Target Striker", "x": 88, "y": 50}
            ])
        )
    ]
    for tac in tactics_data:
        cursor.execute("""
        INSERT INTO tactical_presets (
            formation_name, team_name, system_philosophy, pressing_intensity, defensive_line, attacking_width, player_nodes_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
        """, tac)

    # Seed Ethical Audits & Case Studies from the Research Paper
    audits_data = [
        (
            "ETH-001", "Biometric Surveillance & Continuous Workplace Monitoring", "CRITICAL",
            "Players subjected to 24/7 micro-sensor telemetry (sleep rings, heart rate variability, recovery vests). Club staff gaining unfettered visibility into players' off-pitch personal habits.",
            "Professional Players, Club Medical Staff, Players' Union (FIFPRO)",
            0.88, 54.0,
            "Mandate clear separation between medical on-pitch data and private off-pitch biometric telemetry. Implement Article 9 GDPR exemptions with zero-knowledge cryptographic hashing."
        ),
        (
            "ETH-002", "Algorithmic Scouting Bias & Disparate Geographic Coverage", "HIGH",
            "Computer vision and expected-threat models are trained primarily on top-5 European league datasets with 4K broadcast feeds and multi-camera optical setups. Talents from South America and Africa suffer from systematically lower AI confidence ratings due to grainy video inputs.",
            "Emerging Talents, African Academies, International Scouts",
            0.62, 68.0,
            "Introduce Domain Adaptation Neural Networks and Synthetic Sensor Invariance. Require Disparate Impact Ratio benchmarking (> 0.80) prior to AI scouting tool deployment."
        ),
        (
            "ETH-003", "Data Ownership, Commercialization & Betting Syndicates", "CRITICAL",
            "Clubs and leagues licensing high-frequency player GPS biometric data to third-party sportsbooks and streaming broadcasters without players' explicit commercial royalty consent.",
            "Athletes, Betting Operators, Broadcasting Networks, FIFA",
            0.92, 42.0,
            "Establish Player Data Sovereignty Vaults (Self-Sovereign Identity). Grant athletes immutable legal rights to monetize or withhold granular biometric and health statistics."
        ),
        (
            "ETH-004", "Black-Box Selection & Algorithmic Contract Negotiations", "HIGH",
            "Clubs using proprietary AI injury probability models to unilaterally suppress wage offers or justify benching players during contract renewal periods without transparent explainability.",
            "Contract Agents, Club Sporting Directors, Employment Tribunals",
            0.74, 61.5,
            "Mandate Explainable AI (SHAP / LIME feature attribution) on all models influencing athlete employment rights. Guarantee athletes the right to human-in-the-loop appeal under EU AI Act High-Risk Annex III."
        ),
        (
            "ETH-005", "Automated Officiating (SAOT & VAR) Discretion Erasure", "MEDIUM",
            "Semi-Automated Offside Technology (SAOT) calculating sub-centimeter offsides via limb-tracking algorithms. Sub-second sensor latency (50Hz vs 500Hz) introduces microscopic uncertainty masquerading as absolute truth.",
            "Referees, Match Officials, Fans, Broadcasters",
            0.58, 85.0,
            "Enforce statistical confidence bands (e.g., +/- 3cm margin of tolerance). Maintain referee discretion on subjective phase-of-play interference."
        )
    ]
    for aud in audits_data:
        cursor.execute("""
        INSERT INTO ethical_audits (
            case_code, pillar_title, severity_level, impact_summary, affected_stakeholders,
            bias_disparity_metric, gdpr_compliance_score, ethical_safeguard_recommendation
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, aud)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    seed_db_if_empty()
    print("Database initialized and seeded successfully at:", DB_PATH)
