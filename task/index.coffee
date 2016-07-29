module.exports = (gulp, plugins, config) ->
	->
		gulp.src "./#{config.client.path.src}/index.jade"
		.pipe plugins.plumber(errorHandler: plugins.notify.onError('Error: '))
		.pipe plugins.jade { pretty: true, doctype: 'html' }
		.pipe gulp.dest "./#{config.client.path.build}"

		gulp.src "./#{config.client.path.src}/main.jade"
		.pipe plugins.plumber(errorHandler: plugins.notify.onError('Error: '))
		.pipe plugins.jade { pretty: true, doctype: 'html' }
		.pipe gulp.dest "./#{config.client.path.build}"
