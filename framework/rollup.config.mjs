import pkg from "./package.json" assert { type: "json" };
import { cssCopyPlugin } from "./rollup-plugin-copy-css.mjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import path from "node:path";
import { swcPlugin } from "rollup-plugin-swc-core";

const cssRegExp = /\.s?css$/i;
const depRegExp = new RegExp(Object.keys(pkg.dependencies).join("|"));

const external = (source, importer) => {
	if (
		cssRegExp.exec(source) ||
		depRegExp.exec(source) ||
		(importer != null &&
			!source.startsWith(".", 0) &&
			path.relative(path.dirname(importer), path.dirname(source)))
	) {
		return true;
	}
};
const plugins = [
	nodeResolve({
		extensions: [".js", ".json", ".tsx", ".ts"],
	}),
	swcPlugin(),
	cssCopyPlugin(),
];

const config = [];

Object.entries(pkg.exports).forEach(([key, value]) => {
	const input = path.join("src", key, "index.ts");
	config.push({
		input,
		external,
		plugins,
		output: {
			file: value.import,
			sourcemap: true,
		},
	});
	config.push({
		input,
		external,
		plugins,
		output: {
			file: value.require,
			format: "cjs",
			sourcemap: true,
		},
	});
});

export default config;
