import os
import sys
import io
import json
import argparse
import time
from pathlib import Path

# Fix Windows console UTF-8 encoding
if sys.platform.startswith("win"):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8", errors="replace")
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8", errors="replace")

BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))

from pipeline import run_pipeline

def run_batch(configs_dir: str):
    cfg_path = Path(configs_dir)
    if not cfg_path.is_absolute():
        cfg_path = BASE_DIR / configs_dir

    configs = list(cfg_path.glob("*.json"))
    if not configs:
        print(f"No JSON configs found in {cfg_path}")
        return

    print("=" * 70)
    print(f"🏭 [BATCH-BUILD-FACTORY] Processing {len(configs)} App Configurations...")
    print("=" * 70)

    results = []
    for idx, cfg in enumerate(configs, start=1):
        print(f"\n>>> [{idx}/{len(configs)}] Processing {cfg.name}...")
        try:
            res = run_pipeline(str(cfg))
            results.append((cfg.name, "SUCCESS", res["duration_seconds"]))
        except Exception as e:
            print(f"  [ERROR] Failed to build {cfg.name}: {e}")
            results.append((cfg.name, f"FAILED: {e}", 0))

    print("\n" + "=" * 70)
    print("🏭 [BATCH-BUILD-FACTORY SUMMARY]")
    print("=" * 70)
    for name, status, duration in results:
        print(f"- {name:<35} : {status} ({duration}s)")
    print("=" * 70)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Batch App Build Factory")
    parser.add_argument("--configs_dir", "-d", type=str, default="configs", help="Directory containing app configs")
    args = parser.parse_args()
    run_batch(args.configs_dir)
