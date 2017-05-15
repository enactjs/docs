---
title: "Enact"
---

Enact is a framework designed to be performant, customizable and well structured. The goal in
creating Enact was to build upon the experience gained in producing the Enyo JavaScript framework
and to incorporate the latest advances in JavaScript and Web engine technology. Enact is designed to
be used by both novice and expert developers.

## Getting Started

Visit the [Documentation](docs/) link to browse our documentation or visit our
[Tutorials](docs/tutorials/).

## Why Enact?

### Ease of Use

Enact builds atop the excellent React library, and provides a full framework to the developer. The
recent boom of web technologies and related tools has led to a plethora of options available. In
fact, getting started might be the most difficult part of building a modern web application. Enact
allows developers to avoid this pain by providing an opinionated collection of standards-based libraries
and tools that have been thoroughly vetted to work well together.  Consistent APIs enable the framework
to provide a path for developers to follow when implementing their components or applications.  This allows
developers to focus on their application requirements instead of framework options.

#### Improved Developer Experience

The Enact framework can eliminate the chore of configuring key pieces of the build environment, such
as [Babel](https://babeljs.io/), [ESLint](http://eslint.org/), [webpack](https://webpack.github.io/), etc.

For developers with experience using Enyo, Enact provides a familiar way to create and manage components
via the `kind()` method from the `@enact/core` module.  There are additional components and utilities in
`@enact/ui` that Enyo developers will recognize.  Enyo developers can leverage their prior experience
following Enyo's component encapsulation guidelines to help them adhere to Enact's strict API for creating
kinds.

For developers working on smart TV platforms, such as the LG Smart TV powered by webOS, the `@enact/moonstone`
module provides the same user experience and UI elements found in many current LG Smart TV applications and
works in conjunction with our 5-way navigation module, `@enact/spotlight`.

To further aid developers, Enact provides an [ESLint configuration](docs/developer-tools/eslint-config-enact/) to analyze source code for potential
errors and to enforce a common coding style.

### Performance

Beyond initial setup, Enact continues to provide benefits. It was built with performance in mind,
and conscious decisions were made to ensure that applications remain performant as they grow in size
and complexity. This ranges from the way components are rendered to how data flows through an
application. Having had experience developing a framework for low-powered devices, many learnings
from app launch time to view transition time have been integrated into the core of Enact and the
various widgets we provide out of the box.

### Customizability

Enact has a full set of customizable widgets that can be tuned and tweaked to the particular style
of each project. Using our experience in building full UI libraries for a broad swath of devices
ranging from TVs to watches, we have created a widget library whose components can easily be
composed to create complex views and applications.
