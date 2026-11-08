import json
import secrets

# Load the substitution dictionary and word list directly at startup
with open("substitutions.json", "r", encoding="utf-8") as file:
    SUBSTITUTIONS = json.load(file)

with open("english.txt", "r", encoding="utf-8") as file:
    WORD_LIST = [line.strip() for line in file.read().splitlines() if line.strip()]


def generate_random_string(word_list, length):
    """
    Generates a random string of words separated by a dash (-),
    trimmed to a specific target length.

    Args:
        word_list (list): List of candidate words to choose from.
        length (int): The exact desired character length of the generated password.

    Returns:
        str: A randomly generated base password string of the specified length.
    """
    password = ""

    while len(password) < length:
        # Add a dash between words once the first word is in place
        if password:
            password += "-"

        password += secrets.choice(word_list)

    # Trim the password to match the exact requested length
    return password[:length]


def add_special_characters(password, subs_dict):
    """
    Replaces matching characters in the password using the substitution dictionary
    while keeping all other characters and dashes intact.

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
            # Keep the original letter or dash if it is not in the dictionary
            modified_chars.append(char)

    return "".join(modified_chars)


def create_password(length: int = 8, use_special_chars: bool = False):
    password = generate_random_string(WORD_LIST, length)

    if use_special_chars:
        return password, add_special_characters(password, SUBSTITUTIONS)
    else:
        return password, password
