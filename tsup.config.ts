import { defineConfig } from "tsup";

const entry_points = ["src/array/index.ts", "src/types/index.ts"];

export default defineConfig((opts) => ({
	entry: entry_points,
	format: "esm",
	sourcemap: true,
	dts: true,
	clean: !opts.watch
}));
