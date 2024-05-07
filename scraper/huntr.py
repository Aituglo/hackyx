#!/usr/bin/env python3
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from dateutil import parser
import time
from urllib.parse import urlparse
from bs4 import BeautifulSoup
from utils.souper import souper
import json

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

def parse_html(html, reports):
    soup = BeautifulSoup(html, 'html.parser')
    reports_link = soup.find_all('a', id='report-link')
    
    for r in reports_link:
        reports.append({"link":r['href'], "name":r.get_text() })

    with open('data.json', 'w') as f:
        json.dump(reports, f)

def parse_date(date_str):
    # Replace suffixes to create a date format that can be parsed
    date_str = (date_str.replace('st', '')
                        .replace('nd', '')
                        .replace('rd', '')
                        .replace('th', ''))
    return parser.parse(date_str)

def capture_web_content(url):
    reports = []

    parsed_url = urlparse(url)
    fragment = parsed_url.fragment
    
    options = Options()
    options.add_argument("--headless")

    webdriver_service = Service(ChromeDriverManager().install())

    driver = webdriver.Chrome(service=webdriver_service, options=options)
    try:
        driver.get(url)
        
        time.sleep(3)

        while driver.find_element(By.ID,'show-more-button'):
            driver.find_element(By.ID,'show-more-button').click()
            html = driver.page_source
            soup = BeautifulSoup(html, 'html.parser')
            get_last_date(soup)
            time.sleep(3)
        
        parse_html(html, reports)
        
        driver.quit()
    except Exception as e:
        print("An error has occured:  ", e)
        driver.quit()
        return None

if __name__ == "__main__":
    url = f"https://huntr.com/bounties/hacktivity"

    capture_web_content(url)