import React from 'react';

import DocsNav from '../../components/DocsNav';
import Page from '../../components/Page';
import SiteSection from '../../components/SiteSection';

export default class DocsTemplate extends React.Component {
	static propTypes = {
		location: React.PropTypes.object,
		route: React.PropTypes.object
	}

	// contextTypes: {
	// 	router: React.PropTypes.object.isRequired,
	// }

	// handleTopicChange (e) {
	// 	return this.context.router.push(e.target.value);
	// }
	render () {
		// Let the docs home decide its own fate, and not use this pre-fab template
		if (this.props.location.pathname === '/docs/') {
			return this.props.children;
		}
		return (
			<Page manualLayout>
				<DocsNav location={this.props.location} route={this.props.route} />
				<SiteSection style={{padding: '2em 0'}}>
					{this.props.children}
				</SiteSection>
			</Page>
		);
	}
}
