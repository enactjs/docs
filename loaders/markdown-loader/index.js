let frontMatter = require('front-matter');
let markdownIt = require('markdown-it');
let jsx = require('markdown-it-jsx');
let hljs = require('highlight.js');
let objectAssign = require('object-assign');
let React = require('react');

const SiteSectionExports = require('../../components/SiteSection');
const SiteSection = SiteSectionExports.default;

let highlight = function (str, lang) {
	if ((lang !== null) && hljs.getLanguage(lang)) {
		try {
			return hljs.highlight(lang, str).value;
		} catch (_error) {
			console.error(_error);
		}
	}
	try {
		return hljs.highlightAuto(str).value;
	} catch (_error) {
		console.error(_error);
	}
	return '';
};

let md = markdownIt({
	html: true,
	linkify: false,
	typographer: true,
	highlight
});

// Add JSX parser plugin to markdownIt
md.use(jsx);

// Next, the JSX -> raw JS compilation with Babel.
let babel = require('babel-core');


// Finally, import React and friends and actually execute that JS code.
// var React = require('react');
let ReactDOMServer = require('react-dom/server');

// const SiteSection = SiteSectionBase;
// const SiteSection = (props) => React.createElement(SiteSectionBase, props);

let Doubler = function (props) {
	return React.createElement('span', null, 2 * props.children);
};


// Print out a concrete rendering of the document as static HTML.
// console.log(ReactDOMServer.renderToStaticMarkup(React.createElement(Document)));
// Should be something like:
//
//     <div><h1>A sample document</h1><p>Two times three is <span>6</span>.</p>
//     <p>We can <em>intermix <strong>Markdown</strong> and JSX.</em></p>
//     <p>The current date is Thu Jun 23 2016 22:25:54 GMT-0700 (PDT).</p></div>


module.exports = function (content) {
	this.cacheable();
	const meta = frontMatter(content);
	let body = md.render(meta.body);
	if (body.search('Enact is a framework designed to be performant') !== -1) {

		// console.error('BLAKE SAID STOP');
		// console.log('markdown-it:', body);


		const babelCompileResult = babel.transform(
			// We need to wrap the JSX in a div so it's a valid JSX expression.
			'() => (<div>' + body + '</div>)',
			{presets: ['react', 'stage-0', 'stage-1', 'stage-2', 'stage-3']}
		).code;

		const Document = eval(babelCompileResult);
		// console.log('babelCompileResult:', babelCompileResult);
		// console.log('Document:', typeof Document, ':', Document);
		// console.log('SiteSection:', SiteSection);

		// Now Document is a React component, which might be instantiated with <Document />
		// in JSX syntax.
		// body = ReactDOMServer.renderToStaticMarkup( Document() );
		body = ReactDOMServer.renderToStaticMarkup(React.createElement( Document ));
	}
	const result = objectAssign({}, meta.attributes, {body});
	this.value = result;
	return `module.exports = ${JSON.stringify(result)}`;
};
