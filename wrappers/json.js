import ModulesList from '../components/ModulesList.js';
import React from 'react';
import {renderModuleDescription, renderModuleMembers} from '../utils/modules.js';
import {Row, Cell} from '@enact/ui/Layout';
import TypesKey from '../components/TypesKey';

import css from '../css/main.less';

export default class JSONWrapper extends React.Component {

	render () {
		const doc = this.props.route.page.data;
		const path = this.props.route.page.path.replace('/docs/modules/', '').replace(/\/$/, '');
		// TODO: Just get this info from the doc itself?
		return (
			<Row className={css.multiColumn}>
				<Cell component="nav" size={198} className={css.sidebar}>
					<ModulesList location={this.props.location} route={this.props.route} />
				</Cell>
				<Cell className={css.moduleBody}>
					<h1>{path}</h1>
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
