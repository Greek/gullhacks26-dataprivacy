import math
import re


def analyze_password(password):
    """
    Analyzes a password using length, character diversity,
    and common-password patterns.
    Returns a dictionary containing the strength assessment.
    """
 
    length = len(password)

    has_uppercase = any(c.isupper() for c in password)
    has_lowercase = any(c.islower() for c in password)
    has_number = any(c.isdigit() for c in password)
    has_special = any(not c.isalnum() for c in password)

    score = 0
    feedback = []

    # Length scoring
    if length >= 16:
        score += 4
    elif length >= 12:
        score += 3
    elif length >= 8:
        score += 2
    else:
        score += 1
        feedback.append("Use at least 12 characters.")

    # Character diversity
    if has_uppercase:
        score += 1

    if has_lowercase:
        score += 1

    if has_number:
        score += 1

    if has_special:
        score += 1
    else:
        feedback.append("Consider adding special characters.")

    # Detect repeated characters
    if re.search(r"(.)\1{2,}", password):
        score -= 2
        feedback.append("Avoid repeating the same character.")

    # Detect common patterns
    common_patterns = [
        "password",
        "123456",
        "qwerty",
        "admin",
        "letmein",
    ]

    if any(pattern in password.lower() for pattern in common_patterns):
        score -= 3
        feedback.append("Avoid common password patterns.")

    # Strength classification
    if score <= 3:
        strength = "Weak"
    elif score <= 5:
        strength = "Moderate"
    elif score <= 7:
        strength = "Strong"
    else:
        strength = "Very Strong"

    return {
        "password": password,
        "length": length,
        "score": max(0, score),
        "strength": strength,
        "uppercase": has_uppercase,
        "lowercase": has_lowercase,
        "numbers": has_number,
        "special_characters": has_special,
        "feedback": feedback,
    }