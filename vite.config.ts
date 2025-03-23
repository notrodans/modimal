import { defineConfig } from "vite";
import path from "path";
import { globSync } from "fs";
import html from "@rollup/plugin-html";

import autoprefixer from "autoprefixer";
import vitePluginWebp from "./config/plugins/vite-plugin-webp";
import vitePluginPictureHtml from "./config/plugins/vite-plugin-webp-html";
import scriptOptimization from "./config/plugins/vite-plugin-script-optimization";

// @ts-expect-error no-types
import viteHTMLIncludes from "@kingkongdevs/vite-plugin-html-includes";

// Build paths
const SRC_FOLDER = "src";
const BUILD_FOLDER = "website";

export default defineConfig(() => {
	return {
		root: SRC_FOLDER,
		base: "./",
		publicDir: "public",

		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src")
			}
		},

		server: {
			port: 3000,
			host: true,
			open: true,
			hmr: true
		},

		css: {
			devSourcemap: true,
			postcss: {
				plugins: [autoprefixer()]
			}
		},

		build: {
			outDir: `../${BUILD_FOLDER}`,
			emptyOutDir: true,
			rollupOptions: {
				input: globSync(path.resolve(__dirname, "src/**/*.html")),
				output: {
					entryFileNames: "js/[name].[hash].minify.js",
					chunkFileNames: "js/[name].[hash].minify.js",
					assetFileNames: assetInfo => {
						if (!assetInfo.names[0]) return "assets/[name][extname]";

						const srcPath = assetInfo.names[0].split("/src/").pop() || assetInfo.names[0];

						const extType = srcPath.split(".").at(-1);

						if (!extType) return "assets/default.[extname]";

						const dirPath = srcPath.split("/").slice(0, -1).join("/");

						if (/css/i.test(extType)) {
							if (dirPath.startsWith("css/")) {
								return `${dirPath}/[name].minify[extname]`;
							}
							return `css/[name].[hash].minify[extname]`;
						}

						if (/html/i.test(extType)) {
							return "[name][extname]";
						}

						if (dirPath) {
							return `${dirPath}/[name][extname]`;
						}

						return `assets/[name][extname]`;
					}
				}
			}
		},

		plugins: [
			// HTML includes
			viteHTMLIncludes({
				componentsPath: "/html/"
			}),

			// Script optimization
			scriptOptimization(),

			// WebP HTML support
			vitePluginWebp(),
			vitePluginPictureHtml()
		]
	};
});
