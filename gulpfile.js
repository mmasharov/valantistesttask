const { src, dest, watch, parallel } = require('gulp');
const browserSync = require('browser-sync');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const webpack = require('webpack-stream');
const htmlmin = require('gulp-htmlmin');
const cleancss = require('gulp-clean-css');

function browsersync() {
    browserSync.init({
        server: {
            baseDir: './public/',
            serverStaticOptions: {
                extensions: ['html'],
            },
        },
        port: 5000,
        ui: {port: 5001},
        open: true,
    });
}

function styles() {
    return src('./src/sass/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({ grid: true }))
        .pipe(cleancss({compatibility: 'ie8'}))
        .pipe(dest('./public/css/'))
        .pipe(browserSync.stream());
}

function scripts() {
    return src('./src/js/script.js')
        .pipe(webpack({
            mode: 'development',
            output: {
                filename: 'script.js'
            },
            watch: false
        }))
        .pipe(dest('./public/js'))
        .pipe(browserSync.reload({ stream: true, }));
}

function html() {
    return src('./src/index.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(dest('./public/'))
        .pipe(browserSync.reload({ stream: true, }));
}

function images() {
    return src('./src/img/**/*')
        .pipe(dest('./public/img'))
        .pipe(browserSync.reload({ stream: true, }));
}

function watch_dev() {
    watch(['./src/index.html'], html).on('change', browserSync.reload);
    watch(['./src/sass/style.scss', './src/sass/**/*.scss'], styles).on('change', browserSync.reload);
    watch(['./src/js/script.js', './src/js/modules/**/*.js'], scripts);
    watch(['./src/img/**/*']).on('all', parallel(images));
}

function build_prod_js() {
    return src("./src/js/script.js")
                .pipe(webpack({
                    mode: 'production',
                    output: {
                        filename: 'script.js'
                    },
                    module: {
                        rules: [
                          {
                            test: /\.m?js$/,
                            exclude: /(node_modules|bower_components)/,
                            use: {
                              loader: 'babel-loader',
                              options: {
                                presets: [['@babel/preset-env', {
                                    corejs: 3,
                                    useBuiltIns: "usage"
                                }]]
                              }
                            }
                          }
                        ]
                      }
                }))
                .pipe(dest('./public/js'));
}

exports.browsersync = browsersync;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.html = html;
exports.build_prod_js = build_prod_js;

exports.default = parallel(
    styles,
    scripts,
    html,
    images,
    browsersync,
    watch_dev
);