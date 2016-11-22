# Enact Documentation

This package generates the docs for Enact and its libraries.  Docs are generate from static doc
files and in-line documentation in JSDoc-style format

## Building

Documentation can be built in a 'debug' server mode or as a standalone static site.  For testing,
use the `serve` command:

```
npm run serve
```

To produce the final documentation, build a static site with the `build` command:

```
npm run build
```

## Caveats

Requires the `grep` command. A compatible version will need to be installed for Windows machines.
