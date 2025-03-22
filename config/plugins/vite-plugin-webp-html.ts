import * as cheerio from "cheerio";

export default function webpHtmlPlugin() {
	return {
		name: "vite-plugin-webp-html",
		apply: "build",

		transformIndexHtml: {
			order: "post",
			handler(html: string) {
				if (process.argv.includes("--nowebp")) {
					return html;
				}

				return processHtml(html);
			}
		}
	};

	function processHtml(html: string) {
		const $ = cheerio.load(html);

		$("img").each(function () {
			const $img = $(this);
			const src = $img.attr("src");

			if (!src) {
				return;
			}

			// Skip SVG and data URIs
			if (src.toLowerCase().endsWith(".svg") || src.includes("data:image")) {
				return;
			}

			// Skip if already inside a picture tag
			if ($img.parents("picture").length > 0) {
				return;
			}

			// Create WebP path
			const webpSrc = replaceLastDot(src, ".webp");

			// Create new picture tag
			const $picture = $("<picture>");
			$picture.append(`<source srcset="${webpSrc}" type="image/webp">`);

			// Clone the img tag and remove src attribute to avoid duplicate loading
			const $newImg = $img.clone().removeAttr("src");
			$newImg.attr("src", src); // Set src as fallback
			$picture.append($newImg);

			// Replace img with picture
			$img.replaceWith($picture);
		});

		return $.html();
	}
}

function replaceLastDot(str: string, replacement: string) {
	const lastDotIndex = str.lastIndexOf(".");

	if (lastDotIndex !== -1) {
		return str.substring(0, lastDotIndex) + replacement;
	}

	return str;
}
