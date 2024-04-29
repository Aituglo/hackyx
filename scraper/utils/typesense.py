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

def add_document_to_typesense(content):
    try:
        client.collections['contents'].documents.create(content)
        print("Document added successfully")
    except Exception as e:
        print(f"Failed to add document: {e}")