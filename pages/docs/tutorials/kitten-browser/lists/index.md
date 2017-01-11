---
title: Repeaters and Lists
---
<!--
* Component: Repeater
  * `childComponent` - what type of component is repeated
  * `indexProp` - which property on `childComponent` instance receives the index - defaults to `data-index`
  * `childProp` - which property on `childComponent` instance receives the data ~= `children[index]` - defaults to `children`
  * `children` of Repeater can be an array of anything provided that the `childComponent` specified can handle it
* Concept: Destructuring
  * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
  * http://www.ecma-international.org/ecma-262/6.0/#sec-destructuring-assignment
  * Enhance Kitten
    * add styles to layout images in a grid
    * add support for `index` prop to get unique images
* Concept: Template Literals
    * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
    * http://www.ecma-international.org/ecma-262/6.0/#sec-template-literals
* Convention: explain Base and default exports
* Concept: introduce rest operator (order in arglist and attributes)
  * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_operator
* Convention: props and rest
* Convention: delete invalid props from rest
-->

In the [second step](../reusable-components/), we started breaking down our app into reusable components. Next, we'll introduce Repeaters and Lists to help us stamp out multiple instances of a component. Along the way, we'll also cover a few more ES6 concepts: destructuring, template literals, and the rest operator.

## Repeaters and Lists

A list is a basic building block for any application. Whether its a grid of images (as in our case), a newsfeed, a product catalog, or shopping cart, each can be implemented by a component that maps an array of data onto an array of component instances. The most basic version in Enact is the `Repeater`.

### Repeater

`Repeater` requires two props: `childComponent`, indicating the component to be repeated, and `children`, providing the data to pass to each `childComponent`. `childComponent` can be either an SFC, a React.Component, or a string representing a DOM node name. `children` must be an array, but the contents of the array depends upon the component being repeated.

	<Repeater
		childComponent={/* SFC | React.Component | string */}
	>
		{/* Array */}
	</Repeater>

For Kitten Browser, `Kitten` will be the `childComponent` and we'll add an array of names as our data source, since our photos are random. We've also included an optional prop for Repeater, `indexProp`, which configures the property of `childComponent` that will receive the index of the data within the array.

Below are the updates to `./src/App/App.js`; the rest of the source has been omitted for brevity.

	import Repeater from '@enact/ui/Repeater';
	
	const kittens = [
		'Garfield',
		'Nermal',
		'Simba',
		'Nala',
		'Tiger',
		'Kitty'
	];
	
	const AppBase = kind({
		name: 'App',
	
		render: (props) => (
			<div className={props.className}>
				<Repeater childComponent={Kitten} indexProp="index">
					{kittens}
				</Repeater>
			</div>
		)
	});

## Updating Kitten for Repeater

If you've been running the app as we go, you likely noticed a couple issues after adding Repeater -- all of the instances of Kitten were stacked vertically and the images were all the same. The first issue is solvable with some CSS to properly format our component. Let's add a new file, `./src/components/Kitten/Kitten.less`, with the following contents: 

	.kitten {
		display: inline-block;
		padding: 12px;
		text-align: center;
	}

And within `Kitten.js`, add the `import` ...

	import css from './Kitten.less'

... as well as the `styles` block to apply the class.

	styles: {
		css,
		className: 'kitten'
	},

This will allow the images to be displayed inline and will add some basic visual styling.

