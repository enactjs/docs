const ILibPlugin = require('ilib-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

exports.modifyWebpackConfig = function (config, stage) {
	//	if (stage === 'build-html') {
		config.removeLoader('less');
		config.removeLoader('css');
		config.loader('enact-css', function (cfg) {
			cfg.test = /@enact.*\.(c|le)ss$/;
			cfg.loader = ExtractTextPlugin.extract('style',
						'css?-autoprefixer&modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]!postcss!less?sourceMap');
			return cfg;
		});
		config.loader('css', function (cfg) {
			cfg.test = /\.(c|le)ss$/;
			cfg.exclude = /@enact/;
			cfg.loader = ExtractTextPlugin.extract('style',
						'css?-autoprefixer&modules&sourceMap&importLoaders=1!postcss!less?sourceMap');
			return cfg;
		});
	//		config.plugin('extract-text', ExtractTextPlugin, ['styles.css']);
		config.plugin('ilib', ILibPlugin);
	//}
	config.merge({
		postcss: function () { return [
			autoprefixer({
				browsers: [
					'>1%',
					'last 4 versions',
					'Firefox ESR',
					'not ie < 9' // React doesn't support IE8 anyway
				]}
			)
		]}
	});
	return config;
};
