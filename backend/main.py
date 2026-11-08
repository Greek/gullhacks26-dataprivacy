import json
import secrets
from strength import analyze_password

# Load the substitution dictionary and word list directly at startup
with open("substitutions.json", "r", encoding="utf-8") as file:
    SUBSTITUTIONS = json.load(file)

with open("english.txt", "r", encoding="utf-8") as file:
    WORD_LIST = [line.strip() for line in file.read().splitlines() if line.strip()]


def generate_random_string(word_list, length):
    """
    Generates a random string of words separated by a random 1-digit number,
    with the first letter of the first word capitalized. If the next word exceeds
    the target length, the remaining space is filled with random numbers.

    Args:
        word_list (list): List of candidate words to choose from.
        length (int): The exact desired character length of the generated password.

    Returns:
        str: A randomly generated base password string of the specified length.
    """
    password = ""

    while len(password) < length:
        if password:
            # Prepare a 1-digit number (0-9) plus the next random word
            next_chunk = str(secrets.randbelow(10)) + secrets.choice(word_list)
        else:
            # Capitalize the first letter of the first word only
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
    while keeping all other characters and numbers intact.

    Args:
        password (str): The original password string to modify.
        subs_dict (dict): Dictionary mapping letters to lists of replacement characters.

    Returns:
        str: The modified password with substituted characters.
    """
    modified_chars = []

    for char in password:
        lower_char = char.lower()

        # If the character is in the JSON dictionary, replace it with a random choice
        if lower_char in subs_dict and subs_dict[lower_char]:
            replacement = secrets.choice(subs_dict[lower_char])
            modified_chars.append(replacement)
        else:
            # Keep the original letter or number if it is not in the dictionary
            modified_chars.append(char)

    return password[0] + "".join(modified_chars[1:])

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

def create_password(length: int = 8, use_special_chars: bool = False):
    password = generate_random_string(WORD_LIST, length)

  # NEW: Apply random capitalization
    password = random_capitalization(password)

    if use_special_chars:
        return password, add_special_characters(password, SUBSTITUTIONS)
    else:
        return password, password

def create_password_with_analysis(length: int = 8, use_special_chars: bool = False):
    original, modified = create_password(length, use_special_chars)

    return {
        "original": original,
        "modified": modified,
        "analysis": analyze_password(modified)
    }