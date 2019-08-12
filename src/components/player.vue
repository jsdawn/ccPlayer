<template>
  <div>
    <!-- mini播放控件 -->
    <mini-play
      :current-music="currentMusic"
      :song-pic="song.picUrl"
      :no-song-msg="noSongMsg"
      :icon-name="iconStateClass"
      :percent="percent"
      @showFullPlay="showFullPlay"
      @showPlayList="showPlayList"
      @togglePlay="togglePlay"
    ></mini-play>
    <!-- 全屏播放控件 -->
    <full-play
      :full-screen="fullScreen"
      :current-music="currentMusic"
      :current-time="currentTime"
      :duration="duration"
      :song-pic="song.picUrl"
      :icon-mode="iconMode"
      :icon-name="iconStateClass"
      :percent="percent"
      :percent-buffered="percentBuffered"
      :playing-lyric="playingLyric"
      :currentLyric="currentLyric"
      :currentLineNum="currentLineNum"
      :isPureMusic="isPureMusic"
      @closeFull="setFullScreen(false)"
      @togglePlay="togglePlay"
      @changeMode="changeMode"
      @forward="forward"
      @next="next"
      @percentChanging="percentChanging"
      @percentChanged="percentChanged"
    ></full-play>
    <!-- 播放列表 -->
    <play-list
      ref="playList"
      :icon-mode="iconMode"
      @changeMode="changeMode"
    ></play-list>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import { getSongDetail, getSongUrl, getLyric } from "@/config/api";
import Lyric from "lyric-parser";
import audio from "./audio.js";
import miniPlay from "@/components/mini-play";
import fullPlay from "@/components/full-play";
import playList from "@/components/play-list";

