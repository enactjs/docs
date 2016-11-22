import React from 'react';
import {Link} from 'react-router';

function parseDescription (childrenArr, isLink) {

	return childrenArr.reduce(function (prev, curr) {
		if (curr.children) {
			if (curr.type === 'link') {
				prev += parseDescription(curr.children, true);
			} else {
				prev += parseDescription(curr.children);
			}
		} else if (isLink) {
			prev += '*<link>' + curr.value + '<link>*';
		} else if (curr.type === 'inlineCode') {
			prev += '*<inlineCode>' + curr.value + '<inlineCode>*';
		} else if (curr.type === 'code') {
			prev += '*<code>' + curr.value + '<code>*';
		} else {
			prev += curr.value;
		}

		return prev;
	}, '');
}

const parseDoc = (content) => {
	if (!content) {
		return;
	}

	content = parseDescription(content.children);

	const parseArr = content.split('*');

	return parseArr.map((val, index) => {
		if (val.includes('<link>')) {
			return val.split('<link>').map((value, ind) => {
				if (ind % 2 === 1) {
					let pos = value.indexOf('.');
					if (pos === -1) {
						pos = value.indexOf('~');	// Shouldn't be any of these!
					}
					let link = '/docs/components/modules/';
					if (pos >= 0) {
						link += value.slice(0, pos) + '/';
					} else {
						link += value + '/';
					}
					return <Link key={ind} to={link}>{value}</Link>;
				}
			});
		}

		if (val.includes('<inlineCode>')) {
			return val.split('<inlineCode>').map((value, ind) => {
				if (ind % 2 === 1) {
					return (
						<span key={ind} style={{color: 'red'}}>{value}</span>
					);
				}
			});
		}

		if (val.includes('<code>')) {
			return val.split('<code>').map((value, ind) => {
				if (ind % 2 === 1) {
					return (
						<pre key={ind}>{value}</pre>
					);
				}
			});
		}

		return (
			<span key={index}>{val}</span>
		);
	});
};

const DocParse = ({children, ...rest}) => {

	return (
		<div {...rest}>
			{parseDoc(children)}
		</div>
	);


};

export default DocParse;
