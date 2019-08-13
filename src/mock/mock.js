import { wyUrl } from "@/config/env.js";
const Mock = require("mockjs");
import { apiConfig } from "@/config/api.js";

const Random = Mock.Random;
const code = 200;

function getUrl(url) {
  console.log("mock url：", url);
  return new RegExp(url);
}

// getBannerList
Mock.mock(
  getUrl(apiConfig.getBannerList.url),
  apiConfig.getBannerList.mock ? "" : "DELETE",
  req => {
    let res = {
      code: code,
      "result|1-2": [
        {
          id: "@guid",
          pic: "@dataImage('500x200')"
        }
      ]
    };
    console.log("request ：", req);
    console.log("response：", Mock.mock(res));
    return Mock.mock(res);
  }
);
