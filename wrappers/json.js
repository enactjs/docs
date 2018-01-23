import DocParse from '../components/DocParse.js';
import ModulesList from '../components/ModulesList.js';
import TypesKey from '../components/TypesKey';
import Type from '../components/Type';
import jsonata from 'jsonata';	// http://docs.jsonata.org/
import React from 'react';
import PropTypes from 'prop-types';
import kind from '@enact/core/kind';
import {Row, Cell} from '@enact/ui/Layout';
import EnactLive from '../components/EnactLiveEdit.js';
import See from '../components/See';

import css from '../css/main.less';

const processTypeTag = (tags) => {
	// This somewhat complex expression allows us to separate out the UnionType members from the
	// regular ones and combine TypeApplications (i.e. Arrays of type) into a single unit instead
	// of having String[] render as ['String', 'Array'].  Then, it looks for 'NullLiteral' or
	// 'AllLiteral' and replaces them with the word 'null' or 'Any'.
	const expression = `$[title="type"].type.[(
		$IsUnion := type = "UnionType";
		$GetNameExp := function($type) { $append($append($type[type="NameExpression"].name, $type[type="NullLiteral"] ? ['null'] : []), $type[type="AllLiteral"] ? ['Any'] : []) };
		$GetType := function($type) { $type[type="TypeApplication"] ? $type[type="TypeApplication"].(expression.name & " of " & $GetNameExp(applications)[0]) : $type[type="OptionalType"] ? $GetAllTypes($type.expression) : $type[type="RestType"] ? $GetAllTypes($type.expression)};
		$GetAllTypes := function($elems) { $append($GetType($elems), $GetNameExp($elems))};
		$IsUnion ? $GetAllTypes($.elements) : $GetAllTypes($);
	)]`;
	const result = jsonata(expression).evaluate(tags);
	return result || [];
};

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

const processDefaultTag = (tags) => {
	// Find any tag field whose `title` is 'default' (won't be there if no default)
	const expression = "$[title='default'].description";
	const result = jsonata(expression).evaluate(tags);
	return result || 'undefined';
};

const renderDefaultTag = (defaultStr) => {
	if (!defaultStr || defaultStr === 'undefined') {
		return <var className={css.default} />;
	} else if (defaultStr.indexOf("'data:image") === 0) {
		defaultStr = 'An image';
	} else if (defaultStr.search(/\n/) >= 0) {
		let indent = 0;
		defaultStr = defaultStr.split('\n').map((line, index) => {
			if (line === '}') {
				indent--;
			}
			const indentStr = '\u00a0'.repeat(indent * 4);
			if (line.substr(-1) === '{') {
				indent++;
			}
			return <div key={index}>{indentStr}{line}</div>;
		});
		defaultStr = <div className={css.multilineSeeMore} tabIndex="0" title="Show default value"><span>Show default value</span><div className={css.multiline}>{defaultStr}</div></div>;
	}
	return <var className={css.default}><span className={css.title}>Default: </span>{defaultStr}</var>;
};

const hasRequiredTag = (tags) => {
	// Find any tag field whose `title` is 'required' (won't be there if not required)
	const expression = "$[title='required']";
	const result = jsonata(expression).evaluate(tags);
	return !!result;
};

const hasFactoryTag = (member) => {
	// Find any tag field whose `title` is 'factory'
	const expression = "$[title='factory']";
	const result = jsonata(expression).evaluate(member.tags);
	return !!result;
};

const hasHOCTag = (member) => {
	// Find any tag field whose `title` is 'hoc'
	const expression = "$[title='hoc']";
	const result = jsonata(expression).evaluate(member.tags);
	return !!result;
};

const hasUITag = (member) => {
	// Find any tag field whose `title` is 'ui'
	const expression = "$[title='ui']";
	const result = jsonata(expression).evaluate(member.tags);
	return !!result;
};

const getExampleTags = (member) => {
	// Find any tag field whose `title` is 'example'
	const expression = "$.tags[][title='example'][]";
	return jsonata(expression).evaluate(member) || [];
};

const getSeeTags = (member) => {
	// Find any tag field whose `title` is 'see'
	const expression = "$.tags[][title='see'][]";
	return jsonata(expression).evaluate(member) || [];
};

const renderSeeTags = (member) => {
	return getSeeTags(member).map((tag, idx) => (
		<See tag={tag} key={idx} />
	));
};

const renderType = (type, index) => {
	return <Type key={index}>{type}</Type>;
};

