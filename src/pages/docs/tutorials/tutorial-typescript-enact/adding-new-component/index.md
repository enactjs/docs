---
title: Add New Component using TypeScript
github: https://github.com/enactjs/docs/blob/develop/src/pages/docs/tutorials/tutorial-typescript-basic/app-setup/index.md
order: 4
---

### Creating a Counter Component

- Create Counter folder and add Counter.tsx file

```none
./src/components/Counter.tsx
```

### Counter Counter using Typescript

We can now populate a Counter.tsx file with a simple counter and add the following contents:

```js

import * as React from 'react';
import Button from '@enact/moonstone/Button';

export default class Counter extends React.Component {
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
		  <Button onClick={this.increment}>Decrement ++</Button>
		  <Button onClick={this.reset}>Reset</Button>
		  <Button onClick={this.decrement}>Increment ++</Button>
		</div>
	  );
	}
  }

```

Then, inside of MainPanel.tsx, we can load the Counter

```js
//Custom component
import Counter from '../components/Counter'

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

You'll also need a `package.json` in the same directory to indicate the module's entry point.

```json
{
    "main": "Counter.tsx"
}
```

- Run the App in the terminal

```bash
 npm run serve
```
### Typescript Counter in browser

![Typescript Simple Counter](counter_view.png)

**Next: [Component with Typescript and Enact](../component-with-ts-enact/)**