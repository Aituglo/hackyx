#!/usr/bin/env python3
import asyncio, aiohttp, re
from utils.souper import souper
from utils.scraper import capture_web_content
from utils.typesense import add_document_to_typesense

async def ctftime_scraper(url, session):
    print("Parsing {}".format(url))
    soup = await souper(url,session)
    if not soup:
        return
    
    container = soup.find_all("div",{"class":"container"})[1]

    heading = container.find('div',{'class':'page-header'})
    event = soup.find('a', href=re.compile("^\/event\/\d+$"))
    if event:
        title = f"{event.text} | {heading.h2.text.strip()}"
    else:
        title = f"{heading.h2.text.strip()}"
        
        
    author_link = container.find('a', href=re.compile(r"/user/\d+"))
    
    if author_link:
        description = soup.find('meta', attrs={'name':'description'}).get('content') + " by " + author_link.text
    else:
        description = soup.find('meta', attrs={'name':'description'}).get('content')

    link_original_writeup = container.find('a', text="Original writeup")
    original_writeup_url = link_original_writeup['href'] if link_original_writeup else None

    tags = [t.text for t in container.find_all('span', {'class': ['label', 'label-info']})]
    tags.append("writeup")
    
    scrape_url = None
    if original_writeup_url:
        if re.match('https?:\/\/github.com\/.*', original_writeup_url):
            if original_writeup_url.endswith('.md') and "blob" in original_writeup_url:
                scrape_url = original_writeup_url
            else:
                return
        elif "youtube" in original_writeup_url or "youtu.be" in original_writeup_url:
            return
        else:
            scrape_url = original_writeup_url
        
    else:
        scrape_url = url
            
    if scrape_url:
        _, content = capture_web_content(scrape_url)
        
        if content and content != "":
            try:
                add_document_to_typesense({
                    'title': title,
                    'description': description,
                    'url': scrape_url,
                    'tags': tags,
                    'content': content
                })
            except Exception as e:
                print(f"Failed to add document: {scrape_url}")
        

async def list_writeups(id):
    url = f"https://ctftime.org/event/{id}/tasks/"
    
    names = []
    links = []
    
    soup = await souper(url)
    if not soup:
        return
    
    #Get all writeup names and number of writeups
    rows = soup.find_all("tr")
    if not rows:
        return  
    for row in rows[1:]:
        td = row.find_all('td')
        st = td[0].text+","+(td[3].text+" writeup(s)").rjust(50-len(td[0].text))
        names.append((st,td[0].a['href']))
    
    connector = aiohttp.TCPConnector(limit=5)
    async with aiohttp.ClientSession(connector=connector) as session:
        hrefs = [f"https://ctftime.org{name[1]}" for name in names]
        writeup_soups = await asyncio.gather(*[souper(href, session) for href in hrefs])
        for writeup_soup in writeup_soups:
            trs = writeup_soup.find_all("tr")
            for tr in trs[1:]:
                links.append(f"https://ctftime.org{tr.find('a')['href']}")

    #Scrape all writeups
    connector = aiohttp.TCPConnector(limit=5)
    async with aiohttp.ClientSession(connector=connector) as session: 
        await asyncio.gather(*[ctftime_scraper(link,session) for link in links])


    
