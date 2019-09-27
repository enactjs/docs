---
title: Add New Component using TypeScript
github: https://github.com/enactjs/docs/blob/develop/src/pages/docs/tutorials/tutorial-typescript-basic/app-setup/index.md
order: 4
---

## Creating a Counter Component

- Create Counter folder and add Counter.tsx file
  ./src/components/Counter.tsx

## Counter Component using TypeScript with Enact

- `CounterBase` will hold the defination of the Counter component.
- using `Kind` we are binding defaultProps, render and all the events together.
- Please check API documentation in Core Library to know more about `Kind` and `handle`

    const CounterBase = kind({
        name: 'Counter',

        defaultProps: {
            count: 0
        },

        handlers: {
            onDecrementClick: createHandler(count => count - 1),
            onIncrementClick: createHandler(count => count + 1),
            onResetClick: createHandler(() => 0)
        },

        render: ({onIncrementClick, onDecrementClick, onResetClick, count, ...rest}) => (
            <div>
                <h1>{count}</h1>
                <Button onClick={onDecrementClick}>Decrement --</Button>
                <Button onClick={onResetClick}>Reset</Button>
                <Button onClick={onIncrementClick}>Increment ++</Button>
            </div>
        )
    });

    export {
            CounterBase,
        };

- Application will use `ui/Changeable` for state management of the `count` based on the event trigger

 `import Changeable from '@enact/ui/Changeable';`

 > Applying Changeable to a component will pass two additional props: the current value from state and an event callback to invoke when the value changes.

- More information related to `ui/Changeable` will be available inside UI Library (`https://enactjs.com/docs/modules/ui/Changeable/`)

        const Counter = Changeable({prop: 'count' , change: 'onCounterChange'}, CounterBase);

- Add the new `counter` const to the export default.

        export default Counter;

- Create a HOC to handle the click event on the button. `createHandler` function will take function as input, use the function input value to udpate the `count`. By using `handle` we will forward the call to the callback function defined in changable `onCounterChange` -- Renuka

```js
function createHandler(fn) {
    return handle(
        adaptEvent((ev, {count}) => ({
            type: 'onCounterChange',
            count: fn(count)
        }),
        forward('onCounterChange')
        )
    )
}
```

- Inject Typescript types to the handler and props so the compiler will use the right type while parsing the values for props and functions


        interface CounterProps {
            count? : number,
            onCounterChange? : void
        }


        type handlerFunctionType = (count: number) => number;


Then, inside of MainPanel.tsx, we can load the Counter

### ./src/views/MainPanel.tsx

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

## Conclusion
