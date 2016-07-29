module.exports = (gulp, plugins, config) ->
  ->
    gulp.src "./#{config.client.path.src}/i18n/*.json"
    .pipe plugins.plumber(errorHandler: plugins.notify.onError('Error: '))
    .pipe gulp.dest "./#{config.client.path.build}/i18n"
