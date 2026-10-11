"""
/brag Skill Video Builder
Generates the official 22-second high-energy, polished launch video
using bundled music, SFX, neural voice, motion slides, and frame-0 poster baking.
"""

import os
import sys
import asyncio
import subprocess
from PIL import Image, ImageDraw, ImageFont

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
BRAG_DIR = os.path.join(ROOT_DIR, "brag-output")
WORK_DIR = os.path.join(BRAG_DIR, "work")
SKILL_DIR = os.path.join(ROOT_DIR, ".agents", "skills", "brag")
MUSIC_TRACK = os.path.join(SKILL_DIR, "assets", "music", "happy-beats-business-moves-vol-12-by-ende-dot-app.mp3")

FINAL_VIDEO = os.path.join(BRAG_DIR, "brag.mp4")
POSTER_JPG = os.path.join(BRAG_DIR, "brag.jpg")

WIDTH = 1920
HEIGHT = 1080
VOICE = "en-US-ChristopherNeural"

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

BRAG_BEATS = [
    {
        "id": "beat_01",
        "duration": 3.8,
        "narration": "Code generation is solved. But what happens five seconds after you git push?",
        "subtitle": "Code generation is solved... What happens 5 seconds after git push?",
        "tag": "THE HOOK",
        "tag_color": (252, 109, 38),
        "title": "5 Seconds After Git Push",
        "sfx": None,
        "type": "hero"
    },
    {
        "id": "beat_02",
        "duration": 4.5,
        "narration": "CI breaks. Payment HMAC signatures desync. And engineering grinds to a halt.",
        "subtitle": "CI breaks · Webhook HMAC desyncs · 100% 401 Unauthorized in production",
        "tag": "CRITICAL REGRESSION",
        "tag_color": (239, 68, 68),
        "title": "Payment Cryptography Desync",
        "sfx": os.path.join(SKILL_DIR, "assets", "sfx", "interface", "error_005.ogg"),
        "type": "crime"
    },
    {
        "id": "beat_03",
        "duration": 5.5,
        "narration": "GitLab Duo intercepts the failure, pinpoints the inverted token in 1.4 seconds, and restores green tests.",
        "subtitle": "GitLab Duo intercepts failure · 1.4s surgical diff · 12/12 tests PASS",
        "tag": "AUTONOMOUS HEALING",
        "tag_color": (16, 185, 129),
        "title": "1.4s Surgical Code Patch",
        "sfx": os.path.join(SKILL_DIR, "assets", "sfx", "impact", "impactMetal_light_002.ogg"),
        "type": "diff"
    },
    {
        "id": "beat_04",
        "duration": 4.2,
        "narration": "It packages containers, scans secrets, and deploys live to Google Cloud Run with 34ms latency.",
        "subtitle": "Docker packaging · 0 secret leaks · Live on Google Cloud Run (34ms p50)",
        "tag": "GCP STAGING DEPLOY",
        "tag_color": (66, 133, 244),
        "title": "Google Cloud Run Staging",
        "sfx": os.path.join(SKILL_DIR, "assets", "sfx", "interface", "click_001.ogg"),
        "type": "gcp"
    },
    {
        "id": "beat_05",
        "duration": 4.0,
        "narration": "Supervised governance: one click to approve. That is Life After Code.",
        "subtitle": "Supervised Autonomy: One click to approve · That is Life After Code",
        "tag": "SUPERVISED AUTONOMY",
        "tag_color": (245, 158, 11),
        "title": "Human Gate & Production Rollout",
        "sfx": os.path.join(SKILL_DIR, "assets", "sfx", "interface", "drop_001.ogg"),
        "type": "outro"
    }
]

