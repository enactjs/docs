import React from 'react';
import PropTypes from 'prop-types';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';

import '../css/main.less';

// Import styles.
import '../css/github.css';

export default class SiteTemplate extends React.Component {
	static propTypes = {
		children: PropTypes.func,
		data: PropTypes.object,
		location: PropTypes.object
	}

	// <SiteSection accent="1">
	// 	<p>Some body crap</p>
	// </SiteSection>
	// <Container
	// 	className={css.article}
	// style={{
	// 	// maxWidth: 960,
	// 	// padding: `${rhythm(1)} ${rhythm(3 / 4)}`,
	// 	// paddingTop: 0,
	// 	// position: 'relative'
	// }}
	// >
	// </Container>
	render () {
		return (
			<div>
				<SiteHeader
					location={this.props.location}
					title={this.props.data.site.siteMetadata.title}
				/>
				{this.props.children()}
				<SiteFooter />
			</div>
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

