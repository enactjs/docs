# Enact Documentation

This package generates the docs for Enact and its libraries. Docs are generated from static doc
files and in-line documentation in JSDoc-style format.

## Building

Before serving or building documentation, you must first run the `parse-docs` command to generate the
documentation from the Enact source:

```
npm run parse-docs
```

The `parse-pages` command will convert documentation to `.mdx` and will use `.astro` components.

```
npm run parse-pages
```

The `make-runner` command will generate source for the components live preview.

```
npm run make-runner
```

Additional repos can be pulled into the docs using the `extra-repos` command line argument:

```
e.g. npm run parse-docs -- --extra-repos enactjs/agate#develop,enactjs/moonstone#3.2.5
```

Then, the docs site can be built in a 'debug' server mode or as a standalone static site. For testing,
use the `serve` command:

```
npm run serve
```

To produce the final documentation, build a static site with the `build` command:

```
npm run build
```

## Linking Enact and Related Libraries

Copies of the source of Enact and other related libraries are placed into the `raw/` directory. If you need to link local copies, link them into that directory.  E.g.:

`parse-docs` also clones `enactjs/samples` (branch `develop`) into `raw/samples`. Embedded samples are
configured in `src/config/sampleEmbeds.json` and built by `make-runner` into `public/`.

## Check Broken Links

To check the broken links, follow the steps below:

1. `npm run parse-docs`
2. `npm run parse-pages`
3. `npm run build`
4. `npm run check-links`
