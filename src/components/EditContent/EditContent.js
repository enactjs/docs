// EditContent - provides a link to GitHub to edit the doc source
// Note: Expects children to be either a string (the fully qualified URL) or JSON object that is a
// component definition.  For objects, assumes all docs live in the 'enact' repo.  If not supplied
// or the object does not have a 'namespace' member, `null` will be returned.

import React from 'react';
import PropTypes from 'prop-types';
import kind from '@enact/core/kind';

import css from './EditContent.less';

const EditContent = kind({
	name: 'EditContent',

	propTypes: {
		children: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
	},

	styles: {
		css,
		className: 'editContent'
	},

	computed: {
		url: ({children}) => {
			if (typeof children === 'string') {
				return children;
			} else if (children && children.namespace) {
				return `https://github.com/enactjs/enact/blob/develop/packages/${children.namespace}/`;
			} else {
				return null;
			}
		}
	},

	render: ({url, ...rest}) => {
		delete rest.children;

		return url ?
			<div {...rest}>
				<a href={url}>Edit on GitHub</a>
			</div> :
			null;
	}
});

export default EditContent;
