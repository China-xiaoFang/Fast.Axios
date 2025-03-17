/**
 * 构建预依赖的包
 */
const peerDependencies = {
	axios: "axios",
};

/**
 * 构建删除包
 */
const removedDevDependencies = [
	"@fast-china/eslint-config",
	"@rollup/plugin-terser",
	"@vue/tsconfig",
	"eslint",
	"prettier",
	"terser",
	"tsup",
	"typescript",
	"vite",
	"vite-plugin-dts",
	"vue-tsc",
];

/**
 * 构建全局包
 */
const globalDependenciesMapping = {
	"local-pkg": "_",
	lodash: "_",
	"lodash-es": "_",
	"lodash-unified": "_",
	unplugin: "_",
};

export { peerDependencies, removedDevDependencies, globalDependenciesMapping };
