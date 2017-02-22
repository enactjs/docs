import DocParse, {parseLink} from '../components/DocParse.js';
import jsonata from 'jsonata';	// http://docs.jsonata.org/
import {Link} from 'react-router';
import {prefixLink} from 'gatsby-helpers';
import React from 'react';

const identifyType = (str) => {
	if (str.indexOf('/') >= 0) {
		return 'module';
	}
	return str ? str.toLowerCase().replace(/^.*\.(.+)$/, '$1') : '';
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
			{(params.length || returnType !== 'undefined') ?
			<dd className="details">
				{params.length ? <div className="params">
					<h6>{params.length} Param{params.length !== 1 ? 's' : ''}</h6>
					{params.map((param, subIndex) => {console.log(param.name, param); return (
						<dl key={subIndex}>
							<dt>{param.name} {renderTypeStrings(param)}</dt>
							<DocParse component="dd">{param.description}</DocParse>
						</dl>
						)}
					)}
				</div> : null}
				{returnType !== 'undefined' ? <div className="returns">
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

const hasUITag = (member) => {
	// Find any tag field whose `title` is 'ui'
	const expression = "$[title='ui']";
	const result = jsonata(expression).evaluate(member.tags);
	return !!result;
};

const makeSeeLink = (tag, index) => {
	// Parsing this will be difficult. http://usejsdoc.org/tags-see.html
	let title = tag.description;
	// Matching "{@link linkref|linkdesc} Extra text after"
	const linkRegex = /{@link ([^| }]+)\|*([^}]*)}(.*)/;
	// Matches non-link style module reference.  "moonstone/Module.Component.property Extra text"
	// Currently doesn't require a '/' in the module name because of Spotlight but would be
	// helpful, perhaps to require 'spotlight' or a slash
	const moduleRegex = /([^.~ ]*)[.~]?(\S*)?(.*)/;
	let linkText, link, res, extraText;

	res = title.match(linkRegex);
	if (res) {
		title = link = res[1];
		linkText = res[2] || title;
		extraText = res[3];
	} else {
		linkText = link = title;
	}

	if (link.indexOf('http:') > -1) {
		return <div className="see" key={index}>See <a href={title}>{linkText}</a>{extraText}</div>;
	} else {
		res = title.match(moduleRegex);
		if (res) {	// Match is very permissive so this is safe bet
			link = '/docs/modules/' + res[1] + '/';
			if (res[2]) {
				link += '#' + res[2];
				title = res[1];
			}
			if (linkText === title) {
				title = null;	// Don't have hover text if same as link text
			}
			extraText = extraText ? extraText + res[3] : res[3];
		} else {	// Somehow, didn't match, just use text and no link?
			link = null;
			extraText = extraText ? title + extraText : title;
		}

		return <div className="see" key={index}>
			See {link ? <Link to={prefixLink(link)} data-tooltip={title}>{linkText}</Link> : null}
			{extraText}
		</div>;
	}
};

const getSeeTags = (member) => {
	// Find any tag field whose `title` is 'see'
	const expression = "$.tags[][title='see'][]";
	return jsonata(expression).evaluate(member) || [];
};

const renderSeeTags = (member) => {
	return getSeeTags(member).map((tag, idx) => {
		return makeSeeLink(tag, idx);
	});
};

const renderType = (type, index) => {
	let typeContent = type;
	if (typeContent.indexOf('/') >= 0) {
		let shortText = typeContent.replace(/^.*\.(.+)$/, '$1');
		typeContent = parseLink({children: [{text: shortText, value: typeContent}]});	// mapping to: child.children[0].value
	}
	return <span className={'type ' + identifyType(type)} key={index}>{typeContent}</span>;
};

const renderTypeStrings = (member) => {
	const types = processTypeTag(member.tags);
	const typeStr = types.map(renderType);
	return typeStr;
};

const renderProperty = (prop, index) => {
	if ((prop.kind === 'function') || (prop.kind === 'class' && prop.name === 'constructor')) {
		return renderFunction(prop, index);
	} else {
		let isRequired = hasRequiredTag(prop.tags);
		isRequired = isRequired ? <var className="required" data-tooltip="Required Property">&bull;</var> : null;


		let defaultStr = processDefaultTag(prop.tags);
		defaultStr = defaultStr && defaultStr !== 'undefined' ? <var className="default"><span>Default: </span>{defaultStr}</var> : null;

		return (
			<section className="property" key={index} id={prop.name}>
				<dt>
					{prop.name} {isRequired}
				</dt>
				<dd className="details">
					{renderTypeStrings(prop)}
					{defaultStr}
				</dd>
				<dd className="description">
					<DocParse component="div">{prop.description}</DocParse>
					{renderSeeTags(prop)}
				</dd>
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
		isFactory = hasFactoryTag(member),
		isClass = (member.kind === 'class'),
		isUI = hasUITag(member),
		classes = 'module' +
			(isFactory ? ' factory' : '') +
			(isHoc ? ' hoc' : '') +
			(!isFactory && !isHoc && isClass ? ' class' : '');

	switch (member.kind) {
		case 'function':
			return <section className={classes + ' function'} key={index}>
				<h4 id={member.name}>
					{member.name}
					{renderType('Function')}
				</h4>
				<dl>
					{renderFunction(member)}
				</dl>
			</section>;
		case 'constant':
			return <section className={classes} key={index}>
				<h4 id={member.name}>
					{member.name}
					{member.type ? renderType(member.type.name) : null}
				</h4>
				<div>
					<DocParse>{member.description}</DocParse>
					{renderSeeTags(member)}
				</div>
				{renderStaticProperties(member.members, isHoc)}
				{renderInstanceProperties(member.members, isHoc)}
			</section>;
		case 'class':
		default:
			return <section className={classes} key={index}>
				<h4 id={member.name}>
					{member.name}
					{renderType(isHoc ? 'Higher-Order Component' :	// eslint-disable-line no-nested-ternary
						isFactory ? 'Component Factory' :	// eslint-disable-line no-nested-ternary
						isUI ? 'Component' :
						'Class')}
				</h4>
				<div>
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

const renderModuleDescription = (doc) => {
	if (doc.length) {
		return <section className="moduleDescription">
			<DocParse component="div" className="moduleDescriptionText">
				{doc[0].description}
			</DocParse>
			{renderSeeTags(doc[0])}
		</section>;
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
