/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, S. Chris Colbert
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';

var del = require('del');
var concat = require('gulp-concat');
var gulp = require('gulp');
var header = require('gulp-header');
var nib = require('nib');
var rename = require('gulp-rename');
var stream = require('event-stream');
var stylus = require('gulp-stylus');
var typedoc = require('gulp-typedoc');
var typescript = require('gulp-typescript');


var typings = ['./typings/tsd.d.ts'];


var tsSources = [
  'collections/IIterator',
  'collections/IIterable',
  'collections/ICollection',
  'collections/IDeque',
  'collections/IList',
  'collections/IQueue',
  'collections/IStack',
  'collections/algorithm',
  'collections/ReadOnlyCollection',
  'collections/ReadOnlyList',
  'collections/ArrayIterator',
  'collections/List',
  'collections/ListIterator',
  'collections/CircularBuffer',
  'collections/Queue',

  'core/idisposable',
  'core/imessage',
  'core/imessagefilter',
  'core/imessagehandler',
  'core/disposable',
  'core/empty',
  'core/message',
  'core/messageloop',
  'core/signal',

  'di/token',
  'di/IInjectable',
  'di/IContainer',
  'di/Container',

  'utility/boxsizing',
  'utility/cursor',
  'utility/hittest',
  'utility/point',
  'utility/rect',
  'utility/size',

  'virtualdom/IComponent',
  'virtualdom/IData',
  'virtualdom/IElement',
  'virtualdom/factory',
  'virtualdom/dom',
  'virtualdom/renderer',

  'components/basecomponent',
  'components/component',
  'components/codemirror',

  'widgets/alignment',
  'widgets/childmessage',
  'widgets/direction',
  'widgets/movemessage',
  'widgets/resizemessage',
  'widgets/sizepolicy',
  'widgets/widgetflag',
  //'widgets/enums',
  'widgets/ilayoutitem',
  //'widgets/itab',
  //'widgets/itabbable',
  'widgets/layout',
  'widgets/layoutengine',
  'widgets/spaceritem',
  'widgets/widgetitem',
  'widgets/widget',
  //'widgets/elementhost',
  //'widgets/panelitem',
  //'widgets/spaceritem',
  //'widgets/boxlayout',
  //'widgets/boxpanel',
  //'widgets/menuitem',
  //'widgets/menu',
  //'widgets/menubar',
  //'widgets/singlelayout',
  //'widgets/singlepanel',
  //'widgets/splithandle',
  //'widgets/splitlayout',
  //'widgets/splitpanel',
  //'widgets/stacklayout',
  //'widgets/stackpanel',
  //'widgets/tab',
  //'widgets/tabbar',
  //'widgets/tabpanel',
  //'widgets/dockarea'

  // 'shell/IPlugin',
  // 'shell/IPluginList',
  // 'shell/IRegion',
  // 'shell/IRegionManager',
  // 'shell/AutoHidePanel',
  // 'shell/PluginList',
  // 'shell/RegionManager',
  // 'shell/Bootstrapper'
].map(function(name) { return './src/' + name + '.ts'; });


var stylSources = './styl/index.styl';


gulp.task('clean', function(cb) {
  del(['./dist'], cb);
});


gulp.task('dist', function() {
  var project = typescript.createProject({
    declarationFiles: true,
    noImplicitAny: true,
    target: 'ES5',
  });

  var sources = typings.concat(tsSources);

  var src = gulp.src(sources)
    .pipe(typescript(project));

  var dts = src.dts.pipe(concat('phosphor.d.ts'))
    .pipe(gulp.dest('./dist'));

  var js = src.pipe(concat('phosphor.js'))
    .pipe(header('"use strict";\n'))
    .pipe(gulp.dest('./dist'));

  var css = gulp.src(stylSources)
    .pipe(stylus({ use: [nib()] }))
    .pipe(rename('phosphor.css'))
    .pipe(gulp.dest('./dist'));

  return stream.merge(dts, js, css);
});


gulp.task('watch', function() {
  gulp.watch(tsSources, ['dist']);
});


gulp.task('examples', function() {
  var project = typescript.createProject({
    declarationFiles: false,
    noImplicitAny: true,
    target: 'ES5',
  });

  var sources = typings.concat([
    'dist/phosphor.d.ts',
    'examples/**/index.ts'
  ]);

  var src = gulp.src(sources)
    .pipe(typescript(project))
    .pipe(rename(function (path) {
      path.dirname += '/build'; }))
    .pipe(header('"use strict";\n'))
    .pipe(gulp.dest('examples'));

  var css = gulp.src('examples/**/index.styl')
    .pipe(stylus({use: [nib()]}))
    .pipe(rename(function (path) {
      path.dirname += '/build'; }))
    .pipe(gulp.dest('examples'));

  return stream.merge(src, css);
});


gulp.task('css', function() {
  return gulp.src(stylSources)
    .pipe(stylus({ use: [nib()] }))
    .pipe(rename('phosphor.css'))
    .pipe(gulp.dest('./dist'));
});


gulp.task('docs', function() {
  return gulp.src(typings.concat(tsSources))
    .pipe(typedoc({
      out: './docs',
      name: 'Phosphor',
      target: 'ES5',
      mode: 'file',
      includeDeclarations: true }));
});

gulp.task('default', ['dist']);
