import React from 'react';
import PropTypes from 'prop-types';

import Page from '../components/Page';
import SiteSection from '../components/SiteSection';

export default class MarkdownLayout extends React.Component {
	static propTypes = {
		children: PropTypes.func
	}

	render () {
		const {children, ...rest} = this.props;
		return (
			<Page
				{...rest}
			>
				<SiteSection>
					{children()}
				</SiteSection>
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
