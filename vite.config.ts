import { defineConfig } from "vite";
import { resolve } from "path";
import { globSync } from "fs";

import autoprefixer from "autoprefixer";
import webpHtmlPlugin from "./config/plugins/vite-plugin-webp-html";
import scriptOptimization from "./config/plugins/vite-plugin-script-optimization";
import copyAssets from "./config/plugins/vite-plugin-copy-assets";

import { PathResolverOptions, createPathPlugin } from "./config/abstractions/path-resolver";

// @ts-ignore
import viteHTMLIncludes from "@kingkongdevs/vite-plugin-html-includes";

// Build paths
const SRC_FOLDER = "src";
const BUILD_FOLDER = "website";

// Configure Vite
export default defineConfig(({ command, mode }) => {
	const isBuild = command === "build";

	return {
		root: SRC_FOLDER,
		base: "./",
		publicDir: "public",

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
			},
    },

		build: {
			outDir: `../${BUILD_FOLDER}`,
			emptyOutDir: true,
			assetsInclude: ["**/*.{png,jpg,jpeg,gif,svg,webp,avif}"],
			rollupOptions: {
				input: globSync(resolve(__dirname, "src", "**/*.html")),
				output: {
					entryFileNames: "js/[name].[hash].minify.js",
					chunkFileNames: "js/[name].[hash].minify.js",
					assetFileNames: assetInfo => {
						if (!assetInfo.names[0]) return "assets/[name][extname]";

						const srcPath = assetInfo.names[0].split("/src/").pop() || assetInfo.names[0];

						const extType = srcPath.split(".").at(-1);

						if (!extType) return "assets/default.[extname]";

						const dirPath = srcPath.split("/").slice(0, -1).join("/");

						if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp|avif/i.test(extType)) {
							if (dirPath.startsWith("img/")) {
								return `${dirPath}/[name][extname]`;
							}
							return `img/[name][extname]`;
						}

						if (/woff2?|ttf|otf|eot/i.test(extType)) {
							if (dirPath.startsWith("fonts/")) {
								return `${dirPath}/[name][extname]`;
							}
							return `fonts/[name][extname]`;
						}

						if (/css/i.test(extType)) {
							if (dirPath.startsWith("css/")) {
								return `${dirPath}/[name].minify[extname]`;
							}
							return `css/[name].[hash].minify[extname]`;
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
			// Copy Assets
			copyAssets(true, BUILD_FOLDER),

			// Images path handling
			createPathPlugin({
				name: "images",
				prefix: "@img",
				folder: "img/",
				devRoot: "src",
				prodRoot: BUILD_FOLDER
			}),

			// Fonts path plugin
			createPathPlugin({
				name: "fonts",
				prefix: "@fonts",
				folder: "fonts",
				devRoot: "src",
				prodRoot: BUILD_FOLDER
			}),

			// HTML includes
			viteHTMLIncludes({
				componentsPath: "/html/"
			}),

			// Script optimization
			scriptOptimization(),

			// WebP HTML support
			webpHtmlPlugin()
		]
	};
});
