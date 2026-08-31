import time
import numpy as np
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from app.main import app

def run_load_test_benchmark(num_requests: int = 100):
    """
    Executes a high-concurrency automated latency benchmark across PISTA's
    predict endpoint and reports empirical latency percentiles (P50, P90, P95, P99).
    """
    print(f"\n=======================================================")
    print(f" [*] PISTA High-Throughput Latency Benchmark ({num_requests} reqs)")
    print(f"=======================================================")
    
    latencies = []
    sample_payload = {
        "TransactionAmt": 250.00,
        "ProductCD": "W",
        "card1": 13926,
        "card2": 361.0,
        "card4": "visa",
        "card6": "credit",
        "addr1": 315.0,
        "addr2": 87.0,
        "P_emaildomain": "gmail.com",
        "DeviceType": "desktop"
    }

    with TestClient(app) as client:
        # Warmup
        for _ in range(3):
            client.post("/api/v1/predict", json=sample_payload)

        # Benchmark run
        t_bench_start = time.perf_counter()
        for i in range(num_requests):
            t0 = time.perf_counter()
            resp = client.post("/api/v1/predict", json=sample_payload)
            dt = (time.perf_counter() - t0) * 1000.0
            if resp.status_code == 200:
                latencies.append(dt)
            else:
                print(f"Request {i} failed: {resp.status_code}")

        total_wall_sec = time.perf_counter() - t_bench_start

    lat_arr = np.array(latencies)
    throughput = len(latencies) / total_wall_sec

    p50 = np.percentile(lat_arr, 50)
    p90 = np.percentile(lat_arr, 90)
    p95 = np.percentile(lat_arr, 95)
    p99 = np.percentile(lat_arr, 99)
    min_lat = np.min(lat_arr)
    max_lat = np.max(lat_arr)

    print(f" Total Completed   : {len(latencies)} / {num_requests}")
    print(f" Total Wall Time   : {total_wall_sec:.2f}s")
    print(f" Throughput        : {throughput:.1f} requests/sec")
    print(f"-------------------------------------------------------")
    print(f" Min Latency       : {min_lat:.2f} ms")
    print(f" P50 (Median)      : {p50:.2f} ms")
    print(f" P90 Latency       : {p90:.2f} ms")
    print(f" P95 Latency       : {p95:.2f} ms")
    print(f" P99 Latency       : {p99:.2f} ms")
    print(f" Max Latency       : {max_lat:.2f} ms")
    print(f"=======================================================\n")
    return {
        "throughput_rps": round(throughput, 1),
        "p50_ms": round(p50, 2),
        "p95_ms": round(p95, 2),
        "p99_ms": round(p99, 2)
    }

if __name__ == "__main__":
    run_load_test_benchmark(50)
