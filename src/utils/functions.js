// Utilities for working with functions.  Primary use is in rendering functions
// as part of /wrappers/json.js

import {useEffect, useState} from 'react';

import DocParse from '../components/DocParse.js';
import FloatingAnchor from '../components/FloatingAnchor';
import jsonata from 'jsonata';	// http://docs.jsonata.org/
import renderSeeTags from '../utils/see';

const DefTerm = (props) => FloatingAnchor.inline({component: 'dt', ...props});

import {renderType, jsonataTypeParser} from './types';

import css from '../css/main.module.less';

const processTypes = async (member) => {
	// see types.jsonataTypeParser
	const expression = `$.type.[(
		${jsonataTypeParser}
	)]`;
	const result = await jsonata(expression).evaluate(member);
	return result || [];
};

// Pass `func.returns` for return types
const renderTypeStrings = async (member, separator) => {
	const types = await processTypes(member);
	let typeList = types.map(renderType);
	if (separator) {
		// eslint-disable-next-line no-sequences
		typeList = typeList.reduce((arr, val) => (arr.length ? arr.push(separator, val) : arr.push(val), arr), []);
	}
	return typeList;
};

const paramIsRestType = async (param) => {
	// Find any type === RestType in any descendant
	const expression = "$.**[type='RestType']";
	return await jsonata(expression).evaluate(param);
};

const paramIsOptional = (param) => {
	return (param.type && param.type.type === 'OptionalType');
};

const requiredParamCount = (params) => {
	return params.length - params.filter(paramIsOptional).length;
};

const decoratedParamName = async (param) => {
	let name = param.name;

	if (await paramIsRestType(param)) {
		name = '…' + name;
	}

	if (paramIsOptional(param)) {
		name = '{' + name + '}';
	}

	return name;
};

const buildParamList = async (params) => {
	const paramsListPromise = await Promise.all(await params.map(await decoratedParamName));
	return paramsListPromise.join(', ');
};

const paramCountString = async (params) => {
	const reqCount = requiredParamCount(params);
	const hasOptional = reqCount < params.length;
	const hasRest = params.length && await paramIsRestType(params[params.length - 1]);

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

const renderProperties = async (param) => {
	if (param.properties) {
		return (
			<div>
				<h6>Object keys for {param.name}</h6>
				<dl>
					{await Promise.all(param.properties.map(async (prop) => {
						// Make the keyName just "key" not "prop.key"
						const keyName = prop.name.replace(param.name + '.', '');
						return [
							<dt key={keyName + 'Term'}>{keyName} {await renderTypeStrings(prop)}</dt>,
							<DocParse component="dd" key={keyName + 'Definition'}>{prop.description}</DocParse>
						];
					}))}
				</dl>
			</div>
		);
	}
};

// eslint-disable-next-line enact/prop-types
const Parameters = ({func, params, hasReturns}) => {
	const [responseRenderTypeStrings, setResponseRenderTypeStrings] = useState([]);
	const [responseRenderTypeString, setResponseRenderTypeString] = useState(null);
	const [responseParamCountString, setResponseParamCountString] = useState([]);
	const [responseRenderProperties, setResponseRenderProperties] = useState([]);

	useEffect(() => {
		const renderParamCountString = async () => {
			const data = await paramCountString(params);
			setResponseParamCountString(data);
		};
		renderParamCountString()
			.catch(console.error); // eslint-disable-line no-console

		const renderTypeStringsAndPropertiesEffect = Promise.all(params.map(async (param) => {
			const renderTypeStringsData = await renderTypeStrings(param);
			setResponseRenderTypeStrings(array => [...array, renderTypeStringsData])

			const renderPropertiesData = await renderProperties(param);
			setResponseRenderProperties((array) => [...array, renderPropertiesData]);
		}));
		renderTypeStringsAndPropertiesEffect
			.catch(console.error); // eslint-disable-line no-console

		const renderResponseRenderTypeString = async () => {
			const data = await renderTypeStrings(func.returns);
			setResponseRenderTypeString(...data);
		};
		renderResponseRenderTypeString()
			.catch(console.error); // eslint-disable-line no-console

	}, [func.returns, params]);

	if (params.length === 0 && !hasReturns) return null;

	return (
		<dd className={css.details}>
			{params.length ? <div className={css.params}>
				<h6>{responseParamCountString}</h6>
				{params.map((param, subIndex) => (
					<dl key={subIndex}>
						<dt>{param.name} {responseRenderTypeStrings[subIndex]}</dt>
						{paramIsOptional(param) ? <dt className={css.optional}>optional</dt> : null}
						{param.default ? <dt className={css.default}>default: {param.default}</dt> : null}
						<DocParse component="dd">
							{param.description}
						</DocParse>
						{responseRenderProperties[subIndex]}
					</dl>
				))}
			</div> : null}
			{hasReturns ? <div className={css.returns}>
				<h6>Returns</h6>
				<dl>
					<dt>{responseRenderTypeString}</dt>
					<DocParse component="dd">{func.returns[0].description}</DocParse>
				</dl>
			</div> : null}
		</dd>
	);
};

export const renderExportedFunction = async (func) => {
	const params = func.params || [];
	const paramStr = await buildParamList(params);
	const name = func.name;
	const hasReturns = !!func.returns.length;

	return (
		<section className={css.exportedFunction}>
			<pre className={css.signature}>
				<code>
					{name}( <var>{paramStr}</var> ){hasReturns ? <span className={css.returnType}>{await renderTypeStrings(func.returns, '|')}</span> : null}
				</code>
			</pre>
			<DocParse>{func.description}</DocParse>
			{renderSeeTags(func)}
			<Parameters func={func} params={params} hasReturns={hasReturns} />
		</section>
	);
};

const renderFunction = async (func, index, funcName) => {
	const params = func.params || [];
	const paramStr = await buildParamList(params);
	const parent = func.memberof ? func.memberof.match(/[^.]*\.(.*)/) : null;
	const name = funcName ? funcName : func.name;
	const id = (parent ? parent[1] + '.' : '') + name;
	const hasReturns = !!func.returns.length;

	return (
		<section className={css.function} key={index}>
			<DefTerm id={id}>{name}(<var>{paramStr}</var>){hasReturns ? <span className={css.returnType}>{await renderTypeStrings(func.returns, '|')}</span> : null}</DefTerm>
			<DocParse component="dd">{func.description}</DocParse>
			{renderSeeTags(func)}
			<Parameters func={func} params={params} hasReturns={hasReturns} />
		</section>
	);
};

export const renderConstructor = async (member) => {
	if (!member.constructorComment) {
		return;
	}

	return (
		<section className={css.constructorClass}>
			<h5>Constructor</h5>
			<dl>
				{await renderFunction(member.constructorComment, 1, member.name)}
			</dl>
		</section>
	);
};

export default renderFunction;
