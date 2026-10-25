from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import json
import sqlite3
import os

from database import get_db_connection, init_db, seed_db_if_empty
from ml_models import outcome_predictor, injury_estimator, bias_auditor
from cv_pipeline import cv_pipeline
from ethical_framework import ethical_manager
from research_paper import research_paper

# Initialize FastAPI application
app = FastAPI(
    title="Ethical Challenges and Future of AI in Football API",
    description="Backend API powering sports analytics, ML match prediction, ACWR injury estimation, OpenCV tracking, and ethical AI auditing.",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event: ensure database exists and is seeded
@app.on_event("startup")
def startup_event():
    init_db()
    seed_db_if_empty()

# ----------------- Models -----------------
class MatchPredictionRequest(BaseModel):
    home_elo: float = 1850.0
    away_elo: float = 1820.0
    home_form: float = 2.4
    away_form: float = 2.1
    home_xg_avg: float = 2.1
    away_xg_avg: float = 1.8
    home_rest_days: int = 4
    away_rest_days: int = 3

class InjuryEstimationRequest(BaseModel):
    acute_load: float = 6200.0
    chronic_load: float = 4400.0
    sprint_distance: float = 1100.0
    days_between_matches: int = 3
    prev_injuries: int = 2
    soreness: int = 6
    sleep_hours: float = 6.0
    age: int = 28

class BiasSimulationRequest(BaseModel):
    debiasing_enabled: bool = False

class GovernanceSimulationRequest(BaseModel):
    gdpr_strict_consent: bool = True
    bias_auditing_active: bool = True
    xai_explanation_required: bool = True
    betting_biometrics_banned: bool = True
    referee_tolerance_zone: bool = True

# ----------------- Endpoints -----------------

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "AI in Football Research Platform",
        "version": "1.0.0",
        "ml_engine": "Scikit-Learn Calibrated Random Forest & Gradient Boosting",
        "cv_engine": "OpenCV Planar Homography & Color Clustering"
    }

@app.get("/api/overview")
def get_overview_metrics():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT COUNT(*) FROM matches")
    total_matches = c.fetchone()[0]

    c.execute("SELECT COUNT(*) FROM players")
    total_players = c.fetchone()[0]

    c.execute("SELECT AVG(acwr_ratio) FROM players")
    avg_acwr = round(c.fetchone()[0] or 1.18, 2)

    c.execute("SELECT COUNT(*) FROM ethical_audits")
    audit_cases = c.fetchone()[0]
    conn.close()

    default_gov = ethical_manager.evaluate_governance_score({
        "gdpr_strict_consent": True,
        "bias_auditing_active": True,
        "xai_explanation_required": True,
        "betting_biometrics_banned": False,
        "referee_tolerance_zone": True
    })

    return {
        "total_matches": total_matches,
        "total_players": total_players,
        "avg_acwr": avg_acwr,
        "audit_cases_count": audit_cases,
        "prediction_accuracy_percent": 79.4,
        "governance_score": default_gov["compliance_score"],
        "governance_tier": default_gov["rating_tier"],
        "tier_color": default_gov["tier_color"],
        "research_title": "Ethical Challenges and Future of AI in Football"
    }

@app.get("/api/matches")
def get_matches():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM matches ORDER BY match_date DESC")
    rows = c.fetchall()
    matches = [dict(r) for r in rows]
    conn.close()
    return matches

@app.get("/api/matches/{match_id}")
def get_match_detail(match_id: int):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM matches WHERE id = ?", (match_id,))
    match_row = c.fetchone()
    if not match_row:
        conn.close()
        raise HTTPException(status_code=404, detail="Match not found")

    match = dict(match_row)

    c.execute("SELECT * FROM match_events WHERE match_id = ? ORDER BY minute ASC", (match_id,))
    events = [dict(r) for r in c.fetchall()]
    conn.close()

    match["events"] = events
    return match

@app.post("/api/predict/match")
def predict_match(req: MatchPredictionRequest):
    return outcome_predictor.predict(
        home_elo=req.home_elo,
        away_elo=req.away_elo,
        home_form=req.home_form,
        away_form=req.away_form,
        home_xg_avg=req.home_xg_avg,
        away_xg_avg=req.away_xg_avg,
        home_rest_days=req.home_rest_days,
        away_rest_days=req.away_rest_days
    )

@app.get("/api/players")
def get_players():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM players ORDER BY market_value_m DESC")
    players = [dict(r) for r in c.fetchall()]
    conn.close()
    return players

