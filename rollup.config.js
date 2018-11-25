import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';
import vue from 'rollup-plugin-vue';
import { terser } from "rollup-plugin-terser";
import replace from 'rollup-plugin-replace';
import postcss from 'rollup-plugin-postcss';
import htmlTemplate from 'rollup-plugin-generate-html-template';
import progress from 'rollup-plugin-progress';

export default {
    input: 'src/main.js',
    output: {
        file: 'dist/bundle.js',
        format: 'iife'
    },
    plugins: [
        vue(),
        resolve(),
        babel({
            exclude: 'node_modules/**'
        }),
        serve('dist'),
        terser(),
        replace({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        postcss({
            extensions: [ '.css' ]
        }),
        htmlTemplate({
            template: 'src/index.html',
            target: 'dist/index.html',
        }),
        progress({
            clearLine: false
        })
    ]
}
