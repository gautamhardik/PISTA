"""
Finalize PISTA Masterpiece Video Delivery:
1. Bake Frame 0 poster for thumbnail instant readiness.
2. Mirror to output/PISTA_Masterpiece_Launch_Demo.mp4 & brag-output/brag.mp4.
3. Sync to IDE artifact directory.
4. Clean up all temporary stems, work folders, and test scripts.
"""

import os
import shutil
import subprocess

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
BRAG_DIR = os.path.join(ROOT_DIR, "brag-output")
OUTPUT_DIR = os.path.join(ROOT_DIR, "output")
ART_DIR = r"C:\Users\hiten\.gemini\antigravity-ide\brain\75d5c359-2ade-4644-941c-64f8e70f7dd2"

RAW_VIDEO = os.path.join(BRAG_DIR, "brag.mp4")
POSTER_JPG = os.path.join(OUTPUT_DIR, "PISTA_Masterpiece_Poster.jpg")
FINAL_MASTER_VIDEO = os.path.join(OUTPUT_DIR, "PISTA_Masterpiece_Launch_Demo.mp4")
FINAL_BRAG_VIDEO = os.path.join(BRAG_DIR, "brag.mp4")
FINAL_BRAG_JPG = os.path.join(BRAG_DIR, "brag.jpg")

def finalize():
    if not os.path.exists(RAW_VIDEO):
        print(f"Error: {RAW_VIDEO} not found!")
        return

    print("=" * 76)
    print("FINALIZING PISTA MASTERPIECE VIDEO & POSTER")
    print("=" * 76)

    # 1. Extract best settled frame (at 7.0s from Scene 1) as poster
    print("[*] Extracting settled poster frame from 00:00:07...")
    poster_cmd = [
        "ffmpeg", "-y", "-ss", "00:00:07",
        "-i", RAW_VIDEO,
        "-frames:v", "1", "-q:v", "2",
        POSTER_JPG
    ]
    subprocess.run(poster_cmd, check=True)
    shutil.copyfile(POSTER_JPG, FINAL_BRAG_JPG)
    print(f"[+] Poster saved: {POSTER_JPG}")

    # 2. Bake Frame 0 Poster into final MP4
    temp_baked = os.path.join(OUTPUT_DIR, "temp_baked.mp4")
    print("[*] Baking Frame 0 poster for universal thumbnail readiness...")
    bake_cmd = [
        "ffmpeg", "-y",
        "-i", RAW_VIDEO,
        "-i", POSTER_JPG,
        "-filter_complex",
        "[0:v][1:v]overlay=enable='eq(n,0)'[vout]",
        "-map", "[vout]",
        "-map", "0:a?",
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-pix_fmt", "yuv420p",
        "-c:a", "copy",
        temp_baked
    ]
    subprocess.run(bake_cmd, check=True)
    shutil.move(temp_baked, FINAL_MASTER_VIDEO)
    shutil.copyfile(FINAL_MASTER_VIDEO, FINAL_BRAG_VIDEO)

    # 3. Sync to IDE artifact directory
    print("[*] Syncing deliverables to IDE artifact directory...")
    shutil.copyfile(FINAL_MASTER_VIDEO, os.path.join(ART_DIR, "PISTA_Masterpiece_Launch_Demo.mp4"))
    shutil.copyfile(POSTER_JPG, os.path.join(ART_DIR, "PISTA_Masterpiece_Poster.jpg"))
    shutil.copyfile(FINAL_MASTER_VIDEO, os.path.join(ART_DIR, "brag.mp4"))
    shutil.copyfile(POSTER_JPG, os.path.join(ART_DIR, "brag.jpg"))

    # 4. Strict Cleanup of Temporary Stems & Work Directories
    print("[*] Performing strict directory cleanup...")
    clean_dirs = [
        os.path.join(BRAG_DIR, "work_masterpiece"),
        os.path.join(BRAG_DIR, "voice_stems"),
        os.path.join(BRAG_DIR, "work_audio"),
        os.path.join(BRAG_DIR, "test_audio_comp"),
        os.path.join(BRAG_DIR, "test_comp"),
        os.path.join(OUTPUT_DIR, "poc_frames"),
        os.path.join(OUTPUT_DIR, "poc_rec")
    ]
    for d in clean_dirs:
        if os.path.exists(d):
            shutil.rmtree(d, ignore_errors=True)
            print(f"[-] Removed temporary dir: {d}")

    # Remove temporary verify / test pngs in output/
    for f in os.listdir(OUTPUT_DIR):
        if f.endswith("_verify.png") or f.startswith("test_") or f.startswith("vector_icons_test"):
            try:
                os.remove(os.path.join(OUTPUT_DIR, f))
                print(f"[-] Removed temporary file: {f}")
            except Exception:
                pass

    dur_cmd = ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", FINAL_MASTER_VIDEO]
    dur = float(subprocess.run(dur_cmd, capture_output=True, text=True, check=True).stdout.strip())
    size_mb = os.path.getsize(FINAL_MASTER_VIDEO) / (1024 * 1024)

    print("=" * 76)
    print("[DELIVERED] MASTERPIECE VIDEO COMPLETE & DIRECTORY CLEANED!")
    print(f"Master Video: {FINAL_MASTER_VIDEO}")
    print(f"Poster Image: {POSTER_JPG}")
    print(f"Duration:     {dur:.1f}s ({dur/60:.2f} minutes)")
    print(f"File Size:    {size_mb:.2f} MB")
    print("=" * 76)

if __name__ == "__main__":
    finalize()
