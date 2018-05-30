const path = require('path');

module.exports = {
	siteMetadata: {
		title: 'Enact'
	},
	plugins: [
		{
			resolve: 'gatsby-source-filesystem',
			options: {
				name: 'pages',
				path: path.join(__dirname, 'src', 'pages'),
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
						resolve: 'gatsby-remark-responsive-iframe'
					},
					'gatsby-remark-prismjs',
					'gatsby-remark-copy-linked-files',
					'gatsby-remark-smartypants'
				]
			}
		},
		'gatsby-plugin-sharp',
		'gatsby-plugin-catch-links'
	]
};
