/* eslint-env node */
// const GracefulFSPlugin = require('graceful-fs-webpack-plugin');
// const autoprefixer = require('autoprefixer');
// const FilterWarningsPlugin = require("webpack-filter-warnings-plugin");
const webpack = require('webpack');
const crypto = require('crypto');
const path = require('path');

exports.onCreateWebpackConfig = ({
	stage,
	loaders,
	plugins,
	actions
}) => {
	actions.setWebpackConfig({
		devtool: 'eval-source-map',
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /(node_modules.(?!@enact|buble|jsonata)|bower_components)/,
					use:[loaders.js()]
				}
			]
		},
		plugins: [
			plugins.define({
				//				gracefulfs: GracefulFSPlugin,
				defineenv: () => new webpack.DefinePlugin({
					'process.env': {
						'NODE_ENV': JSON.stringify((stage.indexOf('develop') >= 0 ? 'development' : 'production'))
					}
				}),
				ignore: () => new webpack.IgnorePlugin(/^(xor|props)$/)
			})/*,
			new FilterWarningsPlugin({
				exclude:
					/mini-css-extract-plugin[^]*Conflicting order. Following module has been added:/
			}),*/
		]
	});
};

/*
exports.modifyWebpackConfig = ({config, stage}) => {
	config.loader('js', cfg => {
		cfg.exclude = /(node_modules.(?!@enact|buble|jsonata)|bower_components)/;
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
*/

exports.onCreateBabelConfig = ({actions}) => {
	actions.setBabelPlugin({
		name: '@babel/plugin-transform-react-jsx',
		options: {
			runtime: 'automatic',
		},
	});
 };

function createSlug ({absolutePath, relativePath}) {
	let slug;
	const parsedFilePath = path.parse(relativePath);
	const paredAbsoluteFilePath = path.parse(absolutePath);

	if(paredAbsoluteFilePath.dir.indexOf('jsdocs')) {
		slug = `/${parsedFilePath.dir}/`;
	} else {
		if (parsedFilePath.name !== 'index' && parsedFilePath.dir !== '') {
			slug = `/${parsedFilePath.dir}/${parsedFilePath.name}/`;
		} else if (parsedFilePath.dir === '') {
			slug = `/${parsedFilePath.name}/`;
		} else {
			slug = `/${parsedFilePath.dir}/`;
		}
	}

	return slug;
}

async function onCreateNode ({node, actions, getNode}) {
	const {createNodeField, createNode, createParentChildLink} = actions;
	let slug;
	if (node.internal.type === 'MarkdownRemark') {
		const fileNode = getNode(node.parent);
		if(fileNode.internal.type === 'File') {
			slug = createSlug(fileNode);

			// Add slug as a field on the node.
			createNodeField({node, name: 'slug', value: slug});
		} else {
			slug = "documentationjsmark"
		}
		// Add slug as a field on the node.
		createNodeField({node, name: 'slug', value: slug});
	} else if (node.internal.type === 'DocumentationJs') {
		const fileNode = getNode(node.parent);
		if(!(fileNode.fields)) {
			slug = createSlug(fileNode);
		}
		else {
			slug = fileNode.fields.slug;
		}
		// Add slug as a field on the node.
		createNodeField({node, name: 'slug', value: slug});

		/*node.tags.forEach((tag) => {
			if(tag.title === "module") {
				slug = node.name;

				const contentDigest = crypto
				.createHash('md5')
				.digest('hex');

				const apiDocNode = {
					id: `${node.id} >>> DocumentJS`,
					parent: node.id,
					internal: {
						type: `ApiDoc`,
						contentDigest: contentDigest
					}
				}

				createNode(apiDocNode);
				createParentChildLink({parent: fileNode, child: apiDocNode});
				createNodeField({apiDocNode, name: 'slug', value: slug});
			}
		});*/

		if (fileNode.internal.mediaType === 'application/javascript') {
			let type = 'ApiDocSub';

			node.tags.forEach((tag) => {
				if(tag.title === "module") {
					type = 'ApiDoc';		
				}
			});

			const contentDigest = crypto
				.createHash('md5')
				.digest('hex');

			const apiDocNode = {
				id: `${node.id} >>> DocumentJS`,
				parent: fileNode.id,
				internal: {
					type: type,
					contentDigest: contentDigest
				}
			}

			createNode(apiDocNode);
			createParentChildLink({parent: fileNode, child: apiDocNode});
			// Add slug as a field on the node.
			createNodeField({node: apiDocNode, name: 'slug', value: slug}); 
			
		}
	} else if (node.internal.type === 'JavascriptFrontmatter') {
		// For some reason, the parent node is attached and we can get the relative path from there!
		slug = createSlug(node.node);

		createNodeField({node, name: 'slug', value: slug});
	}
}

exports.onCreateNode = onCreateNode;

exports.createPages = ({graphql, actions}) => {
	const {createPage} = actions;

	// Create a regex that will include siblings and (if applicable) parent's siblings, but not
	// the children of the parent's siblings or the children of the current page.
	function parentRegexFromSlug (childSlug) {
		const parts = childSlug.split('/'),
			parentPathParts = parts.slice(0, parts.length - 2);

		// Parent will be one level up from current page
		return '/' + parentPathParts.join('\\/') + '(\\/[^/]*)?\\/$/';
	}

	return new Promise((resolve, reject) => {
		const markdownPage = path.resolve('./src/templates/markdown.js');
		const apiPage = path.resolve('./src/templates/apidoc.js');
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
						allApiDoc {
							edges {
							  node {
								fields {
									slug
								}
								parent {
									id
								}
							  }
							}
						}
					}
				`
			).then(result => {
				if (result.errors) {
					console.log(result.errors);	// eslint-disable-line no-console
					reject(result.errors);
				}

				// Create markdown pages.
				result.data.allMarkdownRemark.edges.forEach(edge => {
					if(edge.node.fields.slug !== "documentationjsmark") {
						createPage({
							path: edge.node.fields.slug, // required
							component: markdownPage,
							context: {
								slug: edge.node.fields.slug,
								title: edge.node.frontmatter.title,
								parentRegex: parentRegexFromSlug(edge.node.fields.slug)
							}
						});
					} else {
						console.log("documentationjsmark\n");
					}
				});

				// Create JSON pages.
				result.data.allApiDoc.edges.forEach(edge => {
					createPage({
						path: edge.node.fields.slug, // required
						component: apiPage,
						context: {
							slug: edge.node.fields.slug,
							id:edge.node.parent.id,
							title: edge.node.fields.slug.replace(/\/docs\/modules\/(.*)\//, '$1')
						}
					});
				});
			})
		);
	});
};
