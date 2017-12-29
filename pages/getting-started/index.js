import React from 'react';
// import DocumentTitle from 'react-document-title';
import {prefixLink} from 'gatsby-helpers';
import {Link} from 'react-router';
import kind from '@enact/core/kind';
import {Row, Cell} from '@enact/ui/Layout';

import Page from '../../components/Page';
import SiteSection from '../../components/SiteSection';

import css from './index.less';

const IndexBase = kind({
	name: 'Home',
	// propTypes: {
	// 	body: React.PropTypes.string
	// },
	styles: {
		css,
		className: 'gettingStarted'
	},
	render (props) {
		return (<Page {...props} manualLayout>
			<SiteSection accent="2">
				<Row align="center" component="section" className={css.hero}>
					<Cell size={100} className={css.image} shrink>
						<img alt="Cute animated getting ready image" src="images/getting-started.svg" /><br />
					</Cell>
					<Cell size="70%" className={css.content}>
						<h1>Developer Documentation</h1>
						<p>Enact is a framework designed to be performant, customizable and well structured.</p>
					</Cell>
				</Row>
			</SiteSection>

			<SiteSection>
				<Row align="center" component="section" className={css.linkBox}>
					<Cell size={200} className={css.image} shrink>
						<img alt="Cute animated getting ready image" src="images/tutorials.svg" /><br />
						Tutorials
					</Cell>
					<Cell>
						<Row wrap className={css.content}>
							<Cell size="35%" className={css.cell} component={Link} to={prefixLink('/docs/tutorials/getting-started/')}>One</Cell>
							<Cell size="35%" className={css.cell} component={Link} to={prefixLink('/docs/tutorials/getting-started/')}>Two</Cell>
							<Cell size="35%" className={css.cell} component={Link} to={prefixLink('/docs/tutorials/getting-started/')}>Three</Cell>
							<Cell size="35%" className={css.cell} component={Link} to={prefixLink('/docs/tutorials/getting-started/')}>Four</Cell>
							<Cell size="35%" className={css.cell} component={Link} to={prefixLink('/docs/tutorials/getting-started/')}>Five</Cell>
						</Row>
					</Cell>
				</Row>

				<hr />

				<Row align="center" component="section" className={css.linkBox}>
					<Cell size={200} className={css.image} shrink>
						<img alt="Cute animated getting ready image" src="images/modules.svg" /><br />
						Modules
					</Cell>
					<Cell>
						<Row wrap className={css.content}>
							<Cell size="35%" className={css.cell} component={Link} to={prefixLink('/docs/tutorials/getting-started/')}>One</Cell>
							<Cell size="35%" className={css.cell} component={Link} to={prefixLink('/docs/tutorials/getting-started/')}>Two</Cell>
							<Cell size="35%" className={css.cell} component={Link} to={prefixLink('/docs/tutorials/getting-started/')}>Three</Cell>
							<Cell size="35%" className={css.cell} component={Link} to={prefixLink('/docs/tutorials/getting-started/')}>Four</Cell>
							<Cell size="35%" className={css.cell} component={Link} to={prefixLink('/docs/tutorials/getting-started/')}>Five</Cell>
						</Row>
					</Cell>
				</Row>

				<hr />

				<Row align="center" component="section" className={css.linkBox}>
					<Cell size={200} className={css.image} shrink>
						<img alt="Cute animated getting ready image" src="images/guide.svg" /><br />
						Developer Guide
					</Cell>
					<Cell>
						<Row wrap className={css.content}>
							<Cell size="35%" className={css.cell} component={Link} to={prefixLink('/docs/tutorials/getting-started/')}>One</Cell>
							<Cell size="35%" className={css.cell} component={Link} to={prefixLink('/docs/tutorials/getting-started/')}>Two</Cell>
							<Cell size="35%" className={css.cell} component={Link} to={prefixLink('/docs/tutorials/getting-started/')}>Three</Cell>
							<Cell size="35%" className={css.cell} component={Link} to={prefixLink('/docs/tutorials/getting-started/')}>Four</Cell>
							<Cell size="35%" className={css.cell} component={Link} to={prefixLink('/docs/tutorials/getting-started/')}>Five</Cell>
							<Cell size="35%" className={css.cell} component={Link} to={prefixLink('/docs/tutorials/getting-started/')}>Six</Cell>
							<Cell size="35%" className={css.cell} component={Link} to={prefixLink('/docs/tutorials/getting-started/')}>Seven</Cell>
							<Cell size="35%" className={css.cell} component={Link} to={prefixLink('/docs/tutorials/getting-started/')}>Eight</Cell>
							<Cell size="35%" className={css.cell} component={Link} to={prefixLink('/docs/tutorials/getting-started/')}>Nine</Cell>
							<Cell size="35%" className={css.cell} component={Link} to={prefixLink('/docs/tutorials/getting-started/')}>Ten</Cell>
							<Cell size="35%" className={css.cell} component={Link} to={prefixLink('/docs/tutorials/getting-started/')}>Eleven</Cell>
							<Cell size="35%" className={css.cell} component={Link} to={prefixLink('/docs/tutorials/getting-started/')}>Twelve</Cell>
							<Cell size="35%" className={css.cell} component={Link} to={prefixLink('/docs/tutorials/getting-started/')}>Thirteen</Cell>
							<Cell size="35%" className={css.cell} component={Link} to={prefixLink('/docs/tutorials/getting-started/')}>Fourteen</Cell>
							<Cell size="35%" className={css.cell} component={Link} to={prefixLink('/docs/tutorials/getting-started/')}>Fifteen</Cell>
						</Row>
					</Cell>
				</Row>

				<hr />

				<Row align="center" component="section" className={css.linkBox}>
					<Cell size={200} className={css.image} shrink>
						<img alt="Cute animated getting ready image" src="images/devtools.svg" /><br />
						Developer Tools
					</Cell>
					<Cell>
						<Row wrap className={css.content}>
							<Cell size="35%" className={css.cell} component={Link} to={prefixLink('/docs/tutorials/getting-started/')}>One</Cell>
							<Cell size="35%" className={css.cell} component={Link} to={prefixLink('/docs/tutorials/getting-started/')}>Two</Cell>
							<Cell size="35%" className={css.cell} component={Link} to={prefixLink('/docs/tutorials/getting-started/')}>Three</Cell>
							<Cell size="35%" className={css.cell} component={Link} to={prefixLink('/docs/tutorials/getting-started/')}>Four</Cell>
							<Cell size="35%" className={css.cell} component={Link} to={prefixLink('/docs/tutorials/getting-started/')}>Five</Cell>
						</Row>
					</Cell>
				</Row>

				<hr />
			</SiteSection>
		</Page>
		);
	}
});

export default IndexBase;
