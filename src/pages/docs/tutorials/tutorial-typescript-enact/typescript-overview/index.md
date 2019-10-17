---
title: Typescript Overview with Enact
github: https://github.com/enactjs/docs/blob/develop/src/pages/docs/tutorials/tutorial-Typescript-enact/app-setup/index.md
order: 2
---

This page describes some of the features and benefits of Typescript. If you are already familiar with Typescript, you can continue to [Adding a new component](../adding-a-new-component/).


### Typescript Benefits

- Typescript is a superset of JavaScript and supports the latest JavaScript features.

- Typescript is an Object Oriented Programming language which possesses all the features and concepts that help to write cleaner and more robust code.

- Typescript supports static type checking, thus errors can be found at compile time rather than run time, your program thus helps to find errors.

- Typescript reduces confusion. When you write large scale application and multiple developers are working on the same project, dealing with dynamic variables can become complex. Static type checking features reduce complexity and thus Typescript becomes the best option.

- Typescript code can be compiled down to ES5 and ES6 standards thus giving support for the latest features to older browsers.

### Typescript Basics

Below is the quick overview of Typescript that will help you to understand the component sampler that we are going to create using Typescript and Enact.

- Typescript files use the **.ts** or **.tsx** file extension

- Typescript supports the latest JavaScript features, such as support for class-based object-oriented programming.
  - Typescript support `class` and includes `constructor`, properties and methods/functions.
  - Classes can be extended to create new classes with inheritance, using the keyword `extends`.
- Typescript supports [tag:Primitive] `(string, number, boolean, symbol, null, undefined, tuple)` as well as non-primitive `(array, object, void, enum)` types.

- Interfaces contain only the declaration of the members.

```ts
interface TestProps {
    //Different ways to define type of a Prop
    //count prop "?" (optional) of type number
    count? : number,
    //Function that does not take arguments and does not return a value
    onChange(): any;
    //Function that accepts an argument:
    onChange(name: string): any,
    //Function that accepts an argument and returns a value
    onChange(name: string): number,
}
```
- Type assertion in Typescript is way to tell the complier what is the type of the variable . It used when the type of the target value of the variable might not be known.

```ts
interface MyTestProps {
    name : string,
    payment: number
}
const MyTestFunction = <TestProps> {
    ...
    ...
}
```
> Type assertions is similar to `type casting` in other languages. However, there is no runtime effect of type assertion in Typescript. It is merely a way to let the Typescript compiler know the type of a variable.

- An intersection type combines multiple types into one. This allows you to add together existing types to get a single type that has all the features you need.

- Fat arrow functions can be used to drop the `function` keyword and pass parameters with types

```ts
let sum = (x: number, y: number) => x + y;
```

- Using Typescript, we can use the concept of function overloading. You can have multiple functions with same name but different parameters types and return type.

```ts
function sum(a:string, b:string): string;

function sum(a:number, b:number): number;

```

### Typescript Hints

- Don’t use the return type any for callbacks whose value will be ignored, instead do use the return type `void` for callbacks whose value will be ignored.
- There is no meaning to assign `void` to a variable, as only `null` or `undefined` is assignable to `void`.
- Do use optional parameters whenever possible.

```ts
interface Example {
    diff(one: string, two?: string, three?: boolean): number;
}
```

**Next: [Adding a New Component](../adding-a-new-component/)**
