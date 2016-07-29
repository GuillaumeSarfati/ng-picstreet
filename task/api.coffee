module.exports = (gulp, plugins, config) ->
  ->
    gulp.src "#{config.server.path}"
    .pipe plugins.loopbackSdkAngular()
    .pipe plugins.rename 'api.js'
    .pipe gulp.dest "./#{config.client.path.build}/js"
