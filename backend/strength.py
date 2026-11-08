def analyze_password(password):
    """
    Analyzes the actual generated password based on length and special characters:
    - 0 to 11 (< 12): Weak
    - 12 to 15: Moderate (with special chars) / Weak (without special chars)
    - 16 to 19: Strong (with special chars) / Moderate (without special chars)
    - 20+: Very Strong (with special chars) / Strong (without special chars)
    Returns a dictionary containing the strength assessment.
    """

    length = len(password)

    has_uppercase = any(c.isupper() for c in password)
    has_lowercase = any(c.islower() for c in password)
    has_number = any(c.isdigit() for c in password)
    has_special = any(not c.isalnum() for c in password)

    if length < 12:
        strength = "Weak"
        score = 1
    elif length < 16:
        if has_special:
            strength = "Moderate"
            score = 2
        else:
            strength = "Weak"
            score = 1
    elif length < 20:
        if has_special:
            strength = "Strong"
            score = 3
        else:
            strength = "Moderate"
            score = 2
    else:
        if has_special:
            strength = "Very Strong"
            score = 4
        else:
            strength = "Strong"
            score = 3

    return {
        "password": password,
        "length": length,
        "score": score,
        "max_score": 4,
        "strength": strength,
        "uppercase": has_uppercase,
        "lowercase": has_lowercase,
        "numbers": has_number,
        "special_characters": has_special,
    }