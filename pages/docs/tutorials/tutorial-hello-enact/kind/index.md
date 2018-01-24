---
title: Introducing kind()
---

In [Part 2](../adding-css/), we expanded our basic application with classes imported from a CSS Module.  Next up is
[discussing Stateless Functional Components (SFCs)](#stateless-functional-components), why we consider them to be the
foundation of any application and [introducing our factory](#introducing-kind) for SFCs, `@enact/core/kind`.

## Stateless Functional Components

Both the power and utility of SFCs lies in their simplicity. They are simply functions that accept
properties and return an element. That makes them [easy to understand](#understanding-an-sfc), very
[testable](#testing-sfcs) and easier to [optimize for rendering](#pure-functions).

### Understanding an SFC

Since SFCs are primarily responsible for mapping properties to markup, they are usually very easy to
follow. Most, if not all, SFCs you write will accept a single argument, `props`, which will provide
all the external data you need. You may need to manipulate or adapt these properties and then inject
them wherever they are required in the component.

The `const App` in the code example below is an SFC.

### Testing SFCs

Because SFCs are using only the `props` provided to create their markup, unit
tests on those transformations do not have to worry about the internal state of the component or mock
out complex external services.

### Pure Functions

Though not a requirement, SFCs should be designed as pure functions, which means that their output is only dependent upon the arguments provided and no external factors (e.g. external
modules or impure language features such as `Date.now()`). If a function is pure, we can optimize
its render process by caching the outcome for a given set of input `props`.

## Introducing `kind()`

Although creating an SFC is itself a relatively straightforward process, there is an amount of
boilerplate code that we felt could be safely and efficiently abstracted away behind a framework
capability -- `@enact/core/kind`.

There are several features of `kind()` that you may find useful but we'll only introduce one here.
The others will be covered as those features are added to our example application.

### Updating App.js

Here's the updated App module (`./src/App/App.js`) in its entirety:

	import kind from '@enact/core/kind';
	import React from 'react';
	
	import css from './App.less';
	
	const App = kind({
		name: 'App',
	
		styles: {
			css,
			className: 'app'
		},
	
		render: function (props) {
			return (
				<div className={props.className}>
					Hello Enact!
				</div>
			);
		}
	});
	
	export default App;
	export {App};

### `@enact/core`

We've divided the framework into a few discrete modules to make it easy to know where to find
capabilities while only including what you actually use in your application. `@enact/core` contains
the base capabilities necessary to build an Enact application, of which `kind()` is the most used.

	import kind from '@enact/core/kind'

### `kind()`

The `kind()` factory accepts an object that describes the component. 

	const App = kind({

> If you've used Enyo 2, this may look familiar. While the usage is intentionally similar, the
> outcome is rather different, as it creates an SFC rather than an object constructor.

#### Component Name

`name` is not required but recommended, as it makes both debugging and testing your component easier.
By including it, you will be able to find your App's component in the [React Developer Tools](https://facebook.github.io/react/blog/2015/09/02/new-react-developer-tools.html)
by name and find instances of it in testing frameworks like [enzyme](https://github.com/airbnb/enzyme).

		name: 'App',

#### Style Handling

`styles` is an optional key that provides several useful features. First, it automatically joins
classes sent (through `props.className`) from the containers of your components with the static classes you've defined for the
component. In other words, if you wish to add a custom CSS class to a single instance of your
component but want to retain the static class, you can achieve this by using styles with no extra
code. Second, it automatically resolves classes to CSS module names if the `css` subkey is provided.

For our App component, we've configured `kind()` to resolve `'app'` to the locally-scoped class name
in our CSS module, `css`, and concatenate it with the `className` provided to our component. The
result of this concatenation is published in the `classes` property, which we'll see [demonstrated
below](#rendering).

> `styles` will always apply the component classes *before* classes from props.

		styles: {
			css,
			className: 'app'
		},

> **ES6 Object shorthand**
>
> You may have noticed that we've specified the `css` key without a value (or is it the value
> without the key?!?) in the object literal. We're taking advantage of an ES6 feature that allows
> you to pass a variable as an object property if the name of variable matches the desired name of
> the key. So, by naming our CSS Module import `css`, we're able to pass it directly to `styles`
> without the extra key name (`css: css`).
>
> More information on object initialization in ES6 can be found on [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#New_notations_in_ECMAScript_2015)
> or the [spec](http://www.ecma-international.org/ecma-262/6.0/#sec-object-initializer).

#### Rendering

The only required key is `render`, which expects its value to be the SFC itself. You'll notice that
we're accepting a single argument, `props` and passing the `className` property from that object to
the `className` property of the `<div>` DOM node.

		render: function (props) {
			return (
				<div className={props.className}>
					Hello Enact!
				</div>
			);
		}
	});

## Conclusion

While we didn't add much new functionality, we instead laid the groundwork for future features that
will be enabled by the capabilities of `kind()`. We covered the benefits of SFCs and how to create
them using the `kind()` factory. Next, we'll show how the styling and features of Moonstone can be
easily added to our application.

**Next: [Adding Moonstone Support](../adding-moonstone-support/)**
