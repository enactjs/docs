import React from 'react';
// import DocumentTitle from 'react-document-title';
import {prefixLink} from 'gatsby-helpers';
import {Link} from 'react-router';
import kind from '@enact/core/kind';
import {Row, Cell} from '@enact/ui/Layout';

import Page from '../components/Page';
import SiteSection from '../components/SiteSection';

import css from './index.less';


const IndexBase = kind({
	name: 'Home',
	propTypes: {
		body: React.PropTypes.string
	},
	styles: {
		css,
		className: 'home'
	},
	render (props) {
		return (<Page {...props} manualLayout>
			<SiteSection accent="Home" className={css.hero}>
				<div className={css.image}>
					<img alt="Cute animated getting ready image" src="images/enact-home-hero.svg" />
				</div>
				<div className={css.intro}>
					<div className={css.ufoTrack}><img className={css.ufo} alt="Cheerful UFO floating" src="images/ufo.svg" /></div>
					<p>Enact is a framework designed to be performant, customizable and well structured.</p>
					<div className={css.buttons}>
						<Link className={css.button} to={prefixLink('/getting-started/')}>Getting Started</Link>
						<Link className={css.button} to={prefixLink('/docs/modules/')}>API</Link>
					</div>
				</div>
			</SiteSection>

			<SiteSection>
				<Row align="center" wrap className={css.reason}>
					<Cell size="12em" className={css.image}>
						<img alt="First reason" src="images/enact-home-easy.svg" />
					</Cell>
					<Cell className={css.description}>
						<h3>Ease of Use</h3>
						<p>Enact builds atop the excellent React library, and provides a full framework to the developer. The recent boom of web technologies and related tools has led to a plethora of options available. In fact, getting started might be the most difficult part of building a modern web application.</p>
					</Cell>
				</Row>

				<Row align="center" wrap className={css.reason}>
					<Cell size="12em" className={css.image}>
						<img alt="Second reason" src="images/enact-home-perf.svg" />
					</Cell>
					<Cell className={css.description}>
						<h3>Performance</h3>
						<p>Beyond initial setup, Enact continues to provide benefits. It was built with performance in mind, and conscious decisions were made to ensure that applications remain performant as they grow in size and complexity. This ranges from the way components are rendered to how data flows through application.</p>
					</Cell>
				</Row>

				<Row align="center" wrap className={css.reason}>
					<Cell size="12em" className={css.image}>
						<img alt="Third reason" src="images/enact-home-custom.svg" />
					</Cell>
					<Cell className={css.description}>
						<h3>Customizability</h3>
						<p>Enact has a full set of customizable widgets that can be tuned and tweaked to the particular style of each project. Using our experience in building full UI libraries for a broad swath of devices ranging from TVs to watches, we have created a widget library whose components can easily be composed to create complex views and applications.</p>
					</Cell>
				</Row>
			</SiteSection>

			<SiteSection accent="3" className={css.message}>

				<p>Placeholder message</p>

			</SiteSection>

			<SiteSection>
				<Row wrap>
					<Cell size="30%" className={css.cell}>
						<h4>core/factory</h4>
						<p><small>Exports the core/factory.factory function for creating customizeable components.</small></p>
						<p><em><strong>factory(defaultConfig, fn)</strong> - Function</em></p>
						<p>Creates a factory function which reconciles a default configuration object (defaultConfig) and a customized configuration object and provides the result to an executing function (fn). The configuration objects are processed by features which determine how to reconcile the values from each.</p>
					</Cell>

					<Cell size="30%" className={css.cell}>
						<h4>moonstone/Button</h4>
						<p><small>Exports the moonstone/Button.Button and moonstone/Button.ButtonBase components. The default export is moonstone/Button.Button.</small></p>
						<p><em><strong>Button</strong> - Component</em></p>
						<p>moonstone/Button.Button is a Button with Moonstone styling, Spottable and Touchable applied. If the Button s child component is text, it will be uppercased unless casing is set.</p>
					</Cell>

					<Cell size="30%" className={css.cell}>
						<h4>ui/FloatingLayer</h4>
						<p><small>Exports the ui/FloatingLayer.FloatingLayer component and ui/FloatingLayer.FloatingLayerDecorator Higher-order Component (HOC). The default export is ui/FloatingLayer.FloatingLayer.</small></p>
						<p><em><strong>FloatingLayer</strong> - Component</em></p>
						<p>ui/FloatingLayer.FloatingLayer is a component that creates an entry point to the new render tree. This is used for modal components such as popups.</p>
					</Cell>
				</Row>
			</SiteSection>
		</Page>
		);
	}
});

export default IndexBase;
