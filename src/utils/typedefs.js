// Utilities for working with typedefs. Used as part of /utils/modules.js

import DocParse from '../components/DocParse.js';
import jsonata from 'jsonata';	// http://docs.jsonata.org/
import React from 'react';
import {renderDefaultTag, processDefaultTag, hasRequiredTag} from '../utils/common';
import renderFunction from './functions.js';
import renderSeeTags from './see';
import renderType from './types.js';

import css from '../css/main.less';

const renderTypedefTypeStrings = (member) => {
	// See processTypeTag for a breakdown of the expression below
	const expression = `$.type.[(
		$IsUnion := type = "UnionType";
		$GetNameExp := function($type) { $append($type[type="NameExpression"].name, $type[type="NullLiteral"] ? ['null'] : []) };
		$GetType := function($type) { $type[type="TypeApplication"] ? $type[type="TypeApplication"].(expression.name & " of " & $GetNameExp(applications)[0])};
		$GetAllTypes := function($elems) { $append($GetType($elems), $GetNameExp($elems))};
		$IsUnion ? $GetAllTypes($.elements) : $GetAllTypes($);
	)]`;
	const result = jsonata(expression).evaluate(member) || [];
	return result.map(renderType);
};

// TODO: Should this move to `properties.js`?
export const renderTypedefProp = (type, index) => {
	const parent = type.memberof ? type.memberof.match(/[^.]*\.(.*)/) : null;
	const id = (parent ? parent[1] + '.' : '') + type.name;

	if ((type.kind === 'function') || (type.kind === 'class' && type.name === 'constructor')) {
		return renderFunction(type, index);
	} else {
		let isRequired = hasRequiredTag(type);
		isRequired = isRequired ? <var className={css.required} data-tooltip="Required Property">&bull;</var> : null;

		let defaultStr = renderDefaultTag(processDefaultTag(type.tags));

		return (
			<section className={css.property} key={index} id={type.name}>
				<dt>
					<div className={css.title} id={id}>{type.name} {isRequired}</div>
				</dt>
				<dd className={css.details}>
					{renderTypedefTypeStrings(type)}
					{defaultStr}
				</dd>
				<dd className={css.description}>
					<DocParse component="div">{type.description}</DocParse>
					{renderSeeTags(type)}
				</dd>
			</section>
		);
	}
};

export const renderTypedef = (member) => {
	const isFunction = member.type && member.type.name === 'Function';

	if (isFunction) {
		return (
			<dl>
				{renderFunction(member)}
			</dl>
		);
	} else {
		// TODO: Make a fragment instead of returning an array.  Yucky.
		return [
			<div key="typedef-a">
				<DocParse>{member.description}</DocParse>
				{renderSeeTags(member)}
			</div>,
			<dl key="typedef-b">
				{member.properties.map(renderTypedefProp)}
			</dl>
		];
	}
};

export default renderTypedef;
