import ModulesList from '../components/ModulesList.js';
import PropTypes from 'prop-types';
import React from 'react';
import {renderModuleDescription, renderModuleMembers} from '../utils/modules.js';
import {Row, Cell} from '@enact/ui/Layout';
import TypesKey from '../components/TypesKey';

import css from '../css/main.less';

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
			<Row className={css.multiColumn}>
				<Cell component="nav" size={198} className={css.sidebar}>
					<ModulesList location={this.props.location} modules={this.props.data.modulesList.edges} />
				</Cell>
				<Cell className={css.moduleBody}>
					<h1>{pathParts.map((part, idx) => [<wbr key={idx} />, part])}</h1>
					{renderModuleDescription(doc)}
					{renderModuleMembers(doc[0].members)}
					<div className={css.moduleTypesKey}>
						<TypesKey />
					</div>
				</Cell>
			</Row>
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
	}
`;
