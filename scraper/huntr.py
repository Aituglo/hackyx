#!/usr/bin/env python3
from utils.yamler import write_yaml
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from dateutil import parser
from utils.typesense import add_document_to_typesense
import time
from urllib.parse import urlparse
from bs4 import BeautifulSoup
from utils.souper import souper

def get_last_date(soup):
    rows = soup.find_all("tr")
    dates = []
    if not rows:
        return  
    for row in rows[1:]:
        tds = row.find_all('td')
        for td in tds:
            dates.append(td.find_all('span')[0].text)
            
    parsed_dates = [parse_date(date) for date in dates]
    min_date = min(parsed_dates)
    print("Last hacktivity retrieve:", min_date.strftime('%B %d, %Y'))
    return min_date

def parse_html(html):
    reports = []
    soup = BeautifulSoup(html, 'html.parser')
    reports_link = soup.find_all('a', id='report-link')
    
    for r in reports_link:
        reports.append({"link":r['href'], "title":r.get_text() })

    return reports

def parse_date(date_str):
    # Replace suffixes to create a date format that can be parsed
    date_str = (date_str.replace('st', '')
                        .replace('nd', '')
                        .replace('rd', '')
                        .replace('th', ''))
    return parser.parse(date_str)

def get_chrome_driver():
    options = Options()
    options.add_argument("--headless")

    webdriver_service = Service(ChromeDriverManager().install())

    return webdriver.Chrome(service=webdriver_service, options=options)

def parse_hacktivity():
    url = f"https://huntr.com/bounties/hacktivity"

    driver = get_chrome_driver()
    try:
        driver.get(url)
        
        time.sleep(3)

        last_date = ''
        
        while driver.find_element(By.ID,'show-more-button'):
            driver.find_element(By.ID,'show-more-button').click()
            html = driver.page_source
            soup = BeautifulSoup(html, 'html.parser')
            date = get_last_date(soup)

            if date == last_date:
                break
            else:
                last_date = date
            time.sleep(3)
        driver.quit()
        return parse_html(html)
        
    except Exception as e:
        print("An error has occured:  ", e)
        driver.quit()
        return None

def parse_report(url, title):
    driver = get_chrome_driver()
    try:
        driver.get(url)
        time.sleep(3)

        html = driver.page_source
        soup = BeautifulSoup(html, 'html.parser')

        # program
        program = soup.find(id='title').find('a').text
        infos = soup.find(id='actions-and-stats')
        links = infos.find_all('a')
        cve = None
        cwe = None
        for link in links:
            if 'CVE' in link.text:
                cve = link.text
            if 'CWE' in link.text:
                cwe = link.text
        body = soup.find('div', class_='markdown-body')
        content = body.text
        description = None
        for element in body.descendants:
            if element.name and 'Description' in element.get_text(strip=True):
                # Find the next sibling element that is a tag
                next_tag = element.find_next_sibling()
                if next_tag:
                    description = next_tag.text
                    break
        vuln = cwe.split(':', 1)[1].strip()

        driver.quit()
        return {
            'title': title,
            'description': description,
            'url': url,
            'program': program,
            'content': content,
            'cve': cve,
            'source': 'Huntr', 
            'cwe': cwe,
            'tags': ['Open Source', vuln]
        }

    except Exception as e:
        print("An error has occured:  ", e)
        driver.quit()
        return None

if __name__ == "__main__":
    # tag opensource, source: huntr
    hacktivity = parse_hacktivity()
    for hack in hacktivity:
        url = 'https://huntr.com' + hack['link']
        report = parse_report(url, hack['title'])
        if report:
            print(f"Indexing {url}")
            add_document_to_typesense(report)