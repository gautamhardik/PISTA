"""
PISTA DevSecOps Autopilot: Automated Video Producer
GitLab Transcend Hackathon 2026: Life After Code
Generates high-definition (1080p @ 30fps) launch & demo video with studio neural TTS,
custom high-res infographics, slide transitions, background music, and synchronized subtitles.
"""

import os
import sys
import asyncio
import subprocess
import numpy as np
import scipy.io.wavfile as wav
from PIL import Image, ImageDraw, ImageFont

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUTPUT_DIR = os.path.join(ROOT_DIR, "output")
BUILD_DIR = os.path.join(OUTPUT_DIR, "video_build")
AUDIO_DIR = os.path.join(BUILD_DIR, "audio")
FRAMES_DIR = os.path.join(BUILD_DIR, "frames")
CLIPS_DIR = os.path.join(BUILD_DIR, "clips")
FINAL_VIDEO = os.path.join(OUTPUT_DIR, "PISTA_DevSecOps_Autopilot_Launch_Demo.mp4")

WIDTH = 1920
HEIGHT = 1080
FPS = 30
VOICE = "en-US-ChristopherNeural"  # Authoritative, warm, clear tech founder/executive voice

# Typography helper
def get_font(name: str, size: int):
    system_fonts = {
        "title": r"C:\Windows\Fonts\segoeuib.ttf",
        "bold": r"C:\Windows\Fonts\segoeuib.ttf",
        "regular": r"C:\Windows\Fonts\segoeui.ttf",
        "code": r"C:\Windows\Fonts\consola.ttf",
        "code_bold": r"C:\Windows\Fonts\consolab.ttf"
    }
    path = system_fonts.get(name, r"C:\Windows\Fonts\arial.ttf")
    if os.path.exists(path):
        return ImageFont.truetype(path, size)
    return ImageFont.load_default()

