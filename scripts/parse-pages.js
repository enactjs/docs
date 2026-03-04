import fs from 'fs';
import path from 'path';

/**
 * Generate Frontmatter
 */
function generateFrontmatterMDX(file, title, moduleName, theme) {
	const moduleImport = file.replaceAll('\\', '/');

	let baseUrl = 'https://github.com/enactjs/';
	const themes = ['agate', 'sandstone', 'moonstone']

	if (themes.includes(theme)) {
		baseUrl += `${theme}/tree/develop/${title}`;
	} else {
		baseUrl += `enact/tree/develop/packages/${moduleName}`;
	}

	let mdx = '---\n';
	mdx += `title: ${title}\n`;
	mdx += `headerTitle: ${moduleName}\n`;
	mdx += `layout: '@modulePage'\n`;
	mdx += `docsPath: '/${moduleImport}'\n`;
	mdx += `description: API documentation for ${moduleName}\n`;
	mdx += 'head:\n';
	mdx += '  - tag: title\n';
	mdx += `    content: ${moduleName} | Enact\n`;
	mdx += `button:\n  label: Edit on GitHub\n  href: ${baseUrl}\n`;
	mdx += '---\n\n';

	return mdx;
}

/**
 *
 * @param file
 * @param title
 * @param moduleName
 * @param theme
 */
function generateMdxFile(file, title, moduleName, theme) {
	const output = file.replace('data\\pages', 'src\\content\\docs');
	const outputFile = transformIndexPath(output).replace(/\.json$/, '.mdx');

	let mdxFileContent = '';
	mdxFileContent += generateFrontmatterMDX(file, title, moduleName, theme);

	fs.mkdirSync(path.dirname(outputFile), {recursive: true});
	fs.writeFileSync(outputFile, mdxFileContent, 'utf8');
}

/**
 *
 * @param filePath
 * @returns {string}
 */
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
 *
 * @param dir
 * @param files
 * @returns {*[]}
 */
function getAllJsonFiles(dir, files = []) {
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

function init() {
	const jsonFiles = getAllJsonFiles('data/pages/modules');

	for (const file of jsonFiles) {
		try {
			// const output = file.replace('data\\pages', 'src\\content\\docs').replace(/\.json$/, '.astro');
			// const outputFile = transformIndexPath(output).replace(/\.json$/, '.astro');

			// Read JSON file
			const jsonContent = fs.readFileSync(file, 'utf8');
			const jsonData = JSON.parse(jsonContent);

			if (!Array.isArray(jsonData) || jsonData.length === 0) {
				throw new Error('Invalid JSON data: expected non-empty array');
			}

			const title = jsonData[0].name?.split('/')[1] || jsonData[0].name;
			const moduleName = jsonData[0].name || 'API Documentation';
			const theme = moduleName?.split('/')[0];

			// generateAstroFile(file);
			generateMdxFile(file, title, moduleName, theme);
		} catch (error) {
			console.error('Error:', error.message);
			process.exit(1);
		}
	}
}

init();