/**
 * Documentation.js JSON to MDX Converter
 * Converts documentation.js output to MDX format for Astro
 */

import fs from 'fs';
import path from 'path';

import ParametersSection from '../src/components/ParametersSection/ParametersSection.js';

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

/**
 * Generates MDX content for parameters with tabs
 */
function generateParametersTabs(params) {
	if (!params || params.length === 0) return '';

	let mdx = '';
	mdx += '<Tabs>\n';

	params.forEach((param, index) => {
		const paramName = param.name || `param${index}`;
		const paramType = typeToString(param.type);
		const isOptional = param.type && param.type.type === 'OptionalType';
		const description = param.description ? mdastToMarkdown(param.description) : '';

		mdx += `  <TabItem label="${paramName}">\n`;
		mdx += `    **Type:** \`${paramType}\`${isOptional ? ' *(optional)*' : ''}\n\n`;
		if (description) {
			mdx += `    ${description.trim()}\n`;
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
	let mdx = '<div style={{display: "flex", flexDirection: "column", padding: "12px"}}>\n';
	mdx += `<Badge style={{borderRadius: "6px 6px 0 0", border: "none", backgroundColor: "#ff9800", width: "fit-content"}} text="Returns" variant="success" />\n`;
	mdx +='<div style={{borderRadius: "0 0 6px 6px", borderTop: "1px solid #ff9800", backgroundColor: "rgba(255, 152, 0, .2)", padding: "12px"}}>\n';

	returns.forEach(ret => {
		const returnType = typeToString(ret.type);
		const description = ret.description ? mdastToMarkdown(ret.description) : '';

		mdx += `<dt style={{color: "${getPropertyTypeColor(returnType)}", margin: 0, fontWeight: 500}}>${returnType}</dt>\n\n`;
		if (description) {
			mdx += `${description.trim()}\n\n`;
		}
	});

	mdx += '</div>\n\n</div>\n\n';
	return mdx;
}

/**
 * Generates MDX content for params section
 * @param params
 * @returns {string}
 */
function generateParamsSection(params) {
	let mdx = '';
	// let mdx = '<div style={{display: "flex", flexDirection: "column"}}>\n';
	// mdx += '<Badge style={{borderRadius: "6px 6px 0 0", border: "none", backgroundColor: "#9acd32", width: "fit-content"}} text="1 Param" variant="success" />\n';
	// mdx +='<div style={{borderRadius: "0 0 6px 6px", borderTop: "1px solid #9acd32", backgroundColor: "rgba(154, 205, 50, .2)", padding: "12px"}}>\n';
	//
	// params.forEach(param => {
	// 	const paramType = typeToString(param.type);
	// 	const description = param.description ? mdastToMarkdown(param.description) : '';
	//
	// 	mdx += `<dt style={{color: "#9acd32", margin: 0, fontWeight: 500}}>${param?.name || ''}</dt> ${paramType}\n\n`;
	// 	if (description) {
	// 		mdx += `${description.trim()}\n\n`;
	// 	}
	// });
	//
	// mdx += '</div>\n\n</div>\n\n';

	mdx += `${ParametersSection(params)}\n`;
	return mdx;
}

/**
 * Get property type color
 */
function getPropertyTypeColor(type) {
	switch (type) {
		case 'Array':
			return '#53c79d';
		case 'Boolean':
			return '#ff44b5';
		case 'Function':
			return '#f5a623';
		case 'Module':
			return '#7ed321';
		case 'Number':
			return '#4be0de';
		case 'Object':
			return '#a8a8a8';
		case 'String':
			return '#f55';
		default:
			return '#a8a8a8';
	}
}

/**
 * Generates MDX content for properties
 */
function generatePropertiesSection(properties) {
	if (!properties || properties.length === 0) return '';

	let mdx = '\n';

	properties.forEach((prop, index) => {
		const propName = prop.name || `property${index}`;
		const propType = typeToString(prop.type).split('|');
		const description = prop.description ? mdastToMarkdown(prop.description) : '';
		const defaultValue = prop.tags.length && prop.tags.find(tag => tag.title === 'default');

		mdx += "<div style={{display: 'flex', alignItems: 'center'}}>\n";
		mdx += "<div style={{flex: '0.4', textAlign: 'center'}}>\n";
		mdx += `<h5 style={{color: '#5582ff', fontWeight: '500'}}>${propName}</h5>\n`;

		propType.forEach(type => {
			mdx += `<Badge text={"${type.trim()}"} size="small" style={{color: "${getPropertyTypeColor(type.trim())}", backgroundColor: 'transparent', border: 'none'}} />\n`;
		});
		mdx += "</div>\n";

		// Generates properties description
		if (description) {
			mdx += "<div style={{flex: '1'}}>\n";
			mdx += `${description.trim()}\n\n`;

			if (defaultValue) {
				let description = defaultValue.description;
				const isLink = description.includes('link');
				if (isLink) {
					const link = description.replace('{@link', '').replace('}', '');
					description = mdastToMarkdown(link);
				}
				mdx += `&emsp;***Default:*** ${description}\n`;
			}

			mdx += '</div>\n';
		}

		if (defaultValue) {

		}
		mdx += "</div>\n\n";

		if (index < properties.length - 1) mdx += '---\n';
	});

	return mdx;
}

/**
 * Generates MDX content for examples
 */
function generateExamplesSection(examples) {
	if (!examples || examples.length === 0) return '';

	let mdx = '\n## Examples\n\n';

	examples.forEach((example) => {
		if (example.description) {
			mdx += mdastToMarkdown(example.description);
		}
		if (example.caption) {
			mdx += `### ${example.caption}\n\n`;
		}
	});

	return mdx;
}

/**
 * Generates MDX for a single member
 *
 * @param member
 * @param level
 * @param isHoC
 * @param isFunction
 * @returns {string}
 */
function generateMemberMDX(member, level = 2, isHoC = false, isFunction = false) {
	const heading = '#'.repeat(level);
	let mdx = '';

	// Title and type of the component
	const badgeType = isHoC ? 'High-Order Component' : isFunction ? 'Function' : 'Component';
	const badgeColor = getPropertyTypeColor(badgeType);
	const badge = `<Badge text="${badgeType}" size="medium" style={{border: 'none', backgroundColor: 'transparent', color: '${badgeColor}', fontWeight: '500'}} />`;
	// const accessBadge = member.access === 'private' ? '<Badge text="private" variant="danger" />' :
	// 	member.access === 'protected' ? '<Badge text="protected" variant="caution" />' : '';

	mdx += `${heading} ${member.name || 'Untitled'}&ensp;${badge}\n\n`;
	mdx += '<div style={{borderBottom: \'2px solid\'}} />\n\n';
	// if (kindBadge || accessBadge) {
	// 	mdx += `${kindBadge} ${accessBadge}\n\n`;
	// }

	// Function Usage
	if (isFunction) {
		mdx += generateModuleFunctionUsageMDX(member.name);

		// Parameters
		mdx += '<div style={{display: "flex"}}>';
		if (member.params && member.params.length) {
			mdx += generateParamsSection(member.params);
		}

		// Returns
		if (member.returns && member.returns.length) {
			mdx += generateReturnsSection(member.returns);
		}
		mdx += '</div>\n';
	}

	// Description
	if (member.description) {
		mdx += mdastToMarkdown(member.description);
	}

	// Module Imports
	if (!isFunction) {
		mdx += generateModuleImportsMDX(member.name, member.memberof);
	}

	// Module Schema
	mdx += generateModuleSchema(isHoC, member.tags);

	// Properties
	if (member.members && member.members.instance && member.members.instance.length > 0) {
		mdx += `\n<h5 style={{borderBottom: '1px solid', color: '#ff9800', fontSize: '90%', fontWeight: '400'}}>Properties ${isHoC ? 'added to wrapped component' : ''}</h5>\n\n\n`;
		mdx += generatePropertiesSection(member.members.instance);
	}

	// // Properties
	// if (member.properties && member.properties.length > 0) {
	// 	mdx += generatePropertiesSection(member.properties);
	// }
	//

	//
	// Examples
	if (member.examples && member.examples.length > 0) {
		mdx += generateExamplesSection(member.examples);
	}
	//
	// // See also
	// if (member.sees && member.sees.length > 0) {
	// 	mdx += '\n### See Also\n\n';
	// 	member.sees.forEach(see => {
	// 		mdx += `- ${mdastToMarkdown(see.description || see)}\n`;
	// 	});
	// 	mdx += '\n';
	// }
	//
	// // Throws
	// if (member.throws && member.throws.length > 0) {
	// 	mdx += '\n### Throws\n\n';
	// 	member.throws.forEach(throwItem => {
	// 		const throwType = typeToString(throwItem.type);
	// 		const description = throwItem.description ? mdastToMarkdown(throwItem.description) : '';
	// 		mdx += `- **${throwType}**: ${description.trim()}\n`;
	// 	});
	// 	mdx += '\n';
	// }

	return mdx;
}

/**
 * Generate module imports
 *
 * @param title
 * @param moduleName
 * @returns {string}
 */
function generateModuleImportsMDX(title, moduleName) {
	let mdx = '';
	const importName = moduleName.split('/').at(-1) !== title ? `{${title}}` : title;
	const code = `import ${importName} from '@enact/${moduleName}';`;
	mdx += '<Aside title="Import Usage" icon="seti:react">\n';
	mdx += `<Code code={"${code}"} lang="js" />\n`;
	mdx += '</Aside>\n';
	return mdx;
}

/**
 *
 * @param title
 * @param params
 * @param returns
 * @returns {string}
 */
function generateModuleFunctionUsageMDX(title, params, returns) {
	let mdx = '';
	const code = `${title}( ${params} ) -> ${returns}`;
	mdx += `<Code code={"${code}"} lang="js" />\n`;
	return mdx;
}


/**
 * Generate Member Schema
 */
function generateModuleSchema(isHoC, tags) {
	let mdx = '';
	if (isHoC) {
		tags.forEach(tag => {
			if (tag.title === 'mixes') {
				mdx += `*Includes*: ${generateMDXLink(tag.name)}<br/>`;
			}
		});
	} else {
		tags.forEach(tag => {
			if (tag.title === 'extends') {
				mdx += `*Extends*: ${generateMDXLink(tag.name)}<br/>`;
			}
			if (tag.title === 'mixes') {
				mdx += `*Wrapped with*: ${generateMDXLink(tag.name)}<br/>`;
			}
		});
	}

	return mdx;
}

/**
 * Generate MDX link
 */
function generateMDXLink(link) {
	return `[${link}](#${link.split('.').at(-1).toLowerCase()})`;
}

/**
 * Generate Frontmatter
 */
function generateFrontmatterMDX(title, moduleName, baseUrl) {
	let mdx = '---\n';
	mdx += `title: ${title}\n`;
	mdx += `headerTitle: ${moduleName}\n`;
	mdx += `description: API documentation for ${moduleName}\n`;
	mdx += 'head:\n';
	mdx += '  - tag: title\n';
	mdx += `    content: ${moduleName} | Enact\n`;
	mdx += `button:\n  label: Edit on GitHub\n  href: ${baseUrl}\n`;
	mdx += '---\n\n';
	return mdx;
}

/**
 * Generate Components imports
 */
function generateComponentsImportsMDX() {
	let mdx = '';
	// Imports for Astro components
	mdx += 'import {Aside, Badge, Code, Tabs, TabItem} from \'@astrojs/starlight/components\';\n';
	// Import for Live Preview
	mdx += 'import {LivePreview} from \'@livePreview\';\n\n';
	return mdx;
}

/**
 * Generates complete MDX document from JSON
 */
function generateMDX(jsonData) {
	if (!Array.isArray(jsonData) || jsonData.length === 0) {
		throw new Error('Invalid JSON data: expected non-empty array');
	}

	let mdx = '';
	const rootModule = jsonData[0];
	const title = rootModule.name?.split('/')[1];
	const moduleName = rootModule.name || 'API Documentation';
	const theme = moduleName?.split('/')[0];
	let baseUrl = 'https://github.com/enactjs/';

	if (theme === 'ui') {
		baseUrl += `enact/tree/develop/packages/${moduleName}`;
	} else {
		baseUrl += `${theme}/tree/develop/${title}`;
	}

	// Frontmatter
	mdx += generateFrontmatterMDX(title, moduleName, baseUrl);
	// Components Imports
	mdx += generateComponentsImportsMDX();

	if (rootModule.description) {
		mdx += mdastToMarkdown(rootModule.description);
		mdx += generateModuleImportsMDX(title, moduleName);
	}

	// Code Example
	const codeExample = rootModule.tags.filter(tag => tag.title === 'example');
	if (codeExample.length > 0) {
		const code = codeExample[0].description.replace(/[\n\r\t]/g, '').replace(/'/g, '"');
		mdx += `<LivePreview client:only code={'${code}'} name={"${moduleName.split('/')[0]}"} />\n\n`;
	}

	// Process all static members
	if (rootModule.members && rootModule.members.static) {
		mdx += '\n## Members\n\n';

		// Extract members
		const members = [];
		rootModule.members.static.forEach(member => {
			members.push(member);
		});
		members.sort((a, b) => a.name.localeCompare(b.name));

		// // Functions
		// if (functions.length > 0) {
		// 	mdx += '\n## Functions\n\n';
		// 	functions.forEach(func => {
		// 		mdx += generateMemberMDX(func, 3);
		// 	});
		// }

		if (members.length > 0) {
			members.forEach((member, index) => {
				const isHoC = member?.tags.find(tag => tag.title === 'hoc');
				const isFunction = member?.tags.find(tag => tag.title === 'function');
				mdx += generateMemberMDX(member, 3, isHoC, isFunction);

				// // Module Properties
				// if (cls.members && cls.members.instance && cls.members.instance.length > 0) {
				// 	mdx += `\n<h5 style={{borderBottom: '1px solid', color: '#ff9800', fontSize: '90%', fontWeight: '400'}}>Properties ${isHoC ? 'added to wrapped component' : ''}</h5>\n\n\n`;
				// 	cls.members.instance.forEach(member => {
				// 		mdx += generateMemberMDX(member, 5);
				// 	});
				// }
				//
				// // Class static members
				// if (cls.members && cls.members.static && cls.members.static.length > 0) {
				// 	mdx += '\n#### Static Members\n\n';
				// 	cls.members.static.forEach(member => {
				// 		mdx += generateMemberMDX(member, 5);
				// 	});
				// }
				if (index < members.length - 1) mdx += '\n\n---\n\n';
			});
		}
		//
		// if (members.length > 0) {
		// 	members.forEach(constant => {
		// 		mdx += generateMemberMDX(constant, 4);
		// 	});
		// }
		//
		// // Type Definitions
		// if (typedefs.length > 0) {
		// 	mdx += '\n## Type Definitions\n\n';
		// 	typedefs.forEach(typedef => {
		// 		mdx += generateMemberMDX(typedef, 4);
		// 	});
		// }
		//
		// // Others
		// if (others.length > 0) {
		// 	mdx += '\n## Other Exports\n\n';
		// 	others.forEach(other => {
		// 		mdx += generateMemberMDX(other, 4);
		// 	});
		// }
	}

	return mdx;
}

function transformIndexPath(filePath) {
	const parentDir = path.dirname(filePath);
	const parentName = path.basename(parentDir);
	const ext = path.extname(filePath);

	return path.join(
		path.dirname(parentDir),
		`${parentName.charAt(0).toLowerCase()}${parentName.slice(1)}${ext}`
	);
}


/**
 * Main execution
 */
export function main(inputFile) {
	const output = inputFile.replace('data\\pages', 'src\\content\\docs');
	const outputFile = transformIndexPath(output).replace(/\.json$/, '.mdx');

	try {
		// Read JSON file
		const jsonContent = fs.readFileSync(inputFile, 'utf8');
		const jsonData = JSON.parse(jsonContent);

		// Generate MDX
		const mdxContent = generateMDX(jsonData);

		// Write MDX file
		fs.mkdirSync(path.dirname(outputFile), {recursive: true});
		fs.writeFileSync(outputFile, mdxContent, 'utf8');

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

const jsonFiles = getAllJsonFiles('data/pages/modules');
for (const file of jsonFiles) {
	main(file);
}
