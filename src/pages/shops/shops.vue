<template>
  <div>
    <!-- 商铺内容 -->
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
                  :class="{ 'menu-left-active': index === shopMenuIndex }"
                  @click="chooseMenu(index)"
                >
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
                    <div class="buycar-content">
                      <div class="buycar-price">
                        <span>￥</span>
                        <span>{{ foodItem.specfoods[0].price }}</span>
                        <span v-if="foodItem.specifications.length">起</span>
                      </div>
                      <buy-car
                        :shopId="shopId"
                        :foodItem="foodItem"
                        @showChooseList="showChooseList"
                        @showReduceTip="showReduceTip"
                      ></buy-car>
                    </div>
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

    <!-- 购车车 -->
    <div class="buycart-content">
      <div class="buycart-count" @click="toggleCartShow">
        <div
          class="buycart-car"
          :class="{
            'buycart-icon-active' : totalPrice,
            'move-icon': receiveInCart
          }"
          ref="buycartIcon">
          <span class="buycar-length" v-if="totalNum">{{ totalNum }}</span>
          <i class="iconfont icon-buycart"></i>
        </div>
        <div class="buycart-info">
          <p class="buycart-price">￥ {{ totalPrice }}</p>
          <p class="buycart-delivery">配送费￥{{ deliveryFee }}</p>
        </div>
      </div>
      <div class="buycart-settlment" :class="{ 'goToPlay' : minimumOrderAmount <= 0 }">
        <span class="not-price-play" v-if="minimumOrderAmount > 0 ">还差￥{{ minimumOrderAmount }}起送</span>
        <router-link :to="{ path: '/confirmOrder', query: { geohash, shopId } }" v-else>去结算</router-link>
      </div>
    </div>

    <!-- 购车车内容 -->

    <!-- 规格框内容 -->
    <div class="specs-show">
      <transition name="fade">
        <div class="specs-cover" v-if="showSpecs" @click="showChooseList"></div>
      </transition>
      <transition name="fadeBounce">
        <div class="specs-content" v-if="showSpecs">
          <div class="specs-header">
            <h4>{{ choosedFoods.name }}</h4>
            <i class="iconfont icon-delete" @click="showChooseList"></i>
          </div>
          <div class="specs-details">
            <h5 class="specs-details-title">{{ choosedFoods.specifications[0].name }}</h5>
            <ul>
              <li
                v-for="(item, index) in choosedFoods.specifications[0].values"
                :key="index"
                :class="{ 'specs-active': index === specsIndex }"
                @click="chooseSpecs(index)"
              >{{ item }}</li>
            </ul>
          </div>
          <div class="specs-footer">
            <div class="specs-footer-price">
              <span>￥</span>
              <span>{{ choosedFoods.specfoods[specsIndex].price }}</span>
            </div>
            <div
              v-if="choosedFoods && choosedFoods.specfoods.length"
              class="specs-footer-addcart"
              @click="addSpecs(
                choosedFoods.category_id,
                choosedFoods.item_id,
                choosedFoods.specfoods[specsIndex].food_id,
                choosedFoods.specfoods[specsIndex].name,
                choosedFoods.specfoods[specsIndex].price,
                choosedFoods.specifications[0].values[specsIndex],
                choosedFoods.specfoods[specsIndex].packing_fee,
                choosedFoods.specfoods[specsIndex].sku_id,
                choosedFoods.specfoods[specsIndex].stock
              )">加入购物车</div>
          </div>
        </div>
      </transition>
    </div>

    <!-- 规格无法删除提示框 -->
    <transition name="fade">
      <p class="not-delete-cart" v-if="showDeleteTip">多规格商品只能去购物车删除哦</p>
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
import { mapState, mapMutations } from 'vuex'
import { saveCurrentState } from '@/utils/'
import BScroll from 'better-scroll'
const HeaderTop = () => import('@com/headertop')
const BuyCar = () => import('@com/common/buycar.vue')
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
      showSpecs: false, // ~ 控制显示食品规格
      showDeleteTip: false, // ~ 多规格商品点击减按钮，弹出提示框
      specsIndex: 0, // ~ 当前选中的规格索引值
      choosedFoods: null, // ~ 当前选中食品数据
      ratingOffset: 0, // ~ 评价获取数据的offset值
      ratingList: [], // ~ 商品评价列表
      ratingScoresData: {}, // ~ 商铺评价分数
      ratingTags: [], // ~ 商铺评价分类
      windowHeight: 0, // ~ 屏幕高度（为滚动插件做初始话准备）
      totalPrice: 0, // ~ 购物车总价格
      cartFoodList: [], // ~ 购物车商品列表
      showCartList: false, // ~ 显示购物车列表
      receiveInCart: false, // ~ 购物小圆点是否到达指定位置
      imgBaseUrl: '//elm.cangdu.org/img/' // ~ 图片基础
    }
  },
  // ~ 初始化获取经纬度信息
  created () {
    this.geohash = this.$route.query.geohash
    this.shopId = this.$route.query.id
    this.INIT_BUYCART()
  },
  mounted () {
    this.init()
    this.windowHeight = window.innerHeight
  },
  methods: {
    ...mapMutations([
      'ADD_CAR',
      'REDUCE_CAR',
      'INIT_BUYCART',
      'CLEAR_CART',
      'RECORD_SHOPDETAIL'
    ]),
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
    // ~ 控制加载动画后初始化完成显示内容
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
    },
    // ~ 显示规格列表
    showChooseList (foods) {
      if (foods) this.choosedFoods = foods
      this.showSpecs = !this.showSpecs
      this.specsIndex = 0
    },
    // ~ 规格显示无法减去商品提示
    showReduceTip () {
      this.showDeleteTip = true
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        clearTimeout(this.timer)
        this.showDeleteTip = false
      }, 3000)
    },
    // ~ 选择规格
    chooseSpecs (index) {
      this.specsIndex = index
    },
    // ~ 将规格商品添加到购物车中
    addSpecs (categoryId, itemId, foodId, name, price, specs, packingFee, skuId, stock) {
      this.ADD_CAR({ shopId: this.shopId, categoryId, itemId, foodId, name, price, specs, packingFee, skuId, stock })
      this.showChooseList()
    },
    // ~ 切换购物车显示
    toggleCartShow () {
      this.showCartList = this.cartFoodList.length ? !this.showCartList : true
    }
  },
  watch: {
    // ~ Dom元素渲染完后执行获取滚动元素高度
    shopLoading (value) {
      if (!value) {
        this.$nextTick(() => {
          this.getFoodHeight()
        })
      }
    }
  },
  computed: {
    ...mapState(['latitude', 'longitude', 'cartList']),
    shopCart () {
      return { ...this.cartList[this.shopId] }
    },
    // ~ 购物车商品数量
    totalNum () {
      let num = 0
      this.cartFoodList.forEach(item => {
        num += item.num
      })
      return num
    },
    // ~ 配送费计算
    deliveryFee () {
      return this.shopDetails ? this.shopDetails.float_delivery_fee : null
    },
    // ~ 还差多少元起送，为负时希纳是去结算按钮
    minimumOrderAmount () {
      return this.shopDetails ? this.shopDetails.float_minimum_order_amount - this.totalPrice : null
    }
  },
  components: {
    HeaderTop,
    BuyCar
  }
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
          &::after {
            content: '';
            .ps(ab);
            bottom: 0;
            left: 0;
            .wh(100%, 1px);
            .bg-c(#ebebeb);
          }
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
            .pd(14px 8px 14px 12px);
            .bg-c(#f2f2f2);
            .c(#686868);
            h4 > span {
              .mg(l, 5px);
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
                .w(59%);
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

.specs-show {
  .specs-cover {
    .ps(fx);
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    .bg-c(rgba(0, 0, 0, .4));
    .z(9999999);
  }
  .specs-content {
    .ps(fx);
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    .dp(f);
    .f-d(c);
    .j-c(sb);
    .mg(auto);
    .wh(70%, 27%);
    .bg-c(#fff);
    .bdr(9px);
    .z(999999999);
    .specs-header {
      .dp(f);
      .j-c(fe);
      .pd(10px 12px);
      h4 {
        .w(33.33%);
        .txt-a(c);
        .ft-w(400);
      }
      .iconfont {
        .dp(f);
        .j-c(fe);
        .a-i(c);
        .w(33.33%);
      }
    }
    .specs-details {
      .pd(10px 12px);
      h5 {
        .pd(b, 10px);
        .ft-w(400);
        .ft-s(15px);
        .c(#666);
      }
      ul {
        .dp(f);
        li {
          .pd(5px 12px);
          .mg(r, 10px);
          .bd(1px solid #ddd);
          .bdr(5px);
          .ft-s(13 px);
          touch-action: pan-y;
          &.specs-active {
            border-color: #3199e8;
            .c(#3199e8);
          }
        }
      }
    }
    .specs-footer {
      .dp(f);
      .j-c(sb);
      .a-i(c);
      .pd(10px 12px);
      .bg-c(#f9f9f9);
      border-bottom-right-radius: 9px;
      border-bottom-left-radius: 9px;
      .specs-footer-price {
        .c(#ff6000);
        & span:nth-of-type(1) {
          .ft-s(12px);
        }
        & span:nth-of-type(2) {
          .mg(l, -5px);
          .ft-w(600);
        }
      }
      .specs-footer-addcart {
        .pd(4px 8px);
        .ft-s(13px);
        .bdr(4px);
        .c(#fff);
        .bg-c(#3199e8);
      }
    }
  }
}

.not-delete-cart {
  .ps(fx);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  .flex-hv();
  .z(9999999999);
  .wh(60%, 5%);
  .mg(auto);
  .txt-a(c);
  .ft-s(13px);
  .bdr(10px);
  .c(#fff);
  .bg-c(rgba(0, 0, 0, .8));
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
