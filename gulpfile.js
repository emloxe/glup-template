const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rev = require('gulp-rev'); // - 对文件名加MD5后缀
const revCollector = require('gulp-rev-collector'); // - 路径替换
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
// const cssnext = require('postcss-cssnext');
const shortcss = require('postcss-short');
const cssmin = require('gulp-clean-css');

// gulp.task('clean', cb => del(['./docs/css/bundle.css'], cb));

// 兼容其他浏览器
// gulp.task( 'css',  gulp.series('clean', () => {
//     let plugins = [
//       shortcss,
//       // cssnext,
//       autoprefixer({
//         browsers: [
//           'Android 4.1',
//           'iOS 7.1',
//           'Chrome > 31',
//           'ff > 15',
//           'ie >= 9',
//         ],
//         cascade: false,
//       }),
//       cssmin,
//     ];
//     return gulp
//       .src('docs/css/*.css') // 不打包base.css 用['docs/css-editor/layout.css', 'docs/css-editor/chart.css']
//       .pipe(concat('bundle.css'))
//       .pipe(postcss(plugins))
//       .pipe(gulp.dest('docs/css'));
//   }),
// );

gulp.task('default', () => {
  gulp
    .src(['./src/script/index.js'])
    .pipe(concat('main.js'))
    .pipe(
      babel({
        presets: ['@babel/env'],
      }),
    )
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('./dist/js'))
    .pipe(rev.manifest()) // - 生成一个rev-manifest.json
    .pipe(gulp.dest('./rev'));
});
