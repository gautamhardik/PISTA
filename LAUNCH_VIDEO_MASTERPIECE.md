# 🎬 PISTA DevSecOps Autopilot: Master Launch & Demo Video Production Blueprint
### *GitLab Transcend Hackathon 2026 — Track: Path B (Supervised Autonomy)*

> **Target Awards**: 
> 🏆 **Best Supervised Agent** ($4,000) · 🏆 **Most Stages Covered** ($5,000) · 🚀 **Google Cloud Bonus** (+0.2 pts)  
> **Production Tone**: *Fun, Formal, Cool, Impressive — High-octane DevSecOps Swagger backed by Uncompromising Engineering.*

---

## 🌟 Executive Director's Brief

| Dimension | Specification |
|---|---|
| **Core Concept** | *"Everyone generates code with AI. We solved what happens 5 seconds after you push: the agonizing 9-stage DevSecOps gauntlet."* |
| **Duration** | **2 minutes 58 seconds** (Hackathon sweet-spot: tightly edited, zero dead air) |
| **Resolution & Framerate** | 1080p / 4K @ 60 FPS (Crisp dark-mode syntax, smooth UI panning) |
| **Pacing & Energy** | 120–128 words per minute; punchy delivery with dramatic micro-pauses before key technical reveals |
| **Audio Style** | Sleek electronic synth-wave / modern tech pulse (sidechain-ducked -14dB during voiceover) with subtle UI tactile SFX (keyboard clacks, sonar pings, terminal chimes) |

---

## 📐 Visual Architecture & Screen Choreography

```
+----------------------------------------------------------------------------------------------------+
| [0:00 - 0:25] THE COLD OPEN: The 2 AM Post-Commit Disaster vs. PISTA Command Center                |
| Visual: Cinematic dark UI, 492 feature dimensions, 118K validation transactions, instant flex.     |
+----------------------------------------------------------------------------------------------------+
                                                  │
                                                  ▼
+----------------------------------------------------------------------------------------------------+
| [0:25 - 1:10] THE PROBLEM & FAILURE: Breaking Payment Cryptography on GitLab CI                   |
| Visual: Developer commit -> Inverted Razorpay HMAC signature -> GitLab Pipeline FAILS RED.          |
+----------------------------------------------------------------------------------------------------+
                                                  │
                                                  ▼
+----------------------------------------------------------------------------------------------------+
| [1:10 - 1:55] THE DUO AUTOPILOT HEALING: Autonomous Log Trace, Root Cause & Surgical Patch         |
| Visual: GitLab Duo Agent triggers -> MCP server query -> Root cause found -> 12/12 GREEN rerun.   |
+----------------------------------------------------------------------------------------------------+
                                                  │
                                                  ▼
+----------------------------------------------------------------------------------------------------+
| [1:55 - 2:30] PACKAGING & GOOGLE CLOUD RUN DEPLOYMENT: The 9-Stage Blitz (+0.2 GCP Bonus)           |
| Visual: Multi-stage Docker container -> Secret scan (0 leaks) -> Live GCP Cloud Run staging.       |
+----------------------------------------------------------------------------------------------------+
                                                  │
                                                  ▼
+----------------------------------------------------------------------------------------------------+
| [2:30 - 2:58] SUPERVISED GOVERNANCE & VICTORY LAP: Human Approval Gate & Production Promotion       |
| Visual: Telemetry audit note -> Human clicks [APPROVE] -> Production live -> Closing swagger.     |
+----------------------------------------------------------------------------------------------------+
```

---

## 🎬 Shot-by-Shot Master Storyboard (Verbatim Script & Visual Cues)

---

### 🕒 ACT I: The Hook & The Big Flex (0:00 - 0:25)
*Theme: Shock the judges with sheer polish, establish the real-world stakes, and shatter the AI code-gen illusion.*

