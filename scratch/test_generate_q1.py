import asyncio
import os
import sys

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

sys.path.insert(0, os.path.abspath("scratch"))
import generate_cbt_official_audio as gen

async def test_q1():
    turns = [('male', '반장님, 오늘 작업은 몇 시까지 끝내면 됩니까?')]
    test_out = "assets/audio/epstopik/test_q0001.mp3"
    print("Generating test Q1...")
    ok = await gen._generate_audio_impl(1, turns, test_out)
    print("Success:", ok, "Size:", os.path.getsize(test_out) if os.path.exists(test_out) else 0)

asyncio.run(test_q1())
