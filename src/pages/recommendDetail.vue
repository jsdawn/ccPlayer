<template>
  <div>
    <music-list :name="name" :pic-url="picUrl" :song-list="songList"></music-list>
  </div>
</template>
<script>
import musicList from "@/components/music-list";
import { getSongListDetail } from "@/config/api";
export default {
  data() {
    return {
      id: "", //歌单id
      name: "", //歌单名称
      picUrl: "", // 歌单封面
      songList: [] //歌单列表
    };
  },
  components: {
    musicList
  },
  created() {
    this.id = this.$route.params.id;
    this.picUrl = this.$route.params.picUrl;
    this.name = this.$route.params.name;
    if(!this.name){
      this.$router.back();
      return;
    }
    this.getSongListDetailFun();
  },
  methods: {
    async getSongListDetailFun() {
      let res = await getSongListDetail(this.id);
      if (res && res.code == 200) {
        this.songList = res.result.tracks;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

