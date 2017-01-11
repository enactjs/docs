---
title: Organizing Your App with Panels
---
<!--
* Concept: Break Into Views
* Component: Panels
  * Activity, AlwaysViewing
  * Header & Panel
* Concept: Slots
-->

In the [previous step](../lists/) we built our list view and added some formatting to the Kitten component. Now, learn about the Panels components and move our list view into its own panel.

## Creating a Panel

Let's start by creating a new view component, `Detail`, which will be the future home of a detail view when a kitten is selected from the list view. We'll `import` the `Panel` component as well as its `Header`. Unlike the other components we've encountered, the Panels-related components are all exposed as named exports on the `@enact/moonstone/Panels` module. Since they are generally used together, bundling them into a single module makes importing them a bit simpler.

**./src/views/Detail.js**

	import {Header, Panel} from '@enact/moonstone/Panels';
	import kind from '@enact/core/kind';
	import React from 'react';
	
	const genders = {
		m: 'Male',
		f: 'Female'
	};
	
	const DetailBase = kind({
		name: 'Detail',
	
		propTypes: {
			color: React.PropTypes.string,
			gender: React.PropTypes.string,
			name: React.PropTypes.string,
			weight: React.PropTypes.number
		},
	
		defaultProps: {
			gender: 'm',
			color: 'Tabby',
			weight: 9
		},
	
		render: ({color, gender, name, weight, ...rest}) => (
			<Panel {...rest}>
				<Header title={name} />
				<div>Gender: {genders[gender]}</div>
				<div>Color: {color}</div>
				<div>Weight: {weight}oz</div>
			</Panel>
		)
	});
	
	export default DetailBase;
	export {DetailBase as Detail, DetailBase};

Hopefully, the code for a SFC is beginning to look pretty familiar. We've declared a few props that our component will support. Since our data is only names, we've also added some default values to fill out the screen. We don't need any [computed properties](../reusable-components#computed) right now nor any [custom CSS](../../hello-enact/kind#style-handling) so both of those keys have been omitted. The render method simply returns a Panel with a Header and some content.

There are a couple of things to discuss, however. First, we want to add a [`propType` validator](#more-advanced-proptypes) function on `gender`. Second, there is a bit of magic going on here with Panel and Header: [the `Slottable` HOC](#using-slottable-to-distribute-children).

> When you define props in `propTypes` and `defaultProps`, the props names should be ordered alphabetically. See [sort-prop-types](https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/sort-prop-types.md) for more information.

### More Advanced PropTypes

We have a small problem with our `Detail` view. We don't validate that the gender we receive matches one of the genders we expect. One way we can address that is to use `propTypes` to validate that we only receive the data we expect (at least, while we're running the app in development mode). We can quickly change the validator to check the data for us:

	gender: React.PropTypes.oneOf(['m', 'f']),

Using `React.PropTypes.oneOf()` allows us to specify a list of acceptable values for `gender`. In addition to the primitives we've used previously, React provides [other validator functions](https://facebook.github.io/react/docs/reusable-components.html#prop-validation) you can use to limit possible values like above or validate more complex properties.

> Validators, as mentioned, only run when in development mode. Further, they only warn if there is a problem. It's still possible to pass bad data in. When data may come from sources you don't control, you'll want perform more validation, perhaps in a `computed` section.

### Using `Slottable` to Distribute Children

The `Slottable` HOC was inspired by the [Web Components Slot API](https://developers.google.com/web/fundamentals/primers/shadowdom/?hl=en#composition_slot) as a means for consumers of a component to use a more semantic and "markup friendly" interface to its internal API. In general, you won't need to know if a component is using `Slottable` but it's worth spending a little time understanding how it works.

`Slottable` works by mapping children to props. This means that the component author is able to write idiomatic React components relying only on props whereas the component consumer can 
write more "markup friendly" code. The primary use case for `Slottable` is when a component expects a property to receive one or more elements rather than a primitive value.

Consider the case of the `header` property of Panel. The React way to specify a component for that property would be:

	<Panel header={<Header title="Title" />}>
		<div>Panel Body</div>
	</Panel>

With `Slottable`, you can write either the above code or the following:

	<Panel>
		<Header title="Title" />
		<div>Panel Body</div>
	</Panel>

This works because Panel has configured a `header` slot and the Header component has been pre-configured to use the `header` slot using a `defaultSlot` property set on the Header component. Another way to specify the target slot for a component is to add the `slot` property to your component instance. In this example, the first `<div>` tag will be mapped to the `header` property.

> Note that the `slot` property will be removed from the `<div>` before being passed to the receiving component.

	<Panel>
		<div slot="header">Title</div>
		<div>Panel Body</div>
	</Panel>

## Refactoring the List View

With the basics of `Panels` under our belts, refactoring our list into a `Panel` should be straightforward. We've only declared a single property, `children`, which will receive the array of kittens to display. The render method contains the same `Panel` setup code as above with the addition of the Repeater code from `./src/App/App.js`.

**./src/views/List.js**

	import {Header, Panel} from '@enact/moonstone/Panels';
	import kind from '@enact/core/kind';
	import React from 'react';
	import Repeater from '@enact/ui/Repeater';
	
	import Kitten from '../components/Kitten';
	
	const ListBase = kind({
		name: 'List',
	
		propTypes: {
			children: React.PropTypes.array
		},
	
		render: ({children, ...rest}) => (
			<Panel {...rest}>
				<Header title="Kittens!" />
				<Repeater childComponent={Kitten} indexProp="index">
					{children}
				</Repeater>
			</Panel>
		)
	});
	
	export default ListBase;
	export {ListBase as List, ListBase};

## Panels

Moonstone provides 3 different patterns for a `Panels`-based app -- basic, activity and always viewing. The basic pattern is the default export from `@enact/moonstone/Panels` and it provides a simple single Panel view filling the entire screen. The activity pattern, available as the named export `ActivityPanels`, is similar except that it allocates space on the left side for a single breadcrumb, allowing the user to navigate to the previous Panel. The always viewing pattern, available as the named export `AlwaysViewingPanels`, restricts the Panel to the right half of the screen with the left half used for multiple breadcrumbs.

Our Kitten Browser will use `ActivityPanels`, with the `List` as the first view and `Detail` as the second. We've kept the data here and will pass that down to `List` as `children`. It's also notable that we're using the spread operator on props directly. We don't need to deconstruct any props for our `App` component so we'll pass everything on to `ActivityPanels`.

	import {ActivityPanels} from '@enact/moonstone/Panels';
	import kind from '@enact/core/kind';
	import MoonstoneDecorator from '@enact/moonstone/MoonstoneDecorator';
	import React from 'react';
	
	import Detail from '../views/Detail';
	import List from '../views/List';
	
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
			<ActivityPanels {...props}>
				<List>{kittens}</List>
				<Detail />
			</ActivityPanels>
		)
	});
	
	const App = MoonstoneDecorator(AppBase);
	
	export default App;
	export {App, AppBase};

## Conclusion

In this fourth step of Kitten Browser, we've introduced the `Panels` components and how `Slottable` makes it easy to distribute children into a component in a more semantic and markup friendly format.

**Next: [State and Data Management](../data-and-state/)**
