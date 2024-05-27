import Typesense from "typesense";

const client = new Typesense.Client({
  nodes: [{
    host: process.env.NEXT_PUBLIC_TYPESENSE_HOST,
    port: parseInt(process.env.NEXT_PUBLIC_TYPESENSE_PORT, 10),
    protocol: process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL
  }],
  apiKey: process.env.TYPESENSE_API_KEY,
  connectionTimeoutSeconds: 2
});

export async function contentExists(url: string): Promise<boolean> {
  try {
    const searchParameters = {
      'q': url,
      'query_by': 'url',
      'filter_by': `url:=${url}`  // Exact match filter
    };
    const result = await client.collections('contents').documents().search(searchParameters);
    return result.found > 0;
  } catch (error) {
    return false;
  }
}

export async function addContentToTypesense(contentData: { url: string; content: string; title: string; description?: string; tags?: string[]; program?: string; cve?: string; source?: string; cwe?: string }): Promise<boolean> {
  const exists = await contentExists(contentData.url);
  if (!exists) {
    try {
      await client.collections('contents').documents().create(contentData);
      return true;
    } catch (error) {
      return false;
    }
  }
  return false;
}

export async function getTotalContentsCount(): Promise<number> {
  try {
    const collection = await client.collections('contents').retrieve();
    return collection.num_documents;
  } catch (error) {
    return 0;
  }
}


