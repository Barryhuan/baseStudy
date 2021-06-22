<template>
  <div class="city-container full-screen">
    <!-- 头部组件  -->
    <header-top goBack="true" :headTitle="currentCityName">
      <router-link to="/home" slot="change-city" class="change-city">切换城市</router-link>
    </header-top>

    <!-- 搜索栏 -->
    <form class="city-form" @submit.prevent>
      <div class="search-city">
        <input
          type="search"
          name="search-city"
          placeholder="输入学校、商务楼、地址"
          class="search-input input-style"
          required v-model="seatchCity"
        >
      </div>
      <div class="submit-msg">
        <input type="submit" name="submit" value="提交" class="submit-input input-style" @click="postSearchValue">
      </div>
    </form>

    <!-- 搜索结果 -->
    <div class="search-history" v-if="historyTitle">搜索历史</div>
    <ul class="search-result-list">
      <li class="search-result-item" v-for="(item, index) of searchCityList" :key="index" @click="nextLink(index, item.geohash)">
        <h4>{{ item.name }}</h4>
        <p>{{ item.address }}</p>
      </li>
    </ul>
    <footer class="clear-allresult" v-if="historyTitle && searchCityList.length" @click="removeAllHistory">清空搜索记录</footer>
    <div class="search-null" v-if="searcNullResult">很抱歉！无搜索结果！</div>
    <div class="search-null" v-if="searchNullStr">请输入搜索关键字！</div>
  </div>
</template>
<script>
import HeaderTop from '@com/headertop'
import { searchCityName, searchResult } from '@/api/'
import { setSearchHistory, getSearchHistory, removeSearchHistory } from '@/utils/'
export default {
  data () {
    return {
      seatchCity: '', // ~ 搜索地址
      currentCityId: '', // ~ 当前城市Id
      currentCityName: '', // ~ 当前城市名称
      searchCityList: [], // ~ 搜索城市结果
      localSearchList: [], // ~ 搜索历史记录
      historyTitle: true, // ~ 切换搜索结果显示
      searcNullResult: false, // ~ 显示搜索无结果的提示
      searchNullStr: false // ~ 搜索结果为空
    }
  },
  mounted () {
    // ~ 根据路径参数获取的城市id去请求该城市的信息
    this.currentCityId = this.$route.params.id
    searchCityName(this.currentCityId).then(res => {
      this.currentCityId = res.id
      this.currentCityName = res.name
    })
    this.initData()
  },
  components: { HeaderTop },
  methods: {
    // ~ 初始化刚进页面的搜索历史，要是有搜索历史则显示在页面上，无则清空搜索历史列表
    initData () {
      if (getSearchHistory('localSearchList')) {
        this.searchCityList = JSON.parse(getSearchHistory('localSearchList'))
      } else {
        this.searchCityList = []
      }
    },
    // ~ 发送搜索请求
    postSearchValue () {
      // ~ 判断输入栏有无值，要是无或者空字串则不发送请求
      if (this.seatchCity.trim()) {
        // ~ 传入城市id和搜索的值
        searchResult(this.currentCityId, this.seatchCity).then(res => {
          // ~ 将搜索历史隐藏
          this.historyTitle = false
          /* eslint-disable no-unneeded-ternary */
          // ~ 根据请求的结果长度作判断，判断是否将清楚搜索结果隐藏，一般提交时默认隐藏，要是有搜索历史则显示
          this.searcNullResult = res.length ? false : true
          /* eslint-enable no-unneeded-ternary */
          // ~ 搜索结果赋值给搜索历史列表值
          this.searchCityList = res
        })
      }
    },
    // ~ 点击列表跳转到商铺页面，存入本地缓存中，并存入列表id和经纬度值请求
    nextLink (index, geohash) {
      // ~ 读取本地缓存，无则为undefined
      let history = getSearchHistory('localSearchList')
      // ~ 将当前的列表值赋值
      let collectResult = this.searchCityList[index]
      // ~ 如果有本地历史记录则不用添加进本地缓存中
      if (history) {
        let isExistence = false
        this.localSearchList = JSON.parse(history)
        this.localSearchList.forEach(item => {
          if (item.geohash === geohash) {
            isExistence = true
          }
        })
        // ~ 如果没有则添加入本地缓存中
        if (!isExistence) {
          this.localSearchList.push(collectResult)
        }
      // ~ 如果没有则添加入本地缓存中
      } else {
        this.localSearchList.push(collectResult)
      }
      // ~ 将点击过的列表存入本地缓存中
      setSearchHistory('localSearchList', this.localSearchList)
      // ~ 点击跳转到商铺集合页面，并传参数
      this.$router.push({ path: '/shoplist', query: { geohash } })
    },
    // ~ 清除本地所有的
    removeAllHistory () {
      removeSearchHistory('localSearchList')
      this.initData()
    }
  }
}
</script>
<style lang="less" scope>
  .city-container {
    .bg-c(#f5f5f5);
    .change-city {
      .w(20%);
      .txt-a(r);
    }
    .city-form {
      .pd(15px 30px);
      .bd(b, 1px solid #e5e5e5);
      .bg-c(#fff);
      .search-input {
        .wh(100%, 35px);
        .pd(0 10px 0 15px);
        .bd(1px solid #e5e5e5);
        .l-h(35px);
        .ft-s(15px);
        &::-webkit-search-cancel-button {
          .ps(rt);
          .wh(50px);
        }
      }
      .submit-msg {
        .mg(t, 15px);
        .submit-input {
          .wh(100%, 35px);
          .bg-c(#3190e8);
          .ft-s(16px);
          .c(#fff);
          .bdr(5px);
        }
      }
    }
    .search-history {
      .pd(10px 0 10px 10px);
      .ft-s(16px);
    }
    .search-result-list {
      .bg-c(#fff);
      .search-result-item {
        .ps(rt);
        .pd(15px);
        .bd(b, 1px solid #e5e5e5);
        h4 {
          .ft-s(16px);
          .ft-w(600);
          .c(#3190e8);
        }
        p {
          .pd(8px 0 0);
          .ft-s(14px);
          .c(#999);
          .ellipsis();
        }
      }
      & .search-result-item:first-child::before {
        content: '';
        .ps(ab);
        top: 0;
        left: 0;
        .wh(100%, 1px);
        .bg-c(#e5e5e5);
      }
    }
    .clear-allresult,
    .search-null {
      .pd(15px 0);
      .ft-s(16px);
      .txt-a(c);
      .bg-c(#fff);
    }
  }
</style>
