import React from 'react';
import includes from 'underscore.string/include';
import {config} from 'config';
import {linkIsLocation, linkIsParentOf} from '../../utils/paths.js';

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
		if (linkIsLocation('/docs/', this.props.location.pathname)) {
			return this.props.children;
		}
		const padding = (linkIsParentOf('/docs/modules/', this.props.location.pathname) ?
			null : '4em 0'
		);
		return (
			<Page manualLayout>
				<DocsNav location={this.props.location} route={this.props.route} />
				<SiteSection style={{padding: padding}}>
					{this.props.children}
				</SiteSection>
			</Page>
		);
	}
}
