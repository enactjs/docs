# Enact Documentation

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator. For a detailed overview of the repository structure, folder layout, and workflow, see [Docs Repository Overview](/docs/docs-repository-overview) in the documentation.

## Installation

```bash
npm install
```

## Local Development

```bash
npm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Generating Documentation

To regenerate docs from JSDoc (e.g. after updating Enact packages):

```bash
npm run parse-docs    # Parse JSDoc, copy static docs, generate JSON
npm run json-to-mdx   # Convert JSON to MDX in docs/
```

For interactive live examples, also build the sample runners:

```bash
npm run make-runner
```

Live examples are extracted from JSDoc `@example` tags in the source.

## Build

```bash
npm build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

Using SSH:

```bash
USE_SSH=true npm deploy
```

Not using SSH:

```bash
GIT_USER=<Your GitHub username> npm deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
