import typesense
import json
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

count = client.collections['contents'].retrieve()['num_documents']
print("Updating...")
for i in range(count):
    try:
        document = client.collections['contents'].documents[str(i)].retrieve()
        if "https://hackerone.com" in document.get('url'):
          tags = document.get('tags')
          if len(tags) == 4:
            update = {
              'tags': ['Bug Bounty', tags[3]],
              'program': tags[2],
              'cwe': tags[3],
              'source': "HackerOne"
            }
            print("Updating document ", document.get('url'))
            client.collections['contents'].documents[str(i)].update(update)
    except Exception as e:
        print(f"Failed to update document {i}: {e}")
