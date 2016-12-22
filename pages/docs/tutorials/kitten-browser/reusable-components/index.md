---
title: Reusable Components
---
<!--
* Concept: Componentization - breaking down the app into components promotes separation of concerns and improves maintainability.
* Concept: Properties
  * propTypes, defaultProps
* Component: computed
* Concept: Arrow Functions
* Concept: Children
-->

In the [first step](../app-setup/), we introduced our sample app and set up the scaffolding. Next, let's start to break down the app into discrete components and learn how to define and configure a component using `propTypes`, `defaultProps`, and `computed` properties.

## Componentization

As your application grows, it will become difficult to maintain if all the code lives in `App.js`. Enter components! We've already created our App component using the `kind()` factory. Now let's create a Kitten component to encapsulate the view and behavior of each photo in our browser.

> Although it isn't required to put components into their own modules, it's a good practice that often improves maintainability and enforces separation of concerns between components.

### Creating a Kitten Component

Create `./src/components/Kitten/Kitten.js` and add the following contents:

	import kind from '@enact/core/kind';
	import React from 'react';
	
	const KittenBase = kind({
		name: 'Kitten',
	
		propTypes: {
			children: React.PropTypes.string,
			size: React.PropTypes.number
		},
	
		defaultProps: {
			size: 300
		},
	
		computed: {
			url: (props) => {
				return "//loremflickr.com/" + props.size + "/" + props.size + "/kitten";
			}
		},
	
		render: (props) => (
			<div>
				<img src={props.url} />
				<div>{props.children}</div>
			</div>
		)
	});
	
	export default KittenBase;
	export {KittenBase as Kitten};

You'll also need a `package.json` in the same directory to indicate the module's entry point.

    {
        "main": "Kitten.js"
    }

## Arrow Functions

Let's take this opportunity to introduce a new ES6 feature: [arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) ([spec](http://www.ecma-international.org/ecma-262/6.0/#sec-arrow-function-definitions)). Arrow functions are a more terse way to define functions in JavaScript that lexically bind the `this` value.

