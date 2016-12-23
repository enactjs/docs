const ILibPlugin = require('ilib-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

exports.modifyWebpackConfig = function (config, stage) {
	if (stage === 'build-html') {
		config.removeLoader('less');
		config.removeLoader('css');
		config.loader('css', function (cfg) {
			cfg.test = /\.(c|le)ss$/;
			cfg.loader = ExtractTextPlugin.extract('style',
						'css?-autoprefixer&modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]!postcss!less?sourceMap');
			return cfg;
		});
		config.plugin('ilib', ILibPlugin);
	}
	return config;
};
