// Utilities for working with types.  Primary use is in rendering types
// as part of /wrappers/json.js

import Type from '../components/Type';
import React from 'react';

export const renderType = (type, index) => {
	return <Type key={index}>{type}</Type>;
};

// This somewhat complex expression allows us to separate out the UnionType members from the
// regular ones and combine TypeApplications (i.e. Arrays of type) into a single unit instead
// of having String[] render as ['String', 'Array'].  Then, it looks for 'NullLiteral' or
// 'AllLiteral' and replaces them with the word 'null' or 'Any'. If any 'StringLiteralType'
// exist, add them with quotes around the value. A 'RecordType' is replaced with 'Object'.
// TODO: Add NumberLiteralType?
// NOTE: This is shared with a few parsers that have slightly
// different selectors
export const jsonataTypeParser = `
	$IsUnion := type = "UnionType";
	$quote := function($val) { "'" & $val & "'" };
	$GetNameExp := function($type) { $append($append($append($append($type[type="NameExpression"].name, $type[type="NullLiteral"] ? ['null'] : []), $type[type="AllLiteral"] ? ['Any'] : []), $map($type[type="StringLiteralType"].value, $quote)), $type[type="RecordType"] ? ['Object'] : []) };
	$GetType := function($type) { $type[type="TypeApplication"] ? $type[type="TypeApplication"].(expression.name & " of " & $GetNameExp(applications)[0]) : $type[type="OptionalType"] ? $GetAllTypes($type.expression) : $type[type="RestType"] ? $GetAllTypes($type.expression)};
	$GetAllTypes := function($elems) { $append($GetType($elems), $GetNameExp($elems))};
	$IsUnion ? $GetAllTypes($.elements) : $GetAllTypes($);
`;

export default renderType;
