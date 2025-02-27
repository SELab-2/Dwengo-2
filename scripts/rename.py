import os

def snake_to_camel(snake_str):
    """
    Convert a snake_case string to camelCase.
    """
    parts = snake_str.split('_')
    return parts[0] + ''.join(word.capitalize() for word in parts[1:])

def rename_files_in_directory(directory):
    """
    Recursively rename TypeScript files from snake_case to camelCase.
    """
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith(".ts"):
                new_name = snake_to_camel(file)
                if new_name != file:
                    old_path = os.path.join(root, file)
                    new_path = os.path.join(root, new_name)
                    os.rename(old_path, new_path)
                    print(f"Renamed: {file} -> {new_name}")

backend_src_path = "backend/src"
rename_files_in_directory(backend_src_path)
