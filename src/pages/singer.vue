<template>
    <div>
        <div class="content">
            <div class="todo">敬请期待~</div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
@import "../assets/style/var.scss";
.content {
  position: fixed;
  top: 5.5rem;
  bottom: 3.75rem;
  width: 100%;
  max-width: $width_page;
  overflow: hidden;
  .todo {
      text-align: center;
      margin-top: 5rem;
      color: $color_text;
  }
}
</style>

