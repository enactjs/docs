import React from 'react';
import PropTypes from 'prop-types';

import Page from '../components/Page';

export default class MarkdownLayout extends React.Component {
	static propTypes = {
		children: PropTypes.func
	}

	render () {
		const {children, ...rest} = this.props;
		return (
			<Page
				// title={rest.data.site.siteMetadata.title}
				{...rest}
			>
				{children()}
			</Page>
		);
	}
}

export const query = graphql`
	query markdownLayoutQuery {
		site {
			siteMetadata {
				title
			}
		}
	}
`;

