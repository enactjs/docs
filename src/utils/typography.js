import Typography from 'typography';
import CodePlugin from 'typography-plugin-code';

const options = {
	// baseFontSize: '1.5em',
	baseLineHeight: 1.5,
	headerFontFamily: [
		'EnactMuseoSans',
		'Museo Sans',
		'Helvetica Neue',
		'Segoe UI',
		'Helvetica',
		'Arial',
		'sans-serif'
	],
	bodyFontFamily: [
		'EnactMuseoSans',
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
	headerWeight: 300,
	boldWeight: 500,
	overrideStyles: () => ({
		hr: {
			marginTop: '2em',
			marginBottom: '2em'
		}
	}),
	// scale: 1.618,
	plugins: [
		new CodePlugin()
	]
};

const typography = new Typography(options);

const { rhythm, scale } = typography;

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
	typography.injectStyles();
}

export { rhythm, scale, typography as default };
