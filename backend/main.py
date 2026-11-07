import json
import secrets

# Characters that can be placed between words
WORD_SEPARATORS = "-_!@#$%&*?0123456789"


def load_substitutions(filepath="subsitutions.json"):
    """
    Loads the character substitution dictionary from a JSON file.

    Args:
        filepath (str): Path to the JSON file containing character mappings.

    Returns:
        dict: A dictionary mapping characters to lists of replacement strings.
    """
    with open(filepath, "r", encoding="utf-8") as file:
        return json.load(file)


def load_wordlist(filepath="english.txt"):
    """
    Loads a list of words from a text file, stripping whitespace and empty lines.

    Args:
        filepath (str): Path to the wordlist text file.

    Returns:
        list: A list of clean words.
    """
    with open(filepath, "r", encoding="utf-8") as file:
        return [line.strip() for line in file.read().splitlines() if line.strip()]


def generate_random_string(word_list, length, separators=WORD_SEPARATORS):
    """
    Generates a random string of words separated by a random character,
    trimmed to a specific target length.

    Args:
        word_list (list): List of candidate words to choose from.
        length (int): The exact desired character length of the generated password.
        separators (str): Pool of characters to randomly insert between words.

    Returns:
        str: A randomly generated base password string of the specified length.
    """
    password = ""

    while len(password) < length:
        # If there is already a word in the password, add a random separator first
        if password:
            password += secrets.choice(separators)

        # Append a random word from the word list
        password += secrets.choice(word_list)

    # Trim the password to match the exact requested length
    return password[:length]


def add_special_characters(password, subs_dict):
    """
    Replaces characters in the password using the substitution dictionary.

    Args:
        password (str): The original password string to modify.
        subs_dict (dict): Dictionary mapping letters to lists of replacement characters.

    Returns:
        str: The modified password with substituted characters.
    """
    modified_chars = []

    for char in password:
        lower_char = char.lower()

        if lower_char in subs_dict and subs_dict[lower_char]:
            replacement = secrets.choice(subs_dict[lower_char])
            modified_chars.append(replacement)
        else:
            modified_chars.append(char)

    return "".join(modified_chars)


# Load files once at module startup so the server doesn't re-read disk on every request
SUBSTITUTIONS = load_substitutions("subsitutions.json")
WORD_LIST = load_wordlist("english.txt")


def create_password(length=16, use_special_chars=False):
    """
    Main entry point for the backend server to generate a password.

    Args:
        length (int): Desired password length.
        use_special_chars (bool): If True, applies letter-to-symbol substitutions.

    Returns:
        str: The final generated password.
    """
    base_password = generate_random_string(WORD_LIST, length)

    if use_special_chars:
        return add_special_characters(base_password, SUBSTITUTIONS)

    return base_password


if __name__ == "__main__":
    # Local test block: only runs when executing `python generator.py` directly
    print("Without replacements:", create_password(length=18, use_special_chars=False))
    print("With replacements:   ", create_password(length=18, use_special_chars=True))