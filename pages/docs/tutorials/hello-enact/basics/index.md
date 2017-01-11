---
title: Enact Basics
---
Hang on to your hats, we're going to write some code and get this app running! In this section, we're going to [create our first module](#building-the-app-module), [see how the application is rendered](#rendering-the-app) into the DOM, and [bundle and run the app](#running-the-app).  Let's get started.

## Building the App module

The main entry point of our application is in `./src/index.js`. While you could include all of your code there, what kind of example would you be setting for other programmers? Instead, we'll create a new module that will be home to our application component.

> A module in CommonJS can either refer to a single file directly or a directory which will ultimately resolve to a single file. Node.js defines a [set of rules](https://nodejs.org/api/modules.html#modules_all_together) for resolving module references and webpack has its own [set of configurations](http://webpack.github.io/docs/configuration.html#resolve) to customize module resolution. The more you know!

The Enact team recommends that any module created for an application:
* be placed in its own directory -- e.g. `./src/App`
* contain a source file with the same name that contains the core logic -- e.g. `./src/App/App.js`
* contain a `package.json` with its `main` property pointing to that file

### The Module's `package.json`

The `package.json` for most modules will be simple and only contain the `main` property. It can include any of the supported properties for a [package descriptor file](http://wiki.commonjs.org/wiki/Packages/1.1#Package_Descriptor_File).

Let's create a file named `./src/App/package.json` and give it the following contents:

	{
		"main": "App.js"
	}

### The Module's Source File

Now to get to some real code! Let's create a `./src/App/App.js` mighty enough to contain the source code. Here's the complete source:

	import React from 'react';
	
	const App = function () {
		return (
			<div>
				Hello, Enact!
			</div>
		);
	};
	
	export default App;
	export {App};

Don't worry about trying to absorb all that at once, we'll break it down, piece-by-piece.

> You'll notice that we've removed much of the boilerplate code that was created in this file by the `enact` command line tool. We'll be slowly adding it back in order to introduce the concepts incrementally.

#### `import` and React

The first step is to `import` our dependencies for this component. The [`import` statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) is a new feature introduced with ES6 modules ([spec](http://www.ecma-international.org/ecma-262/6.0/#sec-imports)).

	import React from 'react';

We only have a single import right now but it's a very important one. Earlier versions of Enyo were built upon a custom core that defined how components were created, composed, and rendered. With Enact, we've decided to build on top of the very popular [React library](https://facebook.github.io/react) from Facebook. The `react` module provides the tools necessary to create and compose components. Rendering is handled by another module, `react-dom`, which will be discussed [later](#rendering-the-app).

<!-- link to a "why" post --> 

#### App component

You may not know it, but `App` is a component.  The simplest type of React component is a [Stateless Function](https://facebook.github.io/react/docs/reusable-components.html#stateless-functions) that accepts a `props` object and returns a [React element](https://facebook.github.io/react/blog/2015/12/18/react-components-elements-and-instances.html). For this first version of Hello Enact!, we do not accept any properties so we can safely omit that argument. Instead, we will render the greeting within a `<div>` DOM node.

	const App = function () {
		return (
			<div>
				Hello, Enact!
			</div>
		);
	};

There are several interesting points in this little block of code so let's look a little deeper.

> React supports two types of components -- those created with [ES6 classes](https://facebook.github.io/react/docs/reusable-components.html#es6-classes) and Stateless Functions. Both of these will be covered in more detail later on.  Don't be impatient!

##### `const` vs `let`

[`const`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) and [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) are two new statements for declaring variables in ES6 ([spec](http://www.ecma-international.org/ecma-262/6.0/#sec-let-and-const-declarations)). `const` creates a read-only reference to a value and `let` creates a mutable reference to a value. Both are [block-scoped statements](http://www.2ality.com/2015/02/es6-scoping.html) rather than global- or function-scoped like `var`.

> In Enact, we recommend using **`const` by default** and `let` only when you determine you need to change the reference.

 	const App = function () {

Here we're defining `App` as a `const` referring to a function that will render our application component.

##### Composing Components

In React, every component's [render method](https://facebook.github.io/react/docs/component-specs.html#render) must either return a single root element (which can contain zero or more children) or `null`. The root element must be either a DOM node (like `<div>`) or a custom component (like we're creating right now). The root element in turn can contain strings or numbers in addition to DOM nodes and custom components.

Our Hello, Enact! app contains a `<div>` as its root element and a single string child, `Hello, Enact!`.

		return (
			<div>
				Hello, Enact!
			</div>
		);
	
You'll notice that by introducing `<div>` we no longer have valid JavaScript! In fact, it looks a lot like valid HTML. That's because React introduces [JSX](https://facebook.github.io/react/docs/jsx-in-depth.html), which is a JavaScript syntax extension. In order to make JSX runnable by the browser, it has to be converted to JavaScript. With Enact, this is handled during the build process using [webpack](http://webpack.github.io) and [babel](http://babeljs.io). More on this [later](#running-with-npm).

#### Exporting the App

Now that we've defined our component, the last step is to export it from the module so it can be consumed. This is accomplished with the [`export` statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export), which is another new feature in the ES6 modules [spec](http://www.ecma-international.org/ecma-262/6.0/#sec-exports). You can export a value as the `default` export of the module, a named export, or both!

In most cases, each module will contain a single component which will be the default export. You can also export additional components, functions, or constants that might be useful for consumers of the component.

	export default App;
	export {App};

> **A note on named exports**
>
> Within the Enact framework, the default export is also included as a named export for compatibility with CommonJS consumers. With only the default export, a consumer using `require()` would have to use the following syntax which is a bit awkward:
>
> `var App = require('./src/App').default`
>
> By including a named export, you can use the more intuitive alternative:
>
> `var App = require('./src/App').App`

## Rendering the App

With the App component ready, we can render it into the DOM. After this step, we'll be clear of the boilerplate code and ready to start exploring the framework. The rendering logic will live within our application's entry point, `./src/index.js`. Here's the complete code, which we'll cover incrementally below:

### ./src/index.js

	import React from 'react';
	import {render} from 'react-dom';
	
	import App from './App';
	
	render(
		<App />,
		document.getElementById('root') // provided by Enact's HTML template
	);

### React and ReactDOM

Like our App module, we're importing React but we're also importing a new module, `react-dom`. [ReactDOM](https://facebook.github.io/react/docs/top-level-api.html#reactdom) provides the means to transform a React component tree into a DOM tree. You'll primarily be interested in the [`render()` method](https://facebook.github.io/react/docs/top-level-api.html#reactdom.render).

	import React from 'react';
	import {render} from 'react-dom';

The curly braces -- `{render}` -- are used to import a named export from `react-dom` rather than the default export. Alternatively, we could have imported the module as ReactDOM and called render() on that object for the same result:

	import ReactDOM from 'react-dom';
	ReactDOM.render( ... );

### Importing our App

Next, we'll import our App module. We use relative paths (`'./App'` instead of `'App'`) for internal modules to distinguish them from external modules. We are also able to use the directory name rather than the full path to the source file based on App's `package.json`.

	import App from './App';

### render()

Finally, we use `render()` to render our App. It accepts a React element and a target DOM node. We're using JSX again to create the React element for our App component and `getElementById` returns our DOM node.

You might have noticed, though, that we haven't created an HTML document yet and that's where Enact comes back into the picture. It will generate a default HTML file for our application during the build. It will contain `<div id="root"></div>` in the body, which is where we can render our application.

	render(
		<App />,
		document.getElementById('root')
	);

> You may notice that it looks like we're writing some HTML with an <App> element.  And, in fact, that's exactly what we've done.  JSX treats our App component just like it's an HTML element we can insert into markup.

## Running the App

Enact provides several scripts that ease working with apps.  Until our command line tool is ready, we use `npm` scripts. The following commands will invoke these scripts.

* `npm run pack` - Bundles your application in the `./dist` directory.
* `npm run pack-p` - Bundles your application for production (with minified source and without sourcemaps) in the `./dist` directory.
* `npm run serve` - Bundles your application in memory, starts an HTTP server on port 8080 and serves your application. Whenever a source file changes, the app will be incrementally rebuilt with the changed file and the browser will automatically refresh (thanks to [webpack-dev-server](http://webpack.github.io/docs/webpack-dev-server.html)!).
* `npm run clean` - Removes `./dist` and its contents

You should be able to run `npm run serve` now and, as we work through the rest of the guide, see the application reload with the new changes each time you save a file.

## Conclusion

We've built the boilerplate Enact app and have it running using `npm run serve`. Next up, in Part 2 of Hello, Enact!, we'll add some style using CSS Modules.

**Next: [Hello, Enact!: Adding CSS](../adding-css/)**
