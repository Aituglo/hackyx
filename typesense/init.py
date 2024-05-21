import typesense
from dotenv import load_dotenv
import os

load_dotenv()

client = typesense.Client({
  'nodes': [{
    'host': os.getenv("TYPESENSE_HOST"),
    'port': os.getenv("TYPESENSE_PORT"),      
    'protocol': os.getenv("TYPESENSE_PROTOCOL")   
  }],
  'api_key': os.getenv("TYPESENSE_API_KEY"),
  'connection_timeout_seconds': 2
})

contents_schema = {
  'name': 'contents',
  'fields': [
    {'name': 'title', 'type': 'string' },
    {'name': 'url', 'type': 'string' },
    {'name': 'description', 'type': 'string', 'optional': True },
    {'name': 'tags', 'type': 'string[]', 'optional': True },
    {'name': 'content', 'type': 'string'},
    {'name': 'program', 'type': 'string', 'optional': True },
    {'name': 'cve', 'type': 'string', 'optional': True },
    {'name': 'source', 'type': 'string', 'optional': True },
    {'name': 'cwe', 'type': 'string', 'optional': True }
  ]
}

print("Creating collection...")
try:
  client.collections.create(contents_schema)
  print("Collection created successfully")
except typesense.exceptions.ObjectAlreadyExists:
  print("Collection already exists")
except Exception as e:
  print(f"Failed to create collection: {e}")
  
api_key = client.keys.create({
  "description": "Search-only contents key.",
  "actions": ["documents:search", "collections:get"],
  "collections": ["contents"]
})
print(f"API Key: {api_key['value']}")