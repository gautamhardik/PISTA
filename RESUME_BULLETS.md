# 📄 PISTA — Resume Bullet Points & Project Descriptions
**Author:** Gautam Hardik  
**GitHub Repository:** [https://github.com/gautamhardik/PISTA](https://github.com/gautamhardik/PISTA)

---

## 🎯 Option 1: Applied Machine Learning / AI Engineer Focus

**PISTA — Payment Intelligence & Security Telemetry Architecture** | *Python, LightGBM, TreeSHAP, Scikit-Learn, FastAPI, PostgreSQL, Next.js*
* Engineered an end-to-end, sub-millisecond fraud risk decisioning engine evaluating **492 causal feature dimensions** across 590,540 real-world e-commerce transactions (IEEE-CIS benchmark).
* Optimized production **LightGBM risk booster** for **PR-AUC (0.5450)** under extreme 3.5% class imbalance, outperforming standard XGBoost, CatBoost, and 3-model stacked ensembles with **< 1.0 ms** inference SLA.
* Implemented **Isotonic Probability Calibration**, driving **Brier Score down to 0.0234** to guarantee true mathematical posterior probabilities $P(\text{Fraud}|X)$ for operational risk routing ($\tau_1 = 0.25, \tau_2 = 0.75$).
* Deployed real-time **local TreeSHAP attribution** (~32ms) to extract top risk amplifiers and trust mitigators, populating automated dispute defense dossiers with cryptographic audit trails.

---

## 🎯 Option 2: Full-Stack & Backend / Systems Engineering Focus

**PISTA — Real-Time Payment Risk & Fraud Intelligence Platform** | *FastAPI, Python 3.13, PostgreSQL 16, SQLAlchemy, Next.js 16, Docker*
* Built an asynchronous, high-throughput payment risk API in **FastAPI** with dual-path execution (synchronous `<5ms` gateway decision + non-blocking background persistence).
* Designed an in-memory sliding-window **velocity cache** tracking 10-minute entity bursts and 1-hour spending sums across composite cardholder keys (`card1` + `addr1`).
* Integrated authentic **Razorpay Checkout Gateway** (Standard Test Mode) with server-side raw-byte **HMAC-SHA256 signature verification** and idempotent PostgreSQL webhook storage.
* Developed an enterprise spatial investigation studio in **Next.js 16 (React 19, Tailwind CSS 4)** with live 4-layer latency gauges, immutable case audit logs, and continuous Population Stability Index (PSI) drift monitoring.

---

## 🎯 Option 3: Concise 3-Bullet Summary (Standard Resume Space)

* **Real-Time Payment Risk Engine**: Architected a sub-millisecond fraud decisioning platform processing 492 engineered feature dimensions over 590K transactions with a **0.84ms LightGBM booster inference SLA**.
* **Statistical Calibration & Explainability**: Applied Isotonic Calibration (**Brier Score: 0.0234**) and embedded native C++ TreeSHAP attribution to provide transparent risk factors for payment investigators.
* **Full-Stack & Gateway Verification**: Implemented FastAPI backend, PostgreSQL 16 relational audit trails, Razorpay HMAC-SHA256 verification, and Next.js 16 UI with automated 1-click Docker orchestration.

---

## 📊 Key Quantified Metrics for Interview Prep
* **Dataset Scale**: 590,540 real-world transactions | 118,534 held-out out-of-time validation transactions.
* **Feature Space**: 492 engineered dimensions spanning 10 causal families.
* **Primary Metric**: **PR-AUC = 0.5450** | **ROC-AUC = 0.9130** | **Brier Score = 0.0234**.
* **Latency Profile**: Booster Inference **< 1.0 ms** | Fast-Path Decision **< 5 ms** | TreeSHAP Attribution **~32 ms**.
* **Operational Routing Policy**: Tri-State Decision ($\tau_{\text{review}} = 0.25$, $\tau_{\text{block}} = 0.75$).
