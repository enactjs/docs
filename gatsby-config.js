/* eslint-env node */
/* eslint-disable camelcase */
import path from 'path';

export default {
	pathPrefix: '/',
	siteMetadata: {
		title: 'Enact'
	},
	plugins: [
		{
			resolve: `gatsby-plugin-google-gtag`,
			options: {
				// You can add multiple tracking ids and a pageview event will be fired for all of them.
				trackingIds: [
					"G-ZNPW7ST2D8" // Google Analytics / GA
				],
				// This object is used for configuration specific to this plugin
				pluginConfig: {
					// Puts tracking script in the head instead of the body
					head: false,
					// Setting this parameter is also optional
					respectDNT: true
				}
			}
		},
		{
			resolve: 'gatsby-source-filesystem',
			options: {
				name: 'pages',
				path: path.join(__dirname, 'src', 'pages')
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
					'gatsby-remark-prismjs',
					'gatsby-remark-copy-linked-files',
					'gatsby-remark-smartypants',
					'gatsby-remark-autolink-headers'
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
						namedExport: false
					}
				}
			}
		},
		{
			resolve: `gatsby-plugin-postcss`,
			options: {
				cssLoaderOptions: {
					modules: {
						namedExport: false
					}
				}
			}
		},
		'gatsby-plugin-sharp',
		'gatsby-plugin-catch-links',
		'gatsby-transformer-javascript-frontmatter',
		'gatsby-plugin-react-helmet',
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
