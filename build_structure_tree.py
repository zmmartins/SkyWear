from pathlib import Path

def generate_tree(dir_path, depth=0, script_filename=""):
    path = Path(dir_path)
    prefix = "-" * (depth * 2) + " " if depth > 0 else ""
    
    if path.is_dir():
        # Get the folder name
        folder_name = path.resolve().name if depth == 0 else path.name
        print(f"{prefix}{folder_name}/")
        
        try:
            # Sort contents: directories first, then files
            children = sorted(path.iterdir(), key=lambda x: (x.is_file(), x.name.lower()))
            
            for child in children:
                # 1. Ignore the python script itself
                if child.name == script_filename:
                    continue
                    
                # 2. Ignore hidden macOS .DS_Store files
                if child.name == ".DS_Store":
                    continue
                
                # 3. Filter root-level directories to only allow "public" and "src"
                if depth == 0 and child.is_dir() and child.name not in ["public", "src"]:
                    continue
                
                # Process the allowed children recursively
                generate_tree(child, depth + 1, script_filename)
                
        except PermissionError:
            print(f"{prefix}---- [Permission Denied]")
            
    else:
        # Print the file name
        print(f"{prefix}{path.name}")

# --- Run the script ---
if __name__ == "__main__":
    # Dynamically get the folder this script is currently placed in
    try:
        target_directory = Path(__file__).resolve().parent
        current_script_name = Path(__file__).name
    except NameError:
        target_directory = Path.cwd()
        current_script_name = ""
        
    generate_tree(target_directory, depth=0, script_filename=current_script_name)