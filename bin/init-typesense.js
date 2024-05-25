const Typesense = require('typesense');
require('dotenv').config();

const client = new Typesense.Client({
  nodes: [{
    host: process.env.TYPESENSE_HOST,
    port: process.env.TYPESENSE_PORT,
    protocol: process.env.TYPESENSE_PROTOCOL
  }],
  apiKey: process.env.TYPESENSE_API_KEY,
  connectionTimeoutSeconds: 2
});

const contentsSchema = {
  name: 'contents',
  fields: [
    { name: 'title', type: 'string' },
    { name: 'url', type: 'string' },
    { name: 'description', type: 'string', optional: true },
    { name: 'tags', type: 'string[]', optional: true },
    { name: 'content', type: 'string' },
    { name: 'program', type: 'string', optional: true },
    { name: 'cve', type: 'string', optional: true },
    { name: 'source', type: 'string', optional: true },
    { name: 'cwe', type: 'string', optional: true }
  ]
};

console.log("Creating collection...");
client.collections().create(contentsSchema)
  .then(() => {
    console.log("Collection created successfully");
  })
  .catch(error => {
    if (error.code === 409) {
      console.log("Collection already exists");
    } else {
      console.log(`Failed to create collection: ${error.message}`);
    }
  });

client.keys().create({
  description: "Search-only contents key.",
  actions: ["documents:search", "collections:get"],
  collections: ["contents"]
}).then(apiKey => {
  console.log(`API Key: ${apiKey.value}`);
}).catch(error => {
  console.log(`Failed to create API key: ${error.message}`);
});
