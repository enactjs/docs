// Type
//
import kind from '@enact/core/kind';
import {Link} from 'gatsby';
import PropTypes from 'prop-types';

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
		list: ({children}) => children.map((result, i) => {
			let [title, to] = result.id.split('|');
			return <Link to={`/${to}/`} key={i} title={to}>{title}</Link>;
		})
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
