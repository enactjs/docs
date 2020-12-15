---
title: State and Data Management
github: https://github.com/enactjs/docs/blob/develop/src/pages/docs/tutorials/tutorial-kitten-browser/data-and-state/index.md
order: 5
---

<!--
* Concept: Events
  * Notification not data flow
* Concept: React State Management
  * Selection
  * Navigation
* Component: introduce spotlight + spottable
  * explain how spottable works (onMouseOver, onMouseLeave, onClick, onKeyPress, mouse emulation)
-->

In the [last step](../panels/), we focused on the app structure with Panels. Next, we'll investigate how custom and native events are used to notify your app of user actions, how state is defined for the app, and how to use events to update the state of your app.  We'll wrap up with a brief discussion on how to manage state data.

## Events in React

[Native events in React](https://facebook.github.io/react/docs/events.html) are registered using the camelCase version (`onMouseDown`) of their native name (`onmousedown`). If you wish to be notified of an event, you can pass a function as the value for the appropriate prop. The function will receive a synthetic event as its first argument, which is a cross-browser wrapper around the original event.

React doesn't provide an explicit implementation of custom events. In Enact, custom events follow React's event name pattern of having an `on` prefix followed by the name of the event. Like native events, custom events will receive the event payload as the first argument but it will be a simple object, not a synthetic event.

## Defining our State

For our App, we have two pieces of state we need to manage: the active panel and the selected kitten. Both can be represented as numbers representing the index of the panel and the index of the kitten in `kittens`. We will also define two custom events, `onNavigate` and `onSelectKitten`, that we can use to indicate when each of those indices should change.

**./src/App/App.js**
```js
propTypes: {
	index: PropTypes.number,
	kitten: PropTypes.number,
	onNavigate: PropTypes.func,
	onSelectKitten: PropTypes.func
},

defaultProps: {
	index: 0,
	kitten: 0
},
```

We've also added default values for both indices. Including a default for `kitten` isn't necessary but makes our render logic a bit simpler by allowing us to assume a valid value before accessing the array.

## Connecting our Events

With our events defined on the interface of `App`, we need to pass them down the component tree and connect them to the native event that will ultimately trigger the action.

**./src/App/App.js**
```js
render: ({index, kitten, onNavigate, onSelectKitten, ...rest}) => (
	<Panels {...rest} index={index} onBack={onNavigate}>
		{/* omitted */}
	</Panels>
)
```

### Selection

`onSelectKitten` will eventually need to be connected to a `Kitten` element that the user can select. Since those are contained within our `List` view, we'll have to pass it through to that component first. To start, we'll add the handler to the `List` component and then work down the component tree until we reach the target DOM node. We'll also pass the selected kitten to our `Detail` view

**./src/App/App.js**
```js
render: ({index, kitten, onNavigate, onSelectKitten, ...rest}) => (
	<Panels {...rest} index={index} onBack={onNavigate}>
		<List onSelectKitten={onSelectKitten}>{kittens}</List>
		<Detail name={kittens[kitten]} />
	</Panels>
)
```

We're now passing a new property to List, so let's define it properly on the component. As before, we'll add a new entry to `propTypes` that expects a function. Next, we'll connect `onSelectKitten` to each Kitten element using the `itemProps` prop of Repeater. `itemProps` allow us to pass a static set of props to each repeated component. In this case, we'll define another new prop, `onSelect`, which will be called when the Kitten is selected.

**./src/views/List.js**
```js
propTypes: {
	children: PropTypes.array,
	onSelectKitten: PropTypes.func
},

render: ({children, onSelectKitten, ...rest}) => (
	<Panel {...rest}>
		<Header title="Kittens!" />
		<Scroller>
			<Repeater childComponent={Kitten} indexProp="index" itemProps={{onSelect: onSelectKitten}}>
				{children}
			</Repeater>
		</Scroller>
	</Panel>
)
```
### Custom Event Handlers

Finally, we'll define and connect `onSelect` to the right DOM node in Kitten. The `propType` is defined the same as before. This is the bottom of our custom component tree so we'll connect our custom `onSelect` event to `onClick` on the root DOM element. However, the `onClick` event will include a synthetic mouse event whereas we need `onSelect` to indicate the `index` of the Kitten selected. To adapt the DOM event to our custom event, we'll add a handler using the `handlers` block of `kind()` that takes the `onSelect` from props and calls it with the `index`.

The `handlers` block maps handlers to props and allows you to define event handlers whose references are cached thereby preventing unnecessary re-renders when properties change. In this example, the handler function will be passed to the component's `render` method in the `onCustomEvent` prop.
```js
handlers: {
	onCustomEvent: (ev, props, context) => {
		// process the event using props and context as necessary
	}
}
```
**./src/components/Kitten/Kitten.js**
```js
propTypes: {
	children: PropTypes.string,
	index: PropTypes.number,
	onSelect: PropTypes.func,
	size: PropTypes.number
},

defaultProps: { /* unchanged */ },

styles: { /* unchanged */ },

handlers: {
	onSelect: (ev, {index, onSelect}) => {
		if (onSelect) {
			onSelect({index});
		}
	}
},

computed: {
	url: ({index, size}) => {
		return `//loremflickr.com/${size}/${size}/kitten?random=${index}`;
	}
},

