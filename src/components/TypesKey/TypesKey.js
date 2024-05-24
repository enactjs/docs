// Variable Types Key
//
import kind from '@enact/core/kind';
import Type from '../Type';

import * as css from './TypesKey.module.less';

const types = [
	'Array',
	'Boolean',
	'Function',
	'Module',
	'Number',
	'Object',
	'String'
];

const TypesKey = kind({
	name: 'Type',

	styles: {
		css,
		className: 'typesKey'
	},

	computed: {
		typesList: () => types.map((type, index) => (
			<Type key={index}>{type}</Type>
		))
	},

	render: ({typesList, ...rest}) => (
		<div {...rest}>
			<label className={css.title}>Variable Types Key:</label>
			{typesList}
		</div>
	)
});

export default TypesKey;
