import React from 'react';
import PropTypes from 'prop-types';
import {linkIsLocation, linkIsParentOf} from '../../utils/paths.js';

import DocsNav from '../../components/DocsNav';
import Page from '../../components/Page';
import SiteSection from '../../components/SiteSection';

export default class DocsTemplate extends React.Component {
	static propTypes = {
		location: PropTypes.object,
		route: PropTypes.object
	}

	// contextTypes: {
	// 	router: PropTypes.object.isRequired,
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
			null : '1em 0'
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
