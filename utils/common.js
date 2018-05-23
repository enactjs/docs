// Common utilities shared among different renderers. Used as part of /wrappers/json.js

import jsonata from 'jsonata';	// http://docs.jsonata.org/
import React from 'react';

import css from '../css/main.less';

export const makeAnchorName = (headingText) => {
	const anchor = headingText
		.replace(/<.*>(.*)<\/.*>/g, '$1') // strip out inner tags
		.replace('/', '-')
		.replace(/[^A-Za-z0-9\- ]/g, '')
		.replace(/\s+/g, '-');
	return anchor.toLowerCase();
};

export const processDefaultTag = (tags) => {
	// Find any tag field whose `title` is 'default' (won't be there if no default)
	const expression = "$[title='default'].description";
	const result = jsonata(expression).evaluate(tags);
	return result || 'undefined';
};

export const renderDefaultTag = (defaultStr) => {
	if (!defaultStr || defaultStr === 'undefined') {
		return <var className={css.default} />;
	} else if (defaultStr.indexOf("'data:image") === 0) {
		defaultStr = 'An image';
	} else if (defaultStr.search(/\n/) >= 0) {
		let indent = 0;
		defaultStr = defaultStr.split('\n').map((line, index) => {
			if (line === '}') {
				indent--;
			}
			const indentStr = '\u00a0'.repeat(indent * 4);
			if (line.substr(-1) === '{') {
				indent++;
			}
			return <div key={index}>{indentStr}{line}</div>;
		});
		defaultStr = <div className={css.multilineSeeMore} tabIndex="0" title="Show default value"><span>Show default value</span><div className={css.multiline}>{defaultStr}</div></div>;
	}
	return <var className={css.default}><span className={css.title}>Default: </span>{defaultStr}</var>;
};

export const hasRequiredTag = (member) => {
	// Find any tag field whose `title` is 'required' (won't be there if not required)
	const expression = "$[title='required']";
	const result = jsonata(expression).evaluate(member.tags);
	return !!result;
};

export const hasDeprecatedTag = (member) => {
	// Find any tag field whose `title` is 'deprecated'
	const expression = "$[title='deprecated']";
	const result = jsonata(expression).evaluate(member.tags);
	return !!result;
};
