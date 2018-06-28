const getters = {
  //audio元素
  audioEle: state => state.audioEle,
  //播放状态
  playing: state => state.playing,
  //播放方式
  mode: state => state.mode,
  //全屏状态
  fullScreen: state => state.fullScreen,
  //播放列表
  playList: state => state.playList,
  //当前音乐索引
  currentIndex: state => state.currentIndex,
  //当前音乐
  currentMusic: state => state.currentMusic,
  //播放历史列表
  historyList: state => state.historyList,
  //网易云用户UID
  uid: state => state.uid
};

export default getters;
