var frontMatter = require('front-matter');
var markdownIt = require('markdown-it');
var hljs = require('highlight.js');
var objectAssign = require('object-assign');

var highlight = function (str, lang) {
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

var md = markdownIt({
	html: true,
	linkify: false,
	typographer: true,
	highlight
});

module.exports = function (content) {
	this.cacheable();
	const meta = frontMatter(content);
	const body = md.render(meta.body);
	const result = objectAssign({}, meta.attributes, {
		body
	});
	this.value = result;
	return `module.exports = ${JSON.stringify(result)}`;
};
