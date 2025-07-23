import fastChinaFlat from "@fast-china/eslint-config/flat";
import { defineConfig } from "eslint/config";

export default defineConfig(...fastChinaFlat, {
	name: "@fast-china/utils/global",
	ignores: ["@fast-china/axios/*/"],
});
