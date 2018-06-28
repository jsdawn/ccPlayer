<template>
  <div class="musicList">
    <!-- 头部 -->
    <div class="nav" ref="nav">
      <span class="icon-lt" @click="$router.back()">
        <i class="iconfont icon-back"></i>
      </span>
      {{name}}
    </div>
    <!-- 图片 -->
    <div class="images-bg" :style="{backgroundImage:'url('+picUrl+')'}" ref="bgImage">
      <div class="play-btn" ref="playBtn">
        <i class="iconfont icon-play"></i>
        <em>随机播放全部</em>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <!-- 音乐列表 -->
    <scroll class="list" :data="songList" @scroll="scroll" :listen-scroll="listenScroll" :probe-type="probeType" ref="list">
      <div class="song-list">
        <song-list :song-list="songList" :rank="rank" @select="select"></song-list>
      </div>
    </scroll>
  </div>
</template>
<script>
import scroll from "@/base/scroll";
import songList from "@/components/song-list";
import { mapActions } from "vuex";

const transform = "transform";
const backdrop = "backdropFilter";
export default {
  name: "musicList",
  data() {
    return {
      scrollY: 0
    };
  },
  props: {
    //歌单名称
    name: {
      type: String,
      default: ""
    },
    // 歌单封面
    picUrl: {
      type: String,
      default: ""
    },
    //歌单列表
    songList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    //是否是排行榜
    rank: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.probeType = 3;
    this.listenScroll = true;
  },
  components: {
    scroll,
    songList
  },
  mounted() {
    this.$nextTick(() => {
      this.imageHeight = this.$refs.bgImage.clientHeight;
      this.navHeight = this.$refs.nav.clientHeight;
      this.minTransalteY = -this.imageHeight + this.navHeight;
      this.$refs.list.$el.style.top = `${this.imageHeight}px`;
    });
  },
  methods: {
    scroll(pos) {
      this.scrollY = pos.y;
    },
    select(item, index) {
      this.selectPlay({
        list: this.songList,
        index
      });
    },
    ...mapActions(["selectPlay"])
  },
  watch: {
    scrollY(newVal) {
      let translateY = Math.max(this.minTransalteY, newVal);
      let scale = 1;
      let zIndex = 0;
      let blur = 0;
      const percent = Math.abs(newVal / this.imageHeight);
      if (newVal > 0) {
        scale = 1 + percent;
        zIndex = 10;
      } else {
        blur = Math.min(20, percent * 20);
      }

      this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`;
      this.$refs.filter.style[backdrop] = `blur(${blur}px)`;
      if (newVal < this.minTransalteY) {
        zIndex = 10;
        this.$refs.bgImage.style.paddingTop = 0;
        this.$refs.bgImage.style.height = `${this.navHeight}px`;
        this.$refs.playBtn.style.display = "none";
      } else {
        this.$refs.bgImage.style.paddingTop = "70%";
        this.$refs.bgImage.style.height = 0;
        this.$refs.playBtn.style.display = "";
      }
      this.$refs.bgImage.style[transform] = `scale(${scale})`;
      this.$refs.bgImage.style.zIndex = zIndex;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/style/var.scss";
.musicList {
  position: fixed;
  z-index: 100;
  top: 0;
  bottom: 0;
  width: 100%;
  min-height: 100vh;
  max-width: $width_page;
  background: $bgcolor_body;
  //   头部
  .nav {
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 100;
    height: 2.7rem;
    line-height: 2.7rem;
    text-align: center;
    font-size: 1.125rem;
    padding: 0 15%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    .icon-lt {
      position: absolute;
      display: block;
      top: -0.187rem;
      left: 0;
      transform: rotate(180deg);
      color: $color_active;
      padding: 0 0.8rem;
      .iconfont {
        font-size: 1.5rem;
      }
    }
  }
  //   大图片
  .images-bg {
    background-size: cover;
    padding-top: 70%;
    height: 0px;
    position: relative;
    width: 100%;
    transform-origin: top;
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
    .play-btn {
      position: absolute;
      bottom: 1.25rem;
      left: 50%;
      margin-left: -4.215rem;
      box-sizing: border-box;
      width: 8.43rem;
      height: 2rem;
      line-height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid $color_active;
      color: $color_active;
      border-radius: 2rem;
      z-index: 10;
      em {
        font-size: 0.75rem;
        margin-left: 0.3rem;
      }
    }
  }
  .bg-layer {
    position: relative;
    height: 100%;
    background: #222;
  }
  //   列表
  .list {
    position: absolute;
    top: 0;
    bottom: 3.75rem;
    width: 100%;
    background: #222;
    .song-list {
      padding: 1.25rem 1.875rem;
    }
  }
}
</style>

