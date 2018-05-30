// Modules List
//

import React from 'react';
import PropTypes from 'prop-types';
import Link from 'gatsby-link';

import {linkIsLocation} from '../utils/paths.js';

import css from '../css/main.less';

export default class ModulesList extends React.Component {

	static propTypes = {
		location: PropTypes.object,
		modules: PropTypes.array,
		useFullModulePath: PropTypes.bool
	};

	static defaultProps = {
		useFullModulePath: false
	};

	static metadata () {
		return {
			title: 'Modules'
		};
	}

	render () {
		const {useFullModulePath, modules, location} = this.props;

		const componentDocs = modules.edges.filter((page) =>
			page.node.fields.slug.includes('/docs/modules/'));
		let lastLibrary;

		const path = location.pathname.replace('/docs/modules/', '').replace(/\/$/, '');
		const pathParts = path.split('/');  // This should really be appended with this: `.join('/' + <wbr />)`, but the string confuses JSX.

		return (
			<div className={css.modulesList + ' covertLinks'}>
				<section>
					<h2>
						<a href="/docs/modules/">Overview</a>
					</h2>
				</section>
				{componentDocs.map((section, index) => {
					const linkText = section.node.fields.slug.replace('/docs/modules/', '').replace(/\/$/, '');
					const library = linkText.split('/')[0];
					const isActive = (pathParts[0] === library);
					if (library && library !== lastLibrary) {
						lastLibrary = library;
						return (
							<section key={index}>
								<h2 className={isActive ? css.active : null}><Link to={section.node.fields.slug}>{library + ' Library'}</Link></h2>
								{(isActive) ? (
									<ul>{componentDocs.map((page, linkIndex) => {
										// Compartmentalize <li>s inside the parent UL
										const subLinkText = page.node.fields.slug.replace('/docs/modules/', '').replace(/\/$/, '');
										const [subLibrary, subDoc = subLibrary] = subLinkText.split('/');
										const isActivePage = linkIsLocation(page.node.fields.slug, location.pathname);
										if (subLibrary === library) {
											return (
												<li key={linkIndex} className={isActivePage ? css.active : null}>
													<Link to={page.node.fields.slug}>{useFullModulePath ? subLinkText : subDoc}</Link>
												</li>
											);
										}
									})}</ul>) : null
								}
							</section>
						);
					}
				})}
			</div>
		);
	}
}
