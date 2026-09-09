# Test script to verify the new Type 6 jongseong slot position
import math

# Current
x_curr = 26 + 0.14 * 148
x_end_curr = 26 + 0.86 * 148
print(f"Current: ㄴ start = {x_curr:.1f}, end = {x_end_curr:.1f}, center = {(x_curr+x_end_curr)/2:.1f}")

# Proposed
x_prop = 34 + 0.14 * 144
x_end_prop = 34 + 0.86 * 144
print(f"Proposed: ㄴ start = {x_prop:.1f}, end = {x_end_prop:.1f}, center = {(x_prop+x_end_prop)/2:.1f}")
