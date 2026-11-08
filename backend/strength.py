def analyze_password(password):
    """
    Analyzes a password using length and special character rules:
    - Below 12 characters: Weak (regardless of character types)
    - 12 to 15 characters: Medium
    - 16+ characters without special characters (letters/numbers only): Medium
    - 16+ characters with special characters: Strong
    Returns a dictionary containing the strength assessment.
    """

    length = len(password)

    has_uppercase = any(c.isupper() for c in password)
    has_lowercase = any(c.islower() for c in password)
    has_number = any(c.isdigit() for c in password)
    has_special = any(not c.isalnum() for c in password)

    feedback = []

    if length < 12:
        strength = "Weak"
        score = 1
        explanation = (
            "Below 12 characters is weak regardless of complexity. "
            "Use at least 16 characters with special characters to make it secure."
        )
        feedback.append("Use at least 16 characters.")
        if not has_special:
            feedback.append("Include special characters.")
    elif length < 16:
        strength = "Medium"
        score = 2
        explanation = (
            "Between 12 and 15 characters provides medium security. "
            "Use at least 16 characters with special characters to make it secure."
        )
        feedback.append("Increase length to at least 16 characters.")
        if not has_special:
            feedback.append("Include special characters.")
    elif not has_special:
        strength = "Medium"
        score = 2
        explanation = (
            "16+ characters with only letters and numbers provides medium security. "
            "Enable special characters to make it secure."
        )
        feedback.append("Include special characters for strong security.")
    else:
        strength = "Strong"
        score = 3
        explanation = (
            "Secure! At least 16 characters including letters, numbers, and special characters."
        )

    return {
        "password": password,
        "length": length,
        "score": score,
        "max_score": 3,
        "strength": strength,
        "explanation": explanation,
        "uppercase": has_uppercase,
        "lowercase": has_lowercase,
        "numbers": has_number,
        "special_characters": has_special,
        "feedback": feedback,
    }