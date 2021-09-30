// EditContent - provides a link to GitHub to edit the doc source
// Note: Expects children to be either a string (the fully qualified URL) or JSON object that is a
// component definition.  For objects, assumes all docs live in the 'enact' repo.  If not supplied
// or the object does not have a 'namespace' member, `null` will be returned.

import PropTypes from 'prop-types';
import kind from '@enact/core/kind';

import css from './EditContent.module.less';

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
				const  urlParts = children.namespace.split('/');
				if (urlParts[0] === 'moonstone') {
					return `https://github.com/enactjs/moonstone/tree/develop/${urlParts[1]}/`;
				} else if (urlParts[0] === 'sandstone') {
					return `https://github.com/enactjs/sandstone/tree/develop/${urlParts[1]}/`;
				} else if (urlParts[0] === 'agate') {
					return `https://github.com/enactjs/agate/tree/develop/${urlParts[1]}/`;
				} else {
					return `https://github.com/enactjs/enact/tree/develop/packages/${children.namespace}/`;
				}
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
