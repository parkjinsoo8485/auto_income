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

# Add project root to sys.path
BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))

from engine.generator import AssetGenerator
from engine.mutator import SourceCodeMutator
from engine.builder import BuildAndReleaseAgent

def run_pipeline(config_path: str, flutter_dir: str = None) -> dict:
    """
    Main Orchestrator Execution Pipeline:
    1. Asset Generation Agent (Icons, TTS MP3s, ASO Screenshots)
    2. Source Code Mutation Agent (Anti-Spam Dummy Code, Manifest/Gradle ID, Theme Color)
    3. Build & Release Agent (Keystore, Release AAB build, Distribution Zip Packaging)
    """
    start_time = time.time()
    
    if flutter_dir is None:
        flutter_dir = str(BASE_DIR / "templates" / "flutter_app")
        
    cfg_file = Path(config_path)
    if not cfg_file.is_absolute():
        cfg_file = BASE_DIR / config_path
        
    if not cfg_file.exists():
        raise FileNotFoundError(f"Configuration file not found: {cfg_file}")

    print("=" * 70)
    print(f"[AUTO-APP-BUILDER] Pipeline Started: {cfg_file.name}")
    print("=" * 70)

    # -------------------------------------------------------------
    # Step 1: Asset Generation Agent
    # -------------------------------------------------------------
    print("\n[Step 1/3] Running Asset Generation Agent...")
    asset_agent = AssetGenerator(str(cfg_file), str(BASE_DIR))
    asset_report = asset_agent.run_all(flutter_dir)
    print(f"  [OK] Android Mipmap & Store Icons: {asset_report['icons_count']} generated")
    print(f"  [OK] Native Audio TTS MP3s: {asset_report['audio_files_count']} generated")
    print(f"  [OK] Google Play Store ASO Screenshots: {asset_report['screenshots_count']} generated")

    # -------------------------------------------------------------
    # Step 2: Source Code Mutation Agent
    # -------------------------------------------------------------
    print("\n[Step 2/3] Running Source Code Mutation Agent (Anti-Spam Defense)...")
    mutator_agent = SourceCodeMutator(str(cfg_file), flutter_dir)
    mutator_report = mutator_agent.run_all()
    print(f"  [OK] Package ID & Android Manifests: {mutator_report['android_identifiers']}")
    print(f"  [OK] Dynamic Theme Injected: {mutator_report['theme_file']}")
    print(f"  [OK] AST/Bytecode Dummy Modules Injected into {mutator_report['mutated_dart_files_count']} files")

    # -------------------------------------------------------------
    # Step 3: Build & Release Agent
    # -------------------------------------------------------------
    print("\n[Step 3/3] Running Build & Release Packaging Agent...")
    build_agent = BuildAndReleaseAgent(str(cfg_file), flutter_dir, str(BASE_DIR))
    build_report = build_agent.run_all()
    print(f"  [OK] Dedicated JKS Signing Key: {build_report['keystore']['keystore_path']}")
    print(f"  [OK] Release AAB Bundle: {build_report['package']['release_aab']}")
    print(f"  [OK] Store Metadata Listing: {build_report['package']['store_metadata']}")
    print(f"  [OK] Final Release Package Zip: {build_report['package']['distribution_zip']}")

    elapsed = round(time.time() - start_time, 2)
    print("\n" + "=" * 70)
    print(f"Pipeline Completed Successfully in {elapsed}s!")
    print(f"Output Directory: {build_report['package']['output_directory']}")
    print("=" * 70)

    return {
        "status": "SUCCESS",
        "duration_seconds": elapsed,
        "assets": asset_report,
        "mutation": mutator_report,
        "build": build_report
    }

def main():
    parser = argparse.ArgumentParser(description="Auto-App-Builder Factory Orchestrator CLI")
    parser.add_argument("--config", "-c", type=str, default="configs/korean_basic_vocab.json", help="Path to app_config.json")
    parser.add_argument("--flutter_dir", "-f", type=str, default=None, help="Custom flutter project template path")
    args = parser.parse_args()

    run_pipeline(args.config, args.flutter_dir)

if __name__ == "__main__":
    main()