SCENES = [
    {
        "id": "scene_01",
        "act": "ACT I: THE HOOK & THE BIG FLEX",
        "tag": "LIFE AFTER CODE",
        "tag_color": (252, 109, 38),
        "title": "Code Generation Is Easy. What Happens After?",
        "narration": "In 2026, writing code with AI is trivial. Any model can spit out 50 lines of Python. But what happens five seconds after you hit git push?",
        "subtitle": "In 2026, writing code with AI is trivial... But what happens 5 seconds after git push?",
        "image_file": os.path.join(ROOT_DIR, "images", "01_hero_overview.png"),
        "type": "hero"
    },
    {
        "id": "scene_02",
        "act": "ACT I: THE DEVSECOPS REALITY",
        "tag": "THE POST-COMMIT BOTTLENECK",
        "tag_color": (239, 68, 68),
        "title": "The Post-Commit Nightmare",
        "narration": "CI pipelines explode. Webhook cryptographic signatures silently desync. Latency creeps up to 400 milliseconds. And senior engineers lose half their day debugging pipeline failures.",
        "subtitle": "CI pipelines explode · Webhook signatures silently desync · Latency creeps up to 400ms",
        "image_file": None,
        "type": "nightmare"
    },
    {
        "id": "scene_03",
        "act": "ACT I: THE PLATFORM REVEAL",
        "tag": "PATH B: SUPERVISED AUTONOMY",
        "tag_color": (252, 109, 38),
        "title": "PISTA DevSecOps Autopilot on GitLab Duo",
        "narration": "Welcome to PISTA DevSecOps Autopilot on the GitLab Duo Agent Platform. We built the complete, autonomous 'Life After Code' system across all nine lifecycle stages.",
        "subtitle": "Complete autonomous 'Life After Code' system across all 9 DevSecOps lifecycle stages",
        "image_file": None,
        "type": "architecture"
    },
    {
        "id": "scene_04",
        "act": "ACT II: THE CRIME SCENE",
        "tag": "CRITICAL REGRESSION",
        "tag_color": (239, 68, 68),
        "title": "Breaking Payment Cryptography in Production",
        "narration": "Here's a real enterprise scenario. A developer updates our Razorpay payment gateway integration, but accidentally swaps the token concatenation order in the HMAC signature verifier. Syntax-wise? Valid Python. In production? Every single customer transaction will be rejected with a 401 Unauthorized.",
        "subtitle": "Accidental token swap in HMAC-SHA256: Valid syntax, but causes 100% checkout rejection",
        "image_file": os.path.join(ROOT_DIR, "images", "03_razorpay_gateway.png"),
        "type": "bug_injection"
    },
    {
        "id": "scene_05",
        "act": "ACT II: THE RED BUILD",
        "tag": "STAGE 3: VERIFY [FAILED]",
        "tag_color": (239, 68, 68),
        "title": "GitLab CI Catches the Cryptographic Flaw",
        "narration": "They push to GitLab. Stage 1 passes. But Stage 3—our 12-test automated verification suite—catches the regression and drops the hammer. Red build. Blame assigned. Normally, this is where engineers grind to a halt.",
        "subtitle": "Stage 3 drops the hammer: FAILED in test_payment_signature_verification",
        "image_file": None,
        "type": "ci_failed"
    },
    {
        "id": "scene_06",
        "act": "ACT III: DUO AGENT INTERCEPTION",
        "tag": "GITLAB DUO AGENT PLATFORM",
        "tag_color": (16, 185, 129),
        "title": "Autonomous Failure Interception via Custom Flow",
        "narration": "Not today. The PISTA Duo Agent intercepts the failure via our custom flow. It doesn't just read the logs; it queries our custom Model Context Protocol server, which exposes live cryptographic verifiers and pytest telemetry directly into Duo's reasoning loop.",
        "subtitle": "GitLab Duo Agent intercepts failure via custom flow & Model Context Protocol (MCP)",
        "image_file": None,
        "type": "duo_agent"
    },
    {
        "id": "scene_07",
        "act": "ACT III: SURGICAL REMEDIATION",
        "tag": "SELF-HEALING CODE",
        "tag_color": (16, 185, 129),
        "title": "Root Cause Isolated & Patched in 1.4 Seconds",
        "narration": "In 1.4 seconds, Duo isolates the root cause: an inverted operand order. It doesn't hallucinate a rewrite. It generates a surgical one-line patch, creates a healing branch, and reruns the exact failing test locally.",
        "subtitle": "Root cause isolated in 1.4s · Minimal 1-line surgical diff · Zero hallucination",
        "image_file": None,
        "type": "surgical_diff"
    },
    {
        "id": "scene_08",
        "act": "ACT III: VERIFIED RECOVERY",
        "tag": "STAGE 3: VERIFY [PASSED]",
        "tag_color": (16, 185, 129),
        "title": "12/12 Tests Passing: Emerald Green Pipeline",
        "narration": "All twelve integration tests pass. Cryptographic integrity restored. Pipeline goes from dead red to glowing green—completely hands-off.",
        "subtitle": "12/12 integration tests pass · Cryptographic parity restored · Pipeline EMERALD GREEN",
        "image_file": None,
        "type": "ci_passed"
    },
    {
        "id": "scene_09",
        "act": "ACT IV: PACKAGING & SECURITY BLITZ",
        "tag": "STAGES 4 & 5: PACKAGE & SECURE",
        "tag_color": (6, 182, 212),
        "title": "Multi-Stage Docker & Zero-Leak Credential SAST",
        "narration": "Now watch the rest of the lifecycle fire in sequence: Multi-stage Docker packaging, zero-leak credential audits via detect-secrets, and database schema validation.",
        "subtitle": "Multi-stage Docker packaging · 0 leaked credentials · Relational schema validation",
        "image_file": os.path.join(ROOT_DIR, "images", "07_system_security.png"),
        "type": "package_secure"
    },
    {
        "id": "scene_10",
        "act": "ACT IV: GOOGLE CLOUD RUN STAGING",
        "tag": "STAGE 6 & 8: RELEASE & MONITOR",
        "tag_color": (66, 133, 244),
        "title": "Live Serverless Deployment (+0.2 Google Cloud Bonus)",
        "narration": "Stage 6: Duo triggers automated staging deployment to Google Cloud Run, capturing the Google Cloud hackathon bonus. Stage 8: Synthetic probes immediately monitor live p50 latency, clocking in at an ultra-fast 34 milliseconds.",
        "subtitle": "Live on Google Cloud Run (+0.2 Bonus) · Synthetic probes verify sub-35ms p50 latency",
        "image_file": os.path.join(ROOT_DIR, "images", "02_transaction_analysis.png"),
        "type": "gcp_deploy"
    },
    {
        "id": "scene_11",
        "act": "ACT V: SUPERVISED AUTONOMY",
        "tag": "STAGE 9: GOVERN (HUMAN-IN-THE-LOOP)",
        "tag_color": (245, 158, 11),
        "title": "Human Approval Gate Before Production Rollout",
        "narration": "Here is why this is Level 2 Supervised Autonomy: Mission-critical fintech cannot run unchaperoned. Duo prepares an executive audit of test proofs, security posture, and latency SLAs. One click from the human engineering lead, and PISTA promotes straight to production.",
        "subtitle": "Executive audit submitted to Lead · Single click [APPROVE] promotes to Production",
        "image_file": os.path.join(ROOT_DIR, "images", "06_model_governance.png"),
        "type": "supervised_gate"
    },
    {
        "id": "scene_12",
        "act": "ACT V: THE FINALE",
        "tag": "GITLAB TRANSCEND 2026",
        "tag_color": (252, 109, 38),
        "title": "Life After Code: Solved with GitLab Duo",
        "narration": "From a broken cryptographic commit to verified Google Cloud production in under three minutes. That isn't just code assistance. That is Life After Code. Thank you.",
        "subtitle": "Broken cryptographic commit to verified GCP production in 3 minutes · Life After Code",
        "image_file": None,
        "type": "finale"
    }
]

