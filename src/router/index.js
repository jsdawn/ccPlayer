import Vue from "vue";
import Router from "vue-router";
import store from "../store";
Vue.use(Router);

// 异步加载组件
const layout = r =>
  require.ensure([], () => r(require("@/pages/layout")), "layout"); //ccMusic 框架
const recommend = r =>
  require.ensure([], () => r(require("@/pages/recommend")), "recommend"); //ccMusic 推荐页
const recommendDetail = r =>
  require.ensure(
    [],
    () => r(require("@/pages/recommendDetail")),
    "recommendDetail"
  ); //ccMusic 推荐歌单详情
const singer = r =>
  require.ensure([], () => r(require("@/pages/singer")), "singer"); //ccMusic 歌手页
const rank = r => require.ensure([], () => r(require("@/pages/rank")), "rank"); //ccMusic 排行页
const search = r =>
  require.ensure([], () => r(require("@/pages/search")), "search"); //ccMusic 搜索页
//路由列表
const routes = [
  {
    path: "/",
    name: "layout",
    component: layout,
    redirect: "/recommend",
    children: [
      {
        path: "recommend",
        name: "recommend",
        component: recommend,
        children: [
          {
            path: ":id",
            name: "recommendDetail",
            component: recommendDetail
          }
        ]
      },
      {
        path: "singer",
        name: "singer",
        component: singer
      },
      {
        path: "rank",
        name: "rank",
        component: rank
      },
      {
        path: "search",
        name: "search",
        component: search
      }
    ]
  }
];

//最后创建router 对路由进行管理，它是由构造函数 new vueRouter() 创建，接受routes 参数。
const router = new Router({
  routes
});

//全局 loading 列表name值,需要loading的页面插入列表
let loadList = ["home"];
//路由守卫
router.beforeEach((to, from, next) => {
  let newLoadList = loadList.filter(item => {
    return item === to.name; //过滤列表
  });
  //过滤loading列表，存在则显示loading
  if (newLoadList.length > 0) {
    store.commit("UPD_LOADING", true);
  } else {
    store.commit("UPD_LOADING", false);
  }
  next();
});

export default router;
