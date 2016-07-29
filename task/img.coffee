module.exports = (gulp, plugins, config) ->
  ->
    gulp.src "./#{config.client.path.src}/svg/*"
    .pipe plugins.plumber(errorHandler: plugins.notify.onError('Error: <%= error.message %>'))
    .pipe plugins.angularTemplatecache('images.js', { module: "#{config.client.name}" })
    .pipe gulp.dest "./#{config.client.path.build}/js"
