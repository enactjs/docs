/* eslint-env node */
/* eslint-disable camelcase */
const path = require('path');

let compareslug = '';
let memberContent = '';
let moduleName = '';

function isNotEmpty(key) {
	if (typeof key === "undefined" || key === null || key === "") {
		return false;
	} else {
		return true;
	}
}

module.exports = {
	pathPrefix: '/',
	siteMetadata: {
		title: 'Enact'
	},
	plugins: [
		{
			resolve: 'gatsby-source-filesystem',
			options: {
				name: 'pages',
				path: path.join(__dirname, 'src', 'pages')
			}
		},
		'gatsby-transformer-documentationjs',
		{
			resolve: 'gatsby-source-filesystem',
			options: {
				name: 'jsdocs',
				path: path.join(__dirname, 'src', 'jsdocs')
			}
		},
		{
			resolve: 'gatsby-transformer-remark',
			options: {
				plugins: [
					{
						resolve: 'gatsby-remark-images',
						options: {
							maxWidth: 690
						}
					},
					{
						resolve: 'gatsby-remark-embed-youtube',
						options: {
							width: 800,
							height: 400
						}
					},
					{
						resolve: 'gatsby-remark-responsive-iframe'
					},
					'gatsby-remark-autolink-headers',
					'gatsby-remark-prismjs',
					'gatsby-remark-copy-linked-files',
					'gatsby-remark-smartypants'
				]
			}
		},
		{
			resolve: 'gatsby-plugin-typography',
			options: {
				pathToConfigModule: 'src/utils/typography.js'
			}
		},
		{
			resolve: `gatsby-plugin-less`,
			options: {
			  cssLoaderOptions: {
				modules: {
					namedExport: false,
				},
			  },
			},
		},
		{
			resolve: `gatsby-plugin-postcss`,
			options: {
			  cssLoaderOptions: {
				modules: {
					namedExport: false,
				},
			  },
			},
		},
		'gatsby-plugin-sharp',
		'gatsby-plugin-catch-links',
		'gatsby-transformer-javascript-frontmatter',
		'gatsby-plugin-react-helmet',
		{
			resolve: `@gatsby-contrib/gatsby-plugin-elasticlunr-search`,
			options: {
			  // Fields to index
			  fields: [`title`, `description`, `memberDescriptions`, `members`],
			  // How to resolve each field`s value for a supported node type
			  resolvers: {
				// For any node of type MarkdownRemark, list how to resolve the fields` values
				MarkdownRemark: {
					id: (node, getNode) => {
						if (isNotEmpty(node.frontmatter.title)) {
							const slug = node.fields.slug;
							const newPath = slug.substring(1, slug.length-1);
							return `${node.frontmatter.title}|${newPath}`;
						} else {
							const documentationJsComponentDescriptionNode = getNode(node.parent);
							const documentationJsNode = getNode(documentationJsComponentDescriptionNode.parent);
							const slug = documentationJsNode.fields.slug;
							const newPath = slug.substring(1, slug.length-1);
							const title = slug.substring(14, slug.length-1);
							const name = documentationJsNode.name;
							if (isNotEmpty(name) && name.includes('/')) {
								compareslug = slug;
								moduleName = name;
								return `${title}|${newPath}`;
							} else {
								moduleName = "";
							}
						}
					},
					title: (node) => {
						if (isNotEmpty(node.frontmatter.title)) {
							return node.frontmatter.title;
						} else {
							if (isNotEmpty(moduleName)) {
								return moduleName;
							}
						}
					},
					description: (node) => {
						if (isNotEmpty(node.frontmatter.title)) {
							return node.internal.content;
						} else {
							if (isNotEmpty(moduleName)) {
								return node.internal.content;
							}
						}
					},
					memberDescriptions: (node, getNode, getNodesByType) => {
						memberContent = "";
						let memberDescriptionContent = "";
						if (!isNotEmpty(node.frontmatter.title) && isNotEmpty(moduleName)) {
							const documentationJSNodes = getNodesByType(`DocumentationJs`);
							documentationJSNodes.forEach( (jsnode) => {
								if (isNotEmpty(jsnode.name) && jsnode.fields.slug.includes(compareslug)) {
									if (isNotEmpty(jsnode.description___NODE) && !jsnode.name.includes('/')) {
										const descNode = getNode(jsnode.description___NODE);
										memberContent += jsnode.name + " ";
										memberDescriptionContent += descNode.internal.content + " ";
									}
								}
							});
							return memberDescriptionContent;
						}
					},
					members: (node) => {
						if (!isNotEmpty(node.frontmatter.title) && isNotEmpty(moduleName)) {
							return memberContent;
						}
					},
				},
			  },
			},
		},
		{
			resolve: 'gatsby-plugin-manifest',
			options: {
				name: 'EnactJS',
				short_name: 'EnactJS',
				start_url: '/',
				background_color: '#fff',
				theme_color: '#5582ff',
				// Enables "Add to Homescreen" prompt and disables browser UI (including back button)
				// see https://developers.google.com/web/fundamentals/web-app-manifest/#display
				display: 'standalone',
				icon: 'src/assets/enact.svg', // This path is relative to the root of the site.
				// An optional attribute which provides support for CORS check.
				// If you do not provide a crossOrigin option, it will skip CORS for manifest.
				// Any invalid keyword or empty string defaults to `anonymous`
				crossOrigin: 'use-credentials',
				include_favicon: false
			}
		},
		'gatsby-plugin-offline'
	]
};
