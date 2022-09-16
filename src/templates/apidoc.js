import {graphql} from 'gatsby';
import PropTypes from 'prop-types';
import { Component } from 'react';

import EditContent from '../components/EditContent/EditContent';
import ModulesList from '../components/ModulesList/ModulesList';
import Page from '../components/Page/Page';
import {renderModuleDescription, renderModuleMembers} from '../utils/modules';
import SiteTitle from '../components/SiteTitle/SiteTitle';
import TypesKey from '../components/TypesKey/TypesKey';

export default class JSONWrapper extends Component {

	static propTypes = {
		data: PropTypes.object,
		location: PropTypes.object
	};

	render () {
		const moduleMembers = this.props.data.moduleMembers.edges;
		const isModuleDescription = (edge) => edge.node.kind === 'module';
		const moduleIndex = moduleMembers.findIndex(isModuleDescription);
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
							{moduleMembers[moduleIndex].node}
						</EditContent>
						<h1>{pathParts.map((part, idx) => [<wbr key={idx} />, part])}</h1>
						{renderModuleDescription(moduleMembers[moduleIndex])}
						{renderModuleMembers(moduleMembers)}
						<div className="moduleTypesKey">
							<TypesKey />
						</div>
					</div>
				</SiteTitle>
			</Page>
		);
	}
}

export const apiDocQuery = graphql`
	query apiDocBySlug($slug: String!) {
		moduleMembers: allDocumentationJs(
			filter: {fields: {slug: {eq: $slug}}}
			sort: {fields: name, order: ASC}
		) {
			edges {
				node {
					id
					name
					kind
					memberof
					members {
						static {
							kind
							name
							tags {
								title
								name
								description
							}
							description {
								childMarkdownRemark {
									html
									htmlAst
								}
							}
							returns {
								name
								description {
								  childMarkdownRemark {
									html
									htmlAst
								  }
								}
								type {
									name
									type
									value
									expression
									applications
									elements
								}
							}
							params {
								name
								default
								optional
								type {
								  name
								  type
								  value
								  expression
								  applications
								  elements
								}
								description {
									childMarkdownRemark {
									  html
									  htmlAst
									}
								}
								properties {
									name
									kind
									memberof
									description {
										childMarkdownRemark {
										  html
										  htmlAst
										}
									}
									type {
										name
										type
										value
										expression
										applications
										elements
									}
									optional
									tags {
										name
										description
										title
									}
								}
							}
							type {
								name
								type
								value
								expression
								applications
								elements
							}
							properties {
								name
								kind
								memberof
								description {
									childMarkdownRemark {
									  html
									  htmlAst
									}
								}
								type {
									name
									type
									value
									expression
									applications
									elements
								}
								optional
								tags {
									name
									description
									title
								}
							}
							members {
								static {
									kind
									name
									tags {
										title
										name
										description
									}
									description {
										childMarkdownRemark {
											html
											htmlAst
										}
									}
									returns {
										name
										description {
										  childMarkdownRemark {
											html
											htmlAst
										  }
										}
										type {
											name
											type
											value
											expression
											applications
											elements
										}
									}
									params {
										name
										default
										optional
										type {
										  name
										  type
										  value
										  expression
										  applications
										  elements
										}
										description {
											childMarkdownRemark {
											  html
											  htmlAst
											}
										}
										properties {
											name
											kind
											memberof
											description {
												childMarkdownRemark {
												  html
												  htmlAst
												}
											}
											type {
												name
												type
												value
												expression
												applications
												elements
											}
											optional
											tags {
												name
												description
												title
											}
										}
									}
									type {
										name
										type
										value
										expression
										applications
										elements
									}
									properties {
										name
										kind
										memberof
										description {
											childMarkdownRemark {
											  html
											  htmlAst
											}
										}
										type {
											name
											type
											value
											expression
											applications
											elements
										}
										optional
										tags {
											name
											description
											title
										}
									}
								}
							}
						}
						instance {
							kind
							name
							tags {
								title
								name
								description
							}
							description {
								childMarkdownRemark {
									html
									htmlAst
								}
							}
							returns {
								name
								description {
								  childMarkdownRemark {
									html
									htmlAst
								  }
								}
								type {
									name
									type
									value
									expression
									applications
									elements
								}
							}
							params {
								name
								default
								optional
								type {
								  name
								  type
								  value
								  expression
								  applications
								  elements
								}
								description {
									childMarkdownRemark {
									  html
									  htmlAst
									}
								}
								properties {
									name
									kind
									memberof
									description {
										childMarkdownRemark {
										  html
										  htmlAst
										}
									}
									type {
										name
										type
										value
										expression
										applications
										elements
									}
									optional
									tags {
										name
										description
										title
									}
								}
							}
							type {
								name
								type
								value
								expression
								applications
								elements
							}
							properties {
								name
								kind
								memberof
								description {
									childMarkdownRemark {
									  html
									  htmlAst
									}
								}
								type {
									name
									type
									value
									expression
									applications
									elements
								}
								optional
								tags {
									name
									description
									title
								}
							}
						}
					  }
					tags {
						title
						name
						description
					}
					description {
						childMarkdownRemark {
							html
							htmlAst
						}
					}
					returns {
						name
						description {
						  childMarkdownRemark {
							html
							htmlAst
						  }
						}
						type {
							name
							type
							value
							expression
							applications
							elements
						}
					}
					params {
						name
						default
						optional
						type {
						  name
						  type
						  value
						  expression
						  applications
						  elements
						}
						description {
							childMarkdownRemark {
							  html
							  htmlAst
							}
						}
						properties {
							name
							kind
							memberof
							description {
								childMarkdownRemark {
								  html
								  htmlAst
								}
							}
							type {
								name
								type
								value
								expression
								applications
								elements
							}
							optional
							tags {
								name
								description
								title
							}
						}
					}
					type {
						name
						type
						value
						expression
						applications
						elements
					}
					parent {
						id
					}
					properties {
						name
						kind
						memberof
						description {
							childMarkdownRemark {
							  html
							  htmlAst
							}
						}
						type {
							name
							type
							value
							expression
							applications
							elements
						}
						optional
						tags {
							name
							description
							title
						}
					}
				}
			}
		}
		modulesList: allDocumentationJs(
			filter: {
				tags: {elemMatch: {title: {in: "module"}}}
			}
			sort: {fields: name, order: ASC}
		) {
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
