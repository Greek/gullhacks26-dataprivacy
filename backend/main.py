import secrets
import json


lines = ""
with open("subsitutions.json", "r") as file:
    substitutions = json.load(file)


with open("english.txt", "r") as file:
    lines = file.read().splitlines()

list_of_words = [""]
list_of_words.extend(lines)

num = secrets.randbelow(len(list_of_words))



def generate_password(word_list, length):
    password = ""
    while len(password) < length:
        password += word_list[secrets.randbelow(len(word_list))]
    if len(password) > length:
        password = password[:length]
    return password

print(len(list_of_words))

print(generate_password(list_of_words, 20))












        
        


