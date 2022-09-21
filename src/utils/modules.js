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

import css from '../css/main.module.less';

const H4 = (props) => FloatingAnchor.inline({component: 'h4', ...props});

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
	// Updated style that works in jsonata 1.6.4 and always returns array!
	const expression = "$.[tags[title='example']]";
	return jsonata(expression).evaluate(member);
};

const getBaseComponents = (member) => {
	// Find any tag field whose `title` is 'extends' and extract the name(s)
	const expression = "$.[tags[title='extends'].name]";
	return jsonata(expression).evaluate(member);
};

const getHocs = (member) => {
	// Find any tag field whose `title` is 'mixes' and extract the name(s)
	const expression = "$.[tags[title='mixes'].name]";
	return jsonata(expression).evaluate(member);
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
			// eslint-disable-next-line jsx-a11y/accessible-emoji
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

const renderExtends = member => {
	const baseComponents = getBaseComponents(member);

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

const renderAppliedHocs = (member, isHoc) => {
	const hocs = getHocs(member);

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
	// Some HOCs using `compose` will be listed as 'constant' instead of 'class', so we fix that up.
	let memberKind = isHoc ? 'class' : member.kind;

	switch (memberKind) {
		case 'function':
			return <section className={classes.join(' ')} key={index}>
				<MemberHeading varType="Function" deprecated={isDeprecated}>{member.name}</MemberHeading>
				{deprecationNote}
				{renderExportedFunction(member)}
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
				{renderTypedef(member)}
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
				{renderExtends(member)}
				{renderAppliedHocs(member, isHoc)}
				{renderConstructor(member)}
				{renderStaticProperties(member.members, isHoc)}
				{renderInstanceProperties(member.members, isHoc)}
			</section>;
	}
};

const renderTypedefMembers = (typedefMembers) => {
	if (typedefMembers.length) {
		return [
			<h3 key="td1">Type Definitions</h3>,
			typedefMembers.map(renderModuleMember)
		];
	}
};

export const renderModuleMembers = (edges) => {
	// All module members will be static, no need to check instance members
	if (edges.length) {
		const moduleMembers = [];
		const typedefMembers = [];
		const checkRedundantId = [];
		/* If the kind of a node is class or constant,
		 do not render the node again
		 because the information about the node has already been rendered in node.members.static(renderStaticProperties)
		 or node.members.instance (renderInstanceProperties)
		 ex) spotlight's static function */
		edges.forEach(edge => {
			if (edge.node.kind === 'class' || edge.node.kind === 'constant') {
				checkRedundantId.push(edge.node.id);
			}
		});
		edges.forEach(edge => {
			if (edge.node.kind === 'typedef') {
				typedefMembers.push(edge.node);
			} else if (edge.node.kind !== null && edge.node.kind !== 'module') {
				if (checkRedundantId.indexOf(edge.node.parent.id) < 0) {
					moduleMembers.push(edge.node);
				}
			}
		});

		return (
			<div>
				<h3>Members</h3>
				{moduleMembers.map(renderModuleMember)}
				{renderTypedefMembers(typedefMembers)}
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

export const renderModuleDescription = (doc) => {
	if (doc) {
		const code = getExampleTags(doc.node);
		const isDeprecated = hasDeprecatedTag(doc.node);
		const deprecationNote = isDeprecated ? <DocParse component="div" className={css.deprecationNote}>{doc.node.deprecated}</DocParse> : null;

		return <section className={css.moduleDescription}>
			{deprecationNote}
			<DocParse component="div" className={css.moduleDescriptionText}>
				{doc.node.description}
			</DocParse>
			{code.length ? <EnactLive code={code[0].description} name={doc.node.name} /> : null}
			{renderSeeTags(doc.node)}
			<ImportBlock module={doc.node.name} />
		</section>;
	}
};
