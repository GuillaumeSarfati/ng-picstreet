module.exports = (gulp, plugins, config) ->
	->
		
		gulp.src "./#{config.client.path.src}/app.less"
		.pipe plugins.plumber(errorHandler: plugins.notify.onError('Error: <%= error %>'))
		.pipe plugins.less()
		.pipe plugins.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4')
		.pipe gulp.dest "./#{config.client.path.build}/css"
