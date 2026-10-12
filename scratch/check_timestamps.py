import os
import glob
import datetime

# Check timestamps of all 960 files
files = sorted(glob.glob("assets/audio/epstopik/q_*.mp3"))
print(f"Total files: {len(files)}")

time_groups = {}
for f in files:
    mtime = datetime.datetime.fromtimestamp(os.path.getmtime(f)).strftime("%Y-%m-%d %H:%M")
    time_groups[mtime] = time_groups.get(mtime, 0) + 1

for t, c in sorted(time_groups.items()):
    print(f"Time {t}: {c} files")
