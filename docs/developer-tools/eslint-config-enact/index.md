---
title: eslint-config-enact Linting Configuration
github: https://github.com/enactjs/eslint-config-enact/blob/develop/docs\index.md
---
<nav role="navigation" class="page-toc">

- [Analyzing Your Code](#analyzing-your-code)

</nav>



The Enact team recommends all developers use ESLint to statically analyze files for potential errors and to help enforce a common coding style.  To that end, we developed an [ESLint configuration](https://github.com/enactjs/eslint-config-enact) that encapsulates Enact programming conventions.  Most modern editors have support for displaying linter errors in-line with source code.  This can be very helpful during development.  The configuration offers two flavors: strict and regular.

This document describes how to use the Enact ESLint configuration and how to set up ESLint with various editors.

## Analyzing Your Code

### Command Line

If you use the `cli` tools to create your project, `npm run lint` will run the Enact configuration of ESLint for syntax analysis.

If you want to switch to the strict version of the linting rules, modify your `package.json` file and change the following lines:

```json
    "lint": "enact lint",
...
  "eslintConfig": {
    "extends": "enact-proxy"
  },
```

to read:

```json
    "lint": "enact lint --strict",
...
  "eslintConfig": {
    "extends": "enact-proxy/strict"
  },
```

If you are not using the `cli` tools, you can create (or modify) an `eslint.config.js` in the project's root and run `eslint .`:

```json
{
  "extends": "enact-proxy"
}
```
>**NOTE**: For strict mode, use `"extends": "enact-proxy/strict"`.

If you like our linting rules and want to use them by default you can create the `eslint.config.js` file in your HOME directory instead.

### In-editor

This section describes the procedure for setting up several popular editors.

You would need to install an ESLint plugin for your editor first.

Ever since ESLint 6, global installations of ESLint configs are no longer supported.
To work around this new limitation, while still supporting in-editor linting, we've created a new [eslint-config-enact-proxy](https://github.com/enactjs/eslint-config-enact-proxy) package.
The [eslint-config-enact-proxy](https://github.com/enactjs/eslint-config-enact-proxy) acts like a small proxy config, redirecting ESLint to use a globally-installed Enact ESLint config.
`eslint-config-enact-proxy` needs to be installed locally on a project to enable in-editor linting:

```sh
npm install --save-dev eslint-config-enact-proxy
```

Also, you need to modify `eslintConfig` property in `package.json`:

```json
  "eslintConfig": {
    "extends": "enact-proxy"
  },
```
>**NOTE**: For strict mode, use `"extends": "enact-proxy/strict"`.

In order for in-editor linting to work with our updated ESLint config, you'll need to upgrade to ESLint 7 or later. This can be installed globally by running:

```sh
npm install -g eslint
```

Then, you will need to uninstall any previous globally-installed Enact linting package (everything but eslint itself):

```sh
npm uninstall -g eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-babel @babel/eslint-parser eslint-plugin-jest eslint-plugin-enact eslint-config-enact
```

Each editor requires a slightly different setup.  Jump to the section relevant to your editor.

>**NOTE**: If you happen to have in-editor linting set up already using JSHint or another tool, be sure to disable it as older linters sometimes get confused with newer ES6+ syntax and will not take advantage of the Enact linting rules.

##### Atom

From the shell/command prompt, issue the following command to install [linter-eslint](https://github.com/AtomLinter/linter-eslint):

```bash
apm install linter-eslint
```

After the installation go to *Preferences*, then click on *Packages*. Navigate down to *linter-eslint* and click *Settings*. Make sure that the *Use global ESLint installation* option is checked and that you have correctly configured the path to the node installation within Atom.

##### Sublime Text

Install the [SublimeLinter-eslint plugin](https://github.com/roadhump/SublimeLinter-eslint), which depends on [SublimeLinter 3](http://sublimelinter.readthedocs.org/en/latest/installation.html).

##### Vim

First install [Syntastic](https://github.com/scrooloose/syntastic) and then enable the eslint option:

```vimscript
" syntastic
let g:syntastic_javascript_checkers = ['eslint']
let g:syntastic_always_populate_loc_list = 1
let g:syntastic_auto_loc_list = 0
let g:syntastic_check_on_open = 1
let g:syntastic_check_on_wq = 0
let g:syntastic_mode_map = {
        \ "mode": "active",
        \ "active_filetypes": ["javascript"]}
```

Unfortunately, Syntastic does not support real-time linting and only lints on save/load.

> **NOTE**: You may also wish to install [vim-jsx](https://github.com/mxw/vim-jsx) as well.

##### Visual Studio Code

Install the [vscode-eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) plugin.  More information on linters and Visual Studio Code can be found [here](https://code.visualstudio.com/docs/languages/javascript#_linters).

##### WebStorm

In either the default or per-project preferences, go to *Languages & Frameworks* > *JavaScript* > *Code Quality* > *ESLint*.
Check the *Enable* checkbox.  Ensure that the proper paths for `node` and `eslint` are configured.

#### Troubleshooting

If in-editor linting is not working in your local project, be sure you set up `package.json` or `eslint.config.js` as described above.
