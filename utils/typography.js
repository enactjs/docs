import Typography from 'typography';
import CodePlugin from 'typography-plugin-code';

const options = {
	// baseFontSize: '1.5em',
	baseLineHeight: 1.5,
	headerFontFamily: [
		'Museo Sans',
		'Helvetica Neue',
		'Segoe UI',
		'Helvetica',
		'Arial',
		'sans-serif'
	],
	bodyFontFamily: [
		'Museo Sans',
		'-apple-system',
		'BlinkMacSystemFont',
		'Segoe UI',
		'Roboto',
		'Oxygen',
		'Ubuntu',
		'Cantarell',
		'Fira Sans',
		'Droid Sans',
		'Helvetica Neue',
		'sans-serif'
	],
	headerGray: 40,
	bodyGray: 40,
	bodyWeight: 300,
	headerWeight: 500,
	boldWeight: 500,
	// scale: 1.618,
	plugins: [
		new CodePlugin()
	]
};

const typography = new Typography(options);

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
	typography.injectStyles();
}

export default typography;
