#!/usr/bin/env node

/**
 * Documentation.js JSON to MDX Converter
 * Converts documentation.js output to MDX format for Docusaurus
 */

import fs from 'fs';
import path from 'path';

/**
 * Converts MDAST (Markdown AST) to plain text/markdown string
 */
function mdastToMarkdown(node, inList = false) {
	if (!node) return '';

	if (typeof node === 'string') return node;

	if (Array.isArray(node)) {
		return node.map(n => mdastToMarkdown(n, inList)).join('');
	}

	if (!node.type) return '';

	switch (node.type) {
		case 'root':
			return node.children ? node.children.map(c => mdastToMarkdown(c, inList)).join('') : '';

		case 'paragraph':
			const paragraphContent = node.children ? node.children.map(c => mdastToMarkdown(c, inList)).join('') : '';
			return inList ? paragraphContent : paragraphContent + '\n\n';

		case 'text':
			return node.value || '';

		case 'inlineCode':
			return `\`${node.value}\``;

		case 'code':
			const lang = node.lang && String(node.lang).trim() ? node.lang : 'javascript';
			return `\`\`\`${lang}\n${node.value}\n\`\`\`\n\n`;

		case 'link':
			const linkText = node.children ? node.children.map(c => mdastToMarkdown(c, inList)).join('') : '';
			if (node.jsdoc && node.url) {
				const { href } = mixNameToDocLink(node.url);
				return href ? `[${linkText}](${href})` : linkText;
			}
			return `[${linkText}](${node.url})`;

		case 'emphasis':
			return `*${node.children ? node.children.map(c => mdastToMarkdown(c, inList)).join('') : ''}*`;

		case 'strong':
			return `**${node.children ? node.children.map(c => mdastToMarkdown(c, inList)).join('') : ''}**`;

		case 'list':
			const ordered = node.ordered || false;
			return '\n' + node.children.map((item, idx) => {
				const bullet = ordered ? `${idx + 1}. ` : '- ';
				return bullet + mdastToMarkdown(item, true);
			}).join('\n') + '\n\n';

		case 'listItem':
			return node.children ? node.children.map(c => mdastToMarkdown(c, true)).join('') : '';

		case 'heading':
			const headingLevel = '#'.repeat(node.depth || 1);
			return `${headingLevel} ${node.children ? node.children.map(c => mdastToMarkdown(c, inList)).join('') : ''}\n\n`;

		default:
			return node.children ? node.children.map(c => mdastToMarkdown(c, inList)).join('') : '';
	}
}

/**
 * Escapes curly-brace patterns that MDX would parse as JavaScript expressions.
 * Wraps doc notation like {param}, {key: value}, {position: {x, y}} in backticks
 * so they render as inline code instead of causing "Could not parse expression with acorn" errors.
 */
