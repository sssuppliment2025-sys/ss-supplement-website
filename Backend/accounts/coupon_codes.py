"""Central place to manage checkout coupon codes."""

COUPON_DISCOUNT_RATE = 0.02
COUPON_FLAT_DISCOUNT = 20
COUPON_FLAT_DISCOUNT_THRESHOLD = 200

# Add or remove your custom coupon codes here.
VALID_COUPON_CODES = [
    "SUMAN20",
    "SUMIT20",
    "SOMNATH20",
    "SAYAN20",
    "DIS20",
    "PANDA20",
    "AVAIL202",
    "UPOLABDHI2",
    "WELCOME2",
    "OFFER20",
]


def normalize_coupon_code(value):
    return str(value or "").strip().upper()


def is_valid_coupon_code(value):
    normalized = normalize_coupon_code(value)
    valid_codes = {code.strip().upper() for code in VALID_COUPON_CODES if str(code).strip()}
    return bool(normalized) and normalized in valid_codes
