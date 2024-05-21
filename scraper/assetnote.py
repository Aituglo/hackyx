import re
import requests
from bs4 import BeautifulSoup
from readabilipy import simple_json_from_html_string

from scraper.utils.vuln_type import extract_cve_numbers, identify_vulnerability_type

# RSS Url
rss_url = "https://www.assetnote.io/resources/research/rss.xml"

# Get and parse the RSS file
def get_article_links(rss_url):
    response = requests.get(rss_url)
    soup = BeautifulSoup(response.content, features="xml")
    items = soup.findAll('item')
    articles = [
        {
            "title": item.title.text,
            "link": item.link.text,
            "description": item.description.text,
            "source": "Assetnote.io",
            "program": "Blog"
        }
        for item in items if "Advisory" not in item.title.text
    ]
    return articles

# Get the content of article with Readability
def get_article_content(url):
    print(f"Indexing {url}")
    response = requests.get(url)
    doc = simple_json_from_html_string(response.text, use_readability=True)
    return doc['title'], doc['content']

if __name__=='__main__':

    # Extract information from articles
    articles = get_article_links(rss_url)

    for article in articles:
        title, content = get_article_content(article["link"])
        cve_numbers = extract_cve_numbers(title, content)
        vuln_type = identify_vulnerability_type(title, content)
        article.update({
            'content': content,
            'cve_numbers': f"{', '.join(cve_numbers)}",
            'tags': ['Research', vuln_type]
        })

    # Debug
    for article in articles:
        print(f"Title: {article['title']}")
        print(f"Description: {article['description']}")
        print(f"CVE Numbers: {article['cve_numbers']}")
        print(f"Tags: {', '.join(article['tags'])}")
        print(f"Content: {article['content'][:500]}...")  # Affiche les 500 premiers caractères du contenu
        print("=" * 80)
