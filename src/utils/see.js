// Utilities for working with 'see' links. Used as part of /wrappers/json.js

import React from 'react';
import See from '../components/See';
import DocParse from '../components/DocParse';

export const renderSeeTags = (member) => {
	const sees = member.sees || [];
	return sees.map((tag, idx) => (
		<DocParse key={idx} component={See}>
			{tag}
		</DocParse>
	));
};

export default renderSeeTags;
