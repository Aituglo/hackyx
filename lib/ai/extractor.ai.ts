import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const jsonExample = {
    title: "title",
    description: "description",
    tags: ["tags"],
    cve: "CVE-XXXX-XXXXX",
    cwe: "Improper Restriction of Excessive Authentication Attempts"
};

export const extractContentDetails = async (htmlContent: string): Promise<any> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a content extraction AI that can extract structured data like title, description, tags, cve, cwe from HTML content. Only return the parsable json, not markdown in output, only extract for tag specific one not generic one like: Security, Vulnerability, etc. For CWE don't include the CWE-XX prefix, just put the name of vulnerability, exemple: `CWE-787: Out-of-bounds Write` -> `Out-of-bounds Write`.",
        },
        {
          role: "user",
          content: `Only return the json in output, extract structured data like ${JSON.stringify(jsonExample)} from the following HTML content: ${htmlContent}.`,
        },
      ]
    });

    if (response.choices && response.choices.length > 0) {
      const extractedData = response.choices[0].message.content.trim();
      const cleanExtractedData = extractedData.replace(/```json|```/g, '');
      const json = JSON.parse(cleanExtractedData);
      json.tags = json.tags.filter((tag: string) => tag.toLowerCase() !== 'security' && tag.toLowerCase() !== 'vulnerability');
      return json;
    } else {
      throw new Error("Failed to extract data from HTML content.");
    }
  } catch (error) {
    throw error;
  }
};


