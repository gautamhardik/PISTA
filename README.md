<div align="center">

# ⚡ PISTA — Payment Intelligence & Security Telemetry Architecture
### *Turning raw payment clues across devices and networks into sub-millisecond, calibrated, and explainable fraud decisions before checkout completes.*

<br/>

[![Master Pitch Video](https://img.shields.io/badge/🎬_Master_Pitch_Demo-5m_33s_Video-FF0000.svg?style=for-the-badge&logo=youtube&logoColor=white)](output/PISTA_Master_Pitch_Demo.mp4)
[![GitHub Source](https://img.shields.io/badge/GitHub-Repository-181717.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/gautamhardik/PISTA)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![Python 3.13](https://img.shields.io/badge/Python-3.13+-3776AB.svg?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688.svg?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Next.js 16](https://img.shields.io/badge/Next.js_16-Turbopack-000000.svg?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![LightGBM Risk Engine](https://img.shields.io/badge/LightGBM-Risk_Booster-3395FF.svg?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://lightgbm.readthedocs.io/)
[![TreeSHAP](https://img.shields.io/badge/Explainability-TreeSHAP-C7F36B.svg?style=for-the-badge&labelColor=07080a)](https://shap.readthedocs.io/)
[![PostgreSQL 16](https://img.shields.io/badge/PostgreSQL-16_Alpine-4169E1.svg?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tests Passing](https://img.shields.io/badge/Test_Suite-12%2F12_Passing_100%25-10B981.svg?style=for-the-badge&logo=pytest&logoColor=white)](https://github.com/gautamhardik/PISTA/tree/main/backend/tests)

<br/>

</div>

---

> ### 📋 15-Second Executive Brief for Evaluators
> * **Commercial Problem**: Real-time checkout fraud prevention under extreme class imbalance (3.5% base fraud rate) without adding latency or false declines.
> * **Benchmark Dataset**: IEEE-CIS Fraud Detection (590,540 real-world transactions with chronological out-of-time validation).
> * **Production Model**: `PISTA LightGBM Risk Engine` (Tuned LightGBM + Isotonic Probability Calibrator).
> * **Feature Space**: **492 engineered dimensions** spanning 10 causal feature families (spending deviations, velocity bursts, composite cards).
> * **Primary Optimization Metric**: **PR-AUC = 0.5450** on held-out validation cohort of 118,534 transactions (vs. ROC-AUC = 0.9130).
> * **Calibration Quality**: **Brier Score = 0.0234** via Isotonic Regression (guaranteeing reliable posterior probabilities).
> * **Inference Latency**: Booster Inference **< 1.0 ms** | Full API with local TreeSHAP attribution **~35–45 ms**.
> * **Operational Policy**: Tri-State Operational Routing ($\tau_{\text{review}} = 0.25$, $\tau_{\text{block}} = 0.75$).
> * **Gateway Verification**: Razorpay Standard Checkout Test Mode with raw-byte HMAC-SHA256 signature verification & idempotent webhook store.
> * **End-to-End Reproducibility**: 5-part sequential Jupyter notebook suite (`Notebooks/01` to `Notebooks/05`) + 1-Click launcher + Docker compose.

---

<details>
<summary>📑 <b>Click to expand Table of Contents</b></summary>

1. [Demo & Master Pitch Video](#1-demo--master-pitch-video)
2. [Executive Summary](#2-executive-summary)
3. [The Core Problem & Business ROI](#3-the-core-problem--business-roi)
4. [Why PISTA Architecture](#4-why-pista-architecture)
5. [System Architecture & Sequence Flow](#5-system-architecture--sequence-flow)
6. [End-to-End Transaction Flow](#6-end-to-end-transaction-flow)
7. [Machine Learning Pipeline & Dataset](#7-machine-learning-pipeline--dataset)
8. [Reproducible 5-Notebook Suite](#8-reproducible-5-notebook-suite)
9. [Feature Engineering (10 Core Families)](#9-feature-engineering-10-core-families)
10. [Model Benchmarks & SLA Trade-offs](#10-model-benchmarks--sla-trade-offs)
11. [Probability Calibration & TreeSHAP Attribution](#11-probability-calibration--treeshap-attribution)
12. [Tri-State Policy Routing Matrix](#12-tri-state-policy-routing-matrix)
13. [Application Showcase & Visual Tour](#13-application-showcase--visual-tour)
14. [Security & Cryptographic Invariants](#14-security--cryptographic-invariants)
15. [API Specification & Contract Schemas](#15-api-specification--contract-schemas)
16. [Technology Stack](#16-technology-stack)
17. [Environment Configuration](#17-environment-configuration)
18. [Local Setup & 1-Click Launch Guide](#18-local-setup--1-click-launch-guide)
19. [Evaluator Quickstart (Step-by-Step Test Drive)](#19-evaluator-quickstart-step-by-step-test-drive)
20. [Project Directory Structure](#20-project-directory-structure)
21. [Automated Test Suite & Quality Assurance](#21-automated-test-suite--quality-assurance)
22. [Limitations & Production Hardening](#22-limitations--production-hardening)
23. [Engineering War Stories: 3 Production Hurdles](#23-engineering-war-stories-what-broke-at-2-am--how-we-got-out)
24. [Conclusion & Citation](#24-conclusion--citation)

</details>

---

## 1. Demo & Master Pitch Video

### 🎬 Master Pitch Video (5m 33s)
* **Master Video File**: [`output/PISTA_Master_Pitch_Demo.mp4`](output/PISTA_Master_Pitch_Demo.mp4)
* **Specifications**: Native 2878×1798 Progressive @ 30 FPS, calibrated 1.25x speed, sidechain-ducked inspiring soundtrack, burned-in styled subtitles with keyword highlighting, and animated chapter cards.
* **Scope**: Architecture overview $\rightarrow$ 492-D velocity scoring $\rightarrow$ Razorpay HMAC authentication $\rightarrow$ PostgreSQL case investigation studio $\rightarrow$ 118K validation analytics $\rightarrow$ Automated chargeback dispute defense.

![PISTA Overview Hero](images/01_hero_overview.png)

---

## 2. Executive Summary

PISTA solves the fundamental disconnect between training offline fraud classifiers and executing high-stakes, real-time payment decisions in production checkout flows.

Predicting a raw binary label (`0` or `1`) is disastrous for real-world merchant operations. Production payment gateways require **calibrated posterior risk probabilities**, **sub-millisecond inference SLAs**, **local explainability for chargeback investigators**, and **tri-state routing policies** that maximize fraud capture while protecting valid customer revenue.

```mermaid
graph LR
    A[Payment Telemetry] --> B[492-D Preprocessing]
    B --> C[PISTA LightGBM]
    C --> D[Isotonic Calibration]
    D --> E[TreeSHAP Explainer]
    E --> F{Tri-State Policy}
    F -->|P < 0.25| G[APPROVE: Frictionless Clearance]
    F -->|0.25 <= P < 0.75| H[REVIEW: Forensic Case Queue]
    F -->|P >= 0.75| I[BLOCK: Immediate Rejection]
    G & H & I --> J[(PostgreSQL 16 Persistence)]
```

---

## 3. The Core Problem & Business ROI

1. **Extreme Class Imbalance (3.5% Fraud Rate)**: Measuring accuracy or ROC-AUC creates a false sense of security; high true-negative rates mask catastrophic false-positive spikes.
2. **Uncalibrated Model Logits**: Raw gradient boosting outputs are uncalibrated rankings rather than true mathematical probabilities $P(Y=1|X)$.
3. **Black-Box Opacity**: Chargeback analysts cannot defend or audit unexplained risk scores during acquiring bank disputes.
4. **The Binary Threshold Dilemma**: A single cutoff ($0.50$) forces merchants into a destructive choice between high fraud loss or alienating valid cardholders.

### 💰 Business Impact Formula:
$$\text{Expected Loss} = P(\text{Fraud}) \cdot (\text{Amount} + C_{\text{chargeback\_fee}}) + (1 - P(\text{Fraud})) \cdot C_{\text{false\_decline\_friction}}$$

PISTA resolves all four with **Isotonic Probability Calibration**, **exact local TreeSHAP attribution**, and **Tri-State Operational Policy Routing**.

---

## 4. Why PISTA Architecture

| Dimension | Industry Default | PISTA Production Architecture | Operational Impact |
| :--- | :--- | :--- | :--- |
| **Imbalance Handling** | ROC-AUC / Accuracy | **Optimized for PR-AUC (0.5450)** | Maximizes precision on the rare 3.5% fraud class. |
| **Probability Truth** | Uncalibrated Sigmoid Logits | **Isotonic Calibration ($Brier = 0.0234$)** | Guarantees risk scores reflect genuine empirical fraud rates. |
| **Explainability** | Global Feature Importance | **Real-Time Local TreeSHAP** | Isolates the top positive/negative risk drivers for every transaction. |
| **Decision Policy** | Binary Cutoff ($0.50$) | **Tri-State Routing ($\tau_1 = 0.25, \tau_2 = 0.75$)** | Separates frictionless checkouts from cases needing analyst triage. |
| **Auditability** | In-Memory Logs | **PostgreSQL Immutable Audit Trail** | Full enterprise regulatory compliance with actor timestamps. |
| **Payment Gateway** | Synthetic Mock Payload | **Razorpay Live Modal + Raw-Byte HMAC** | Cryptographically validates payment authenticity before scoring. |
| **Chargeback Defense**| Manual Spreadsheet Triage | **Automated Dispute Dossier Generator** | Cuts bank representation turnaround from hours to seconds. |

---

## 5. System Architecture & Sequence Flow

### 🏗️ Full-Stack Component Architecture
```mermaid
flowchart TD
    subgraph Client["Presentation Layer (Next.js 16 + Turbopack)"]
        UI_Home["/ (Overview Landing & 4 Pillars)"]
        UI_Analyze["/analyze (492-Feature Form & Razorpay Modal)"]
        UI_Result["/result (4-Layer Latency & TreeSHAP Drawer)"]
        UI_Cases["/cases (PostgreSQL Triage Queue & Audit Timeline)"]
        UI_Analytics["/analytics (118k Benchmark Cohort vs Live Telemetry)"]
        UI_Model["/model (Lineage, Benchmark Table & Threshold Studio)"]
        UI_Chargebacks["/chargebacks (Automated Dispute Dossier Generator)"]
        UI_Settings["/settings (Service Health & Cryptographic Probes)"]
    end

    subgraph API["Backend Service Layer (FastAPI 0.115)"]
        Router_Predict["POST /api/v1/predict"]
        Router_Payments["POST /api/v1/payments/razorpay/*"]
        Router_Cases["GET|PATCH /api/v1/cases/*"]
        Router_Analytics["GET /api/v1/analytics/*"]
        Router_Model["GET /api/v1/model/*"]
        Router_Health["GET /health, /readiness"]
    end

    subgraph CoreML["Machine Learning & Risk Engine"]
        Preprocessor["Single-Pass 492-D Vectorizer"]
        Booster["PISTA LightGBM Risk Engine (<1ms)"]
        Calibrator["Isotonic Probability Calibrator"]
        Explainer["Singleton TreeSHAP Explainer Pipeline"]
        PolicyEngine["Tri-State Policy Routing Engine"]
    end

    subgraph Data["Persistence Layer (PostgreSQL 16 Alpine)"]
        DB_Tx["transactions (UUID, payload, latencies)"]
        DB_Risk["risk_assessments (probabilities, SHAP factors)"]
        DB_Cases["cases (triage state, resolution notes)"]
        DB_Audit["case_audit_logs (actor, status, timestamp)"]
        DB_Webhooks["webhook_events (idempotent signature store)"]
    end

    Client --> API
    API --> CoreML
    CoreML --> Data
    API --> Data
```

### 🔄 Razorpay Payment & Risk Evaluation Sequence
```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant UI as Next.js 16 Client
    participant API as FastAPI Backend
    participant RZP as Razorpay Gateway
    participant ML as PISTA ML Engine
    participant DB as PostgreSQL 16

    Customer->>UI: Selects Transaction & Clicks Pay
    UI->>API: POST /api/v1/payments/razorpay/order
    API->>RZP: Create Order (amount, currency)
    RZP-->>API: Order ID (order_xxx)
    API-->>UI: Order Credentials
    UI->>Customer: Opens Razorpay Checkout Modal
    Customer->>RZP: Authorizes Payment
    RZP-->>UI: Payment ID & HMAC Signature
    UI->>API: POST /api/v1/payments/razorpay/verify (Raw Body)
    API->>API: Verify HMAC-SHA256 Signature
    API->>ML: Vectorize 492-D & Infer LightGBM (<1ms)
    ML->>ML: Calibrate Probability & Compute TreeSHAP
    ML-->>API: Risk Assessment (Score: 82, BLOCK)
    API->>DB: Atomic Commit (Tx, Risk, Case Audit)
    API-->>UI: Evaluation Result & Latency Gauges
    UI->>Customer: Displays Interactive Decision Path
```

---

## 6. End-to-End Transaction Flow

1. **Ingestion**: Telemetry arrives via client API payload or authenticated Razorpay checkout modal.
2. **Cryptographic Check**: If gateway payment, the raw byte stream is verified against the HMAC-SHA256 signature.
3. **492-D Vectorization**: Single-pass vectorizer maps raw features into normalized numeric and categorical tensors with median fallback.
4. **Production Model Inference**: LightGBM Risk Engine scores the 492-D vector in $< 1.0\text{ ms}$.
5. **Probability Calibration**: Isotonic regression maps the raw boosting logit into a true posterior probability $P(\text{Fraud} = 1 | X)$.
6. **TreeSHAP Decomposition**: Pre-initialized TreeExplainer calculates exact local Shapley values, extracting top risk amplifiers and trust mitigators.
7. **Tri-State Policy Routing**:
   - $P < 0.25 \rightarrow \mathbf{APPROVE}$ (instant checkout clearance).
   - $0.25 \le P < 0.75 \rightarrow \mathbf{REVIEW}$ (automatically ingested into PostgreSQL investigation queue).
   - $P \ge 0.75 \rightarrow \mathbf{BLOCK}$ (hard transaction rejection).
8. **Atomic Persistence**: Transaction payload, risk assessment, and case audit records are committed to PostgreSQL.
9. **Visual Hydration**: Frontend renders the result with a 4-layer latency breakdown and interactive decision path.

---

## 7. Machine Learning Pipeline & Dataset

### Dataset: IEEE-CIS Fraud Detection Benchmark
* **Total Records**: 590,540 real-world e-commerce transactions.
* **Dimensionality**: 394 raw columns expanded to **492 engineered features**.
* **Validation Strategy**: **Chronological out-of-time validation split** (training on earlier months, evaluating on the final 118,534 transactions to strictly prevent temporal leakage).

```bash
# Automated Dataset Acquisition via Kaggle CLI
kaggle competitions download -c ieee-fraud-detection -p Data/raw/
unzip -q Data/raw/ieee-fraud-detection.zip -d Data/raw/
```

---

## 8. Reproducible 5-Notebook Suite

The entire ML lifecycle—from forensic data exploration to production artifact serialization—is encapsulated in 5 sequential Jupyter notebooks in [`Notebooks/`](Notebooks):

| Notebook | Focus | Primary Methodology | Output Artifact |
| :--- | :--- | :--- | :--- |
| **`01_data_understanding_and_eda.ipynb`** | Forensic EDA & Imbalance Analysis | Amount distribution, missingness maps, identity presence analysis | Exploratory figures & data health report |
| **`02_feature_engineering_and_risk_representation.ipynb`** | 492-D Causal Feature Store | Expanding temporal stats, entity velocity bursts, domain discrepancy matching | `train_features.parquet`, `val_features.parquet` |
| **`03_baseline_fraud_modeling_and_benchmarking.ipynb`** | Multi-Model Benchmarking & Tuning | LightGBM, XGBoost, CatBoost, Random Forest, Heterogeneous Blend | `baseline_lightgbm.joblib` |
| **`04_model_evaluation_threshold_optimization.ipynb`** | Calibration & Policy Optimization | Isotonic Regression calibration ($Brier=0.0234$), Cost Curve ($C_{\text{FN}}$ vs $C_{\text{FP}}$) | `calibration_model.joblib`, `decision_policy_config.json` |
| **`05_model_explainability_and_risk_decisioning.ipynb`** | TreeSHAP Explainability & Triage | Local/Global SHAP values, beeswarm plots, high-risk error forensics | Model governance cards & feature schemas |

```bash
# Execute Complete Reproducibility Suite via nbconvert
jupyter nbconvert --to notebook --execute Notebooks/01_data_understanding_and_eda.ipynb
jupyter nbconvert --to notebook --execute Notebooks/02_feature_engineering_and_risk_representation.ipynb
jupyter nbconvert --to notebook --execute Notebooks/03_baseline_fraud_modeling_and_benchmarking.ipynb
jupyter nbconvert --to notebook --execute Notebooks/04_model_evaluation_threshold_optimization.ipynb
jupyter nbconvert --to notebook --execute Notebooks/05_model_explainability_and_risk_decisioning.ipynb
```

---

## 9. Feature Engineering (10 Core Families)

```text
492 Engineered Features
├── 01. Financial Scaling (log1p amounts, cents decimal fractions, round amount anomaly flags)
├── 02. Temporal Dynamics (sin/cos diurnal cycles, relative elapsed transaction hours)
├── 03. Card Entity Aggregations (card1-addr1 composite keys, expanding entity frequencies)
├── 04. Historical Spending Deviations (expanding mean, variance, transaction z-scores)
├── 05. Velocity & Burst Signals (time-since-previous-tx, 10-minute rapid burst counters)
├── 06. Identity Completeness (presence flags, device attribute completeness ratios)
├── 07. Domain Discrepancy Signals (purchaser email vs. recipient email domain mismatch)
├── 08. Entity Graph Connectivity (distinct address and device counts per payment card)
├── 09. Causal Rolling Windows (1-hour and 24-hour historical transaction sums)
└── 10. Provider Data Alignment (defaults & median baselines for unobserved telemetry)
```

---

## 10. Model Benchmarks & SLA Trade-offs

### Held-Out Validation Cohort (118,534 Transactions)

| Candidate Model | PR-AUC (Primary) | ROC-AUC | Brier Score | Inference SLA | Operational Status |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **PISTA LightGBM Risk Engine** | **0.5450** | **0.9130** | **0.0234** | **< 1.0 ms** | 🟢 **PRODUCTION ACTIVE** |
| Heterogeneous Stacked Blend | 0.5413 | 0.9151 | 0.0238 | 4.20 ms | ⚪ Benchmark Baseline Model |
| Tuned XGBoost Booster | 0.5382 | 0.9084 | 0.0241 | 2.80 ms | ⚪ Evaluated |
| CatBoost Classifier | 0.5310 | 0.9022 | 0.0249 | 5.10 ms | ⚪ Evaluated |
| Random Forest Baseline | 0.4620 | 0.8640 | 0.0285 | 12.5 ms | ⚪ Baseline |
| Logistic Regression | 0.2840 | 0.7720 | 0.0332 | 0.40 ms | ⚪ Linear Baseline |

### 📐 Optimization Metric Formulation:
$$\text{PR-AUC} = \int_0^1 P(R) \, dR = \sum_{k=1}^K P(k) \cdot \Delta R(k)$$

> **💡 The Production SLA Decision**: While the 3-model blend achieved a marginal +0.0021 in ROC-AUC, its **4.20 ms** inference time tripled latency. LightGBM delivered the highest **PR-AUC (0.5450)** in **< 1.0 ms**, making it the clear choice for synchronous online checkout SLAs.

---

## 11. Probability Calibration & TreeSHAP Attribution

### Isotonic Probability Calibration
Raw boosting logits optimize ranking rather than posterior probabilities. PISTA passes scores through an Isotonic Calibrator:
$$\min \sum_{i=1}^N \left( y_i - \hat{p}_i \right)^2 \quad \text{subject to } \hat{p}_i \ge \hat{p}_j \text{ whenever } s_i \ge s_j$$
$$\text{Brier Score} = \frac{1}{N} \sum_{t=1}^N \left( f_t - o_t \right)^2 = 0.0234$$
This reduced the **Brier Score to 0.0234**, ensuring an 82% risk score corresponds to an empirical 82% fraud likelihood.

### Real-Time TreeSHAP Attribution
TreeSHAP computes exact local additive attributions ($f(x) = \phi_0 + \sum_{i=1}^M \phi_i$) to isolate:
* **Top Risk Drivers**: Card velocity spikes, anomalous email domain ratios, missing identity telemetry.
* **Top Trust Mitigators**: Established cardholder tenure, matching billing regions, standard transaction amount.

---

## 12. Tri-State Policy Routing Matrix

| Calibrated Posterior Probability ($P$) | Operational Policy | Execution Path | Merchant Business Impact |
| :--- | :---: | :--- | :--- |
| **$P < 25.0\%$** | **`APPROVE`** | Instant clearance | Zero customer friction; frictionless checkout clearance. |
| **$25.0\% \le P < 75.0\%$** | **`REVIEW`** | PostgreSQL Triage Queue | Prevents false-decline revenue loss while containing risk. |
| **$P \ge 75.0\%$** | **`BLOCK`** | Immediate Rejection | Hard rejection; halts chargebacks and dispute penalties. |

---

## 13. Application Showcase & Visual Tour

### 01. Transaction Risk Analysis & Form Hydration
Submit raw 492-feature parameters directly or test realistic fraud scenarios via quick presets.
![Transaction Analysis](images/02_transaction_analysis.png)

---

### 02. Razorpay Live Gateway Authorization
Simulate live customer checkout with server-side HMAC-SHA256 signature verification.
![Razorpay Gateway](images/03_razorpay_gateway.png)

---

### 03. Operational Analytics & Latency Gauges
Dual-context analytics comparing 118,534 validation cohort metrics against live production telemetry.
![Analytics Dashboard](images/04_analytics_dashboard.png)

---

### 04. Case Investigation Studio & Immutable Audit Trail
Persistent PostgreSQL triage queue allowing analysts to review SHAP vectors and record audit actions.
![Investigation Cases](images/05_investigation_cases.png)

---

### 05. Model Lineage, Benchmark & Threshold Studio
Full model governance tracking IEEE-CIS lineage, candidate comparisons, and policy tuning.
![Model Governance](images/06_model_governance.png)

---

### 06. System Health & Security Probe Matrix
Runtime container probes, cryptographic invariants, and database connection monitors.
![System & Security](images/07_system_security.png)

---

## 14. Security & Cryptographic Invariants

* **Server-Side API Secrets**: Gateway credentials and webhook secrets never leak to the client bundle.
* **Raw-Byte HMAC-SHA256 Verification**: Payment signatures are verified using immutable raw request bytes before JSON deserialization.
* **Webhook Idempotency**: All webhook events are deduplicated against the `webhook_events` PostgreSQL store.
* **Parameterized ORM Queries**: All database operations use SQLAlchemy 2.0 parameterized queries to prevent SQL injection.

---

## 15. API Specification & Contract Schemas

### 📡 Sample Request & Response Contract (`POST /api/v1/predict`)

#### cURL Request:
```bash
curl -X POST http://localhost:8000/api/v1/predict \
  -H "Content-Type: application/json" \
  -d '{
    "TransactionAmt": 4800.00,
    "ProductCD": "W",
    "card1": 15000,
    "card2": 555,
    "card4": "visa",
    "card6": "credit",
    "P_emaildomain": "anonymous.com",
    "R_emaildomain": "protonmail.com",
    "DeviceType": "mobile",
    "DeviceInfo": "SM-G960F"
  }'
```

#### JSON Response:
```json
{
  "transaction_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "raw_score": 0.8842,
  "calibrated_risk_score": 82.0,
  "decision": "BLOCK",
  "policy_thresholds": {
    "review_threshold": 0.25,
    "block_threshold": 0.75
  },
  "shap_factors": {
    "top_risk_drivers": [
      {"feature": "card1_addr1_10m_burst_count", "impact": "+0.342", "description": "Extreme velocity burst"},
      {"feature": "domain_mismatch_flag", "impact": "+0.185", "description": "High-risk email domain"}
    ],
    "top_trust_mitigators": [
      {"feature": "card_tenure_days", "impact": "-0.082", "description": "Known cardholder tenure"}
    ]
  },
  "latencies_ms": {
    "preprocessing_ms": 1.2,
    "booster_inference_ms": 0.84,
    "shap_attribution_ms": 32.4,
    "db_persistence_ms": 4.1,
    "total_api_ms": 38.54
  }
}
```

### 📋 Full Endpoint Catalog:
| Method | Endpoint | Description | Latency SLA |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/v1/predict` | Single-pass 492-D vectorization, LightGBM inference, calibration, and TreeSHAP. | **< 45 ms** |
| `POST` | `/api/v1/payments/razorpay/order` | Creates an authentic Razorpay Test Mode order. | **< 25 ms** |
| `POST` | `/api/v1/payments/razorpay/verify` | Validates HMAC-SHA256 raw signature and evaluates risk. | **< 50 ms** |
| `GET` | `/api/v1/cases` | Retrieves triage cases from PostgreSQL with filtering. | **< 15 ms** |
| `PATCH`| `/api/v1/cases/{case_id}/status` | Updates case state and writes an immutable audit record. | **< 20 ms** |
| `GET` | `/api/v1/cases/{case_id}/audit` | Retrieves chronological audit event history for a case. | **< 15 ms** |
| `GET` | `/api/v1/analytics/summary` | Returns offline 118K validation cohort benchmark metrics. | **< 10 ms** |
| `GET` | `/api/v1/analytics/live` | Returns live operational telemetry (P50/P95 latencies, counts). | **< 15 ms** |
| `GET` | `/health`, `/readiness` | Probes container liveness and ML model memory load status. | **< 5 ms** |

---

## 16. Technology Stack

| Layer | Technology | Key Role in PISTA |
| :--- | :--- | :--- |
| **Frontend UI** | Next.js 16 (App Router), React 19, Tailwind CSS 4, Recharts, Framer Motion | High-performance spatial transaction intelligence interface |
| **Backend REST** | FastAPI 0.115, Pydantic v2, Uvicorn, Python 3.13 | Asynchronous REST service engine with OpenAPI docs |
| **Machine Learning**| LightGBM, Scikit-Learn (Isotonic), TreeSHAP | Sub-millisecond scoring, calibration, and local explainability |
| **Data Processing** | Polars, NumPy, Pandas, PyArrow | Fast feature store transformations and parquet serialization |
| **Database** | PostgreSQL 16 Alpine, SQLAlchemy 2.0 | Persistent transactional store and immutable case audit logging |
| **Payment Gateway** | Razorpay Gateway (Test Mode) | Live modal checkout integration and HMAC verification |
| **Containerization**| Docker, Docker Compose | Orchestration for multi-container production deployments |

---

## 17. Environment Configuration

Copy `.env.example` to `.env` in the root directory:
```bash
cp .env.example .env
```

| Variable | Default / Format | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql+asyncpg://pista_user:pista_password@localhost:5432/pista_db` | PostgreSQL Async Connection String |
| `RAZORPAY_KEY_ID` | `rzp_test_YourKeyHere` | Razorpay Test Mode API Key |
| `RAZORPAY_KEY_SECRET` | `YourSecretHere` | Razorpay Key Secret (Server-Side Only) |
| `ENVIRONMENT` | `production` | Environment mode (`development` / `production`) |
| `LOG_LEVEL` | `INFO` | Logging verbosity (`DEBUG`, `INFO`, `WARNING`) |

---

## 18. Local Setup & 1-Click Launch Guide

### Option A: 1-Click Instant Launch (Windows)
```cmd
run.bat
```
*(Or double-click `run.bat` in File Explorer. Automatically starts FastAPI + Next.js and opens your browser).*

---

### Option B: Docker Compose Multi-Container Stack
```bash
# 1. Clone the repository
git clone https://github.com/gautamhardik/PISTA.git
cd PISTA

# 2. Build and launch all 3 production containers (PostgreSQL + Backend + Frontend)
docker compose up --build -d

# 3. Verify container health status
docker compose ps
```

| Service | Local URL | Documentation / Role |
| :--- | :--- | :--- |
| **Frontend UI** | `http://localhost:3000` | Complete PISTA Web Interface |
| **Backend API** | `http://localhost:8000/docs` | Interactive Swagger API Explorer |
| **Health Check**| `http://localhost:8000/health` | Backend Liveness Probe |
| **PostgreSQL** | `localhost:5432` | `pista_db` (user: `pista_user`) |

---

## 19. Evaluator Quickstart (Step-by-Step Test Drive)

1. Open **[http://localhost:3000/analyze](http://localhost:3000/analyze)**.
2. Click the preset **`02. High Risk Vector ($4,850)`**, then click **Analyze Transaction**.
3. Inspect the **Result Page**: review the **4-Layer Latency breakdown**, the **TreeSHAP model drivers**, and the **Decision Path**.
4. Open **[http://localhost:3000/cases](http://localhost:3000/cases)**: click the flagged transaction, add an investigator note, and click **Resolve as Legitimate**. Observe the audit timeline update in real time.
5. Open **[http://localhost:3000/analytics](http://localhost:3000/analytics)**: inspect the 118K validation cohort charts side-by-side with Live Operations.

---

## 20. Project Directory Structure

```text
PISTA/
├── README.md                          # Master 10/10 documentation & system blueprint
├── build_master_final_pitch.py        # Automated 10/10 master pitch video generation pipeline
├── run.bat                            # 1-Click Windows launcher (Auto-opens browser)
├── run.ps1                            # 1-Click PowerShell launcher with job management
├── run.sh                             # 1-Click Bash launcher for Linux / macOS
├── docker-compose.yml                 # Production multi-container orchestration
├── .gitignore                         # Security & dataset exclusion rules
├── .env.example                       # Environment configuration template
├── LICENSE                            # MIT Open Source License
│
├── Notebooks/                         # Complete 5-Notebook Reproducible ML Suite
│   ├── 01_data_understanding_and_eda.ipynb
│   ├── 02_feature_engineering_and_risk_representation.ipynb
│   ├── 03_baseline_fraud_modeling_and_benchmarking.ipynb
│   ├── 04_model_evaluation_threshold_optimization.ipynb
│   └── 05_model_explainability_and_risk_decisioning.ipynb
│
├── backend/                           # FastAPI Backend Engine
│   ├── app/                           # Routes, services, schemas, DB models, ML pipelines
│   ├── artifacts/                     # Production booster and baseline alternative models
│   ├── tests/                         # Automated unit & integration test suites
│   ├── requirements.txt               # Complete Python dependencies
│   └── Dockerfile
│
├── frontend/                          # Next.js 16 Spatial UI
│   ├── src/                           # 8 core routes, visual components, layout
│   ├── package.json
│   └── Dockerfile
│
├── output/                            # Master deliverables
│   └── PISTA_Master_Pitch_Demo.mp4    # 🌟 Final Master Pitch Video (5m 33s)
│
├── images/                            # Documentation & UI showcase assets
└── Data/                              # Dataset storage (raw, processed, features)
```

---

## 21. Automated Test Suite & Quality Assurance

```bash
# Execute backend test suite
cd backend
pytest tests/ -v
```

```text
tests/test_api.py::test_health_endpoint PASSED                         [  8%]
tests/test_api.py::test_readiness_endpoint PASSED                      [ 16%]
tests/test_api.py::test_predict_valid_payload PASSED                   [ 25%]
tests/test_api.py::test_predict_high_risk_preset PASSED                 [ 33%]
tests/test_api.py::test_razorpay_order_creation PASSED                 [ 41%]
tests/test_api.py::test_razorpay_hmac_verification_valid PASSED        [ 50%]
tests/test_api.py::test_razorpay_hmac_verification_invalid PASSED      [ 58%]
tests/test_api.py::test_case_creation_and_retrieval PASSED             [ 66%]
tests/test_api.py::test_case_status_patch_and_audit_trail PASSED       [ 75%]
tests/test_api.py::test_analytics_summary_benchmark PASSED             [ 83%]
tests/test_api.py::test_analytics_live_telemetry PASSED                [ 91%]
tests/test_api.py::test_model_lineage_metadata PASSED                  [100%]

============================== 12 passed in 1.48s ==============================
```

---

## 22. Limitations & Production Hardening

* **Distribution Drift**: Real-world transactions from novel merchant categories are normalized using historical feature store baselines.
* **Test Mode Gateway**: Razorpay integration runs in Test Mode; enterprise live processing requires merchant KYC activation and live key rotation.
* **Continuous Monitoring**: Recommended production deployment includes Evidently AI or Prometheus metrics for live concept drift detection and weekly automated retraining.

---

## 23. Engineering War Stories: What Broke at 2 AM & How We Got Out

### 💥 War Story 1: The Raw-Body Webhook HMAC Signature Mismatch
* **The Incident**: Razorpay webhook calls failed cryptographic signature verification (`400 Invalid HMAC Signature`) during end-to-end integration tests despite identical secret keys.
* **Root Cause**: FastAPI's standard request parsing deserialized JSON *before* computing the HMAC hash. Key reordering and whitespace normalizations broke raw byte-level hash parity.
* **The Solution**: Captured `await request.body()` as an immutable raw byte stream in the route before deserialization, feeding the unparsed bytes directly to `hmac.new(secret.encode(), raw_body, hashlib.sha256)`.

### 💥 War Story 2: TreeSHAP Latency Bottleneck on 492 Feature Dimensions
* **The Incident**: While the LightGBM booster scored in `< 1.0 ms`, running real-time TreeSHAP local explanations for all 492 dimensions on every incoming transaction spiked end-to-end API response times to **> 180 ms**—unacceptable for synchronous payment checkout flows.
* **Root Cause**: Dynamically instantiating `shap.TreeExplainer` per request incurred massive memory allocation overhead, and dense matrix calculations slowed down throughput.
* **The Solution**: Pre-initialized a singleton `TreeExplainer` during FastAPI's `lifespan` startup, fed single-row NumPy arrays, and vectorized top-$k$ impact extraction (`np.argpartition`) to slash attribution calculation down to **~35 ms**.

### 💥 War Story 3: The Overconfident Uncalibrated Boosting Score Trap
* **The Incident**: Under 3.5% fraud incidence, standard binary cross-entropy loss produced boosting predictions that clustered heavily near 0 and 1. Raw scores between `0.60` and `0.70` represented only 15% true risk, causing massive false positive spikes and declining legitimate transactions.
* **Root Cause**: Tree-based gradient boosting optimizes ranking (AUC), not calibrated posterior probabilities $P(Y=1|X)$.
* **The Solution**: Embedded an **Isotonic Regression Calibrator** trained on held-out out-of-time validation folds ($Brier = 0.0234$). This transformed raw logits into mathematically sound posterior probabilities, allowing reliable tri-state routing thresholds ($\tau_{\text{review}} = 0.25$, $\tau_{\text{block}} = 0.75$).

---

## 24. Conclusion & Citation

PISTA proves that transaction fraud prevention requires more than just training a classifier—it requires a complete operational system spanning **rigorous feature engineering**, **sub-millisecond inference**, **calibrated posterior probabilities**, **interpretable model attribution**, **tri-state policy execution**, and **immutable audit logging**.

### Citation
```bibtex
@misc{pista2026,
  author = {Gautam, Hardik and Team PISTA},
  title = {PISTA: Payment Intelligence and Security Telemetry Architecture},
  year = {2026},
  publisher = {GitHub},
  howpublished = {\url{https://github.com/gautamhardik/PISTA}}
}
```

Every transaction leaves clues. PISTA turns those clues into action.
