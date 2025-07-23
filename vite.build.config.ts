/**
 * 构建预依赖的包
 */
const peerDependencies = {
	axios: "axios",
};

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

export { peerDependencies, globalDependenciesMapping };