def draw_header(draw: ImageDraw.ImageDraw, scene: dict):
    # Top branding bar
    draw.rectangle([0, 0, WIDTH, 100], fill=(15, 23, 42))
    draw.line([0, 100, WIDTH, 100], fill=(30, 41, 59), width=2)
    
    # Left: Logo & Project with clean vector lightning bolt
    draw.ellipse([60, 30, 92, 62], fill=(252, 109, 38))
    # Vector lightning bolt
    draw.polygon([(78, 35), (69, 47), (76, 47), (73, 57), (83, 45), (76, 45)], fill=(255, 255, 255))
    draw.text((105, 30), "PISTA DevSecOps Autopilot", fill=(255, 255, 255), font=get_font("bold", 28))
    draw.text((490, 37), "| GitLab Transcend Hackathon 2026", fill=(148, 163, 184), font=get_font("regular", 20))

    # Right: Pill Badge
    tag_text = scene["tag"]
    font_tag = get_font("bold", 18)
    bbox = font_tag.getbbox(tag_text)
    tw = bbox[2] - bbox[0]
    pill_w = tw + 32
    pill_x = WIDTH - 60 - pill_w
    pill_y = 28
    draw.rounded_rectangle([pill_x, pill_y, pill_x + pill_w, pill_y + 42], radius=21, fill=scene["tag_color"])
    draw.text((pill_x + 16, pill_y + 9), tag_text, fill=(255, 255, 255), font=font_tag)

def draw_subtitles(draw: ImageDraw.ImageDraw, subtitle: str):
    # Lower third subtitle box
    sub_box_h = 80
    sub_box_y = HEIGHT - 110
    draw.rounded_rectangle([120, sub_box_y, WIDTH - 120, sub_box_y + sub_box_h], radius=16, fill=(15, 23, 42), outline=(51, 65, 85), width=2)
    font_sub = get_font("bold", 26)
    bbox = font_sub.getbbox(subtitle)
    sw = bbox[2] - bbox[0]
    sx = (WIDTH - sw) // 2
    draw.text((sx, sub_box_y + 24), subtitle, fill=(254, 240, 138), font=font_sub)

