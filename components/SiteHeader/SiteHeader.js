// SiteHeader
//
import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import {prefixLink} from 'gatsby-helpers';
import {config} from 'config';
import kind from '@enact/core/kind';
import hoc from '@enact/core/hoc';
import {Row, Cell} from '@enact/ui/Layout';

import SiteSection from '../SiteSection';
import {linkIsLocation, linkIsBaseOf} from '../../utils/paths.js';
import Search from '../Search';

import css from './SiteHeader.less';

const SiteHeaderBase = kind({
	name: 'SiteHeader',

	propTypes: {
		compact: PropTypes.bool,
		location: PropTypes.object
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

	render: ({classNameDocs, classNameModules, classNameHome, location, ...rest}) => {
		delete rest.compact;
		return (
			<header {...rest}>
				<SiteSection className={css.frame}>
					<Row className={css.container} align="center">
						<Cell className={css.siteTitle} shrink>
							<Link to={prefixLink('/')} className={css.logo}>
								<span className={css.image} />
								<span className={css.text}>{config.siteTitle}</span>
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
									to={prefixLink('/')}
								>
									Home
								</Cell>
								<Cell
									component={Link}
									shrink
									className={classNameDocs}
									to={prefixLink('/docs/')}
								>
									Getting Started
								</Cell>
								<Cell
									component={Link}
									shrink
									className={classNameModules}
									to={prefixLink('/docs/modules/')}
								>
									API
								</Cell>
								<Cell
									component="a"
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

const HeaderEventCoordinator = hoc((configHoc, Wrapped) => {
	return class extends React.Component {
		static displayName = 'HeaderEventCoordinator'

		constructor (props) {
			super(props);

			this.state = {
				compact: false
			};
		}

		componentDidMount () {
			window.addEventListener('scroll', this.handleScroll);
		}

		componentWillUnmount () {
			window.removeEventListener('scroll', this.handleScroll);
		}

		handleScroll = (ev) => {
			this.setState({compact: (ev.srcElement.scrollingElement.scrollTop !== 0)});
		}

		render () {
			let props = this.props;

			return (
				<Wrapped compact={this.state.compact} {...props} />
			);
		}
	};

});

const SiteHeader = HeaderEventCoordinator(SiteHeaderBase);

export default SiteHeader;
export {SiteHeader, SiteHeaderBase};
