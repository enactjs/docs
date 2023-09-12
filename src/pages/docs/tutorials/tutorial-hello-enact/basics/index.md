---
title: Enact Basics
github: https://github.com/enactjs/docs/blob/develop/src/pages/docs/tutorials/tutorial-hello-enact/basics/index.md
order: 1
---
Hang on to your hats, we're going to write some code and get this app running! In this section, we're going to [create our first module](#building-the-app-module), [see how the application is rendered](#rendering-the-app) into the DOM, and [bundle and run the app](#running-the-app).  Let's get started.

## Building the App module

The main entry point of our application is in `./src/index.js`. While you could include all of your code there, what kind of example would you be setting for other programmers? Instead, we'll create a new module that will be home to our application component.

> A module in CommonJS can either refer to a single file directly or a directory which will ultimately resolve to a single file. Node.js defines a [set of rules](https://nodejs.org/api/modules.html#modules_all_together) for resolving module references and webpack has its own [set of configurations](https://webpack.js.org/configuration/resolve) to customize module resolution. The more you know!

The Enact team recommends that any module created for an application:
* be placed in its own directory -- e.g. `./src/App`
* contains a source file with the same name that contains the core logic -- e.g. `./src/App/App.js`
* contains a `package.json` with its `main` property pointing to that file

### The Module's `package.json`

The `package.json` for most modules will be simple and only contain the `main` property. It can include any of the supported properties for a [package descriptor file](http://wiki.commonjs.org/wiki/Packages/1.1#Package_Descriptor_File).

Let's create a file named `./src/App/package.json` and give it the following contents:

```json
{
	"main": "App.js"
}
```

### The Module's Source File

Now to get to some real code! Let's create a `./src/App/App.js` mighty enough to contain the source code. Here's the complete source:
```js
const App = function () {
	return (
		<div>
			Hello, Enact!
		</div>
	);
};

export default App;
export {App};
```
Don't worry about trying to absorb all that at once, we'll break it down, piece-by-piece.

> You'll notice that we've removed much of the boilerplate code that was created in this file by the `enact` command line tool. We'll be slowly adding it back in order to introduce the concepts incrementally.

<!-- link to a "why" post --> 

#### App component

You may not know it, but `App` is a component.  The simplest type of React component is a [Stateless Function](https://react.dev/learn/passing-props-to-a-component) that accepts a `props` object and returns a [React element](https://react.dev/learn/your-first-component). For this first version of Hello Enact!, we do not accept any properties so we can safely omit that argument. Instead, we will render the greeting within a `<div>` DOM node.
```js
const App = function () {
	return (
		<div>
			Hello, Enact!
		</div>
	);
};
```
There are several interesting points in this little block of code so let's look a little deeper.

> React supports two types of components -- those created with [ES2015 classes](https://react.dev/reference/react/Component) and Stateless Functions. Both of these will be covered in more detail later on.  Don't be impatient!

##### `const` vs `let`

[`const`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const) and [`let`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let) are two new statements for declaring variables in ES2015 ([spec](https://262.ecma-international.org/6.0/#sec-let-and-const-declarations)). `const` creates a read-only reference to a value and `let` creates a mutable reference to a value. Both are [block-scoped statements](http://www.2ality.com/2015/02/es6-scoping.html) rather than global- or function-scoped like `var`.

> In Enact, we recommend using **`const` by default** and `let` only when you determine you need to change the reference.
```js
const App = function () {
```
Here we're defining `App` as a `const` referring to a function that will render our application component.

##### Composing Components

In React, every component's [render method](https://react.dev/reference/react/Component#render) must either return a single root element (which can contain zero or more children) or `null`. The root element must be either a DOM node (like `<div>`) or a custom component (like we're creating right now). The root element in turn can contain strings or numbers in addition to DOM nodes and custom components.

Our Hello, Enact! app contains a `<div>` as its root element and a single string child, `Hello, Enact!`.
```js
return (
	<div>
		Hello, Enact!
	</div>
);
```
You'll notice that by introducing `<div>` we no longer have valid JavaScript! In fact, it looks a lot like valid HTML. That's because React introduces [JSX](https://react.dev/learn/writing-markup-with-jsx), which is a JavaScript syntax extension. In order to make JSX runnable by the browser, it has to be converted to JavaScript. With Enact, this is handled during the build process using [webpack](https://webpack.js.org) and [babel](https://babeljs.io/). Back in the time, we needed `React` module in order to use JSX. But as of now, we no longer need it since React 17 introduced [the new JSX transform](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#whats-different-in-the-new-transform). More on this [later](#running-the-app).

#### Exporting the App

Now that we've defined our component, the last step is to export it from the module so it can be consumed. This is accomplished with the [`export` statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export), which is another new feature in the ES2015 modules ([spec](https://262.ecma-international.org/6.0/#sec-exports)). You can export a value as the `default` export of the module, a named export, or both!

In most cases, each module will contain a single component which will be the default export. You can also export additional components, functions, or constants that might be useful for consumers of the component.
```js
export default App;
export {App};
```
> **A note on named exports**
>
> Within the Enact framework, the default export is also included as a named export for compatibility with CommonJS consumers. With only the default export, a consumer using `require()` would have to use the following syntax which is a bit awkward:
>
> `const App = require('./src/App').default`
>
> By including a named export, you can use the more intuitive alternative:
>
> `const App = require('./src/App').App`

## Rendering the App

With the App component ready, we can render it into the DOM. After this step, we'll be clear of the boilerplate code and ready to start exploring the framework. The rendering logic will live within our application's entry point, `./src/index.js`. Here's the complete code, which we'll cover incrementally below:

### ./src/index.js
```js
import {createRoot} from 'react-dom/client';

import App from './App';

const appElement = (<App />);

// In a browser environment, render the app to the document.
if (typeof window !== 'undefined') {
	const container = document.getElementById('root');
	createRoot(container).render(appElement);
}

export default appElement;
```
> The `index.js` provided by the dev tools allows the `App` component to be rendered into the DOM or imported into another
> component.

### `import` and ReactDOM

We'll use `import` to bring our dependencies. The [`import` statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) is a new feature introduced with ES2015 modules ([spec](https://262.ecma-international.org/6.0/#sec-imports)).
Let's import `react-dom/client` module for rendering our App. [Client React DOM APIs](https://react.dev/reference/react-dom/client) let you render React components on the client in the browser. You'll primarily be interested in the [`createRoot`](https://react.dev/reference/react-dom/client/createRoot) and [`root.render()` method](https://react.dev/reference/react-dom/client/createRoot#root-render).
```js
import {createRoot} from 'react-dom/client';
```
The curly braces -- `{createRoot}` -- are used to import a named export from `react-dom/client` rather than the default export. Alternatively, we could have imported the module as ReactDOMClient and called createRoot() on that object for the same result:
```js
import ReactDOMClient from 'react-dom/client';
ReactDOMClient.createRoot( ... ).render( ... );
```

### Importing our App

Next, we'll import our App module. We use relative paths (`'./App'` instead of `'App'`) for internal modules to distinguish them from external modules. We are also able to use the directory name rather than the full path to the source file based on App's `package.json`.
```js
import App from './App';
```

### createRoot().render()

Finally, we use `createRoot()` to create a root DOM node and `render()` to render our App inside the DOM node. We're using JSX again to create the React element for our App component and `getElementById` returns our DOM node.

You might have noticed, though, that we haven't created an HTML document yet and that's where Enact comes back into the picture. It will generate a default HTML file for our application during the build. It will contain `<div id="root"></div>` in the body, which is where we can render our application.
```js
const container = document.getElementById('root');
createRoot(container).render(appElement);
```
> You may notice that it looks like we're writing some HTML with an <App> element.  And, in fact, that's exactly what we've done.  JSX treats our App component just like it's an HTML element we can insert into markup.

## Running the App

Enact provides several `npm` scripts that ease working with apps.

* `npm run pack` - Bundles your application in the `./dist` directory.
* `npm run pack-p` - Bundles your application for production (with minified source and without sourcemaps) in the `./dist` directory.
* `npm run serve` - Bundles your application in memory, starts an HTTP server on port 8080 and serves your application. Whenever a source file changes, the app will be incrementally rebuilt with the changed file and the browser will automatically refresh (thanks to [webpack-dev-server](https://github.com/webpack/webpack-dev-server)!).
* `npm run clean` - Removes `./dist` and its contents

You should be able to run `npm run serve` now and, as we work through the rest of the guide, see the application reload with the new changes each time you save a file.

## Conclusion

We've built the boilerplate Enact app and have it running using `npm run serve`. Next up, in Part 2 of Hello, Enact!, we'll add some style using CSS Modules.

**Next: [Adding CSS](../adding-css/)**
