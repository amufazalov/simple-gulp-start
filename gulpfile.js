const path = require('path');
const gulp = require('gulp');
const gutil = require('gulp-util');  //Подсветка, логирование и прочие вспом. ф-ии
const cleanCSS = require('gulp-clean-css');  // используется для чистки сборочной директории
const concat = require('gulp-concat');  //объединение 
const uglify = require('gulp-uglify');  //минимизация 
const rename = require('gulp-rename');  //для хранения минимизированной версии рядом
const filesize = require('gulp-filesize');   // будем знать размер созданных файлов
const less = require('gulp-less');  // препроцессор less
const sass = require('gulp-sass');  // препроцессор sass
const changed = require('gulp-changed');  //для исключения неизмененных файлов при перегенерации
const autoprefixer = require('gulp-autoprefixer'); //автопрефиксы для стилей
const del = require('del'); //Для чистки директорий
const browserSync = require('browser-sync').create(); //Для работы с браузером

//Список css файлов
const cssFiles = [
  './src/css/main.css',
  './src/css/media.css'
];

//Список js файлов
const jsFiles = [
  './src/js/lib.js',
  './src/js/main.js'
];


function styles() {
  return gulp.src(cssFiles)
    //Объединяем в 1 файл
    .pipe(concat('styles.css'))
    //Добавляем префиксы браузеров
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    //Минификация CSS
    .pipe(cleanCSS({
      level: 2
    }))
    //Закидываем
    .pipe(gulp.dest('./build/css'))
    //Отслеживаем изменения и обновляем браузер
    .pipe(browserSync.stream());
}

function scripts() {
  return gulp.src(jsFiles)
    //Объединяем в 1 файл 
    .pipe(concat('scripts.js'))
    //Минификация js
    .pipe(uglify({
      toplevel: true
    }))
    //Закидываем
    .pipe(gulp.dest('./build/js'))
    //Отслеживаем изменения и обновляем браузер
    .pipe(browserSync.stream());
}

//Для чистки каталогов
function clean() {
  return del(['build/*']);
}

//Просмотр файлов
function watch() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
  //Слежка за css
  gulp.watch('./src/css/**/*.css', styles);
  //слежка за js
  gulp.watch('./src/js/**/*.js', scripts);
  //При изменении .html запуск синхронизации
  gulp.watch("./*.html").on('change', browserSync.reload);
}

//Вызов таска styles
gulp.task('styles', styles);
//Вызов таска scripts
gulp.task('scripts', scripts);
//Вызов таска для очистки директории build
gulp.task('del', clean);
//Вызов таска для отслеживая изменений
gulp.task('watch', watch);
//Чистим папку build и запускаем асинхронно style и scripts таски
gulp.task('build', gulp.series(clean, gulp.parallel(styles, scripts)))
//Последовательно вызываем build и watch
gulp.task('dev', gulp.series('build', 'watch'))