function escapeMdxExpressions(text) {
	if (!text || typeof text !== 'string') return text;

	let result = '';
	let i = 0;
	let inCodeBlock = false;
	let inInlineCode = false;
	let codeBlockMarker = '';

	while (i < text.length) {
		// Track code blocks (```)
		if (text.slice(i, i + 3) === '```') {
			inCodeBlock = !inCodeBlock;
			if (inCodeBlock) codeBlockMarker = text.slice(i, i + 3);
			result += text.slice(i, i + 3);
			i += 3;
			continue;
		}

		if (inCodeBlock) {
			result += text[i];
			i++;
			continue;
		}

		// Track inline code (`) - only when not escaped
		if (text[i] === '`' && (i === 0 || text[i - 1] !== '\\')) {
			inInlineCode = !inInlineCode;
			result += text[i];
			i++;
			continue;
		}

		if (inInlineCode) {
			result += text[i];
			i++;
			continue;
		}

		// Find { ... } patterns that look like doc/param notation
		if (text[i] === '{') {
			let depth = 1;
			let j = i + 1;
			while (j < text.length && depth > 0) {
				if (text[j] === '{') depth++;
				else if (text[j] === '}') depth--;
				j++;
			}
			if (depth === 0) {
				const inner = text.slice(i + 1, j - 1);
				// Doc notation: identifiers, colons, commas, nested braces, markdown links - not JSX/template literals
				const looksLikeDoc = /^[\w\s,:{}\[\]().#\/\-'"]+$/.test(inner) && !inner.includes('${') && !inner.trim().startsWith('<');
				if (looksLikeDoc) {
					result += '`' + text.slice(i, j) + '`';
					i = j;
					continue;
				}
			}
		}

		result += text[i];
		i++;
	}

	return result;
}

/**
 * Converts markdown lists (- item) to HTML format for content inside TabItem.
 * Prevents "Expected closing tag </TabItem>" MDX errors when list syntax conflicts with JSX.
 */
function convertListsToHtmlForTabItem(text) {
	if (!text || typeof text !== 'string') return text;
	// Match markdown list items: line starting with "- " (after optional whitespace)
	const listItemRegex = /^(\s*)- (.+)$/gm;
	const lines = text.split('\n');
	let result = [];
	let inList = false;
	let listItems = [];

	function flushList() {
		if (listItems.length > 0) {
			result.push('<ul>');
			listItems.forEach(item => result.push(`<li>${item}</li>`));
			result.push('</ul>');
			listItems = [];
		}
		inList = false;
	}

	for (const line of lines) {
		const match = line.match(/^(\s*)- (.*)$/);
		if (match) {
			inList = true;
			listItems.push(match[2].trim());
		} else {
			flushList();
			result.push(line);
		}
	}
	flushList();

	return result.join('\n');
}

/**
 * Escapes angle brackets that MDX would parse as JSX tags (e.g. <--, <email@domain.com>).
 */
function escapeMdxAngleBrackets(text) {
	if (!text || typeof text !== 'string') return text;
	// Escape <-- pattern (comment arrows)
	let result = text.replace(/<--/g, '&lt;--');
	// Escape <email@domain.com> pattern - angle brackets around email-like strings
	result = result.replace(/<([^\s<>'"]+@[^\s<>'"]+)>/g, '&lt;$1&gt;');
	return result;
}

/**
 * Converts type expression to readable string
 */
function typeToString(type) {
	if (!type) return 'any';

	if (typeof type === 'string') return type;

	switch (type.type) {
		case 'NameExpression':
			return type.name;

		case 'OptionalType':
			return `${typeToString(type.expression)}?`;

		case 'UnionType':
			return type.elements.map(typeToString).join(', ');

		case 'ArrayType':
			return `${typeToString(type.elements[0])}[]`;

		case 'TypeApplication':
			const base = typeToString(type.expression);
			const params = type.applications.map(typeToString).join(', ');
			return `${base}<${params}>`;

		case 'FunctionType':
			return 'Function';

		case 'AllLiteral':
			return '*';

		case 'NullableLiteral':
			return 'null';

		case 'StringLiteralType':
			return type.value != null ? `'${String(type.value)}'` : 'string';

		case 'NumberLiteralType':
			return type.value != null ? String(type.value) : 'number';

		case 'RestType':
			return `...${typeToString(type.expression)}`;

		default:
			return 'any';
	}
}

/**
 * Generates MDX content for parameters with tabs
 */
function generateParametersTabs(params) {
	if (!params || params.length === 0) return '';

	let mdx = '\n#### Parameters\n\n';
	mdx += '<Tabs>\n';

	params.forEach((param, index) => {
		const paramName = param.name || `param${index}`;
		const paramType = typeToString(param.type);
		const isOptional = param.type && param.type.type === 'OptionalType';
		let description = param.description ? mdastToMarkdown(param.description) : '';
		if (description) description = convertListsToHtmlForTabItem(description.trim());

		mdx += `  <TabItem value="${paramName}" label="${paramName}">\n`;
		mdx += `    **Type:** \`${paramType}\`${isOptional ? ' *(optional)*' : ''}\n\n`;
		if (description) {
			mdx += `    ${description}\n`;
		}
		mdx += `  </TabItem>\n`;
	});

	mdx += '</Tabs>\n\n';

	return mdx;
}

/**
 * Generates MDX content for returns section
 */
function generateReturnsSection(returns) {
	if (!returns || returns.length === 0) return '';

	let mdx = '\n#### Returns\n\n';

	returns.forEach(ret => {
		const returnType = typeToString(ret.type);
		const description = ret.description ? mdastToMarkdown(ret.description) : '';

		mdx += `**Type:** \`${returnType}\`\n\n`;
		if (description) {
			mdx += `${description.trim()}\n\n`;
		}
	});

	return mdx;
}

/**
 * Generates MDX content for properties
 */
function generatePropertiesSection(properties) {
	if (!properties || properties.length === 0) return '';

	let mdx = '\n## Properties\n\n';
	mdx += '<Tabs>\n';

	properties.forEach((prop, index) => {
		const propName = prop.name || `property${index}`;
		const propType = typeToString(prop.type);
		const tags = prop.tags || [];

		// Derive default value from @default tag if present
		const defaultTag = tags.find(tag => tag.title === 'default');
		const rawDefault = defaultTag && defaultTag.description
			? (typeof defaultTag.description === 'string'
				? defaultTag.description
				: mdastToMarkdown(defaultTag.description))
			: '';
		const defaultValue = rawDefault && rawDefault.trim() ? rawDefault.trim() : null;

		// Heuristic for required vs optional:
		// - explicit @required / @optional tags win
		// - otherwise, having a default usually means "not required"
		const hasRequiredTag = tags.some(tag => tag.title === 'required');
		const hasOptionalTag = tags.some(tag => tag.title === 'optional');
		let isRequired = null;
		if (hasRequiredTag) {
			isRequired = true;
		} else if (hasOptionalTag) {
			isRequired = false;
		} else if (defaultValue != null) {
			isRequired = false;
		}

		let description = prop.description ? mdastToMarkdown(prop.description) : '';
		if (description) description = convertListsToHtmlForTabItem(description.trim());

		mdx += `  <TabItem value="${propName}" label="${propName}">\n`;
		mdx += `    **Type:** \`${propType}\`\n\n`;

		if (isRequired !== null) {
			mdx += `    **Required:** ${isRequired ? 'Yes' : 'No'}\n\n`;
		}

		if (defaultValue != null) {
			mdx += `    **Default:** \`${defaultValue}\`\n\n`;
		}

		if (description) {
			mdx += `    ${description}\n`;
		}
		mdx += `  </TabItem>\n`;
	});

	mdx += '</Tabs>\n\n';

	return mdx;
}

/**
 * Extracts runnable JSX code from an example. Returns the code string or null.
 */
function extractRunnableCodeFromExample(example) {
	const raw = typeof example.description === 'string'
		? example.description
		: (example.code || (example.description && mdastToMarkdown(example.description)) || '');
	if (!raw || typeof raw !== 'string') return null;
	const trimmed = raw.trim();
	// JSX-like: starts with < and contains component/HTML tags
	if (trimmed.startsWith('<') && /<[a-zA-Z][a-zA-Z0-9]*[\s>\/]/.test(trimmed)) {
		return trimmed;
	}
	return null;
}

/**
 * Determines which runner to use based on module path.
 */
function getRunnerFromModule(moduleName) {
	if (!moduleName) return 'core';
	const top = moduleName.split('/')[0];
	if (['moonstone', 'sandstone', 'agate', 'limestone'].includes(top)) return top;
	return 'core';
}

/**
 * Generates MDX content for examples. Uses LiveExample for runnable JSX when available.
 */
function generateExamplesSection(examples, moduleName, options = {}) {
	if (!examples || examples.length === 0) return {mdx: '', hasLiveExample: false};

	let mdx = '\n## Examples\n\n';
	let hasLiveExample = false;
	const runner = getRunnerFromModule(moduleName);

	examples.forEach((example) => {
		const code = extractRunnableCodeFromExample(example);
		if (code && options.useLiveExample !== false) {
			hasLiveExample = true;
			if (example.caption) mdx += `### ${example.caption}\n\n`;
			const escapedCode = code.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
			mdx += `<LiveExample code={\`${escapedCode}\`} runner="${runner}" title="${example.caption || 'Try it'}" />\n\n`;
		} else {
			if (example.caption) mdx += `### ${example.caption}\n\n`;
			if (example.description) {
				mdx += mdastToMarkdown(example.description);
			}
		}
	});

	return {mdx, hasLiveExample};
}

/**
 * Resolve display type label from JSDoc tags (same logic as docs/utils/modules.js).
 * Returns "Higher-Order Component" | "Component Factory" | "Component" | "Class" | "Function" | kind.
 */
function getMemberVarType(member) {
	const tags = member.tags || [];
	const hasTag = (title) => tags.some(t => t.title === title);
	const isHoc = hasTag('hoc');
	const isFactory = hasTag('factory');
	const isUI = hasTag('ui');
	const isClass = member.kind === 'class';
	const isConstant = member.kind === 'constant';

	if (member.kind === 'function') return 'Function';
	if (isHoc) return 'Higher-Order Component';
	if (isFactory) return 'Component Factory';
	if (isClass && isUI) return 'Component';
	if (isConstant && isHoc) return 'Higher-Order Component';
	if (isClass) return 'Class';
	if (isConstant && isUI) return 'Component';
	if (member.kind === 'typedef') return (member.type && member.type.name) ? member.type.name : 'Object';
	return member.kind ? member.kind : null;
}

/** Get mix names from tags (title === 'mixes'), same as docs getHocs. */
function getMixes(member) {
	const tags = member.tags || [];
	return tags.filter(t => t.title === 'mixes').map(t => t.name).filter(Boolean);
}

/** Get base component names from tags (title === 'extends'), same as docs getBaseComponents. */
function getBaseComponents(member) {
	const tags = member.tags || [];
	return tags.filter(t => t.title === 'extends').map(t => t.name).filter(Boolean);
}

function mixNameToDocLink(mixName) {
	if (!mixName) return { href: '', text: mixName };
	const lastDot = mixName.lastIndexOf('.');
	const modulePath = lastDot >= 0 ? mixName.slice(0, lastDot) : mixName;
	const exportName = lastDot >= 0 ? mixName.slice(lastDot + 1) : mixName.split('/').pop();
	const docPath = modulePath.replace(/\//g, '/');
	const href = `/docs/${docPath}#${exportName}`;
	return { href, text: mixName };
}

/**
 * Returns true if an instance member should be treated as a property (not a method).
 * Same as docs: has type and (no params/returns, or type is Function so callback props go in Properties).
 */
function isInstanceProperty(member) {
	if (!member || !member.type || member.kind === 'typedef') return false;
	const typeStr = typeToString(member.type);
	const noParamsOrReturns = (!member.params || member.params.length === 0) && (!member.returns || member.returns.length === 0);
	if (typeStr === 'Function') return true;
	return noParamsOrReturns && member.kind !== 'function';
}

/**
 * Get type string, required, default and description for a property-like member.
 * Used for both the properties list and per-member blocks.
 */
function getPropertyMeta(member) {
	const tags = member.tags || [];
	const defaultTag = tags.find(tag => tag.title === 'default');
	const rawDefault = defaultTag && defaultTag.description
		? (typeof defaultTag.description === 'string'
			? defaultTag.description
			: mdastToMarkdown(defaultTag.description))
		: '';
	const defaultValue = rawDefault && rawDefault.trim() ? rawDefault.trim() : null;
	const hasRequiredTag = tags.some(tag => tag.title === 'required');
	const hasOptionalTag = tags.some(tag => tag.title === 'optional');
	let isRequired = null;
	if (hasRequiredTag) isRequired = true;
	else if (hasOptionalTag) isRequired = false;
	else if (defaultValue != null) isRequired = false;
	const typeStr = member.type ? typeToString(member.type) : '';
	const description = member.description ? mdastToMarkdown(member.description).trim() : '';
	return { typeStr, isRequired, defaultValue, description };
}

const propSort = (a, b) => (a.name || '').localeCompare(b.name || '', undefined, { sensitivity: 'base' });

/** Map type token to docs-style class. Literals ('above', 'both') use 'literal' (base style), type names use Type.less names. */
function typeTokenToClass(token) {
	const t = (token || '').trim();
	if (/^'.*'$/.test(t)) return 'literal'; // quoted literal e.g. 'above', 'both' – base type style, not string
	const lower = t.toLowerCase();
	const known = ['any', 'array', 'boolean', 'function', 'module', 'number', 'object', 'string', 'element', 'component', 'node'];
	for (const k of known) {
		if (lower === k || lower === k + '[]') return k.replace('[]', '');
	}
	if (lower.endsWith('[]')) return 'array';
	return 'literal';
}

/** Render type string as docs-style pills: each token in <span className="api-type api-type-{class}"> */
function renderTypeSpans(typeStr) {
	if (!typeStr || !String(typeStr).trim()) return '';
	const tokens = String(typeStr).split(',').map(s => s.trim()).filter(Boolean);
	return tokens.map(t => {
		const cls = typeTokenToClass(t);
		return `<span className="api-type api-type-${escapeHtml(cls)}">${escapeHtml(t)}</span>`;
	}).join(', ');
}

/**
 * Get display meta (typeStr, isRequired, defaultValue, description) for any instance member.
 * Used so Properties section can list both props and methods (docs use a single Properties section).
 */
function getInstanceMemberDisplayMeta(member) {
	const meta = getPropertyMeta(member);
	let typeStr = meta.typeStr;
	if (!typeStr && member.returns && member.returns.length > 0) typeStr = typeToString(member.returns[0].type);
	if (!typeStr && (member.params || member.returns)) typeStr = 'Function';
	return { ...meta, typeStr: typeStr || meta.typeStr };
}

/**
 * Generates a single "Properties" section for all instance members (props + methods), docs style:
 * <section class="api-properties">, <h5>Properties</h5>, <dl> with each as api-property row.
 */
function generateInstancePropertiesSection(instanceMembers, moduleName = '') {
	const all = (instanceMembers || []).filter(m => m && m.name);
	if (all.length === 0) return '';

	const withMeta = all.map(m => ({ member: m, ...getInstanceMemberDisplayMeta(m) }));
	const requiredFirst = withMeta.filter(m => m.isRequired === true).sort((a, b) => propSort(a.member, b.member));
	const rest = withMeta.filter(m => m.isRequired !== true).sort((a, b) => propSort(a.member, b.member));
	const sorted = [...requiredFirst, ...rest];

	let mdx = '\n<section className="api-properties">\n';
	mdx += '<h5>Properties</h5>\n';
	mdx += '<dl className="api-dl-properties">\n';

	sorted.forEach(({ member, typeStr, isRequired, defaultValue, description }) => {
		const id = (moduleName ? moduleName + '-' : '') + member.name;
		const requiredIcon = isRequired === true ? ' <var className="api-prop-required" title="Required Property">•</var>' : '';
		mdx += `<section className="api-property" id="${escapeHtml(id)}">\n`;
		mdx += '  <div className="api-property-title">\n';
		mdx += `    <dt>${escapeHtml(member.name)}${requiredIcon}</dt>\n`;
		mdx += `    <div className="api-property-types">${renderTypeSpans(typeStr)}</div>\n`;
		mdx += '  </div>\n';
		mdx += '  <dd className="api-property-description">\n';
		if (description) mdx += '    ' + escapeDescriptionPreservingCodeBlocks(description).replace(/\n/g, '\n    ') + '\n';
		if (defaultValue != null) mdx += `    <div className="api-property-default"><strong>Default:</strong> <code>${escapeDescriptionPreservingCodeBlocks(String(defaultValue))}</code></div>\n`;
		mdx += '  </dd>\n';
		mdx += '</section>\n';
	});

	mdx += '</dl>\n</section>\n\n';
	return mdx;
}

/**
 * Generates "Properties" for typedef (Object shape) in the same style as instance properties:
 * section.api-properties, h5 Properties, dl with each property as api-property (name, type, description).
 * Like docs renderTypedef: list of minSize, size, etc. instead of Tabs.
 */
function generateTypedefPropertiesSection(properties, idPrefix = '') {
	if (!properties || properties.length === 0) return '';

	const sorted = [...properties].sort((a, b) => propSort(a, b));
	let mdx = '\n<section className="api-properties">\n';
	mdx += '<h5>Properties</h5>\n';
	mdx += '<dl className="api-dl-properties">\n';

	sorted.forEach((prop) => {
		const { typeStr, isRequired, defaultValue, description } = getPropertyMeta(prop);
		const id = (idPrefix ? idPrefix + '-' : '') + (prop.name || '');
		const requiredIcon = isRequired === true ? ' <var className="api-prop-required" title="Required Property">•</var>' : '';
		mdx += `<section className="api-property" id="${escapeHtml(id)}">\n`;
		mdx += '  <div className="api-property-title">\n';
		mdx += `    <dt>${escapeHtml(prop.name || '')}${requiredIcon}</dt>\n`;
		mdx += `    <div className="api-property-types">${renderTypeSpans(typeStr)}</div>\n`;
		mdx += '  </div>\n';
		mdx += '  <dd className="api-property-description">\n';
		if (description) mdx += '    ' + escapeDescriptionPreservingCodeBlocks(description).replace(/\n/g, '\n    ') + '\n';
		if (defaultValue != null) mdx += `    <div className="api-property-default"><strong>Default:</strong> <code>${escapeDescriptionPreservingCodeBlocks(String(defaultValue))}</code></div>\n`;
		mdx += '  </dd>\n';
		mdx += '</section>\n';
	});

	mdx += '</dl>\n</section>\n\n';
	return mdx;
}

/**
 * Build import statement for a class/component (same logic as docs ImportBlock).
 * modulePath e.g. "ui/Button", exportName e.g. "ButtonBase" -> import { ButtonBase } from '@enact/ui/Button';
 * If exportName is the default export (last segment of path), -> import Button from '@enact/ui/Button';
 */
function getImportStatement(modulePath, exportName) {
	if (!modulePath) return '';
	const match = modulePath.match(/^(\w+\/(\w+))(\.\w+)?$/);
	const defaultExport = match ? match[2] : modulePath.split('/').pop();
	let name = exportName || defaultExport;
	if (defaultExport && exportName && exportName !== defaultExport) {
		name = `{ ${exportName} }`;
	}
	return `import ${name} from '@enact/${modulePath}';`;
}

/**
 * Generate the "Usage" / import block. Use markdown fenced code so Docusaurus/Prism
 * applies syntax highlighting (same colors as in docs). Statement is raw – no HTML escape.
 */
function generateUsageBlock(modulePath, exportName) {
	const statement = getImportStatement(modulePath, exportName);
	if (!statement) return '';
	// Fenced code block so Prism highlights import/keywords/strings; backticks in statement would break fence
	const safeStatement = statement.replace(/`/g, '\\`');
	return '\n<div className="api-usage-wrapper">\n\n```javascript\n' + safeStatement + '\n```\n\n</div>\n\n';
}

function escapeHtml(s) {
	if (s == null || s === '') return '';
	return String(s)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

/** Escape { and } so MDX does not parse as JS expression (e.g. {@link ...}) */
function escapeMdxCurly(s) {
	if (s == null || s === '') return '';
	return String(s)
		.replace(/\{/g, '&#123;')
		.replace(/\}/g, '&#125;');
}

/**
 * Escape description for MDX/HTML but leave content inside fenced code blocks (```...```) unescaped
 * so that =>, {, } etc. display correctly. Code blocks without a language get ```javascript so
 * Docusaurus/Prism apply syntax highlighting.
 */
function escapeDescriptionPreservingCodeBlocks(text) {
	if (text == null || text === '') return '';
	const s = String(text);
	const codeBlockRe = /(```\w*\n[\s\S]*?\n```)/g;
	const parts = s.split(codeBlockRe);
	let out = '';
	for (let i = 0; i < parts.length; i++) {
		if (parts[i].match(/^```\w*\n/)) {
			let block = parts[i];
			if (block.startsWith('```\n')) block = '```javascript\n' + block.slice(4);
			out += block;
		} else {
			out += escapeMdxCurly(escapeHtml(parts[i]));
		}
	}
	return out;
}

/**
 * Generates MDX for a single member (function, class, etc.)
 * Same structure as reference docs: section.api-member with h4 + inline type badge (Component / Higher-Order Component / etc.)
 * Returns {mdx, hasLiveExample}
 */
function generateMemberMDX(member, level = 2, moduleName = '') {
	let mdx = '';
	let hasLiveExample = false;

	const varType = getMemberVarType(member);
	const displayName = member.name || 'Untitled';
	const anchorId = escapeHtml(displayName);
	const accessBadge = member.access === 'private' ? '<span className="badge badge--danger">private</span>' :
		member.access === 'protected' ? '<span className="badge badge--warning">protected</span>' : '';

	mdx += '<section className="api-member">\n\n';
	mdx += `<h4 id="${anchorId}">${escapeHtml(displayName)}`;
	if (varType) mdx += ` <span className="api-member-type">${escapeHtml(varType)}</span>`;
	mdx += '</h4>\n\n';
	if (accessBadge) mdx += `${accessBadge}\n\n`;

	// Description
	if (member.description) {
		mdx += mdastToMarkdown(member.description);
	}

	// Usage (import statement) for classes, constants (e.g. HOCs), and other members with memberof – same as docs
	if (member.memberof && (member.kind === 'class' || member.kind === 'constant' || member.kind === 'function')) {
		mdx += generateUsageBlock(member.memberof, member.name);
	}
	// Extends: for classes with @extends – same as docs renderExtends, with links
	const baseComponents = getBaseComponents(member);
	if (baseComponents.length > 0) {
		const prefix = 'Extends: ';
		const links = baseComponents.map(name => {
			const { href, text } = mixNameToDocLink(name);
			return `<a href="${escapeHtml(href)}">${escapeHtml(text)}</a>`;
		}).join(', ');
		mdx += `<p className="api-extends">${prefix}${links}</p>\n\n`;
	}
	const mixes = getMixes(member);
	if (mixes.length > 0) {
		const isHoc = (member.tags || []).some(t => t.title === 'hoc');
		const prefix = isHoc ? 'Includes: ' : 'Wrapped with: ';
		const links = mixes.map(name => {
			const { href, text } = mixNameToDocLink(name);
			return `<a href="${escapeHtml(href)}">${escapeHtml(text)}</a>`;
		}).join(', ');
		mdx += `<p className="api-includes">${prefix}${links}</p>\n\n`;
	}

	// Member fields (commonly used for component props) - detected as members
	// with a declared type but no params/returns (i.e. not functions).
	if (isInstanceProperty(member)) {
		const { typeStr, isRequired, defaultValue } = getPropertyMeta(member);
		if (typeStr) mdx += `\n**Type:** \`${typeStr}\`\n`;
		if (isRequired !== null) mdx += `\n**Required:** ${isRequired ? 'Yes' : 'No'}\n`;
		if (defaultValue != null) mdx += `\n**Default:** \`${defaultValue}\`\n`;
		mdx += '\n';
	}

	// Parameters
	if (member.params && member.params.length > 0) {
		mdx += generateParametersTabs(member.params);
	}

	// Properties: for typedefs use same style as docs (list with name, type, description); for others use Tabs
	if (member.properties && member.properties.length > 0) {
		if (member.kind === 'typedef') {
			const idPrefix = moduleName ? (moduleName.replace(/\//g, '-').toLowerCase() + '-' + (member.name || '').toLowerCase()) : '';
			mdx += generateTypedefPropertiesSection(member.properties, idPrefix);
		} else {
			mdx += generatePropertiesSection(member.properties);
		}
	}

	// Returns
	if (member.returns && member.returns.length > 0) {
		mdx += generateReturnsSection(member.returns);
	}

	// Examples
	if (member.examples && member.examples.length > 0) {
		const result = generateExamplesSection(member.examples, moduleName);
		mdx += result.mdx;
		if (result.hasLiveExample) hasLiveExample = true;
	}

	// See also
	if (member.sees && member.sees.length > 0) {
		mdx += '\n### See Also\n\n';
		member.sees.forEach(see => {
			mdx += `- ${mdastToMarkdown(see.description || see)}\n`;
		});
		mdx += '\n';
	}

	// Throws
	if (member.throws && member.throws.length > 0) {
		mdx += '\n### Throws\n\n';
		member.throws.forEach(throwItem => {
			const throwType = typeToString(throwItem.type);
			const description = throwItem.description ? mdastToMarkdown(throwItem.description) : '';
			mdx += `- **${throwType}**: ${description.trim()}\n`;
		});
		mdx += '\n';
	}

	mdx += '\n</section>\n\n---\n\n';

	return {mdx, hasLiveExample};
}

/**
 * Generates complete MDX document from JSON
 */
function generateMDX(jsonData) {
	if (!Array.isArray(jsonData) || jsonData.length === 0) {
		throw new Error('Invalid JSON data: expected non-empty array');
	}

	const rootModule = jsonData[0];
	const moduleName = rootModule.name || 'API Documentation';
	const sidebarLabel = moduleName.split('/').slice(-1)[0]; // ex: "core/dispatcher" -> "dispatcher"

	let mdx = '---\n';
	mdx += `title: "${moduleName}"\n`;
	mdx += `description: "API documentation for ${moduleName}"\n`;
	mdx += `sidebar_label: "${sidebarLabel}"\n`;
	mdx += '---\n\n';

	// Imports for Docusaurus components
	mdx += 'import Tabs from \'@theme/Tabs\';\n';
	mdx += 'import TabItem from \'@theme/TabItem\';\n';
	const hasModuleExamples = rootModule.examples && rootModule.examples.some(ex => extractRunnableCodeFromExample(ex));
	const hasMemberExamples = (members) => {
		if (!members) return false;
		const check = (m) => m.examples && m.examples.some(ex => extractRunnableCodeFromExample(ex));
		const all = [...(members.static || []), ...(members.instance || []), ...(members.global || [])];
		return all.some(m => check(m) || (m.members && hasMemberExamples(m.members)));
	};
	const needsLiveExample = hasModuleExamples || hasMemberExamples(rootModule.members);
	if (needsLiveExample) {
		mdx += 'import LiveExample from \'@site/src/components/LiveExample\';\n';
	}
	mdx += '\n';

	// Module title and description
	mdx += `# ${moduleName}\n\n`;

	if (rootModule.description) {
		mdx += mdastToMarkdown(rootModule.description);
	}

	// Exports list if available
	const exportTags = rootModule.tags.filter(tag => tag.title === 'exports');
	if (exportTags.length > 0) {
		mdx += '\n## Exports\n\n';
		mdx += 'This module exports the following:\n\n';
		exportTags.forEach(tag => {
			mdx += `- \`${tag.description}\`\n`;
		});
		mdx += '\n';
	}

	// Module-level examples from JSDoc @example
	if (rootModule.examples && rootModule.examples.length > 0 && needsLiveExample) {
		const result = generateExamplesSection(rootModule.examples, moduleName);
		if (result.mdx) mdx += result.mdx;
	}

	// Process all static members
	if (rootModule.members && rootModule.members.static) {
		mdx += '\n## API Reference\n\n';

		// Group members by kind
		const functions = [];
		const classes = [];
		const constants = [];
		const typedefs = [];
		const others = [];

		rootModule.members.static.forEach(member => {
			switch (member.kind) {
				case 'function':
					functions.push(member);
					break;
				case 'class':
					classes.push(member);
					break;
				case 'constant':
				case 'member':
					constants.push(member);
					break;
				case 'typedef':
					typedefs.push(member);
					break;
				default:
					others.push(member);
			}
		});

				// Functions
		if (functions.length > 0) {
			mdx += '\n## Functions\n\n';
			functions.forEach(func => {
				const result = generateMemberMDX(func, 3, moduleName);
				mdx += result.mdx;
			});
		}

		// Classes
		if (classes.length > 0) {
			mdx += '\n### Classes\n\n';
			classes.forEach(cls => {
				const result = generateMemberMDX(cls, 4, moduleName);
				mdx += result.mdx;

				// Class instance members: single Properties section (docs have no separate Methods section)
				if (cls.members && cls.members.instance && cls.members.instance.length > 0) {
					const idPrefix = `${moduleName.replace(/\//g, '-').toLowerCase()}-${(cls.name || '').toLowerCase()}`;
					mdx += generateInstancePropertiesSection(cls.members.instance, idPrefix);
				}

				// Class static members
				if (cls.members && cls.members.static && cls.members.static.length > 0) {
					mdx += '\n#### Static Members\n\n';
					cls.members.static.forEach(member => {
						const memberResult = generateMemberMDX(member, 5, moduleName);
						mdx += memberResult.mdx;
					});
				}
			});
		}

		// Constants
		if (constants.length > 0) {
			mdx += '\n## Constants\n\n';
			constants.forEach(constant => {
				const result = generateMemberMDX(constant, 4, moduleName);
				mdx += result.mdx;
			});
		}

		// Type Definitions
		if (typedefs.length > 0) {
			mdx += '\n## Type Definitions\n\n';
			typedefs.forEach(typedef => {
				const result = generateMemberMDX(typedef, 4, moduleName);
				mdx += result.mdx;
			});
		}

		// Others
		if (others.length > 0) {
			mdx += '\n## Other Exports\n\n';
			others.forEach(other => {
				const result = generateMemberMDX(other, 4, moduleName);
				mdx += result.mdx;
			});
		}

		mdx += '\n<div className="api-types-key">\n';
		mdx += '<span className="api-types-key-label">Variable Types Key:</span>\n';
		const typeNames = ['Array', 'Boolean', 'Function', 'Module', 'Number', 'Object', 'String'];
		typeNames.forEach(t => {
			mdx += `<span className="api-type api-type-${t.toLowerCase()}">${t}</span>\n`;
		});
		mdx += '</div>\n\n';
	}

	return mdx;
}

/**
 * Main execution
 */
export function main(inputFile) {
	const normalized = path.normalize(inputFile).split(path.sep).join('/');
	const output = normalized.replace(/src\/pages\/docs\/modules/, 'docs');
	const outputFile = output.replace(/\.json$/, '.mdx');

	try {
		// Read JSON file
		console.log(`Reading ${inputFile}...`);
		const jsonContent = fs.readFileSync(inputFile, 'utf8');
		const jsonData = JSON.parse(jsonContent);

		// Generate MDX
		console.log('Generating MDX...');
		let mdxContent = generateMDX(jsonData);
		mdxContent = escapeMdxExpressions(mdxContent);
		mdxContent = escapeMdxAngleBrackets(mdxContent);

		// Write MDX file
		console.log(`Writing to ${outputFile}...`);
		fs.mkdirSync(path.dirname(outputFile), {recursive: true});
		fs.writeFileSync(outputFile, mdxContent, 'utf8');

		console.log('✓ Conversion completed successfully!');
		console.log(`\nOutput: ${outputFile}`);
		console.log(`Size: ${(mdxContent.length / 1024).toFixed(2)} KB`);

	} catch (error) {
		console.error('Error:', error.message);
		process.exit(1);
	}
}

function getAllJsonFiles (dir, files = []) {
	for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
		const fullPath = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			getAllJsonFiles(fullPath, files);
		} else if (entry.isFile() && entry.name.endsWith('.json')) {
			files.push(fullPath);
		}
	}

	return files;
}

function getAllDocFiles(dir, files = []) {
	for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
		const fullPath = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			getAllDocFiles(fullPath, files);
		} else if (entry.isFile() && /\.(md|mdx)$/.test(entry.name)) {
			files.push(fullPath);
		}
	}
	return files;
}

/**
 * Fixes MDX issues in static docs (copied by DocParser): backslash in github URLs,
 * <-- arrows, <email> in prose, {obj} expressions. Applied to all docs after JSON conversion.
 */
function fixStaticDocsContent(content) {
	let result = content;
	result = result.replace(/^github: ([^\n]+)$/gm, (_, url) => `github: ${url.replace(/\\/g, '/')}`);
	result = result.replace(/<--/g, '&lt;--');
	result = result.replace(/<([^\s<>'"]+@[^\s<>'"]+)>/g, '&lt;$1&gt;');
	result = escapeMdxExpressions(result);
	return result;
}

function fixAllStaticDocs() {
	const docsDir = path.join(process.cwd(), 'docs');
	if (!fs.existsSync(docsDir)) return;

	const files = getAllDocFiles(docsDir);
	let modified = 0;
	for (const file of files) {
		const content = fs.readFileSync(file, 'utf8');
		const fixed = fixStaticDocsContent(content);
		if (fixed !== content) {
			fs.writeFileSync(file, fixed, 'utf8');
			modified++;
			console.log(`Fixed: ${path.relative(process.cwd(), file)}`);
		}
	}
	if (modified > 0) {
		console.log(`\nFixed ${modified} static doc file(s).`);
	}
}

const jsonFiles = getAllJsonFiles('src/pages/docs/modules');
for (const file of jsonFiles) {
	main(file);
}

fixAllStaticDocs();
