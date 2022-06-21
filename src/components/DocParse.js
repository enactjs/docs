import Code from './Code';
import {LocationLink} from './SmartLink';

import css from '../css/main.module.less';

let linkReference;

function parseCodeBlock (child, index) {
	let codeText = '';
	let temp = '';
	const lang = child.lang || 'html';	// HTML formatting works better on JSX than JavaScript does
	if (child.children.length == 1) {
		return <Code type={lang} key={index}>{child.children[0].value}</Code>;
	} else
		child.children.forEach((elem) => {
			if(elem.type == 'text'){
				temp = elem.value;
			} else {
				temp = parseChildren(elem)
			}	
			codeText += temp;
		});

		const text = codeText.replace(/\,/g,'');

		return <Code type={lang} key={index}>{text}</Code>;
}

function parseLink (child, index) {
	let title = child.children[0].value;
	const linkText = linkReference || title;
	const url = (child.properties && child.properties.href);

	if (url && url.indexOf('http') === 0) {
		return <a href={url} key={index}>{linkText}</a>;
	} else if (title.indexOf('http') === 0) {
		return <a href={title} key={index}>{linkText}</a>;
	}
	linkReference = null;
	let pos = url.indexOf('.');
	if (pos === -1) {
		pos = url.indexOf('~');    // Shouldn't be any of these!
	}
	let link = '/docs/modules/';
	if (pos >= 0) {
		link += url.slice(0, pos) + '/#' + url.slice(pos + 1);
		title = url.slice(0, pos);
	} else {
		link += url + '/';
		if (url.charAt(0) === '/') { // handle internal links that aren't in /docs/modules
			link = url;
		}
		title = null;    // No need for title if same as linkText
	}

	return <LocationLink to={link} key={index} data-tooltip={title}>{linkText}</LocationLink>;
}

function parseChild (child, index) {
	if(child.type == 'element') {
		if(child.tagName == 'p') {
			child.type = 'paragraph';
		}else if(child.tagName == 'a') {
			child.type = 'link';
		}else if(child.tagName == 'code'){
			child.type = 'inlineCode';
		}else if(child.tagName == 'ul' || child.tagName == 'ol'){
			child.type = 'list';
		}else if(child.tagName == 'li'){
			child.type = 'listItem';
		}else if(child.tagName == 'em'){
			child.type = 'emphasis';
		}else if(child.tagName == 'span'){
			return parseChildren(child);
		}else if(child.tagName == 'div'){
			return parseChildren(child);
		}else if(child.tagName == 'pre'){
			child.children[0].tagName = 'codeBlock';
			return parseChildren(child);
		}else if(child.tagName == 'codeBlock'){
			child.type = 'code';
			if(child.properties.className == 'language-jsx') {
				child.lang = 'jsx';
			}
		}
	}

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
			return <code className={css.code + ' ' + css.inline} key={index}>{parseChildren(child)}</code>;
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

// eslint-disable-next-line enact/prop-types
function DocParse ({children, component: Component = 'div', ...rest}) {
	if(children !== null && typeof children !== "undefined") {
		return (
			<Component {...rest}>
				{parseChildren(children.childMarkdownRemark.htmlAst)}
			</Component>
		);
	}
}

export default DocParse;
export {parseChild, parseChildren, parseCodeBlock, parseLink};
