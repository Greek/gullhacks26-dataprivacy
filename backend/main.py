import json
from pathlib import Path
import secrets
from strength import analyze_password

BASE_DIR = Path(__file__).resolve().parent

# Load the substitution dictionary and word list directly at startup
with open(BASE_DIR / "substitutions.json", "r", encoding="utf-8") as file:
    SUBSTITUTIONS = json.load(file)

with open(BASE_DIR / "english.txt", "r", encoding="utf-8") as file:
    WORD_LIST = [line.strip() for line in file.read().splitlines() if line.strip()]


def generate_random_string(word_list, length):
    """
    Generates a random string of words separated by a random 1-digit number,
    with each word in Title Case. If the next word exceeds
    the target length, the remaining space is filled with random numbers.

    Args:
        word_list (list): List of candidate words to choose from.
        length (int): The exact desired character length of the generated password.

    Returns:
        str: A randomly generated base password string of the specified length in Title Case.
    """
    password = ""

    while len(password) < length:
        if password:
            # Prepare a 1-digit number (0-9) plus the next random word in Title Case
            next_chunk = str(secrets.randbelow(10)) + secrets.choice(word_list).capitalize()
        else:
            # Capitalize the first letter of the first word
            next_chunk = secrets.choice(word_list).capitalize()

        # Check if adding the next word exceeds the desired length
        if len(password) + len(next_chunk) > length:
            # Fill the remaining spots with random digits
            while len(password) < length:
                password += str(secrets.randbelow(10))
        else:
            password += next_chunk

    return password


def add_special_characters(password, subs_dict):
    """
    Replaces matching characters in the password using the substitution dictionary
    while keeping all other characters, letter casing, and numbers intact.

    Args:
        password (str): The original password string to modify.
        subs_dict (dict): Dictionary mapping letters to lists of replacement characters.

    Returns:
        str: The modified password with substituted characters.
    """
    if not password:
        return password

    modified_chars = [password[0]]

    for char in password[1:]:
        lower_char = char.lower()

        # If the character is in the JSON dictionary, replace it with a random choice
        if lower_char in subs_dict and subs_dict[lower_char]:
            replacement = secrets.choice(subs_dict[lower_char])
            if replacement.isalpha() and char.isupper():
                replacement = replacement.upper()
            modified_chars.append(replacement)
        else:
            # Keep the original letter or number if it is not in the dictionary
            modified_chars.append(char)

    # Guarantee at least one non-alphanumeric special character when requested
    if not any(not c.isalnum() for c in modified_chars):
        symbol_positions = [
            idx
            for idx in range(1, len(password))
            if password[idx].lower() in subs_dict
            and any(not s.isalnum() for s in subs_dict[password[idx].lower()])
        ]
        if symbol_positions:
            chosen_idx = secrets.choice(symbol_positions)
            symbol_choices = [
                s
                for s in subs_dict[password[chosen_idx].lower()]
                if not s.isalnum()
            ]
            modified_chars[chosen_idx] = secrets.choice(symbol_choices)
        else:
            fallback_symbols = [
                s
                for options in subs_dict.values()
                for s in options
                if not s.isalnum()
            ] or ["!", "@", "*", "&"]
            modified_chars[-1] = secrets.choice(fallback_symbols)

    return "".join(modified_chars)


def random_capitalization(password):
    """
    Randomly capitalizes each letter in the password.
    Numbers and special characters remain unchanged.
    """
    result = []
    for char in password:
        if char.isalpha():
            if secrets.randbelow(2) == 1:
                result.append(char.upper())
            else:
                result.append(char.lower())
        else:
            result.append(char)
    return "".join(result)


def apply_capitalization(password: str, capitalization: str = "title") -> str:
    """
    Applies the selected capitalization style to the password:
    - 'title': Title Case (first letter of each word capitalized)
    - 'random': Random capitalization per letter
    - 'lower': All lowercase letters
    - 'upper' / 'full': All uppercase letters
    """
    mode = (capitalization or "title").lower()
    if mode == "random":
        return random_capitalization(password)
    if mode == "lower":
        return password.lower()
    if mode in ("upper", "full"):
        return password.upper()
    return password.title()


def create_password(
    length: int = 8,
    use_special_chars: bool = False,
    capitalization: str = "title",
):
    base_password = generate_random_string(WORD_LIST, length)
    memorable_title_password = base_password.title()
    cased_password = apply_capitalization(base_password, capitalization)

    if use_special_chars:
        final_password = add_special_characters(cased_password, SUBSTITUTIONS)
    else:
        final_password = cased_password

    # First return: generated password; Second return: Title Case memorable string
    return final_password, memorable_title_password


def create_password_with_analysis(
    length: int = 8,
    use_special_chars: bool = False,
    capitalization: str = "title",
):
    modified, original = create_password(length, use_special_chars, capitalization)

    return {
        "original": original,
        "modified": modified,
        "analysis": analyze_password(modified),
    }