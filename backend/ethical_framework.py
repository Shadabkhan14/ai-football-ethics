import json

class EthicalFrameworkManager:
    """
    Encapsulates the research paper findings on the ethical challenges,
    regulatory governance, and responsible future of Artificial Intelligence in football.
    """
    def __init__(self):
        self.pillars = self._initialize_pillars()
        self.safeguards = self._initialize_safeguards()

    def _initialize_pillars(self):
        return [
            {
                "id": "pillar_1",
                "code": "ETH-BIO-01",
                "title": "Biometric Surveillance & Worker Dignity",
                "subtitle": "24/7 Telemetry Tracking vs Fundamental Rights to Privacy",
                "urgency": "Critical",
                "description": (
                    "Modern elite football clubs equip players with GPS vests, smart rings, continuous glucose monitors, "
                    "and accelerometers. While aimed at injury prevention, this creates an unprecedented panopticon "
                    "where an athlete's off-pitch sleep, heart rate variability, and recuperation are monitored 24/7."
                ),
                "legal_context": "GDPR Article 9 (Special Category Health Data) & Charter of Fundamental Rights of the EU (Art. 8).",
                "key_risk": "Erosion of the boundary between employment performance and personal life autonomy.",
                "research_recommendation": (
                    "Mandate strict architectural separation between on-pitch performance metrics and private off-pitch biometrics. "
                    "Implement localized edge computing where raw biometric data never leaves the player's personal device without explicit session tokens."
                )
            },
            {
                "id": "pillar_2",
                "code": "ETH-OWN-02",
                "title": "Data Sovereignty & Commercial Exploitation",
                "subtitle": "Who Owns the Athlete's Digital Twin?",
                "urgency": "High",
                "description": (
                    "Optical tracking generates over 3.5 million data points per 90-minute match. Broadcast networks "
                    "and sports betting syndicates monetize live fatigue indicators and sprint speeds. However, athletes "
                    "rarely receive royalties or retain control over their biometric IP."
                ),
                "legal_context": "Intellectual Property Rights, Image Rights, and FIFPRO Collective Bargaining Frameworks.",
                "key_risk": "Exploitation of athlete biometric labor by third-party gambling syndicates and algorithmic trading bots.",
                "research_recommendation": (
                    "Establish Athlete Self-Sovereign Identity (SSI) data vaults. Any monetization of high-frequency biometric feeds "
                    "must require affirmative contractual revenue-sharing and opt-in consent."
                )
            },
            {
                "id": "pillar_3",
                "code": "ETH-BIAS-03",
                "title": "Algorithmic Bias in Scouting & Valuation",
                "subtitle": "Eurocentric Data Inequality & Global Scouting Disparities",
                "urgency": "High",
                "description": (
                    "Computer vision and expected-threat (xT) algorithms are overwhelmingly trained on UEFA Champions League "
                    "and Premier League multi-camera broadcast feeds. Prospects from South American and African academies "
                    "suffer from severe algorithmic penalties due to lower-resolution camera footage and missing sensor coverage."
                ),
                "legal_context": "EEOC 80% Rule (Disparate Impact), EU AI Act (High-Risk AI Systems Annex III).",
                "key_risk": "Systematic market devaluation and overlooked talent pipelines across the Global South.",
                "research_recommendation": (
                    "Enforce domain-adaptive neural representations and synthetic data normalization. Scouting algorithms "
                    "must undergo mandatory Disparate Impact auditing before being commercialized by clubs."
                )
            },
            {
                "id": "pillar_4",
                "code": "ETH-XAI-04",
                "title": "Explainability & Contract Coercion",
                "subtitle": "The Danger of Black-Box AI in Squad Selection & Wage Negotiations",
                "urgency": "Critical",
                "description": (
                    "Proprietary AI injury prediction models are increasingly leveraged by sporting directors to justify "
                    "reduced salary offers, shorter contract lengths, or benching during contract dispute phases. "
                    "Athletes and their representatives are denied access to the model's inner workings."
                ),
                "legal_context": "Right to Explanation (GDPR Art. 22), Labor Protection Laws against automated decisions.",
                "key_risk": "Asymmetric bargaining power where unvalidated statistical predictions dictate livelihoods.",
                "research_recommendation": (
                    "Legislate an absolute ban on unexplainable black-box models in labor negotiations. Require verifiable "
                    "SHAP/LIME feature attribution and an independent medical arbitration board."
                )
            },
            {
                "id": "pillar_5",
                "code": "ETH-VAR-05",
                "title": "Automated Officiating & False Precision",
                "subtitle": "Semi-Automated Offside (SAOT) & The Erasure of Human Discretion",
                "urgency": "Medium",
                "description": (
                    "Limb-tracking optical cameras (12 dedicated cameras operating at 50Hz) determine offside calls by millimeter margins. "
                    "However, because a ball travels at ~30 m/s, the 20ms gap between frames creates an inherent physical margin of error of +/- 5cm, "
                    "creating an illusion of mathematical infallibility."
                ),
                "legal_context": "IFAB Laws of the Game & Sports Arbitration Jurisprudence (CAS).",
                "key_risk": "Fan alienation, loss of human referee discretion, and spurious offside calls based on sensor noise.",
                "research_recommendation": (
                    "Introduce a statistical 'Tolerance Zone' (e.g. 5cm threshold) where optical uncertainty defers to the on-field call. "
                    "Publish real-time calibration confidence intervals on stadium broadcast screens."
                )
            },
            {
                "id": "pillar_6",
                "code": "ETH-FUT-06",
                "title": "Responsible Future & Synthetic Digital Twins",
                "subtitle": "Balancing Competitive Edge with Ethical Human-Centered AI",
                "urgency": "Medium",
                "description": (
                    "The frontier of football AI envisions full digital biomechanical twins of players capable of simulating matches "
                    "in virtual physics engines before kickoff. Without a strong ethical charter, this technology risks reducing "
                    "athletes to tradeable computational assets."
                ),
                "legal_context": "UNESCO Ethics of Artificial Intelligence & FIFA Future of Football Roadmap 2030.",
                "key_risk": "Dehumanization of athletic competition and cognitive overload from automated tactical micromanagement.",
                "research_recommendation": (
                    "Form a Global Football AI Ethics Council comprising players, coaches, data scientists, and ethicists to enforce "
                    "a binding Charter for Responsible AI in Sport."
                )
            }
        ]

    def _initialize_safeguards(self):
        return [
            {
                "category": "Technical Architecture",
                "name": "Zero-Knowledge Biometric Vaults",
                "description": "Cryptographic zero-knowledge proofs enable medical staff to verify athlete fitness thresholds without exposing granular sleep or heart-rate history to coaching or executive staff."
            },
            {
                "category": "Algorithmic Fairness",
                "name": "Continuous Disparate Impact Auditing",
                "description": "Scouting and valuation models must demonstrate a Disparate Impact Ratio >= 0.80 across diverse nationalities, age brackets, and league tiers before production deployment."
            },
            {
                "category": "Legal & Regulatory",
                "name": "Mandatory Human-in-the-Loop Safeguard",
                "description": "Prohibit automated benching, contract termination, or non-selection based purely on algorithmic outputs. The human manager and club doctor retain ultimate legal accountability."
            },
            {
                "category": "Commercial Governance",
                "name": "Biometric Betting Ban & Athlete IP Rights",
                "description": "Ban the unconsented sale of ultra-high frequency physiological metrics (e.g. fatigue index, micro-tears) to sports betting operators to protect athletes and integrity of the game."
            }
        ]

    def evaluate_governance_score(self, settings):
        """
        Simulates overall ethical compliance score based on active policy levers:
        - gdpr_strict_consent (bool)
        - bias_auditing_active (bool)
        - xai_explanation_required (bool)
        - betting_biometrics_banned (bool)
        - referee_tolerance_zone (bool)
        """
        score = 35 # baseline unconstrained commercial AI

        if settings.get("gdpr_strict_consent", False):
            score += 18
        if settings.get("bias_auditing_active", False):
            score += 16
        if settings.get("xai_explanation_required", False):
            score += 15
        if settings.get("betting_biometrics_banned", False):
            score += 10
        if settings.get("referee_tolerance_zone", False):
            score += 6

        score = min(100, score)

        if score >= 85:
            tier = "Gold Standard: Fully Compliant & Human-Centric"
            color = "#10b981"
        elif score >= 65:
            tier = "Silver Standard: Substantial Safeguards in Place"
            color = "#38bdf8"
        elif score >= 45:
            tier = "Bronze Standard: Minimal Safeguards (High Regulatory Risk)"
            color = "#f59e0b"
        else:
            tier = "Critical Risk: Unregulated Algorithmic Exploitation"
            color = "#ef4444"

        return {
            "compliance_score": score,
            "rating_tier": tier,
            "tier_color": color,
            "eu_ai_act_status": "Fully Compliant" if score >= 75 else "Non-Compliant (Audit Warning)",
            "fifa_ethics_status": "Certified" if score >= 70 else "Provisional",
            "active_levers_count": sum(1 for v in settings.values() if v)
        }

ethical_manager = EthicalFrameworkManager()
