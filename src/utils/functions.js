// Utilities for working with functions.  Primary use is in rendering functions
// as part of /wrappers/json.js

import DocParse from '../components/DocParse.js';
import jsonata from 'jsonata';	// http://docs.jsonata.org/
import React from 'react';
import Type from '../components/Type';

import renderType from './types.js';

import css from '../css/main.less';

const processParamTypes = (member) => {
	// See processTypeTag for a breakdown of the expression below
	const expression = `$.type.[(
		$IsUnion := type = "UnionType";
		$IsOptional := type = "OptionalType";
		$GetNameExp := function($type) { $append($append($type[type="NameExpression"].name, $type[type="NullLiteral"] ? ['null'] : []), $type[type="AllLiteral"] ? ['Any'] : []) };
		$GetType := function($type) { $type[type="TypeApplication"] ? $type[type="TypeApplication"].(expression.name & " of " & $GetNameExp(applications)[0]) : $type[type="OptionalType"] ? $GetAllTypes($type.expression) : $type[type="RestType"] ? $GetAllTypes($type.expression)};
		$GetAllTypes := function($elems) { $append($GetType($elems), $GetNameExp($elems))};
		$IsUnion ? $GetAllTypes($.elements) : $GetAllTypes($);
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

const renderProperties = (param) => (
	param.properties ?
		<div>
			{param.properties.map((prop, propIndex) => (
				<dl key={propIndex}>
					<dt>{prop.name} {renderParamTypeStrings(prop)}</dt>
					<DocParse component="dd">{prop.description}</DocParse>
				</dl>
			))}
		</div> :
	null
);

const renderFunction = (func, index, funcName) => {
	const params = func.params || [];
	const paramStr = buildParamList(params);
	const parent = func.memberof ? func.memberof.match(/[^.]*\.(.*)/) : null;
	const name = funcName ? funcName : func.name;
	const id = (parent ? parent[1] + '.' : '') + name;
	let returnType;

	if (func.returns && func.returns.length && func.returns[0].type && func.returns[0].type.name) {
		returnType = func.returns[0].type.name;
	}

	return (
		<section className={css.function} key={index}>
			<dt id={id}>{name}(<var>{paramStr}</var>){returnType ? <span className={css.returnType}><Type>{returnType}</Type></span> : null}</dt>
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
								<DocParse component="dd">{param.description}</DocParse>
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
