// SiteHeader
//
import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router';
import {Container, Grid, Span} from 'react-responsive-grid';
import {prefixLink} from 'gatsby-helpers';
import includes from 'underscore.string/include';
import {colors, activeColors} from 'utils/colors';

import {rhythm, adjustFontSizeTo} from 'utils/typography';
import {config} from 'config';
import kind from '@enact/core/kind';

import css from './SiteHeader.less';

const SiteHeader = kind({
	name: 'SiteHeader',

	propTypes: {
		locationPath: PropTypes.object
	},

	styles: {
		css,
		className: 'header'
	},

	computed: {
		classNameDocs: ({location, styler}) => styler.join({active: (includes(location.pathname, '/docs/'))}),
		classNameExamples: ({location, styler}) => styler.join({active: (includes(location.pathname, '/examples/'))})
	},

	render: ({classNameDocs, classNameExamples, ...rest}) => {
		delete rest.location;

		return (
			<header {...rest}>
				<Container
					style={{
						maxWidth: 960,
						padding: '0 ' + rhythm(3 / 4)
					}}
				>
					<Grid columns={12}>
						<Span className={css.siteTitle} columns={4}>
							<Link to={prefixLink('/')} className={css.logo}>
								{config.siteTitle}
							</Link>
						</Span>
						<Span className={css.nav} columns={8} last>
							<Link
								className={classNameDocs}
								to={prefixLink('/docs/')}
								style={{
									paddingLeft: rhythm(1 / 2),
									paddingRight: rhythm(1 / 2),
								}}
							>
								Documentation
							</Link>
							<Link
								className={classNameExamples}
								to={prefixLink('/examples/')}
								style={{
									paddingLeft: rhythm(1 / 2),
									paddingRight: rhythm(1 / 2),
								}}
							>
								Examples
							</Link>
							<Link
								style={{
									color: colors.fg,
									paddingLeft: rhythm(1 / 2),
								}}
								to="https://github.com/enyojs/enact"
							>
								Github
							</Link>
						</Span>
					</Grid>
				</Container>
			</header>
		);
	}
});

export default SiteHeader;
export {SiteHeader}