render: ({children, onSelect, size, url, ...rest}) => {
	delete rest.index;

	return (
		<div {...rest} onClick={onSelect}>
			<img src={url} alt="Kitten" width={size} height={size} />
			<div>{children}</div>
		</div>
	);
}
```
### Adding Spotlight Support

In [Hello, Enact!](../../tutorial-hello-enact/), we [introduced `ThemeDecorator`](../../tutorial-hello-enact/adding-sandstone-support/), which adds the base support for Spotlight in an application. All of our Sandstone controls that should be spottable support Spotlight out of the box. If you're creating a custom component, like we have in this example, you'll have to add that support yourself. Fortunately, in most cases, you can add Spotlight support by wrapping your component with the `Spottable` HOC.

**./src/components/Kitten/Kitten.js**
```js
import Spottable from '@enact/spotlight/Spottable';
const KittenBase = kind({ /* ... */ });
const Kitten = Spottable(KittenBase);

export default Kitten;
export {
	Kitten, 
	KittenBase
};
```
`Spottable` works by adding a custom CSS class and key event handlers which must be applied to the root DOM node. The class `spottable` is appended to the `className` prop to make the DOM node discoverable by the `@enact/spotlight` module. The event handlers, `onKeyDown`, `onKeyUp`, and `onKeyPress`, allow `@enact/spotlight` to support 5-way navigation between elements. These handlers are also injected to the props received by the component wrapped by `Spottable`.

These event handlers then must be attached to a DOM node in order for React to register the appropriate listeners. You can register them explicitly by setting each prop on the desired DOM node, but that tends to be a bit verbose.
```js
// applying each handler individually is repetitive
render: ({onKeyDown, onKeyUp, onKeyPress}) => (
	<div onKeyDown={onKeyDown} onKeyUp={onKeyUp} onKeyPress={onKeyPress} />
)
```
Instead, you'll most often apply these using the [rest and spread operators](../lists#rest-and-spread-operators). Since we have already used those in the render method of Kitten, no additional work was required for spotlight.

> **Advanced**
>
> In most cases, wrapping a component with Spottable is sufficient to make it navigable and selectable. However, in the case of Kitten, it won't be selectable because we've hijacked the `onClick` handler for our custom `onSelect` event. There is one of the solutions to make the `Kitten` selectable, to define the colors manually that will be used for the Spotlight effect when the `Kitten` is selected (in other words, when it's focused). We'll use the mixins provided by sandstone to set the background color and text color of the component when focus occurs on it. First, import the mixins into `./src/components/Kitten/Kitten.module.less` which defines the style of the `Kitten` component. Then, use focus class of the mixins with the desired color values. We'll use light-grey as the background color of the Spotlight, and black as the color of the text covered with Spotlight.

**./src/components/Kitten/Kitten.module.less**
```css
@import "~@enact/sandstone/styles/mixins.less";

