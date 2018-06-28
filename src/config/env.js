/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 */
import { WY_IP_DEV, WY_IP_PRO } from "./ip";

let wyUrl = "";

if (process.env.NODE_ENV == "development") {
  // 本地环境 npm run dev
  wyUrl = WY_IP_DEV;
} else if (process.env.NODE_ENV == "production") {
  // 打包之后 npm run build
  wyUrl = WY_IP_PRO;
}

export { wyUrl };
