import path from "path";
import { __dirname, copyFile, npmPackagePath } from "./file";

console.log(`
更新版权文件中...
`);

copyFile(path.resolve(__dirname, "../Fast.png"), npmPackagePath);
copyFile(path.resolve(__dirname, "../LICENSE"), npmPackagePath);
copyFile(path.resolve(__dirname, "../README.md"), npmPackagePath);
copyFile(path.resolve(__dirname, "../README.zh.md"), npmPackagePath);

console.log(`
更新版权文件成功...
`);
