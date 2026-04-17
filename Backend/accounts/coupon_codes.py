"""Central place to manage checkout coupon codes."""

COUPON_DISCOUNT_RATE = 0.02

# Add or remove your custom coupon codes here.
VALID_COUPON_CODES = [
    "TMG2",
    "RHC2",
    "GTW2",
    "GKM2",
    "GUG2",
    "OLG2",
    "LFG2",
    "UPOLABDHI2",
    "WELCOME2",
]


def normalize_coupon_code(value):
    return str(value or "").strip().upper()


def is_valid_coupon_code(value):
    normalized = normalize_coupon_code(value)
    valid_codes = {code.strip().upper() for code in VALID_COUPON_CODES if str(code).strip()}
    return bool(normalized) and normalized in valid_codes
