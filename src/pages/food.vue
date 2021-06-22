<template>
  <div class="food-container full-screen">
    <!-- 头部组件  -->
    <header-top
      goBack="true"
      closeStatus="true"
      backStatus="true"
      :head-title="headeTitle"
    ></header-top>

    <!-- 导航分类 -->
    <nav class="sort-container">
      <!-- 食品栏 -->
      <div class="sort-item" :class="{ choose_type: sortBy === 'food' }">
        <!-- 食品栏标题 -->
        <div class="sort-item-title" @click="chooseType('food')">
          <span class="item-info">
            {{ foodTitle }}
            <i class="iconfont icon-sub"></i>
          </span>
        </div>
        <transition name="sort-list" v-show="category">
          <div class="category-container" v-show="sortBy === 'food'">
            <!-- 食品栏左侧 -->
            <div class="category-l">
              <ul class="category-list">
                <li
                  v-for="(item, index) of category" :key="index"
                  class="category-item"
                  :class="{ 'category-active': restaurant_category_id === item.id }"
                  @click="changeSortItem(item.id, index)"
                >
                  <div class="category-item-msg">
                    <img :src="handlePicturePath(item.image_url)" class="category-item-img" alt="">
                    <span>{{ item.name }}</span>
                  </div>
                  <div class="category-item-link">
                    <span class="category-item-count">{{ item.count }}</span>
                    <i class="iconfont icon-arrow-r"></i>
                  </div>
                </li>
              </ul>
            </div>
            <!-- 食品栏右侧 -->
            <div class="category-r">
              <ul class="category-detail-list">
                <li
                  class="category-detail-item"
                  v-for="(item, index) of filtercategoryDetail"
                  :key="index"
                  :class="{ 'detail-active': restaurant_category_ids === item.id }"
                  @click="resetContent (item.id, item.name)"
                >
                  <span>{{ item.name }}</span>
                  <span>{{ item.count }}</span>
                </li>
              </ul>
            </div>
          </div>
        </transition>
      </div>
      <!-- 排序栏 -->
      <div class="sort-item" :class="{ choose_type: sortBy === 'sort' }">
        <!-- 排序栏标题 -->
        <div class="sort-item-title" @click="chooseType('sort')">
          <span class="item-info">
            排序
            <i class="iconfont icon-sub"></i>
          </span>
        </div>
        <transition name="sort-list">
          <div class="sort-detail-type" v-show="sortBy === 'sort'">
            <ul class="sort-detail-container" @click="resetSort($event)">
              <!-- 智能排序 -->
              <li class="sort-detail-item">
                  <i class="iconfont icon-sort"></i>
                  <p data="0" :class="{ 'sort-detail': sortByType === 0 }">
                    <span>智能排序</span>
                    <i class="iconfont icon-dagou" v-if="sortByType === 0"></i>
                  </p>
              </li>
              <!-- 距离最近 -->
              <li class="sort-detail-item">
                  <i class="iconfont icon-location"></i>
                  <p data="5" :class="{ 'sort-detail': sortByType === 5 }">
                    <span>距离最近</span>
                    <i class="iconfont icon-dagou" v-if="sortByType === 5"></i>
                  </p>
              </li>
              <!-- 销量最高 -->
              <li class="sort-detail-item">
                  <i class="iconfont icon-hot"></i>
                  <p data="6" :class="{ 'sort-detail': sortByType === 6 }">
                    <span>销量最高</span>
                    <i class="iconfont icon-dagou" v-if="sortByType === 6"></i>
                  </p>
              </li>
              <!-- 起送价最低 -->
              <li class="sort-detail-item">
                  <i class="iconfont icon-money"></i>
                  <p data="1" :class="{ 'sort-detail': sortByType === 1 }">
                    <span>起送价最低</span>
                    <i class="iconfont icon-dagou" v-if="sortByType === 1"></i>
                  </p>
              </li>
              <!-- 配送速度最快 -->
              <li class="sort-detail-item">
                  <i class="iconfont icon-time"></i>
                  <p data="2" :class="{ 'sort-detail': sortByType === 2 }">
                    <span>配送速度最快</span>
                    <i class="iconfont icon-dagou" v-if="sortByType === 2"></i>
                  </p>
                <div class="sort-detail-r"></div>
              </li>
              <!-- 评分最高 -->
              <li class="sort-detail-item">
                  <i class="iconfont icon-star"></i>
                  <p data="3" :class="{ 'sort-detail': sortByType === 3 }">
                    <span>评分最高</span>
                    <i class="iconfont icon-dagou" v-if="sortByType === 3"></i>
                  </p>
              </li>
            </ul>
          </div>
        </transition>
      </div>
      <!-- 筛选栏 -->
      <div class="sort-item" :class="{ choose_type: sortBy === 'activity' }">
        <!-- 筛选栏标题 -->
        <div class="sort-item-title" @click="chooseType('activity')">
          <span class="item-info">
            筛选
            <i class="iconfont icon-sub"></i>
          </span>
        </div>
        <transition name="sort-list">
          <div class="filter-container" v-show="sortBy === 'activity'">
            <div class="filter-item">
              <h3>配送方式</h3>
              <ul class="filter-ul">
                <li
                  v-for="(item, index) of Delivery"
                  :key="index"
                  class="filter-li"
                  :class="{ 'icon-status1': delivery_mode === item.id }"
                  @click="selectDeliveryMode(item.id)"
                >
                  <i
                    class="iconfont" :style="{ opacity: ((item.id === 0) && (delivery_mode !== 0 )) ? 0 : 1 }"
                    :class="delivery_mode === item.id ? 'icon-dagou' : 'icon-fengniao'">
                  </i>
                  <span :class="{ 'selected-filter': delivery_mode === item.id }">{{ item.text }}</span>
                </li>
              </ul>
            </div>
            <div class="filter-item">
              <h3>商家属性（可以多选）</h3>
              <ul class="filter-ul">
                <li v-for="(item, index) of Activity" :key="index" class="filter-li" :class="{'icon-status1': support_ids[index].status}" @click="selectSupportIds(index, item.id)">
                  <i v-show="support_ids[index].status" class="iconfont icon-dagou"></i>
                  <i
                    v-show="!support_ids[index].status"
                    class="iconfont icon-status2"
                    :style="{ color: '#' + item.icon_color, borderColor: '#' + item.icon_color }"
                  >
                    {{ item.icon_name }}
                  </i>
                  <span :class="{ selected_filter: support_ids[index].status }">{{ item.name }}</span>
                </li>
              </ul>
            </div>
            <div class="filter-footer">
              <div class="clear-all" @click="clearSelect">清空</div>
              <div class="confirm" @click="confirmSelectFun">确认<span v-show="filterNum">（{{ filterNum }}）</span></div>
            </div>
          </div>
        </transition>
      </div>
    </nav>

    <!-- 商品列表组件 -->
    <main class="food-main full-screen">
      <shop-container
        :geohash="geohash"
        :restaurantCategoryId="restaurant_category_id"
        :restaurantCategoryIds="restaurant_category_ids"
        :sortByType="sortByType"
        :deliveryMode="delivery_mode"
        :confirmSelect="confirmStatus"
        :supportIds="support_ids"
        :sortBy="sortBy"
        v-if="latitude"
      />
    </main>

    <!-- 遮罩动画 -->
    <transition name="sort-mask">
      <div class="sort-mask" v-show="sortBy" @click="maskHide($event)"></div>
    </transition>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { foodCategory, foodDelivery, foodActivity } from '../api/getData' // ~ 导入商品食物分类的三个分类接口
