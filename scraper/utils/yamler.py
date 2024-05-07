import yaml
import os

def write_yaml(new_content):
    # Define the new content to be added example
    """
    new_content = {
        'title': 'Titre',
        'description': 'Description',
        'url': 'http://url.com',
        'program': 'xxx',
        'cve': 'CVE-XXXX-XXXXX',
        'source': 'platforme', 
        'cwe': 'CWE-XX: xxx',
        'tags': ['tag3', 'tag4']
    }
    """ 

    # File to read and write
    filename = 'content/to_add.yml'

   # Check if the file exists
    if os.path.exists(filename):
        # File exists, read the existing data
        with open(filename, 'r') as file:
            data = yaml.safe_load(file) or {}  # Use safe_load to load the YAML, ensure it's not None
    else:
        # File does not exist, initialize an empty dictionary
        data = {}
    
    # Check if the 'contents' key exists, and if not, create it
    if 'contents' not in data:
        data['contents'] = []

    # Append the new content
    data['contents'].append(new_content)

    # Write the updated data back to the YAML file
    with open(filename, 'w') as file:
        yaml.safe_dump(data, file, allow_unicode=True)

    print(f'Updated data has been written to {filename}')
