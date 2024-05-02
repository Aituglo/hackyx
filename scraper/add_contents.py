import yaml
from utils.scraper import capture_web_content
from utils.typesense import add_document_to_typesense

with open('content/to_add.yml', 'r') as file:
    data = yaml.safe_load(file)
    
if data and data['contents'] and len(data['contents']) > 0:
  print("Adding contents...")
  new_data = data['contents'].copy()
  
  for element in data['contents']:
      title = element['title']
      description = element['description']
      url = element['url']
      tags = element['tags']
      
      _, content = capture_web_content(url)
      
      if content and content != "":
          add_document_to_typesense({
              'title': title,
              'description': description,
              'url': url,
              'tags': tags,
              'content': content
          })
          new_data.remove(element)
      
  with open('content/to_add.yml', 'w') as file:
    yaml.safe_dump({'contents': new_data}, file)
else:
    print("No contents to add")