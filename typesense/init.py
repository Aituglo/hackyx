import typesense

client = typesense.Client({
  'nodes': [{
    'host': 'localhost',
    'port': '8108',      
    'protocol': 'http'   
  }],
  'api_key': 'test',
  'connection_timeout_seconds': 2
})

contents_schema = {
  'name': 'contents',
  'fields': [
    {'name': 'title', 'type': 'string' },
    {'name': 'url', 'type': 'string' },
    {'name': 'description', 'type': 'string', 'optional': True },
    {'name': 'authors', 'type': 'string[]', 'optional': True },
    {'name': 'tags', 'type': 'string[]', 'optional': True },
    {'name': 'content', 'type': 'string'},
    {'name': 'date', 'type': 'string', 'optional': True }
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