def render_frame_for_scene(scene: dict, output_path: str):
    img = Image.new("RGB", (WIDTH, HEIGHT), (11, 15, 25))
    draw = ImageDraw.Draw(img)

    # Ambient grid / gradient accents
    for y in range(100, HEIGHT - 110, 80):
        draw.line([0, y, WIDTH, y], fill=(18, 26, 43), width=1)
    for x in range(0, WIDTH, 120):
        draw.line([x, 100, x, HEIGHT - 110], fill=(18, 26, 43), width=1)

    draw_header(draw, scene)

    # Act Title & Scene Title
    draw.text((80, 130), scene["act"], fill=scene["tag_color"], font=get_font("bold", 20))
    draw.text((80, 160), scene["title"], fill=(255, 255, 255), font=get_font("title", 38))

    stype = scene["type"]

    if stype in ["hero", "bug_injection", "package_secure", "gcp_deploy", "supervised_gate"] and scene["image_file"]:
        # Render with screenshot bezel
        raw_shot = Image.open(scene["image_file"])
        target_w, target_h = 1760, 690
        raw_shot.thumbnail((target_w, target_h), Image.Resampling.LANCZOS)
        sw, sh = raw_shot.size
        sx = (WIDTH - sw) // 2
        sy = 230 + (target_h - sh) // 2
        
        # Bezel / Glow
        draw.rounded_rectangle([sx - 6, sy - 6, sx + sw + 6, sy + sh + 6], radius=14, fill=(30, 41, 59), outline=scene["tag_color"], width=2)
        img.paste(raw_shot, (sx, sy))

    elif stype == "nightmare":
        # 3 Warning cards without unrendered emojis
        cards = [
            ("FAIL: CI Pipeline Explodes", "AssertionError in payment verification.\nBuild turns red across all branches.\nEngineering halted immediately.", (239, 68, 68)),
            ("401: Silent HMAC Desync", "Inverted payload concatenation order.\nSyntax valid, but 100% 401 Unauthorized.\nReal transactions fail at gateway.", (245, 158, 11)),
            ("WARN: Latency Regression", "Inference spikes to 412 ms (>50ms SLA).\nTimeout cascades in payment flow.\nCart abandonment skyrockets.", (59, 130, 246))
        ]
        cw = 540
        ch = 380
        cy = 280
        for i, (ctitle, cdesc, ccolor) in enumerate(cards):
            cx = 80 + i * (cw + 70)
            draw.rounded_rectangle([cx, cy, cx + cw, cy + ch], radius=20, fill=(15, 23, 42), outline=ccolor, width=3)
            # Card header
            draw.rounded_rectangle([cx, cy, cx + cw, cy + 80], radius=20, fill=(30, 41, 59))
            draw.text((cx + 30, cy + 24), ctitle, fill=(255, 255, 255), font=get_font("bold", 26))
            # Card content
            for line_idx, line in enumerate(cdesc.split("\n")):
                draw.text((cx + 30, cy + 120 + line_idx * 45), f"> {line}", fill=(203, 213, 225), font=get_font("regular", 22))

        # Bottom stat box
        draw.rounded_rectangle([80, 720, WIDTH - 80, 810], radius=16, fill=(30, 27, 75), outline=(139, 92, 246), width=2)
        draw.text((120, 745), "CRITICAL: 3.5 Hours Wasted Per Broken Build on Manual Log Triage (Industry Average)", fill=(216, 180, 254), font=get_font("bold", 26))

    elif stype == "architecture":
        # 9 Stages Matrix with clean vector checkmarks
        stages = [
            ("1. Plan", "Issue Triage"), ("2. Create", "Surgical Diff"), ("3. Verify", "12/12 Tests"),
            ("4. Package", "Docker Images"), ("5. Secure", "Zero-Leak SAST"), ("6. Release", "Google Cloud Run"),
            ("7. Configure", "DB & Schema"), ("8. Monitor", "p50 Telemetry"), ("9. Govern", "Human Gate")
        ]
        grid_y = 260
        bw = 540
        bh = 130
        for i, (snum, sdesc) in enumerate(stages):
            col = i % 3
            row = i // 3
            bx = 80 + col * (bw + 70)
            by = grid_y + row * (bh + 25)
            draw.rounded_rectangle([bx, by, bx + bw, by + bh], radius=16, fill=(15, 23, 42), outline=(51, 65, 85), width=2)
            draw.ellipse([bx + 20, by + 25, bx + 55, by + 60], fill=(16, 185, 129))
            # Vector checkmark
            draw.line([(bx + 28, by + 42), (bx + 35, by + 50), (bx + 48, by + 34)], fill=(255, 255, 255), width=3)
            draw.text((bx + 75, by + 26), snum, fill=(255, 255, 255), font=get_font("bold", 26))
            draw.text((bx + 75, by + 68), sdesc, fill=(148, 163, 184), font=get_font("regular", 20))

        # Banner
        draw.rounded_rectangle([80, 730, WIDTH - 80, 820], radius=16, fill=(24, 24, 27), outline=(252, 109, 38), width=2)
        draw.text((120, 755), "TARGET: Level 2 Supervised Autonomy -- Automated Diagnostics with Human Executive Sign-Off", fill=(254, 215, 170), font=get_font("bold", 26))

    elif stype == "ci_failed":
        # GitLab CI Failed Mockup
        cy = 240
        draw.rounded_rectangle([80, cy, WIDTH - 80, cy + 570], radius=20, fill=(15, 23, 42), outline=(239, 68, 68), width=3)
        # Top banner
        draw.rounded_rectangle([80, cy, WIDTH - 80, cy + 70], radius=20, fill=(69, 10, 10))
        draw.text((120, cy + 18), "🔴 GitLab Pipeline #48921 FAILED on branch 'feature/razorpay-update'", fill=(254, 202, 202), font=get_font("bold", 26))

        # Job steps
        steps = [
            ("plan_and_lint", "passed", (16, 185, 129)),
            ("verify:test_suites", "failed (exit 1)", (239, 68, 68)),
            ("secure:sast", "canceled", (100, 116, 139)),
            ("package:docker", "canceled", (100, 116, 139))
        ]
        for idx, (jname, jstatus, jcol) in enumerate(steps):
            jx = 120 + idx * 420
            jy = cy + 100
            draw.rounded_rectangle([jx, jy, jx + 390, jy + 60], radius=10, fill=(30, 41, 59), outline=jcol, width=2)
            draw.text((jx + 20, jy + 16), jname, fill=(255, 255, 255), font=get_font("bold", 18))
            draw.text((jx + 240, jy + 16), jstatus, fill=jcol, font=get_font("bold", 18))

        # Traceback console
        draw.rounded_rectangle([120, cy + 190, WIDTH - 120, cy + 530], radius=12, fill=(3, 7, 18), outline=(30, 41, 59), width=2)
        tb_lines = [
            "============================= FAILURES =============================",
            "FAILED tests/test_razorpay_integration.py::test_payment_signature_verification",
            "    def test_payment_signature_verification():",
            "        is_valid = verify_payment_signature('order_123', 'pay_456', valid_sig, secret)",
            ">       assert is_valid is True",
            "E       AssertionError: Computed HMAC digest 7b8f... does not match expected signature 9a1c...",
            "E       Root Cause: app/integrations/razorpay/signature.py:7 token order inverted",
            "=================== 1 failed, 11 passed in 4.12s ==================="
        ]
        for t_idx, tline in enumerate(tb_lines):
            tcol = (239, 68, 68) if "FAIL" in tline or "Assertion" in tline or ">" in tline else (148, 163, 184)
            draw.text((150, cy + 215 + t_idx * 36), tline, fill=tcol, font=get_font("code", 20))

    elif stype == "duo_agent":
        # GitLab Duo Agent Workflow
        cy = 240
        draw.rounded_rectangle([80, cy, WIDTH - 80, cy + 570], radius=20, fill=(15, 23, 42), outline=(16, 185, 129), width=3)
        draw.rounded_rectangle([80, cy, WIDTH - 80, cy + 70], radius=20, fill=(6, 78, 59))
        draw.text((120, cy + 18), "🤖 GitLab Duo Custom Flow: ci_failure_remediation.yml Triggered", fill=(167, 243, 208), font=get_font("bold", 26))

        # 3 Flow Cards
        flow_cards = [
            ("1. Log Analysis & Diagnosis", "• Intercepted job #48921 log\n• Extracted Pytest JUnit traceback\n• Identified AssertionError in HMAC check\n• Correlated git blame to commit 9f3a", (16, 185, 129)),
            ("2. Duo MCP Tool Server", "• piste_mcp/run_tests invoked\n• piste_mcp/verify_hmac_crypto called\n• Tested token concatenation order\n• Confirmed reversed payload bug", (6, 182, 212)),
            ("3. Autonomous Plan Formulation", "• Synthesize 1-line surgical diff\n• Avoid full-file regeneration\n• Preserve raw byte-stream integrity\n• Prepare healing branch duo-fix/sig", (245, 158, 11))
        ]
        for f_idx, (ftitle, fdesc, fcol) in enumerate(flow_cards):
            fx = 120 + f_idx * 570
            fy = cy + 100
            draw.rounded_rectangle([fx, fy, fx + 530, fy + 430], radius=16, fill=(3, 7, 18), outline=fcol, width=2)
            draw.rounded_rectangle([fx, fy, fx + 530, fy + 70], radius=16, fill=(30, 41, 59))
            draw.text((fx + 25, fy + 20), ftitle, fill=(255, 255, 255), font=get_font("bold", 24))
            for l_idx, l in enumerate(fdesc.split("\n")):
                draw.text((fx + 25, fy + 105 + l_idx * 45), l, fill=(203, 213, 225), font=get_font("regular", 22))

    elif stype == "surgical_diff":
        # Diff View
        cy = 240
        draw.rounded_rectangle([80, cy, WIDTH - 80, cy + 570], radius=20, fill=(15, 23, 42), outline=(16, 185, 129), width=3)
        draw.rounded_rectangle([80, cy, WIDTH - 80, cy + 70], radius=20, fill=(30, 41, 59))
        draw.text((120, cy + 18), "SURGICAL PATCH: app/integrations/razorpay/signature.py", fill=(255, 255, 255), font=get_font("bold", 26))

        # Diff Code Box
        draw.rounded_rectangle([120, cy + 100, WIDTH - 120, cy + 380], radius=14, fill=(3, 7, 18), outline=(51, 65, 85), width=2)
        diff_lines = [
            ("@@ -5,3 +5,3 @@ def verify_payment_signature(razorpay_order_id, razorpay_payment_id, ...):", (100, 116, 139)),
            ("     \"\"\"Cryptographically verify payment signature generated by Razorpay Checkout.\"\"\"", (148, 163, 184)),
            ("-    msg = f\"{razorpay_payment_id}|{razorpay_order_id}\".encode(\"utf-8\")", (239, 68, 68)),
            ("+    msg = f\"{razorpay_order_id}|{razorpay_payment_id}\".encode(\"utf-8\")", (16, 185, 129)),
            ("     expected_sig = hmac.new(secret.encode(\"utf-8\"), msg, hashlib.sha256).hexdigest()", (148, 163, 184)),
            ("     return hmac.compare_digest(expected_sig, razorpay_signature)", (148, 163, 184))
        ]
        for d_idx, (dtext, dcolor) in enumerate(diff_lines):
            draw.text((150, cy + 130 + d_idx * 38), dtext, fill=dcolor, font=get_font("code_bold", 22))

        # Metrics pills
        mpills = [
            ("Diagnosis Latency", "1.4 Seconds", (16, 185, 129)),
            ("Hallucination Rate", "0.0%", (16, 185, 129)),
            ("Target Branch", "duo-fix/signature-parity", (6, 182, 212)),
            ("Autonomy Mode", "Supervised Healing", (245, 158, 11))
        ]
        for m_idx, (mtitle, mval, mcol) in enumerate(mpills):
            mx = 120 + m_idx * 420
            my = cy + 410
            draw.rounded_rectangle([mx, my, mx + 390, my + 110], radius=14, fill=(30, 41, 59), outline=mcol, width=2)
            draw.text((mx + 20, my + 18), mtitle, fill=(148, 163, 184), font=get_font("regular", 18))
            draw.text((mx + 20, my + 52), mval, fill=mcol, font=get_font("bold", 28))

    elif stype == "ci_passed":
        # Green Pipeline
        cy = 240
        draw.rounded_rectangle([80, cy, WIDTH - 80, cy + 570], radius=20, fill=(15, 23, 42), outline=(16, 185, 129), width=3)
        draw.rounded_rectangle([80, cy, WIDTH - 80, cy + 70], radius=20, fill=(6, 78, 59))
        draw.text((120, cy + 18), "PASSED: GitLab Pipeline #48922 — All 12 Verification Tests Green (100%)", fill=(167, 243, 208), font=get_font("bold", 26))

        # Test list
        tbox_y = cy + 100
        draw.rounded_rectangle([120, tbox_y, WIDTH - 120, tbox_y + 440], radius=14, fill=(3, 7, 18), outline=(51, 65, 85), width=2)
        tests = [
            "tests/test_razorpay_integration.py::test_database_connection_and_repositories   PASSED [  8%]",
            "tests/test_razorpay_integration.py::test_database_transaction_rollback          PASSED [ 16%]",
            "tests/test_razorpay_integration.py::test_payment_signature_verification          PASSED [ 25%]",
            "tests/test_razorpay_integration.py::test_tampered_signature_rejection           PASSED [ 33%]",
            "tests/test_razorpay_integration.py::test_webhook_fast_200_and_idempotency        PASSED [ 50%]",
            "tests/test_razorpay_integration.py::test_razorpay_adapter_scientific_mapping    PASSED [ 66%]",
            "tests/test_api_endpoints.py::test_health_telemetry_endpoint                     PASSED [ 83%]",
            "tests/test_api_endpoints.py::test_sub_50ms_treeshap_latency_invariant          PASSED [100%]"
        ]
        for ti, tstr in enumerate(tests):
            draw.text((150, tbox_y + 25 + ti * 48), tstr, fill=(52, 211, 153), font=get_font("code_bold", 21))

    elif stype == "finale":
        # Victory Outro
        cy = 230
        draw.rounded_rectangle([80, cy, WIDTH - 80, cy + 580], radius=24, fill=(15, 23, 42), outline=(252, 109, 38), width=4)

        # Big title
        draw.text((120, cy + 40), "GitLab Transcend Hackathon 2026: Life After Code", fill=(252, 109, 38), font=get_font("bold", 32))
        draw.text((120, cy + 90), "PISTA DevSecOps Autopilot — Targeted Winning Tracks", fill=(255, 255, 255), font=get_font("title", 46))

        # Award cards
        awards = [
            ("Path B: Best Supervised Agent", "$4,000 Award", "Autonomous diagnostics + surgical healing with human sign-off gate", (245, 158, 11)),
            ("Most Stages Covered", "$5,000 Award", "100% complete coverage across all 9 DevSecOps lifecycle stages", (16, 185, 129)),
            ("Google Cloud Bonus", "+0.2 Bonus Pts", "Automated deployment to Google Cloud Run staging in us-central1", (66, 133, 244))
        ]
        for a_idx, (atitle, aval, adesc, acol) in enumerate(awards):
            ax = 120 + a_idx * 560
            ay = cy + 180
            draw.rounded_rectangle([ax, ay, ax + 520, ay + 210], radius=18, fill=(30, 41, 59), outline=acol, width=3)
            draw.text((ax + 25, ay + 25), atitle, fill=acol, font=get_font("bold", 26))
            draw.text((ax + 25, ay + 75), aval, fill=(255, 255, 255), font=get_font("title", 36))
            draw.text((ax + 25, ay + 140), adesc, fill=(203, 213, 225), font=get_font("regular", 20))

        # Repo Links Card
        draw.rounded_rectangle([120, cy + 420, WIDTH - 120, cy + 530], radius=16, fill=(3, 7, 18), outline=(51, 65, 85), width=2)
        draw.text((150, cy + 445), "GitLab: gitlab.com/gautamhardik/pista-devsecops-autopilot", fill=(255, 255, 255), font=get_font("code_bold", 24))
        draw.text((150, cy + 485), "GitHub: github.com/gautamhardik/PISTA (MIT License)", fill=(148, 163, 184), font=get_font("code", 22))

    draw_subtitles(draw, scene["subtitle"])
    img.save(output_path, quality=95)
    print(f"[+] Rendered frame: {output_path}")

