---
title: Add a New Component Using TypeScript
github: https://github.com/enactjs/docs/blob/develop/src/pages/docs/tutorials/tutorial-typescript/adding-a-new-component/index.md
order: 3
---

Enact has a number of ready-to-use components. Each component includes TypeScript typing, allowing them to be easily integrated into a project.

Let's start by using components from the Moonstone theme in a stateful React component.

### Creating a Counter Component

- Create a **Counter** folder in **src/components** and add a **Counter.tsx** file

```none
./src/components/Counter/Counter.tsx
```

### Counter using TypeScript

We can now populate the **Counter.tsx** file with a simple counter and add the following contents:

```ts
import React from "react";
import Button from "@enact/moonstone/Button";

interface Props {}

interface State {
  count: number;
}

class Counter extends React.Component<Props, State> {
  state = {
    count: 0
  };

  increment = () => {
    this.setState({
      count: this.state.count + 1
    });
  };

  decrement = () => {
    this.setState({
      count: this.state.count - 1
    });
  };

  reset = () => {
    this.setState({
      count: 0
    });
  };

  render() {
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

```none
./src/components/Counter/package.json
```

```json
{
    "main": "Counter.tsx"
}
```

Then, inside of **views/MainPanel.tsx**, we can import the `Counter` component:

```ts
// Custom component
import Counter from "../components/Counter";

const MainPanel = kind({
  name: "MainPanel",

  render: props => (
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
