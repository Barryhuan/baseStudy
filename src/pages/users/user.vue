<template>
  <div class="user-container full-screen">
    <header-top head-title="我的" onlyStatus="true"></header-top>
    <nav class="user-nav">
      <router-link
        to="/login"
        tag="dl"
        class="into-login"
      >
        <dt class="user-header-img">
          <img src="@i/default-user.svg" alt="">
        </dt>
        <dd class="user-info">
          <div class="user-info-l">
            <h3>登录 / 注册</h3>
            <p><i class="iconfont icon-phone"></i>暂无绑定手机号</p>
          </div>
          <i class="iconfont icon-arrow-r user-info-r"></i>
        </dd>
      </router-link>
    </nav>
    <main class="user-main">
      <div class="user-main-t">
        <router-link to="/" tag="dl">
          <dt><span>0.00</span>元</dt>
          <dd>我的余额</dd>
        </router-link>
        <router-link to="/" tag="dl">
          <dt><span>3</span>个</dt>
          <dd>我的优惠</dd>
        </router-link>
        <router-link to="/" tag="dl">
          <dt><span>0</span>分</dt>
          <dd>我的积分</dd>
        </router-link>
      </div>
      <div class="user-main-b">
        <router-link to="/order" tag="dl" class="into-page">
          <dt><i class="iconfont icon-user-order"></i>我的订单</dt>
          <dd><i class="iconfont icon-arrow-r"></i></dd>
        </router-link>
        <router-link to="/" tag="dl" class="into-page">
          <dt><i class="iconfont icon-points-mall"></i>积分商城</dt>
          <dd><i class="iconfont icon-arrow-r"></i></dd>
        </router-link>
        <router-link to="/" tag="dl" class="into-page">
          <dt><i class="iconfont icon-vip"></i>饿了么会员卡</dt>
          <dd><i class="iconfont icon-arrow-r"></i></dd>
        </router-link>
        <router-link to="/" tag="dl" class="into-page">
          <dt><i class="iconfont icon-serverce-centre"></i>服务中心</dt>
          <dd><i class="iconfont icon-arrow-r"></i></dd>
        </router-link>
        <router-link to="/" tag="dl" class="into-page">
          <dt><i class="iconfont icon-elm"></i>下载饿了么App</dt>
          <dd><i class="iconfont icon-arrow-r"></i></dd>
        </router-link>
      </div>
    </main>
    <footer-bottom />
  </div>
</template>
<script>
const HeaderTop = () => import('@com/headertop')
const FooterBottom = () => import('@com/footerbottom')
export default {
  data () {
    return {
    }
  },
  components: {
    FooterBottom,
    HeaderTop
  }
}
</script>
<style lang="less" scope>
  .user-container {
    .bg-c(#f5f5f5);
    .user-nav {
      .bg-c(#3190e8);
      .c(#fff);
      .h(90px);
      .pd(15px 12px);
      .into-login {
        .dp(f);
        .j-c(sb);
        .a-i(c);
        .user-header-img {
          .wh(60px, 60px);
          .bdr(50%);
          // .bg-c(#fff);
        }
        .user-info {
          .dp(f);
          .j-c(sb);
          .a-i(c);
          .w(80%);
          .iconfont {
            .ft-s(16px);
          }
          .user-info-l {
            .ft-s(16px);
            h3 {
              .pd(b, 5px);
            }
            p {
              .dp(f);
              .a-i(fe);
              .ft-s(12px);
              .icon-phone {
                .mg(r, 3px);
                .ft-s(18px);
              }
            }
          }
          .user-info-r {
            .ft-s(20px);
          }
        }
      }
    }
    .user-main {
      .user-main-t {
        .ps(rt);
        .dp(f);
        .wh(100%, 86px);
        .mg(b, 10px);
        .ft-s(16px);
        .bg-c(#fff);
        dl {
          .ps(rt);
          .flex-hv();
          .f-d(c);
          .w(33.33%);
          dt {
            .ft-s(14px);
            span {
              .ft-s(25px);
              .ft-w(600);
            }
          }
          &::before {
            content: '';
            .ps(ab);
            top: 0;
            right: 0;
            .wh(1px, 100%);
            .bg-c(#f5f5f5);
          }
        }
        &::before {
          content: '';
          .ps(ab);
          left: 0;
          bottom: 0;
          .wh(100%, 1px);
          .bg-c(#e4e4e4);
        }
        & dl:nth-of-type(1) dt span{
          .c(#f90);
        }
        & dl:nth-of-type(2) dt span{
          .c(#ff5f3e);
        }
        & dl:nth-of-type(3) dt span{
          .c(#6ac20b);
        }
        & dl:last-child::before {
          .w(0);
        }
      }
      .user-main-b {
        .ft-s(16px);
        .bg-c(#fff);
        .into-page {
          .ps(rt);
          .dp(f);
          .j-c(sb);
          .a-i(c);
          .pd(12px 15px);
          dt {
            .iconfont {
              .mg(r, 5px);
            }
          }
          &::before {
            content: '';
            .ps(ab);
            bottom: 0;
            left: 0;
            .wh(100%, 1px);
            .bg-c(#e4e4e4);
          }
        }
        & .into-page:nth-of-type(1) dt .iconfont {
          .c(#d81e06);
        }
        & .into-page:nth-of-type(2) dt .iconfont {
          .c(#fc7b53);
        }
        & .into-page:nth-of-type(3) dt .iconfont {
          .c(#ffc636);
        }
        & .into-page:nth-of-type(4) dt .iconfont {
          .c(#4aa5f0);
        }
        & .into-page:nth-of-type(5) dt .iconfont {
          .c(#3190e8);
        }
      }
    }
  }
</style>
