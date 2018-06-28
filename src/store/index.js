import Vue from "vue";
import Vuex from "vuex";
import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters";

Vue.use(Vuex);

let state = {
  isLoading: false, //全局loading
  audioEle: null, //audio实例
  playing: false, //播放状态
  mode: 0, //播放方式 0-顺序，1-单曲，2-随机
  fullScreen: false, //是否开启全屏播放
  playList: [], //播放列表
  currentIndex: -1, //当前音乐索引
  currentMusic: null, //当前音乐
  musicList: [],
  historyList: [], //播放历史列表
  uid: null //网易云用户UID
};

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
});
