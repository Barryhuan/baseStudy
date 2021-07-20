<template>
  <div class="search-container full-screen">
    <!-- 头部组件 -->
    <header-top head-title="搜索" onlyStatus="true"></header-top>

    <!-- 搜索 -->
    <form class="search-form">
      <input
        type="search"
        name="search-input"
        class="search-input"
        v-model="searchContent"
        placeholder="请输入商家或美食名称"
        @input="checkInput"
      />
      <input
        type="submit"
        name="search-submit"
        class="search-submit"
        value="提交"
        @click.prevent="searchShop('')"
      />
    </form>

    <!-- 搜索展示 -->
    <main class="search-main">
      <!-- 搜索结果 -->
      <div class="search-content" v-if="searchResult.length">
        <h3>商家</h3>
        <div class="search-shop-list">
          <router-link
             :to="{ path: '/shops', query: { geohash, id: item.id }}"
            tag="dl"
            class="search-shop-item"
            v-for="(item, index) of searchResult"
            :key="index"
          >
            <!-- 商家列表左侧 -->
            <dt class="item-msg-img">
              <img :src="imgBaseUrl + item.image_path" alt="">
            </dt>
            <!-- 商家列表右侧 -->
            <dd class="item-msg-info">
              <h5>
                <p class="shop-item-content-l">
                  <span class="msg-title">品牌</span>
                  <span class="item-shop-name">{{ item.name }}</span>
                </p>
                <p class="shop-item-content-r">
                  <span v-for="(tabItem, tabIndex) of item.supports"
                    :key="tabIndex"
                    :style="{
                      color: '#' + tabItem.icon_color,
                      borderColor: '#' + tabItem.icon_color
                    }">
                    {{ tabItem.icon_name }}
                  </span>
                </p>
              </h5>
              <p>
                <span>月售 {{ item.month_sales || item.recent_order_num }} 单</span>
                <span>{{ item.category }}</span></p>
              <p>
                <span>￥{{ item.delivery_fee || item.float_minimum_order_amount }}元起送 / 配送费￥{{ item.float_delivery_fee }}</span>
                <span>距离{{ item.distance }}</span></p>
            </dd>
          </router-link>
        </div>
      </div>

      <!-- 搜索历史 -->
      <div class="search-listory" v-if="searchHistory.length && listoryStatus">
        <h3>搜索历史</h3>
        <ul class="search-listory-list">
          <li class="search-listory-item" v-for="(item, index) of searchHistory" :key="index">
            <p class="listory-item-info" @click="searchShop(item)">{{ item }}</p>
            <i class="iconfont icon-delete" @click="deleteCurrentListory(index)"></i>
          </li>
        </ul>
        <p class="clear-listory" @click="deleteAllListory">清空搜索历史记录</p>
      </div>

      <!-- 无搜索结果 -->
      <div class="search-reject" v-if="searchResultEmpty">
        <img src="../assets/images/not-data.png" alt="">
        <p>很抱歉！无搜索结果</p>
      </div>
    </main>

    <!-- 底部导航栏 -->
    <footer-bottom />
  </div>
