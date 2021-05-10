// Utilities for working with types.  Primary use is in rendering types
// as part of /wrappers/json.js

import Type from '../components/Type';

export const renderType = (type, index) => {
	return <Type key={index}>{type}</Type>;
};

// This somewhat complex expression allows us to separate out the UnionType members from the
// regular ones and combine TypeApplications (i.e. Arrays of type) into a single unit instead
// of having String[] render as ['String', 'Array'].  Then, it looks for 'NullLiteral' or
// 'AllLiteral' and replaces them with the word 'null' or 'Any'. If any 'StringLiteralType'
// exist, add them with quotes around the value. A 'RecordType' is replaced with 'Object'.
// TODO: Add NumberLiteralType?
// TODO: Make NullableType more useful/interesting?
// NOTE: This is shared with a few parsers that have slightly different selectors
export const jsonataTypeParser = `
	$quote := function($val) { "'" & $val & "'" };
	$ProcessTypeApplication := function($elem) { $elem.expression.name & " of " & $GetNameExp($elem.applications)[0]};
	$GetElementsTypes := function($elem) { $GetNameExp($elem.elements) };
	$GetExpressionTypes := function($elem) { $GetNameExp($elem.expression) };
	$GetNameExp := function($type) {
		[
			$type[type="AllLiteral"] ? ['Any'],
			$type[type="ArrayType"] ? ['Array'],
			$type[type="BooleanLiteralType"].value.$string(),
			$type[type="NameExpression"].name,
			$type[type="NullableType"] ? [$GetNameExp($type[type="NullableType"].expression), 'null'],
			$type[type="NullLiteral"] ? ['null'],
			$map($type[type="OptionalType"], $GetExpressionTypes),
			$type[type="RecordType"] ? ['Object'],
			$map($type[type="RestType"], $GetExpressionTypes),
			$map($type[type="StringLiteralType"].value, $quote),
			$map($type[type="TypeApplication"], $ProcessTypeApplication),
			$type[type="UndefinedLiteral"] ? ['undefined'],
			$map($type[type="UnionType"], $GetElementsTypes)
		]
	};
	$GetNameExp($);
`;

export default renderType;
