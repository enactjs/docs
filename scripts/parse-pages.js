import fs from 'fs';
import path from 'path';

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

function generateAstroFile(file) {
	let astroFileContent = '';
	astroFileContent += '---\n';
	astroFileContent += `import moduleData from "./${file}";\n\n`;
	astroFileContent += `import Page from "@modulePages";\n`;
	astroFileContent += `---\n\n`;
	astroFileContent += `<Page data={moduleData} />\n`;
	return astroFileContent;
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

function init() {
	getAllJsonFiles('data/pages/modules').forEach((file) => {
		try {
			const output = file.replace('data\\pages', 'src\\content\\docs');
			const outputFile = transformIndexPath(output).replace(/\.json$/, '.astro');

			const astroFile = generateAstroFile(file);

			fs.mkdirSync(path.dirname(outputFile), {recursive: true});
			fs.writeFileSync(outputFile, astroFile, 'utf8');
		} catch (error) {
			console.error('Error:', error.message);
			process.exit(1);
		}
	});
}

init();