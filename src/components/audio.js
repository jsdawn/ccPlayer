const audio = {
  initAudio(that) {
    let ele = that.audioEle;
    //   浏览器正在下载指定的音频或视频
    ele.onprogress = () => {
      if (ele.buffered.length > 0) {
        const duration = ele.duration;
        let buffered =
          ele.buffered.end(0) > duration ? duration : ele.buffered.end(0);
        that.percentBuffered = (buffered / duration) * 100 + "%";
      }
    };
    //   播放位置改变时触发
    ele.ontimeupdate = () => {
      const duration = ele.duration; //总时长
      if (!isNaN(duration)) {
        that.duration = duration;
      }
      let currentTime = ele.currentTime; //获取当前播放位置
      if (!that.isMoving) {
        //不处于移动状态
        that.currentTime = currentTime;
        that.percent = currentTime / duration;
      }
    };
    ele.onplaying = () => {
      //开始播放
      that.ready();
    };
    ele.onpause = () => {
      that.pause();
    };
    ele.onended = () => {
      that.next();
    };
    ele.onerror = () => {
      console.log("当前音乐不可播放");
    };
  }
};

export default audio;
