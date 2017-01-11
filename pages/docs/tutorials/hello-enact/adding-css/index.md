---
title: Adding CSS
---
With our [basic Hello Enact!](../basics/) app built and running, we can start to expand
it by adding some styling. The first stop is defining and managing [CSS classes in React](#css-classes-in-react) followed by exploring [CSS modules](#introducing-css-modules).

## CSS Classes in React

CSS classes are the primary tool for adding visual styling to applications. Classes are assigned
to components using the `className` property. 

	<div className="customClass">Content</div>

... which renders into the DOM as the rather similar ...

	<div class="customClass">Content</div>

> You might expect JSX to use `class` to mirror HTML but that isn't possible since JSX is ultimately
> transpiled to JavaScript, in which `class` is a reserved word. See [DOM
> Differences](https://facebook.github.io/react/docs/dom-differences.html) for other instances where
> JSX deviates from HTML and the Document Object Model (DOM).

> You might be tempted to use hyphenated class names (`custom-class`), 
> but [CSS Modules](https://github.com/css-modules/css-modules), which will soon be covered, 
> recommends using camelCased naming for local class names (see [Naming](https://github.com/css-modules/css-modules#naming)).

For simple applications, global class names are easy to use and understand. For more complex applications,
you will likely want a way to organize your CSS to improve maintainability and reuse. There are
several methodologies (e.g. [Object-Oriented CSS (OOCSS)](http://oocss.org/), [Block Element
Modifier (BEM)](http://getbem.com/), and a host of others) and pre-processors (e.g. [SASS](http://sass-lang.com/),
[Stylus](http://stylus-lang.com/), [LESS](http://lesscss.org/)) that offer
different solutions to this problem.

CSS Modules offers another option that works well with other tools and methodologies by focusing on
a narrow concern -- modularization.  This is the method that the Enact team recommends.

## Introducing CSS Modules

[CSS Modules](https://github.com/css-modules/css-modules) is a specification that allows authors to
write CSS (or SASS or LESS or ...) using short, meaningful class names without being concerned about
naming conflicts that may arise when using multiple global stylesheets.

All classes defined in a CSS Module are local by default. In practice, that means that they are
renamed at compile-time to a unique string. In order to use these generated class names, the CSS
Module exports a map of authored names to generated names. For example, the following CSS Module:

	.customClass {
		background: red;
		color: white;
	}

would export an object similar to the following:

	{
		customClass: '_13LGdX8RMStbBE9w-t0gZ1'
	}

It's also possible to declare classes be global using the `:global` pseudo-selector, which prevents
the name mangling and makes the class reusable across components using the authored name.

	:global .customClass {
		background: red;
		color: white;
	}

Would export:

	{
		customClass: 'customClass'
	}

> We discourage using global classes with CSS modules because it creates an implicit dependency
> between your component and the CSS source file containing the global class. Implicit dependencies
> are not tracked by the build tools and may be omitted if the resources *explicitly* depends
> upon them are no longer included.

### Creating a LESS file

Let's create a `./src/App/App.less` file for our fantastic styling.

> The webpack config provided by `enyo-config` includes support for the LESS preprocessor, so we've
> used that file extension here, even though we're only using standard CSS syntax.

	.app {
		font-size: 48px;
	}

## Using CSS Modules

From your component's perspective, a CSS module is treated like any other module. You can `import`
it to make it a dependency of your component and to obtain a reference to the class name map.

> By convention, we import a component's stylesheet into the `css` variable. In addition to the
> consistency benefit, it also provides a minor efficiency boost we'll see later.

### Modify App.js

Let's make two changes to our App module (`./src/App/App.js`) to import CSS module and to apply the
`.app` style to our root element.

	import React from 'react';
	
	import css from './App.less';
	
	const App = function () {
		return (
			<div className={css.app}>
				Hello Enact!
			</div>
		);
	};
	
	export default App;
	export {App};

## Expressions in JSX

You might have noticed that the JSX in the sample above deviates from standard HTML.  Notably, the use of the curly brackets ({}) around our `css` variable.  We can't use
the string, `"app"`, because that would reference a global CSS class rather than the locally-scoped
class name from our CSS module. Instead, we're using a JSX expression which allows us to embed any
valid JavaScript expression within our JSX markup. The following will evaluate the expression,
`css.app`, and pass the result as the value of the `className` property for the `<div>`.

	<div className={css.app}>

> *JSX expressions* can be used for property values or entire elements but not component names or
> property names.
>
> **Valid**
> ```
> <div className={a ? b : c} />				// ✅ property value
>	{a ? <span>A</span> : <span>!A</span>}	// ✅ entire child of <div>
> </div>
> ```
> 
> **Invalid**
> ```
> <{a ? 'div' : 'span'}>						// ❌ component name
>	<span {a ? b : c}="value" />				// ❌ property name
>	<span {a ? b="value" : c="value"}			// ❌ entire property
> ```

## Conclusion

In this part we've explored [applying CSS classes](#css-classes-in-react) to React components, [importing
locally-scoped classes](#introducing-css-modules) from a CSS module, and [using expressions
](#expressions-in-jsx) in JSX to add dynamic properties and elements to our JSX.

In the next part, we'll introduce `kind()`, which adds some
syntactic sugar around creating [Stateless Functional Components
(SFCs)](https://facebook.github.io/react/docs/reusable-components.html#stateless-functions).

**Next: [Introducing `@enact/core/kind`](../kind/)**