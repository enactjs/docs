// Modules List
//
import React from 'react';
import Type from '../Type';

import css from './TypesKey.less';

const types = [
	'Array',
	'Boolean',
	'Function',
	'Module',
	'Number',
	'Object',
	'String'
];

export default class TypesKey extends React.Component {
	render () {
		return (
			<div {...this.props} className="typesKey">
				<label className="title">Variable Types Key:</label>
				{types.map((type, index) => (
					<Type key={index}>{type}</Type>
				))}
			</div>
		);
	}
}
