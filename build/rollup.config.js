import { nodeResolve } from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import typescript from "rollup-plugin-typescript2";
import commonjs from "@rollup/plugin-commonjs";
import vuePlugin from 'rollup-plugin-vue';
import path from 'path'
import pkg from './../package.json';
import postcssPlugin from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer';
import sizes from 'rollup-plugin-sizes';
import { terser } from 'rollup-plugin-terser';
const deps = Object.keys(pkg.dependencies);
export default [
    {
        input: path.resolve(__dirname, "./../src/index.ts"),
        output: {
            format: 'es',
            file: 'lib/index.js'
        },
        plugins: [
            // terser(),
            vuePlugin({
                target: 'browser',
                css: false,
            }),
            sizes(),
            nodeResolve(),
            postcssPlugin({
                plugins: [autoprefixer],
                use: ['less'],
                extensions: ['.css', '.less']
            }),
            typescript({
                tsconfigOverride: {
                    include: ['src/**/*'],
                    exclude: ['node_modules', 'example']
                },
                abortOnError: false
            }),
            // babel({
            //     babelHelpers: 'external',
            //     extensions: ['.js', '.jsx', '.vue', '.ts', '.tsx'],
            //     presets: ['@babel/preset-env'],
            //     plugins: ['@babel/plugin-external-helpers'],
            // }),
            babel({
                babelHelpers: 'runtime',
                exclude: 'node_modules/**',
                extensions: ['.js', '.jsx', '.vue', '.ts', '.tsx'],
                presets: [['@babel/preset-env', { modules: false }]],
                plugins: [['@babel/plugin-transform-runtime', { useESModules: false }]],
                sourceMap: false
            }),
            commonjs(),
        ],
        external (id) {
            return (
                /^vue/.test(id) ||
                deps.some(k => new RegExp('^' + k).test(id))
            );
        }
    }
]