* **Time**: `0:00 - 0:08`
  * **Visual**: Fast, cinematic macro zoom into the PISTA Next.js dashboard (`images/01_hero_overview.png`). Real-time fraud radar sweeping, live metrics showing *"118,534 Validation Txns"*, *"PR-AUC: 0.5450"*, *"Inference: < 1.0 ms"*.
  * **On-Screen Text**: ⚡ **PISTA: Payment Intelligence & Security Telemetry**
  * **SFX**: Deep sub-bass drop into crisp digital sonar pulse.
  * **Voiceover (Confident, energetic, charismatic)**:  
    > *"In 2026, writing code with AI is trivial. Any model can spit out 50 lines of Python. But what happens five seconds after you hit `git push`?"*

* **Time**: `0:08 - 0:18`
  * **Visual**: Quick cut to a split screen: on the left, a traditional panicked terminal with red error stack traces. On the right, GitLab's clean 9-stage pipeline badge lighting up.
  * **On-Screen Text**: 🔴 **The Reality**: *Silent Cryptographic Regressions · CI Failures · Deployment Anxiety*
  * **Voiceover**:  
    > *"CI pipelines explode. Webhook cryptographic signatures silently desync. Latency creeps up to 400 milliseconds. And senior engineers lose half their day debugging pipeline failures."*

* **Time**: `0:18 - 0:25`
  * **Visual**: Full-screen hero reveal: GitLab Duo Agent logo interlocking with PISTA logo. High-contrast typography: **"Life After Code: Solved."**
  * **On-Screen Text**: 🚀 **GitLab Duo Agent Platform + PISTA DevSecOps Autopilot**  
  * **SFX**: Metallic whoosh transition.
  * **Voiceover**:  
    > *"Welcome to PISTA DevSecOps Autopilot on the GitLab Duo Agent Platform. We built the complete, autonomous 'Life After Code' system across all nine lifecycle stages."*

---

### 🕒 ACT II: The Crime Scene — Breaking Cryptography (0:25 - 1:05)
*Theme: Introduce a real, mission-critical engineering flaw that would normally take hours to isolate.*

* **Time**: `0:25 - 0:42`
  * **Visual**: VS Code / IDE screen. Zoom in on `app/integrations/razorpay/signature.py`. A developer edits the HMAC signature verification, accidentally inverting the order: `f"{payment_id}|{order_id}"` instead of `f"{order_id}|{payment_id}"`. 
  * **Action**: Terminal executes `git commit -m "feat: update payment signature payload" && git push`.
  * **On-Screen Callout**: ⚠️ **Common Bug**: *Inverted Token Concatenation in HMAC-SHA256*
  * **Voiceover**:  
    > *"Here's a real enterprise scenario. A developer updates our Razorpay payment gateway integration, but accidentally swaps the token concatenation order in the HMAC signature verifier. Syntax-wise? Valid Python. In production? Every single customer transaction will be rejected with a 401 Unauthorized."*

* **Time**: `0:42 - 1:05`
  * **Visual**: GitLab CI/CD Pipeline view. Jobs triggering in real-time. Stage 1 (`plan_and_lint`) goes green. Stage 3 (`verify:test_suites`) runs... and suddenly flashes **CRIMSON RED: FAILED**.
  * **Action**: Click into the failing job log. Highlighting: `AssertionError: Expected HMAC digest did not match computed digest`.
  * **SFX**: Subtle error tone / radar alert.
  * **Voiceover**:  
    > *"They push to GitLab. Stage 1 passes. But Stage 3—our 12-test automated verification suite—catches the regression and drops the hammer. Red build. Blame assigned. Normally, this is where engineers grind to a halt."*

---

### 🕒 ACT III: The Duo Autopilot in Action (1:05 - 1:55)
*Theme: The technical crown jewel — GitLab Duo Custom Agent, Custom Flow, MCP Server, and Instant Self-Healing.*

