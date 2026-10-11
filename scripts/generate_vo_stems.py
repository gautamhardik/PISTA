import os, asyncio, subprocess
import edge_tts

VOICE = "en-US-AvaNeural"
OUT_DIR = r"brag-output/voice_stems"
os.makedirs(OUT_DIR, exist_ok=True)

SCRIPTS = [
    {
        "id": "vo_01",
        "text": "At enterprise scale, payment fraud moves at the speed of light. Meet PISTA: the autonomous fraud intelligence engine delivering sub-millisecond inference across 492 engineered feature dimensions."
    },
    {
        "id": "vo_02",
        "text": "Every transaction is evaluated in real time. Our calibrated TreeSHAP engine breaks down complex risk signals into instant, explainable attribution drivers, approving legitimate checkouts with zero friction."
    },
    {
        "id": "vo_03",
        "text": "Writing code with AI is fast, but what happens when a payment webhook regression silently breaks production? An inverted HMAC operand syntax passes linting, but customer checkouts fail on CI."
    },
    {
        "id": "vo_04",
        "text": "PISTA solves this with GitLab Duo Autopilot. Intercepting the failed pipeline, Duo queries our custom Model Context Protocol tools, isolates the root cause, and synthesizes a surgical patch in 1.4 seconds. All twelve tests pass. Emerald green."
    },
    {
        "id": "vo_05",
        "text": "Full multi-stage Docker security with zero secret leaks. Green Software Foundation carbon tracking at 0.048 grams of CO2 per build. And Level 2 Supervised Autonomy: the human engineering lead authorizes production promotion with a single click."
    },
    {
        "id": "vo_06",
        "text": "Autonomous intelligence. Self-healing pipelines. Production-grade governance. Welcome to Life After Code with PISTA."
    }
]

async def gen():
    durations = {}
    for item in SCRIPTS:
        p = os.path.join(OUT_DIR, f"{item['id']}.mp3")
        comm = edge_tts.Communicate(item["text"], VOICE, rate="+6%")
        await comm.save(p)
        cmd = ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", p]
        dur = float(subprocess.run(cmd, capture_output=True, text=True, check=True).stdout.strip())
        durations[item["id"]] = dur
        print(f"[+] {item['id']}: {dur:.2f}s")
    
    total = sum(durations.values())
    print(f"\nTotal VO duration: {total:.2f}s")

if __name__ == "__main__":
    asyncio.run(gen())
