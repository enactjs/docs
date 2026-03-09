# Enact Documentation

Documentation site for [Enact](https://enactjs.com/) built with [Docusaurus](https://docusaurus.io/): static guides plus API reference generated from JSDoc. For structure and workflow details, see [Docs Repository Overview](/docs/docs-repository-overview).

---

## Quick start

```bash
npm install
npm start          # dev server
npm run build      # output in build/
```

---

## Generating docs

**1. Parse JSDoc** → JSON in `src/pages/docs/modules/`:

```bash
npm run parse-docs
```

**2. JSON → MDX** in `docs/`:

```bash
npm run json-to-mdx
```

**Useful parse-docs options** (after `--`):

| Option | Description |
|--------|-------------|
| `--extra-repos <list>` | Extra repos to clone and parse. Format: `owner/repo#branch`, comma-separated. Example: `--extra-repos enactjs/agate#develop,enactjs/moonstone#3.2.5` |
| `--rebuild-raw` | Re-clone all repos in `raw/`. |
| `--enact-branch <branch>` | Branch for `enactjs/enact` (default: `master`). |

Full list of options in `scripts/DocParser.js` and `scripts/prepareRaw.js`.

---

## Live examples (make-runner)

Interactive samples from JSDoc `@example` run in iframes. Build the sample apps once:

```bash
npm run make-runner
```

Builds themes (core, moonstone, sandstone, limestone, agate) into `static/{theme}-runner/`. Requires the Enact CLI (`enact`).

**Options:** `--fast` (skip themes that already have a runner), `--enact-cmd=<cmd>` (e.g. `npx enact`).

---

## Deployment

```bash
USE_SSH=true npm run deploy
# or
GIT_USER=<YourGitHubUsername> npm run deploy
```

For GitHub Pages, this builds and pushes to the `gh-pages` branch.
