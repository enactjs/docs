/**
 * Converts type expression to readable string
 *
 * @param type
 * @returns {*|string}
 */
function typeToString (type) {
	if (!type) return 'any';

	if (typeof type === 'string') return type;

	switch (type.type) {
		case 'NameExpression':
			return type.name;
		case 'OptionalType':
			return `${typeToString(type.expression)}?`;
		case 'UnionType':
			return type.elements.map(typeToString).join(' | ');
		case 'ArrayType':
			return `${typeToString(type.elements[0])}[]`;
		case 'TypeApplication': {
			const base = typeToString(type.expression);
			const params = type.applications.map(typeToString).join(', ');
			return `${base}(${params})`;
		}
		case 'FunctionType':
			return 'Function';
		case 'AllLiteral':
			return 'Any';
		case 'NullableLiteral':
			return 'null';
		case 'RestType':
			return `...${typeToString(type.expression)}`;
		case 'UndefinedLiteral':
			return 'undefined';
		case 'StringLiteralType':
			return `'${type.value}'`;
		default:
			return 'any';
	}
}

/**
 * Get property type color
 */
function getPropertyTypeColor (type) {
	switch (type) {
		case 'Array':
			return '#53c79d';
		case 'Boolean':
			return '#ff44b5';
		case 'Function':
			return '#f5a623';
		case 'Module':
			return '#7ed321';
		case 'Number':
			return '#4be0de';
		case 'Object':
			return '#a8a8a8';
		case 'String':
			return '#f55';
		default:
			return '#a8a8a8';
	}
}

export {getPropertyTypeColor, typeToString};
