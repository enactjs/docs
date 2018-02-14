// Page
//
import React from 'react';
import PropTypes from 'prop-types';
import kind from '@enact/core/kind';

import SiteSection from '../SiteSection';

import css from './Page.less';

const PageBase = kind({
	name: 'Page',

	propTypes: {
		manualLayout: PropTypes.bool
	},

	defaultProps: {
		manualLayout: false
	},

	styles: {
		css,
		className: 'page'
	},

	computed: {
		children: ({children, manualLayout}) => (manualLayout ? children : <SiteSection>{children}</SiteSection>)
	},

	render: ({...rest}) => {
		delete rest.manualLayout;
		delete rest.history;
		delete rest.location;
		delete rest.params;
		delete rest.route;
		delete rest.routeParams;
		delete rest.routes;
		return (
			<article {...rest} />
		);
	}
});

export default PageBase;
export {PageBase as Page, PageBase};
