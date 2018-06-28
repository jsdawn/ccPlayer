<template>
  <div id="app">
    <transition name="loading">
      <loading v-show="$store.state.isLoading"></loading>
    </transition>
    <router-view/>
    <audio ref="ccPlayer"></audio>
  </div>
</template>

<script>
import loading from "@/components/loading";
export default {
    name: "App",
    data() {
        return {};
    },
    components: {
        loading
    },
    created() {
        this.$nextTick(() => {
            this.audioEle = this.$refs.ccPlayer;
            this.$store.state.audioEle = this.audioEle;
        });
    }
};
</script>

<style lang="scss">
@import "./assets/style/init.css";
@import "./assets/style/common";
</style>
