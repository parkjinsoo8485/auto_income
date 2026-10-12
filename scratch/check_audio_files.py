import os
import glob
import datetime

files = sorted(glob.glob("assets/audio/epstopik/q_*.mp3"))
print(f"Total q_*.mp3 files: {len(files)}")
print("First 25 files with size and mtime:")
for f in files[:25]:
    st = os.stat(f)
    mtime = datetime.datetime.fromtimestamp(st.st_mtime).strftime("%Y-%m-%d %H:%M:%S")
    print(f"  {os.path.basename(f)}: size={st.st_size:,} bytes, mtime={mtime}")
