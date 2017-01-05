import React from 'react';
import {Link} from 'react-router';
import {prefixLink} from 'gatsby-helpers';
import hljs from 'highlight.js';

let linkReference;

function parseCodeBlock (child, index) {
	const lang = child.lang || 'html';	// HTML formatting works better on JSX than JavaScript does
	let highlight, block;

	highlight = hljs.highlight(lang, child.value, true);
	block = `<pre><code class="code block">${highlight.value}</code></pre>`;
	return (
		<span dangerouslySetInnerHTML={{__html: block}} key={index} />	// eslint-disable-line react/no-danger
	);
}

function parseLink (child, index) {
	let title = child.children[0].value;
	const linkText = linkReference || title;

	linkReference = null;
	let pos = title.indexOf('.');
	if (pos === -1) {
		pos = title.indexOf('~');    // Shouldn't be any of these!
	}
	let link = '/docs/modules/';
	if (pos >= 0) {
		title = title.slice(0, pos);
		link += title + '/';
	} else {
		link += title + '/';
		title = null;    // No need for title if same as linkText
	}

	return <Link to={prefixLink(link)} key={index} data-tooltip={title}>{linkText}</Link>;
}

function parseChild (child, index) {
	switch (child.type) {
		case 'linkReference':
			linkReference = child.children[0].value;	// I feel a bit dirty but we need state to pass to next child (link)
			return null;
		case 'link':
			return parseLink(child, index);
		case 'blockquote':
			return <blockquote key={index}>{parseChildren(child)}</blockquote>;
		case 'code':
			return parseCodeBlock(child, index);
		case 'emphasis':
			return <em key={index}>{parseChildren(child)}</em>;
		case 'html':	// No good way to insert html at this point.  We could accumulate content and combine
						// the html blocks together.  The other alternative is to treat all this as raw HTML
						// and only have one react element at the root that does a 'dangerouslySetInnerHTML'
						// though we'd still need to handle links.  Links may be broken anyhow. Alternatively,
						// we could allow only simple HTML and hope for the best.  Currently, we don't use
						// HTML anyhow.
			console.warn('Inline HTML is not supported: ' + child.value);	// eslint-disable-line no-console
			return null;
		case 'image':
			return <img alt={child.alt} src={child.url} data-tooltip={child.title} key={index} />;
		case 'inlineCode':
			return <code className="code inline" key={index}>{child.value}</code>;
		case 'list':
			if (child.ordered) {
				return <ol key={index}>{parseChildren(child)}</ol>;
			} else {
				return <ul key={index}>{parseChildren(child)}</ul>;
			}
		case 'listItem':
			return <li key={index}>{parseChildren(child)}</li>;
		case 'paragraph':
			return <p key={index}>{parseChildren(child)}</p>;
		case 'strong':
			return <strong key={index}>{parseChildren(child)}</strong>;
		case 'text':
			return child.value;
		case 'thematicBreak':
			return <hr key={index} />;
		default:
			console.warn('Unrecognized type: ' + child.type);	// eslint-disable-line no-console
			if (child.children) {
				return <span key={index}>{parseChildren(child)}</span>;
			} else {
				return child.value;
			}
	}
}

function parseChildren (parent) {
	if (parent && parent.children) {
		return parent.children.map(parseChild);
	} else {
		return null;
	}
}

function DocParse ({children, component: Component = 'div', ...rest}) {
	console.log('com:', Component);
	return (
		<Component {...rest}>
			{parseChildren(children)}
		</Component>
	);
}

export default DocParse;
