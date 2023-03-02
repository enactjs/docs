import {graphql} from 'gatsby';
import PropTypes from 'prop-types';
import {Component} from 'react';

import EditContent from '../components/EditContent';
import ModulesList from '../components/ModulesList';
import Page from '../components/Page';
import {renderModuleDescription, renderModuleMembers} from '../utils/modules';
import SiteTitle from '../components/SiteTitle';
import TypesKey from '../components/TypesKey';

export default class JSONWrapper extends Component {

	static propTypes = {
		data: PropTypes.object,
		location: PropTypes.object
	};
	constructor (props) {
		super(props);
		this.state = {
			responseRenderModuleDescription: null,
			responseRenderModuleMembers: null
		};
	}
	async componentDidMount () {
		const doc = JSON.parse(this.props.data.jsonDoc.internal.content);
		this.setState({
			responseRenderModuleDescription: await renderModuleDescription(doc),
			responseRenderModuleMembers: await renderModuleMembers(doc[0].members)
		});
	}

	render () {
		const doc = JSON.parse(this.props.data.jsonDoc.internal.content);
		const path = this.props.location.pathname.replace(/.*\/docs\/modules\//, '').replace(/\/$/, '');
		const pathParts = path.replace(/([A-Z])/g, ' $1').split(' '); // Find all uppercase letters and allow a linebreak to happen before each one.
		// The <wbr /> is an optional line-break. It only line-breaks if it needs to, and only on the specified points. Long lines won't get cut off in the middle of words.
		// TODO: Just get this info from the doc itself?
		return (
			<Page
				description={`Module documentation for ${path}`}
				nav
				{...this.props}
			>
				<sidebar>
					<ModulesList location={this.props.location} modules={this.props.data.modulesList.edges} />
				</sidebar>
				<SiteTitle {...this.props} title={path}>
					<div>
						<EditContent>
							{'test2'}
							{doc[0]}
						</EditContent>
						<h1>{pathParts.map((part, idx) => [<wbr key={idx} />, part])}</h1>
						{this.state.responseRenderModuleDescription}
						{this.state.responseRenderModuleMembers}
						<div className="moduleTypesKey">
							<TypesKey />
						</div>
					</div>
				</SiteTitle>
			</Page>
		);
	}
}

export const jsonQuery = graphql`
	query jsonBySlug($slug: String!) {
		jsonDoc(fields: { slug: { eq: $slug } }) {
			fields {
				slug
			}
			internal {
				content
			}
		}
		modulesList: allJsonDoc(sort: {fields: [fields___slug], order: ASC}) {
			edges {
				node {
					fields {
						slug
					}
				}
			}
		}
		# for Page
		site {
			siteMetadata {
				title
			}
		}
		# For NavBar (in Page)
		docsPages: allSitePage(
			filter:{
				path:{regex: "/\/docs\/[^/]*\/$/"}
			}
		) {
			edges {
				node {
					path
					pageContext
				}
			}
		}
		# For NavBar
		jsMetadata: allJavascriptFrontmatter (
			filter:{
				fields:{
					slug: {regex: "/docs\\/[^/]*\\/$/"}
				}
			}
		) {
			edges{
				node{
					fields {
						slug
					}
					fileAbsolutePath
					frontmatter {
						description
						title
					}
				}
			}
		}
	}
`;
