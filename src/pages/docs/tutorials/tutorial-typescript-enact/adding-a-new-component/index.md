---
title: Add a New Component Using TypeScript
github: https://github.com/enactjs/docs/blob/develop/src/pages/docs/tutorials/tutorial-TypeScript-basic/app-setup/index.md
order: 3
---

### Creating a Counter Component

- Create a **Counter** folder in **src/components** and add a **Counter.tsx** file

```none
./src/components/Counter/Counter.tsx
```

### Counter using TypeScript

We can now populate the **Counter.tsx** file with a simple counter and add the following contents:

```ts
import React from 'react';
import Button from '@enact/moonstone/Button';

const class Counter extends React.Component {
	state = {
	  count: 0
	};

	increment = () => {
	  this.setState({
		count: (this.state.count + 1)
	  });
	};

	decrement = () => {
	  this.setState({
		count: (this.state.count - 1)
	  });
	};
	reset = () => {
		this.setState ({
			count: 0
		})
	}

	render () {
	  return (
		<div>
		  <h1>{this.state.count}</h1>
		  <Button onClick={this.decrement}>Decrement --</Button>
		  <Button onClick={this.reset}>Reset</Button>
		  <Button onClick={this.increment}>Increment ++</Button>
		</div>
	  );
	}
  }

export default Counter;
```

Stateless or functional components can be defined in TypeScript. Create a file  ***Count.tsx***

> Interfaces contain only the declaration of the members.

```ts
interface Props {
  count: number;
}

const Count: React.FunctionComponent<Props> = (props) => {
  return <h1>{props.count}</h1>;
};

```
- Add new Count file in the base component.

```ts

import Button from '@enact/moonstone/Button';
import Count from './Count';
import React from 'react';

interface Props {}

interface State {
  count: number;
};

const class Counter extends React.Component<Props, State> {
	state = {
	  count: 0
	};

	increment = () => {
	  this.setState({
		count: (this.state.count + 1)
	  });
	};

	decrement = () => {
	  this.setState({
		count: (this.state.count - 1)
	  });
	};
	reset = () => {
		this.setState ({
			count: 0
		})
	}

	render () {
	  return (
		<div>
		  <h1>{this.state.count}</h1>
		  <Button onClick={this.decrement}>Decrement --</Button>
		  <Button onClick={this.reset}>Reset</Button>
		  <Button onClick={this.increment}>Increment ++</Button>
		</div>
	  );
	}
  }

export default Counter;

```

- You'll also need a **package.json** in the same directory to indicate the module's entry point:

```json
{
    "main": "Counter.tsx"
}
```

Then, inside of **views/MainPanel.tsx**, we can load the `Counter` component:

```ts
//Custom component
import Counter from '../components/Counter';

const MainPanel = kind({
    name: 'MainPanel',

    render: (props) => (
        <Panel {...props}>
            <Header title="Hello Enact + TypeScript!" />
            <Counter />
        </Panel>
    )
});

export default MainPanel;
```

- Run the App in the terminal

```bash
npm run serve
```
### TypeScript Counter in the Browser

![TypeScript Simple Counter](counter_view.png)

**Next: [Component with TypeScript and Enact](../component-with-ts-enact/)**
