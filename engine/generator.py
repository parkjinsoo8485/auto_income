import os
import json
import asyncio
from pathlib import Path
from typing import Dict, Any, List
from PIL import Image, ImageDraw, ImageFont

from .tts_adapter import TTSAdapter

# Android Mipmap resolutions
MIPMAP_RESOLUTIONS = {
    "mipmap-mdpi": (48, 48),
    "mipmap-hdpi": (72, 72),
    "mipmap-xhdpi": (96, 96),
    "mipmap-xxhdpi": (144, 144),
    "mipmap-xxxhdpi": (192, 192),
    "playstore-icon": (512, 512),
}

class AssetGenerator:
    """
    Sub-Agent 1: Asset Generation Factory
    - Resizes app icon into Android mipmap sizes & Play Store 512x512
    - Generates batch native audio (TTS) for vocabulary & example sentences
    - Bundles JSON content data into assets/data/content.json
    - Synthesizes 5 High-Conversion ASO promotional screenshots
    """
    def __init__(self, config_path: str, base_dir: str):
        self.base_dir = Path(base_dir)
        with open(config_path, "r", encoding="utf-8") as f:
            self.config = json.load(f)
            
        self.tts = TTSAdapter(
            engine=self.config.get("assets", {}).get("tts_engine", "edge-tts"),
            voice=self.config.get("assets", {}).get("tts_voice", "ko-KR-SunHiNeural")
        )

    def generate_default_icon(self, output_path: str) -> str:
        """Create a professional gradient base icon if source icon not provided."""
        out_p = Path(output_path)
        out_p.parent.mkdir(parents=True, exist_ok=True)
        
        img = Image.new("RGBA", (512, 512), color=(0, 0, 0, 0))
        draw = ImageDraw.Draw(img)
        
        primary_hex = self.config.get("ui_theme", {}).get("primary_color", "#4F46E5").lstrip("#")
        r, g, b = tuple(int(primary_hex[i:i+2], 16) for i in (0, 2, 4))
        
        # Rounded rectangle background
        draw.rounded_rectangle([20, 20, 492, 492], radius=110, fill=(r, g, b, 255))
        # Draw decorative circle
        draw.ellipse([140, 140, 372, 372], fill=(255, 255, 255, 40))
        
        img.save(out_p, format="PNG")
        return str(out_p)

    def process_app_icons(self, flutter_res_dir: str, source_icon_path: str = None) -> Dict[str, str]:
        """Resize base icon to all mipmap dimensions and copy into flutter android res folder."""
        if not source_icon_path or not os.path.exists(source_icon_path):
            fallback_path = self.base_dir / "build_output" / "temp_base_icon.png"
            source_icon_path = self.generate_default_icon(str(fallback_path))
            
        base_img = Image.open(source_icon_path).convert("RGBA")
        generated_icons = {}
        
        res_dir = Path(flutter_res_dir)
        res_dir.mkdir(parents=True, exist_ok=True)
        
        for folder, (width, height) in MIPMAP_RESOLUTIONS.items():
            resized = base_img.resize((width, height), Image.Resampling.LANCZOS)
            if folder == "playstore-icon":
                target_file = self.base_dir / "build_output" / "store_assets" / "icon_512.png"
            else:
                target_folder = res_dir / folder
                target_folder.mkdir(parents=True, exist_ok=True)
                target_file = target_folder / "ic_launcher.png"
                
            target_file.parent.mkdir(parents=True, exist_ok=True)
            resized.save(target_file, format="PNG")
            generated_icons[folder] = str(target_file)
            
        return generated_icons

    def bundle_content_data(self, assets_dir: str) -> str:
        """Bundle structured learning data into Flutter assets/data/content.json."""
        target_path = Path(assets_dir) / "data" / "content.json"
        target_path.parent.mkdir(parents=True, exist_ok=True)
        with open(target_path, "w", encoding="utf-8") as f:
            json.dump(self.config, f, ensure_ascii=False, indent=2)
        return str(target_path)

    async def generate_batch_audio(self, output_assets_dir: str) -> List[str]:
        """Generate audio MP3 for all terms and examples in config."""
        audio_dir = Path(output_assets_dir) / "audio"
        audio_dir.mkdir(parents=True, exist_ok=True)
        
        content = self.config.get("content_data", [])
        generated_files = []
        
        for item in content:
            term_id = item.get("id", "item")
            term_text = item.get("term", "")
            if term_text:
                out_term = audio_dir / f"{term_id}_term.mp3"
                await self.tts.generate_speech_async(term_text, str(out_term))
                generated_files.append(str(out_term))
                
            example_text = item.get("example_sentence", "")
            if example_text:
                out_ex = audio_dir / f"{term_id}_example.mp3"
                await self.tts.generate_speech_async(example_text, str(out_ex))
                generated_files.append(str(out_ex))
                
        return generated_files

    def generate_store_screenshots(self, output_dir: str) -> List[str]:
        """Synthesize 5 high-converting marketing screenshots for Google Play Store."""
        out_path = Path(output_dir)
        out_path.mkdir(parents=True, exist_ok=True)
        
        headlines = self.config.get("store_metadata", {}).get("screenshots_headlines", [
            "Master Korean Daily",
            "Native Audio Pronunciation",
            "Animated Stroke Order",
            "Smart Review Quizzes",
            "Track Your Learning Progress"
        ])
        
        content_data = self.config.get("content_data", [])
        theme = self.config.get("ui_theme", {})
        primary_color = theme.get("primary_color", "#4F46E5")
        
        generated_shots = []
        
        for idx, headline in enumerate(headlines[:5], start=1):
            target_file = out_path / f"screenshot_{idx}.png"
            
            img = Image.new("RGBA", (1080, 1920), color=(248, 250, 252, 255))
            draw = ImageDraw.Draw(img)
            
            # Header background gradient
            p_hex = primary_color.lstrip("#")
            pr, pg, pb = tuple(int(p_hex[i:i+2], 16) for i in (0, 2, 4))
            draw.rectangle([0, 0, 1080, 520], fill=(pr, pg, pb, 255))
            draw.rounded_rectangle([390, 80, 690, 140], radius=30, fill=(255, 255, 255, 60))
            
            # Device frame
            draw.rounded_rectangle([120, 420, 960, 1920], radius=60, fill=(24, 24, 27, 255))
            draw.rounded_rectangle([140, 460, 940, 1920], radius=44, fill=(255, 255, 255, 255))
            
            # Mock Card 1
            item = content_data[(idx - 1) % len(content_data)] if content_data else {"term": "한글", "meaning": "Hangul"}
            draw.rounded_rectangle([180, 560, 900, 880], radius=24, fill=(241, 245, 249, 255))
            # Mock Card 2
            draw.rounded_rectangle([180, 920, 900, 1400], radius=24, fill=(238, 242, 255, 255))
            
            img.save(target_file, format="PNG")
            generated_shots.append(str(target_file))
            
        return generated_shots

    def run_all(self, flutter_project_dir: str) -> Dict[str, Any]:
        """Execute full Asset Generation Pipeline."""
        flutter_dir = Path(flutter_project_dir)
        android_res_dir = flutter_dir / "android" / "app" / "src" / "main" / "res"
        assets_dir = flutter_dir / "assets"
        store_output_dir = self.base_dir / "build_output" / "store_assets"
        
        icons = self.process_app_icons(str(android_res_dir))
        content_path = self.bundle_content_data(str(assets_dir))
        
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        audio_files = loop.run_until_complete(self.generate_batch_audio(str(assets_dir)))
        
        screenshots = self.generate_store_screenshots(str(store_output_dir))
        
        return {
            "icons_count": len(icons),
            "content_data_bundled": content_path,
            "audio_files_count": len(audio_files),
            "screenshots_count": len(screenshots),
            "store_assets_dir": str(store_output_dir)
        }
