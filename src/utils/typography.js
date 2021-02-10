import Typography from 'typography';
import CodePlugin from 'typography-plugin-code';

// Gatsby code highlight stylings below borrowed from https://github.com/gatsbyjs/gatsby/blob/561d33e2e491d3971cb2a404eec9705a5a493602/www/src/utils/typography.js
// Used under the MIT License
// Copyright (c) 2015 gatsbyjs

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
		},
		// gatsby-remark-prismjs styles
		'.gatsby-highlight': {
			background: 'rgba(0,0,0,0.04)',
			position: 'relative',
			WebkitOverflowScrolling: 'touch'
		},
		".gatsby-highlight pre[class*='language-']": {
			backgroundColor: 'transparent',
			border: 0,
			padding: '1.5rem 0',
			WebkitOverflowScrolling: 'touch'
		},
		".gatsby-highlight pre[class*='language-']::before": {
			background: '#ddd',
			borderRadius: '0 0 2px 2px',
			color: 'black',
			// fontSize: fontSizes[0],
			// fontFamily: fonts.monospace.join(`,`),
			// letterSpacing: letterSpacings.tracked,
			lineHeight: '1',
			padding: '1px 4px',
			position: 'absolute',
			left: '1.5rem',
			textAlign: 'right',
			textTransform: 'uppercase',
			top: '0'
		},
		".gatsby-highlight pre[class='language-javascript']::before": {
			content: '\'js\'',
			background: '#f7df1e'
		},
		".gatsby-highlight pre[class='language-js']::before": {
			content: '\'js\'',
			background: '#f7df1e'
		},
		".gatsby-highlight pre[class='language-jsx']::before": {
			content: '\'jsx\'',
			background: '#61dafb'
		},
		".gatsby-highlight pre[class='language-graphql']::before": {
			content: '\'GraphQL\'',
			background: '#E10098',
			color: 'white'
		},
		".gatsby-highlight pre[class='language-html']::before": {
			content: '\'html\'',
			background: '#005A9C',
			color: 'white'
		},
		".gatsby-highlight pre[class='language-css']::before": {
			content: '\'css\'',
			background: '#ff9800',
			color: 'white'
		},
		".gatsby-highlight pre[class='language-mdx']::before": {
			content: '\'mdx\'',
			background: '#f9ac00',
			color: 'white',
			fontWeight: '400'
		},
		".gatsby-highlight pre[class='language-shell']::before": {
			content: '\'shell\''
		},
		".gatsby-highlight pre[class='language-sh']::before": {
			content: '\'sh\''
		},
		".gatsby-highlight pre[class='language-bash']::before": {
			content: '\'bash\''
		},
		".gatsby-highlight pre[class='language-yaml']::before": {
			content: '\'yaml\'',
			background: '#ffa8df'
		},
		".gatsby-highlight pre[class='language-markdown']::before": {
			content: '\'md\''
		},
		".gatsby-highlight pre[class='language-json']::before, .gatsby-highlight pre[class='language-json5']::before": {
			content: '\'json\'',
			background: 'linen'
		},
		".gatsby-highlight pre[class='language-diff']::before": {
			content: '\'diff\'',
			background: '#e6ffed'
		},
		".gatsby-highlight pre[class='language-text']::before": {
			content: '\'text\'',
			background: 'white'
		},
		".gatsby-highlight pre[class='language-flow']::before": {
			content: '\'flow\'',
			background: '#E8BD36'
		},
		'.gatsby-highlight pre code': {
			display: 'block',
			fontSize: '100%',
			lineHeight: 1.5,
			float: 'left',
			minWidth: '100%',
			// reset code vertical padding declared earlier
			padding: '0 1.5rem'
		},
		'.gatsby-highlight-code-line': {
			background: '#feb',
			marginLeft: '-1em',
			marginRight: '-1em',
			paddingLeft: '1em',
			paddingRight: '0.75em',
			borderLeft: '0.25em solid #f99',
			display: 'block'
		},
		'.gatsby-highlight pre::-webkit-scrollbar': {
			// width: space[2],
			// height: space[2],
		},
		'.gatsby-highlight pre::-webkit-scrollbar-thumb': {
			// background: colors.code.scrollbarThumb,
		},
		'.gatsby-highlight pre::-webkit-scrollbar-track': {
			// background: colors.code.border,
		}
	}),
	// scale: 1.618,
	plugins: [
		new CodePlugin()
	]
};

const typography = new Typography(options);

const {rhythm, scale} = typography;

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
	typography.injectStyles();
}

export {rhythm, scale, typography as default};
