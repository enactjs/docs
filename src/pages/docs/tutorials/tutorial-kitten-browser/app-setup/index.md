---
title: App Setup
github: https://github.com/enactjs/docs/blob/develop/src/pages/docs/tutorials/tutorial-kitten-browser/app-setup/index.md
order: 1
---

<!--
* Concept: App Scaffolding
* Concept: JSX - syntax and comments
-->

To explore some more interesting features of ES6, React, and Enact, we're going to pivot from our
[Hello, Enact!](../../tutorial-hello-enact/) app to a new app: Kitten Browser. In this step, we will setup the
module and create the initial App component to lay the foundation for the rest of
the guide.

> We'll use the placeholder image site [LoremFlickr](http://loremflickr.com/) to source our images.
> If you're not a fan of kittens, you're welcome to substitute a different keyword in the URLs.  No judgments.

### Directory Structure
```none
+ App
	+ src						<-- All of our source code
		+ App					<-- The App component to be rendered into the DOM
			- App.js
			- package.json
		+ components			<-- Any reusable components for our App
			+ Kitten
				Kitten.js
				Kitten.module.less
				package.json
		+ views					<-- Composite components that make up a distinct view of the app
			Detail.js
			List.js
		- index.js				<-- The entry point for the module
	- package.json				<-- Module meta-data
```
### ./package.json

Let's give our module a name and establish its dependencies.  Edit `package.json` and update the `name` property.

```json
{
	"name": "enact-tutorial-kitten-browser",
	"version": "1.0.0",
	"description": "A general template for an Enact Sandstone application.",
	"author": "",
	"main": "src/index.js",
	"scripts": { [omitted] },
	"license": "UNLICENSED",
	"private": true,	
	"repository": "",
	"enact": {
		"theme": "sandstone"
	},
	"eslintConfig": {
		"extends": "enact"
	},
	"dependencies": { [omitted] }
}
```
### ./src/index.js
```js
import React from 'react';
import {render} from 'react-dom';

import App from './App';

let appElement = (<App />);

// In a browser environment, render instead of exporting
if (typeof window !== 'undefined') {
	render(
		appElement,
		document.getElementById('root') // provided by Enact's HTML template
	);
}

export default appElement;
```
## App

### ./src/App/package.json
```json
{
	"main": "App.js"
}
```
### ./src/App/App.js

At this point, our app looks a lot like Hello, Enact!'s [App.js](../../tutorial-hello-enact/kind#srcappappjs)
with a couple small changes. We won't need any custom CSS for our App component so we've removed that
`import`. We've also replaced the content with the basic markup for a single photo.
```js
import kind from '@enact/core/kind';
import ThemeDecorator from '@enact/sandstone/ThemeDecorator';
import React from 'react';

const AppBase = kind({
	name: 'App',

	render: function (props) {
		return (
			<div className={props.className}>
				<div>
					{/* For the feline-declined, you can replace the keyword below */}
					<img src="//loremflickr.com/300/300/kitten" />
					<div>Kitten</div>
				</div>
			</div>
		);
	}
});

const App = ThemeDecorator(AppBase);

export default App;
export {
	App, 
	AppBase
};
```

### JSX Hints

You might be wondering why the `<img />` tag uses the self-closing syntax (`/>`). This is a
[requirement imposed by JSX](https://facebook.github.io/react/tips/self-closing-tag.html), so
whenever you include an element that doesn't have any children, you must either use the self-closing
syntax or explicitly close it (`<img src=""></img>`).

Comments in your code are helpful and JSX is no different. [Comments in JSX](https://facebook.github.io/react/docs/jsx-in-depth.html#comments)
must be within an [expression](https://facebook.github.io/react/docs/jsx-in-depth.html#javascript-expressions) to be correctly
parsed by the plugin.

## Conclusion

With the scaffolding in place, you should be able to fire up the Enact dev server and see
Kitten Browser in action:
```bash
npm run serve
```
![Kitten Browser Step 1](KittenBrowser-Step1.png)
> Tell the kids to avert their eyes!

### ESLint Hints

When you enter the above command, you'll see the compilation warning message below. Let's take a look at what this message means and try to resolve it briefly.
```console
Compiled with warnings.

./src/App/App.js
  Line 13:6:  img elements must have an alt prop, either with meaningful text, or an empty string for decorative images  jsx-a11y/alt-text

Search for the keywords to learn more about each warning.
To ignore, add // eslint-disable-next-line to the line before.
```
When you enter the `npm run serve` command, it compiles the source code and creates a web server. In the process of compiling the code, it uses ESLint to perform a static analysis of the code written in JavaScript, JSX. ESLint helps you to find syntax errors, anti-patterns and to write the source code in a consistent code style. For more detail is [about ESLint](https://eslint.org/docs/about/). The message above is that ESLint has detected out-of-rule source code. If you only want a static analysis of the code you wrote, use `npm run lint`.

Back in the meaning of the message, ESLint says img elements should have an `alt` property. That's right. When you use the `<img />` tag, it is recommended to define an `alt` property for accessibility failure to load the image. More info is available on [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img). We'll add the `alt` property to the tag as follows. See if it is compiled successfully.
```js
<img src="//loremflickr.com/300/300/kitten" alt="Kitten" />
```

In the Step 2 we'll start to make our app more flexible and composable,
as well as dive into another new feature of ES6: `=>` arrow functions.

**Next step: [Kitten Browser: Step 2](../reusable-components/)**
