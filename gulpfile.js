const { series, src, dest, watch } = require('gulp');
const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const merge = require('merge-stream');
const del = require('del');
const plugins = require('gulp-load-plugins')({ lazy: true });
const webroot = 'webroot';

function clean() {
    return del(`${webroot}/**/*`);
}

function bundle(cb) {
    rollup.rollup({
        input: 'src/scripts/app.js',
        plugins: [
            babel({
                exclude: 'node_modules/**'
            })
        ]
    }).then(bundle => {
        return bundle.write({
            file: `${webroot}/app.js`,
            format: 'iife'
        });
    });

    cb();
}

function vendors() {
    let scripts = src([
        'node_modules/jquery/dist/jquery.slim.min.js',
        'node_modules/handlebars/dist/handlebars.min.js',
        'node_modules/parsleyjs/dist/parsley.min.js',
        'node_modules/@fortawesome/fontawesome-free/js/all.min.js',
        'node_modules/dexie/dist/dexie.min.js'
    ])
    .pipe(plugins.concat('vendor.js'))
    .pipe(plugins.uglify())
    .pipe(dest(webroot));

    let styles = src([
        'node_modules/bulma/css/bulma.min.css',
        'src/styles/app.css',
    ])
    .pipe(plugins.concatCss("app.css"))
    .pipe(plugins.cleanCss())
    .pipe(dest(webroot));

    return merge(styles, scripts);
}

function copy() {
    return src('src/index.html').pipe(dest(webroot));
}

function inject() {
    let target = src(`${webroot}/index.html`);
    let sources = src([`${webroot}/vendor.js`, `${webroot}/app.js`, `${webroot}/**/*.css`], {read: false});

    return target.pipe(plugins.inject(sources, {relative: true})).pipe(dest(webroot));
}

function server() {
    plugins.connect.server({
        root: webroot
    });
}

watch('src/**/*', series(bundle, copy, inject));

exports.default = series(clean, vendors, bundle, copy, inject, server);
