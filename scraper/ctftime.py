import asyncio
import sys
from scraper.utils.ctftime_scraper import list_writeups

async def main():
    if len(sys.argv) > 1:
        list_writeups(int(sys.argv[1]))
    else:
        print('You should put the id of the event as an argument')

if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())