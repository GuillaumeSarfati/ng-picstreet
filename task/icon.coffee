module.exports = (gulp, plugins, config) ->
	->
		gulp.src "./#{config.client.path.src}/img/svg/*.svg"
		
		.pipe plugins.iconfontCss

			fontName: "#{config.client.name}"
			targetPath: "#{config.client.name}.css"
			fontPath: ''
			cssClass: 'custom-icon'
		
		.pipe plugins.iconfont
			fontName: "#{config.client.name}"
			centerHorizontally: true
			normalize: true
			appendUnicode: true

		.pipe gulp.dest "#{config.client.path.src}/css"
