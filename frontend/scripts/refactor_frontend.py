import os
import re

src_dir = r"f:/ROOMFINDER/Flatmate_Pune/frontend/src/pages"

def replace_in_file(filename, old_str, new_str):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    if old_str in content:
        content = content.replace(old_str, new_str)
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)

def regex_replace(filename, pattern, replacement):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    new_content = re.sub(pattern, replacement, content)
    if content != new_content:
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(new_content)

def add_import(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    if "import api from" not in content and "localStorage" in content:
        content = re.sub(r"(import React.*?;\n)", r"\1import api from '@/api';\n", content, count=1)
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)

for root, _, files in os.walk(src_dir):
    for file in files:
        if file.endswith('.jsx'):
            path = os.path.join(root, file)
            # We don't want to mess up complex writers randomly, but we can fix exact readers safely
            pass

# That was too complex to hardcode a script without testing. I will instead just execute multi_replace tool.