.kitten {
	display: inline-block;
	padding: 22px;
	text-align: center;
	.focus({
		background-color:  #e6e6e6; // light-grey
		color: black;
	});
}
```

### Navigation

`onNavigate` is (mostly) simple because it will be passed to the `onBack` event of our `Panels` instance, which will handle the rest. The payload for the `onBack` event is an object with a single member, `index`, indicating the index of the panel. In other words, when the user selects the back button for the List view, `onBack` will be called with `index` equal to 0.

However, we do have one more requirement to handle: when a kitten is selected via `onSelectKitten`, we also want to navigate to the `Detail` view. In order to achieve this, we'll add a new handler to call `onSelectKitten` (adapted to use the `kitten` property rather than `index`) and `onNavigate` with a fixed `index` of `1` indicating the `Detail` view. Now, when the `onSelectKitten` handler is called from `List` (and ultimately `Kitten`), it will invoke our new function which combines both selection and navigation.

**./src/App/App.js**
```js
handlers: {
	onSelectKitten: (ev, {onNavigate, onSelectKitten}) => {
		if (onSelectKitten) {
			onSelectKitten({
				kitten: ev.index
			});
		}

		// navigate to the detail panel on selection
		if (onNavigate) {
			onNavigate({
				index: 1
			});
		}
	}
},
```
## Managing State

The final step to connecting everything together is to add state management on top of our App that will provide the event handlers, update its internal state, and provide that state to our App as props. In larger apps, you'll likely use [Redux](http://redux.js.org/) to manage your state but for our simple app we'll use React's built-in state management.

Enact ships with a set of configurable HOCs that can manage state for components. To keep things simple, we'll use one of those HOCs, `@enact/ui/Changeable`, to manage our `index` and `kitten` state properties.

`Changeable` is designed to manage a single value via a single handler that updates the value. Both the property name and the handler name are configurable by passing an object to `Changeable` as the first argument and your component as the second. Since we need to manage two properties, we'll use two instances of `Changeable` with unique configurations: one for `index` and `onNavigate` and one for `kitten` and `onSelectKitten`.

**./src/App/App.js**
```js
import Changeable from '@enact/ui/Changeable';
const AppBase = kind({ /* ... */ });
const App = Changeable({prop: 'index', change: 'onNavigate'},
	Changeable({prop: 'kitten', change: 'onSelectKitten'},
		ThemeDecorator(AppBase)
	)
);
```

> We wouldn't normally recommend managing your App's state this way but it's an easy way to get started. More advanced discussion of application state, and in particular Redux, is out of scope for this tutorial.
> If you would like to learn more about using Redux to manage application and component state, please see our [Introduction to Redux](../../../developer-guide/redux/redux-intro/)

## Conclusion

If everything has gone smoothly, you should now have a working Enact Kitten Browser with state managed by the `Changeable` HOCs flowing downstream via props and user actions flowing back upstream via events. This style of architecture will be useful as you build larger, more complex apps allowing you to decouple state and behavior from your components and views.

Below is the complete source for each of files modified in this tutorial which may be useful to see how the changes introduced above should be integrated together. You can get this source from our repository [Kitten Browser](https://github.com/enactjs/samples/tree/master/tutorial-kitten-browser).

**src/App/App.js**
```js
import kind from '@enact/core/kind';
import {Panels} from '@enact/sandstone/Panels';
import ThemeDecorator from '@enact/sandstone/ThemeDecorator';
import Changeable from '@enact/ui/Changeable';
import PropTypes from 'prop-types';
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

	propTypes: {
		index: PropTypes.number,
		kitten: PropTypes.number,
		onNavigate: PropTypes.func,
		onSelectKitten: PropTypes.func
	},

	defaultProps: {
		index: 0,
		kitten: 0
	},

	handlers: {
		onSelectKitten: (ev, {onNavigate, onSelectKitten}) => {
			if (onSelectKitten) {
				onSelectKitten({
					kitten: ev.index
				});
			}

			// navigate to the detail panel on selection
			if (onNavigate) {
				onNavigate({
					index: 1
				});
			}
		}
	},

	render: ({index, kitten, onNavigate, onSelectKitten, ...rest}) => (
		<Panels {...rest} index={index} onBack={onNavigate}>
			<List onSelectKitten={onSelectKitten}>{kittens}</List>
			<Detail name={kittens[kitten]} />
		</Panels>
	)
});

