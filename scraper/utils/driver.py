#!/usr/bin/env python3
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options

def get_chrome_driver():
    options = Options()
    options.add_argument("--headless")

    webdriver_service = Service(ChromeDriverManager().install())

    return webdriver.Chrome(service=webdriver_service, options=options)