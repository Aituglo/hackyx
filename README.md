# Hackyx

[https://hackyx.io](https://hackyx.io)

Hackyx is a search engine for cybersecurity.

It is built for the community so anyone can add a new content to it.

The aim of this project is to easily find any resource related to IT security like CTF writeup, article or Bug Bounty reports.

### Add a new content

To add a new content, you simply have to fill the form on the main website [https://hackyx.io](https://hackyx.io).

You can find it at the bottom of the page "Add a new content".

Then, a manual review will be done to validate the content. If it's validated, the content will be added to the search engine.

## Local Development Setup for Hackyx
To set up the Hackyx project for local development, follow these steps:
### Environment Setup
Create a `.env` file based on the template provided in `env.example.txt`.
### GitHub OAuth Setup
Create an OAuth application in the GitHub developer settings at [GitHub Developer Settings](https://github.com/settings/developers) to obtain a `GITHUB_ID` and a `GITHUB_SECRET`. When setting up the application, you will need to provide the following information:
- **Homepage URL**: The base URL of your application, for example `http://localhost:3000`.
- **Authorization callback URL**: The authorized callback URL for OAuth authentication, which should be `http://localhost:3000/api/auth/callback/github`.
Add `GITHUB_ID` and `GITHUB_SECRET` to your `.env` file.
### Docker Services
Start the required services (PostgreSQL, Typesense, and Browserless) using Docker Compose.
```
docker-compose -f docker-compose.dev.yml up
```
### Initialize Typesense
Run the Typesense initialization script.
```
npm run init-typesense
```
Copy the api key from the output and paste it in the `.env` file in `NEXT_PUBLIC_TYPESENSE_SEARCH_API_KEY`.
### Database Initialization 
Generate Prisma client and push the schema to your database.
```
npx prisma generate
npx prisma db push
```
### Database UI
Optionally, you can use Prisma Studio to view and manage your database.
```
npx prisma studio
```

These steps will get your local development environment ready for Hackyx.