const App = Changeable({prop: 'index', change: 'onNavigate'},
	Changeable({prop: 'kitten', change: 'onSelectKitten'},
		ThemeDecorator(AppBase)
	)
);

export default App;
export {
	App, 
	AppBase
};
```
**src/views/List.js**
```js
import kind from '@enact/core/kind';
import {Header, Panel} from '@enact/moonstone/Panels';
import Scroller from '@enact/sandstone/Scroller';
import Repeater from '@enact/ui/Repeater';
import PropTypes from 'prop-types';
import React from 'react';

import Kitten from '../components/Kitten';

const ListBase = kind({
	name: 'List',

	propTypes: {
		children: PropTypes.array,
		onSelectKitten: PropTypes.func
	},

	render: ({children, onSelectKitten, ...rest}) => (
		<Panel {...rest}>
			<Header title="Kittens!" />
			<Scroller>
				<Repeater childComponent={Kitten} indexProp="index" itemProps={{onSelect: onSelectKitten}}>
					{children}
				</Repeater>
			</Scroller>
		</Panel>
	)
});

export default ListBase;
export {
	ListBase as List, 
	ListBase
};
```
**src/views/Detail.js**
```js
import kind from '@enact/core/kind';
import {Header, Panel} from '@enact/sandstone/Panels';
import PropTypes from 'prop-types';
import React from 'react';

const genders = {
	m: 'Male',
	f: 'Female'
};

const DetailBase = kind({
	name: 'Detail',

	propTypes: {
		color: PropTypes.string,
		gender: PropTypes.oneOf(['m', 'f']),
		name: PropTypes.string,
		weight: PropTypes.number
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
export {
	DetailBase as Detail,
	DetailBase
};
```
**src/components/Kitten/Kitten.js**
```js
import kind from '@enact/core/kind';
import Spottable from '@enact/spotlight/Spottable';
import PropTypes from 'prop-types';
import React from 'react';

import css from './Kitten.module.less';

const KittenBase = kind({
	name: 'Kitten',

	propTypes: {
		children: PropTypes.string,
		index: PropTypes.number,
		onSelect: PropTypes.func,
		size: PropTypes.number
	},

	defaultProps: {
		size: 300
	},

	styles: {
		css,
		className: 'kitten'
	},

	handlers: {
		onSelect: (ev, {index, onSelect}) => {
			if (onSelect) {
				onSelect({index});
			}
		}
	},

	computed: {
		url: ({index, size}) => {
			return `//loremflickr.com/${size}/${size}/kitten?random=${index}`;
		}
	},

	render: ({children, onSelect, size, url, ...rest}) => {
		delete rest.index;

		return (
			<div {...rest} onClick={onSelect}>
				<img src={url} alt="Kitten" width={size} height={size} />
				<div>{children}</div>
			</div>
		);
	}
});

const Kitten = Spottable(KittenBase);

export default Kitten;
export {
	Kitten, 
	KittenBase
};
```
