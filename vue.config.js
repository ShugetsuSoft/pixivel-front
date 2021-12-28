const path = require('path')

module.exports = {
	productionSourceMap: false,
	configureWebpack: () => ({
		devtool: "source-map",
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src'),
			},
		},
	})
}
