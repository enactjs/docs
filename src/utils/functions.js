// Utilities for working with functions.  Primary use is in rendering functions
// as part of /wrappers/json.js

import DocParse from '../components/DocParse.js';
import FloatingAnchor from '../components/FloatingAnchor';
import jsonata from 'jsonata';	// http://docs.jsonata.org/
import React from 'react';
import Type from '../components/Type';

const DefTerm = (props) => FloatingAnchor.inline({component: 'dt', ...props});

import {renderType, jsonataTypeParser} from './types';

import css from '../css/main.module.less';

const processParamTypes = (member) => {
	// see types.jsonataTypeParser
	const expression = `$.type.[(
		${jsonataTypeParser}
	)]`;
	const result = jsonata(expression).evaluate(member);
	return result || [];
};

const renderParamTypeStrings = (member) => {
	const types = processParamTypes(member);
	const typeStr = types.map(renderType);
	return typeStr;
};

const paramIsRestType = (param) => {
	// Find any type === RestType in any descendant
	const expression = "$.**[type='RestType']";
	return jsonata(expression).evaluate(param);
};

const paramIsOptional = (param) => {
	return (param.type && param.type.type === 'OptionalType');
};

const requiredParamCount = (params) => {
	return params.length - params.filter(paramIsOptional).length;
};

const decoratedParamName = (param) => {
	let name = param.name;

	if (paramIsRestType(param)) {
		name = '…' + name;
	}

	if (paramIsOptional(param)) {
		name = '{' + name + '}';
	}

	return name;
};

const buildParamList = (params) => {
	return params.map(decoratedParamName).join(', ');
};

const paramCountString = (params) => {
	const reqCount = requiredParamCount(params);
	const hasOptional = reqCount < params.length;
	const hasRest = params.length && paramIsRestType(params[params.length - 1]);

	let result = reqCount;
	let suffix = ' Param';
	if (hasOptional || hasRest) {
		result += ' or more';
		suffix += 's';
	} else if (reqCount > 1) {
		suffix += 's';
	}
	result += suffix;
	return result;
};

const renderProperties = (param) => {
	if (param.properties) {
		return (
			<div>
				<h6>Object keys for {param.name}</h6>
				<dl>
					{param.properties.map((prop) => {
						// Make the keyName just "key" not "prop.key"
						const keyName = prop.name.replace(param.name + '.', '');
						return [
							<dt key={keyName + 'Term'}>{keyName} {renderParamTypeStrings(prop)}</dt>,
							<DocParse component="dd" key={keyName + 'Definition'}>{prop.description}</DocParse>
						];
					})}
				</dl>
			</div>
		);
	}
};

const renderFunction = (func, index, funcName) => {
	const params = func.params || [];
	const paramStr = buildParamList(params);
	const parent = func.memberof ? func.memberof.match(/[^.]*\.(.*)/) : null;
	const name = funcName ? funcName : func.name;
	const id = (parent ? parent[1] + '.' : '') + name;
	let returnType;

	if (func.returns && func.returns.length && func.returns[0].type) {
		if (func.returns[0].type.name) {
			returnType = func.returns[0].type.name;
		} else if (func.returns[0].type.expression) {
			returnType = func.returns[0].type.expression.name;
		}
	}

	return (
		<section className={css.function} key={index}>
			<DefTerm id={id}>{name}(<var>{paramStr}</var>){returnType ? <span className={css.returnType}><Type>{returnType}</Type></span> : null}</DefTerm>
			<DocParse component="dd">{func.description}</DocParse>
			{(params.length || returnType) ?
				<dd className={css.details}>
					{params.length ? <div className={css.params}>
						<h6>{paramCountString(params)}</h6>
						{params.map((param, subIndex) => (
							<dl key={subIndex}>
								<dt>{param.name} {renderParamTypeStrings(param)}</dt>
								{paramIsOptional(param) ? <dt className={css.optional}>optional</dt> : null}
								{param.default ? <dt className={css.default}>default: {param.default}</dt> : null}
								<DocParse component="dd">
									{param.description}
								</DocParse>
								{renderProperties(param)}
							</dl>
						))}
					</div> : null}
					{returnType ? <div className={css.returns}>
						<h6>Returns</h6>
						<dl>
							<dt>{renderType(returnType)}</dt>
							<DocParse component="dd">{func.returns[0].description}</DocParse>
						</dl>
					</div> : null}
				</dd> : null}
		</section>
	);
};

export const renderConstructor = (member) => {
	if (!member.constructorComment) {
		return;
	}

	return (
		<section className={css.constructorClass}>
			<h5>Constructor</h5>
			<dl>
				{renderFunction(member.constructorComment, 1, member.name)}
			</dl>
		</section>
	);
};

export default renderFunction;
