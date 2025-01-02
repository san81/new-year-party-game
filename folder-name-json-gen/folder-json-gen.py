import os
import json

def create_folder_structure_javascript(folder_path):
  """
  Creates a JavaScript file representing the folder structure.

  Args:
    folder_path: Path to the root folder.
  """

  folder_structure = {}

  for root, dirs, files in os.walk(folder_path):
    rel_path = os.path.relpath(root, folder_path) 
    if rel_path == ".":  # Skip the root folder itself
      continue

    folder_structure[rel_path] = files

  with open(folder_path+"/../scripts/folderStructure.js", "w") as f:
    f.write("const originalJsonData = ")
    json.dump(folder_structure, f, indent=4)
    f.write(";")

if __name__ == "__main__":
  # "/Users/santhoshgandhe/github/new-year-party-game/NewYearParty/items"
  folder_name = input("Enter the folder path: ")
  create_folder_structure_javascript(folder_name)
  print("Folder structure saved to folder_structure.js")