import { handlePicturePath, saveCurrentState } from '../utils/' // ~ 导入图片地址处理和防止刷新导致vuex状态丢失
const HeaderTop = () => import('@com/headertop')
const ShopContainer = () => import('@com/common/shopcontainer')
export default {
  data () {
    return {
      geohash: '', // ~ 经纬度
      headeTitle: '', // ~ 头部标题
      foodTitle: '', // ~ 分类标题
      sortBy: '', // ~ 筛选条件
      restaurant_category_id: '', // ~ 食品类型的id值
      restaurant_category_ids: '', // ~ 筛选类型的id值
      category: [], // ~ 左侧分类
      categoryDetail: [], // ~ 右侧分类
      Delivery: [], // ~ 商家配送方式数据
      Activity: [], // ~ 商家活动方式数据
      sortByType: null, // ~ 排序选择项
      delivery_mode: null, // ~ 选中的配送方式
      support_ids: [], // ~ 选中商铺的活动列表
      filterNum: 0, // ~ 所选中的所有样式的集合
      confirmStatus: false // ~ 确认选择的状态
    }
  },
  mixins: [ handlePicturePath ], // ~ 混入工具的图片地址处理
  // 初始化后调用
  created () {
    this.init()
  },
  computed: {
    ...mapState(['latitude', 'longitude']),

    // ~ 筛选分类导航右侧
    filtercategoryDetail () {
      let result
      result = this.categoryDetail.filter((item, index) => {
        if (index > 0) {
          return item
        }
      })
      this.categoryDetail = result // eslint-disable-line
      return result
    }
  },
  watch: {
    sortBy (value) {
      if (!value) {
        document.body.classList.remove('no-scroll')
      }
    }
  },
  methods: {
    async init () {
      saveCurrentState(this.$store)
      // ~ 获取从shoplist页面存在路由上的参数
      this.geohash = this.$route.query.geohash
      this.headeTitle = this.$route.query.title
      this.restaurant_category_id = parseInt(this.$route.query.restaurant_category_id)
      this.foodTitle = this.headeTitle

      // ~ 获取商品分类
      this.category = await foodCategory(this.latitude, this.longitude)
      this.category.forEach(item => {
        if (this.restaurant_category_id === item.id) {
          this.categoryDetail = item.sub_categories
        }
      })

      // ~ 获取商家送货数据接口
      this.Delivery = await foodDelivery(this.latitude, this.longitude)

      // ~ 获取商家活动数据接口
      this.Activity = await foodActivity(this.latitude, this.longitude)
      this.Activity.forEach((item, index) => {
        this.support_ids[index] = { status: false, id: item.id }
      })
    },

    // ~ 切换三栏
    chooseType (type) {
      if (this.sortBy !== type) {
        document.body.classList.add('no-scroll')
        this.sortBy = type
        if (type === 'food') {
          this.foodTitle = '分类'
        } else {
          this.foodTitle = this.headeTitle
        }
      } else {
        this.sortBy = ''
        if (type === 'food') {
          this.foodTitle = this.headeTitle
        }
      }
    },

    // ~ 食品栏左侧处理
    changeSortItem (id, index) {
      this.restaurant_category_id = id
      this.categoryDetail = this.category[index].sub_categories
    },

    // ~ 食品栏右侧处理
    resetContent (id, name) {
      this.restaurant_category_ids = id
      this.sortBy = ''
      this.foodTitle = this.headeTitle = name
    },

    // ~ 排序栏处理
    resetSort (event) {
      let el
      el = event.target.nodeName.toUpperCase() !== 'P' ? event.target.parentNode : event.target
      this.sortByType = parseInt(el.getAttribute('data'))
      this.sortBy = ''
    },

    // ~ 筛选栏选择配送方式
    selectDeliveryMode (id) {
      if (this.delivery_mode === null) {
        this.filterNum++
        this.delivery_mode = id
      } else if (this.delivery_mode === id) {
        this.filterNum--
        this.delivery_mode = null
      } else {
        this.delivery_mode = id
      }
    },

    // ~ 筛选栏多选商家属性
    selectSupportIds (index, id) {
      this.support_ids.splice(index, 1, {
        status: !this.support_ids[index].status,
        id
      })
      this.filterNum = this.delivery_mode === null ? 0 : 1
      this.support_ids.forEach(item => {
        if (item.status) {
          this.filterNum++
        }
      })
    },

    // ~ 筛选栏清空选择
    clearSelect () {
      this.support_ids.map(item => (item.status = false))
      this.filterNum = 0
      this.delivery_mode = null
    },

    // ~ 筛选栏点击完后确认
    confirmSelectFun () {
      this.confirmStatus = !this.confirmStatus
      this.sortBy = ''
    },

    // ~ 隐藏遮罩
    maskHide (event) {
      if (event.target.getAttribute('class').includes('sort-mask')) {
        this.sortBy = ''
      }
    }
  },
  components: {
    HeaderTop,
    ShopContainer
  }
}
</script>
<style lang="less" scope>
body {
  &.no-scroll {
    .over(h);
  }
}

