// SiteTitle
//
import PropTypes from 'prop-types';
import kind from '@enact/core/kind';
import {config} from '../../config';
import DocumentTitle from 'react-document-title';

const SiteTitleBase = kind({
	name: 'SiteTitle',

	propTypes: {
		custom: PropTypes.bool,
		data: PropTypes.object,
		delimiter: PropTypes.string,
		title: PropTypes.string
	},

	defaultProps: {
		delimiter: ' | '
	},

	computed: {
		title: ({custom, data, delimiter, title}) => {
			// A a fully customized title
			if (custom && title) return title;

			// Direct title
			if (title) return (title + delimiter + config.siteTitle);

			// Indirect title
			if (data && data.markdownRemark && data.markdownRemark.frontmatter && data.markdownRemark.frontmatter.title) {
				return (data.markdownRemark.frontmatter.title + delimiter + config.siteTitle);
			}

			// No title
			return config.siteTitle;
		}
	},

	// TODO: Replace DocumentTitle with Helmet
	render: (props) => (<DocumentTitle {...props} />)
});

export default SiteTitleBase;
export {SiteTitleBase as SiteTitle, SiteTitleBase};