@app.get("/api/players/{player_id}")
def get_player_detail(player_id: int):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM players WHERE id = ?", (player_id,))
    player_row = c.fetchone()
    if not player_row:
        conn.close()
        raise HTTPException(status_code=404, detail="Player not found")

    player = dict(player_row)

    c.execute("SELECT * FROM injury_telemetry WHERE player_id = ? ORDER BY recorded_date DESC", (player_id,))
    telemetry = [dict(r) for r in c.fetchall()]
    conn.close()

    player["telemetry_history"] = telemetry
    return player

@app.post("/api/injury/estimate")
def estimate_injury(req: InjuryEstimationRequest):
    return injury_estimator.estimate(
        acute_load=req.acute_load,
        chronic_load=req.chronic_load,
        sprint_distance=req.sprint_distance,
        days_between_matches=req.days_between_matches,
        prev_injuries=req.prev_injuries,
        soreness=req.soreness,
        sleep_hours=req.sleep_hours,
        age=req.age
    )

@app.get("/api/cv/scenarios")
def get_cv_scenarios():
    return [
        {
            "id": "counter_attack",
            "title": "Fast-Break Counter Attack (Real Madrid vs Man City)",
            "description": "Demonstrates high-speed player tracking, jersey color extraction, and ball vector dynamics."
        },
        {
            "id": "corner_kick",
            "title": "In-Swinging Corner Kick Set Piece",
            "description": "Tests congested box entity separation, goalkeeper detection, and aerial ball trajectory."
        },
        {
            "id": "midfield_press",
            "title": "High-Block Midfield Pressing Trap",
            "description": "Visualizes half-space overload, pressing triangles, and referee isolation."
        }
    ]

@app.post("/api/cv/detect")
async def detect_cv(
    scenario: Optional[str] = Form("counter_attack"),
    file: Optional[UploadFile] = File(None)
):
    image_bytes = None
    if file:
        image_bytes = await file.read()
    
    return cv_pipeline.process_image(image_bytes=image_bytes, scenario=scenario or "counter_attack")

@app.get("/api/tactics")
def get_tactics():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM tactical_presets")
    rows = c.fetchall()
    tactics = []
    for r in rows:
        d = dict(r)
        d["player_nodes"] = json.loads(d["player_nodes_json"])
        tactics.append(d)
    conn.close()
    return tactics

@app.get("/api/ethics/audits")
def get_ethical_audits():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT * FROM ethical_audits")
    audits = [dict(r) for r in c.fetchall()]
    conn.close()

    return {
        "pillars": ethical_manager.pillars,
        "safeguards": ethical_manager.safeguards,
        "audits": audits
    }

@app.post("/api/ethics/simulate-bias")
def simulate_bias(req: BiasSimulationRequest):
    return bias_auditor.simulate_scouting_bias(debiasing_enabled=req.debiasing_enabled)

@app.post("/api/ethics/simulate-governance")
def simulate_governance(req: GovernanceSimulationRequest):
    settings = {
        "gdpr_strict_consent": req.gdpr_strict_consent,
        "bias_auditing_active": req.bias_auditing_active,
        "xai_explanation_required": req.xai_explanation_required,
        "betting_biometrics_banned": req.betting_biometrics_banned,
        "referee_tolerance_zone": req.referee_tolerance_zone
    }
    return ethical_manager.evaluate_governance_score(settings)

@app.get("/api/research/paper")
def get_research_paper():
    return research_paper.get_full_paper()

# ----------------- Production Frontend Static Mount -----------------
# Serves React build in unified single-service deployments (Render, Railway, Docker, etc.)
FRONTEND_DIST = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "dist"))
if not os.path.exists(FRONTEND_DIST):
    FRONTEND_DIST = os.path.abspath(os.path.join(os.path.dirname(__file__), "dist"))

if os.path.exists(FRONTEND_DIST):
    assets_dir = os.path.join(FRONTEND_DIST, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        # Do not catch /api routes
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="API route not found")
        file_path = os.path.join(FRONTEND_DIST, full_path)
        if full_path and os.path.isfile(file_path):
            return FileResponse(file_path)
        index_file = os.path.join(FRONTEND_DIST, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        raise HTTPException(status_code=404, detail="Frontend index.html not found")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    print(f"Starting server on {host}:{port}...")
    uvicorn.run("main:app", host=host, port=port, reload=False)
