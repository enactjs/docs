import React from 'react';
import {Link} from 'react-router';
import find from 'lodash/find';
import {prefixLink} from 'gatsby-helpers';
import includes from 'underscore.string/include';
import {config} from 'config';

import typography from 'utils/typography';
const {rhythm} = typography;

import css from '../../css/main.less';

export default class DocsTemplate extends React.Component {
	static propTypes = {
		route: React.PropTypes.object
	}

	contextTypes: {
		router: React.PropTypes.object.isRequired,
	}

	handleTopicChange (e) {
		return this.context.router.push(e.target.value);
	}

	render () {
		const childPages = config.docPages.map((p) => {
			const page = find(this.props.route.pages, (_p) => _p.path === p);
			return {
				title: page.data.title || page.path,
				path: page.path
			};
		});

		const docPages = childPages.map((child, index) => {
			const link = prefixLink(child.path);
			// Ensure we've always got the active section correct. /docs/ being a substr of every category needs special accomodation.
			const isActive = (link === this.props.location.pathname) || (child.path !== '/docs/') && includes(this.props.location.pathname, link);
			return (
				<li
					className={isActive ? css.active : null}
					key={index}
				>
					<Link to={link}>
						{child.title}
					</Link>
				</li>
			);
		});
		return (
			<div>
				<nav>
					<ul className={css.sectionList}>
						{docPages}
					</ul>
				</nav>
				<div>
					{this.props.children}
				</div>
			</div>
		);
	}
}
