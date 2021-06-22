<template>
  <div class="home full-screen">
    <header-top signin-up="home" class="home-head">
      <span slot="logo" class="logo" @click="logoReload">Barry</span>
    </header-top>
    <nav class="city-nav">
      <div class="location-city">
        <span class="location-l">当前定位城市：</span>
        <span class="location-r">定位不准时，请在城市列表中选择</span>
      </div>
      <router-link :to="'/city/' + currentCityId" class="current-city">
        <span>{{currentCity}}</span>
        <i class="iconfont icon-arrow-r"></i>
      </router-link>
    </nav>
    <div class="hotcity-container">
      <p class="hotcity-title">热门城市</p>
      <div class="hotcity-list">
        <router-link :to="'/city/' + item.id" class="hotcity-item" v-for="item in hotCity" :key="item.id">{{item.name}}</router-link>
      </div>
    </div>
    <div class="city-container">
      <div class="city-content" v-for="(allItem, ket, allIndex) in sortCity" :key="allIndex">
        <p class="city-title">{{ket}}</p>
        <div class="city-list">
          <router-link
            :to="'/city/' + cityItem.id"
            class="city-item"
            v-for="cityItem of allItem"
            :key="cityItem.id">{{cityItem.name}}</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import HeaderTop from '@com/headertop'
import { currentCity, hotCity, cityGroup } from '../api/getData'
export default {
  data () {
    return {
      currentCity: '', // ~ 当前城市列表
      currentCityId: '', // ~ 当前城市id
      hotCity: [], // ~ 热门城市列表
      allCityList: {} // ~ 所有城市列表
    }
  },
  methods: {
    // ~ 点击logo重新加载当前页面
    logoReload () {
      window.location.reload()
    }
  },
  mounted () {
    // ~ 调用当前城市接口获取数据
    currentCity().then(res => {
      this.currentCity = res.name
      this.currentCityId = res.id
    })
    // ~ 调用热门城市接口获取数据
    hotCity().then(res => {
      this.hotCity = res
    })
    // ~ 调用所有城市接口获取数据
    cityGroup().then(res => {
      this.allCityList = res
    })
  },
  computed: {
    // ~ A-Z顺序排序
    sortCity () {
      // ~ 存储排序好的对象（接口返回的也是个对象）
      let sortList = {}
      // ~ 根据A-Z的Unicode编码转化，分别是65-90，对应A-Z
      for (let i = 65; i <= 90; i++) {
        // ~ 使用String.fromCharCode将Unicode编码转换成对应的字母，并将排序好的对象存储进sortList对象中
        if (this.allCityList[String.fromCharCode(i)]) {
          sortList[String.fromCharCode(i)] = this.allCityList[String.fromCharCode(i)]
        }
      }
      return sortList
    }
  },
  components: { HeaderTop }
}
</script>
<style lang="less" scope>
  .home {
    .bg-c(#f5f5f5);
    .home-head {
      z-index: 99;
    }
    .logo {
      .ft-s(15px);
      .ft-w(600);
    }
    .city-nav {
      .bg-c(#FFF);
      .location-city {
        .dp(f);
        .j-c(sb);
        .a-i(c);
        .h(33px);
        .pd(0 10px);
        .ft-s(13px);
        .bd(b, 1px solid #e4e4e4);
        .location-r {
          .c(#9f9f9f);
        }
      }
      .current-city {
        .dp(f);
        .j-c(sb);
        .a-i(c);
        .h(43px);
        .pd(0 10px);
        .bd(b, 1px solid #e4e4e4);
        span {
          .ft-s(18px);
          .c(#3190e8);
        }
        .icon-arrow-r {
          .ft-s(20px);
        }
      }
    }
    .hotcity-container {
      .mg(t, 15px);
      .bd(t, 1px solid #e5e5e5);
      .bg-c(#FFF);
      .hotcity-title {
        .dp(f);
        .pd(5px 10px);
        .ft-s(14px);
      }
      .hotcity-list {
        .dp(f);
        .f-w(r);
        .j-c(se);
        .hotcity-item {
          .ps(rt);
          .w(25%);
          .pd(12px 0);
          .ft-s(13px);
          .txt-a(c);
          .c(#3190e8);
          .bd(t, 1px solid #e5e5e5);
          &::before {
            content: '';
            .ps(ab);
            top: 0;
            right: 0;
            .wh(1px, 100%);
            .bg-c(#e5e5e5);
          }
        }
        & .hotcity-item:nth-of-type(4n)::before {
          .w(0);
        }
      }
    }
    .city-container {
      .bd(t, 1px solid #e5e5e5);
      .bg-c(#f5f5f5);
      .city-content {
        .bd(t, 1px solid #e5e5e5);
        .mg(t, 15px);
        .bg-c(#FFF);
        .city-title {
          .dp(f);
          .pd(8px 10px);
          .ft-s(13px);
          .c(#999);
        }
        .city-list {
          .ps(rt);
          .dp(f);
          .f-w(r);
          .j-c(fs);
          .bd(t, 1px solid #e5e5e5);
          .city-item {
            .ps(rt);
            .w(25%);
            .pd(12px 5px);
            .ft-s(13px);
            .txt-a(c);
            .c(#666);
            .bd(b, 1px solid #e5e5e5);
            .ellipsis();
            &::before {
              content: '';
              .ps(ab);
              top: 0;
              right: 0;
              .wh(1px, 100%);
              .bg-c(#e5e5e5);
            }
          }
          & .city-item:nth-of-type(4n)::before {
            .w(0);
          }
          &::before {
            content: '';
            .ps(ab);
            bottom: 0;
            .wh(100%, 1px);
            .bg-c(#e5e5e5);
          }
        }
      }
    }
  }
</style>
