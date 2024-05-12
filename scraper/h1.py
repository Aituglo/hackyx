from utils.h1_scraper import capture_web_content
from utils.typesense import add_document_to_typesense
import sys

print(f"Scraping {sys.argv[1]}")
content = capture_web_content(sys.argv[1])
