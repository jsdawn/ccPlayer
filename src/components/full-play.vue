<template>
  <transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
    <div class="normal-player" v-show="fullScreen">
      <div class="background">
        <img width="100%" height="100%" :src="songPic">
      </div>
      <!-- 头部 -->
      <div class="top">
        <span class="icon-lt" @click="close">
          <i class="iconfont icon-back"></i>
        </span>
        <p class="title">{{currentMusic?currentMusic.name:""}}</p>
        <p class="sub-title">
          {{this.currentMusic ? this.currentMusic.artists[0].name : ""}} {{this.currentMusic ? " - " + this.currentMusic.album.name : ""}}
        </p>
      </div>

      <div class="middle">
        <!-- cd和歌词 -->
        <div class="middle-l" ref="middleL" v-show="false">
          <div class="cd-wrapper" ref="cdWrapper">
            <div class="cd" ref="imageWrapper">
              <img ref="image" class="image" :src="songPic">
            </div>
          </div>
          <div class="playing-lyric-wrapper">
            <div class="playing-lyric">{{playingLyric}}</div>
          </div>
        </div>
        <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
          <div class="lyric-wrapper">
            <div v-if="currentLyric">
              <p ref="lyricLine" class="text" :class="{'current': currentLineNum ===index}" v-for="(line,index) in currentLyric.lines" :key="index">{{line.txt}}</p>
            </div>
            <div class="pure-music" v-show="isPureMusic">
                <p>{{playingLyric}}</p>
            </div>
          </div>
        </scroll>
      </div>
      <div class="bottom">
        <!-- 进度显示区 -->
        <div class="dot-wrapper"></div>
        <div class="progress-wrapper">
          <span class="time time-l">{{currentTimeFormat}}</span>
          <div class="progress-box">
            <progress-bar :percent="percent" @percentChanging="percentChanging" @percentChanged="percentChanged"></progress-bar>
          </div>
          <span class="time time-r">{{durationFormat}}</span>
        </div>
        <!-- 控件按钮 -->
        <div class="operators">
          <div class="icon icon-left">
            <i @click="changeMode" :class="['iconfont',iconMode]"></i>
          </div>
          <div class="icon icon-left">
            <i class="iconfont icon-forwardsong" @click="forward"></i>
          </div>
          <div class="icon icon-center">
            <i @click="togglePlay" :class="['iconfont',iconName]"></i>
          </div>
          <div class="icon icon-right">
            <i class="iconfont icon-nextsong" @click="next"></i>
          </div>
          <div class="icon icon-right">
            <i class="iconfont icon-xiai"></i>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import animations from "create-keyframe-animation";
