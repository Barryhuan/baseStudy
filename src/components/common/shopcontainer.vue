<template>
  <div class="shop-container full-screen" ref="change-bg">
    <ul class="shop-items" v-if="shopItemArr.length">
      <router-link
        :to="{ path: '/shop', query: { geohash, id: item.id }}"
        v-for="(item, index) of shopItemArr"
        :key="index"
        tag="li"
        class="shop-item">
        <div class="shop-item-img">
          <img :src="imgBaseUrl + item.image_path" alt="">
        </div>
        <div class="shop-item-msg">
          <div class="item-msg-t">
            <div class="msg-t-l">
              <span>品牌</span>
              <h4>{{ item.name }}</h4>
            </div>
            <div class="msg-t-r">
              <span
                v-for="(iconItem, index) of item.supports"
                :key="index"
                :style="{ color: '#' + iconItem.icon_color }">
                {{ iconItem.icon_name }}
              </span>
            </div>
          </div>
          <div class="item-msg-m">
            <div class="msg-m-l">
              <div class="shop-item-rating">
                <div class="star-sum">
                  <span v-for=" index of Math.floor(item.rating)" :key="index" class="iconfont icon-star"></span>
                </div>
                <p class="rating">{{ item.rating }}</p>
              </div>
              <div class="shop-item-sales">
                月售{{ item.recent_order_num }}单
              </div>
            </div>
            <div class="msg-m-r">
              <span class="wm-tag" v-if="item.delivery_mode">{{ item.delivery_mode.text }}</span>
              <span class="wm-tag" v-if="item.supports[1]">{{ item.supports[1].name }}</span>
            </div>
          </div>
          <div class="item-msg-b">
            <div class="msg-b-l">￥{{ item.float_minimum_order_amount }}起送 / 配送费￥{{ item. float_delivery_fee }}</div>
            <div class="msg-b-r">{{ item.distance }} / <span style="color: #3190e8;">{{ item.order_lead_time }}</span>
            </div>
          </div>
        </div>
      </router-link>
    </ul>
    <h2 class="not-data" v-if="notDataStatus">
      <img src="../../assets/images/not-data.png" alt="">
      <p>暂无数据</p>
    </h2>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { shopItemApi } from '@/api/'
import { saveCurrentState } from '../../utils/'
export default {
  props: [
    'restaurantCategoryId',
    'restaurantCategoryIds',
    'sortByType',
    'deliveryMode',
    'supportIds',
    'confirmSelect',
    'geohash',
    'sortBy'
  ],
  data () {
    return {
      offset: 0, // ~ 批次加载商铺列表，每次加载20个
      shopItemArr: [], // ~ 存储请求到的商铺数据
      imgBaseUrl: '//elm.cangdu.org/img/', // ~ 图片的基础路径
      notDataStatus: false // ~ 当没有数据时显示无数据标题
    }
  },
  mounted () {
    this.initData()
  },
  methods: {
    async initData () {
      saveCurrentState(this.$store)
      let res = await shopItemApi(
        this.latitude,
        this.longitude,
        this.offset,
        this.restaurantCategoryId
      )
      this.shopItemArr = [...res]
      this.notDataStatus = this.shopItemArr.length === 0
    },
    async listenerParentData () {
      this.offset = 0
      let res = await shopItemApi(
        this.latitude,
        this.longitude,
        this.offset,
        '',
        this.restaurantCategoryIds,
        this.sortByType,
        this.deliveryMode,
        this.supportIds
      )
      this.shopItemArr = [...res]
      this.notDataStatus = this.shopItemArr.length === 0
    }
  },
  watch: {
    restaurantCategoryIds () {
      this.listenerParentData()
    },
    sortByType () {
      this.listenerParentData()
    },
    confirmSelect () {
      this.listenerParentData()
    },
    notDataStatus (value) {
      if (value) {
        document.body.classList.add('no-scroll')
      } else {
        document.body.classList.remove('no-scroll')
      }
    },
    sortBy (value) {
      if (value === '' && this.notDataStatus) {
        document.body.classList.add('no-scroll')
      }
    }
  },
  computed: {
    ...mapState(['latitude', 'longitude'])
  }
}
</script>
<style lang="less" scope>
.shop-container {
  .shop-items {
    .bg-c(#fff);
    .shop-item {
      .dp(f);
      .j-c(sb);
      .bd(b, 1px solid #e5e5e5);
      .pd(10px 10px);
      .shop-item-img {
        .flex-hv();
        .w(20%);
        img {
          .bdr(10px);
          .bd(1px solid #e5e5e5);
        }
      }
      .shop-item-msg {
        .dp(f);
        .f-d(c);
        .j-c(sb);
        .w(76%);
        .item-msg-t {
          .dp(f);
          .j-c(sb);
          .ft-s(12px);
          .msg-t-l {
            .dp(f);
            .w(70%);
            span {
              .pd(1px 3px);
              .mg(r, 5px);
              .bg-c(#ffd930);
              .ft-w(600);
              .bdr(3px);
            }
            h4 {
              .w(65%);
              .a-s(c);
              .ellipsis()
            }
          }
          .msg-t-r {
            white-space: nowrap;
            -webkit-transform: scale(.95);
            transform: scale(0.95);
            span {
              .mg(0 1px);
              .bd(1px solid #e5e5e5);
              .txt-a(c);
            }
          }
        }
        .item-msg-m {
          .dp(f);
          .j-c(sb);
          .ft-s(13px);
          .c(#999);
          .msg-m-l {
            .dp(f);
            .a-i(c);
            white-space: nowrap;
            -webkit-transform-origin-x: 0;
            -webkit-transform-origin-y: 50%;
            -webkit-transform: scale(.9);
            transform: scale(.9);
            .shop-item-rating {
              .dp(f);
              .a-i(c);
              .star-sum {
                .icon-star {
                  .ft-s(12px);
                  .c(#ff9a0d);
                }
              }
              .rating {
                .mg(0 5px);
              }
            }
          }
          .msg-m-r {
            .dp(f);
            white-space: nowrap;
            -webkit-transform-origin-x: 100%;
            -webkit-transform-origin-y: 50%;
            -webkit-transform: scale(.85);
            transform: scale(.85);
            .wm-tag {
              .pd(2px 3px);
              .bd(1px solid #3190e8);
              .bdr(2px);
              -webkit-transform: scale(.85);
              transform: scale(.85);
              &:nth-of-type(1) {
                .mg(r, -5px);
                .bg-c(#3190e8);
                .c(#fff);
              }
            }
          }
        }
        .item-msg-b {
          .dp(f);
          .j-c(sb);
          .ft-s(12px);
          white-space: nowrap;
          .c(#999);
          .msg-b-l {
            white-space: nowrap;
            -webkit-transform-origin-x: 0;
            -webkit-transform-origin-y: 50%;
            -webkit-transform: scale(.85);
            transform: scale(.85);
          }
          .msg-b-r {
            white-space: nowrap;
            -webkit-transform: scale(.85);
            -webkit-transform-origin-y: 50%;
            transform: scale(.85);
          }
        }
      }
    }
    & .shop-item:nth-last-of-type(1) {
      .bd(b, 0);
    }
  }
  .not-data {
    .ps(fx);
    .dp(f);
    top: 0;
    .f-d(c);
    .a-i(c);
    .j-c(c);
    .wh(100%, 100%);
    .bg-c(#fff);
    img {
      .w(50%);
    }
    p {
      .ft-s(16px);
      .pd(t, 15px);
      .c(#3190e8);
    }
  }
}
</style>
