import React from 'react';
import {Link} from 'react-router';
import {prefixLink} from 'gatsby-helpers';
import hljs from 'highlight.js';

let linkReference;

function parseCodeBlock (child) {
	const lang = child.lang || 'html';	// HTML formatting works better on JSX than JavaScript does
	let highlight, block;

	highlight = hljs.highlight(lang, child.value, true);
	block = `<pre><code>${highlight.value}</code></pre>`;
	return (
		<span dangerouslySetInnerHTML={{__html: block}} />	// eslint-disable-line react/no-danger
	);
}

function parseLink (child) {
	let value = child.children[0].value;
	const linkText = linkReference || value;

	linkReference = null;
	let pos = value.indexOf('.');
	if (pos === -1) {
		pos = value.indexOf('~');	// Shouldn't be any of these!
	}
	let link = '/docs/modules/';
	if (pos >= 0) {
		link += value.slice(0, pos) + '/';
	} else {
		link += value + '/';
	}
	return <Link to={prefixLink(link)}>{linkText}</Link>;
}

function parseChild (child) {
	switch (child.type) {
		case 'linkReference':
			linkReference = child.children[0].value;
			return null;
		case 'link':
			return parseLink(child);
		case 'blockquote':
			return <blockquote>{parseChildren(child)}</blockquote>;
		case 'code':
			return parseCodeBlock(child);
		case 'emphasis':
			return <em>{parseChildren(child)}</em>;
		case 'inlineCode':
			return <span style={{color: 'red'}}>{child.value}</span>;
		case 'list':
			if (child.ordered) {
				return <ol>{parseChildren(child)}</ol>;
			} else {
				return <ul>{parseChildren(child)}</ul>;
			}
		case 'listItem':
			return <li>{parseChildren(child)}</li>;
		case 'paragraph':
			return <p>{parseChildren(child)}</p>;
		case 'text':
			return child.value;
		default:
			console.log('Unrecognized type: ' + child.type);
			if (child.children) {
				return <span>{parseChildren(child)}</span>;
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

const DocParse = ({children, ...rest}) => {

	return (
		<div {...rest}>
			{parseChildren(children)}
		</div>
	);
};

export default DocParse;
