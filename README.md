# Enact Documentation

This package generates the docs for Enact and its libraries.  Docs are generated from static doc
files and in-line documentation in JSDoc-style format.

## Building

Before serving or building documentation, you must first run the `parse` command to generate the
documentation from the Enact source:

```
npm run parse
```

Then, the docs site can be built in a 'debug' server mode or as a standalone static site.  For testing,
use the `serve` command:

```
npm run serve
```

To produce the final documentation, build a static site with the `build` command:

```
npm run build
```

## Caveats

Doc building currently only works on Mac or Linux filesystems.
