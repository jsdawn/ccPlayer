<template>
  <transition name="list-fade">
    <div class="playList" ref="playList" v-show="playListShow" @click="clickHide">
      <div class="list-wrapper">
        <div class="list-header">
          <h1 class="title">
            <i :class="['iconfont',iconMode]" @click="changeMode"></i>
            <span class="text">
              {{modeMsg}}
              <font>( {{playList.length}} )</font>
            </span>
            <i class="iconfont icon-shanchu"></i>
          </h1>
        </div>
        <div class="list-content">
          <!-- 音乐列表 -->
          <scroll class="list-scroll" ref="listScroll" :data="playList" :probe-type="probeType">
            <transition-group ref="list" name="list" class="song-list" tag="ul">
              <li class="item" v-for="(item,index) in playList" :key="item.id">
                <span class="iconCurrent">
                  <i class="iconfont icon-play" v-if="currentMusic.id===item.id"></i>
                </span>
                <span class="text" @click="select(item,index)">
                  {{item.name}}
                  <em>- {{item.artists[0].name}}</em>
                </span>
                <span class="opr">
                  <i class="iconfont icon-shachu"></i>
                </span>
              </li>
            </transition-group>
          </scroll>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import scroll from "@/base/scroll";
import { mapGetters, mapMutations, mapActions } from "vuex";
export default {
  data() {
    return {
      playListShow: false
    };
  },
  props: {
    iconMode: {
      type: String,
      required: true
    }
  },
  components: {
    scroll
  },
  computed: {
    ...mapGetters(["playList", "currentIndex", "currentMusic","mode"]),
    modeMsg(){
      let msg = ""
      if(this.mode == 0){
        msg = "顺序播放"
      }else if(this.mode == 1){
        msg = "单曲循环"
      }else if(this.mode == 2){
        msg = "随机播放"
      }
      return msg;
    }
  },
  created() {
    this.probeType = 3;
    this.listenScroll = true;
  },
  watch: {
    currentMusic(newVal, oldVal) {
      if (!this.playListShow || newVal.id === oldVal.id) {
        return;
      }
      setTimeout(() => {
        this.scrollToCurrent(newVal);
      }, 20);
    }
  },
  methods: {
    ...mapActions(["selectPlay"]),
    changeMode(){
      this.$emit("changeMode");
    },
    show() {
      this.playListShow = true;
      setTimeout(() => {
        this.$refs.listScroll.refresh();
        this.scrollToCurrent(this.currentMusic);
      }, 20);
    },
    hide() {
      this.playListShow = false;
    },
    clickHide(e) {
      if (e.target === this.$refs.playList) {
        this.playListShow = false;
      }
    },
    select(item, index) {
      this.selectPlay({
        list: this.playList,
        index
      });
    },
    scrollToCurrent(current) {
      const index = this.playList.findIndex(song => {
        return current.id === song.id;
      });
      this.$refs.listScroll.scrollToElement(
        this.$refs.list.$el.children[index],
        300
      );
    }
  }
};
</script>


<style lang="scss" scoped>
@import "../assets/style/var.scss";
.playList {
  position: fixed;
  z-index: 400;
  top: 0;
  bottom: 0;
  width: 100%;
  max-width: $width_page;
  background-color: rgba(0, 0, 0, 0.3);
  &.list-fade-enter-active,
  &.list-fade-leave-active {
    transition: opacity 0.4s;
    .list-wrapper {
      transition: all 0.4s;
    }
  }
  &.list-fade-enter,
  &.list-fade-leave-to {
    opacity: 0;
    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }
  .list-wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    font-size: 0.88rem;
    color: $color_text;
    background-color: $bgcolor_bar;
    border-top-left-radius: 0.7rem;
    border-top-right-radius: 0.7rem;
    .list-header {
      padding: 0 0.8rem;
      border-bottom: 1px solid $bgcolor_body;
      .iconfont:first-child {
        font-size: 1.5rem;
        padding: 0.2rem 0.5rem;
      }
      .iconfont:last-child {
        font-size: 1.2rem;
        padding: 0.2rem 0.5rem;
      }
      .title {
        display: flex;
        align-items: center;
        .text {
          flex: 1;
        }
      }
    }
    .list-content {
      height: 50vh;
      overflow: hidden;
      position: relative;
      .list-scroll {
        position: absolute;
        top: 0.3rem;
        bottom: 0.75rem;
        width: 100%;
        .item {
          padding: 0 0.88rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          &:active,
          &:hover {
            background-color: $bgcolor_body;
          }
          .text {
            flex: 1;
            line-height: 2.5rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-right: 0.5rem;
          }
          .iconCurrent {
            flex-basis: 30px;
            color: $color_bar_icon;
          }
          .opr {
            padding: 0 0.5rem;
            color: $color_bar_icon;
          }
        }
      }
    }
  }
}
</style>

