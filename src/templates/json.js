import PropTypes from 'prop-types';
import React from 'react';
import {Row, Cell} from '@enact/ui/Layout';

import ModulesList from '../components/ModulesList';
import TypesKey from '../components/TypesKey';
import SiteTitle from '../components/SiteTitle';
import {renderModuleDescription, renderModuleMembers} from '../utils/modules';

export default class JSONWrapper extends React.Component {

	static propTypes = {
		data: PropTypes.object,
		location: PropTypes.object
	};

	render () {
		const doc = JSON.parse(this.props.data.jsonDoc.internal.content);
		const path = this.props.location.pathname.replace('/docs/modules/', '').replace(/\/$/, '');
		const pathParts = path.replace(/([A-Z])/g, ' $1').split(' '); // Find all uppercase letters and allow a linebreak to happen before each one.
		// The <wbr /> is an optional line-break. It only line-breaks if it needs to, and only on the specified points. Long lines won't get cut off in the middle of words.
		// TODO: Just get this info from the doc itself?
		return (
			<SiteTitle {...this.props} title={path}>
				<Row className="multiColumn">
					<Cell component="nav" size={198} className="sidebar">
						<ModulesList location={this.props.location} modules={this.props.data.modulesList.edges} />
					</Cell>
					<Cell className="moduleBody">
						<h1>{pathParts.map((part, idx) => [<wbr key={idx} />, part])}</h1>
						{renderModuleDescription(doc)}
						{renderModuleMembers(doc[0].members)}
						<div className="moduleTypesKey">
							<TypesKey />
						</div>
					</Cell>
				</Row>
			</SiteTitle>
		);
	}
	// The following is the simplified proposed replacement for the above code.
	//
	// <div>
	// 	<h1>{pathParts.map((part, idx) => [<wbr key={idx} />, part])}</h1>
	// 	{renderModuleDescription(doc)}
	// 	{renderModuleMembers(doc[0].members)}
	// 	<div style={{textAlign: 'center'}}>
	// 		<TypesKey />
	// 	</div>
	// </div>
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
	}
`;