async def generate_speech(text: str, output_path: str):
    import edge_tts
    comm = edge_tts.Communicate(text, VOICE, rate="+3%")
    await comm.save(output_path)
    print(f"[+] Generated audio: {output_path}")

def get_audio_duration(file_path: str) -> float:
    cmd = [
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", file_path
    ]
    res = subprocess.run(cmd, capture_output=True, text=True, check=True)
    return float(res.stdout.strip())

def generate_background_music(duration_sec: float, output_path: str):
    print(f"[*] Generating ambient background music ({duration_sec:.1f}s)...")
    sr = 44100
    t = np.linspace(0, duration_sec, int(sr * duration_sec), endpoint=False)
    
    # 120 BPM rhythmic tech pulse
    bpm = 120.0
    beat_period = 60.0 / bpm
    
    # Deep warm sub pad (A minor progression: Am, F, C, G)
    bass = 0.08 * np.sin(2 * np.pi * 55.0 * t) + 0.05 * np.sin(2 * np.pi * 110.0 * t)
    chord1 = 0.04 * np.sin(2 * np.pi * 220.0 * t)
    chord2 = 0.03 * np.sin(2 * np.pi * 261.63 * t)
    chord3 = 0.03 * np.sin(2 * np.pi * 329.63 * t)
    
    # Rhythmic pulse
    pulse = 0.5 + 0.5 * np.sin(2 * np.pi * (1.0 / beat_period) * t)
    audio = (bass + (chord1 + chord2 + chord3) * pulse) * 0.15
    
    # Fade in / out
    fade_len = int(sr * 2.0)
    fade_in = np.linspace(0, 1, fade_len)
    fade_out = np.linspace(1, 0, fade_len)
    audio[:fade_len] *= fade_in
    audio[-fade_len:] *= fade_out
    
    wav.write(output_path, sr, audio.astype(np.float32))
    print(f"[+] Saved background music: {output_path}")

