<template>
  <ul>
    <li class="list-item" v-for="(item,index) in songList" :key="index" @click="selectItem(item,index)">
      <p class="title">{{item.name}}</p>
      <p class="copywriter">{{item.artists[0].name}}{{item.album.name?(" - "+item.album.name):""}}</p>
    </li>
  </ul>
</template>
<script>
export default {
  props: {
    songList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    selectItem(item, index) {
      this.$emit("select", item, index);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/style/var.scss";
.list-item {
  font-size: 0.88rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 4rem;
  line-height: 1.5rem;
  .title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .copywriter {
    font-size: 0.75rem;
    color: $color_text2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>

