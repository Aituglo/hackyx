#!/usr/bin/env python3
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from readabilipy import simple_json_from_html_string
import time
from urllib.parse import urlparse
from bs4 import BeautifulSoup
import asyncio
from utils.souper import souper
from lxml import etree 
import json

def parse_html(html, reports):
    soup = BeautifulSoup(html, 'html.parser')
    reports_link = soup.find_all('a', id='report-link')
    
    for r in reports_link:
        reports.append({"link":r['href'], "name":r.get_text() })

    with open('data.json', 'w') as f:
        json.dump(reports, f)

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

        # while driver.find_element(By.ID,'show-more-button'):
        #    driver.find_element(By.ID,'show-more-button').click()
        #    html = driver.page_source
        #    soup = BeautifulSoup(html, 'html.parser')
        #    last_date = soup.soup.find_all("tr").find_all('span')[-1].
            
        #    time.sleep(3)

        html = driver.page_source
        soup = BeautifulSoup(html, 'html.parser')
        last_date = soup.soup.find_all("tr").find_all('span')[-1].text
        print(last_date)
        parse_html(html, reports)
        
        driver.quit()
    except Exception as e:
        print("An error has occured:  ", e)
        driver.quit()
        return None

if __name__ == "__main__":
    url = f"https://huntr.com/bounties/hacktivity"

    capture_web_content(url)