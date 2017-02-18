import React from 'react';
import DocParse, {parseLink} from '../components/DocParse.js';
import jsonata from 'jsonata';	// http://docs.jsonata.org/

const identifyType = (str) => {
	if (str.indexOf('/') >= 0) {
		return 'module';
	}
	return str ? str.toLowerCase().replace(/^.*\.(.+)$/, '$1') : '';
};

const renderModuleDescription = (doc) => {
	if (doc.length) {
		return <DocParse component="section" className="moduleDescription">{doc[0].description}</DocParse>;
	}
};

const renderFunction = (func, index) => {
	let params = func.params || [];
	let paramStr = params.map((param) => (param.name)).join(', ');
	let returnType = 'undefined';

	if (func.returns && func.returns.length && func.returns[0].type && func.returns[0].type.name) {
		returnType = func.returns[0].type.name;
	}

	return (
		<section className="function" key={index}>
			<dt>{func.name}({paramStr}) &rarr; {returnType}</dt>
			<DocParse component="dd">{func.description}</DocParse>
			<dd>
				{params.length ? <h6>Params</h6> : null}
				{params.length && params.map((param, subIndex) => (
					<dl key={subIndex}>
						<dt>{param.name}</dt>
						<DocParse component="dd">{param.description}</DocParse>
					</dl>
					)
				)}
			</dd>
			{returnType !== 'undefined' ? <dd>
				<h6>Returns</h6>
				<DocParse>{func.returns[0].description}</DocParse>
			</dd> :
			null}
		</section>
	);
};

const processTypeTag = (tags) => {
	// First part extracts all `name` fields in `prop.tags` in the `type` member
	// Null literal doesn't have a name field, so we need to see if one's there and append it to the
	// list of all tag type names
	const expression = "$append($[title='type'].**.name[],$[title='type'].**.$[type='NullLiteral'] ? ['null'] : [])";
	const result = jsonata(expression).evaluate(tags);
	return result || [];
};

const processDefaultTag = (tags) => {
	// Find any tag field whose `title` is 'default' (won't be there if no default)
	const expression = "$[title='default'].description";
	const result = jsonata(expression).evaluate(tags);
	return result || 'undefined';
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

const hasHOCConfigTag = (member) => {
	// Find any tag field whose `title` is 'hocconfig'
	const expression = "$[title='hocconfig']";
	const result = jsonata(expression).evaluate(member.tags);
	return !!result;
};

const renderProperty = (prop, index) => {
	if ((prop.kind === 'function') || (prop.kind === 'class' && prop.name === 'constructor')) {
		return renderFunction(prop, index);
	} else {
		let isRequired = hasRequiredTag(prop.tags);
		isRequired = isRequired ? <var className="required" data-tooltip="Required Property">&bull;</var> : null;

		const types = processTypeTag(prop.tags);
		const typeStr = types.map((type, idx) => {
			let typeContent = type;
			if (typeContent.indexOf('/') >= 0) {
				let shortText = typeContent.replace(/^.*\.(.+)$/, '$1');
				typeContent = parseLink({children: [{text: shortText, value: typeContent}]});	// mapping to: child.children[0].value
			}
			return <span className={'type ' + identifyType(type)} key={idx}>{typeContent}</span>;
		});

		let defaultStr = processDefaultTag(prop.tags);
		defaultStr = defaultStr && defaultStr !== 'undefined' ? <var className="default"><span>Default: </span>{defaultStr}</var> : null;

		return (
			<section className="property" key={index} id={prop.name}>
				<dt>
					{prop.name} {isRequired}
				</dt>
				<dd className="details">
					{typeStr}
					{defaultStr}
				</dd>
				<DocParse component="dd" className="description">{prop.description}</DocParse>
			</section>
		);
	}
};

const renderHocConfig = (config) => {
	return (
		<section className="hocconfig">
			<h5>Configuration</h5>
			<dl>
				{config.members.static.map(renderProperty)}
			</dl>
		</section>
	);
};

const renderStaticProperties = (properties, isHoc) => {
	if (!properties.static.length) {
		return;
	}
	if (isHoc) {
		return renderHocConfig(properties.static[0]);
	} else {
		return (
			<section className="statics">
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
	return (
		<section className="properties">
			<h5>Properties{isHoc ? ' added to wrapped component' : ''}</h5>
			<dl>
				{properties.instance.map(renderProperty)}
			</dl>
		</section>
	);
};

const renderModuleMember = (member, index) => {
	const isHoc = hasHOCTag(member),
		classes = 'module' +
			(hasFactoryTag(member) ? ' factory' : '') +
			(hasHOCTag(member) ? ' hoc' : '');

	// TODO: Check type for 'class' to filter out non-classes
	return <section className={classes} key={index}>
		<h4 id={member.name}>{member.name}</h4>
		<div><DocParse>{member.description}</DocParse></div>
		{renderStaticProperties(member.members, isHoc)}
		{renderInstanceProperties(member.members, isHoc)}
	</section>;
};

const renderModuleMembers = (members) => {
	// All module members will be static, no need to check instance members
	if (members.static.length) {
		return (
			<div>
				<h3>Members</h3>
				{members.static.map(renderModuleMember)}
			</div>
		);
	} else {
		return 'No members.';
	}
};

export default class JSONWrapper extends React.Component {

	render () {
		const doc = this.props.route.page.data;
		const path = this.props.route.page.path.replace('/docs/modules/','').replace(/\/$/, "");;
		// TODO: Just get this info from the doc itself?
		if (!doc[0]) {
			console.log(path);
		}
		return (
			<div>
				<h1>{path}</h1>
				{renderModuleDescription(doc)}
				{renderModuleMembers(doc[0].members)}
			</div>
		);
	}
}
