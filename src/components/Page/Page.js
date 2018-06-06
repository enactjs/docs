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
		manualLayout: PropTypes.bool,
		page: PropTypes.any,
		pageResources: PropTypes.any,
		pathContext: PropTypes.any,
		staticContext: PropTypes.any
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
		delete rest.page;
		delete rest.staticContext;
		delete rest.pageResources;
		delete rest.pathContext;
		return (
			<article {...rest} />
		);
	}
});

export default PageBase;
export {PageBase as Page, PageBase};