export default {
  name: "playBar",
  data() {
    return {
      msgTimeout: null,
      noSongMsg: "Cc音乐 聆听TA的心声",
      song: { id: "", picUrl: "", songUrl: "", duration: "" }, //歌曲基本信息
      songReady: false, //歌曲是否准备完毕
      currentTime: 0, //当前时间
      duration: 0, //总时长
      percent: 0, //播放百分数
      percentBuffered: 0, //缓冲区百分数
      currentLyric: null, //歌词实例
      playingLyric: "", //当前播放的歌词行
      currentLineNum: 0, //当前歌词第几行
      isPureMusic: false, //纯净模式(无解析歌词)
      isMoving: false //是否正在移动滑块
    };
  },
  computed: {
    ...mapGetters([
      "audioEle",
      "playing",
      "mode",
      "playList",
      "currentIndex",
      "currentMusic",
      "fullScreen"
    ]),
    iconMode() {
      let iconModeName = "";
      if (this.mode == 0) {
        iconModeName = "icon-liebiaoxunhuan";
      } else if (this.mode == 1) {
        iconModeName = "icon-danquxunhuan";
      } else if (this.mode == 2) {
        iconModeName = "icon-suiji1";
      }
      return iconModeName;
    },
    iconStateClass() {
      return this.playing ? "icon-pause" : "icon-play";
    }
  },
  components: {
    miniPlay,
    fullPlay,
    playList
  },
  mounted() {
    this.$nextTick(() => {
      //初始化音乐实例
      audio.initAudio(this);
    });
  },
  watch: {
    currentMusic(newVal, oldVal) {
      this.songReady = false;
      if (this.currentLyric) {
        this.currentLyric.stop();
        // 重置为null
        this.currentLyric = null;
        this.currentTime = 0;
        this.playingLyric = "";
        this.currentLineNum = 0;
      }
      // 当前音乐改变，获取信息并播放
      this.songPlay();
    },
    playing(newVal, oldVal) {
      newVal ? this.audioEle.play() : this.audioEle.pause();
    }
  },
  methods: {
    ...mapMutations({
      setPlayingState: "SET_PLAYING_STATE",
      setMode: "SET_MODE",
      setCurrentIndex: "SET_CURRENT_INDEX",
      setCurrentMusic: "SET_CURRENT_MUSIC",
      setPlayList: "SET_PLAY_LIST",
      setFullScreen: "SET_FULL_SCREEN"
    }),
    changeMode() {
      //切换播放方式（顺序）
      var modeNow = (this.mode + 1) % 3;
      this.setMode(modeNow);
    },
    ready() {
      // 歌曲已开始播放
      this.songReady = true;
      // 如果歌曲的播放晚于歌词的出现，播放的时候需要同步歌词
      if (this.currentLyric && !this.isPureMusic) {
        this.currentLyric.seek(this.currentTime * 1000);
      }
    },
    pause() {
      if (this.currentLyric) {
        this.currentLyric.stop();
      }
    },
    percentChanging(percent) {
      //正在滑动进度条
      this.isMoving || (this.isMoving = true); //正在移动标识
      //如果滑动等于或者超过-则回退2秒
      this.currentTime =
        percent < 1 ? this.duration * percent : this.duration * percent - 2;
      if (this.currentLyric && !this.isPureMusic) {
        this.currentLyric.seek(this.currentTime * 1000);
        this.currentLyric.stop();
      }
    },
    percentChanged(percent) {
      //滑动结束，改变当前时刻
      this.isMoving = false;
      this.currentTime =
        percent < 1 ? this.duration * percent : this.duration * percent - 2;
      //同步播放时刻
      this.audioEle.currentTime = this.currentTime;
    },
    showFullPlay() {
      // 打开全屏
      this.currentIndex > -1 && this.setFullScreen(true);
    },
    showPlayList(){
      //打开播放列表
      this.$refs.playList.show();
    },
    togglePlay() {
      //切换播放
      if (this.currentIndex == -1) {
        this.msgTimeout && clearTimeout(this.msgTimeout);
        this.noSongMsg = "选择您想听的音乐~";
        this.msgTimeout = setTimeout(() => {
          this.noSongMsg = "Cc音乐 聆听TA的心声";
        }, 1000);
        return false;
      }
      this.setPlayingState(!this.playing);
    },
    next() {
      // 下一曲
      let nextIndex = 0;
      if(this.mode == 0){
        nextIndex = (this.currentIndex + 1) % this.playList.length;
        this.setCurrentIndex(nextIndex); //修改当前索引
        this.setCurrentMusic(nextIndex); //修改当前音乐
      }else if(this.mode == 1){
        this.audioEle.currentTime = 0;
        this.audioEle.play();
        this.setPlayingState(true);
        if(this.currentLyric && !this.isPureMusic){
          this.currentLyric.seek(0);
        }
      }else if(this.mode == 2){
        nextIndex = RandomNum(0,this.playList.length);
        this.setCurrentIndex(nextIndex); //修改当前索引
        this.setCurrentMusic(nextIndex); //修改当前音乐
        function RandomNum(Min, Max) {
          let Range = Max - Min;
          let Rand = Math.random();
          let num = Min + Math.floor(Rand * Range); //舍去
          return num;
        }
      }
    },
    forward() {
      // 上一曲
      let len = this.playList.length;
      let index = this.currentIndex === 0 ? len : this.currentIndex;
      let nextIndex = (index - 1) % len;
      this.setCurrentIndex(nextIndex); //修改当前索引
      this.setCurrentMusic(nextIndex); //修改当前音乐
    },
    lyricTogglePlay() {
      //歌词-播放/暂停
      if (this.songReady && this.currentLyric) {
        this.currentLyric.togglePlay();
      }
    },
    songPlay() {
      this.setPlayingState(false); //暂停播放
      this.getSongDetailFun(this.currentMusic.id); // 获取歌曲详情
      this.getLyricFun(this.currentMusic.id); // 获取歌词
    },
    async getSongDetailFun(ids) {
      // 获取歌曲详情
      let res = await getSongDetail(ids);
      if (!res) {
        return false;
      }
      this.$set(this.song, "id", res.songs[0].id); //更新歌曲id
      this.$set(this.song, "picUrl", res.songs[0].al.picUrl); //更新封面
      let resUrl = await getSongUrl(this.song.id);
      if (!resUrl) {
        return false;
      }
      this.$set(this.song, "songUrl", resUrl.data[0].url); //更新song的资源路径
      this.audioEle.src = this.song.songUrl;
      if (resUrl.data[0].url) {
        this.setPlayingState(true);
      }
    },
    async getLyricFun(id) {
      //获取歌词
      let res = await getLyric(id);
      if (res && res.code === 200) {
        if (!res.nolyric && res.lrc.lyric) {
          this.currentLyric = new Lyric(res.lrc.lyric, this.handleLyric);
          this.isPureMusic = !this.currentLyric.lines.length; //纯净模式(无解析歌词)
          if (this.isPureMusic) {
            // 如果没有解析出歌词
            this.playingLyric = "此歌曲没有歌词，请尽情欣赏音乐";
          } else {
            if (this.playing && this.songReady) {
              // 这个时候有可能用户已经播放了歌曲，要切到对应位置
              this.currentLyric.seek(this.currentTime * 1000);
            }
          }
        } else {
          this.isPureMusic = true;
          this.playingLyric = "该歌曲没有歌词，请尽情欣赏音乐";
        }
      } else {
        this.currentLyric = null;
        this.playingLyric = "";
        this.currentLineNum = 0;
      }
    },
    handleLyric({ lineNum, txt }) {
      // 歌词变动时
      this.playingLyric = txt;
      this.currentLineNum = lineNum
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/style/var.scss";
</style>