import progressBar from "@/base/progress-bar";
import scroll from "@/base/scroll";
import { mapGetters, mapMutations, mapActions } from "vuex";
function formatTime(result) {
  result = parseInt(result);
  var h = Math.floor(result / 3600);
  var m = Math.floor((result / 60) % 60);
  var s = Math.floor(result % 60);
  return (result = (h > 0 ? h + ":" : "") + m + ":" + (s > 9 ? "" : "0") + s);
}
export default {
  name: "fullPlay",
  data() {
    return {};
  },
  components: {
    progressBar,
    scroll
  },
  props: {
    fullScreen: {
      type: Boolean,
      default: false
    },
    currentMusic: {
      //当前音乐
      required: true
    },
    currentTime: {
      //当前播放时刻
      type: Number,
      required: true
    },
    duration: {
      //当前歌曲总时长
      type: Number,
      required: true
    },
    songPic: {
      //当前音乐封面
      type: String,
      required: true
    },
    iconMode: {
      type: String,
      required: true
    },
    iconName: {
      type: String,
      required: true
    },
    percent: {
      type: Number,
      required: true
    },
    playingLyric: {
      //当前歌词（单行）
      type: String,
      default: ""
    },
    currentLyric: {
      //歌词
      required: true
    },
    currentLineNum: {
      //歌词
      type: Number,
      required: true
    },
    isPureMusic:{
      type:Boolean,
      required:true
    }
  },
  computed: {
    currentTimeFormat() {
      if (isNaN(this.currentTime)) {
        return formatTime(0);
      } else {
        return formatTime(this.currentTime);
      }
    },
    durationFormat() {
      return formatTime(this.duration);
    }
  },
  watch: {
    currentLineNum(newVal, oldVal) {
      if (newVal > 5) {
        let line = this.$refs.lyricLine[newVal - 5];
        this.$refs.lyricList.scrollToElement(line, 1000);
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000);
      }
    }
  },
  mounted(){
    console.log(this.isPureMusic);
  },
  methods: {
    changeMode() {
      this.$emit("changeMode");
    },
    percentChanging(percent) {
      this.$emit("percentChanging", percent);
    },
    percentChanged(percent) {
      this.$emit("percentChanged", percent);
    },
    close() {
      this.$emit("closeFull");
    },
    forward() {
      this.$emit("forward");
    },
    next() {
      this.$emit("next");
    },
    togglePlay() {
      this.$emit("togglePlay");
    },
    enter(el, done) {
      const { x, y, scale } = this._getPosAndScale();
      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      };
      animations.registerAnimation({
        name: "move",
        animation,
        presets: {
          duration: 400,
          easing: "linear"
        }
      });
      animations.runAnimation(this.$refs.cdWrapper, "move", done);
    },
    afterEnter() {
      animations.unregisterAnimation("move");
      this.$refs.cdWrapper.style.animation = "";
    },
    leave(el, done) {
      this.$refs.cdWrapper.style.transition = "all 0.4s";
      const { x, y, scale } = this._getPosAndScale();
      this.$refs.cdWrapper.style[
        "transform"
      ] = `translate3d(${x}px,${y}px,0) scale(${scale})`;
      const timer = setTimeout(done, 400);
      this.$refs.cdWrapper.addEventListener("transitionend", () => {
        clearTimeout(timer);
        done();
      });
    },
    afterLeave() {
      this.$refs.cdWrapper.style.transition = "";
      this.$refs.cdWrapper.style["transform"] = "";
    },
    _getPosAndScale() {
      const targetWidth = 40;
      const paddingLeft = 40;
      const paddingBottom = 30;
      const paddingTop = 80;
      const width = window.innerWidth * 0.8;
      const scale = targetWidth / width;
      const x = -(window.innerWidth / 2 - paddingLeft);
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
      return {
        x,
        y,
        scale
      };
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/style/var.scss";
.normal-player {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  max-width: $width_page;
  overflow: hidden;
  background-color: $bgcolor_body;
  z-index: 400;
  .background {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: 0.6;
    filter: blur(20px);
  }
  //   头部
  .top {
    position: relative;
    .title {
      line-height: 2.5rem;
      text-align: center;
      padding: 0 15%;
      font-size: 1.125rem;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .sub-title {
      line-height: 1.25rem;
      max-height: 2.5rem;
      text-align: center;
      font-size: 0.88rem;
      padding: 0 15%;
      color: #fff;
    }
    .icon-lt {
      position: absolute;
      display: block;
      top: -0.187rem;
      left: 0;
      transform: rotate(90deg);
      color: $color_active;
      padding: 0.3rem 0.7rem;
      .iconfont {
        font-size: 1.5rem;
      }
    }
  }
  .middle {
    position: fixed;
    top: 5.5rem;
    bottom: 10.6rem;
    width: 100%;
    max-width: $width_page;
    .middle-l {
      display: inline-block;
      vertical-align: top;
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 80%;
      .cd-wrapper {
        position: absolute;
        top: 0;
        left: 10%;
        width: 80%;
        height: 100%;
        .cd {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          .image {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border-radius: 50%;
            border: 10px solid hsla(0, 0%, 100%, 0.1);
          }
        }
      }
      .playing-lyric-wrapper {
        width: 80%;
        margin: 1.875rem auto 0;
        overflow: hidden;
        text-align: center;
        .playing-lyric {
          line-height: 1.25rem;
          font-size: 0.88rem;
          color: $color_text;
        }
      }
    }
    .middle-r {
      display: inline-block;
      vertical-align: top;
      width: 100%;
      height: 100%;
      overflow: hidden;
      .lyric-wrapper {
        width: 80%;
        margin: 0 auto;
        overflow: hidden;
        text-align: center;
        .text {
          line-height: 2rem;
          color: $color_text;
          font-size: 0.88rem;
          &.current {
            color: $color_title;
            line-height: 2.2rem;
            transform: scale(1.2);
          }
        }
        .pure-music {
          padding-top: 50%;
          line-height: 2rem;
          color: $color-text;
          font-size: 0.88rem;
        }
      }
    }
  }
  .bottom {
    position: absolute;
    bottom: 3rem;
    width: 100%;
    .progress-wrapper {
      display: flex;
      align-items: center;
      width: 80%;
      margin: 0 auto;
      .time {
        color: #fff;
        font-size: 0.75rem;
        -ms-flex: 0 0 2rem;
        flex: 0 0 2rem;
        line-height: 2rem;
        width: 2rem;
        text-align: center;
      }
      .progress-box {
        flex: 1;
      }
    }
    .operators {
      display: flex;
      align-items: center;
      .icon {
        flex: 1;
        color: $color_active;
        .iconfont {
          font-size: 1.875rem;
          font-weight: 600;
        }
      }
      .icon-left {
        text-align: right;
      }
      .icon-right {
        text-align: left;
      }
      .icon-center {
        text-align: center;
        padding: 0 1.25rem;
        .iconfont {
          font-size: 2.5rem;
        }
      }
      .active {
        color: #d93f30;
      }
    }
  }
  &.normal-enter-active,
  &.normal-leave-active {
    transition: all 0.4s;
    .top,
    .bottom {
      transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
    }
  }
  &.normal-enter,
  &.normal-leave-to {
    opacity: 0;
    .top {
      transform: translate3d(0, -100px, 0);
    }
    .bottom {
      transform: translate3d(0, 100px, 0);
    }
  }
}
</style>
