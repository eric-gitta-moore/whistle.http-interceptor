const os = require("os");
const path = require("path");
os.isAndroid = os.platform().includes("android");
if (os.isAndroid) {
  process.env.HOME = "/sdcard";
  os.homedir = () => "/sdcard";
  os.tmpdir = () => "/sdcard/.temp/";
}
process.env.RULES_DIR = path.join(os.homedir(), "whistle.http-handle.rules");
// console.log(`规则默认路径:${process.env.RULES_DIR}`);
