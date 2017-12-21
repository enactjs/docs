<section accent="Home" style={{backgroundColor: '#DCFCF9', clear: 'both', overflow: 'hidden', margin: '-4em 0 5em', padding: '5em 0'}}>
<div style={{float: 'left', margin: '0 3em'}}>![alt text](images/enact-home-hero.png)</div>
<p style={{fontSize: '200%', fontStyle: 'italic', fontWeight: '100', margin: '2em 1em 0.5em'}}>Enact is a framework designed to be performant, customizable and well structured.</p>
<button style={{backgroundColor: 'transparent',
	border: '2px solid #71A6FF',
	borderRadius: '0.4em',
	color: '#71A6FF',
	lineHeight: '2.5em',
	marginRight: '3em',
	width: '18ex'
}}>Getting Started</button>
<button style={{backgroundColor: 'transparent',
	border: '2px solid #71A6FF',
	borderRadius: '0.4em',
	color: '#71A6FF',
	lineHeight: '2.5em',
	marginRight: '3em',
	width: '18ex'
}}>API</button>
</section>

<section accent="2" style={{display: 'none'}}>
<Doubler>{3}</Doubler>

## Getting Started

Visit the [Documentation](docs/) link to browse our documentation or visit our
[Tutorials](docs/tutorials/).

</section>

<div style={{clear: 'both', overflow: 'hidden'}}>
<div style={{float: 'left', margin: '0 3em'}}>![alt text](images/enact-home-easy.png)</div>
<div style={{margin: '1em 0'}}>

### Ease of Use

Enact builds atop the excellent React library, and provides a full framework to the developer. The recent boom of web technologies and related tools has led to a plethora of options available. In fact, getting started might be the most difficult part of building a modern web application.

</div>
</div>

<div style={{clear: 'both', overflow: 'hidden'}}>
<div style={{float: 'right', margin: '0 3em'}}>![alt text](images/enact-home-perf.png)</div>
<div style={{margin: '1em 0'}}>

### Performance

Beyond initial setup, Enact continues to provide benefits. It was built with performance in mind,
and conscious decisions were made to ensure that applications remain performant as they grow in size and complexity. This ranges from the way components are rendered to how data flows through application.

</div>
</div>

<div style={{clear: 'both', overflow: 'hidden'}}>
<div style={{float: 'left', margin: '0 3em'}}>![alt text](images/enact-home-custom.png)</div>
<div style={{margin: '1em 0'}}>

### Customizability

Enact has a full set of customizable widgets that can be tuned and tweaked to the particular style of each project. Using our experience in building full UI libraries for a broad swath of devices ranging from TVs to watches, we have created a widget library whose components can easily be composed to create complex views and applications.

</div>
</div>

<section accent="3" style={{backgroundColor: '#DEF1F8', margin: '2em 0', padding: '3em 5em'}}>

<div>Placeholder message</div>

</section>

<section style={{display: 'inline-block', width: '260px', margin: '0 30px 0 0', verticalAlign: 'top'}}>

#### core/factory

_Exports the core/factory.factory function for creating customizeable components._

_*factory(defaultConfig, fn) - Function*_

Creates a factory function which reconciles a default configuration object (defaultConfig) and a customized configuration object and provides the result to an executing function (fn). The configuration objects are processed by features which determine how to reconcile the values from each.

</section>

<section style={{display: 'inline-block', width: '260px', margin: '0 30px 0 30px', verticalAlign: 'top'}}>

#### moonstone/Button

_Exports the moonstone/Button.Button and moonstone/Button.ButtonBase components. The default export is moonstone/Button.Button._

_*Button - Component*_
moonstone/Button.Button is a Button with Moonstone styling, Spottable and Touchable applied. If the Button's child component is text, it will be uppercased unless casing is set.

</section>

<section style={{display: 'inline-block', width: '260px', margin: '0 0 0 30px', verticalAlign: 'top'}}>

#### ui/FloatingLayer

_Exports the ui/FloatingLayer.FloatingLayer component and ui/FloatingLayer.FloatingLayerDecorator Higher-order Component (HOC). The default export is ui/FloatingLayer.FloatingLayer._

_*FloatingLayer - Component*_

ui/FloatingLayer.FloatingLayer is a component that creates an entry point to the new render tree. This is used for modal components such as popups.

</section>
