---
title: App Setup
---
<!--
* Concept: App Scaffolding
* Concept: JSX - syntax and comments
-->

To explore some more interesting features of ES6, React, and Enact, we're going to pivot from our
[Hello, Enact!](../../hello-enact/) app to a new app: Kitten Browser. In this step, we will setup the
module and create the initial App component to lay the foundation for the rest of
the guide.

> We'll use the placeholder image site [LoremFlickr](http://loremflickr.com/) to source our images.
> If you're not a fan of kittens, you're welcome to substitute a different keyword in the URLs.  No judgements.

## Setup

This app uses the same [setup](../../setup/) as Hello, Enact! (which you can copy to jump start things if you
followed that series). The directory structure is a bit different to account
for the new features and concepts we'll discuss later.

### Directory Structure

	+ App
		+ src						<-- All of our source code
			+ App					<-- The App component to be rendered into the DOM
				- App.js
				- package.json
			+ components			<-- Any reusable components for our App
				+ Kitten
					Kitten.js
					Kitten.less
					package.json
			+ views					<-- Composite components that make up a distinct view of the app
				Detail.js
				List.js
			- index.js				<-- The entry point for the module
		- package.json				<-- Module meta-data

### ./package.json

Let's give our module a name and establish its dependencies.  Edit `package.json` and update the `name` property.

	{
	  "name": "enact-kitten-browser",
	  "version": "1.0.0",
	  "main": "./src/index.js",
	  "scripts": { [omitted] },
	  "license": "Apache-2.0",
	  "dependencies": {
	    "@enact/core": "1.0.0-beta.1",
	    "@enact/moonstone": "1.0.0-beta.1",
	    "@enact/ui": "1.0.0-beta.1",
	    "react": "^15.4.1",
	    "react-dom": "^15.4.1"
	  }
	}

### ./src/index.js

	import React from 'react';
	import {render} from 'react-dom';
	
	import App from './App';
	
	render(
		<App />,
		document.getElementById('root') // provided by enact-dev's HTML template
	);

## App

### ./src/App/package.json

	{
		"main": "App.js"
	}

### ./src/App/App.js

At this point, our app looks a lot like [Hello, Enact!](../../hello-enact/kind#srcappappjs)
with a couple small changes. We won't need any custom CSS for our App component so we've removed that
`import`. We've also replaced the content with the basic markup for a single photo.

	import kind from '@enact/core/kind';
	import MoonstoneDecorator from '@enact/moonstone/MoonstoneDecorator';
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
	
	const App = MoonstoneDecorator(AppBase);
	
	export default App;
	export {App, AppBase};


#### JSX Hints

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

	npm run serve

![Kitten Browser Step 1](KittenBrowser-Step1.png)
> Tell the kids to avert their eyes!

In the Step 2 we'll start to make our app more flexible and composable,
as well as dive into another new feature of ES6: `=>` arrow functions.

**Next step: [Kitten Browser: Step 2](../reusable-components/)**
