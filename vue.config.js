const path = require('path')

module.exports = {
	productionSourceMap: false,
	devServer: {
		host: 'localhost',
		port: 8080,
		proxy: {
			'/v1/pixiv/': {
				target: 'http://104.194.227.168:8000',
				changeOrigin: true,
			},
			'/img-master/': {
				target: 'https://i.pixiv.cat',
				changeOrigin: true,
			},
			'/c/': {
				target: 'https://i.pixiv.cat',
				changeOrigin: true,
			},
			'/user-profile/': {
				target: 'https://i.pixiv.cat',
				changeOrigin: true,
			},
		},
	},
	configureWebpack: () => ({
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src'),
			},
		},
	})
}
