// Utilities for working with 'see' links. Used as part of /wrappers/json.js

import See from '../components/See';
import DocParse from '../components/DocParse';

export const renderSeeTags = (member) => {
	const sees = member.sees || [];
	return sees.map((tag = {}, idx) => {
		// Convert paragraph tags to inline elements so they fit inside the See component properly.
		if (tag.description && tag.description.children) {
			tag.description.children.map((child) => {
				if (child.type === 'paragraph') {
					child.type = 'inline';
				}
			});
		}
		return (
			<DocParse key={idx} component={See}>
				{tag.description}
			</DocParse>
		);
	});
};

export default renderSeeTags;
