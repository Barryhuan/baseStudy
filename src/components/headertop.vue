<template>
  <header class="head-top" :class="{ only: onlyStatus, back: backStatus }">
    <slot name="logo"></slot>
    <slot name="search"></slot>
    <div class="back-history" v-if="goBack">
      <i class="iconfont icon-arrow-l" @click="$router.go(-1);closeOver()"></i>
    </div>
    <slot name="shoplist-title"></slot>

    <!-- 登录注册 -->
    <router-link :to="userInfo ? '/user' : '/login'" v-if="signinUp">
      <span class="login-link" v-if="signinUp === 'home'" >登录 | 注册</span>
      <span class="login-link" v-else>登录</span>
    </router-link>

    <!-- 头部标题 -->
    <div class="head-title" v-if="headTitle">
      <span>{{ headTitle }}</span>
    </div>

    <!-- 切换城市 -->
    <slot name="change-city"></slot>
  </header>
</template>
<script>
import { mapState } from 'vuex'
export default {
  props: ['signinUp', 'headTitle', 'goBack', 'closeStatus', 'onlyStatus', 'backStatus'],
  data () {
    return {
    }
  },
  methods: {
    closeOver () {
      if (this.closeStatus) {
        document.body.classList.remove('no-scroll')
      }
    }
  },
  computed: {
    ...mapState(['userInfo'])
  }
}
</script>
<style lang="less" scope>
  body {
    .pd(t, 45px);
  }

  .head-top {
    .ps(fx);
    top: 0;
    left: 0;
    .dp(f);
    .j-c(sb);
    .a-i(c);
    .wh(100%, 45px);
    .pd(0 10px);
    .ft-s(16px);
    .c(#FFF);
    .bg-c(#3190e8);
    z-index: 99;
    .back-history {
      .w(20%);
      .txt-a(l);
      .icon-arrow-l {
        .ft-s(25px);
      }
    }
    .head-title {
      .w(40%);
      .txt-a(c);
    }
  }
  .only {
    .j-c(c);
  }
  .back {
    .j-c(fs);
    .back-history {
      .w(33.33%);
    }
    .head-title {
      .w(33.33%);
    }
  }
</style>
