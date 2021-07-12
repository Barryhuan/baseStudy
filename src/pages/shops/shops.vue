<template>
  <div class="shops-container full-screen">
    <!-- 头部组件 -->
    <header-top
      goBack="true"
      backStatus="true"
      :headTitle="shopDetails.name"
    ></header-top>

    <!-- 商铺信息 -->
    <div class="shops-info" ref="shops_info">
      <div class="shops-header-content">
        <router-link to="/shops/shopsdetail" class="shop-msg">
          <!-- 商铺头像 -->
          <div class="header-content-l">
            <img :src="imgBaseUrl + shopDetails.image_path" alt="" />
          </div>
          <!-- 商铺公告 -->
          <div class="header-content-r">
            <div>
              <p class="content-r-info">
                商家配送 / {{ shopDetails.order_lead_time }}分钟送达 /
                配送费￥{{ shopDetails.float_delivery_fee }}
              </p>
              <p class="content-r-notice">
                公告：{{ shopDetails.promotion_info }}
              </p>
            </div>
            <div>
              <i class="iconfont icon-arrow-r"></i>
            </div>
          </div>
        </router-link>
        <!-- 商铺活动 -->
        <div
          class="shops-active"
          v-if="shopDetails.activities && shopDetails.activities.length"
        >
          <div class="active-l">
            <span
              :style="{
                backgroundColor: '#' + shopDetails.activities[0].icon_color,
                border: '#' + shopDetails.activities[0].icon_color
              }"
            >
              {{ shopDetails.activities[0].icon_name }}
            </span>
            <p>{{ shopDetails.activities[0].description }} (App专享)</p>
          </div>
          <div class="active-r">
            <span>{{ shopDetails.activities.length }}个活动</span>
            <i class="iconfont icon-arrow-r"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- 菜单栏切换 -->
    <div class="chang-type">
      <div :class="{ activeType: changeShowType === 'food' }" @click="changeShowType = 'food'">
        <span>商品</span>
      </div>
      <div :class="{ activeType: changeShowType === 'rating' }" @click="changeShowType = 'rating'">
        <span>评价</span>
      </div>
    </div>

    <!-- 左侧菜单选购界面 -->
    <transition name="fade-close">
      <div class="panel-container" v-show="changeShowType === 'food'">
        <div class="menu-container"  v-if="shopMenuList">
          <!-- 左侧-->
          <div class="food-menu-left">
            <ul>
              <li v-for="(item, index) in shopMenuList" :key="index" class="menu-left">
                <span>{{ item.name }}</span>
              </li>
            </ul>
          </div>
          <!-- 右侧-->
          <div class="food-menu-right">
            <ul>
              <li class="menu-right" v-for="(item, index) in shopMenuList" :key="index">
                <div class="menu-right-title">
                  <h4>{{ item.name }} <span>{{ item.description }}</span></h4>
                  <span>...</span>
                  <div class="mune-right-tips" style="display: none;">
                    <p>{{ item.name + item.description }}</p>
                  </div>
                </div>
                <div class="menu-right-list" v-for="( foodItem, foodIndex ) in item.foods" :key="foodIndex">
                   <router-link class="food-item-link" to="">
                    <div class="menu-food-img">
                      <img :src="imgBaseUrl + foodItem.image_path" alt="">
                    </div>
                    <div class="menu-food-info">
                      <div class="food-info-top">
                        <div class="info-title">
                          <strong>{{ foodItem.name }}</strong>
                          <div v-if="foodItem.attributes && foodItem.attributes.length">
                            <ul v-if="foodItem.attributes[0] && Object.keys(foodItem.attributes[0]).length">
                              <li v-for="(tagItem, tagIndex) in foodItem.attributes"
                              :key="tagIndex"
                              :style="{
                                color: '#' + tagItem.icon_color,
                                borderColor: '#' + tagItem.icon_color
                              }">
                                {{ tagItem.icon_name }}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div class="food-info-description">
                        {{ foodItem.description }}
                      </div>
                      <div class="food-info-month">
                        月售{{ foodItem.month_sales }}份 好评率{{ foodItem.satisfy_rate }}%
                      </div>
                      <span class="food-info-activity"
                        v-if="foodItem.activity"
                        :style="{
                          color: '#' + foodItem.activity.image_text_color,
                          borderColor: '#' + foodItem.icon_color
                        }">
                        {{ foodItem.activity.image_text }}
                      </span>
                    </div>
                  </router-link>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </transition>

    <!-- 右侧评价界面 -->
    <transition name="fade-close">
      <div class="panel-container" v-show="changeShowType === 'rating'">
        <div class="rating-container">评价</div>
      </div>
    </transition>
  </div>
</template>
<script>
import {
  shopDetailsApi, // ~ 商铺详情
  shopMenuListApi, // ~ 商品菜单
  ratingListApi, // ~ 商品评价列表
  ratingScoresDataApi, // ~ 商铺评价分数
  ratingTagsApi // ~ 商铺评价分类
} from '@/api/'
import { mapState } from 'vuex'
import { saveCurrentState } from '@/utils/'

