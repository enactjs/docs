/**
 * Converts MDAST (Markdown AST) to plain text/markdown string
 *
 * @param node
 * @param inList
 * @returns {*|string|string}
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
			return `\`\`\`js\n${node.value}\n\`\`\`\n\n`;

		case 'link':
			const linkText = node.children ? node.children.map(c => mdastToMarkdown(c, inList)).join('') : '';
			// Handle JSDoc links differently
			if (node.jsdoc) {
				return `[${linkText}](#${node.url.split('.').at(-1).toLowerCase()})`;
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
 * Converts type expression to readable string
 *
 * @param type
 * @returns {*|string}
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
			return type.elements.map(typeToString).join(' | ');
		case 'ArrayType':
			return `${typeToString(type.elements[0])}[]`;
		case 'TypeApplication':
			const base = typeToString(type.expression);
			const params = type.applications.map(typeToString).join(', ');
			return `${base}(${params})`;
		case 'FunctionType':
			return 'Function';
		case 'AllLiteral':
			return 'Any';
		case 'NullableLiteral':
			return 'null';
		case 'RestType':
			return `...${typeToString(type.expression)}`;
		case 'UndefinedLiteral':
			return 'undefined';
		default:
			return 'any';
	}
}

export {mdastToMarkdown, typeToString};