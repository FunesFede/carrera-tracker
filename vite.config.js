import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	base: "/",
	build: {
		outDir: "dist",
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	define: {
		"import.meta.env.VITE_CF_PAGES_COMMIT_SHA": JSON.stringify(process.env.CF_PAGES_COMMIT_SHA),
		"import.meta.env.VITE_CF_PAGES_BRANCH": JSON.stringify(process.env.CF_PAGES_BRANCH),
	},
});
