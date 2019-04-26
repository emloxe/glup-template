const os = require('os');
const childProcess = require('child_process');

const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rev = require('gulp-rev');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const shortcss = require('postcss-short');
const cssmin = require('gulp-clean-css');
const streamToPromise = require('stream-to-promise');
const del = require('del');
const packageJson = require('./package.json');

const { version, name } = packageJson;
if (/\.0$/.test(version)) {
  version = version.substring(0, version.length - 2);
}


gulp.task('clean:css', cb => del(['dist/css/**'], cb));

gulp.task('css', () => gulp
  .src('src/style/*.css') // 不打包base.css 用['docs/css-editor/layout.css', 'docs/css-editor/chart.css']
  .pipe(concat('main.css'))
  .pipe(gulp.dest('dist/css')));

gulp.task('release-css:normal', () => {
  const plugins = [
    shortcss,
    autoprefixer({
      browsers: ['Android 4.1', 'iOS 7.1', 'Chrome > 31', 'ff > 15', 'ie >= 9'],
      cascade: false,
    }),
  ];
  return gulp
    .src('src/style/*.css')
    .pipe(concat('main.css'))
    .pipe(postcss(plugins))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('release-css:min', () => {
  const plugins = [
    shortcss,
    autoprefixer({
      browsers: ['Android 4.1', 'iOS 7.1', 'Chrome > 31', 'ff > 15', 'ie >= 9'],
      cascade: false,
    }),
  ];
  return gulp
    .src('src/style/*.css')
    .pipe(concat('main.min.css'))
    .pipe(postcss(plugins))
    .pipe(cssmin())
    .pipe(gulp.dest('dist/css'));
});

gulp.task('release-css', gulp.parallel('release-css:normal', 'release-css:min'));


// Builds the documentation
gulp.task('jsdoc', () => {
  const envPathSeperator = os.platform() === 'win32' ? ';' : ':';

  return new Promise(((resolve, reject) => {
    childProcess.exec('jsdoc --configure tools/jsdoc/conf.js', {
      env: {
        PATH: `${process.env.PATH + envPathSeperator}node_modules/.bin`,
        VERSION: version,
      },
    }, (error, stdout, stderr) => {
      if (error) {
        console.log(stderr);
        return reject(error);
      }
      console.log(stdout);
      const stream = gulp.src('tools/jsdoc/images/**').pipe(gulp.dest('docs/images'));
      return streamToPromise(stream).then(resolve);
    });
  }));
});

gulp.task('js', () => gulp
  .src(['src/script/index.js'])
  .pipe(concat('main.js'))
  .pipe(gulp.dest('dist/js')));

gulp.task('release-js:normal', () => gulp
  .src(['src/script/index.js'])
  .pipe(concat('main.js'))
  .pipe(
    babel({
      presets: ['@babel/env'],
    }),
  )
  .pipe(gulp.dest('dist/js')));

gulp.task('release-js:min', () => gulp
  .src(['src/script/index.js'])
  .pipe(concat('main.min.js'))
  .pipe(
    babel({
      presets: ['@babel/env'],
    }),
  )
  .pipe(uglify())
  .pipe(gulp.dest('dist/js')));

// 对文件名加MD5后缀
gulp.task('release-js:rev', () => gulp
  .src(['src/script/index.js'])
  .pipe(concat('main.min.js'))
  .pipe(
    babel({
      presets: ['@babel/env'],
    }),
  )
  .pipe(uglify())
  .pipe(rev())
  .pipe(gulp.dest('dist/js'))
  .pipe(rev.manifest()) // - 生成一个rev-manifest.json
  .pipe(gulp.dest('dist')));

gulp.task('release-js', gulp.parallel('release-js:normal', 'release-js:min'));

gulp.task('release', gulp.parallel('release-js', 'release-css'));
gulp.task('build', gulp.parallel('js', 'css'));
