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
			return `[${linkText}](${normalizeDocHref(node.url)})`;

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

	const count = params.length;
	const label = count === 1 ? '1 Param' : `${count} Params`;

	let mdx = `    <h6>${label}</h6>\n`;
	mdx += '    <dl>\n';

	params.forEach((param, index) => {
		const name = param.name || `param${index}`;
		const typeStr = typeToString(param.type);
		const isOptional =
			(param.type && param.type.type === 'OptionalType') ||
			param.optional === true;
		let description = param.description ? mdastToMarkdown(param.description) : '';
		if (description) description = description.trim();

		mdx += `      <dt>\`${escapeHtml(name)}\``;
		if (typeStr) {
			mdx += ` ${renderTypeSpans(typeStr)}`;
		}
		if (isOptional) {
			mdx += ' <span className="api-param-optional">optional</span>';
		}
		mdx += '</dt>\n';

		if (description) {
			mdx += `      <dd>${description}</dd>\n`;
		}
	});

	mdx += '    </dl>\n';

	params.forEach((param, index) => {
		if (param.properties && param.properties.length > 0) {
			const baseName = param.name || `param${index}`;
			mdx += `    <h6>Object keys for ${escapeHtml(baseName)}</h6>\n`;
			mdx += '    <dl>\n';

			param.properties.forEach((prop, pIndex) => {
				const keyName = prop.name || `key${pIndex}`;
				const typeStr = prop.type ? typeToString(prop.type) : '';
				let description = prop.description ? mdastToMarkdown(prop.description) : '';
				if (description) description = description.trim();

				mdx += `      <dt>\`${escapeHtml(keyName)}\``;
				if (typeStr) {
					mdx += ` ${renderTypeSpans(typeStr)}`;
				}
				mdx += '</dt>\n';

				if (description) {
					mdx += `      <dd>${description}</dd>\n`;
				}
			});

			mdx += '    </dl>\n';
		}
	});

	return mdx;
}

function generateFunctionSummary(member) {
	const name = member.name || 'anonymous';
	const params = (member.params || []).map(param => {
		const pName = param.name || 'param';
		const isOptional =
			(param.type && param.type.type === 'OptionalType') ||
			param.optional === true;
		return isOptional ? `{${pName}}` : pName;
	}).join(', ');

	const sig = params ? `${name}( ${params} )` : `${name}()`;

	let returnType = 'undefined';
	if (member.returns && member.returns.length > 0 && member.returns[0].type) {
		returnType = typeToString(member.returns[0].type);
	}

	const summary = `${sig}${returnType ? returnType : ''}`;
	return escapeMdxCurly(escapeHtml(summary));
}

/**
 * Generates MDX content for returns section
 */
