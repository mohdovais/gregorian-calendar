//@ts-check
import fs from "node:fs";
import path from "node:path";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { swcPlugin } from "rollup-plugin-swc-core";
import { cssCopyPlugin } from "./rollup-plugin-copy-css.mjs";

const cssRegExp = /\.s?css$/i;
const ignoreRegExp = /\.(test|d)\.ts$/i;
const includeRegExp = /\.tsx?$/i;

/**
 *
 * @param {string} dir
 * @returns
 */
function getIndexFile(dir) {
	const indexts = path.join(dir, "index.ts");
	if (fs.existsSync(indexts)) {
		return indexts;
	}
	const indextsx = path.join(dir, "index.tsx");
	if (fs.existsSync(indextsx)) {
		return indextsx;
	}
}

/**
 *
 * @param {string} root
 * @returns {string[]}
 */
function getBuildFiles(root, deep = true) {
	const files = [];

	for(const child of fs.readdirSync(root)){
		const file = path.join(root, child);
		const lstat = fs.lstatSync(file);

		if (lstat.isDirectory()) {
			const indexFile = getIndexFile(file);
			if (indexFile != null) {
				files.push(indexFile);
			} else if (deep) {
				files.push(getBuildFiles(file, false));
			}
		} else if (
			lstat.isFile() &&
			!ignoreRegExp.test(file) &&
			includeRegExp.test(file)
		) {
			files.push(file);
		}
	}
	
	return files.flat();
}

const plugins = [
	nodeResolve({
		extensions: [".js", ".json", ".tsx", ".ts"],
	}),
	swcPlugin(),
	cssCopyPlugin(),
];

const soruces = getBuildFiles(path.resolve("./", "src"));
const exports = {};

const config = soruces.flatMap((input) => {
	const dist = input.replace("src/", "dist/");
	const cjs = dist.replace(/\.tsx?/, ".js");
	const mjs = dist.replace(/\.tsx?/, ".mjs");

	const subpath =
		`./${path.relative("./src", input).replace(/\/index.tsx?|\.tsx?$/i, "")}`;

	exports[subpath] = {
		import: `./${path.relative("./", mjs)}`,
		require: `./${path.relative("./", cjs)}`,
		types: `./${path.relative("./", mjs).replace(/\.[cm]?js$/i, ".d.ts")}`,
	};

	const externalInternal = soruces.filter((x) => x !== input);

	const external = (source, importer, resolved) => {
		if (
			cssRegExp.exec(source) ||
			source.includes("node_modules") ||
			(importer != null && resolved && externalInternal.includes(source))
		) {
			return true;
		}
	};

	return [
		{
			input,
			external,
			plugins,
			output: {
				file: mjs,
				sourcemap: false,
			},
		},
		{
			input,
			external,
			plugins,
			output: {
				file: cjs,
				format: "cjs",
				sourcemap: false,
			},
		},
	];
});

console.log(JSON.stringify(exports));

export default config;
