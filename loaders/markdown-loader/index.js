let frontMatter = require('front-matter');
let markdownIt = require('markdown-it');
let hljs = require('highlight.js');
let objectAssign = require('object-assign');

let highlight = function (str, lang) {
	if ((lang !== null) && hljs.getLanguage(lang)) {
		try {
			return hljs.highlight(lang, str).value;
		} catch (_error) {
			// eslint-disable-next-line no-console
			console.error(_error);
		}
	}
	try {
		return hljs.highlightAuto(str).value;
	} catch (_error) {
		// eslint-disable-next-line no-console
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

module.exports = function (content) {
	this.cacheable();
	const meta = frontMatter(content);
	let body = md.render(meta.body);
	const result = objectAssign({}, meta.attributes, {body});
	this.value = result;
	return `module.exports = ${JSON.stringify(result)}`;
};
