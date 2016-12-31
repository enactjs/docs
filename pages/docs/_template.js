import React from 'react';
import {Link} from 'react-router';
import find from 'lodash/find';
import {prefixLink} from 'gatsby-helpers';
import {config} from 'config';

import typography from 'utils/typography';
const {rhythm} = typography;

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
			const isActive = prefixLink(child.path) === this.props.location.pathname;
			return (
				<li
					className={isActive ? 'active' : null}
					key={index}
				>
					<Link to={prefixLink(child.path)}>
						{child.title}
					</Link>
				</li>
			);
		});
		return (
			<div>
				<nav>
					<ul className="sectionList">
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
