// Type
//
import React from 'react';
import PropTypes from 'prop-types';
import {parseLink} from '../DocParse.js';

import css from './Type.less';

const identifyType = (str) => {
	if (str.indexOf('/') >= 0) {
		return 'module';
	}
	return str ? str.toLowerCase().replace(/^.*\.(.+)$/, '$1') : '';
};

const readable = (content) => {
	let typeContent = content;
	if (typeContent.indexOf('/') >= 0) {
		let shortText = typeContent.replace(/^.*\.(.+)$/, '$1');
		typeContent = parseLink({children: [{text: shortText, value: typeContent}]});	// mapping to: child.children[0].value
	}
	return typeContent;
};

export default class Type extends React.Component {
	static propTypes = {
		children: PropTypes.string.isRequired
	};

	render () {
		const {children, ...rest} = this.props;
		const typeContent = readable(children);
		const typeClass = identifyType(children);
		return <var {...this.props} className={'type ' + typeClass}>{typeContent}</var>;
	}
}
