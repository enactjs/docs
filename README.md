# Enact Documentation

This package generates the docs for Enact and its libraries.  Docs are generated from static doc
files and in-line documentation in JSDoc-style format.

## Building

> Note: Requires Node 10.10+

Before serving or building documentation, you must first run the `parse` command to generate the
documentation from the Enact source:

```
npm run parse
```

Additional repos can be pulled into the docs using the `extra-repos` command line argument:

```
e.g. npm run parse --extra-repos enactjs/agate#develop,enactjs/moonstone#3.2.5
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

## Linking Enact and Related Libraries

Copies of the source of Enact and other related libraries are placed into the `raw/` directory. If you need to link local copies, link them into that directory.  E.g.:

```bash
ln -s ~/enact raw/enact
ln -s ~/cli raw/cli
ln -s ~/eslint-config-enact raw/eslint-config-enact
```

For linking built Enact runtime libraries, use the `enact link` command.

## Known Issue

* Gatsby produces a site that is tied specifically to a particular path.  It expects to be installed into the root.  If you want to serve from elsewhere, you must change the `linkPrefix` in `/config.toml` and use `npm run deploy`.
