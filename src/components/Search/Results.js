// Type
//
import kind from '@enact/core/kind';
import {Link} from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';

import css from './Results.module.less';

const Results = kind({
	name: 'Results',

	propTypes: {
		children: PropTypes.array,
		noResultsText: PropTypes.string
	},

	defaultProps: {
		noResultsText: 'No matches found'
	},

	styles: {
		css,
		className: 'results'
	},

	computed: {
		list: ({children}) => children.map((result, i) =>
			<Link to={`/docs/modules/${result.ref}/`} key={i} title={result.ref}>{result.ref}</Link>
		)
	},

	render: ({list, noResultsText, ...rest}) => {
		delete rest.children;
		return <div {...rest}>
			{list.length ? list : noResultsText}
		</div>;
	}
});

export default Results;
export {Results};
