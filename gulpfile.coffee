gulp            = require 'gulp'
plugins         = require('gulp-load-plugins')()
config					= require('./gulpfile.config.json')

getTask = (name) -> require("./task/#{name}")(gulp, plugins, config)

gulp.task 'jade', getTask 'jade'
gulp.task 'less', getTask 'less'
gulp.task 'coffeescript', getTask 'coffeescript'
gulp.task 'img', getTask 'img'
gulp.task 'dist', getTask 'dist'

gulp.task 'build', [
	'jade'
	'less'
	'coffeescript'
	'img'
], ->
	gulp.start 'dist'

gulp.task 'watch', ['build'], ->
  gulp.watch "./#{config.client.path.src}/**/*.coffee", ['coffeescript']
  gulp.watch "./#{config.client.path.src}/**/*.less", ['less']
  gulp.watch "./#{config.client.path.src}/**/*.jade", ['jade']
  gulp.watch "./#{config.client.path.src}/img/**/*", ['img']
