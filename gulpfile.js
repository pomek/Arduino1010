'use strict';

const gulp = require('gulp'),
    rollup = require('gulp-rollup'),
    inject = require('gulp-inject'),
    sass = require('gulp-sass'),
    clean = require('gulp-clean'),
    sequence = require('run-sequence'),
    browserSync = require('browser-sync').create(),
    karma = require('karma'),
    eslint = require('gulp-eslint'),
    socket = require('socket.io');

const rollupPlugins = [
    require('rollup-plugin-node-resolve')({
        jsnext: true,
        main: true
    }),

    require('rollup-plugin-commonjs')({
        sourceMap: false
    })
];

const paths = {
    src: {
        root: 'src',
        css: 'src/style',
        js: 'src/app',
        test: 'test'
    },
    dist: {
        root: '.tmp',
        css: '.tmp/css',
        js: '.tmp/js',
        test: 'test/.tmp'
    }
};

function sassHandler (isWatch) {
    const handler = gulp.src(`${paths.src.css}/style.scss`)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(paths.dist.css));

    if (isWatch) {
        handler.pipe(browserSync.stream());
    }

    return handler;
}

function jsHandler (isWatch) {
    const handler = gulp.src(`${paths.src.root}/index.js`)
        .pipe(rollup({
            format: 'umd',
            banner: `'use strict';\n`,
            plugins: rollupPlugins
        }))
        .pipe(gulp.dest(paths.dist.js));

    if (isWatch) {
        handler.pipe(browserSync.stream());
    }

    return handler;
}

gulp.task('clean', () => {
    return gulp.src(paths.dist.root, {read: false})
        .pipe(clean({
            force: true
        }));
});

gulp.task('clean:test', () => {
    return gulp.src(paths.dist.test, {read: false})
        .pipe(clean({
            force: true
        }));
});

gulp.task('sass', () => {
    return sassHandler(false);
});

gulp.task('sass:watch', () => {
    return sassHandler(true);
});

gulp.task('scripts', () => {
    return jsHandler(false);
});

gulp.task('scripts:watch', ['lint'], () => {
    return jsHandler(true);
});

gulp.task('scripts:test', () => {
    return gulp.src(`${paths.src.test}/**/*.spec.js`)
        .pipe(rollup({
            banner: `'use strict';\n`,
            format: 'umd',
            plugins: rollupPlugins
        }))
        .pipe(gulp.dest(paths.dist.test));
});

gulp.task('inject', () => {
    const files = {
            css: gulp.src(`${paths.dist.css}/*.css`, {read: false}),
            js: gulp.src(`${paths.dist.js}/*.js`, {read: false})
        },
        options = {
            ignorePath: [paths.dist.root],
            addRootSlash: false
        };

    return gulp.src(`${paths.src.root}/index.html`)
        .pipe(inject(files.css, options))
        .pipe(inject(files.js, options))
        .pipe(gulp.dest(paths.dist.root));
});

gulp.task('inject:watch', ['inject'], () => {
    browserSync.reload();
});

gulp.task('arduino', () => {
    require('./board')(socket(3050));
});

gulp.task('server', ['arduino'], () => {
    gulp.watch(`${paths.src.css}/**/*.scss`, ['sass:watch']);
    gulp.watch(`${paths.src.root}/**/*.js`, ['scripts:watch']);
    gulp.watch(`${paths.src.root}/index.html`, ['inject:watch']);

    browserSync.init({
        server: {
            baseDir: paths.dist.root,
            routes: {
                "/node_modules": "./node_modules"
            }
        }
    });
});

gulp.task('lint', () => {
    return gulp.src([
            `${paths.src.root}/*.js`,
            `${paths.src.js}/**/*.js`,
            `${paths.src.test}/**/*.js`,
            `!${paths.src.test}/stub/**/*.js`
        ])
        .pipe(eslint({
            extends: 'eslint:recommended'
        }))
        .pipe(eslint.format());
});

gulp.task('test', ['scripts:test', 'lint'], done => {
    const server = new karma.Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done);

    return server.start();
});

gulp.task('units', done => {
    sequence('test', 'clean:test', done);
});

gulp.task('default', done => {
    sequence('clean', 'sass', 'scripts', 'inject', 'server', done);
});
