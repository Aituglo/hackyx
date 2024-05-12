from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support import expected_conditions as EC
import time
from urllib.parse import urlparse
from bs4 import BeautifulSoup

def capture_web_content(url):
    parsed_url = urlparse(url)
    
    options = Options()
    options.add_argument("--headless")

    webdriver_service = Service(ChromeDriverManager().install())

    driver = webdriver.Chrome(service=webdriver_service, options=options)
    try:
        driver.get(url)
        
        time.sleep(3)
        
        html = driver.page_source
        soup = BeautifulSoup(html, 'html.parser')
        
        summaries = soup.find_all('div', class_='report-summary')
        
        content = soup.find('div', id='report-information')
        
        final_text = ""
        
        if summaries:
            for summary in summaries:
                final_text += summary.text + " "
                
        if content:
            final_text += content.text
            
        final_text = final_text.replace("MenuMenu", " ")        

        driver.quit()
        
        return final_text
    except Exception as e:
        print("An error has occured with  ", url)
        driver.quit()
        return None
  