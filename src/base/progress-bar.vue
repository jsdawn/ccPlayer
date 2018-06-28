<template>
    <section class="progress-bg">
        <div class="progress" ref="progress" @click="barClick">
            <div class="progress-bar" ref="progressBar"></div>
            <div class="progress-outer" ref="progressBuffered"></div>
            <div class="progress-inner" ref="progressCurrentTime" :style="{width:percent*100+'%'}">
                <div class="progress-dot" ref="progressDot" @mousedown="barDown" @touchstart.prevent="barDown"></div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
  name: "progressBar",
  data() {
    return {
      move: {
        status: false,
        startX: 0,
        left: 0
      }
    };
  },
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.bindEvents();
    });
  },
  methods: {
    barClick(e) {
      if (e.target === this.$refs.progressDot) {
        return -1;
      }
      let offsetX = e.offsetX;
      this.moveSilde(offsetX);
      this._triggerPercent();
    },
    //鼠标按下事件
    barDown(e) {
      this.move.status = true;
      this.move.startX = e.clientX || e.touches[0].pageX;
      this.move.left = this.$refs.progressCurrentTime.clientWidth;
    },
    //鼠标/触摸移动事件
    barMove(e) {
      if (!this.move.status) {
        return false;
      }
      let endX = e.clientX || e.touches[0].pageX;
      let dist = endX - this.move.startX;
      let offsetWidth = Math.min(
        this.$refs.progress.clientWidth,
        Math.max(0, this.move.left + dist)
      );
      this.moveSilde(offsetWidth);
      this.$emit("percentChanging", this._getPercent());
    },
    //鼠标/触摸释放事件
    barUp(e) {
      e.stopPropagation();
      if (!this.move.status) {
        return false;
      }
      this.move.status = false;
      this._triggerPercent();
    },
    //移动滑块
    moveSilde(offsetWidth) {
      this.$refs.progressCurrentTime.style.width = `${offsetWidth}px`;
    },
    //获取当前移动比
    _getPercent() {
      let lineWidth = this.$refs.progress.clientWidth;
      let percent = this.$refs.progressCurrentTime.clientWidth / lineWidth;
      return percent;
    },
    //修改percent
    _triggerPercent() {
      this.$emit("percentChanged", this._getPercent());
    },
    //添加绑定事件
    bindEvents() {
      let progress = this.$refs.progress;
      progress.addEventListener("mousemove", this.barMove);
      progress.addEventListener("mouseup", this.barUp);

      progress.addEventListener("touchmove", this.barMove);
      progress.addEventListener("touchend", this.barUp);
    },
    //移除绑定事件
    unbindEvents() {
      let progress = this.$refs.progress;
      progress.removeEventListener("mousemove", this.barMove);
      progress.removeEventListener("mouseup", this.barUp);

      progress.removeEventListener("touchmove", this.barMove);
      progress.removeEventListener("touchend", this.barUp);
    }
  },
  beforeDestroy() {
    this.unbindEvents();
  }
};
</script>


<style lang="scss" scoped>
@import "../assets/style/var.scss";
.progress-bg {
  padding: 0 0.5rem;
  position: relative;
  user-select: none;
  overflow: hidden;
  .progress {
    width: 100%;
    padding: 0.625rem 0;
    position: relative;
  }
  .progress-bar {
    width: 100%;
    height: 4px;
    background: $color_text2;
  }
  .progress-outer {
    position: absolute;
    top: 50%;
    left: 0;
    margin-top: -2px;
    width: 0;
    height: 4px;
    background: $color_text;
  }
  .progress-inner {
    position: absolute;
    top: 50%;
    left: 0;
    margin-top: -2px;
    width: 0;
    height: 4px;
    background: $color_active;
    .progress-dot {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: -0.5rem;
      width: 1rem;
      height: 1rem;
      border: 3px solid #fff;
      border-radius: 50%;
      background: #ffcd32;
    }
  }
}
</style>
