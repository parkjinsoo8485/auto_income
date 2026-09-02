import os
import re
import random
import string
import json
from pathlib import Path
from typing import Dict, Any, List

class SourceCodeMutator:
    """
    Sub-Agent 2: Source Code Mutation Agent
    - Replaces applicationId, package names, and app labels in AndroidManifest.xml and build.gradle
    - Modifies lib/theme.dart with custom primary/secondary colors and fonts
    - Injects random dummy wrapper widgets & dummy methods to ensure unique DEX bytecode signature.
    """
    def __init__(self, config_path: str, flutter_project_dir: str):
        self.flutter_dir = Path(flutter_project_dir)
        with open(config_path, "r", encoding="utf-8") as f:
            self.config = json.load(f)

    def _generate_random_dummy_code(self) -> str:
        """Generate unique Dart dummy classes and pure functions to alter bytecode signature."""
        rand_id = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
        class_name = f"AppOptimizerHelper_{rand_id}"
        return f"""
// Auto-generated structural obfuscation module {rand_id}
class {class_name} {{
  static int computeCacheKey_{rand_id}(int salt) {{
    int acc = {random.randint(100, 999)};
    for (int i = 0; i < {random.randint(5, 20)}; i++) {{
      acc = (acc * 31 + salt + i) & 0x7FFFFFFF;
    }}
    return acc;
  }}
}}
"""

    def mutate_android_identifiers(self) -> Dict[str, str]:
        """Update package name (applicationId) and app label in Android files."""
        app_id = self.config.get("app_info", {}).get("app_id", "com.example.myapp")
        app_name = self.config.get("app_info", {}).get("app_name", "Language App")
        version_code = self.config.get("app_info", {}).get("version_code", 1)
        version_name = self.config.get("app_info", {}).get("version_name", "1.0.0")

        results = {}

        # 1. Update android/app/build.gradle
        gradle_file = self.flutter_dir / "android" / "app" / "build.gradle"
        if gradle_file.exists():
            content = gradle_file.read_text(encoding="utf-8")
            content = re.sub(r'applicationId\s+["\'][^"\']+["\']', f'applicationId "{app_id}"', content)
            content = re.sub(r'versionCode\s+\d+', f'versionCode {version_code}', content)
            content = re.sub(r'versionName\s+["\'][^"\']+["\']', f'versionName "{version_name}"', content)
            gradle_file.write_text(content, encoding="utf-8")
            results["build.gradle"] = "updated"

        # 2. Update AndroidManifest.xml
        manifest_file = self.flutter_dir / "android" / "app" / "src" / "main" / "AndroidManifest.xml"
        if manifest_file.exists():
            content = manifest_file.read_text(encoding="utf-8")
            content = re.sub(r'android:label="[^"]*"', f'android:label="{app_name}"', content)
            manifest_file.write_text(content, encoding="utf-8")
            results["AndroidManifest.xml"] = "updated"

        # 3. Update strings.xml if exists
        strings_file = self.flutter_dir / "android" / "app" / "src" / "main" / "res" / "values" / "strings.xml"
        if strings_file.exists():
            content = strings_file.read_text(encoding="utf-8")
            content = re.sub(r'<string name="app_name">.*?</string>', f'<string name="app_name">{app_name}</string>', content)
            strings_file.write_text(content, encoding="utf-8")
            results["strings.xml"] = "updated"

        return results

    def mutate_theme(self) -> str:
        """Replace theme colors and styling in lib/theme.dart."""
        theme_file = self.flutter_dir / "lib" / "theme.dart"
        theme_file.parent.mkdir(parents=True, exist_ok=True)
        
        theme_cfg = self.config.get("ui_theme", {})
        p_color = theme_cfg.get("primary_color", "#4F46E5").replace("#", "0xFF")
        s_color = theme_cfg.get("secondary_color", "#EC4899").replace("#", "0xFF")
        bg_color = theme_cfg.get("background_color", "#F8FAFC").replace("#", "0xFF")
        
        layout_mode = theme_cfg.get("layout_mode", "grid")

        content = f"""// Auto-Generated Theme Configuration
import 'package:flutter/material.dart';

class AppTheme {{
  static const Color primaryColor = Color({p_color});
  static const Color secondaryColor = Color({s_color});
  static const Color backgroundColor = Color({bg_color});
  static const String layoutMode = '{layout_mode}';

  static ThemeData get lightTheme => ThemeData(
    primaryColor: primaryColor,
    scaffoldBackgroundColor: backgroundColor,
    colorScheme: ColorScheme.light(
      primary: primaryColor,
      secondary: secondaryColor,
    ),
  );
}}
"""
        theme_file.write_text(content, encoding="utf-8")
        return str(theme_file)

    def inject_ast_dummy_mutations(self) -> int:
        """
        Inject random clean dummy methods and classes across all Dart files in lib/.
        """
        lib_dir = self.flutter_dir / "lib"
        if not lib_dir.exists():
            return 0

        mutated_files = 0
        for dart_file in lib_dir.rglob("*.dart"):
            if dart_file.name in ["theme.dart"]:
                continue
            
            content = dart_file.read_text(encoding="utf-8")
            # Strip previous generated helper classes
            content = re.sub(r'// Auto-generated structural obfuscation module.*?(?=\n\n|$)', '', content, flags=re.DOTALL)
            
            dummy_code = self._generate_random_dummy_code()
            content = content.strip() + "\n" + dummy_code
            
            dart_file.write_text(content, encoding="utf-8")
            mutated_files += 1

        return mutated_files

    def run_all(self) -> Dict[str, Any]:
        """Execute complete Source Code Mutation."""
        id_results = self.mutate_android_identifiers()
        theme_path = self.mutate_theme()
        mutated_count = self.inject_ast_dummy_mutations()

        return {
            "android_identifiers": id_results,
            "theme_file": theme_path,
            "mutated_dart_files_count": mutated_count
        }