.iconfont {
  .ft-s(16px);
}

.food-container {
  .bg-c(#f5f5f5);
  .sort-container {
    .ps(fx);
    top: 45px;
    .dp(f);
    .j-c(se);
    .z(15);
    .wh(100%,38px);
    .ft-s(12px);
    .bg-c(#fff);
    .bd(b, 1px solid rgba(229,229,229, .7));
    .c(#666);
    .sort-item {
      .dp(f);
      .wh(33.33%, 100%);
      .sort-item-title {
        .ps(rt);
        .dp(f);
        .w(100%);
        .j-c(c);
        .a-i(c);
        .item-info {
          .dp(f);
          .icon-sub {
            .a-s(fe);
            .ft-s(12px);
            .mg(l, 2px);
            .trans(transform ease .5s);
          }
        }
        &::before {
          content: '';
          .ps(ab);
          top: 50%;
          right: 0;
          .wh(1px, 50%);
          .tranf(translateY(-50%));
          .bg-c(#e4e4e4);
        }
      }
      .category-container {
        .ps(ab);
        top: 38px;
        left: 0;
        .z(10);
        .dp(f);
        .wh(100%, 375px);
        .over(h);
        .category-l {
          .w(50%);
          .bg-c(#f1f1f1);
          .category-list {
            .category-item {
              .dp(f);
              .j-c(sb);
              .a-i(c);
              .pd(0 10px 0 15px);
              .h(42px);
              .ft-s(12px);
              .category-item-msg {
                .dp(f);
                img {
                  .wh(20px, 20px);
                  .mg(r, 10px);
                }
              }
              .category-item-link {
                .category-item-count {
                  .c(#3190e8);
                }
              }
              &.category-active {
                .bg-c(#fff);
              }
           }
          }
        }
        .category-r {
          .w(50%);
          .bg-c(#fff);
          .category-detail-list {
            .pd(l, 12px);
            .h(375px);
            overflow-y: auto;
            &::-webkit-scrollbar {
              display: none;
            }
            .category-detail-item {
              .dp(f);
              .j-c(sb);
              .a-i(c);
              .h(42px);
              .pd(r, 10px);
              .bd(b, 1px solid #e4e4e4);
              &.detail-active {
                .c(#3190e8);
              }
            }
            & .category-detail-item:last-child {
              .bd(b, 0);
            }
          }
        }
      }
      .sort-detail-type {
        .ps(ab);
        top: 38px;
        left: 0;
        .z(10);
        .dp(f);
        .wh(100%, 354px);
        .over(h);
        .sort-detail-container {
          .w(100%);
          .bg-c(#fff);
          .sort-detail-item {
            .dp(f);
            .a-i(c);
            .pd(l, 20px);
            .h(59px);
            .ft-s(13px);
            .icon-sort {
              .c(#3a94e8);
            }
            .icon-location {
              .c(#00008b);
            }
            .icon-hot {
              .c(#dc143c);
            }
            .icon-money {
              .c(#ffd700);
            }
            .icon-time {
              .c(#40e0d0);
            }
            .icon-star {
              .c(#ffa500);
            }
            p {
              .ps(rt);
              .dp(f);
              .j-c(sb);
              .a-i(c);
              .wh(100%, 100%);
              .pd(r, 10px);
              .mg(l, 10px);
              &.sort-detail {
                .c(#3190e8);
              }
              &::before {
                content: '';
                .ps(ab);
                left: 0;
                bottom: 0;
                .wh(100%, 1px);
                .bg-c(#e4e4e4);
              }
            }
          }
          & .sort-detail-item:last-child p::before {
            .h(0);
          }
        }
      }
      .filter-container {
        .ps(ab);
        top: 38px;
        left: 0;
        .z(10);
        .dp(f);
        .f-d(c);
        .w(100%);
        .over(h);
        .bg-c(#fff);
        .filter-item {
          .w(100%);
          .pd(0 10px);
          h3 {
            .pd(8px 0);
            .ft-w(400);
          }
          .filter-ul {
            .dp(f);
            .j-c(fs);
            .f-w(r);
            .filter-li {
              .w(30%);
              .pd(5px);
              .bd(1px solid #e5e5e5);
              .bdr(5px);
              .mg(r, 11px);
            }
          }
        }
        .filter-footer {
          .dp(f);
          .j-c(sb);
          .h(57px);
          .pd(8px);
          .bg-c(#f1f1f1);
          & > div {
            .flex-hv();
            .wh(48%, 100%);
            .ft-s(15px);
            .bdr(5px);
            box-shadow: 0 0 1px 1px rgba(0, 0, 0, .1);
            &.clear-all {
              .bg-c(#fff);
            }
            &.confirm {
              .bg-c(#56d176);
              .c(#fff);
            }
          }
        }
        & .filter-item:nth-of-type(1) {
          .ft-s(12px);
          .iconfont {
            .dp(ib);
            .wh(18px, 18px);
            .mg(r, 3px);
            .l-h(18px);
            .txt-a(c);
            .c(#3190e8);
            .ft-s(12px);
            .bd(1px solid transparent);
          }
          & .filter-li.icon-status1 {
            .c(#3190e8);
            .icon-dagou {
              border-width: 1px;
              border-style: solid;
              border-color: #3190e8;
              .bdr(4px);
            }
          }
        }
        & .filter-item:nth-of-type(2) {
          .mg(t, 5px);
          .pd(b, 18px);
          .filter-ul {
            .j-c(sb);
            .filter-li {
              .mg(0);
              &.icon-status1 {
                .c(#3190e8);
              }
              .icon-status2,
              .icon-dagou {
                .dp(ib);
                .wh(18px, 18px);
                .mg(r, 3px);
                .l-h(18px);
                .txt-a(c);
                .ft-s(12px);
                border-width: 1px;
                border-style: solid;
                .bdr(4px);
              }
            }
            & .filter-li:nth-last-of-type(-n + 3)  {
              .mg(t, 8px);
            }
          }
        }
      }
      &.choose_type {
        .sort-item-title {
          .c(#3190e8);
          .icon-sub {
            .tranf(rotate(180deg));
          }
        }
      }
    }
    & .sort-item:nth-of-type(3) .sort-item-title::before {
      .w(0);
    }
  }
  .food-main {
    .pd(t, 37px);
  }
  .sort-mask {
    .ps(fx);
    .z(5);
    top: 0;
    left: 0;
    .wh(100%, 100%);
    .bg-c(rgba(0, 0, 0, .3));
    .over(h);
    .trans(all 1s);
  }
}

.sort-list-enter-active,
.sort-list-leave-active {
  .trans(all .3s);
  .tranf(translateY(0));
}

.sort-list-enter, .sort-list-leave-to {
  .tranf(translateY(-10px));
  opacity: 0;
}

.sort-mask-enter-active,
.sort-mask-leave-action {
  .trans(opacity .3s);
}

.sort-mask-enter,
.sort-mask-leave-to {
  opacity: 0;
}

</style>