The second issue will require us to take advantage of the `index` property we configured on the Repeater. [loremflickr](http://loremflickr.com)'s API allows us to select a different image with the same parameters using the `random` query string parameter. Since we externalized the URL generation to a query string parameter, we'll update that function to forward our `index` prop along as the value of the `random` parameter.

	computed: {
		url: ({index, size}) => {
			return `//loremflickr.com/${size}/${size}/kitten?random=${index}`;
		}
	},

We've introduced a couple new ES6 features in this update. The unique function parameter in the computed property above is an example of destructuring and the back tick string is a template literal. Both are covered in more detail below.

### Destructuring

[Destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) ([spec](http://www.ecma-international.org/ecma-262/6.0/#sec-destructuring-assignment)) is a new language feature of ES6 that allows you to extract the properties of an object into local variables. The basic syntax is:

	const obj = {a: 1, b: 2, c: 3};
    const {a, b} = obj; // == const a = obj.a, b = obj.b;

The basic syntax assumes you want the local variable to match the name of the property. You can also rename the local variable by appending `: newName`:

    const {a: myA, b} = obj; // == const myA = obj.a, b = obj.b;

As you saw above, you can also destructure an object received as an argument to a function:

	url: ({index, size}) => {	// == url: (props) => { const index = props.index, size = props.size;
		return `//loremflickr.com/${size}/${size}/kitten?random=${index}`;
	}

Destructuring is particularly useful in React because your render methods and computed properties will receive their input as a property object, which you can deconstruct into the relevant properties.

### Template Literals

[Template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) ([spec](http://www.ecma-international.org/ecma-262/6.0/#sec-template-literals)) are a new string type in ES6 that support multi-line strings, expression interpolation, and tagged templates.

Although an in-depth exploration of template literals is out of scope for this tutorial, it is worth noting that we've used expression interpolation in our computed `url` prop. Within a template literal, an expression is denoted by a leading `${`, followed by the expression, with a closing `}`. Our example only inserts a variable, but any valid JavaScript expression can be used within the delimiters.

### Rest and Spread Operators

The final new ES6 features we'll introduce here are the rest and spread operators. You will often see these used within an SFC's render method. When used with destructuring, the rest operator places any property not destructured into a new object. The following example destructures `children` and `url` and places any remaining properties in the `rest` object.

    render: ({children, url, ...rest}) => {

The spread operator spreads the properties of an object into a new object. In JavaScript, the spread operator can be used to clone an object or merge it with another.

    const obj = {a: 1, b: 2, c: 3};
    const cloned = {...obj};		// = {a: 1, b: 2, c: 3}
    const merged = {...obj, d: 4};	// = {a: 1, b: 2, c: 3, d: 4}

When used with additional properties, the order in which the spread operator is used is important. Any properties with conflicting names that precede the spread object will by overwritten by the object and any properties with conflicting names that follow the spread object will overwrite the object.

    const obj = {a: 1, b: 2, c: 3};
    let merged = {a: 4, ...obj};		// = {a: 1, b: 2, c: 3}
    merged = {...obj, c: 4};			// = {a: 1, b: 2, c: 4}

The spread operator can also be used within an expression in JSX to pass any properties not explicitly used onto another component. This is a useful way to allow standard properties (e.g. `className` and `style`), event handlers, or other valid DOM attributes to be specified on your component without explicitly routing them yourself.

Below, we've spread `rest` to our root element. This allows `className` (which was injected by the `styles` block) to be applied to our root element automatically, as well as any other props passed into our component.

	render: ({children, url, ...rest}) => {
		return (
			<div {...rest}>
				<img src={url} />
				<div>{children}</div>
			</div>
		);
	}

> The convention in Enact is to use `rest` as the variable name for the remaining props. It is semantically clear (the `rest` of the props) and less ambiguous than `props` which could refer to all the props.

### Omitting Invalid Props

If you have updated the app as we've been going, you might have noticed a warning in the console when running the app.

    warning.js:36 Warning: Unknown prop `index` on <div> tag.

Quoting the [React docs](https://facebook.github.io/react/warnings/unknown-prop.html):

> The unknown-prop warning will fire if you attempt to render a DOM element with a prop that is not recognized by React as a legal DOM attribute/property. You should ensure that your DOM elements do not have spurious props floating around.

In other words, if your component declares properties that are not valid HTML attributes *and* you are using the spread operator to push the remaining props onto the root element, you must first remove those custom props to prevent them from being applied to the DOM node. The convention in Enact is to delete each prop individually from `rest`.

	render: ({children, url, ...rest}) => {
		delete rest.size;
		delete rest.index;
	
		return (
			<div {...rest}>
				<img src={url} />
				<div>{children}</div>
			</div>
		);
	}

## Conclusion

We've introduced the Repeater component to give us a litter of kittens and several new ES6 features including destructuring, template literals, and the complementary rest and spread operators to reduce our coding boilerplate to a minimum.

**Next: [Organizing your App with Panels](../panels/)**

Also, here's the complete source of the App and Kitten components which incorporates all of our changes from above:

**./src/components/App/App.js**

	import kind from '@enact/core/kind';
	import MoonstoneDecorator from '@enact/moonstone/MoonstoneDecorator';
	import React from 'react';
	import Repeater from '@enact/ui/Repeater';
	
	import Kitten from '../components/Kitten';
	
	const kittens = [
		'Garfield',
		'Nermal',
		'Simba',
		'Nala',
		'Tiger',
		'Kitty'
	];
	
	const AppBase = kind({
		name: 'App',
	
		render: (props) => (
			<div className={props.className}>
				<Repeater childComponent={Kitten} indexProp="index">
					{kittens}
				</Repeater>
			</div>
		)
	});
	
	const App = MoonstoneDecorator(AppBase);
	
	export default App;
	export {App, AppBase};

**./src/components/Kitten/Kitten.js**

	import kind from '@enact/core/kind';
	import React from 'react';
	
	import css from './Kitten.less';
	
	const KittenBase = kind({
		name: 'Kitten',
	
		propTypes: {
			children: React.PropTypes.string,
			index: React.PropTypes.number,
			size: React.PropTypes.number
		},
	
		defaultProps: {
			size: 300
		},
	
		styles: {
			css,
			className: 'kitten'
		},
	
		computed: {
			url: ({index, size}) => {
				return `//loremflickr.com/${size}/${size}/kitten?random=${index}`;
			}
		},
	
		render: ({children, url, ...rest}) => {
			delete rest.size;
			delete rest.index;
	
			return (
				<div {...rest}>
					<img src={url} />
					<div>{children}</div>
				</div>
			);
		}
	});
	
	export default KittenBase;
	export {KittenBase as Kitten}; 