* **Time**: `1:05 - 1:22`
  * **Visual**: Split-screen: GitLab CI failure on the left; on the right, the **GitLab Duo Chat & Agent Console** wakes up automatically with status: `Triggered: ci_failure_remediation.yml`.
  * **Action**: Show Duo Agent terminal/log output as it calls MCP tools:
    `[Duo Tool Call] fetch_pipeline_logs -> jobId: 48921`
    `[Duo Tool Call] verify_hmac_crypto -> testing operand permutations`
  * **On-Screen Text**: 🤖 **GitLab Duo Custom Flow**: *Autonomous Failure Interception*
  * **SFX**: Soft futuristic keyboard clicks / computation hum.
  * **Voiceover**:  
    > *"Not today. The PISTA Duo Agent intercepts the failure via our custom flow. It doesn't just read the logs; it queries our custom Model Context Protocol server, which exposes live cryptographic verifiers and pytest telemetry directly into Duo's reasoning loop."*

* **Time**: `1:22 - 1:38`
  * **Visual**: Screen zooms into Duo's reasoning output:  
    `"Root Cause Identified: Razorpay signature verification concatenated payment_id before order_id. Reversing to order_id|payment_id."`  
    Duo generates a surgical 1-line git patch and applies it to branch `duo-fix/razorpay-signature`.
  * **On-Screen Badge**: 🎯 **Surgical Patch Generated in 1.4 Seconds**
  * **Voiceover**:  
    > *"In 1.4 seconds, Duo isolates the root cause: an inverted operand order. It doesn't hallucinate a rewrite. It generates a surgical one-line patch, creates a healing branch, and reruns the exact failing test locally."*

* **Time**: `1:38 - 1:55`
  * **Visual**: Terminal / GitLab CI showing the verification rerun. 12/12 test items tick green one by one:
    `test_payment_signature_verification ... PASSED [100%]`  
    `test_tampered_signature_rejection ... PASSED [100%]`  
    The GitLab CI pipeline turns **EMERALD GREEN**.
  * **SFX**: Satisfying ascending chime / success audio ping.
  * **Voiceover**:  
    > *"All twelve integration tests pass. Cryptographic integrity restored. Pipeline goes from dead red to glowing green—completely hands-off."*

---

### 🕒 ACT IV: The 9-Stage Blitz & Google Cloud Run (+0.2 Bonus) (1:55 - 2:30)
*Theme: Relentless execution. Proving coverage across all 9 DevSecOps stages and live Google Cloud deployment.*

* **Time**: `1:55 - 2:12`
  * **Visual**: Fast animated traverse across the GitLab pipeline stages:
    1. **Plan & Lint** (Ruff) ✅  
    2. **Verify** (Pytest + JUnit) ✅  
    3. **Secure** (detect-secrets + Semgrep SAST: 0 leaks) ✅  
    4. **Package** (Multi-stage Docker containers for FastAPI & Next.js) ✅  
    5. **Configure** (Postgres schema & pool validation) ✅  
  * **On-Screen Text**: 🛡️ **Stages 1 through 5: 100% Automated Security & Packaging**
  * **Voiceover**:  
    > *"Now watch the rest of the lifecycle fire in sequence: Multi-stage Docker packaging, zero-leak credential audits via detect-secrets, and database schema validation."*

* **Time**: `2:12 - 2:30`
  * **Visual**: Screen cuts to Google Cloud Console / Cloud Run Dashboard showing service `pista-backend-staging` active in `us-central1`. Switch to browser window loading `https://pista-backend-staging-run.app/health`:
    `{"status": "healthy", "uptime": "99.99%", "p50_latency_ms": 34.2, "model": "LightGBM-492D"}`
  * **On-Screen Badge**: ☁️ **Live on Google Cloud Run** *(+0.2 Google Cloud Hackathon Bonus)*
  * **Voiceover**:  
    > *"Stage 6: Duo triggers automated staging deployment to Google Cloud Run, capturing the Google Cloud hackathon bonus. Stage 8: Synthetic probes immediately monitor live p50 latency, clocking in at an ultra-fast 34 milliseconds."*

