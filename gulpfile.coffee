gulp = require 'gulp'
$ = do require 'gulp-load-plugins'
electron = require('electron-connect').server.create()
config = require './package.json'
del = require 'del'
path = require 'path'
extend = require 'extend'
runSequence = require 'run-sequence'
packager = require 'electron-packager'
__srcdir = path.join __dirname, 'src'
__distdir = path.join __dirname, 'dist'
args = [process.cwd()].concat(process.argv)
gulp.task 'jade', () ->
  gulp.src path.join(__srcdir, 'index.jade'), locals: config
    .pipe $.plumber(
      errorHandler: $.notify.onError('Error: <%= error.message %>')
    ).pipe $.jade()
    .pipe gulp.dest(__distdir)

gulp.task 'babel', ->
  gulp.src path.join(__srcdir, 'js/**/*')
    .pipe $.plumber(
      errorHandler: $.notify.onError('Error: <%= error.message %>')
    ).pipe $.babel()
    .pipe gulp.dest(path.join(__distdir, 'js'))

gulp.task 'cjsx', () ->
  gulp.src path.join(__srcdir, 'coffee/**/*.cjsx')
    .pipe $.plumber(
      errorHandler: $.notify.onError('Error: <%= error.message %>')
    ).pipe $.cjsx(bare: true).on('error', $.util.log)
    .pipe gulp.dest(path.join(__distdir, 'js'))

gulp.task 'coffee', () ->
  gulp.src path.join(__srcdir, 'coffee/**/*.coffee')
    .pipe $.plumber(
      errorHandler: $.notify.onError('Error: <%= error.message %>')
    ).pipe $.coffee(bare: true)
    .pipe gulp.dest(path.join(__distdir, 'js'))

gulp.task 'top', () ->
  gulp.src(path.join(__srcdir, '*.coffee'))
  .pipe $.plumber(
    errorHandler: $.notify.onError('Error: <%= error.message %>')
  ).pipe $.coffee(bare: true)
  .pipe gulp.dest(__distdir)

gulp.task 'less', () ->
  gulp.src path.join(__srcdir, 'css/*.less')
    .pipe $.plumber(
      errorHandler: $.notify.onError('Error: <%= error.message %>')
    ).pipe $.less()
    .pipe gulp.dest(path.join(__distdir, 'css'))

gulp.task 'build', (cb) ->
  runSequence 'compile', 'babel', cb

gulp.task 'compile', ['jade', 'cjsx', 'coffee', 'less', 'top']

gulp.task 'watch', ['build'], () ->
  electron.start(args)
  gulp.watch path.join(__srcdir, '**/*.jade'), ['jade']
  gulp.watch path.join(__srcdir, 'css/*.less'), ['less']
  gulp.watch path.join(__srcdir, 'coffee/**/*.cjsx'), ['cjsx']
  gulp.watch path.join(__srcdir, 'coffee/**/*.coffee'), ['coffee']
  gulp.watch path.join(__srcdir, 'js/**/*'), ['babel']
  gulp.watch path.join(__srcdir, '*.coffee'), ['top']
  gulp.watch [path.join(__distdir, '*.js'), path.join(__distdir, 'js/browser/*.js')], -> electron.restart(args)
  gulp.watch [path.join(__distdir, 'index.html'), path.join(__distdir, '**/*') + '{html,js,css}'], electron.reload

packageOpts =
  asar: true
  dir: 'pack'
  out: 'packages'
  name: config.name
  version: config.devDependencies['electron']
  prune: true
  overwrite: true
  'app-version': config.version

packageElectron = (opts = {}, done) ->
  packager extend(packageOpts, opts), (err) ->
    if err
      if err.syscall == 'spawn wine'
        $.util.log 'Packaging failed. Please install wine.'
      else
        throw err

    done() if done?

gulp.task 'clean:dist' , -> del ['pack/**/*', 'pack']

gulp.task 'dist', ['clean:dist'], ->
  gulp.src([
    'dist/**/*'
    'package.json'
  ], { base: '.' })
    .pipe gulp.dest('pack')
    .pipe $.install
      production: true

gulp.task 'pack', ['dist'], (done) ->
  runSequence 'pack:win32', 'pack:darwin', done

gulp.task 'pack:win32', (done) ->
  packageElectron {
    platform: 'win32'
    arch: 'ia32,x64'
    # icon: path.join(__dirname, 'icons/negai.ico')
  }, done

gulp.task 'pack:darwin', (done) ->
  packageElectron {
    platform: 'darwin'
    arch: 'x64'
    # icon: path.join(__dirname, 'icons/negai.icns')
  }, done


gulp.task 'default', ['watch']