const renderPropertyTypeStrings = (member) => {
	const types = processTypeTag(member.tags);
	const typeStr = types.map(renderType);
	return typeStr;
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
		name += '...';
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

const renderFunction = (func, index) => {
	const params = func.params || [];
	const paramStr = buildParamList(params);
	let returnType;

	if (func.returns && func.returns.length && func.returns[0].type && func.returns[0].type.name) {
		returnType = func.returns[0].type.name;
	}

	return (
		<section className={css.function} key={index}>
			<dt>{func.name}(<var>{paramStr}</var>){returnType ? <span className={css.returnType}><Type>{returnType}</Type></span> : null}</dt>
			<DocParse component="dd">{func.description}</DocParse>
			{(params.length || returnType) ?
				<dd className={css.details}>
					{params.length ? <div className={css.params}>
						<h6>{paramCountString(params)}</h6>
						{params.map((param, subIndex) => (
							<dl key={subIndex}>
								<dt>{decoratedParamName(param)} {renderParamTypeStrings(param)}</dt>
								{paramIsOptional(param) ? <dt className={css.optional}>optional</dt> : null}
								<DocParse component="dd">{param.description}</DocParse>
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

const renderProperty = (prop, index) => {
	if ((prop.kind === 'function') || (prop.kind === 'class' && prop.name === 'constructor')) {
		return renderFunction(prop, index);
	} else {
		let isRequired = hasRequiredTag(prop.tags);
		isRequired = isRequired ? <var className={css.required} data-tooltip="Required Property">&bull;</var> : null;


		let defaultStr = renderDefaultTag(processDefaultTag(prop.tags));

		return (
			<section className={css.property} key={index} id={prop.name}>
				<div className={css.title}>
					<dt>
						{prop.name} {isRequired}
					</dt>
					<div className={css.types}>{renderPropertyTypeStrings(prop)}</div>
				</div>
				<dd className={css.description}>
					<DocParse component="div">{prop.description}</DocParse>
					{renderSeeTags(prop)}
					<div className={css.details}>
						{defaultStr}
					</div>
				</dd>
			</section>
		);
	}
};

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

const renderTypedef = (type, index) => {
	if ((type.kind === 'function') || (type.kind === 'class' && type.name === 'constructor')) {
		return renderFunction(type, index);
	} else {
		let isRequired = hasRequiredTag(type.tags);
		isRequired = isRequired ? <var className={css.required} data-tooltip="Required Property">&bull;</var> : null;

		let defaultStr = renderDefaultTag(processDefaultTag(type.tags));

		return (
			<section className={css.property} key={index} id={type.name}>
				<dt>
					<div className={css.title}>{type.name} {isRequired}</div>
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

const renderHocConfig = (config) => {
	return (
		<section className={css.hocconfig}>
			<h5>Configuration</h5>
			<dl>
				{config.members.static.map(renderProperty)}
			</dl>
		</section>
	);
};

const propSort = (a, b) => {
	let aIsRequired = hasRequiredTag(a.tags);
	let bIsRequired = hasRequiredTag(b.tags);

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

const renderStaticProperties = (properties, isHoc) => {
	if (!properties.static.length) {
		return;
	}
	properties.static = properties.static.sort(propSort);
	if (isHoc) {
		return renderHocConfig(properties.static[0]);
	} else {
		return (
			<section className={css.statics}>
				{properties.static.length ? <h5>Statics</h5> : null}
				<dl>
					{properties.static.map(renderProperty)}
				</dl>
			</section>
		);
	}
};

const renderInstanceProperties = (properties, isHoc) => {
	if (!properties.instance.length) {
		return;
	}
	const instanceProps = properties.instance.filter(prop => prop.kind !== 'function').sort(propSort);
	const instanceMethods = properties.instance.filter(prop => prop.kind === 'function').sort(propSort);
	return ([
		instanceProps.length ?
			<section className={css.properties} key="props">
				<h5>Properties{isHoc ? ' added to wrapped component' : ''}</h5>
				<dl>
					{instanceProps.map(renderProperty)}
				</dl>
			</section> :
			null,
		instanceMethods.length ?
			<section className={css.properties} key="methods">
				<h5>Methods{isHoc ? ' added to wrapped component' : ''}</h5>
				<dl>
					{instanceMethods.map(renderProperty)}
				</dl>
			</section> :
			null
	]);
};

const renderObjectProperties = (properties) => {

	if (properties && properties.length) {
		properties = properties.sort(propSort);
		return <section className={css.properties}>
			<h5>Properties</h5>
			<dl>
				{properties.map(renderTypedef)}
			</dl>
		</section>;
	}
};

const ModuleHeading = kind({
	name: 'ModuleHeading',

	propTypes: {
		children: PropTypes.string,
		varType: PropTypes.string
	},

	computed: {
		uniqueId: ({children}) => children
	},

	render: ({children, uniqueId, varType, ...rest}) => {
		return (
			<h4 {...rest} id={uniqueId}>
				{children}
				{varType ? <Type className={css.typeInHeader}>{varType}</Type> : null}
			</h4>
		);
	}
});

const renderModuleMember = (member, index) => {
	const isHoc = hasHOCTag(member),
		isFactory = hasFactoryTag(member),
		isClass = (member.kind === 'class'),
		isUI = hasUITag(member),
		classes = [
			css.module,
			(isFactory ? css.factory : null) +
			(isHoc ? css.hoc : null) +
			(!isFactory && !isHoc && isClass ? css.class : null)
		];

	switch (member.kind) {
		case 'function':
			classes.push(css.function);
			return <section className={classes.join(' ')} key={index}>
				<ModuleHeading varType="Function">{member.name}</ModuleHeading>
				<dl>
					{renderFunction(member)}
				</dl>
			</section>;
		case 'constant':
			return <section className={classes.join(' ')} key={index}>
				<ModuleHeading varType={member.type ? member.type.name : null}>{member.name}</ModuleHeading>
				<div>
					<DocParse>{member.description}</DocParse>
					{renderSeeTags(member)}
				</div>
				{renderStaticProperties(member.members, isHoc)}
				{renderInstanceProperties(member.members, isHoc)}
				{renderObjectProperties(member.properties)}
			</section>;
		case 'typedef':
			return <section className={classes.join(' ')} key={index}>
				<ModuleHeading varType={member.type ? member.type.name : null}>{member.name}</ModuleHeading>
				<div>
					<DocParse>{member.description}</DocParse>
					{renderSeeTags(member)}
				</div>

				<dl>
					{member.properties.map(renderTypedef)}
				</dl>
			</section>;
		case 'class':
		default:
			return <section className={classes.join(' ')} key={index}>
				<ModuleHeading
					varType={(isHoc ? 'Higher-Order Component' :	// eslint-disable-line no-nested-ternary
						isFactory ? 'Component Factory' :	// eslint-disable-line no-nested-ternary
							isUI ? 'Component' :
								'Class')}
				>
					{member.name}
				</ModuleHeading>
				<div className={css.componentDescription}>
					<DocParse>{member.description}</DocParse>
					{renderSeeTags(member)}
				</div>
				{renderStaticProperties(member.members, isHoc)}
				{renderInstanceProperties(member.members, isHoc)}
			</section>;
	}
};

const renderModuleMembers = (members) => {
	// All module members will be static, no need to check instance members
	if (members.static.length) {
		const moduleName = members.static[0].memberof.split('/').pop();
		const sortedMembers = members.static.sort((a, b) => {
			if (a.name === moduleName) {
				return -1;
			} else if (b.name === moduleName) {
				return 1;
			} else {
				return a.name < b.name ? -1 : 1;
			}
		});
		return (
			<div>
				<h3>Members</h3>
				{sortedMembers.map(renderModuleMember)}
			</div>
		);
	} else {
		return 'No members.';
	}
};

const renderModuleDescription = (doc) => {
	if (doc.length) {
		const code = getExampleTags(doc[0]);
		return <section className={css.moduleDescription}>
			<DocParse component="div" className={css.moduleDescriptionText}>
				{doc[0].description}
			</DocParse>
			{code.length ? <EnactLive code={code[0].description} /> : null}
			{renderSeeTags(doc[0])}
		</section>;
	}
};

export default class JSONWrapper extends React.Component {

	render () {
		const doc = this.props.route.page.data;
		const path = this.props.route.page.path.replace('/docs/modules/', '').replace(/\/$/, '');
		const pathParts = path.replace(/([A-Z])/g, ' $1').split(' '); // Find all uppercase letters and allow a linebreak to happen before each one.
		// The <wbr /> is an optional line-break. It only line-breaks if it needs to, and only on the specified points. Long lines won't get cut off in the middle of words.
		// TODO: Just get this info from the doc itself?
		return (
			<Row className={css.multiColumn}>
				<Cell component="nav" size={198} className={css.sidebar}>
					<ModulesList location={this.props.location} route={this.props.route} />
				</Cell>
				<Cell className={css.moduleBody}>
					<h1>{pathParts.map((part) => [<wbr />, part])}</h1>
					{renderModuleDescription(doc)}
					{renderModuleMembers(doc[0].members)}
					<div className={css.moduleTypesKey}>
						<TypesKey />
					</div>
				</Cell>
			</Row>
		);
	}
}
