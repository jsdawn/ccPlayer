<template>
    <div class="mini-play">
        <div class="mini-info" @click="handlerInfo">
            <div class="info-img">
                <img v-if="songPic" :src="songPic">
            </div>
            <div class="info-title">
                <p>{{currentMusic?currentMusic.name:noSongMsg}}</p>
                <p>
                    {{this.currentMusic ? this.currentMusic.artists[0].name : ""}}
                    {{this.currentMusic ? " - " + this.currentMusic.album.name : ""}}
                </p>
            </div>
        </div>
        <div class="mini-icon">
            <i @click="handlerPlay" :class="['iconfont',iconName]"></i>
            <i @click="handlerList" class="iconfont icon-songlist"></i>
        </div>
        <!-- 播放进度条 -->
        <em class="mini-line" ref="barLine" :style="{'width':percent*100+'%'}"></em>
    </div>
</template>

<script>
export default {
  name: "miniPlay",
  props: {
    currentMusic: {
      //当前音乐
      required: true
    },
    songPic: {
      //当前音乐封面
      type: String,
      required: true
    },
    noSongMsg: {
      //无音乐时提示
      type: String,
      required: true
    },
    iconName:{
        type:String,
        required:true
    },
    percent:{
        type:Number,
        required:true
    }
  },
  methods: {
    handlerInfo() {
      this.$emit("showFullPlay");
    },
    handlerPlay() {
      this.$emit("togglePlay");
    },
    handlerList(){
      this.$emit("showPlayList");
    }
  }
};
</script>


<style lang="scss" scoped>
@import "../assets/style/var.scss";
.mini-play {
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: $width_page;
  z-index: 300;
  height: 3.75rem;
  padding: 0 0 0 1.25rem;
  background-color: $bgcolor_bar;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .mini-info {
    display: flex;
    align-items: center;
    width: 70%;
    font-size: 0.88rem;
    overflow: hidden;
    .info-img {
      flex-shrink: 0;
      width: 2.5rem;
      height: 2.5rem;
      background: $bgcolor_bar;
      border-radius: 100%;
      margin-right: 1rem;
      overflow: hidden;
      background-color: $bgcolor_body;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .info-title {
      max-width: 75%;
      p {
        width: 100%;
        color: $color_text2;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      p:first-child {
        color: $color_title;
        margin-bottom: 0.2rem;
      }
      p:last-child {
        font-size: 0.75rem;
      }
    }
  }
  .mini-icon {
    display: flex;
    align-items: center;
    color: $color_bar_icon;
    .iconfont {
      font-size: 2rem;
      padding: 0 0.625rem;
    }
    .iconfont:first-child {
      font-weight: bold;
    }
  }
  .mini-line {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 0.15rem;
    background-image: linear-gradient(
      90deg,
      $color_bar_icon 0%,
      $color_active 95%
    );
  }
}
</style>

