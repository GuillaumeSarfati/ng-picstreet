module.exports = (gulp, plugins, config) ->
  ->
    gulp.src "./#{config.client.path.src}/**/*.coffee"
    .pipe plugins.plumber(errorHandler: plugins.notify.onError('Error: <%= error %>'))
    .pipe plugins.coffee { bare: true }
    .pipe plugins.concat 'app.js'
    .pipe gulp.dest "./#{config.client.path.build}/js"