</template>
<script>
import { searchList } from '@/api/'
import { setSearchHistory, getSearchHistory } from '@/utils/'
const HeaderTop = () => import('@com/headertop')
const FooterBottom = () => import('@com/footerbottom')
export default {
  data () {
    return {
      geohash: '', // ~ 经纬度
      searchContent: '', // ~ 搜索的内容
      searchResult: [], // ~ 搜索到的商铺数据
      searchHistory: [], // ~ 搜索历史记录数据
      imgBaseUrl: '//elm.cangdu.org/img/', // ~ 图片的基础路径
      listoryStatus: true, // ~ 搜索的历史记录显示状态
      searchResultEmpty: false // ~ 当搜索结果为空时
    }
  },
  mounted () {
    this.geohash = this.$route.params.geohash
    if (getSearchHistory('searchHistory')) {
      this.searchHistory = JSON.parse(getSearchHistory('searchHistory'))
    }
  },
  methods: {
    // ~ 搜索商铺
    async searchShop (value) {
      if (value) {
        this.searchContent = value
      } else if (!this.searchContent.trim()) {
        return
      }
      this.searchContent = this.searchContent.trim()
      this.listoryStatus = false

      // ~ 请求搜索结果
      this.searchResult = await searchList(this.geohash, this.searchContent)
      this.searchResultEmpty = !this.searchResult.length
      let history = getSearchHistory('searchHistory')
      if (history) {
        let checkrepeat = false
        this.searchHistory = JSON.parse(history)
        this.searchHistory.forEach(item => {
          if (item === this.searchContent) {
            checkrepeat = true
          }
        })
        if (!checkrepeat) {
          this.searchHistory.push(this.searchContent)
        }
      } else {
        this.searchHistory.push(this.searchContent)
      }
      setSearchHistory('searchHistory', this.searchHistory)
    },

    // ~ 当搜索框为空时清空搜索内容的数据
    checkInput () {
      if (this.searchContent === '') {
        this.listoryStatus = true
        this.searchResultEmpty = false
        this.searchResult = []
      }
    },

    // ~ 清除当前项的数据
    deleteCurrentListory (index) {
      this.searchHistory.splice(index, 1)
      setSearchHistory('searchHistory', this.searchHistory)
    },

    // ~ 清除所有历史数据
    deleteAllListory () {
      this.searchHistory = []
      setSearchHistory('searchHistory', this.searchHistory)
    }
  },
  components: {
    FooterBottom,
    HeaderTop
  }
}
</script>
<style lang="less" scope>
.search-container {
  .pd(b, 46px);
  .bg-c(#f5f5f5);
  .search-form {
    .ps(rt);
    .dp(f);
    .j-c(c);
    .a-i(c);
    .z(10);
    .h(59px);
    .bg-c(#fff);
    &::before {
      content: '';
      .ps(ab);
      bottom: 0;
      .wh(100%, 1px);
      .bg-c(#e5e5e5);
    }
    input {
      .h(36px);
      .ft-s(14px);
      &.search-input {
        .w(70%);
        .pd(0 10px);
        .mg(r, 10px);
        .bd(1px solid #e5e5e5);
        .bg-c(#f2f2f2);
        .bdr(5px);
      }
      &.search-submit {
        .w(20%);
        .c(#fff);
        .bg-c(#3190e8);
        .bdr(4px);
      }
    }
  }
  .search-main {
    .search-content {
      h3 {
        .pd(8px 0 8px 12px);
        .ft-s(16px);
        .c(#666);
      }
      .search-shop-list {
        .bg-c(#fff);
        .search-shop-item {
          .dp(f);
          .j-c(sb);
          .pd(10px 12px);
          .bd(b, 1px solid #e4e4e4);
          .item-msg-img {
            .wh(70px,70px);
            img {
              .bd(1px solid #e4e4e4);
              .bdr(8px);
            }
          }
          .item-msg-info {
            .dp(f);
            .f-d(c);
            .j-c(sb);
            .w(75%);
            .ft-s(15px);
            h5 {
              .dp(f);
              .j-c(sb);
              .a-i(c);
              .ft-s(12px);
              .shop-item-content-l {
                .w(65%);
                .ellipsis();
                .msg-title {
                  .pd(2px 5px);
                  .mg(r, 5px);
                  .bg-c(#ffd930);
                  .bdr(4px);
                }
              }
              .shop-item-content-r {
                span {
                  .dp(ib);
                  .pd(0 2px);
                  .mg(0 1px);
                  .bd(1px solid transparent);
                  .bdr(3px);
                }
              }
            }
            & > p {
              .dp(f);
              .j-c(sb);
              .ft-s(12px);
              & span:nth-of-type(1) {
                .tranf(scale(.9));
                -webkit-transform-origin-x: 0;
                -webkit-transform-origin-y: 50%;
              }
              & span:nth-of-type(2) {
                .tranf(scale(.9));
                -webkit-transform-origin-x: 100%;
                -webkit-transform-origin-y: 50%;
              }
            }
          }
        }
      }
    }
    .search-listory {
      h3 {
        .pd(8px 0 8px 12px);
        .ft-s(16px);
        .c(#666);
      }
      .search-listory-list {
        .bg-c(#fff);
        .search-listory-item {
          .dp(f);
          .j-c(sb);
          .a-i(c);
          .pd(0 10px);
          .h(46px);
          .bd(b, 1px solid #e4e4e4);
          .listory-item-info {
            .w(90%);
            .ellipsis()
          }
        }
      }
      .clear-listory {
        .txt-a(c);
        .h(46px);
        .l-h(46px);
        .ft-w(600);
        .c(#3190e8);
        .bg-c(#fff);
      }
    }
    .search-reject {
      .ps(fx);
      top: 0;
      .z(1);
      .flex-hv();
      .f-d(c);
      .wh(100%, 100%);
      img {
        .w(50%);
      }
      p {
        .c(#3190e8);
        .ft-s(16px);
        .pd(t, 20px);
      }
    }
  }
}
</style>
