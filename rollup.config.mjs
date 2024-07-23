import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import typescript from "@rollup/plugin-typescript"
import dts from "rollup-plugin-dts"
import json from "@rollup/plugin-json"
import terser from "@rollup/plugin-terser"
import peerDepsExternal from "rollup-plugin-peer-deps-external"

// This is required to read package.json file when
// using Native ES modules in Node.js
// https://rollupjs.org/command-line-interface/#importing-package-json
import { createRequire } from "node:module"
const requireFile = createRequire(import.meta.url)
const packageJson = requireFile("./package.json")

export default [
	{
		input: "src/index.ts",
		output: [
			{
				file: packageJson.main,
				format: "cjs",
				sourcemap: true,
				interop: "compat",
			},
			{
				file: packageJson.module,
				format: "esm",
				sourcemap: true,
				interop: "compat",
			},
		],
		plugins: [
			peerDepsExternal(),
			resolve(),
			json(),
			commonjs(),
			typescript({ tsconfig: "./tsconfig.json" }),
			terser(),
		],
		external: [ "react", "react-dom", "valibot" ],
	},
	{
		input: "dist/esm/types/index.d.ts",
		output: [{
			file: packageJson.types,
			format: "es",
			interop: "compat",
		}],
		plugins: [ dts() ],
	},
]
