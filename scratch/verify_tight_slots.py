# Verify that slots do not overlap with 30% reduced spacing
import math

def check_overlap(box1, box2):
    # box: (x1, y1, x2, y2)
    x_overlap = max(0, min(box1[2], box2[2]) - max(box1[0], box2[0]))
    y_overlap = max(0, min(box1[3], box2[3]) - max(box1[1], box2[1]))
    return x_overlap > 0 and y_overlap > 0

print("Verification helper ready.")
