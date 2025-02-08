import path from "path";
import { __dirname, deleteFile, npmPackagePath } from "./file";

const deleteFiles = [
	"../tsconfig.tsbuildinfo",
	path.join(npmPackagePath, "Fast.png"),
	path.join(npmPackagePath, "LICENSE"),
	path.join(npmPackagePath, "README.md"),
	path.join(npmPackagePath, "README.zh.md"),
	path.join(npmPackagePath, "dist"),
	path.join(npmPackagePath, "es"),
	path.join(npmPackagePath, "lib"),
];

console.log(`
  清理文件中...
  `);

deleteFiles.forEach((pItem) => {
	deleteFile(path.resolve(__dirname, pItem));
});

console.log(`
  清理文件成功...
  `);
