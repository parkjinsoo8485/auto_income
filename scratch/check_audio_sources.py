import os
import glob
import subprocess
import json

# Check temp_official_hrd and official_full_sets
print("--- checking temp_official_hrd ---")
if os.path.exists("assets/audio/temp_official_hrd"):
    for root, dirs, files in os.walk("assets/audio/temp_official_hrd"):
        for f in files:
            print("temp_official_hrd:", f, os.path.getsize(os.path.join(root, f)))
else:
    print("assets/audio/temp_official_hrd does not exist")

print("\n--- checking official_full_sets ---")
if os.path.exists("assets/audio/epstopik/official_full_sets"):
    for f in os.listdir("assets/audio/epstopik/official_full_sets"):
        print("full_set:", f, os.path.getsize(os.path.join("assets/audio/epstopik/official_full_sets", f)))

# Check file sizes of q_0001 to q_0030
print("\n--- checking q_0001 ~ q_0025 in epstopik ---")
for i in range(1, 25):
    p = f"assets/audio/epstopik/q_{i:04d}.mp3"
    if os.path.exists(p):
        print(f"q_{i:04d}.mp3: size={os.path.getsize(p)}")
