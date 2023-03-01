// Utilities for working with properties.  Primary use is in rendering properties
// as part of /wrappers/json.js

import DocParse from '../components/DocParse.js';
import jsonata from 'jsonata';	// http://docs.jsonata.org/

import FloatingAnchor from '../components/FloatingAnchor';
import {renderDefaultTag, processDefaultTag, hasRequiredTag, hasDeprecatedTag} from './common';
import renderFunction from './functions';
import renderSeeTags from '../utils/see';
import {renderType, jsonataTypeParser} from './types';
import {renderTypedefProp} from './typedefs.js';

import css from '../css/main.module.less';

const Dt = (props) => FloatingAnchor.inline({component: 'dt', ...props});

const processTypeTag = async (tags) => {
	// see types.jsonataTypeParser
	const expression = `$[title="type"].type.[(
		${jsonataTypeParser}
	)]`;
	const result = await jsonata(expression).evaluate(tags);
	return result || [];
};

const renderPropertyTypeStrings = async (member) => {
	const types = await processTypeTag(member.tags);
	const typeStr = types.map(renderType);
	return typeStr;
};

export const renderProperty = async (prop, index) => {
	if ((prop.kind === 'function') || (prop.kind === 'class' && prop.name === 'constructor')) {
		return await renderFunction(prop, index);
	} else {
		const parent = prop.memberof ? prop.memberof.match(/[^.]*\.(.*)/) : null;
		const id = (parent ? parent[1] + '.' : '') + prop.name;
		const isDeprecated = await hasDeprecatedTag(prop);
		const isRequired = await hasRequiredTag(prop);
		const requiredIcon = isRequired ? <var className={css.required} data-tooltip="Required Property">&bull;</var> : null;
		const deprecatedIcon = isDeprecated ? <var className={css.deprecatedIcon} data-tooltip="Deprecated Property">✘</var> : null;

		let defaultStr = renderDefaultTag(await processDefaultTag(prop.tags));

		return (
			<section className={[css.property, (isDeprecated ? css.deprecated : null)].join(' ')} key={index} id={id}>
				<div className={css.title}>
					<Dt id={id} inline>
						{prop.name} {requiredIcon} {deprecatedIcon}
					</Dt>
					<div className={css.types}>{await renderPropertyTypeStrings(prop)}</div>
				</div>
				<dd className={css.description}>
					<DocParse component="div">{prop.description}</DocParse>
					{renderSeeTags(prop)}
					{isDeprecated ? <DocParse component="div" className={css.deprecationNote}>{prop.deprecated}</DocParse> : null}
					<div className={css.details}>
						{defaultStr}
					</div>
				</dd>
			</section>
		);
	}
};

const renderHocConfig = async (config) => {
	return (
		<section className={css.hocconfig}>
			<h5>Configuration</h5>
			<dl>
				{await Promise.all(config.members.static.map(renderProperty))}
			</dl>
		</section>
	);
};

const propSort = async (a, b) => {
	let aIsRequired = await hasRequiredTag(a);
	let bIsRequired = await hasRequiredTag(b);

	if (aIsRequired !== bIsRequired) {
		return aIsRequired ? -1 : 1;
	} else if (a.name < b.name) {
		return -1;
	} else if (a.name > b.name) {
		return 1;
	} else {
		return 0;
	}
};

export const renderStaticProperties = async (properties, isHoc) => {
	if (!properties.static.length) {
		return;
	}
	properties.static = await Promise.all(properties.static.sort(await propSort));
	if (isHoc) {
		return await renderHocConfig(properties.static[0]);
	} else {
		return (
			<section className={css.statics}>
				{properties.static.length ? <h5>Statics</h5> : null}
				<dl>
					{await Promise.all(properties.static.map(renderProperty))}
				</dl>
			</section>
		);
	}
};

export const renderInstanceProperties = async (properties, isHoc) => {
	if (!properties.instance.length) {
		return;
	}
	const instanceProps = await Promise.all(properties.instance.filter(prop => prop.kind !== 'function').sort(await propSort));
	const instanceMethods = await Promise.all(properties.instance.filter(prop => prop.kind === 'function').sort(await propSort));
	return ([
		instanceProps.length ?
			<section className={css.properties} key="props">
				<h5>Properties{isHoc ? ' added to wrapped component' : ''}</h5>
				<dl>
					{await Promise.all(instanceProps.map(renderProperty))}
				</dl>
			</section> :
			null,
		instanceMethods.length ?
			<section className={css.properties} key="methods">
				<h5>Methods{isHoc ? ' added to wrapped component' : ''}</h5>
				<dl>
					{await Promise.all(instanceMethods.map(renderProperty))}
				</dl>
			</section> :
			null
	]);
};

export const renderObjectProperties = async (properties) => {

	if (properties && properties.length) {
		properties = await Promise.all(properties.sort(await propSort));
		return <section className={css.properties}>
			<h5>Properties</h5>
			<dl>
				{await Promise.all(properties.map(renderTypedefProp))}
			</dl>
		</section>;
	}
};

export default renderProperty;
