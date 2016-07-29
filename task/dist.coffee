
module.exports = (gulp, plugins, config) ->
  ->
  
    gulp.src "./#{config.client.path.build}/js/*.js"
    .pipe plugins.plumber(errorHandler: plugins.notify.onError('Error: '))
    .pipe plugins.concat 'index.js'
    .pipe gulp.dest "./#{config.client.path.build}"
