import path from "path";

import adapter from "@sveltejs/adapter-static";
import preprocess from "svelte-preprocess";

/** @type {import("@sveltejs/kit").Config} */
const config = {
	preprocess: preprocess(),

	kit: {
		adapter: adapter(),

		files: {
			routes: "src/pages"
		},

		browser: {
			router: false
		},

		prerender: {
			enabled: true
		},

		vite: {
			resolve: {
				alias: {
					$ts: path.resolve("./src/ts"),
					$css: path.resolve("./src/css"),
					$components: path.resolve("./src/components")
				}
			}
		}
	}
};

export default config;
