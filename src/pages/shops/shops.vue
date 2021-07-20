<template>
  <div>
    <div class="shops-container full-screen" v-if="!shopLoading">
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
            <div class="food-menu-left" ref="foodMenuLeft">
              <ul>
                <li
                  v-for="(item, index) in shopMenuList"
                  :key="index"
                  class="menu-left"
                  :class="{ 'menu-left-active': index === shopMenuIndex}"
                  @click="chooseMenu(index)">
                  <span>{{ item.name }}</span>
                </li>
              </ul>
            </div>
            <!-- 右侧-->
            <div class="food-menu-right" ref="shopListHeight">
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
                        <!-- <img :src="imgBaseUrl + foodItem.image_path" alt=""> -->
                        <img v-lazy="imgBaseUrl + foodItem.image_path" :key="imgBaseUrl + foodItem.image_path" alt="">
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
    <!-- 加载动画 -->
    <div class="animation-opacity show-animation-picture" v-if="shopLoading">
      <img src="@i/shop_back_svg.svg" alt="">
    </div>
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
import BScroll from 'better-scroll'
const HeaderTop = () => import('@com/headertop')
export default {
  data () {
    return {
      changeShowType: 'food', // ~ 切换商品栏和评价栏
      geohash: '', // ~ 位置信息
      shopId: '', // ~ 商铺Id
      shopDetails: {}, // ~ 商铺详情
      shopMenuList: [], // ~ 商铺菜品详情
      shopMenuIndex: 0, // ~ 左侧商品已选菜单索引
      shopMenuIndexChange: true, // ~ 解决选中index时，scroll监听事件重复判断设置index的bug
      shopTopHeightList: [], // ~ 右侧商品列表高度集合
      shopScroll: null, // ~ 右侧列表的scroll
      showActivi: false, // ~ 是否显示商铺活动
      shopLoading: true, // ~ 显示加载动画
      ratingOffset: 0, // ~ 评价获取数据的offset值
      ratingList: [], // ~ 商品评价列表
      ratingScoresData: {}, // ~ 商铺评价分数
      ratingTags: [], // ~ 商铺评价分类
      windowHeight: 0, // ~ 屏幕高度（为滚动插件做初始话准备）
      imgBaseUrl: '//elm.cangdu.org/img/' // ~ 图片基础
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
  methods: {
    // ~ 初始化请求
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
      this.hideLoading()
    },
    hideLoading () {
      this.shopLoading = false
    },
    // ~ 获取右侧列表高度集合
    getFoodHeight () {
      let listContainer = this.$refs.shopListHeight
      if (listContainer) {
        let listArr = Array.from(listContainer.children[0].children)
        listArr.forEach((item, index) => {
          this.shopTopHeightList[index] = item.offsetTop
        })
        this.listenScroll(listContainer)
      }
    },
    // ~ 当滑动食品列表时，监听其scrollTop值来设置对应的食品列表标题的样式
    listenScroll (el) {
      // 右侧列表滚动
      this.shopScroll = new BScroll(el, {
        probeType: 3
      })
      // 左侧列表滚动
      let foodMenuLeft = this.$refs.foodMenuLeft
      let foodMenuLeftScroll = new BScroll(foodMenuLeft, {
        click: true
      })
      let foodMenuLeftHeight = foodMenuLeft.clientHeight
      // 右侧列表滚动时左侧列表选项激活和滚动
      this.shopScroll.on('scroll', (element) => {
        if (!foodMenuLeft) return
        this.shopTopHeightList.forEach((item, index) => {
          if (this.shopMenuIndexChange && Math.abs(Math.round(element.y)) >= item) {
            this.shopMenuIndex = index
            let el = foodMenuLeft.querySelector('.menu-left-active')
            foodMenuLeftScroll.scrollToElement(el, 800, 0, -(foodMenuLeftHeight / 2 - 50))
          }
        })
      })
    },
    // ~ 点击滚动到指定的项目
    chooseMenu (index) {
      this.shopMenuIndex = index
      this.shopMenuIndexChange = false
      this.shopScroll.scrollTo(0, -this.shopTopHeightList[index], 400)
      this.shopScroll.on('scrollEnd', () => {
        this.shopMenuIndexChange = true
      })
    }
  },
  watch: {
    // ~ Dom元素渲染完后执行
    shopLoading (value) {
      if (!value) {
        this.$nextTick(() => {
          this.getFoodHeight()
        })
      }
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
  .dp(f);
  .f-d(c);
  .ps(ab);
  left: 0;
  top: 0;
  .pd(t, 45px);
  .h(100%);
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
    overflow: hidden;
    .menu-container {
      .dp(f);
      .h(100%);
      overflow-y: hidden;
      .ps(rt);
      .food-menu-left {
        .wh(25%, 100%);
        .bg-c(#f2f2f2);
        overflow-y: auto;
        touch-action: pan-y;
        .menu-left {
          .ps(rt);
          .pd(20px 12px);
          .ft-s(13px);
          .ft-w(600);
          .ellipsis();
          &.menu-left-active {
            .bg-c(#fff);
            &::before {
              content: '';
              .ps(ab);
              top: 0;
              left: 0;
              .wh(3px, 100%);
              .bg-c(#3778eb);
            }
          }
        }
      }
      .food-menu-right {
        .w(75%);
        overflow-y: auto;
        touch-action: pan-y;
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

.show-animation-picture {
  .ps(fx);
  top: 0;
  .z(9999);
  .wh(100%, 100%);
  img {
    .wh(100%, 100%);
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
