import vue from 'rollup-plugin-vue';
import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';
import replace from 'rollup-plugin-replace';
import postcss from 'rollup-plugin-postcss';
import { terser } from "rollup-plugin-terser";
import commonjs from 'rollup-plugin-commonjs';
import progress from 'rollup-plugin-progress';
import resolve from 'rollup-plugin-node-resolve';
import htmlTemplate from 'rollup-plugin-generate-html-template';

export default {
    input: 'src/main.js',
    output: {
        file: 'dist/bundle.js',
        format: 'iife'
    },
    plugins: [
        vue(),
        resolve(),
        commonjs(),
        babel({
            exclude: 'node_modules/**'
        }),
        serve('dist'),
        terser(),
        replace({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        postcss(),
        htmlTemplate({
            template: 'src/index.html',
            target: 'dist/index.html'
        }),
        progress({
            clearLine: false
        })
    ]
}
