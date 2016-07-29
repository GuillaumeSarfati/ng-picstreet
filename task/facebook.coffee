module.exports = (gulp, plugins, config) ->
  ->
    gulp.src "./#{config.client.path.src}/service/facebookConnectPlugin.js"
    .pipe gulp.dest "./#{config.client.path.build}/js"
