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
import Code from '../components/Code';

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


const MemberHeading = kind({
	name: 'MemberHeading',

	propTypes: {
		children: PropTypes.string,
		deprecated: PropTypes.bool,
		varType: PropTypes.string
	},

	computed: {
		uniqueId: ({children}) => children,
		deprecationIcon: ({deprecated}) => (
			deprecated ? <var className={css.deprecatedIcon} data-tooltip="Deprecated">&#x274C;</var> : null
		),
		varType: ({varType}) => varType ? <Type className={css.typeInHeader}>{varType}</Type> : null
	},

	render: ({children, deprecationIcon, uniqueId, varType, ...rest}) => {
		delete rest.deprecated;
		return (
			<h4 {...rest}>
				<a name={uniqueId} className="navAnchor" />
				{children}
				{varType}
				{deprecationIcon}
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

	const deprecationNote = isDeprecated ? <DocParse component="div" className={css.deprecationNote}>{member.deprecated}</DocParse> : null;

	switch (member.kind) {
		case 'function':
			classes.push(css.function);
			return <section className={classes.join(' ')} key={index}>
				<MemberHeading varType="Function" deprecated={isDeprecated}>{member.name}</MemberHeading>
				{deprecationNote}
				<dl>
					{renderFunction(member)}
				</dl>
			</section>;
		case 'constant':
			return <section className={classes.join(' ')} key={index}>
				<MemberHeading varType={member.type ? member.type.name : null} deprecated={isDeprecated}>{member.name}</MemberHeading>
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
				<MemberHeading varType={member.type ? member.type.name : null} deprecated={isDeprecated}>{member.name}</MemberHeading>
				{deprecationNote}
				<div>
					<DocParse>{member.description}</DocParse>
					{renderSeeTags(member)}
				</div>

				<dl>
					{member.properties.map((prop, index) => {
						return renderTypedef(prop, index, member.name);
					})}
				</dl>
			</section>;
		case 'class':
		default:
			return <section className={classes.join(' ')} key={index}>
				<MemberHeading
					varType={(isHoc ? 'Higher-Order Component' :	// eslint-disable-line no-nested-ternary
						isFactory ? 'Component Factory' :	// eslint-disable-line no-nested-ternary
							isUI ? 'Component' :
								'Class')}
					deprecated={isDeprecated}
				>
					{member.name}
				</MemberHeading>
				{deprecationNote}
				<div className={css.componentDescription}>
					<DocParse>{member.description}</DocParse>
					{renderSeeTags(member)}
				</div>
				<ImportBlock module={member.memberof} name={member.name} />
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

// Input:  "moonstone/Button"  or "moonstone/Button.ButtonBase"
// Extracts module name and short name
const moduleRegex = /(\w+\/(\w+))(\.(\w+))?/;

// Creates an import statement block from module or export name
// If name is not supplied, it will be inferred from module
const ImportBlock = kind({
	name: 'ImportBlock',

	propTypes: {
		// module name, e.g.: 'moonstone/Button'
		module: PropTypes.string.isRequired,
		// Component name, e.g.: 'ButtonBase'.  Will be inferred if not supplied.
		name: PropTypes.string
	},

	computed: {
		name: ({module, name}) => {
			const res = module.match(moduleRegex) || [];
			let output = name;
			if (!name) {
				output = res[2] || module;
			} else if (res[2] && (name !== res[2])) {
				output = '{' + name + '}';
			}
			return output;
		}
	},

	render: ({module, name, ...rest}) => {
		delete rest.children;
		return <Code className={css.usage}>{`import ${name} from '@enact/${module}';`}</Code>;
	}
});

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
			<ImportBlock module={doc[0].name} />
		</section>;
	}
};


