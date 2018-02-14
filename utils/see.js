// Utilities for working with 'see' links. Used as part of /wrappers/json.js

import jsonata from 'jsonata';	// http://docs.jsonata.org/
import React from 'react';
import See from '../components/See';

const getSeeTags = (member) => {
	// Find any tag field whose `title` is 'see'
	const expression = "$.tags[][title='see'][]";
	return jsonata(expression).evaluate(member) || [];
};

export const renderSeeTags = (member) => {
	return getSeeTags(member).map((tag, idx) => (
		<See tag={tag} key={idx} />
	));
};

export default renderSeeTags;
