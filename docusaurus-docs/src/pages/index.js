import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {Cell, Row} from '@enact/ui/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import SiteSection from '@site/src/components/SiteSection';
import Layout from '@theme/Layout';

import starsSmall from '/img/stars-small.svg';

import styles from './index.module.scss';

function HomepageHeader() {
	const {siteConfig} = useDocusaurusContext();
	return (
		<header className={styles.home}>
			<SiteSection accent="Home" className={styles.hero}>
				<div className={styles.image}>
					<img alt="Cute animated getting ready image"
						 loading="eager"
						 src="/img/enact-home-hero.svg" />
				</div>
				<div className={styles.intro} style={{backgroundImage: `url(${starsSmall})`}}>
					<div className={styles.ufoTrack}>
						<img className={styles.ufo} alt="Cheerful floating UFO"
							 loading="eager"
							 src="/img/ufo.svg" />
					</div>
					<p className="hero__subtitle">
						An app development framework built atop React that&rsquo;s easy to use, performant and customizable.
					</p>
					<div className={styles.buttons}>
						<Link className={styles.button} to="/docs/tutorials/introduction/">Getting Started</Link>
						<Link className={styles.button} to="/docs/developer-guide/">API</Link>
					</div>
				</div>
			</SiteSection>
		</header>
	);
}

export default function Home() {
	const {siteConfig} = useDocusaurusContext();
	return (
		<Layout
			title={`Hello from ${siteConfig.title}`}
			description="Description will go into a meta tag in <head />">
			<HomepageHeader />
			<main className={styles.home}>
				<HomepageFeatures />
				<SiteSection accent="3" className={styles.message}>
					<p>The goal of Enact is to provide the building blocks for creating robust and maintainable applications.  To that end, we&rsquo;ve pulled together the best solutions for internationalization (i18n), accessibility (a11y), focus management, linting, testing and building. Then, we created a set of reusable components and behaviors on top of that. We combined these pieces and ensured that they work together seamlessly, allowing developers to focus on implementation.</p>
				</SiteSection>
				<SiteSection>
					<Row wrap>
						<Cell size="30%" className={styles.cell}>
							<h4>Installation</h4>
							<p>To make things simple, Enact provides a simple command-line tool to initialize projects and perform common actions.  Installing it is as easy as:</p>
							<p><code>npm install -g @enact/cli</code></p>
							<p>
								<Link className={styles.button} to="/docs/tutorials/setup/">Setup Guide</Link>
							</p>
						</Cell>
						<Cell size="30%" className={styles.cell}>
							<h4>Meet Sandstone</h4>
							<p>Sandstone is our TV-centric UI library. With over 50 components to choose from, Sandstone provides a solid base for creating applications designed for large screens.</p>
							<p>
								<Link className={styles.button} to="/docs/modules/sandstone/BodyText/">Sandstone API</Link>
							</p>
						</Cell>
						<Cell size="30%" className={styles.cell}>
							<h4>Contributing</h4>
							<p>The Enact team welcomes contributions from anyone motivated to help out.</p>
							<p>
								<Link className={styles.button} to="/docs/developer-guide/contributing/">Contribution Guide</Link>
							</p>
						</Cell>
					</Row>
				</SiteSection>
			</main>
		</Layout>
	);
}
