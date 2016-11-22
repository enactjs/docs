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
				title: page.data.title,
				path: page.path
			};
		});

		const docPages = childPages.map((child, index) => {
			const isActive = prefixLink(child.path) === this.props.location.pathname;
			return (
				<li
					key={index}
					style={{
						display: 'inline-block',
						paddingRight: '20px'
					}}
				>
					<Link
						to={prefixLink(child.path)}
						style={{
							textDecoration: 'none'
						}}
					>
						{isActive ? <strong>{child.title}</strong> : child.title}
					</Link>
				</li>
			);
		});
		return (
			<div>
				<div>
					<ul
						style={{
							listStyle: 'none',
							marginLeft: 0,
							marginTop: rhythm(1 / 2)
						}}
					>
						{docPages}
					</ul>
				</div>
				<div>
					{this.props.children}
				</div>
			</div>
		);
	}
}
