---
title: Add New Component using TypeScript
github: https://github.com/enactjs/docs/blob/develop/src/pages/docs/tutorials/tutorial-typescript-basic/app-setup/index.md
order: 4
---
## Creating a Counter Component
- Create Counter folder and add Counter.tsx file
         ./src/components/Counter.tsx

## Counter Component using TypeScript
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

        render () {
            return (
            <div>
                <h1>{this.state.count}</h1>
                <Button onClick={this.increment}>Increment</button>
                <Button onClick={this.decrement}>Decrement</button>
            </div>
            );
        }
        }

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

## Counter Component using TypeScript with Enact

- `CounterBase` will hold the defination of the Counter component.
- using `Kind` we are binding defaultProps and all the events inside the handler.
- Please check API documentation in Core Library to know more about `Kind` and `handle` 

        const CounterBase = kind({
            name: 'Counter',

            defaultProps: {
                count: 0
            },

            handlers: {
                'onDecrementClick': createHandler(count => count - 1),
                'onIncrementClick': createHandler(count => count + 1),
                'onResetClick': createHandler(() => 0)
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



        const Counter = Changeable({prop: 'count' , change: 'onCounterChange'}, CounterBase);

        export default Counter;
        export {
            CounterBase,
            Counter
        };




        type MyFunctionType = (count: number) => number;
        interface counterProps {
            count? : number,
            onResetClick? : MyFunctionType,
            onCounterChange? : MyFunctionType,
            onDecrementClick? : MyFunctionType,
            onIncrementClick? : MyFunctionType
        }

        function createHandler(fn:MyFunctionType) {
            return handle(
                adaptEvent((ev, {count}) => ({
                    type: 'onCounterChange',
                    count: fn(count)
                }),
                forward('onCounterChange')
                )
            )
        }


## Conclusion
