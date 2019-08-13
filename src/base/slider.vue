<template>
  <div
    class="slider"
    ref="slider"
    :style="{ opacity: during ? 1 : 0 }"
    @click="handleClick"
  >
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
      <!-- 插槽，外部引入slider的时候，slider包裹的节点会在这里面 -->
    </div>
    <div class="dots">
      <span
        class="dot"
        v-for="(item, index) in dots"
        :key="index"
        :class="{ active: currentPageIndex === index }"
      ></span>
    </div>
  </div>
</template>

<script type="text/javascript">
import BScroll from "better-scroll";
export default {
  props: {
    list: { type: Array, require: true },
    loop: { type: Boolean, default: true },
    autoPlay: { type: Boolean, default: true },
    interval: { type: Number, default: 3000 },
    isClick: { type: Boolean, default: false }
  },
  data() {
    return {
      during: false,
      dots: [],
      currentPageIndex: 0
    };
  },
  mounted() {
    // 完成挂载
    setTimeout(() => {
      this._setSliderWidth();
      this._initDots();
      this._initSlider();
      this.during = true;
      if (this.autoPlay) {
        this._play();
      }
    }, 20); // 浏览器的刷新一般是17毫秒

    window.addEventListener("resize", () => {
      if (!this.slider) {
        // slider还没有初始化的时候
        return;
      }
      this._setSliderWidth(true);
      this.slider.refresh(); // 宽度发生变化则重新计算
    });
  },
  methods: {
    handleClick() {
      this.$emit("onselect", this.list[this.currentPageIndex]);
    },
    // 方法
    _setSliderWidth(isResize) {
      // 计算宽度
      this.children = this.$refs.sliderGroup.children;

      let width = 0;
      let sliderWidth = this.$refs.slider.clientWidth;
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i];
        child.style.width = sliderWidth + "px";
        width += sliderWidth;
      }
      if (this.loop && !isResize && this.children.length > 1) {
        // 如果是轮播图&&如果是resize的情况下
        width += 2 * sliderWidth;
      }
      this.$refs.sliderGroup.style.width = width + "px";
    },
    _initDots() {
      // 初始化点的数量
      this.dots = new Array(this.children.length); // 长度根据节点length
    },
    _initSlider() {
      // 初始化
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true, // 滚动方向
        scrollY: false,
        momentum: false, // 当快速滑动时是否开启滑动惯性
        snap: {
          // 为slider组件使用
          loop: this.loop, // 是否无缝循环轮播
          threshold: 0.3, // 用手指滑动时页面可切换的阀值，大于这个阀值时可以滑动到下一页
          speed: 400 // 轮播图切换的动画时间
        },
        click: this.isClick // 是否派发click事件
      });

      this.slider.on("scrollEnd", () => {
        // 派发scrollEnd事件,获取当前页currentPageIndex
        let pageIndex = this.slider.getCurrentPage().pageX; // 获取索引
        /*  if (this.loop) { // 如果是循环
             pageIndex += 0 // 因为循环模式下默认会节点拷贝了，所以实际index 应该 -1
          } */

        this.currentPageIndex = pageIndex; // 赋值给当前currentPageIndex

        if (this.autoPlay) {
          // 判断如果是自动轮播
          clearTimeout(this.timer);
          this._play();
        }
      });
    },
    _play() {
      clearTimeout(this.timer);
      if (this.list.length > 1) {
        this.timer = setTimeout(() => {
          this.slider.next(); // 下一个
        }, this.interval);
      }
    }
  },
  components: {}
};
</script>
<style scoped>
.slider {
  min-height: 1px;
  position: relative;
}

.slider-group {
  position: relative;
  overflow: hidden;
  white-space: nowrap;
}

.slider-item {
  float: left;
  box-sizing: border-box;
  overflow: hidden;
  text-align: center;
  /* min-height: 150px; */
  overflow: hidden;
}

.slider-item a {
  display: block;
  width: 100%;
  overflow: hidden;
  text-decoration: none;
}

.slider-item img {
  display: block;
  width: 100%;
}

.dots {
  position: absolute;
  right: 0;
  left: 0;
  bottom: 12px;
  text-align: center;
  font-size: 0;
}

.dot {
  display: inline-block;
  margin: 0 4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: hsla(0, 0%, 100%, 0.5);
}

.active {
  width: 20px;
  border-radius: 5px;
  background: hsla(0, 0%, 100%, 0.8);
}
</style>
