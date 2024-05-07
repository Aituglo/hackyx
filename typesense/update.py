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

update_schema = {
  'fields': [
    {'name': 'program', 'type': 'string', 'optional': True },
    {'name': 'cve', 'type': 'string[]', 'optional': True },
    {'name': 'source', 'type': 'string', 'optional': True },
    {'name': 'cwe', 'type': 'string', 'optional': True }
  ]
}


client.collections['contents'].update(update_schema)