import React from 'react';
import {Link} from 'react-router';
import {Container, Grid, Span} from 'react-responsive-grid';
import {prefixLink} from 'gatsby-helpers';
import includes from 'underscore.string/include';
import {colors, activeColors} from 'utils/colors';

import typography from 'utils/typography';
import {config} from 'config';

// Import styles.
import 'css/main.less';
import 'css/github.css';

const {rhythm, adjustFontSizeTo} = typography;

export default class SiteTemplate extends React.Component {
	static propTypes = {
		children: React.PropTypes.object
	}

	render () {
		const docsActive = includes(this.props.location.pathname, '/docs/');
		const examplesActive = includes(this.props.location.pathname, '/examples/');

		return (
			<div>
				<header
					className="header"
					style={{
						marginBottom: rhythm(1.5)
					}}
				>
					<Container
						style={{
							maxWidth: 960,
							padding: '0 ' + rhythm(3 / 4)
						}}
					>
						<Grid
							columns={12}
						>
							<Span
								className="siteTitle"
								columns={4}
							>
								<Link to={prefixLink('/')} className="logo">
									{config.siteTitle}
								</Link>
							</Span>
							<Span className="nav" columns={8} last>
								<Link
									className={docsActive ? 'active' : null}
									to={prefixLink('/docs/')}
									style={{
										paddingLeft: rhythm(1 / 2),
										paddingRight: rhythm(1 / 2),
									}}
								>
									Documentation
								</Link>
								<Link
									className={examplesActive ? 'active' : null}
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
				<Container
					className="article"
					style={{
						maxWidth: 960,
						padding: `${rhythm(1)} ${rhythm(3 / 4)}`,
						paddingTop: 0,
						position: 'relative'
					}}
				>
					{this.props.children}
				</Container>
			</div>
		);
	}
}
