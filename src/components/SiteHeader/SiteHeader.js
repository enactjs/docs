// SiteHeader
//
import kind from '@enact/core/kind';
import {Link} from 'gatsby';
import PropTypes from 'prop-types';
import {Row, Cell} from '@enact/ui/Layout';

import SiteSection from '../SiteSection';
import {linkIsLocation, linkIsBaseOf} from '../../utils/paths.js';
import Search from '../Search';

import css from './SiteHeader.module.less';

const SiteHeaderBase = kind({
	name: 'SiteHeader',

	propTypes: {
		location: PropTypes.object.isRequired,
		title: PropTypes.string.isRequired,
		compact: PropTypes.bool
	},

	defaultProps: {
		compact: false
	},

	styles: {
		css,
		className: 'header'// debug'
	},

	computed: {
		className: ({compact, styler}) => styler.append({compact}),
		classNameDocs: ({location, styler}) => styler.join({active: (linkIsLocation('/docs/', location.pathname))}),
		classNameModules: ({location, styler}) => styler.join({active: (linkIsBaseOf('/docs/modules/', location.pathname))}),
		classNameHome: ({location, styler}) => styler.join({active: (linkIsLocation('/', location.pathname))})
	},

	render: ({classNameDocs, classNameModules, classNameHome, location, title, ...rest}) => {
		delete rest.compact;
		return (
			<header {...rest}>
				<SiteSection className={css.frame}>
					<Row className={css.container} align="center">
						<Cell className={css.siteTitle} shrink>
							<Link to="/" className={css.logo}>
								<span className={css.image} />
								<span className={css.text}>{title}</span>
							</Link>
						</Cell>
						<Cell>
							<div className={css.siteSearch}>
								<Search location={location} />
							</div>
							<Row component="nav" className={css.nav} align="end" wrap>
								<Cell
									component={Link}
									shrink
									className={classNameHome}
									to="/"
								>
									Home
								</Cell>
								<Cell
									component={Link}
									shrink
									className={classNameDocs}
									to="/docs/"
								>
									Getting Started
								</Cell>
								<Cell
									component={Link}
									shrink
									className={classNameModules}
									to="/docs/modules/"
								>
									API
								</Cell>
								<Cell
									component='a'
									shrink
									href="https://github.com/enactjs/enact"
								>
									Github
								</Cell>
							</Row>
						</Cell>
					</Row>
				</SiteSection>
			</header>
		);
	}
});

export default SiteHeaderBase;
export {SiteHeaderBase as SiteHeader, SiteHeaderBase};
