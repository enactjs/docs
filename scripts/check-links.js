import {execSync} from 'child_process';

try {
	execSync('npm run build', {
		stdio: 'inherit',
		env: {
			...process.env,
			CHECK_LINKS: 'true'
		}
	});
} catch (error) {
	console.error('Build failed:', error.message);
	process.exit(1);
}