const HeaderTop = () => import('@com/headertop')
export default {
  data () {
    return {
      geohash: '', // ~ 位置信息
      shopId: '', // ~ 商铺Id
      shopLoading: true, // ~ 显示动画
      ratingOffset: 0, // ~ 评价获取数据的offset值
      shopDetails: {}, // ~ 商铺详情
      shopMenuList: [], // ~ 商铺菜品详情
      ratingList: [], // ~ 商品评价列表
      ratingScoresData: {}, // ~ 商铺评价分数
      ratingTags: [], // ~ 商铺评价分类
      windowHeight: 0, // ~ 屏幕高度（为滚动插件做初始话准备）
      showActivi: false, // ~ 是否显示商铺活动
      imgBaseUrl: '//elm.cangdu.org/img/', // ~ 图片基础
      changeShowType: 'food'
    }
  },
  // ~ 初始化获取经纬度信息
  created () {
    this.geohash = this.$route.query.geohash
    this.shopId = this.$route.query.id
  },
  mounted () {
    this.init()
    this.windowHeight = window.innerHeight
  },
  // ~ 初始化请求
  methods: {
    async init () {
      if (!this.latitude) {
        saveCurrentState(this.$store)
      }
      this.shopDetails = await shopDetailsApi(
        this.shopId,
        this.latitude,
        this.longitude
      )
      this.shopMenuList = await shopMenuListApi(this.shopId)
      this.ratingList = await ratingListApi(this.shopId, this.ratingOffset)
      this.ratingScoresData = await ratingScoresDataApi(this.shopId)
      this.ratingTags = await ratingTagsApi(this.shopId)
    }
  },
  computed: {
    ...mapState(['latitude', 'longitude', 'carlist'])
  },
  components: { HeaderTop }
}
</script>
<style lang="less" scope>
.shops-container {
  // .over(h);
  .ft-s(16px);
  .shops-info {
    .ps(rt);
    .pd(5px 5px 12px 7px);
    .ft-s(12px);
    .bg(linear-gradient(180deg, #3190e8, #0078db));
    .c(#fff);
    .iconfont {
      .ft-s(25px);
    }
    .shops-header-content {
      .shop-msg {
        .dp(f);
        .j-c(sb);
        .header-content-l {
          .wh(68px, 68px);
          img {
            .wh(100%, 100%);
            .bdr(4px);
          }
        }
        .header-content-r {
          .dp(f);
          .j-c(sb);
          .w(79%);
          div {
            .dp(f);
            .f-d(c);
            .j-c(c);
          }
          & div:first-child {
            .j-c(se);
          }
        }
      }
      .shops-active {
        .dp(f);
        .j-c(sb);
        .a-i(c);
        .w(100%);
        .mg(t, 10px);
        .active-l {
          .dp(f);
          .a-i(c);
          span {
            .dp(f);
            .j-c(c);
            .a-i(c);
            .pd(1px 3px);
            .mg(r, 5px);
            .c(#fff);
            .bdr(3px);
          }
        }
        .active-r {
          .dp(f);
          .a-i(c);
        }
      }
    }
  }
  .chang-type {
    .dp(f);
    .bd(b, 1px solid #eee);
    div {
      .flex-hv();
      .wh(50%, 50px);
      span {
        .trans(border .2s ease);
        .pd(b, 5px);
        .bd(b, 2px solid transparent);
      }
      &.activeType span {
        .dp(ib);
        .bd(b, 2px solid #3778eb);
      }
    }
  }
  .panel-container {
    .h(100%);
    .menu-container {
      .dp(f);
      .h(100%);
      .food-menu-left {
        .wh(25%, 100%);
        .bg-c(#f2f2f2);
        .menu-left {
          .ps(rt);
          .pd(14px 12px);
          .ellipsis();
          &.menu-left-active {
            .bg-c(#fff);
            &::before {
              content: '';
              .ps(ab);
              top: 0;
              left: 0;
              .wh(2px, 100%);
              .bg-c(#3778eb);
            }
          }
        }
      }
      .food-menu-right {
        .w(75%);
        .menu-right {
          .menu-right-title {
            .dp(f);
            .j-c(sb);
            .a-i(c);
            .pd(10px 8px 10px 12px);
            .bg-c(#f2f2f2);
            .c(#686868);
            h4 > span {
              .ft-s(12px);
              .ft-w(400);
              .c(#a2a2a2);
            }
            & > span {
              .pd(b, 8px);
              .c(#a2a2a2);
            }
          }
          .menu-right-list {
            .bd(b, 1px solid #eee);
            .food-item-link {
              .dp(f);
              .a-i(c);
              .pd(10px);
              .ft-s(14px);
              .menu-food-img {
                .w(86px);
                .bdr(5px);
                img {
                  .wh(86px, 86px);
                  .bd(1px solid #eee);
                  .bdr(5px);
                }
              }
              .menu-food-info {
                .w(63%);
                .mg(l, 20px);
                .info-title {
                  .dp(f);
                  .j-c(sb);
                  .w(100%);
                  strong {
                    .ellipsis();
                    .w(60%);
                    .ft-s(17px);
                  }
                  ul {
                    .dp(f);
                    li {
                      .pd(2px);
                      .bd(1px solid #000);
                      .ft-s(12px);
                      .bdr(5px);
                      .tranf(scale(.8));
                    }
                  }
                }
                .food-info-description {
                  .w(90%);
                  .ellipsis();
                  .pd(3px 0);
                  .ft-s(12px);
                  .c(#9e9e9e);
                }
                .food-info-month {
                  .ft-s(12px);
                }
                .food-info-activity {
                  .dp(b);
                  .ft-s(12px);
                  .tranf(scale(.9));
                  transform-origin: left;
                }
              }
            }
          }
          & .menu-right-list:nth-last-of-type(1) {
            .bd(r, 1px solid transparent);
          }
        }
      }
    }
  }
}

.fade-close-enter-active, .fade-close-leave-active {
  .trans(opacity .5s);
}

.fade-close-enter, .fade-close-leave-active {
  opacity: 0;
}

.fade-close-leave-to, .fade-close-leave-active {
  .dp(n);
}
</style>
