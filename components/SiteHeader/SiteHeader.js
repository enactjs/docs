// SiteHeader
//
import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
// import {Container, Grid, Span} from 'react-responsive-grid';
import {prefixLink} from 'gatsby-helpers';
import includes from 'underscore.string/include';
// import {colors, activeColors} from 'utils/colors';
// import {rhythm, adjustFontSizeTo} from 'utils/typography';
import {config} from 'config';
import kind from '@enact/core/kind';
import hoc from '@enact/core/hoc';
import {Row, Column, Cell} from '@enact/ui/Layout';

// import {forward, handle} from '@enact/core/handle';

// handlers: {
// 	onScroll: handle(
// 		forward('onScroll'),
// 		({currentTarget}) => {
// 			currentTarget.scrollTop = 0;
// 			currentTarget.scrollLeft = 0;
// 		}
// 	),

import Search from '../Search';

import css from './SiteHeader.less';

const SiteHeaderBase = kind({
	name: 'SiteHeader',

	propTypes: {
		compact: PropTypes.bool,
		locationPath: PropTypes.object
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
		classNameDocs: ({location, styler}) => styler.join({active: (includes(location.pathname, '/docs/'))}),
		classNameExamples: ({location, styler}) => styler.join({active: (includes(location.pathname, '/examples/'))}),
		classNameHome: ({location, styler}) => styler.join({active: (includes(location.pathname, '/'))})
	},

	render: ({classNameDocs, classNameExamples, classNameHome, classNameLogo, location, ...rest}) => {
		delete rest.compact;
		return (
			<header {...rest}>
				<div className={css.frame}>
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
									className={classNameExamples}
									to={prefixLink('/examples/')}
								>
									API
								</Cell>
								<Cell
									component={Link}
									shrink
									to="https://github.com/enyojs/enact"
								>
									Github
								</Cell>
							</Row>
						</Cell>
					</Row>
				</div>
			</header>
		);
	}
});

const HeaderEventCoordinator = hoc((config, Wrapped) => {
	return class extends React.Component {
		static displayName = 'HeaderEventCoordinator'

		constructor (props) {
			super(props);
			// console.log('constructor');

			this.state = {
				compact: false
			};
		}

		componentDidMount () {
			// console.log('componentDidMount');
			window.addEventListener('scroll', this.handleScroll);
		}

		componentWillUnmount () {
			console.log('componentWillUnmount');
			window.removeEventListener('scroll', this.handleScroll);
		}

		handleScroll = (ev) => {
			// console.dir(ev.srcElement.scrollingElement.scrollTop);
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
