import os, subprocess, json

WORK_DIR = r"brag-output/work_audio"
os.makedirs(WORK_DIR, exist_ok=True)

SKILL_DIR = r".agents/skills/brag"
MUSIC_SRC = os.path.join(SKILL_DIR, "assets", "music", "happy-beats-business-moves-vol-12-by-ende-dot-app.mp3")

SFX_ERROR = os.path.join(SKILL_DIR, "assets", "sfx", "interface", "error_005.ogg")
SFX_BELL = os.path.join(SKILL_DIR, "assets", "sfx", "impact", "impactBell_heavy_000.ogg")
SFX_SWITCH = os.path.join(SKILL_DIR, "assets", "sfx", "interface", "switch_001.ogg")
SFX_CLICK = os.path.join(SKILL_DIR, "assets", "sfx", "interface", "click_001.ogg")

VO_STEMS_DIR = r"brag-output/voice_stems"

# Let's inspect durations of the 6 VO files
vo_files = [f"vo_{i:02d}.mp3" for i in range(1, 7)]
durations = []
for vf in vo_files:
    p = os.path.join(VO_STEMS_DIR, vf)
    cmd = ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", p]
    dur = float(subprocess.run(cmd, capture_output=True, text=True, check=True).stdout.strip())
    durations.append(dur)

print("VO Durations:", durations)

# Calculate scene start times with breathing room (0.4s between scenes)
scene_timings = []
current_time = 0.5  # 0.5s initial beat
for i, dur in enumerate(durations):
    scene_dur = dur + 0.8
    scene_timings.append({
        "scene": i + 1,
        "start": round(current_time, 2),
        "vo_start": round(current_time + 0.2, 2),
        "vo_dur": round(dur, 2),
        "duration": round(scene_dur, 2),
        "end": round(current_time + scene_dur, 2)
    })
    current_time += scene_dur

total_duration = round(current_time + 1.0, 2)
print("Total Duration:", total_duration)
print("Scene Timings:", json.dumps(scene_timings, indent=2))

# Save timings to JSON for the GSAP composition
with open(os.path.join(WORK_DIR, "scene_timings.json"), "w", encoding="utf-8") as f:
    json.dump({"total_duration": total_duration, "scenes": scene_timings}, f, indent=2)

# Build FFmpeg filter_complex to mix all audio layers
# Inputs:
# 0: music
# 1..6: vo_01..vo_06
# 7: sfx_bell
# 8: sfx_switch
# 9: sfx_error
# 10: sfx_bell
# 11: sfx_click

inputs = ["-i", MUSIC_SRC]
for vf in vo_files:
    inputs.extend(["-i", os.path.join(VO_STEMS_DIR, vf)])

inputs.extend(["-i", SFX_BELL])   # 7 (Scene 1 metric slam)
inputs.extend(["-i", SFX_SWITCH]) # 8 (Scene 2 analyze click)
inputs.extend(["-i", SFX_ERROR])  # 9 (Scene 3 CI failure)
inputs.extend(["-i", SFX_BELL])   # 10 (Scene 4 emerald pass)
inputs.extend(["-i", SFX_CLICK])  # 11 (Scene 5 human release)

# Build delays and mix
# Filter complex
fc_parts = []
# Music background: volume 0.18, trimmed to total_duration
fc_parts.append(f"[0:a]volume=0.18,afade=t=out:st={total_duration-1.5}:d=1.5[bg_music]")

# Voiceovers with adelay
for i, sc in enumerate(scene_timings):
    delay_ms = int(sc["vo_start"] * 1000)
    fc_parts.append(f"[{i+1}:a]adelay={delay_ms}|{delay_ms},volume=1.0[vo_{i+1}]")

# SFX with adelay
# SFX 1: Scene 1 metric slam at scene_1 start + 1.2s
sfx1_ms = int((scene_timings[0]["start"] + 1.2) * 1000)
fc_parts.append(f"[7:a]adelay={sfx1_ms}|{sfx1_ms},volume=0.4[sfx_1]")

# SFX 2: Scene 2 analyze click at scene_2 start + 2.5s
sfx2_ms = int((scene_timings[1]["start"] + 2.5) * 1000)
fc_parts.append(f"[8:a]adelay={sfx2_ms}|{sfx2_ms},volume=0.4[sfx_2]")

# SFX 3: Scene 3 error at scene_3 start + 4.0s
sfx3_ms = int((scene_timings[2]["start"] + 4.0) * 1000)
fc_parts.append(f"[9:a]adelay={sfx3_ms}|{sfx3_ms},volume=0.4[sfx_3]")

# SFX 4: Scene 4 green bell at scene_4 start + 3.0s
sfx4_ms = int((scene_timings[3]["start"] + 3.0) * 1000)
fc_parts.append(f"[10:a]adelay={sfx4_ms}|{sfx4_ms},volume=0.4[sfx_4]")

# SFX 5: Scene 5 click at scene_5 start + 3.5s
sfx5_ms = int((scene_timings[4]["start"] + 3.5) * 1000)
fc_parts.append(f"[11:a]adelay={sfx5_ms}|{sfx5_ms},volume=0.45[sfx_5]")

# Mix all 12 streams
all_labels = ["[bg_music]"] + [f"[vo_{i+1}]" for i in range(len(scene_timings))] + [f"[sfx_{j}]" for j in range(1, 6)]
fc_parts.append(f"{''.join(all_labels)}amix=inputs={len(all_labels)}:duration=first:dropout_transition=2[aout]")

master_wav = os.path.join(WORK_DIR, "master_soundtrack.wav")
mix_cmd = ["ffmpeg", "-y"] + inputs + [
    "-filter_complex", ";".join(fc_parts),
    "-map", "[aout]",
    "-t", str(total_duration),
    "-ar", "44100",
    "-ac", "2",
    master_wav
]

subprocess.run(mix_cmd, check=True)
print(f"[+] Master soundtrack mixed successfully: {master_wav} ({total_duration}s)")
