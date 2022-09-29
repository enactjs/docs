import {Helmet} from 'react-helmet';
import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import {Row, Cell} from '@enact/ui/Layout';

import Page from '../../components/Page';
import SiteSection from '../../components/SiteSection';
import SiteTitle from '../../components/SiteTitle';

export const frontmatter = {
	title: 'About Us',
	description: 'Enact Framework contributors'
};

const contributors = {
	community: [
		'Nazir DOĞAN',
		'Kaloyan Kolev'
	],
	LG: [
		'Jeonghee Ahn',
		'Seungcheon Baek',
		'Juwon Jeong',
		'Hyeok Jo',
		'Jae Jo',
		'Baekwoo Jung',
		'Bongsub Kim',
		'Mikyung Kim',
		'Chang Gi Lee',
		'Goun Lee',
		'Seonghyup Park',
		'Seungho Park',
		'Sijeong Ro',
		'YunBum Sung'
	],
	LGSI: [
		'Cholan Madala',
		'Richa Shaurbh',
		'Srirama Singeri',
		'Anish T.D',
		'Antony Willet'
	],
	LGSVL: [
		'Renuka Atale',
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
		'Alicia Stice',
		'Roy Sutton',
		'Aaron Tam',
		'Jeremy Thomas',
		'Derek Tor'
	]
};

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
	propTypes: {
		location: PropTypes.object
	},
	render: ({location}) => {
		const {community, LG, LGSI, LGSVL} = contributors;
		return (
			<Page location={location}>
				<SiteTitle title={frontmatter.title}>
					<div>
						<Helmet>
							<meta name="description" content={frontmatter.description} />
						</Helmet>
						<SiteSection accent="3" style={{padding: '1em 0', marginBottom: '1em'}}>
							<h1>{frontmatter.title}</h1>
							<p>Enact is a labor of love conceived by the team that brought you <a href="http://enyojs.com" target="_blank" rel="noreferrer">Enyo</a>. We are grateful to LG Electronics for supporting the development of this open source framework.</p>
						</SiteSection>

						<SiteSection style={{paddingBottom: '2em'}}>
							<h3>Contributors</h3>
							<h4>LG Silicon Valley Lab - U.S.A.</h4>
							<Team members={LGSVL} />
							<hr />
							<h4>LG - South Korea</h4>
							<Team members={LG} />
							<hr />
							<h4>LG Software India - India</h4>
							<Team members={LGSI} />
							<hr />
							<h4>Community Members - Worldwide</h4>
							<Team members={community} />
							<hr />
							<p>Maybe you too‽</p>
						</SiteSection>
					</div>
				</SiteTitle>
			</Page>
		);
	}
});

export default AboutUs;
