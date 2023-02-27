import fs from "node:fs";
import path from "node:path";

const cssRe = /\.s?css$/;

function cssCopyPlugin(options = {}) {
	return {
		name: "copy-css",

		async renderChunk(_, chunk, outputOptions) {
			const { facadeModuleId } = chunk;
			const { file } = outputOptions;

			await Promise.all(
				chunk.imports.map((id) => {
					if (cssRe.test(id)) {
						new Promise((resolve) => {
							const destination = path.resolve(path.dirname(file), id);
							const source = path.resolve(path.dirname(facadeModuleId), id);
							const dir = path.dirname(destination);

							if (!fs.existsSync(dir)) {
								fs.mkdirSync(dir, { recursive: true });
							}

							fs.copyFile(source, destination, (err) => {
								if (err) {
									this.error(err);
								}
								resolve();
							});
						});
					}

					return Promise.resolve();
				}),
			);
			return null;
		},
	};
}

export { cssCopyPlugin };
