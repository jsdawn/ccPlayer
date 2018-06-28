<template>
    <div>
        <scroll class="wrapper-box" :data="list" :refreshDelay="20">
            <div class="wrapper-content">
                <section class="slider-box">
                    <slider :loop="loop" :autoPlay="autoPlay">
                        <div class="slider-item">
                            <a href="http://y.gtimg.cn/music/common/upload/MUSIC_FOCUS/279936.jpg">
                                <img src="../images/banner1.jpg">
                            </a>
                        </div>
                        <div class="slider-item">
                            <a href="http://y.gtimg.cn/music/common/upload/MUSIC_FOCUS/279936.jpg">
                                <img src="../images/banner2.jpg">
                            </a>
                        </div>
                        <div class="slider-item">
                            <a href="http://y.gtimg.cn/music/common/upload/MUSIC_FOCUS/279936.jpg">
                                <img src="../images/banner3.jpg">
                            </a>
                        </div>
                        <div class="slider-item">
                            <a href="http://y.gtimg.cn/music/common/upload/MUSIC_FOCUS/279936.jpg">
                                <img src="../images/banner4.jpg">
                            </a>
                        </div>
                        <div class="slider-item">
                            <a href="http://y.gtimg.cn/music/common/upload/MUSIC_FOCUS/279936.jpg">
                                <img src="../images/banner5.jpg">
                            </a>
                        </div>
                    </slider>
                </section>
                <section class="recommend-list">
                    <h1>每日歌单推荐</h1>
                    <ul>
                        <li class="list-item" v-for="(item,index) in list" @click="toDetil(item)" :key="index">
                            <div class="item-img">
                                <img :src="item.picUrl">
                            </div>
                            <div class="item-info">
                                <p class="title" v-text="item.name"></p>
                                <p class="copywriter">
                                    <i class="iconfont icon-erji"></i>
                                    <em class="playCount" v-text="parseInt(item.playCount/10000)+'万'"></em>
                                </p>
                            </div>
                        </li>
                    </ul>
                </section>
            </div>
        </scroll>
        <transition name="fadeRight">
            <router-view></router-view>
        </transition>
    </div>
</template>
<script>
import scroll from "@/base/scroll";
import slider from "@/base/slider";
import { getRecommend } from "@/config/api";
export default {
  name: "recommend",
  data() {
    return {
      list: [],
      loop: true,
      autoPlay: true
    };
  },
  components: {
    scroll,
    slider
  },
  mounted() {
    this.getRecommendList();
  },
  methods: {
    async getRecommendList() {
      // 获取推荐歌单
      let res = await getRecommend();
      if (res.code == 200) {
        this.list = res.result;
      }
    },
    toDetil(item) {
      this.$router.push({
        name: "recommendDetail",
        params: {
          id: item.id,
          picUrl: item.picUrl,
          name: item.name
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../assets/style/var.scss";
.wrapper-box {
  position: fixed;
  top: 5.5rem;
  bottom: 3.75rem;
  width: 100%;
  max-width: $width_page;
  overflow: hidden;
}
.recommend-list {
  h1 {
    height: 4rem;
    line-height: 4rem;
    font-size: 0.88rem;
    color: $color_active;
    text-align: center;
  }
  .list-item {
    display: flex;
    padding: 0 1.25rem 1.25rem;
    font-size: 0.88rem;
    .item-img {
      flex-shrink: 0;
      padding-right: 1.25rem;
      img {
        width: 3.75rem;
      }
    }
    .item-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      white-space: nowrap;
      overflow: hidden;
      .title {
        margin-bottom: 0.625rem;
      }
      .copywriter {
        color: $color_text2;
        .playCount {
          margin-left: 0.5rem;
        }
      }
    }
  }
}
</style>

