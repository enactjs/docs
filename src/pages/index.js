import React from 'react';
import PropTypes from 'prop-types';
import Link from 'gatsby-link';
import kind from '@enact/core/kind';
import {Row, Cell} from '@enact/ui/Layout';

import SiteSection from '../components/SiteSection';
import SiteTitle from '../components/SiteTitle';

import css from './index.less';

// images
import custom from './images/enact-home-custom.svg';
import easy from './images/enact-home-easy.svg';
import hero from './images/enact-home-hero.svg';
import perf from './images/enact-home-perf.svg';
import starsSmall from './images/stars-small.svg';
import ufo from './images/ufo.svg';

const IndexBase = kind({
	name: 'Home',
	propTypes: {
		body: PropTypes.string
	},
	styles: {
		css,
		className: 'home covertLinks'
	},
	render ({className}) {
		return (<SiteTitle title="Enact Framework" custom>
			<div className={className}>
				<SiteSection accent="Home" className={css.hero}>
					<div className={css.image}>
						<img alt="Cute animated getting ready image" src={hero} />
					</div>
					<div className={css.intro} style={{backgroundImage: `url(${starsSmall})`}}>
						<div className={css.ufoTrack}><img className={css.ufo} alt="Cheerful floating UFO" src={ufo} /></div>
						<p>An app development framework built atop React that&rsquo;s easy to use, performant and customizable.</p>
						<div className={css.buttons}>
							<Link className={css.button} to="/docs/">Getting Started</Link>
							<Link className={css.button} to="/docs/modules/">API</Link>
						</div>
					</div>
				</SiteSection>

				<SiteSection>
					<Row align="center" wrap className={css.reason}>
						<Cell size="12em" className={css.image}>
							<img alt="First reason" src={easy} />
						</Cell>
						<Cell className={css.description}>
							<h3>Easy to Use</h3>
							<p>Enact builds atop the excellent React library, and provides a full framework to the developer. The recent boom of web technologies and related tools has led to a plethora of options available. In fact, getting started might be the most difficult part of building a modern web application.</p>
						</Cell>
					</Row>

					<Row align="center" wrap className={css.reason}>
						<Cell size="12em" className={css.image}>
							<img alt="Second reason" src={perf} />
						</Cell>
						<Cell className={css.description}>
							<h3>Performant</h3>
							<p>Beyond initial setup, Enact continues to provide benefits. It was built with performance in mind, and conscious decisions were made to ensure that applications remain performant as they grow in size and complexity. This ranges from the way components are rendered to how data flows through application.</p>
						</Cell>
					</Row>

					<Row align="center" wrap className={css.reason}>
						<Cell size="12em" className={css.image}>
							<img alt="Third reason" src={custom} />
						</Cell>
						<Cell className={css.description}>
							<h3>Customizable</h3>
							<p>Enact has a full set of customizable widgets that can be tuned and tweaked to the particular style of each project. Using our experience in building full UI libraries for a broad swath of devices ranging from TVs to watches, we have created a widget library whose components can easily be composed to create complex views and applications.</p>
						</Cell>
					</Row>
				</SiteSection>

				<SiteSection accent="3" className={css.message}>

					<p>The goal of Enact is to provide the building blocks for creating robust and maintainable applications.  To that end, we&rsquo;ve pulled together the best solutions for internationalization (i18n), accessibility (a11y), focus management, linting, testing and building. Then, we created a set of reusable components and behaviors on top of that. We combined these pieces and ensured that they work together seamlessly, allowing developers to focus on implementation.</p>

				</SiteSection>

				<SiteSection>
					<Row wrap>
						<Cell size="30%" className={css.cell}>
							<h4>Installation</h4>
							<p>To make things simple, Enact provides a simple command-line tool to initialize projects and perform common actions.  Installing it is as easy as:</p>
							<p><code>npm install -g @enact/cli</code></p>
							<p>
								<Link className={css.button} to="/docs/tutorials/setup/">Learn more</Link>
							</p>
						</Cell>

						<Cell size="30%" className={css.cell}>
							<h4>Meet Moonstone</h4>
							<p>Moonstone is our TV-centric UI library. With over 50 components to choose from, Moonstone provides a solid base for creating applications designed for large screens.</p>
							<p>
								<Link className={css.button} to="/docs/modules/moonstone/BodyText/">Tell me more</Link>
							</p>
						</Cell>

						<Cell size="30%" className={css.cell}>
							<h4>Contributing</h4>
							<p>The Enact team welcomes contributions from anyone motivated to help out.</p>
							<p>
								<Link className={css.button} to="/docs/developer-guide/contributing/">Find out how</Link>
							</p>
						</Cell>
					</Row>
				</SiteSection>
			</div>
		</SiteTitle>
		);
	}
});

IndexBase.data = {
	title: 'Enact Framework'
};

export default IndexBase;