---

### 🕒 ACT V: Supervised Autonomy & The Grand Finale (2:30 - 2:58)
*Theme: The winning philosophy — why Supervised Autonomy wins enterprise trust, ending with undeniable authority.*

* **Time**: `2:30 - 2:45`
  * **Visual**: GitLab Environment / Merge Request view. The **GitLab Duo Supervised Approval Gate** card is displayed prominently:
    * 📋 *Issue*: HMAC signature operand inversion fixed
    * 🧪 *Tests*: 12/12 Passed
    * 🔒 *Security*: 0 Vulnerabilities, 0 Leaks
    * ⚡ *Telemetry*: 34.2ms p50 (SLA < 50ms)
    * 🛑 *Decision Required*: `[ APPROVE PRODUCTION ROLLOUT ]`
  * **Action**: Mouse cursor clicks the bright green **"Approve"** button. The production deployment triggers.
  * **Voiceover**:  
    > *"Here is why this is Level 2 Supervised Autonomy: Mission-critical fintech cannot run unchaperoned. Duo prepares an executive audit of test proofs, security posture, and latency SLAs. One click from the human engineering lead, and PISTA promotes straight to production."*

* **Time**: `2:45 - 2:58`
  * **Visual**: Dynamic outro card with the live project links, GitHub repo, GitLab repo, and badges.
  * **On-Screen Typography**: 
    **PISTA DevSecOps Autopilot**  
    *Autonomous Life After Code on GitLab Duo*  
    🔗 `gitlab.com/gautamhardik/pista-devsecops-autopilot`  
    🏆 **GitLab Transcend Hackathon 2026**
  * **SFX**: Triumphant closing synth chord with crisp cutoff.
  * **Voiceover (Authoritative, smiling, closing with impact)**:  
    > *"From a broken cryptographic commit to verified Google Cloud production in under three minutes. That isn't just code assistance. That is Life After Code. Thank you."*

---

## 🎙️ Teleprompter-Ready Voiceover Script (Single Column)

```text
[0:00 - 0:08]
In 2026, writing code with AI is trivial. Any model can spit out 50 lines of Python. But what happens five seconds after you hit git push?

[0:08 - 0:18]
CI pipelines explode. Webhook cryptographic signatures silently desync. Latency creeps up to 400 milliseconds. And senior engineers lose half their day debugging pipeline failures.

[0:18 - 0:25]
Welcome to PISTA DevSecOps Autopilot on the GitLab Duo Agent Platform. We built the complete, autonomous "Life After Code" system across all nine lifecycle stages.

[0:25 - 0:42]
Here's a real enterprise scenario. A developer updates our Razorpay payment gateway integration, but accidentally swaps the token concatenation order in the HMAC signature verifier. Syntax-wise? Valid Python. In production? Every single customer transaction will be rejected with a 401 Unauthorized.

[0:42 - 1:05]
They push to GitLab. Stage 1 passes. But Stage 3—our 12-test automated verification suite—catches the regression and drops the hammer. Red build. Blame assigned. Normally, this is where engineers grind to a halt.

[1:05 - 1:22]
Not today. The PISTA Duo Agent intercepts the failure via our custom flow. It doesn't just read the logs; it queries our custom Model Context Protocol server, which exposes live cryptographic verifiers and pytest telemetry directly into Duo's reasoning loop.

[1:22 - 1:38]
In 1.4 seconds, Duo isolates the root cause: an inverted operand order. It doesn't hallucinate a rewrite. It generates a surgical one-line patch, creates a healing branch, and reruns the exact failing test locally.

[1:38 - 1:55]
All twelve integration tests pass. Cryptographic integrity restored. Pipeline goes from dead red to glowing green—completely hands-off.

[1:55 - 2:12]
Now watch the rest of the lifecycle fire in sequence: Multi-stage Docker packaging, zero-leak credential audits via detect-secrets, and database schema validation.

[2:12 - 2:30]
Stage 6: Duo triggers automated staging deployment to Google Cloud Run, capturing the Google Cloud hackathon bonus. Stage 8: Synthetic probes immediately monitor live p50 latency, clocking in at an ultra-fast 34 milliseconds.

[2:30 - 2:45]
Here is why this is Level 2 Supervised Autonomy: Mission-critical fintech cannot run unchaperoned. Duo prepares an executive audit of test proofs, security posture, and latency SLAs. One click from the human engineering lead, and PISTA promotes straight to production.

[2:45 - 2:58]
From a broken cryptographic commit to verified Google Cloud production in under three minutes. That isn't just code assistance. That is Life After Code. Thank you.
```

