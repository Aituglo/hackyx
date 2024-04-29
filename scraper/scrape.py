import asyncio
from ctftime.ctftime import list_writeups

async def main():
    for i in range(2270, 3000):
      await list_writeups(i)

if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())