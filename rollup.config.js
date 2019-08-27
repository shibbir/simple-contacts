import vue from 'rollup-plugin-vue';
import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import serve from 'rollup-plugin-serve';
import replace from 'rollup-plugin-replace';
import postcss from 'rollup-plugin-postcss';
import { terser } from "rollup-plugin-terser";
import commonjs from 'rollup-plugin-commonjs';
import progress from 'rollup-plugin-progress';
import resolve from 'rollup-plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';
import htmlTemplate from 'rollup-plugin-generate-html-template';

export default {
    input: 'src/main.js',
    output: {
        format: 'iife',
        sourceMap: true,
        file: 'dist/bundle.js'
    },
    plugins: [
        vue(),
        resolve(),
        commonjs(),
        babel({
            exclude: 'node_modules/**'
        }),
        json({
            exclude: 'node_modules/**',
            preferConst: true,
            compact: true
        }),
        serve('dist'),
        sourcemaps(),
        terser(),
        replace({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
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
