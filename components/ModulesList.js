// Modules List
//
import React from 'react';
// import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import {Link} from 'react-router';
import {config} from 'config';
import {prefixLink} from 'gatsby-helpers';

export default class ModulesList extends React.Component {

	static propTypes = {
		// useFullModulePath: PropTypes.bool
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
		const {useFullModulePath, route, ...rest} = this.props;

		const componentDocs = route.pages.filter((page) =>
			page.path.includes('/docs/modules/'));
		let lastLibrary;

		const doc = route.page.data;
		const path = route.page.path.replace('/docs/modules/', '').replace(/\/$/, '');
		const pathParts = path.split('/');  // This should really be appended with this: `.join('/' + <wbr />)`, but the string confuses JSX.

		return (

			<div className="modulesList">
				{componentDocs.map((page, index) => {
					const linkText = page.path.replace('/docs/modules/', '').replace(/\/$/, '');
					const library = linkText.split('/')[0];
					if (library && library !== lastLibrary) {
						lastLibrary = library;
						return (
							<section key={index}>
								<h2>{library + (useFullModulePath ? ' Library' : '/')}</h2>
								<ul>{componentDocs.map((page, linkIndex) => {
									// Compartmentalize <li>s inside the parent UL
									const subLinkText = page.path.replace('/docs/modules/', '').replace(/\/$/, '');
									const [subLibrary, subDoc] = subLinkText.split('/');
									if (subLibrary === library) {
										return (
											<li key={linkIndex}>
												<Link to={prefixLink(page.path)}>{useFullModulePath ? subLinkText : subDoc}</Link>
											</li>
										);
									}
								})}</ul>
							</section>
						);
					}
				})}
			</div>
		);
	}
}