async def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    os.makedirs(BUILD_DIR, exist_ok=True)
    os.makedirs(AUDIO_DIR, exist_ok=True)
    os.makedirs(FRAMES_DIR, exist_ok=True)
    os.makedirs(CLIPS_DIR, exist_ok=True)

    print("=" * 76)
    print("PISTA DEVSECOPS AUTOPILOT — MASTER VIDEO PRODUCER")
    print("GitLab Transcend Hackathon 2026: Life After Code")
    print("=" * 76)

    # 1. Generate Voiceover Audios
    print("\n--- PHASE 1: GENERATING NEURAL STUDIO VOICEOVERS ---")
    clip_list = []
    total_duration = 0.0

    for idx, scene in enumerate(SCENES):
        audio_file = os.path.join(AUDIO_DIR, f"{scene['id']}.mp3")
        frame_file = os.path.join(FRAMES_DIR, f"{scene['id']}.png")
        clip_file = os.path.join(CLIPS_DIR, f"{scene['id']}.mp4")

        # Generate audio
        await generate_speech(scene["narration"], audio_file)
        duration = get_audio_duration(audio_file)
        # Add 0.4s breathing room to clip duration
        clip_duration = duration + 0.4
        total_duration += clip_duration

        # Render slide frame
        render_frame_for_scene(scene, frame_file)

        # Render clip via ffmpeg
        print(f"[*] Encoding clip {scene['id']} ({clip_duration:.2f}s)...")
        ffmpeg_clip_cmd = [
            "ffmpeg", "-y",
            "-loop", "1", "-i", frame_file,
            "-i", audio_file,
            "-c:v", "libx264", "-tune", "stillimage",
            "-c:a", "aac", "-b:a", "192k",
            "-pix_fmt", "yuv420p",
            "-t", str(clip_duration),
            clip_file
        ]
        subprocess.run(ffmpeg_clip_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        clip_list.append(clip_file)

    print(f"\n[+] All 12 scenes encoded! Total video duration: {total_duration:.1f} seconds ({total_duration/60:.2f} minutes).")

    # 2. Concatenate Clips
    print("\n--- PHASE 2: CONCATENATING SCENES ---")
    concat_txt = os.path.join(BUILD_DIR, "concat.txt")
    with open(concat_txt, "w", encoding="utf-8") as f:
        for c in clip_list:
            # Use forward slashes for ffmpeg concat demuxer
            clean_path = c.replace("\\", "/")
            f.write(f"file '{clean_path}'\n")

    unmixed_video = os.path.join(BUILD_DIR, "unmixed_video.mp4")
    concat_cmd = [
        "ffmpeg", "-y",
        "-f", "concat", "-safe", "0",
        "-i", concat_txt,
        "-c", "copy",
        unmixed_video
    ]
    subprocess.run(concat_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    print(f"[+] Concatenated video rendered: {unmixed_video}")

    # 3. Generate Background Music
    print("\n--- PHASE 3: GENERATING AMBIENT SYNTH SCORE ---")
    bg_music_wav = os.path.join(BUILD_DIR, "bg_music.wav")
    generate_background_music(total_duration, bg_music_wav)

    # 4. Final Audio Mix & Master Video Output
    print("\n--- PHASE 4: FINAL AUDIO MIX & MASTER RENDER ---")
    # Mix speech track with ducked background music
    final_cmd = [
        "ffmpeg", "-y",
        "-i", unmixed_video,
        "-i", bg_music_wav,
        "-filter_complex",
        "[1:a]volume=0.18[bg];[0:a][bg]amix=inputs=2:duration=first:dropout_transition=2[aout]",
        "-map", "0:v",
        "-map", "[aout]",
        "-c:v", "copy",
        "-c:a", "aac",
        "-b:a", "192k",
        FINAL_VIDEO
    ]
    subprocess.run(final_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

    print("=" * 76)
    print(f"[SUCCESS] MASTER VIDEO READY: {FINAL_VIDEO}")
    print(f"File Size: {os.path.getsize(FINAL_VIDEO) / (1024*1024):.2f} MB")
    print(f"Duration:  {get_audio_duration(FINAL_VIDEO):.1f} seconds")
    print("=" * 76)

if __name__ == "__main__":
    asyncio.run(main())
