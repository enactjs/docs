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
		const pathParts = path.replace(/([A-Z])/g, ' $1').split(' '); // Find all uppercase letters and allow a linebreak to happen before each one.
		// The <wbr /> is an optional line-break. It only line-breaks if it needs to, and only on the specified points. Long lines won't get cut off in the middle of words.
		// TODO: Just get this info from the doc itself?
		return (
			<Row className={css.multiColumn}>
				<Cell component="nav" size={198} className={css.sidebar}>
					<ModulesList location={this.props.location} route={this.props.route} />
				</Cell>
				<Cell className={css.moduleBody}>
					<h1>{pathParts.map((part) => [<wbr />, part])}</h1>
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
