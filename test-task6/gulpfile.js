import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import autoprefixer from 'autoprefixer';
import browser from 'browser-sync';
import htmlmin from 'gulp-htmlmin';
import terser from 'gulp-terser';
import squoosh from 'gulp-libsquoosh';
import svgo from 'gulp-svgo';
import svgstore from 'gulp-svgstore';
import {deleteAsync} from 'del';

export const styles = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('source/css')) 
    .pipe(rename('style.min.css'))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

//HTML

const html = () => {
  return gulp.src('source/*.html')
  .pipe(htmlmin({collapseWhitespace: true }))
  .pipe(gulp.dest('build'));
}

//Scripts

const scripts = () => {
return gulp.src('source/js/*.js')
  .pipe(terser())
  .pipe(gulp.dest('build/js'));
}

// Images

const opimizeImages = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
  .pipe(squoosh())
  .pipe(gulp.dest('build/img'));
}

const copyImages = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
  .pipe(gulp.dest('build/img'));
}

// Webp

const createWebp = () => {
  return gulp.src('source/img/**/*.{jpg,png}')
  .pipe(squoosh ({
    webp: {}
  }))
  .pipe(gulp.dest('build/img'));
}

// svg

const svgTask = () => {
  return gulp.src(['source/img/**/*.svg', '!source/img/sprites/*.svg'])
  .pipe(svgo())
  .pipe(gulp.dest('build/img'));
}

// Sprites

const sprite = () => {
  return gulp.src(['source/img/sprites/*.svg'])
  .pipe(svgo())
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(rename('sprites.svg'))
  .pipe(gulp.dest('build/img/sprites'));
}


// Copy

const copy = (done) => {
  gulp.src([
    'source/fonts/*.{woff,woff2}',
    'source/*.ico',
    'source/manifest.webmanifest'
  ], {
    base: 'source'
  })
  .pipe(gulp.dest('build'))
done();
}

// Clean

const clean = async(done) => {
  await deleteAsync('build')
done();
}

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false
  });
done();
}

// Reload

export const reload = (done) => {
  browser.reload();
  done();
}

// Watcher

export const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/js/main.js', gulp.series(scripts, reload));
  gulp.watch('source/*.html').on('change', gulp.series(html, reload));
  gulp.watch('source/img/**/*.{jpg,png,svg}', gulp.series(copyImages, createWebp, svgTask, styles, html, reload));
  gulp.watch('source/img/sprites/*.svg', gulp.series(sprite, styles, html, reload));
}

// Build

export const build = gulp.series(
  clean,
  copy,
  opimizeImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    svgTask,
    sprite,
    createWebp
  ),
);

export default gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    html,
    styles,
    scripts,
    svgTask,
    sprite,
    createWebp
),
gulp.series(
  server,
  watcher
));
