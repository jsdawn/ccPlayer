import * as types from "./mutation-types";

const mutations = {
  //修改audio元素
  [types.UPD_LOADING](state, flag) {
    state.isLoading = flag;
  },
  //修改audio元素
  [types.SET_AUDIO_ELE](state, audioEle) {
    state.audioEle = audioEle;
  },
  //修改播放状态
  [types.SET_PLAYING_STATE](state, flag) {
    state.playing = flag;
  },
  //修改播放方式
  [types.SET_MODE](state, num) {
    state.mode = num;
  },
  //修改是否全屏播放
  [types.SET_FULL_SCREEN](state, flag) {
    state.fullScreen = flag;
  },
  //修改播放列表
  [types.SET_PLAY_LIST](state, list) {
    state.playList = list;
  },
  //修改当前音乐索引
  [types.SET_CURRENT_INDEX](state, currentIndex) {
    state.currentIndex = currentIndex;
  },
  //修改当前音乐
  [types.SET_CURRENT_MUSIC](state, currentIndex) {
    state.currentMusic = state.playList[currentIndex] || {};
  },
  //修改播放历史列表
  [types.SET_HISTORY_LIST](state, historyList) {
    state.historyList = historyList;
  },
  //修改网易云用户UID
  [types.SET_UID](state, uid) {
    state.uid = uid;
  }
};

export default mutations;
