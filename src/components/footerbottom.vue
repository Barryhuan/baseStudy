<template>
  <!-- 底部组件 -->
  <footer class="footer-botton">
    <!-- 外卖 -->
    <router-link :to="{ path: '/shoplist', query: { geohash: geohash } }" class="link-item link-index">
      <i class="iconfont icon-elem-logo"></i>
      <p>外卖</p>
    </router-link>

    <!-- 搜索 -->
    <router-link :to="{ path: `/search/${ geohash }`}" class="link-item link-search">
      <i class="iconfont icon-search"></i>
      <p>搜索</p>
    </router-link>

    <!-- 订单 -->
    <router-link to="/order" class="link-item link-order">
      <i class="iconfont icon-order"></i>
      <p>订单</p>
    </router-link>

    <!-- 我的 -->
    <router-link to="/user" class="link-item link-user">
      <i class="iconfont icon-user"></i>
      <p>我的</p>
    </router-link>
  </footer>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
    }
  },
  computed: {
    ...mapState(['geohash'])
  }
}
</script>
<style lang="less" scope>
  .footer-botton {
    .ps(fx);
    bottom: 0;
    .dp(f);
    .wh(100%, 46px);
    .bd(t, 1px solid #e5e5e5);
    .bg-c(#fff);
    .z(999);
    .link-item {
      .flex-hv();
      .f-d(c);
      .w(25%);
      .c(#666666);
      .iconfont {
        .ft-s(16px);
      }
      p {
        .ft-s(12px);
      }
      &.router-link-active {
        .c(#3190e8);
      }
    }
  }

</style>
