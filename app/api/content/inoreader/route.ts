import { parseContentFromURL } from '@/lib/parser';

async function postHandler(req: Request) {
  const { searchParams } = new URL(req.url);
  const apiKey = searchParams.get('API_KEY');
  if (apiKey !== process.env.INOREADER_HACKYX_KEY) {
    return Response.json({ error: 'Unauthorized access' }, { status: 401 });
  }

  const body = await req.json();
  const items = body.items;
  if (!items) {
    return Response.json({ error: 'No items provided' }, { status: 400 });
  }

  for (const item of items) {
    const url = item.canonical[0].href;

    const content = await parseContentFromURL(url);
    if (!content) {
      return Response.json({ error: 'Content already exists' }, { status: 400 });
    }
    console.log(content);
  }

  return Response.json({ message: 'Data processed' }, { status: 200 });
}

export { postHandler as POST };
