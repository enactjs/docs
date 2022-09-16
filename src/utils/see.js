// Utilities for working with 'see' links. Used as part of /wrappers/json.js

import jsonata from 'jsonata';	// http://docs.jsonata.org/
import {LocationLink} from '../components/SmartLink';
import See from '../components/See';

function parseSee (child, index) {
	let description = child.split(' ');
	const isLinkTag = (element) => element === '{@link';
	const linkTagIndex = description.findIndex(isLinkTag);

	let value = description[linkTagIndex + 1];
	let title = value.substr(0, value.length - 1);
	const linkText = title;
	const url = title;

	if (url && url.indexOf('http') === 0) {
		return <a href={url} key={index}>{linkText}</a>;
	} else if (title.indexOf('http') === 0) {
		return <a href={title} key={index}>{linkText}</a>;
	}

	let pos = title.indexOf('.');
	if (pos === -1) {
		pos = title.indexOf('~');    // Shouldn't be any of these!
	}
	let link = '/docs/modules/';
	if (pos >= 0) {
		link += title.slice(0, pos) + '/#' + title.slice(pos + 1);
		title = title.slice(0, pos);
	} else {
		link += title + '/';
		if (title.charAt(0) === '/') { // handle internal links that aren't in /docs/modules
			link = title;
		}
		title = null;    // No need for title if same as linkText
	}

	return <LocationLink to={link} key={index} data-tooltip={title}>{linkText}</LocationLink>;
}

const getSeeTags = (member) => {
	// Find any tag field whose `title` is 'example'
	// Updated style that works in jsonata 1.6.4 and always returns array!
	const expression = "$.[tags[title='see']]";
	return jsonata(expression).evaluate(member);
};

export const renderSeeTags = (member) => {
	const sees = getSeeTags(member) || [];
	return sees.map((tag = {}, idx) => {
		return (
			<See>
				{parseSee(tag.description, idx)}
			</See>
		);
	});
};

export default renderSeeTags;