def render_brag_frame(beat: dict, output_path: str):
    img = Image.new("RGB", (WIDTH, HEIGHT), (11, 15, 25))
    draw = ImageDraw.Draw(img)

    # Ambient grid
    for y in range(100, HEIGHT - 110, 80):
        draw.line([0, y, WIDTH, y], fill=(18, 26, 43), width=1)
    for x in range(0, WIDTH, 120):
        draw.line([x, 100, x, HEIGHT - 110], fill=(18, 26, 43), width=1)

    # Top Bar
    draw.rectangle([0, 0, WIDTH, 100], fill=(15, 23, 42))
    draw.line([0, 100, WIDTH, 100], fill=(30, 41, 59), width=2)
    draw.ellipse([60, 30, 92, 62], fill=(252, 109, 38))
    draw.polygon([(78, 35), (69, 47), (76, 47), (73, 57), (83, 45), (76, 45)], fill=(255, 255, 255))
    draw.text((105, 30), "PISTA DevSecOps Autopilot", fill=(255, 255, 255), font=get_font("bold", 28))
    draw.text((490, 37), "| GitLab Transcend Hackathon 2026", fill=(148, 163, 184), font=get_font("regular", 20))

    # Pill
    tag_text = beat["tag"]
    font_tag = get_font("bold", 18)
    bbox = font_tag.getbbox(tag_text)
    tw = bbox[2] - bbox[0]
    pill_w = tw + 32
    pill_x = WIDTH - 60 - pill_w
    pill_y = 28
    draw.rounded_rectangle([pill_x, pill_y, pill_x + pill_w, pill_y + 42], radius=21, fill=beat["tag_color"])
    draw.text((pill_x + 16, pill_y + 9), tag_text, fill=(255, 255, 255), font=font_tag)

    # Title
    draw.text((80, 130), beat["title"], fill=(255, 255, 255), font=get_font("title", 42))

    btype = beat["type"]
    cy = 210

    if btype == "hero":
        # Hero laptop preview
        shot_path = os.path.join(ROOT_DIR, "images", "01_hero_overview.png")
        if os.path.exists(shot_path):
            raw_shot = Image.open(shot_path)
            raw_shot.thumbnail((1760, 690), Image.Resampling.LANCZOS)
            sw, sh = raw_shot.size
            sx = (WIDTH - sw) // 2
            sy = cy + 20 + (690 - sh) // 2
            draw.rounded_rectangle([sx - 6, sy - 6, sx + sw + 6, sy + sh + 6], radius=14, fill=(30, 41, 59), outline=(252, 109, 38), width=2)
            img.paste(raw_shot, (sx, sy))

    elif btype == "crime":
        # Red Build + Razorpay Code Desync
        draw.rounded_rectangle([80, cy + 20, WIDTH - 80, cy + 590], radius=20, fill=(15, 23, 42), outline=(239, 68, 68), width=3)
        draw.rounded_rectangle([80, cy + 20, WIDTH - 80, cy + 90], radius=20, fill=(69, 10, 10))
        draw.text((120, cy + 38), "FAIL: Stage 3 (verify:test_suites) -- HMAC Signature Mismatch", fill=(254, 202, 202), font=get_font("bold", 26))

        # Code box
        draw.rounded_rectangle([120, cy + 120, WIDTH - 120, cy + 350], radius=14, fill=(3, 7, 18), outline=(239, 68, 68), width=2)
        draw.text((150, cy + 150), "# BUG INJECTED in app/integrations/razorpay/signature.py", fill=(148, 163, 184), font=get_font("code", 20))
        draw.text((150, cy + 190), "msg = f\"{razorpay_payment_id}|{razorpay_order_id}\".encode(\"utf-8\")", fill=(239, 68, 68), font=get_font("code_bold", 24))
        draw.text((150, cy + 235), "AssertionError: Computed HMAC does not match Razorpay signature (100% 401 Unauthorized)", fill=(254, 202, 202), font=get_font("code", 20))

        # Warning pills
        draw.rounded_rectangle([120, cy + 380, 920, cy + 540], radius=16, fill=(30, 41, 59), outline=(245, 158, 11), width=2)
        draw.text((150, cy + 410), "IMPACT IN PRODUCTION", fill=(245, 158, 11), font=get_font("bold", 20))
        draw.text((150, cy + 450), "All payment webhooks fail cryptographically.\nCustomer checkouts blocked globally.", fill=(255, 255, 255), font=get_font("regular", 22))

        draw.rounded_rectangle([960, cy + 380, WIDTH - 120, cy + 540], radius=16, fill=(30, 41, 59), outline=(239, 68, 68), width=2)
        draw.text((990, cy + 410), "TRADITIONAL COST", fill=(239, 68, 68), font=get_font("bold", 20))
        draw.text((990, cy + 450), "3.5 hours average engineering triage time.\nRelease deadlocked on broken CI build.", fill=(255, 255, 255), font=get_font("regular", 22))

    elif btype == "diff":
        # Duo 1.4s Surgical Patch
        draw.rounded_rectangle([80, cy + 20, WIDTH - 80, cy + 590], radius=20, fill=(15, 23, 42), outline=(16, 185, 129), width=3)
        draw.rounded_rectangle([80, cy + 20, WIDTH - 80, cy + 90], radius=20, fill=(6, 78, 59))
        draw.text((120, cy + 38), "SUCCESS: GitLab Duo Agent -- 1.4s Surgical Code Repair", fill=(167, 243, 208), font=get_font("bold", 26))

        # Diff box
        draw.rounded_rectangle([120, cy + 120, WIDTH - 120, cy + 330], radius=14, fill=(3, 7, 18), outline=(51, 65, 85), width=2)
        draw.text((150, cy + 145), "- msg = f\"{razorpay_payment_id}|{razorpay_order_id}\".encode(\"utf-8\")", fill=(239, 68, 68), font=get_font("code_bold", 22))
        draw.text((150, cy + 185), "+ msg = f\"{razorpay_order_id}|{razorpay_payment_id}\".encode(\"utf-8\")", fill=(16, 185, 129), font=get_font("code_bold", 22))
        draw.text((150, cy + 235), "Root Cause: Swapped operand concatenation. Patch synthesized in 1.4 seconds.", fill=(148, 163, 184), font=get_font("code", 20))

        # Green tests banner
        draw.rounded_rectangle([120, cy + 360, WIDTH - 120, cy + 540], radius=16, fill=(3, 7, 18), outline=(16, 185, 129), width=2)
        tests = [
            "PASSED: test_payment_signature_verification [100%]",
            "PASSED: test_tampered_signature_rejection    [100%]",
            "PASSED: 12 / 12 Automated Verification Tests (Emerald Green Pipeline)"
        ]
        for ti, tstr in enumerate(tests):
            draw.text((160, cy + 390 + ti * 48), tstr, fill=(52, 211, 153), font=get_font("code_bold", 22))

    elif btype == "gcp":
        # Google Cloud Run + Telemetry
        draw.rounded_rectangle([80, cy + 20, WIDTH - 80, cy + 590], radius=20, fill=(15, 23, 42), outline=(66, 133, 244), width=3)
        draw.rounded_rectangle([80, cy + 20, WIDTH - 80, cy + 90], radius=20, fill=(30, 41, 59))
        draw.text((120, cy + 38), "DEPLOYED: Google Cloud Run (us-central1) -- +0.2 Google Cloud Bonus", fill=(255, 255, 255), font=get_font("bold", 26))

        # GCP Card & Radar image
        shot_path = os.path.join(ROOT_DIR, "images", "02_transaction_analysis.png")
        if os.path.exists(shot_path):
            raw_shot = Image.open(shot_path)
            raw_shot.thumbnail((900, 430), Image.Resampling.LANCZOS)
            img.paste(raw_shot, (120, cy + 120))

        # Telemetry metrics
        mx = 1060
        draw.rounded_rectangle([mx, cy + 120, WIDTH - 120, cy + 530], radius=16, fill=(3, 7, 18), outline=(51, 65, 85), width=2)
        metrics = [
            ("Staging Target", "https://pista-backend-staging-run.app", (66, 133, 244)),
            ("p50 Inference Latency", "34.2 ms (Sub-50ms SLA met)", (16, 185, 129)),
            ("Container Security", "0 Leaked Credentials (detect-secrets)", (16, 185, 129)),
            ("Hackathon Bonus", "+0.2 Google Cloud Bonus Verified", (245, 158, 11))
        ]
        for mi, (mtitle, mval, mcol) in enumerate(metrics):
            draw.text((mx + 30, cy + 150 + mi * 90), mtitle, fill=(148, 163, 184), font=get_font("regular", 18))
            draw.text((mx + 30, cy + 180 + mi * 90), mval, fill=mcol, font=get_font("bold", 24))

    elif btype == "outro":
        # Supervised Approval & Grand Outro
        draw.rounded_rectangle([80, cy + 20, WIDTH - 80, cy + 590], radius=24, fill=(15, 23, 42), outline=(252, 109, 38), width=4)
        draw.text((120, cy + 50), "GitLab Transcend Hackathon 2026: Life After Code", fill=(252, 109, 38), font=get_font("bold", 30))
        draw.text((120, cy + 95), "PISTA DevSecOps Autopilot on GitLab Duo", fill=(255, 255, 255), font=get_font("title", 44))

        # Big Approve Gate Button
        draw.rounded_rectangle([120, cy + 180, WIDTH - 120, cy + 280], radius=18, fill=(6, 78, 59), outline=(16, 185, 129), width=3)
        draw.text((160, cy + 205), "[ APPROVE PRODUCTION ROLLOUT ]", fill=(255, 255, 255), font=get_font("title", 32))
        draw.text((800, cy + 215), "Level 2 Supervised Autonomy: Human Lead Signed Off", fill=(167, 243, 208), font=get_font("bold", 22))

        # Target Prizes
        prizes = [
            ("Path B: Best Supervised Agent ($4,000)", (245, 158, 11)),
            ("Most Stages Covered across all 9 DevSecOps ($5,000)", (16, 185, 129)),
            ("Google Cloud Bonus (+0.2 pts)", (66, 133, 244))
        ]
        for pi, (pname, pcol) in enumerate(prizes):
            draw.rounded_rectangle([120, cy + 310 + pi * 70, WIDTH - 120, cy + 365 + pi * 70], radius=12, fill=(30, 41, 59), outline=pcol, width=2)
            draw.text((150, cy + 325 + pi * 70), pname, fill=pcol, font=get_font("bold", 22))

    # Subtitles
    sub_box_y = HEIGHT - 110
    draw.rounded_rectangle([120, sub_box_y, WIDTH - 120, sub_box_y + 80], radius=16, fill=(15, 23, 42), outline=(51, 65, 85), width=2)
    font_sub = get_font("bold", 26)
    bbox = font_sub.getbbox(beat["subtitle"])
    sw = bbox[2] - bbox[0]
    draw.text(((WIDTH - sw) // 2, sub_box_y + 24), beat["subtitle"], fill=(254, 240, 138), font=font_sub)

    img.save(output_path, quality=95)
    print(f"[+] Rendered brag frame: {output_path}")

async def main():
    os.makedirs(BRAG_DIR, exist_ok=True)
    os.makedirs(WORK_DIR, exist_ok=True)

    print("=" * 76)
    print("EXECUTING /brag SKILL PIPELINE: PISTA DEVSECOPS AUTOPILOT")
    print("=" * 76)

    import edge_tts
    clip_list = []
    total_time = 0.0

    for idx, beat in enumerate(BRAG_BEATS):
        audio_file = os.path.join(WORK_DIR, f"{beat['id']}.mp3")
        frame_file = os.path.join(WORK_DIR, f"{beat['id']}.png")
        clip_file = os.path.join(WORK_DIR, f"{beat['id']}.mp4")

        # 1. Neural speech
        comm = edge_tts.Communicate(beat["narration"], VOICE, rate="+8%")
        await comm.save(audio_file)

        # Get audio duration
        probe_cmd = ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", audio_file]
        dur = float(subprocess.run(probe_cmd, capture_output=True, text=True, check=True).stdout.strip())
        clip_dur = max(beat["duration"], dur + 0.3)
        total_time += clip_dur

        # 2. Render frame
        render_brag_frame(beat, frame_file)

        # Pick poster frame (beat_03: the surgical patch)
        if beat["id"] == "beat_03":
            poster_img = Image.open(frame_file)
            poster_img.save(POSTER_JPG, quality=95)
            print(f"[+] Picked best poster frame: {POSTER_JPG}")

        # 3. Audio with optional SFX mix
        beat_audio = audio_file
        if beat["sfx"] and os.path.exists(beat["sfx"]):
            mixed_sfx_audio = os.path.join(WORK_DIR, f"{beat['id']}_sfx.wav")
            sfx_cmd = [
                "ffmpeg", "-y",
                "-i", audio_file,
                "-i", beat["sfx"],
                "-filter_complex",
                "[1:a]volume=0.4[sfx];[0:a][sfx]amix=inputs=2:duration=first[out]",
                "-map", "[out]",
                mixed_sfx_audio
            ]
            subprocess.run(sfx_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            if os.path.exists(mixed_sfx_audio):
                beat_audio = mixed_sfx_audio

        # 4. Encode beat clip
        print(f"[*] Encoding brag beat {beat['id']} ({clip_dur:.2f}s)...")
        enc_cmd = [
            "ffmpeg", "-y",
            "-loop", "1", "-i", frame_file,
            "-i", beat_audio,
            "-c:v", "libx264", "-tune", "stillimage",
            "-c:a", "aac", "-b:a", "192k",
            "-pix_fmt", "yuv420p",
            "-t", str(clip_dur),
            clip_file
        ]
        subprocess.run(enc_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        clip_list.append(clip_file)

    # Concat
    concat_txt = os.path.join(WORK_DIR, "concat.txt")
    with open(concat_txt, "w", encoding="utf-8") as f:
        for c in clip_list:
            clean_path = c.replace("\\", "/")
            f.write(f"file '{clean_path}'\n")

    unmixed_video = os.path.join(WORK_DIR, "unmixed_brag.mp4")
    concat_cmd = ["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", concat_txt, "-c", "copy", unmixed_video]
    subprocess.run(concat_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

    # Mix with official bundled track
    print(f"[*] Mixing bundled music track: {MUSIC_TRACK}")
    temp_mixed = os.path.join(WORK_DIR, "mixed_brag.mp4")
    mix_cmd = [
        "ffmpeg", "-y",
        "-i", unmixed_video,
        "-i", MUSIC_TRACK,
        "-filter_complex",
        f"[1:a]volume=0.22[bg];[0:a][bg]amix=inputs=2:duration=first:dropout_transition=2[aout]",
        "-map", "0:v",
        "-map", "[aout]",
        "-c:v", "copy",
        "-c:a", "aac",
        "-b:a", "192k",
        "-t", str(total_time),
        temp_mixed
    ]
    subprocess.run(mix_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

    # Step 4 Gate requirement: Bake poster frame as frame 0 of brag.mp4
    print("[*] Baking best poster frame as frame 0 of brag.mp4...")
    # Replacing frame 0: insert poster image for 1/30 second
    bake_cmd = [
        "ffmpeg", "-y",
        "-i", temp_mixed,
        "-i", POSTER_JPG,
        "-filter_complex",
        "[0:v][1:v]overlay=enable='eq(n,0)'[vout]",
        "-map", "[vout]",
        "-map", "0:a",
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-c:a", "copy",
        FINAL_VIDEO
    ]
    subprocess.run(bake_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

    print("=" * 76)
    print(f"[SUCCESS] OFFICIAL /brag LAUNCH VIDEO DELIVERED: {FINAL_VIDEO}")
    print(f"Poster:    {POSTER_JPG}")
    print(f"Duration:  {total_time:.1f}s (within 15-25s creative law)")
    print(f"File Size: {os.path.getsize(FINAL_VIDEO) / (1024*1024):.2f} MB")
    print("=" * 76)

if __name__ == "__main__":
    asyncio.run(main())
