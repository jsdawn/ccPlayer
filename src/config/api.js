/**
 * 配置api接口服务
 * param-请求参数对象{id:"xxx"}
 *
 * post/get返回一个 Promise 对象 ,即api也返回这个 Promise 对象
 * getCom -  await getCom(param)
 * await - 等待Promise对象 resolve，得到 resolve 的值，作为 await 表达式的运算结果。
 */
import { wyUrl } from "./env";
import req from "./http";

export const apiConfig = {
  getBannerList: {
    url: `${wyUrl}/banner/list`,
    mock: true
  }
};

//获取banner数据
export const getBannerList = type => {
  const url = apiConfig.getBannerList.url;
  return req.get(url, {
    type: type
  });
};

//排行榜榜单
export const getTopList = idx => {
  const url = `${wyUrl}/top/list`;
  return req.get(url, {
    idx: idx
  });
};
//获取歌曲详情
export const getSongDetail = ids => {
  const url = `${wyUrl}/song/detail`;
  return req.get(url, {
    ids: ids
  });
};
//获取音乐 url
export const getSongUrl = id => {
  const url = `${wyUrl}/music/url`;
  return req.get(url, {
    id: id
  });
};
//获取推荐歌单
export const getRecommend = () => {
  const url = `${wyUrl}/personalized`;
  return req.get(url);
};
//获取歌单详情
export const getSongListDetail = id => {
  const url = `${wyUrl}/playlist/detail`;
  return req.get(url, {
    id: id
  });
};
//获取歌词
export const getLyric = id => {
  // const url = `${wyUrl}/lyric`;
  const url = `http://api.mtnhao.com/lyric`;
  return req.get(url, {
    id: id
  });
};
