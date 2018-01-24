// Utilities for working with functions.  Primary use is in rendering functions
// as part of /wrappers/json.js
//
import DocParse from '../components/DocParse.js';
import EnactLive from '../components/EnactLiveEdit.js';
import {hasDeprecatedTag} from './common';
import jsonata from 'jsonata';	// http://docs.jsonata.org/
import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import React from 'react';
import renderFunction from '../utils/functions.js';
import {
	renderInstanceProperties,
	renderObjectProperties,
	renderStaticProperties
} from '../utils/properties.js';
import renderSeeTags from '../utils/see';
import renderTypedef from '../utils/typedefs';
import Type from '../components/Type';

import css from '../css/main.less';

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
		isDeprecated = hasDeprecatedTag(member),
		isFactory = hasFactoryTag(member),
		isClass = (member.kind === 'class'),
		isUI = hasUITag(member),
		classes = [
			css.module,
			(isDeprecated ? css.deprecated : null),
			(isFactory ? css.factory : null),
			(isHoc ? css.hoc : null),
			(!isFactory && !isHoc && isClass ? css.class : null)
		];

	const deprecationIcon = isDeprecated ? <var className={css.deprecatedIcon} data-tooltip="Deprecated">&#x274C;</var> : null;
	const deprecationNote = isDeprecated ? <DocParse component="div" className={css.deprecationNote}>{member.deprecated}</DocParse> : null;

	switch (member.kind) {
		case 'function':
			classes.push(css.function);
			return <section className={classes.join(' ')} key={index}>
				<ModuleHeading varType="Function">{member.name} {deprecationIcon}</ModuleHeading>
				{deprecationNote}
				<dl>
					{renderFunction(member)}
				</dl>
			</section>;
		case 'constant':
			return <section className={classes.join(' ')} key={index}>
				<ModuleHeading varType={member.type ? member.type.name : null}>{member.name} {deprecationIcon}</ModuleHeading>
				{deprecationNote}
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
				<ModuleHeading varType={member.type ? member.type.name : null}>{member.name} {deprecationIcon}</ModuleHeading>
				{deprecationNote}
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
					{deprecationIcon}
				</ModuleHeading>
				{deprecationNote}
				<div className={css.componentDescription}>
					<DocParse>{member.description}</DocParse>
					{renderSeeTags(member)}
				</div>
				{renderStaticProperties(member.members, isHoc)}
				{renderInstanceProperties(member.members, isHoc)}
			</section>;
	}
};

export const renderModuleMembers = (members) => {
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

export const renderModuleDescription = (doc) => {
	if (doc.length) {
		const code = getExampleTags(doc[0]);
		const isDeprecated = hasDeprecatedTag(doc[0]);
		const deprecationNote = isDeprecated ? <DocParse component="div" className={css.deprecationNote}>{doc[0].deprecated}</DocParse> : null;

		return <section className={css.moduleDescription}>
			{deprecationNote}
			<DocParse component="div" className={css.moduleDescriptionText}>
				{doc[0].description}
			</DocParse>
			{code.length ? <EnactLive code={code[0].description} /> : null}
			{renderSeeTags(doc[0])}
		</section>;
	}
};


