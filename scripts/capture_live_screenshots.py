import os
import time
from playwright.sync_api import sync_playwright

OUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "images", "live_capture"))
os.makedirs(OUT_DIR, exist_ok=True)

PAGES = [
    ("01_overview.png", "https://frontend-sigma-vert-50.vercel.app/", 2000),
    ("02_analyze.png", "https://frontend-sigma-vert-50.vercel.app/analyze", 2000),
    ("03_analytics.png", "https://frontend-sigma-vert-50.vercel.app/analytics", 2000),
    ("04_cases.png", "https://frontend-sigma-vert-50.vercel.app/cases", 2000),
    ("05_model.png", "https://frontend-sigma-vert-50.vercel.app/model", 2000),
    ("06_gitlab_repo.png", "https://gitlab.com/gautamhardik/pista-devsecops-autopilot", 3000),
    ("07_gitlab_pipelines.png", "https://gitlab.com/gautamhardik/pista-devsecops-autopilot/-/pipelines", 3000),
]

def main():
    print("Capturing live high-resolution production screenshots...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            viewport={"width": 1920, "height": 1080},
            device_scale_factor=2, # Crisp retina rendering
            color_scheme="dark"
        )
        page = context.new_page()

        for filename, url, wait_ms in PAGES:
            print(f"Navigating to {url}...")
            try:
                page.goto(url, wait_until="networkidle", timeout=25000)
                time.sleep(wait_ms / 1000.0)
                save_path = os.path.join(OUT_DIR, filename)
                page.screenshot(path=save_path, full_page=False)
                print(f"Saved: {save_path}")
            except Exception as e:
                print(f"Error capturing {url}: {e}")

        # Also interact with /analyze to trigger a real transaction analysis for a live result screenshot
        print("Interacting with /analyze to capture real prediction result...")
        try:
            page.goto("https://frontend-sigma-vert-50.vercel.app/analyze", wait_until="networkidle", timeout=25000)
            time.sleep(1.5)
            # Find and click 'Analyze Transaction' button
            buttons = page.query_selector_all("button")
            for btn in buttons:
                txt = btn.inner_text()
                if "Analyze" in txt or "Run" in txt:
                    btn.click()
                    break
            time.sleep(2.0)
            result_path = os.path.join(OUT_DIR, "08_live_prediction_result.png")
            page.screenshot(path=result_path)
            print(f"Saved live result screenshot: {result_path}")
        except Exception as e:
            print(f"Error on interactive analyze: {e}")

        browser.close()
    print("All live screenshots captured successfully!")

if __name__ == "__main__":
    main()
