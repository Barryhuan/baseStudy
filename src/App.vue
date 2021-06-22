<template>
  <div id="app" class="full-screen">
    <transition name="main-page">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
    </transition>
    <transition name="main-page">
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </transition>
  </div>
</template>
<script>
export default {
  data () {
    return {
    }
  }
}
</script>
<style lang="less" scope>
  html, body {
    .pd(0);
    .mg(0);
    .c(#333);
  }

  body::-webkit-scrollbar {
    .dp(n);
  }

  #app {
    .over(v);
  }

  .full-screen {
    .wh(100%, 100%);
    .over(at);
  }

  .iconfont {
    .ft-s(16px);
  }

  .main-page-enter-active, .main-page-leave-action {
    .trans(opacity .5s);
  }
  .main-page-enter, .main-page-leave-to {
    opacity: 0;
  }

</style>
