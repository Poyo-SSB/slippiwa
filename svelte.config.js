import vercel from "@sveltejs/adapter-vercel";
import preprocess from "svelte-preprocess";

/** @type {import("@sveltejs/kit").Config} */
const config = {
	preprocess: preprocess(),

	kit: {
		adapter: vercel(),

		files: {
			routes: "src/pages"
		}
	}
};

export default config;
