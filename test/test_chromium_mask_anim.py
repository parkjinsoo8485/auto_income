import os
import subprocess
from PIL import Image
import numpy as np

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
test_url = "file:///" + os.path.abspath("test/test_mask_gwen.html").replace("\\", "/")

# Let's take screenshots at different virtual-time-budget: 500ms, 1500ms, 2500ms, 4000ms
budgets = [500, 1500, 2500, 4000]
for b in budgets:
    out = os.path.abspath(f"test/anim_{b}ms.png")
    subprocess.run([edge_path, "--headless", "--disable-gpu", f"--virtual-time-budget={b}", f"--screenshot={out}", "--window-size=300,300", test_url])
    im = Image.open(out).convert('RGB')
    arr = np.array(im)
    purple_px = (arr[:, :, 2] > 180) & (arr[:, :, 0] > 100)
    print(f"Budget {b}ms: purple pixels = {purple_px.sum()}")
