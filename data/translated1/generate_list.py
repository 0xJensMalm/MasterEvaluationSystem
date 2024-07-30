import os
import json

def main():
    # Get the current directory
    current_directory = os.path.dirname(os.path.abspath(__file__))
    print(f"Current directory: {current_directory}")

    # Get the list of all files in the current directory
    files = [f for f in os.listdir(current_directory) if os.path.isfile(os.path.join(current_directory, f))]
    print(f"Files found: {files}")

    # Sort the file list
    file_list = sorted(files)
    print(f"Sorted file list: {file_list}")

    # Path to the list.json file
    json_file_path = os.path.join(current_directory, 'list.json')
    print(f"JSON file will be saved to: {json_file_path}")

    # Export the list to a JSON file
    with open(json_file_path, 'w', encoding='utf-8') as json_file:
        json.dump(file_list, json_file, ensure_ascii=False, indent=4)

    print("The list has been saved to list.json")

if __name__ == "__main__":
    main()
