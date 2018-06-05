const ILibPlugin = require('ilib-webpack-plugin');
const GracefulFSPlugin = require('graceful-fs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const _ = require('lodash');
const crypto = require('crypto');
const path = require('path');

exports.modifyWebpackConfig = ({config, stage}) => {
	const cssModulesConf = 'css?modules&minimize&importLoaders=1';
	const cssModulesConfDev = `${cssModulesConf}&sourceMap&localIdentName=[name]---[local]---[hash:base64:5]`;

	config.loader('js', cfg => {
		cfg.exclude = /(node_modules.(?!@enact|buble)|bower_components)/;
		return cfg;
	});
	config.loader('css', cfg => {
		cfg.exclude = /(enact\/.*|\.module)\.css$/;
		return cfg;
	});
	config.loader('less', cfg => {
		cfg.test = /\.less$/
		cfg.exclude = /(enact\/.*|\.module)\.less$/;
		if (stage === 'develop') {
			cfg.loaders = ['style', cssModulesConfDev, 'postcss', 'less'];
		} else {
			cfg.loader = ExtractTextPlugin.extract('style',
				'css?-autoprefixer&modules&importLoaders=1&localIdentName=[name]__[local]---[hash:base64:5]!postcss!less');
		}
		return cfg;
	});
	config.loader('enact-css', function (cfg) {
		cfg.test = /enact\/.*\.(c|le)ss$/;
		if (stage === 'develop') {
			cfg.loaders = ['style', cssModulesConfDev, 'postcss', 'less'];
		} else {
			cfg.loader = ExtractTextPlugin.extract('style',
				'css?-autoprefixer&modules&importLoaders=1&localIdentName=[name]__[local]---[hash:base64:5]!postcss!less');
		}
		return cfg;
	});
	config.merge({
		devtool: (stage.indexOf('develop') >= 0 ? 'source-map' : false),
		postcss: function () {
			return [
				autoprefixer({
					browsers: [
						'>1%',
						'last 4 versions',
						'Firefox ESR',
						'not ie < 9' // React doesn't support IE8 anyway
					]}
				)
			];
		}
	});
	config.plugin('ilib', ILibPlugin);
	config.plugin('gracefulfs', GracefulFSPlugin);
	config.plugin('defineenv', () => new webpack.DefinePlugin({
		'process.env': {
			'NODE_ENV': JSON.stringify((stage.indexOf('develop') >= 0 ? 'development' : 'production'))
		}
	}));
	config.plugin('ignore', () => new webpack.IgnorePlugin(/^(xor|props)$/));

	return config;
};

function createSlug({relativePath}) {
	let slug;
	const parsedFilePath = path.parse(relativePath);
	if (parsedFilePath.name !== 'index' && parsedFilePath.dir !== '') {
		slug = `/${parsedFilePath.dir}/${parsedFilePath.name}/`;
	} else if (parsedFilePath.dir === ``) {
		slug = `/${parsedFilePath.name}/`;
	} else {
		slug = `/${parsedFilePath.dir}/`;
	}
	return slug;
}

async function onCreateNode ({ node, boundActionCreators, getNode, loadNodeContent }) {
	const { createNodeField, createNode, createParentChildLink } = boundActionCreators;
	let slug;
	if (node.internal.type === 'MarkdownRemark') {
		const fileNode = getNode(node.parent);
		slug = createSlug(fileNode);

		// Add slug as a field on the node.
		createNodeField({ node, name: `slug`, value: slug });
	} else if (node.internal.mediaType === 'application/json') {
		const content = await loadNodeContent(node);
		const parsedContent = JSON.parse(content);
		const packedContent = JSON.stringify(parsedContent);

		const contentDigest = crypto.
			createHash(`md5`).
			update(packedContent).
			digest(`hex`);
		
		const jsonNode = {
			id: parsedContent.id ? parsedContent.id : `${node.id} >>> JSON`,
			parent: node.id,
			children: [],
			internal: {
				contentDigest,
				content: packedContent,
				type: 'JsonDoc'
			}
		};

		slug = createSlug(node);

		createNode(jsonNode);
		createParentChildLink({parent: node, child: jsonNode});
		// Add slug as a field on the node.
		createNodeField({ node: jsonNode, name: `slug`, value: slug });
	}
	if (node.internal.mediaType === 'application/javascript') {
		slug = createSlug(node);

		createNodeField({ node, name: `slug`, value: slug });
	}
};

exports.onCreateNode = onCreateNode;

exports.createPages = ({ graphql, boundActionCreators }) => {
	const { createPage } = boundActionCreators;

	return new Promise((resolve, reject) => {
		const pages = [];
		const markdownPage = path.resolve('src/templates/markdown.js');
		const jsonPage = path.resolve('src/templates/json.js');
		// Query for all markdown "nodes" and for the slug we previously created.
		resolve(
			graphql(
				`
					{
						allMarkdownRemark {
							edges {
								node {
									frontmatter {
										title
									}
									fields {
										slug
									}
								}
							}
						},
						allJsonDoc {
							edges {
								node {
									fields {
										slug
									}
								}
							}
						}
					}
				`
			).then(result => {
				if (result.errors) {
					console.log(result.errors);
					reject(result.errors);
				}

				// Create markdown pages.
				result.data.allMarkdownRemark.edges.forEach(edge => {
					const layout = edge.node.fields.slug.match(/^\/docs\/.*\//) ? 'docs' : 'index';
					createPage({
						path: edge.node.fields.slug, // required
						component: markdownPage,
						layout,
						context: {
							slug: edge.node.fields.slug,
							title: edge.node.frontmatter.title,
						},
					});
				});

				// Create JSON pages.
				result.data.allJsonDoc.edges.forEach(edge => {
					createPage({
						path: edge.node.fields.slug, // required
						component: jsonPage,
						layout: 'docs',
						context: {
							slug: edge.node.fields.slug,
							title: edge.node.fields.slug.replace(/\/docs\/modules\/(.*)\//, '$1')
						},
					});
				});

				return;
			})
		);
	});
};

exports.onCreatePage = async ({ page, boundActionCreators }) => {
	const { createPage, deletePage } = boundActionCreators;

	return new Promise((resolve, reject) => {
		if (page.path.match(/^\/docs\/.*\//)) {
			const oldPage = Object.assign({}, page);
			page.layout = 'docs';

			// Update the page.
			deletePage(oldPage);
			createPage(page);
		}

		resolve();
	});
};

exports.sourceNodes = ({ boundActionCreators, getNodes, getNode }) => {
	const { createNodeField } = boundActionCreators;

	//const markdownNodes = getNodes().
		//filter(node => node.internal.type === 'MarkdownRemark').
		//forEach(console.log);
}