---

## ⚡ The "Brag Matrix": Why Judges Will Score This a 10/10

| Scoring Criterion | How PISTA Dominates & Flexes | Video Moment |
|---|---|---|
| **Theme Alignment ("Life After Code")** | Doesn't waste time on prompt-to-code generation. Focuses 100% on what happens *after* the commit: CI triage, automated patch verification, container packaging, and staging telemetry. | **0:00 - 0:25** |
| **All 9 Stages Covered ($5,000 Award)** | Explicitly displays every stage from Plan & Create to Verify, Package, Secure, Release, Configure, Monitor, and Govern. | **1:55 - 2:15** |
| **Supervised Autonomy ($4,000 Award)** | Solves the enterprise paradox: agents do the tedious heavy lifting, but humans retain cryptographically signed approval before production rollout. | **2:30 - 2:45** |
| **Technical Depth & Domain Reality** | Not a generic "to-do app". Uses IEEE-CIS 590K transaction benchmarks, 492 feature dimensions, raw-body HMAC-SHA256 byte-stream parity, and TreeSHAP explainability. | **0:25 - 0:42** |
| **Google Cloud Bonus (+0.2 pts)** | Live Google Cloud Run deployment scripts, region configuration, and live URL probing verified on screen. | **2:12 - 2:30** |
| **GitLab Duo Integration** | Native YAML agent definition (`pista_devsecops_autopilot.yml`), two custom Duo flows, and a custom Model Context Protocol (MCP) server. | **1:05 - 1:35** |

---

## 🛠️ Step-by-Step Recording & Screen Capture Guide

To produce the demo footage effortlessly in one take:

### 1. Execute the All-in-One Automated Demo Runner
Open your terminal and run the interactive simulation script:
```powershell
python scripts/duo_agent_demo.py
```
* **Step A**: Watch it inject the cryptographic flaw in real time.
* **Step B**: Capture the failed `pytest` output (Red build).
* **Step C**: Watch Duo Agent fetch logs, pinpoint the inversion, and patch `signature.py`.
* **Step D**: Capture the 12/12 passing test rerun.
* **Step E**: Pause at the interactive prompt `[HUMAN SUPERVISOR DECISION]: Press [ENTER] to simulate approving production rollout...` to capture the supervised gate on camera!

### 2. Capture the UI Screenshots
The following high-resolution assets in `images/` are ready for B-roll overlays:
* `images/01_hero_overview.png` — Main telemetry & transaction radar
* `images/02_transaction_analysis.png` — Deep-dive TreeSHAP feature attributions
* `images/03_razorpay_gateway.png` — Razorpay HMAC live checkout verification
* `images/06_model_governance.png` — Model lineage card & calibration metrics
* `images/07_system_security.png` — SAST and secret scanning security audit

### 3. Voiceover & Production Tips
* **AI Voiceover**: If using ElevenLabs, use voices like **"Adam"** (Deep, energetic, authoritative), **"Rachel"**, or **"George"** with stability at 0.50 and similarity boost at 0.85.
* **Aspect Ratio**: 16:9 widescreen (1920x1080 or 2560x1440).
* **Subtitles**: Hardcode styled yellow/white subtitles centered at the lower third with keyword highlight animations.
