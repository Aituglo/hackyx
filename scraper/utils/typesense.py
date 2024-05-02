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

def add_document_to_typesense(content):
    # Assume 'url' as the field name where the content's url is stored
    search_parameters = {
        "q": content['url'], 
        "query_by": "url",
        "filter_by": "url:="+content['url'],  
        "sort_by": ""
    }

    results = client.collections['contents'].documents.search(search_parameters)

    if len(results['hits']) > 0:  
        print("Document with the same url already exists")
    else:
        try:
            client.collections['contents'].documents.create(content)
            with open('content/already_added.txt', 'a') as file:
                file.write(f"{content['url']}\n")
            print("Document added successfully")
        except Exception as e:
            print(f"Failed to add document: {e}")
