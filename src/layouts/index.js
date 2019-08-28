import { graphql } from 'gatsby';
import React from 'react';
import PropTypes from 'prop-types';

import Page from '../components/Page';

export default class IndexLayout extends React.Component {
	static propTypes = {
		data: PropTypes.object.isRequired,
		children: PropTypes.func
	}

	render () {
		const {children, ...rest} = this.props;
		return (
			<Page
				{...rest}
			>
				{children()}
			</Page>
		);
	}
}

export const query = graphql`
	query SiteHeaderQuery {
		site {
			siteMetadata {
				title
			}
		}
	}
`;
