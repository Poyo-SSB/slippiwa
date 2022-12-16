import path from "path";

import { sveltekit } from "@sveltejs/kit/vite";
import type { UserConfig } from "vite";

const config: UserConfig = {
	plugins: [sveltekit()],
	resolve: {
		alias: {
			$ts: path.resolve("./src/ts"),
			$css: path.resolve("./src/css"),
			$components: path.resolve("./src/components"),
			$gql: path.resolve("./src/gql")
		}
	}
};

export default config;