> In practice, 'lexical binding' means that within an arrow function, `this` will point to the same `this` as the context in which the arrow function was defined. More info is available on [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#Lexical_this) or [ExploringJS](http://exploringjs.com/es6/ch_arrow-functions.html#_ecmascript-6-solution-arrow-functions).

Arrow functions can also omit the braces if followed by a single JavaScript expression. With this syntax, the result of evaluating the expression will be returned from the function. To illustrate, the following examples are functionally equivalent (ignoring the scoping of `this`).

	// Named Function expression
	function sum (a, b) {
		return a + b;
	}
	
	// Unnamed function expression
	const sum = function (a, b) {
		return a + b;
	}
	
	// "Basic" arrow function
	const sum = (a, b) => {
		return a + b;
	}
	
	// "Advanced" arrow function
	const sum = (a, b) => (a + b);

> When using Advanced arrow functions with JSX, we recommend wrapping the JSX with parenthesis. They aren't required but the result is more readable and consistent with traditional functions or basic arrow functions that must use parenthesis for multi-line JSX.

> More on [how `return` behaves with new lines](http://lucumr.pocoo.org/2011/2/6/automatic-semicolon-insertion/) and [examples with JSX](https://goo.gl/7kI5oT) and the transpiled result.

You may notice that we used both methods of returning data from an arrow function in our `Kitten` component (in the `computed` property and the `render` method).

## Properties

### `propTypes` Property

The `propTypes` property is a design-time tool to help consumers of a component provide the right kind of data to a component. By specifying `propTypes`, React will warn in the console in development mode if a property does not pass validation. React provides a number of built-in [validators](https://facebook.github.io/react/docs/reusable-components.html#prop-validation). You can also define custom validators, but that is outside the scope of this tutorial.

By defining properties for every component, even if you're the only user of it, you have to make intentional decisions about the interface, think through the data the component needs and understand how it will be used.

In our example, we've defined two properties: `children`, a string, and `size`, a number.

	propTypes: {
		children: React.PropTypes.string,
		size: React.PropTypes.number
	},

> If we wanted to indicate a property is required, we'd append `.isRequired` to the validator -- `children: React.PropTypes.string.isRequired`. All of React's validators provide the `.isRequired` version of the validator out of the box. If you have created a custom validator, you can decorate it with `.isRequired` using the `withRequired()` function from `@enact/ui/validators`.
>
> ```
> import {withRequired} from '@enact/ui/validators';
> // myValidator will be the function passed to withRequired() with a static property, .isRequired,
> // that will first validate the property exists before calling the provided validator.
> const myValidator = withRequired(function () {});
> ```

### `defaultProps` Property

If you wish to make a property optional with a default value, you can define those defaults within the `defaultProps` object. You do not need to define a default value for every property. In particular, if a property is a string to be displayed or a boolean that is false by default, it is unnecessary to provide a default.

	defaultProps: {
		size: 300
	},

### `computed` Property

Computed properties for SFCs are a feature unique to Enact and, specifically, the `kind()` factory. The purpose of computed properties is to extract logic that would otherwise live inside the render method in order to keep the render method purely responsible for merging props and markup.

A computed property is defined within the `computed` object passed to `kind()` and consists of name and a function. The function will receive the props provided to the component with the `defaultProps` applied. It **will not**, however, receive the value of other computed props as all computed props are evaluated from the source props and then the results are merged together before passing on to `render()`.

To externalize the URL generation, we've added a computed prop that takes `size` and builds the URL to [loremflickr](http://loremflickr.com).

	computed: {
		url: (props) => {
			return "//loremflickr.com/" + props.size + "/" + props.size + "/kitten";
		}
	},

### Updating `App.js`

Back in the App component (`./src/App/App.js`), let's import our new component and place an instance of it in place of the markup we refactored out. We're omitting `size` to illustrate using the default value. You might also notice that we haven't included `children` explicitly and instead given `<Kitten>` text content. This is possible in JSX because `children` is treated uniquely to allow React components in JSX to be authored more like markup.

	import kind from '@enact/core/kind';
	import MoonstoneDecorator from '@enact/moonstone/MoonstoneDecorator';
	import React from 'react';
	
	import Kitten from '../components/Kitten';
	
	const AppBase = kind({
		name: 'App',
	
		render: (props) => (
			<div className={props.className}>
				<Kitten>
					Garfield
				</Kitten>
			</div>
		)
	});
	
	const App = MoonstoneDecorator(AppBase);
	
	export default App;
	export {App, AppBase};

## Children in React

When you use JSX, the contents of an element will be evaluated and set as the `children` of that element. Each child can be any renderable type, which includes strings, numbers, and React elements. Other primitives must be converted to one of these types to be included as a child.

	<MyComponent>
		Some Text Content
		{1}
		{JSON.stringify({b: 2})}
		<AnotherComponent />
	</MyComponent>

`children` is, however, just a prop and can be set directly via a JSX attribute, though that is not recommended.

	<div>
		{/* Don't do this! */}
		<MyComponent children="Some Text Content" />
		{/* Use this instead */}
		<MyComponent>Some Text Content</MyComponent>
	</div>

> Typically, the `children` prop received by a component will be an array of elements. However, if a single element is passed, `children` will not be an array. `children` should be considered an opaque data structure. To inspect or iterate over it, you should use the [Children](https://facebook.github.io/react/docs/top-level-api.html#react.children) utilities provided by React.

## Conclusion

![Kitten Browser Step 2](KittenBrowser-Step2.png)

In this step we've encapsulated the logic for a single Kitten photo in a new component and explored how to configure that component. In the next section, we'll show how to create a grid of photos, add some formatting to our component, and introduce a couple more ES6 features.

**Next step: [Kitten Browser: Step 3](../lists/)**