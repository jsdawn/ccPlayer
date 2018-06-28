/**
 * 二次封装axios文件
 * resolve 返回 Promise对象
 * 成功-返回数据，失败-返回undefined
 */

import axios from "axios";

let cancel,
  promiseArr = {};
const CancelToken = axios.CancelToken;
let instance = axios.create(); //实例化一个axios

//请求拦截器
instance.interceptors.request.use(
  config => {
    //发起请求时，取消掉当前正在进行的相同请求
    if (promiseArr[config.url]) {
      promiseArr[config.url]("cancel");
      promiseArr[config.url] = cancel;
    } else {
      promiseArr[config.url] = cancel;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

//响应拦截器-即异常处理
instance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // 如果有错误响应消息
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          error.message = "错误请求";
          break;
        case 401:
          error.message = "未授权，HTTP基本认证不通过";
          break;
        case 403:
          error.message = "拒绝访问";
          break;
        case 404:
          error.message = "请求错误,未找到该资源";
          break;
        case 405:
          error.message = "请求方法未允许";
          break;
        case 408:
          error.message = "请求超时";
          break;
        case 500:
          error.message = "服务器端出错"; // 5xx 服务器端错误
          break;
        case 501:
          error.message = "网络未实现";
          break;
        case 502:
          error.message = "网络错误";
          break;
        case 503:
          error.message = "服务不可用";
          break;
        case 504:
          error.message = "网络超时";
          break;
        case 505:
          error.message = "http版本不支持该请求";
          break;
        default:
          error.message = `连接错误${error.response.status}`;
      }
      alert(error.message); //反馈信息给用户
    } else {
      // 无错误响应信息-未连接到服务器
      let errStr = error + "";
      // 处理客户端错误信息
      if (errStr.indexOf("cancel") > -1) {
        console.log("上一条请求被取消"); //取消上一条未完成的相同操作，用户主动错误-可不反馈给用户
      } else if (errStr.indexOf("timeout") > -1) {
        alert("请求信息超时"); //请求超时弹出错误信息
      } else if (errStr.indexOf("Network") > -1) {
        alert("网络异常"); //网络异常弹出错误信息（有可能是服务器未启动）
      } else {
        alert("连接服务器失败"); //未知错误
      }
    }
    // 抛出异常
    return Promise.resolve(false);
  }
);

// 设置基础路径
// instance.defaults.baseURL = baseUrl;
//设置默认请求头
/* instance.defaults.headers = {
  "X-Requested-With": "XMLHttpRequest",
}; */
// 设置超时时间
instance.defaults.timeout = 5000;

export default {
  //get请求
  get(url, param={}) {
    return new Promise((resolve, reject) => {
      instance({
        method: "get",
        url,
        params: param,
        cancelToken: new CancelToken(c => {
          cancel = c;
        })
      }).then(res => {
        resolve(res.data);
      });
    });
  },
  //post请求
  post(url, param={}) {
    return new Promise((resolve, reject) => {
      instance({
        method: "post",
        url,
        data: param,
        cancelToken: new CancelToken(c => {
          cancel = c;
        })
      }).then(res => {
        resolve(res.data);
      });
    });
  }
};
