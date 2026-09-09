import math

# Test the smart badge de-overlap and the new Type 5 slot configuration
def get_type5_slot(jamo, role):
    if role == 'cho':
        return {'x': 42, 'y': 14, 'w': 116, 'h': 62}
    elif role == 'jung':
        return {'x': 26, 'y': 80, 'w': 148, 'h': 46}
    elif role == 'jong':
        return {'x': 38, 'y': 126, 'w': 124, 'h': 62}

print("Type 5 configuration ready.")
