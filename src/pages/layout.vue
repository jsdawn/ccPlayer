<template>
  <div class="layout">
    <!-- 头部 -->
    <header class="header">
      <img class="logo" src="../assets/img/icon_ccMusic.png">
      <span class="title">Cc Music</span>
      <span class="right-icon">
        <i class="iconfont icon-me"></i>
      </span>
    </header>
    <!-- tab标签 -->
    <section class="tab">
      <router-link tag="div" v-for="(item,index) in tabList" :to="item.path" :key="index" :class="{'tab-item':true, 'tab-item-active':tabSel==item.id}" @click.native="tabItemSel(item)">
        <span class="tab-link" v-text="item.name"></span>
      </router-link>
    </section>
    <!-- 主容器 -->
    <div class="container">
      <keep-alive :include="keepName">
        <router-view/>
      </keep-alive>
    </div>
    <!-- 音乐控件 -->
    <player></player>  
  </div>
</template>

<script>
import player from "@/components/player";
export default {
  data() {
    return {
      keepName: "recommend",
      tabList: [
        { id: "1", name: "推荐", path: "recommend" },
        { id: "2", name: "歌手", path: "singer" },
        { id: "3", name: "排行", path: "rank" },
        { id: "4", name: "搜索", path: "search" }
      ],
      tabSel: "1"
    };
  },
  components: {
    player
  },
  mounted() {},
  methods: {
    tabItemSel(item) {
      this.tabSel = item.id;
    }
  }
};
</script>


<style lang="scss" scoped>
@import "../assets/style/var.scss";
.layout {
  width: 100%;
  max-width: $width_page;
}
// 头部
.header {
  position: absolute;
  top: 0;
  width: 100%;
  max-width: $width_page;
  height: 2.75rem;
  line-height: 2.75rem;
  text-align: center;
  font-size: 1.125rem;
  color: $color_active;
  .logo {
    height: 2rem;
    width: auto;
    vertical-align: middle;
  }
  .right-icon {
    position: absolute;
    right: 0;
    padding: 0 1.25rem;
    .iconfont {
      font-size: 1.25rem;
    }
  }
}
// 标签页
.tab {
  position: absolute;
  top: 2.75rem;
  width: 100%;
  max-width: $width_page;
  display: flex;
  height: 2.75rem;
  line-height: 2.75rem;
  font-size: 0.88rem;
  color: $color_text;
  .tab-item {
    flex: 1;
    text-align: center;
    .tab-link {
      padding-bottom: 0.3rem;
      border-bottom: 0.125rem solid transparent;
    }
  }
  .tab-item-active {
    color: $color_active;
    .tab-link {
      border-bottom: 0.125rem solid $color_active;
    }
  }
}
</style>
