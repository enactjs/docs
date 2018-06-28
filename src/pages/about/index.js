import DocumentTitle from 'react-document-title';
import kind from '@enact/core/kind';
import {OutboundLink} from 'gatsby-plugin-google-analytics';
import PropTypes from 'prop-types';
import React from 'react';
import {Row, Cell} from '@enact/ui/Layout';

import SiteSection from '../../components/SiteSection';
import SiteTitle from '../../components/SiteTitle';

export const frontmatter = {
	title: 'About Us'
};

const contrib = [
	[
		'Stephen Choi',
		'Dave Freeman',
		'Lis Hammel',
		'Jeff Lam',
		'Teck Liew',
		'Gray Norton',
		'Jason Robitaille',
		'Lucie Roy',
		'HanGyeol Hailey Ryu',
		'Blake Stephens',
		'Alan Stice',
		'Roy Sutton',
		'Aaron Tam',
		'Jeremy Thomas',
		'Derek Tor'
	],
	[
		'Jeonghee Ahn',
		'Seungcheon Baek',
		'Hyeok Jo',
		'Jae Jo',
		'Baekwoo Jung',
		'Bongsub Kim',
		'Mikyung Kim',
		'Chang Gi Lee',
		'Goun Lee',
		'Seonghyup Park',
		'Seungho Park',
		'YunBum Sung'
	],
	[
		'Cholan Madala',
		'Richa Shaurbh',
		'Srirama Singeri',
		'Anish T.D',
		'Antony Willet'
	]
];

const Team = kind({
	name: 'Team',
	propTypes: {
		members: PropTypes.array
	},
	render: ({members}) => (
		<Row wrap>
			{members.map((member, index) =>
				<Cell size="33%" key={index} style={{minWidth: '200px'}}>{member}</Cell>
			)}
		</Row>
	)
});

const AboutUs = kind({
	name: 'AboutUs',
	render: () => (
		<SiteTitle title={frontmatter.title}>
			<div>
				<SiteSection accent="3" style={{padding: '1em 0', marginBottom: '1em'}}>
					<h1>{frontmatter.title}</h1>
					<p>Enact is a labor of love conceived by the team that brought you <OutboundLink href="http://enyojs.com" target="_blank">Enyo</OutboundLink>. We are grateful to LG Electronics for supporting the development of this open source framework.</p>
				</SiteSection>

				<SiteSection style={{paddingBottom: '2em'}}>
					<h3>Contributors</h3>
					<h4>LG Silicon Valley Lab - U.S.A.</h4>
					<Team members={contrib[0]} />
					<hr />
					<h4>LG R&D - South Korea</h4>
					<Team members={contrib[1]} />
					<hr />
					<h4>LG Software India - India</h4>
					<Team members={contrib[2]} />
					<hr />
					<p>Maybe you too‽</p>
				</SiteSection>
			</div>
		</SiteTitle>
	)
});

export default AboutUs;
