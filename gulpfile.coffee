gulp = require 'gulp'
$ = do require 'gulp-load-plugins'
electron = require('electron-connect').server.create()
__srcdir = './src/'
__distdir = './dist/'

gulp.task 'jade', () ->
  gulp.src __srcdir + 'index.jade', locals: require './package.json'
    .pipe $.plumber(
      errorHandler: $.notify.onError('Error: <%= error.message %>')
    ).pipe $.jade()
    .pipe gulp.dest(__distdir)

gulp.task 'cjsx', () ->
  gulp.src __srcdir + 'coffee/**/*.cjsx'
    .pipe $.plumber(
      errorHandler: $.notify.onError('Error: <%= error.message %>')
    ).pipe $.cjsx(bare: true).on('error', $.util.log)
    .pipe gulp.dest(__distdir + 'js')

gulp.task 'coffee', () ->
  gulp.src __srcdir + 'coffee/**/*.coffee'
    .pipe $.plumber(
      errorHandler: $.notify.onError('Error: <%= error.message %>')
    ).pipe $.coffee(bare: true)
    .pipe gulp.dest(__distdir + 'js')

gulp.task 'top', () ->
  gulp.src __srcdir + 'main.coffee'
    .pipe $.plumber(
      errorHandler: $.notify.onError('Error: <%= error.message %>')
    ).pipe $.coffee(bare: true)
    .pipe gulp.dest(__distdir)

gulp.task 'less', () ->
  gulp.src __srcdir + 'css/*.less'
    .pipe $.plumber(
      errorHandler: $.notify.onError('Error: <%= error.message %>')
    ).pipe $.less()
    .pipe gulp.dest(__distdir + 'css')

gulp.task 'watch', ['jade', 'cjsx', 'coffee', 'less', 'top'], () ->
  electron.start()
  gulp.watch __srcdir + '**/*.jade', ['jade']
  gulp.watch __srcdir + 'css/*.less', ['less']
  gulp.watch __srcdir + 'coffee/**/*.cjsx', ['cjsx']
  gulp.watch __srcdir + 'coffee/**/*.coffee', ['coffee']
  gulp.watch __srcdir + 'main.coffee', ['top']
  gulp.watch [__distdir + 'main.js', __distdir + 'js/browser/*.js'], electron.restart
  gulp.watch [__distdir + 'index.html', __distdir + '**/*.{html,js,css}'], electron.reload

gulp.task 'default', ['watch']