function generateReturnsSection(returns) {
	if (!returns || returns.length === 0) return '';

	let mdx = '    <h6>Returns</h6>\n';
	mdx += '    <dl>\n';

	returns.forEach(ret => {
		const returnType = typeToString(ret.type);
		const description = ret.description ? mdastToMarkdown(ret.description) : '';

		if (returnType) {
			mdx += `      <dt>${renderTypeSpans(returnType)}</dt>\n`;
		}
		if (description) {
			mdx += `      <dd>${description.trim()}</dd>\n`;
		}
	});

	mdx += '    </dl>\n';

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
	const isConstant = member.kind === 'constant' || member.kind === 'member';

	if (member.kind === 'function') return 'Function';
	if (isHoc) return 'Higher-Order Component';
	if (isFactory) return 'Component Factory';
	if (isClass && isUI) return 'Component';
	if (isConstant && isHoc) return 'Higher-Order Component';
	// Constants whose declared type is Object and that expose properties are rendered as "Object"
	if (isConstant && member.type && typeToString(member.type) === 'Object' && member.properties && member.properties.length > 0) {
		return 'Object';
	}
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
	const normalized = String(mixName).replace(/^@enact\//, '').replace(/^\/+/, '');
	const lastDot = normalized.lastIndexOf('.');
	const modulePath = lastDot >= 0 ? normalized.slice(0, lastDot) : normalized;
	const exportName = lastDot >= 0 ? normalized.slice(lastDot + 1) : normalized.split('/').pop();
	const href = normalizeDocHref(`/docs/${modulePath}#${exportName}`);
	return { href, text: mixName };
}

function normalizeDocHref(href) {
	if (!href || typeof href !== 'string') return href;

	// Preserve external URLs and mail links exactly as-is.
	if (/^(https?:)?\/\//i.test(href) || /^mailto:/i.test(href)) {
		return href;
	}

	let fixed = href.trim();

	// Legacy relative module references used in older docs.
	fixed = fixed.replace(/^(\.\.\/)+modules\//, '/docs/');
	// Legacy absolute references that forgot the /docs prefix.
	fixed = fixed.replace(/^\/developer-guide\//, '/docs/developer-guide/');
	fixed = fixed.replace(/^\/developer-tools\//, '/docs/developer-tools/');
	// Old docs occasionally used ui/Module.Member without a leading slash.
	fixed = fixed.replace(/^ui\/([A-Za-z0-9_-]+)\.[A-Za-z0-9_-]+$/, '/docs/ui/$1/');

	// Convert old module links like /docs/ui/Button.ButtonBase#icon -> /docs/ui/Button#icon.
	fixed = fixed.replace(
		/^\/docs\/([^#\s]+)\.[^/#.\s]+(#.*)?$/,
		(_m, modulePath, hash = '') => `/docs/${modulePath}${hash}`
	);

	// Remove accidental duplicated docs prefix.
	fixed = fixed.replace(/^\/docs\/docs\//, '/docs/');
	fixed = fixed.replace(/^\/docs\/\/docs\//, '/docs/');
	fixed = fixed.replace(/^\/docs\/https?:\/\//i, (m) => m.replace(/^\/docs\//, ''));
	fixed = fixed.replace(/^\/docs\/spotlight\/Spotlight$/, '/docs/spotlight/');

	// Replace accidental double-hash fragments (#foo##foo -> #foo).
	fixed = fixed.replace(/#([^#]+)##[^#]+$/, '#$1');

	// Collapse repeated slashes but keep protocol patterns untouched.
	fixed = fixed.replace(/(^|[^:])\/{2,}/g, '$1/');

	// Docusaurus link checker does not reliably resolve custom HTML id anchors in generated API pages.
	// Keep internal docs navigation stable by dropping fragment parts for /docs/... links.
	if (/^\/docs\/.+#/.test(fixed)) {
		fixed = fixed.replace(/#.*$/, '');
	}

	return fixed;
}

function toLegacyAnchorId(name, fallback = 'member') {
	if (!name || typeof name !== 'string') return fallback;
	return name.trim().replace(/\s+/g, '-');
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
	if (hasRequiredTag) {
		isRequired = true;
	} else if (hasOptionalTag) {
		isRequired = false;
	} else if (defaultValue != null) {
		isRequired = false;
	} else if (member.optional === false) {
		// documentation.js sets optional=false for required params/props
		isRequired = true;
	} else if (member.optional === true) {
		isRequired = false;
	}
	const isOptionalType = member.type && member.type.type === 'OptionalType';
	if (isRequired === null && isOptionalType) {
		isRequired = false;
	}
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
 * For HOCs, the heading matches docs: "Properties added to wrapped component".
 */
function generateInstancePropertiesSection(instanceMembers, moduleName = '', isHoc = false) {
	// Only include true properties (not methods). Methods (tagged with @method or with params/returns)
	// are rendered separately as "Methods" using generateMemberMDX.
	const propsOnly = (instanceMembers || []).filter(m => m && m.name && isInstanceProperty(m));
	if (propsOnly.length === 0) return '';

	const withMeta = propsOnly.map(m => ({ member: m, ...getInstanceMemberDisplayMeta(m) }));
	const requiredFirst = withMeta.filter(m => m.isRequired === true).sort((a, b) => propSort(a.member, b.member));
	const rest = withMeta.filter(m => m.isRequired !== true).sort((a, b) => propSort(a.member, b.member));
	const sorted = [...requiredFirst, ...rest];

	let mdx = '\n<section className="api-properties">\n';
	const heading = isHoc ? 'Properties added to wrapped component' : 'Properties';
	mdx += `<h5>${heading}</h5>\n`;
	mdx += '<dl className="api-dl-properties">\n';

	sorted.forEach(({ member, typeStr, isRequired, defaultValue, description }) => {
		const id = toLegacyAnchorId(member.name, 'property');
		mdx += `<section className="api-property" id="${escapeHtml(id)}">\n`;
		mdx += '  <div className="api-property-title">\n';
		mdx += `    <dt>${escapeHtml(member.name)}</dt>\n`;
		mdx += '    <div className="api-property-types">';
		mdx += renderTypeSpans(typeStr);
		if (isRequired === true) {
			mdx += ' <span className="api-prop-required" title="Required Property" data-tooltip="Required Property">Required</span>';
		}
		mdx += '</div>\n';
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
		const id = toLegacyAnchorId(prop.name, 'property');
		mdx += `<section className="api-property" id="${escapeHtml(id)}">\n`;
		mdx += '  <div className="api-property-title">\n';
		mdx += `    <dt>${escapeHtml(prop.name || '')}</dt>\n`;
		mdx += '    <div className="api-property-types">';
		mdx += renderTypeSpans(typeStr);
		if (isRequired === true) {
			mdx += ' <span className="api-prop-required" title="Required Property" data-tooltip="Required Property">Required</span>';
		}
		mdx += '</div>\n';
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
 * Find the HOC config member: first static member with tag "hocconfig" or name "defaultConfig" when class has @hoc.
 * Same idea as docs renderStaticProperties(isHoc) -> renderHocConfig(properties.static[0]).
 */
function getHocConfigMember(cls) {
	const hasHoc = (cls.tags || []).some(t => t.title === 'hoc');
	if (!hasHoc || !cls.members || !cls.members.static || cls.members.static.length === 0) return null;
	const first = cls.members.static[0];
	const hasHocConfigTag = (first.tags || []).some(t => t.title === 'hocconfig');
	if (hasHocConfigTag && first.members && first.members.static && first.members.static.length > 0) return first;
	if (first.name === 'defaultConfig' && first.members && first.members.static && first.members.static.length > 0) return first;
	return null;
}

/**
 * Generates "Configuration" section for HOC: same structure as Properties but with h5 "Configuration".
 * Renders configMember.members.static (e.g. latinLanguageOverrides, nonLatinLanguageOverrides) like instance properties.
 */
function generateHocConfigurationSection(configStaticMembers, idPrefix = '') {
	if (!configStaticMembers || configStaticMembers.length === 0) return '';
	const withMeta = configStaticMembers.map(m => ({ member: m, ...getPropertyMeta(m) }));
	const requiredFirst = withMeta.filter(m => m.isRequired === true).sort((a, b) => propSort(a.member, b.member));
	const rest = withMeta.filter(m => m.isRequired !== true).sort((a, b) => propSort(a.member, b.member));
	const sorted = [...requiredFirst, ...rest];

	let mdx = '\n<section className="api-properties api-configuration">\n';
	mdx += '<h5>Configuration</h5>\n';
	mdx += '<dl className="api-dl-properties">\n';

	sorted.forEach(({ member, typeStr, isRequired, defaultValue, description }) => {
		const id = toLegacyAnchorId(member.name, 'property');
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

	// Usage (import statement) for classes, constants (e.g. HOCs), and top-level functions.
	// Skip for instance methods (we set isMethod=true when synthesizing them from class members),
	// and for "object-like" constants (Object with nested properties) which docs don't show with an import.
	if (member.memberof && !member.isObjectLike && (member.kind === 'class' || member.kind === 'constant' || (member.kind === 'function' && !member.isMethod))) {
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

	// Parameters + Returns block (styled like docs: colored headers, dl rows)
	const hasParams = member.params && member.params.length > 0;
	const hasReturns = member.returns && member.returns.length > 0;
	if (hasParams || hasReturns) {
		const paramsBlock = hasParams ? generateParametersTabs(member.params) : '';
		const returnsBlock = hasReturns ? generateReturnsSection(member.returns) : '';

		// Single api-method row per member: left column = signature, right column = details
		mdx += '<div className="api-method">\n';

		if (member.kind === 'function') {
			const summary = generateFunctionSummary(member);
			mdx += `  <h6 className="api-method-signature">${summary}</h6>\n`;
		} else {
			mdx += '  <div className="api-method-description"></div>\n';
		}

		mdx += '  <div className="details">\n';

		if (paramsBlock) {
			mdx += '    <div className="params">\n';
			mdx += paramsBlock;

			// Additional breakdown for object-style "options" params, matching docs' "Object keys for options".
			// Look for @param tags whose names are of the form "options.*" on the member.
			const optionKeyTags = (member.tags || []).filter(tag =>
				tag.title === 'param' &&
				typeof tag.name === 'string' &&
				tag.name.indexOf('options.') === 0
			);
			if (optionKeyTags.length > 0) {
				mdx += '    <h6>Object keys for options</h6>\n';
				mdx += '    <dl>\n';

				optionKeyTags.forEach((tag, index) => {
					const fullName = tag.name || `options.key${index}`;
					const keyName = fullName.split('.').slice(1).join('.') || fullName;
					const typeStr = tag.type ? typeToString(tag.type) : '';
					let description = tag.description ? mdastToMarkdown(tag.description) : '';
					if (description) description = description.trim();

					mdx += `      <dt>\`${escapeHtml(keyName)}\``;
					if (typeStr) {
						mdx += ` ${renderTypeSpans(typeStr)}`;
					}
					mdx += '</dt>\n';

					if (description) {
						mdx += `      <dd>${description}</dd>\n`;
					}
				});

				mdx += '    </dl>\n';
			}

			mdx += '    </div>\n';
		}

		if (returnsBlock) {
			mdx += '    <div className="returns">\n';
			mdx += returnsBlock;
			mdx += '    </div>\n';
		}

		mdx += '  </div>\n';
		mdx += '</div>\n\n';
	}

	// Properties: render as a Properties section (no Tabs) for any member with structured properties
	if (member.properties && member.properties.length > 0) {
		const idPrefix = moduleName
			? (moduleName.replace(/\//g, '-').toLowerCase() + '-' + (member.name || '').toLowerCase())
			: '';
		mdx += generateTypedefPropertiesSection(member.properties, idPrefix);
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

		// Group members by kind / role
		const functions = [];
		const classes = [];
		const constants = [];
		const hocs = [];
		const objectConstants = [];
		const typedefs = [];
		const others = [];

		rootModule.members.static.forEach(member => {
			// Higher-Order Components that are emitted as constants/members in JSON
			const varType = getMemberVarType(member);
			const isHocConstant = (member.kind === 'constant' || member.kind === 'member') && varType === 'Higher-Order Component';
			// Constants that are really objects (Object type with nested properties), e.g. unitToPixelFactors
			const isObjectConstant =
				(member.kind === 'constant' || member.kind === 'member') &&
				member.type &&
				typeToString(member.type) === 'Object' &&
				member.properties &&
				member.properties.length > 0;

			if (isHocConstant) {
				hocs.push(member);
				return;
			}
			if (isObjectConstant) {
				// Mark so generateMemberMDX can adjust behavior (no import block, labeled as Object)
				member.isObjectLike = true;
				objectConstants.push(member);
				return;
			}

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

		// Higher-Order Components (HOCs) that are exported as constants/members
		if (hocs.length > 0) {
			mdx += '\n## Higher-Order Components\n\n';
			hocs.forEach(hoc => {
				const result = generateMemberMDX(hoc, 3, moduleName);
				mdx += result.mdx;
			});
		}

		// Classes
		if (classes.length > 0) {
			mdx += '\n### Classes\n\n';
			classes.forEach(cls => {
				const result = generateMemberMDX(cls, 4, moduleName);
				mdx += result.mdx;

				if (cls.members && cls.members.instance && cls.members.instance.length > 0) {
					const idPrefix = `${moduleName.replace(/\//g, '-').toLowerCase()}-${(cls.name || '').toLowerCase()}`;
					const isHoc = (cls.tags || []).some(t => t.title === 'hoc');
					mdx += generateInstancePropertiesSection(cls.members.instance, idPrefix, isHoc);
				}

				if (cls.constructorComment) {
					const ctor = cls.constructorComment;
					const ctorName = cls.name || 'Constructor';
					const returnType = moduleName || ctorName;

					const ctorParams = (ctor.params || []).map(p => p.name || 'param');
					const sig = ctorParams.length
						? `${ctorName}( ${ctorParams.join(', ')} )`
						: `${ctorName}()`;
					const summary = escapeMdxCurly(escapeHtml(`${sig}${returnType}`));

					const ctorDesc = ctor.description
						? mdastToMarkdown(ctor.description)
						: '';

					mdx += '\n#### Constructor\n\n';
					mdx += '<div className="api-method">\n';
					mdx += `  <h6 className="api-method-signature">${summary}</h6>\n`;

					const hasCtorParams = ctor.params && ctor.params.length > 0;
					if (hasCtorParams || ctorDesc) {
						mdx += '  <div className="details">\n';

						if (hasCtorParams) {
							const paramsBlock = generateParametersTabs(ctor.params);
							if (paramsBlock) {
								mdx += '    <div className="params">\n';
								mdx += paramsBlock;
								mdx += '    </div>\n';
							}
						}

						if (ctorDesc) {
							mdx += `    ${ctorDesc.trim()}\n`;
						}

						mdx += '  </div>\n';
					}

					mdx += '</div>\n\n';
				}

				if (cls.members && cls.members.instance && cls.members.instance.length > 0) {
					const instanceMethods = cls.members.instance.filter(m => {
						const tags = m.tags || [];
						const hasMethodTag = tags.some(t => t.title === 'method');
						const looksLikeMethod =
							m.kind === 'function' ||
							(m.params && m.params.length > 0) ||
							(m.returns && m.returns.length > 0);
						return hasMethodTag || looksLikeMethod;
					});
					if (instanceMethods.length > 0) {
						mdx += '\n#### Methods\n\n';
						instanceMethods.forEach(method => {
							const synthetic = {
								...method,
								kind: 'function',
								isMethod: true,
								memberof: `${moduleName}.${cls.name}`,
							};
							const result = generateMemberMDX(synthetic, 5, moduleName);
							mdx += result.mdx;
						});
					}
				}

				const hocConfig = getHocConfigMember(cls);
				if (hocConfig && hocConfig.members && hocConfig.members.static && hocConfig.members.static.length > 0) {
					const idPrefix = `${moduleName.replace(/\//g, '-').toLowerCase()}-${(cls.name || '').toLowerCase()}-config`;
					mdx += generateHocConfigurationSection(hocConfig.members.static, idPrefix);
				}

				if (cls.members && cls.members.static && cls.members.static.length > 0) {
					mdx += '\n#### Static Members\n\n';
					cls.members.static.forEach(member => {
						const memberResult = generateMemberMDX(member, 5, moduleName);
						mdx += memberResult.mdx;
					});
				}
			});
		}

		// Object constants (Object with properties), rendered in their own section
		if (objectConstants.length > 0) {
			mdx += '\n## Objects\n\n';
			objectConstants.forEach(obj => {
				const result = generateMemberMDX(obj, 4, moduleName);
				mdx += result.mdx;
			});
		}

		// Other constants
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
function fixStaticDocsContent(content, relPath) {
	let result = content;
	result = result.replace(/^github: ([^\n]+)$/gm, (_, url) => `github: ${url.replace(/\\/g, '/')}`);
	// JSX in Docusaurus expects style as an object, not HTML string attributes. Strip inline styles from
	// copied legacy markdown HTML blocks to avoid SSG runtime errors.
	result = result.replace(/\sstyle=(['"]).*?\1/g, '');
	result = result.replace(/<--/g, '&lt;--');
	result = result.replace(/<([^\s<>'"]+@[^\s<>'"]+)>/g, '&lt;$1&gt;');
	result = result.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}');
	// IMPORTANT: Do NOT run escapeMdxExpressions on authored docs like docs/api.mdx,
	// because it wraps JSX expressions (e.g. {card.to}) in backticks and breaks MDX.
	// Only apply it to generated API docs under docs/*/index.mdx, which don't contain JSX.
	if (!/^docs\/[^/]+\.mdx?$/.test(relPath)) {
		result = escapeMdxExpressions(result);
	}

	// Normalize legacy links inside authored/static docs with path-aware rules.
	result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label, href) => {
		return `[${label}](${normalizeStaticDocLink(href, relPath)})`;
	});
	result = result.replace(/href=(['"])([^'"]+)\1/g, (_m, q, href) => {
		return `href=${q}${normalizeStaticDocLink(href, relPath)}${q}`;
	});

	return result;
}

function normalizeStaticDocLink(href, relPath) {
	if (!href || typeof href !== 'string') return href;
	let fixed = normalizeDocHref(href);
	const inDevGuide = relPath.startsWith('docs/developer-guide/');
	const inDevToolsCli = relPath.startsWith('docs/developer-tools/cli/');
	const inMigrationEnact = relPath.startsWith('docs/developer-guide/migration/enact/');
	const inMigrationEnyo = relPath.startsWith('docs/developer-guide/migration/enyo/');
	const inSpotlightDocs = relPath.startsWith('docs/developer-guide/spotlight/docs/');
	const inI18nDocs = relPath.startsWith('docs/developer-guide/i18n/docs/');
	const inWebosDocs = relPath.startsWith('docs/developer-guide/webos/docs/');

	if (inDevGuide) {
		fixed = fixed.replace(/^\.\.\/theming\/?$/, '/docs/developer-guide/theming/');
		fixed = fixed.replace(/^\.\.\/\.\.\/developer-tools\/cli\/?$/, '/docs/developer-tools/cli/');
		fixed = fixed.replace(/^\.\.\/\.\.\/developer-tools\/cli\/isomorphic-support\/?$/, '/docs/developer-tools/cli/isomorphic-support/');
		fixed = fixed.replace(/^\.\.\/\.\.\/developer-tools\/cli\/ejecting-apps\/?$/, '/docs/developer-tools/cli/ejecting-apps/');
		fixed = fixed.replace(/^\.\.\/\.\.\/developer-guide\/i18n\/?$/, '/docs/developer-guide/i18n/docs/');
		fixed = fixed.replace(/^\.\.\/\.\.\/developer-guide\/theming\/?$/, '/docs/developer-guide/theming/');
	}

	if (inDevToolsCli) {
		fixed = fixed.replace(/^\.\.\/isomorphic-support\/?$/, './isomorphic-support/');
		fixed = fixed.replace(/^\.\.\/serving-apps\/?$/, './serving-apps/');
		fixed = fixed.replace(/^\.\.\/starting-a-new-app\/?/, './starting-a-new-app/');
		fixed = fixed.replace(/^\.\.\/developing-a-template\/?$/, './developing-a-template/');
	}

	if (inMigrationEnact) {
		fixed = fixed.replace(/^\.\.\/migrating-to-enact-2\/?$/, './migrating-to-enact-2.md');
		fixed = fixed.replace(/^\.\.\/migrating-to-enact-3\/?$/, './migrating-to-enact-3.md');
		fixed = fixed.replace(/^\.\.\/migrating-to-enact-4\/?$/, './migrating-to-enact-4.md');
	}

	if (inMigrationEnyo) {
		fixed = fixed.replace(/^\.\.\/enyo-enact-component-map\/?$/, './enyo-enact-component-map/');
		fixed = fixed.replace(/^\.\.\/\.\.\/spotlight\/#containers$/, '/docs/developer-guide/spotlight/docs/#containers');
		fixed = fixed.replace(/^\.\.\/\.\.\/spotlight\/#spottable$/, '/docs/developer-guide/spotlight/docs/#spottable');
		fixed = fixed.replace(/^\.\.\/\.\.\/spotlight\/#events$/, '/docs/developer-guide/spotlight/docs/#events');
		fixed = fixed.replace(/^\.\.\/\.\.\/webos\/luna-service-api\/?$/, '/docs/developer-guide/webos/docs/luna-service-api/');
		fixed = fixed.replace(/^\/docs\/$/, '/docs/api');
		fixed = fixed.replace(/^\/docs\/redux\/?$/, '/docs/developer-guide/redux/');
		fixed = fixed.replace(/^\/docs\/webos\/luna-service-api\/?$/, '/docs/developer-guide/webos/docs/luna-service-api/');
		fixed = fixed.replace(/^\/docs\/spotlight\/#containers$/, '/docs/developer-guide/spotlight/docs/#containers');
		fixed = fixed.replace(/^\/docs\/spotlight\/#spottable$/, '/docs/developer-guide/spotlight/docs/#spottable');
		fixed = fixed.replace(/^\/docs\/spotlight\/#events$/, '/docs/developer-guide/spotlight/docs/#events');
	}

	fixed = fixed.replace(/^\/docs\/developer-guide\/i18n\/?$/, '/docs/developer-guide/i18n/docs/');

	if (inSpotlightDocs) {
		fixed = fixed.replace(/^\.\.\/\.\.\/modules\/spotlight\/Spottable\/?$/, '/docs/spotlight/Spottable');
		fixed = fixed.replace(/^\.\.\/\.\.\/modules\/spotlight\/SpotlightContainerDecorator\/?$/, '/docs/spotlight/SpotlightContainerDecorator');
	}

	if (inI18nDocs) {
		fixed = fixed.replace(/^\.\.\/$/, './');
	}

	if (inWebosDocs) {
		fixed = fixed.replace(/^\.\.\/luna-service-api\/#example$/, './luna-service-api/#example');
	}

	if (relPath === 'docs/developer-guide/performance.md') {
		fixed = fixed.replace(/^\/docs\/core\/util\/#Job$/, '/docs/core/util/');
		fixed = fixed.replace(/^\/docs\/core\/util\/#perfNow$/, '/docs/core/util/');
	}

	return fixed;
}

function fixAllStaticDocs() {
	const docsDir = path.join(process.cwd(), 'docs');
	if (!fs.existsSync(docsDir)) return;

	const files = getAllDocFiles(docsDir);
	let modified = 0;
	for (const file of files) {
		const content = fs.readFileSync(file, 'utf8');
		const relPath = path.relative(process.cwd(), file).replace(/\\/g, '/');
		const fixed = fixStaticDocsContent(content, relPath);
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
