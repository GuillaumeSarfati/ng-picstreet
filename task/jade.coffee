module.exports = (gulp, plugins, config) ->
  ->
    gulp.src "./#{config.client.path.src}/**/*.jade"
    .pipe plugins.plumber(errorHandler: plugins.notify.onError('Error: <%= error.message %>'))
    .pipe plugins.flatten()
    .pipe plugins.jade { pretty: true, doctype: 'html' }
    .pipe plugins.angularTemplatecache('templates.js', { module: "#{config.client.name}" })
    .pipe gulp.dest "./#{config.client.path.build}/js"
