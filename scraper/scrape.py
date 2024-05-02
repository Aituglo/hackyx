import asyncio
from ctftime.ctftime import list_writeups

async def main():
    for i in range(58, 2270):
      await list_writeups(i)

if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())