<template>
  <div>
    <h1>登录页</h1>
    <h3>用户名：</h3>
    <input type="text" v-model="user_name">
    <h3>密码：</h3>
    <input type="text" v-model="pass_word">
    <hr>
    <button @click="updUser">更新vuex-state</button>
    <h4 v-text="userName"></h4>
    <h4 v-text="password"></h4>
    <transition name="loading">
      <loading v-show="loading_show"></loading>
    </transition>
    <button @click="loading_show = !loading_show">toggle</button>
    <i class="iconfont icon-suo"></i>
    <button @click="closeWebPage">点击关闭</button>
    <br>
    <div class="yuan">
        <span>￥</span>
        <input class="inpt" placeholder="你好hellowarld">
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import loading from "@/components/loading";

export default {
  data() {
    return {
      loading_show: true, //是否显示加载动画
      user_name: null, //用户名
      pass_word: null //密码
    };
  },
  components: {
    loading
  },
  computed: {
    ...mapState(["userName", "password"])
  },
  mounted() {
    console.log(this.$store.state);
  },
  methods: {
    ...mapMutations(["UPD_USER"]),
    updUser() {
      const _this = this;
      const userInfo = {
        userName: _this.user_name,
        password: _this.pass_word
      };
      console.log(userInfo);
      this.UPD_USER(userInfo);
    },
    closeWebPage() {
      var userAgent = navigator.userAgent;
      if (
        userAgent.indexOf("Firefox") != -1 ||
        userAgent.indexOf("Chrome") != -1
      ) {
        window.location.href = "about:blank";
      } else if (
        userAgent.indexOf("Android") > -1 ||
        userAgent.indexOf("Linux") > -1
      ) {
        window.opener = null;
        window.open("about:blank", "_self", "").close();
      } else {
        window.opener = null;
        window.open("about:blank", "_self");
        window.close();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
$color: red;
h1 {
  color: $color;
}
.yuan {
  font-size: 40px;
  position: relative;
  padding-top: 10px;
}
.inpt {
  font-size: 40px;
  line-height: 40px;
}
.inpt::-webkit-input-placeholder {
  font-size: 16px;
  display: inline-block;
  position: absolute;
  top: 1px;
  left: 0;
}
</style>
