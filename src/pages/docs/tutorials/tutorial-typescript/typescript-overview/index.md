---
title: Enact with TypeScript Overview
github: https://github.com/enactjs/docs/blob/develop/src/pages/docs/tutorials/tutorial-typescript/typescript-overview/index.md
order: 2
---

This page documents how Enact and TypeScript work together.

### About TypeScript

This tutorial assumes you already know about TypeScript, its syntax, and its use. If you are unfamiliar with TypeScript and wish to get a quick introduction to it, refer to the official [TypeScript overview](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html).

 ### TypeScript Support in Enact

Enact modules include TypeScript definition files, so there is no need to include third-party definition files.  The TypeScript template you installed in the first step of this tutorial configures your environment for building, linting and running TypeScript applications. Additionally, if you use an editor that supports TypeScript definitions, you should be able to see the types for Enact components and methods while writing your app.

The Enact CLI supports TypeScript projects when it detects the presence of **tsconfig.json** and the **typescript** executable either locally or globally installed. The CLI builds using WebPack and linting is done by TSLint (if a **tsconfig.json** is detected).

By default, the TypeScript template is set for strict TypeScript error checking. When migrating existing code, this can make the experience more difficult than it needs to be. It is possible to disable strict type checking (or, completely change the TypeScript compiler settings) by modifying the **tsconfig.json** file in the root of your project.

```json
    "strict": false,
```

TSLint settings can be adjusted by editing the `tslint.json` file.

If you need finer-grained control over your build or linting settings, you can 'eject' the application and modify the built settings directly (though you will lose some of the benefits of the Enact CLI). See [Ejecting Apps](/docs/developer-tools/cli/ejecting-apps/) for more information.

### Edge Cases

Unfortunately, there are some edge cases in Enact higher-order components that are not possible to type correctly with TypeScript. In these cases, the TypeScript definitions may not be accurate and will have to be overridden within your application.

This applies to HoCs such as `Toggleable` that can operate in either a controlled or uncontrolled manner. In the specific case of `Toggleable`, the config object allows configuring a `prop` name. For the controlled case, developers use the configured name directly. In the case of uncontrolled usage, developers can set the initial state using the prop name prefixed with `default` (e.g. `defaultSelected`).

In these cases, TypeScript may issue an error about the default property not being expected. Developers will need to either explicitly add the property to the interface or suppress the warning:

```ts
// @ts-ignore
<MyToggleable defaultSelected />
```

### Getting Help

If you find a situation where the Enact TypeScript definitions appear to be failing, please open a [GitHub issue](https://github.com/enactjs/enact/issues). We also have a [Gitter chat](https://gitter.im/EnactJS/Lobby/~chat#share) where you can ask questions and get help from the community.

**Next: [Adding a New Component](../adding-a-new-component/)**
