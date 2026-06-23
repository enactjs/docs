import {execSync} from 'child_process';

const SKIP_PATTERNS = [
	'^https?://',
	'^mailto:'
];

try {
	console.log('Building site...');
	execSync('npm run build', {stdio: 'inherit'});

	console.log('\nChecking links in dist/...');
	execSync(
		`npx linkinator ./dist --recurse --skip "${SKIP_PATTERNS.join('|')}"`,
		{stdio: 'inherit'}
	);
} catch (error) {
	console.error('Link check failed:', error.message);
	process.exit(1);
}
