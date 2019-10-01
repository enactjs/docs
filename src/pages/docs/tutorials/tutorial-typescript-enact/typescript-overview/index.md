---
title: Typescript Overview with Enact
github: https://github.com/enactjs/docs/blob/develop/src/pages/docs/tutorials/tutorial-typescript-enact/app-setup/index.md
order: 3
---
Quick reference guide for TypeScript Concepts before dive into code.

### Typescript highlights
- TypeScript files use the .ts file extension
- TypeScript supports new features in JavaScript, like support for class-based object-oriented programming.
- TypeScript supports Primitive `(string, number, boolean, symbol, null, undefined, tuple)` as well as non-primitive `(array, object, void, enum)` types.
- Interfaces contain only the declaration of the members.

        type MyFunctionType = (count: number) => number;

        interface counterProps {
            count? : number,                           //count prop "?" (optional) of type number
            onChange(): any;                          //Function that does not take arguments and does not return a value
            onChange(name: string): any,             //Function that accepts an argument:
            onChange(name: string): number,         //Function that accepts an argument and returns a value
            onIncrementClick? : MyFunctionType     //Using the type keyword
        }

- Type assertion in typescript is way to tell the complier what is the type of the variable . It used when the type of the target value of the variable might not be known.

        const CounterBase = kind<counterProps>({
            .....
            .....
        })

>  Type assertions is similar to `type casting` in other languages. However, there is no runtime effect of type assertion in TypeScript. It is  merely a way to let the typeScript compiler know the type of a variable.

- An intersection type combines multiple types into one. This allows you to add together existing types to get a single type that has all the features you need. 


### Typescript Hints
- ` // @ts-ignore` -> to ignore the typescript errors
- If tsconfig.json add `strictnullcheck='true'` to alway add check for null values.
- Don’t use the return type any for callbacks whose value will be ignored, instead do use the return type `void` for callbacks whose value will be ignored.
- There is no meaning to assign void to a variable, as only null or undefined is assignable to void.
- Do use optional parameters whenever possible

        interface Example {
            diff(one: string, two?: string, three?: boolean): number;
        }


**Next: [Adding new component](adding-new-component/)**