// Utilities for working with functions.  Primary use is in rendering functions
// as part of /wrappers/json.js
//
import jsonata from 'jsonata';	// http://docs.jsonata.org/
import kind from '@enact/core/kind';
import PropTypes from 'prop-types';

import DocParse from '../components/DocParse.js';
import EnactLive from '../components/EnactLiveEdit.js';
import {renderExportedFunction, renderConstructor} from '../utils/functions.js';
import {
	renderInstanceProperties,
	renderObjectProperties,
	renderStaticProperties
} from '../utils/properties.js';
import renderSeeTags from '../utils/see';
import renderTypedef from '../utils/typedefs';
import FloatingAnchor from '../components/FloatingAnchor';
import SmartLink from '../components/SmartLink';
import Type from '../components/Type';
import Code from '../components/Code';

import {hasDeprecatedTag} from './common';

import * as css from '../css/main.module.less';

const H4 = (props) => FloatingAnchor.inline({component: 'h4', ...props});

const hasFactoryTag = async (member) => {
	// Find any tag field whose `title` is 'factory'
	const expression = "$[title='factory']";
	const result = await jsonata(expression).evaluate(member.tags);
	return !!result;
};

const hasHOCTag = async (member) => {
	// Find any tag field whose `title` is 'hoc'
	const expression = "$[title='hoc']";
	const result = await jsonata(expression).evaluate(member.tags);
	return !!result;
};

const hasUITag = async (member) => {
	// Find any tag field whose `title` is 'ui'
	const expression = "$[title='ui']";
	const result = await jsonata(expression).evaluate(member.tags);
	return !!result;
};

const getExampleTags = async (member) => {
	// Find any tag field whose `title` is 'example'
	// Updated style that works in jsonata 1.6.4 and always returns array!
	const expression = "$.[tags[title='example']]";
	return await jsonata(expression).evaluate(member);
};

const getBaseComponents = async (member) => {
	// Find any tag field whose `title` is 'extends' and extract the name(s)
	const expression = "$.[tags[title='extends'].name]";
	return await jsonata(expression).evaluate(member);
};

const getHocs = async (member) => {
	// Find any tag field whose `title` is 'mixes' and extract the name(s)
	const expression = "$.[tags[title='mixes'].name]";
	return await jsonata(expression).evaluate(member);
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
			<H4 {...rest} id={uniqueId}>
				{children}
				{varType}
				{deprecationIcon}
			</H4>
		);
	}
});

const renderExtends = async (member) => {
	const baseComponents = await getBaseComponents(member);

	if (baseComponents.length) {
		return (
			baseComponents.map((baseComponent, index) => (
				<SmartLink
					className={css.extends}
					key={`extends-${index}`}
					moduleName={baseComponent}
					prefix="Extends: "
				/>
			))
		);
	}
};

const renderAppliedHocs = async (member, isHoc) => {
	const hocs = await getHocs(member);

	if (hocs.length) {
		return (
			hocs.map((hoc, index) => (
				<SmartLink
					className={css.extends}
					key={`applies-${index}`}
					moduleName={hoc}
					prefix={isHoc ? 'Includes: ' : 'Wrapped with: '}
				/>
			))
		);
	}
};

const renderModuleMember = async (member, index) => {
	const isHoc = await hasHOCTag(member),
		isDeprecated = await hasDeprecatedTag(member),
		isFactory = await hasFactoryTag(member),
		isClass = (member.kind === 'class'),
		isUI = await hasUITag(member),
		classes = [
			css.module,
			(isDeprecated ? css.deprecated : null),
			(isFactory ? css.factory : null),
			(isHoc ? css.hoc : null),
			(!isFactory && !isHoc && isClass ? css.class : null)
		];

	const deprecationNote = isDeprecated ? <DocParse component="div" className={css.deprecationNote}>{member.deprecated}</DocParse> : null;
	// Some HOCs using `compose` will be listed as 'constant' instead of 'class', so we fix that up.
	let memberKind = isHoc ? 'class' : member.kind;

	switch (memberKind) {
		case 'function':
			return <section className={classes.join(' ')} key={index}>
				<MemberHeading varType="Function" deprecated={isDeprecated}>{member.name}</MemberHeading>
				{deprecationNote}
				{await renderExportedFunction(member)}
			</section>;
		case 'constant':
			return <section className={classes.join(' ')} key={index}>
				<MemberHeading varType={member.type ? member.type.name : null} deprecated={isDeprecated}>{member.name}</MemberHeading>
				{deprecationNote}
				<div>
					<DocParse>{member.description}</DocParse>
					{renderSeeTags(member)}
				</div>
				{await renderStaticProperties(member.members, isHoc)}
				{await renderInstanceProperties(member.members, isHoc)}
				{await renderObjectProperties(member.properties)}
			</section>;
		case 'typedef':
			return <section className={classes.join(' ')} key={index}>
				<MemberHeading varType={member.type ? member.type.name : null} deprecated={isDeprecated}>{member.name}</MemberHeading>
				{deprecationNote}
				{await renderTypedef(member)}
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
				{await renderExtends(member)}
				{await renderAppliedHocs(member, isHoc)}
				{await renderConstructor(member)}
				{await renderStaticProperties(member.members, isHoc)}
				{await renderInstanceProperties(member.members, isHoc)}
			</section>;
	}
};

const renderTypedefMembers = async (typedefMembers) => {
	if (typedefMembers.length) {
		return [
			<h3 key="td1">Type Definitions</h3>,
			await Promise.all(typedefMembers.map(await renderModuleMember))
		];
	}
};

export const renderModuleMembers = async (members) => {
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
		const {typedefMembers, moduleMembers} = sortedMembers.reduce((acc, member) => {
			if (member.kind === 'typedef') {
				acc.typedefMembers.push(member);
			} else {
				acc.moduleMembers.push(member);
			}
			return acc;
		}, {typedefMembers: [], moduleMembers: []});

		return (
			<div>
				<h3>Members</h3>
				{await Promise.all(moduleMembers.map(renderModuleMember))}
				{await renderTypedefMembers(typedefMembers)}
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
		// eslint-disable-next-line no-shadow
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

	// eslint-disable-next-line no-shadow
	render: ({module, name, ...rest}) => {
		delete rest.children;
		return <Code className={css.usage}>{`import ${name} from '@enact/${module}';`}</Code>;
	}
});

export const renderModuleDescription = async (doc) => {
	if (doc.length) {
		const code = await getExampleTags(doc[0]);
		const isDeprecated = await hasDeprecatedTag(doc[0]);
		const deprecationNote = isDeprecated ? <DocParse component="div" className={css.deprecationNote}>{doc[0].deprecated}</DocParse> : null;

		return <section className={css.moduleDescription}>
			{deprecationNote}
			<DocParse component="div" className={css.moduleDescriptionText}>
				{doc[0].description}
			</DocParse>
			{code.length ? <EnactLive code={code[0].description} name={doc[0].name} /> : null}
			{renderSeeTags(doc[0])}
			<ImportBlock module={doc[0].name} />
		</section>;
	}
};
