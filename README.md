# Hackyx

[https://hackyx.io](https://hackyx.io)

[![.github/workflows/deploy.yml](https://github.com/Aituglo/hackyx/actions/workflows/deploy.yml/badge.svg)](https://github.com/Aituglo/hackyx/actions/workflows/deploy.yml)

Hackyx is a search engine for cybersecurity.

It is built for the community so anyone can add a new content to it.

The aim of this project is to easily find any resource related to IT security like CTF writeup, article or Bug Bounty reports.

## How to contribute

If you want to contribute to this project, you can add a new content by creating a pull request.

### Add a new content

To add a new content, you have to fill the file to_add.yml in the `content` folder.

You already have an example in the `content` folder.

```yaml
contents:
  - title: "Titre 1"
    description: "Description 1"
    url: "http://url1.com"
    tags: 
      - tag1
      - tag2
```

Then, a manual review will be done to validate the content. If it's validated, the content will be added to the search engine.

## TODO

- [x] Add a filter by tags
- [x] Add a filter by type of content
- [ ] Add CI/CD for auto push new content
