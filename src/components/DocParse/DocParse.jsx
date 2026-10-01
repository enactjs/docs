import Code from '../Code/Code.jsx';
import Link from '../Link/Link.jsx';

import css from './DocParse.module.css';

let linkReference;

function parseCodeBlock (child, index) {
	return <Code key={index}>{child.value}</Code>;
}

function parseLink (child, index) {
	let title = child.url || child.children[0].value;
	const linkTitle = child.children[0].value || linkReference || title;

	return <Link key={index} title={title} linkTitle={linkTitle} reference={child.url} />;
}

function parseChild (child, index) {
	switch (child.type) {
		case 'linkReference':
			linkReference = child.children[0].value;
			return null;
		case 'link':
			return parseLink(child, index);
		case 'blockquote':
			return <blockquote key={index}>{parseChildren(child)}</blockquote>;
		case 'code':
			return parseCodeBlock(child, index);
		case 'emphasis':
			return <em key={index}>{parseChildren(child)}</em>;
		case 'html':
			// No good way to insert html at this point.  We could accumulate content and combine
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
			return <code key={index}>{child.value}</code>;
		case 'list':
			if (child.ordered) {
				return <ol className={css.list} key={index}>{parseChildren(child)}</ol>;
			} else {
				return <ul className={css.list} key={index}>{parseChildren(child)}</ul>;
			}
		case 'listItem':
			return <li key={index}>{parseChildren(child)}</li>;
		case 'paragraph':
			return <p className={css.paragraph} key={index}>{parseChildren(child)}</p>;
		case 'inline':
			return <span key={index}>{parseChildren(child)}</span>;
		case 'strong':
			return <strong key={index}>{parseChildren(child)}</strong>;
		case 'table':
			return <table key={index}><tbody>{parseChildren(child)}</tbody></table>;
		case 'tableRow':
			return <tr key={index}>{parseChildren(child)}</tr>;
		case 'tableCell':
			return <td key={index}>{parseChildren(child)}</td>;
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

function DocParse ({description}) {
	return parseChildren(description);
}

export default DocParse;
