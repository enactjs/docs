// Utilities for working with typedefs. Used as part of /utils/modules.js

import DocParse from '../components/DocParse.js';
import jsonata from 'jsonata';	// http://docs.jsonata.org/
import { Fragment } from 'react';
import {renderDefaultTag, processDefaultTag} from '../utils/common';
import renderFunction from './functions.js';
import renderSeeTags from './see';
import {renderType, jsonataTypeParser} from './types';

import css from '../css/main.module.less';

const renderTypedefTypeStrings = (member) => {
	// see types.jsonataTypeParser
	const expression = `$.type.[(
		${jsonataTypeParser}
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
		let isRequired = type.type && type.type.type !== 'OptionalType';
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
	const isObject = member.type && member.type.name === 'Object';

	if (isFunction) {
		return (
			<dl>
				{renderFunction(member)}
			</dl>
		);
	} else if (isObject) {
		return (
            <Fragment>
                <div key="typedef-a">
                    <DocParse>{member.description}</DocParse>
                    {renderSeeTags(member)}
                </div>
                <dl key="typedef-b">
                    {member.properties.map(renderTypedefProp)}
                </dl>
            </Fragment>
        );
	} else {
		return (
            <Fragment>
                <div key="typedef-a">
                    <DocParse>{member.description}</DocParse>
                    {renderSeeTags(member)}
                </div>
                <dl key="typedef-b">
                    {renderTypedefTypeStrings(member)}
                </dl>
            </Fragment>
        );
	}
};

export default renderTypedef;
