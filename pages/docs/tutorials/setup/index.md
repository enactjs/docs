---
title: Enact Development Setup
---
Enact will make it easy to create a new application using its command-line tool.  However, that tool isn't ready yet.  You get to learn how to install Enact from scratch.  Lucky you!

## Prerequisites

Before the Enact framework can function on your computer, it is necessary to install some software. The most important piece is the [Node JavaScript runtime](https://nodejs.org) version 4.0 or newer (you can check to see what version of Node is installed by typing `node --version` into your command prompt or terminal window).  If needed, follow the instructions on the site to install it.

## Installing Enact CLI

The Enact CLI provides a set of commands to ease creation, testing, maintenance, and packaging of your Enact-based apps. It can be installed globally on your system using `npm`:

    npm install -g enact-dev

Once installed, you can run `enact` from anywhere to run a command.

> We'll cover some of the available commands below but the [package README](https://github.com/enyojs/enact-dev) contains further detail.

## Enact App Structure

The first command you'll use is `enact create [<directory>]` to create a new application. The `[<directory>]` argument is optional and defaults to the current working directory. `create` creates the [initial directory structure](#directory-structure) and [configures the app](#configuring-the-application).

### Directory Structure

The application directory includes:

* `README.md` containing some useful tips on creating and building your application,
* `package.json`, a file describing the application,
* a `node_modules` directory containing all of your external dependencies (such as `@enact/core` and `react`),
* a `resources` directory containing localization files,
* a `src` directory containing all your source files, both JS and CSS/LESS, and
* a `webos-meta` directory containing files necessary for webOS deployment.

When you package your app, it will be placed into a `dist` directory.  You won't see this yet, but know that it's coming.

	App
	├── README.md
	├── package.json
	├── resources
	│   └── ilibmanifest.json
	├── src
	│   ├── App
	│   │   ├── App.js
	│   │   ├── App.less
	│   │   └── package.json
	│   ├── components
	│   │   └── README.md
	│   ├── index.js
	│   ├── iso.js
	│   └── views
	│       ├── MainPanel.js
	│       └── README.md
	└── webos-meta
	    ├── appinfo.json
	    ├── icon-large.png
	    ├── icon-mini.png
	    └── icon.png

### Configuring the Application

You application is configured using the `package.json` file. We'll only cover the fields you most likely want to change here and leave a more [complete discussion of the `package.json`](#package.json-In-Depth) for further reading.

* `"name"`, `"version"`, `"description"`, `"author"`, `"license"` - Application meta-data. These fields do not affect the build of your application but should be updated to reflect your application's details.
* `"enact"` - The Enact-specific configuration block. By default, it contains intelligent defaults for an Enact Moonstone application. You *should* add a `"title"` field within this block to specify your application's title which will be included in the generated `index.html` during the build.

**package.json**

    {
        "name": "App",
        "version": "1.0.0",
        "description": "A general template for an Enact Moonstone application.",
        "author": "",
        "main": "src/index.js",
        "scripts": { [omitted] },
        "license": "UNLICENSED",
        "private": true,	
        "repository": "",
        "enact": {
            "isomorphic": "src/iso.js",
            "ri": {
                "baseSize": 24
            }
        },
        "eslintConfig": {
            "extends": "enact"
        },
        "dependencies": { [omitted] }
    }

## Conclusion

With that housekeeping out of the way, nothing can stop you. You're ready to add your first source file and build Hello, Enact.

**Next: [Hello Enact](../hello-enact/)!**
