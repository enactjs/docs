import React from 'react';
// import DocumentTitle from 'react-document-title';
import {prefixLink} from 'gatsby-helpers';
import {Link} from 'react-router';
import kind from '@enact/core/kind';
import {Row, Cell} from '@enact/ui/Layout';

import Page from '../../../../components/Page';
import SiteSection from '../../../../components/SiteSection';

import css from './index.less';


const IndexBase = kind({
	name: 'Home',
	// propTypes: {
	// 	body: React.PropTypes.string
	// },
	styles: {
		css,
		className: 'home'
	},
	render (props) {
		return (<Page {...props} manualLayout>
			<SiteSection accent="2">
				<div className={css.image}>
					<img alt="Cute animated getting ready image" src="" />
				</div>
				<div className={css.content}>
					<p>Enact is a framework designed to be performant, customizable and well structured.</p>
				</div>
			</SiteSection>

			<SiteSection>
				<section>
					<div className={css.image}>
						<img alt="Cute animated getting ready image" src="" />
					</div>
					<div className={css.content}>
						<p>Enact is a framework designed to be performant, customizable and well structured.</p>
					</div>
				</section>

				<hr />

				<section>
					<div className={css.image}>
						<img alt="Cute animated getting ready image" src="" />
					</div>
					<div className={css.content}>
						<p>Enact is a framework designed to be performant, customizable and well structured.</p>
					</div>
				</section>

				<hr />

				<section>
					<div className={css.image}>
						<img alt="Cute animated getting ready image" src="images/enact-home-hero.png" />
					</div>
					<div className={css.content}>
						<p>Enact is a framework designed to be performant, customizable and well structured.</p>
					</div>
				</section>
			</SiteSection>
		</Page>
		);
	}
});

export default IndexBase;
