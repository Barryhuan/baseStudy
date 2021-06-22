<template>
  <div class="shop-list full-screen">
    <!-- 头部组件 -->
    <header-top signin-up="shoplist">
        <router-link :to="{ path: `/search/${geohash}` }" slot="search" class="search-icon">
          <i class="iconfont icon-search"></i>
        </router-link>
        <router-link to="/home" slot="shoplist-title" class="to-home">
          <span>{{ shopListTitle }}</span>
        </router-link>
    </header-top>

    <!-- 分类轮播图 -->
    <nav class="shoplist-nav">
      <div class="swiper-container" v-if="foodTypeList.length">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="(item, index) of foodTypeList" :key="index">
            <router-link
              :to="{
                path: '/food',
                query: {
                  geohash, title:
                  foodItem.title,
                  restaurant_category_id: getCategoryId(foodItem.link)
                }
              }"
              v-for="foodItem of item"
              :key="foodItem.id"
              class="foodItem"
            >
              <figure>
                <img :src="imageBaseUrl + foodItem.image_url" alt="">
                <figcaption>{{ foodItem.title }}</figcaption>
              </figure>
            </router-link>
          </div>
        </div>
        <div class="swiper-pagination"></div>
      </div>
    </nav>

    <!-- 商铺列表 -->
    <div class="shoplist-container">
      <p class="shoplist-business">
        <i class="iconfont icon-shangjia"></i>
        附近商家
      </p>
      <!-- 商铺列表组件 -->
      <shop-container v-if="isShowList" :geohash="geohash"/>
    </div>
    <footer-bottom />
  </div>
</template>
<script>
import Swiper from 'swiper'
import '../assets/css/plugins/swiper.min.css'
import { currentCity, shopListAddress, shopListApi } from '../api/getData'
import { mapMutations } from 'vuex'
const HeaderTop = () => import('@com/headertop')
const FooterBottom = () => import('@com/footerbottom')
const ShopContainer = () => import('@com/common/shopcontainer')
export default {
  props: ['signinUp'],
  data () {
    return {
      geohash: '', // ~ 当前城市的经纬度
      shopListTitle: '', // ~ 头部标题变量
      isShowList: false, // ~ 判断是否显示商品列表
      foodTypeList: [], // ~ 导航选项栏
      imageBaseUrl: 'https://fuss10.elemecdn.com' // ~ 图片基础路径
    }
  },
  async mounted () {
    // ~ 判断url路径种有没有查询参数，没有则重新请求数据
    if (!this.$route.query.geohash) {
      let location = await currentCity()
      this.geohash = location.latitude + ',' + location.longitude
    } else {
      this.geohash = this.$route.query.geohash
    }

    // ~ 将经纬度存储到vuex的state中
    this.SAVE_GEOHASH(this.geohash)

    // ~ 请求当前头部标题名
    let address = await shopListAddress(this.geohash)
    this.shopListTitle = address.name
    this.SAVE_LA_LG({ latitude: address.latitude, longitude: address.longitude })
    // ~ 将显示列表选项设置为true，即显示
    this.isShowList = true

    // ~ 请求头导航种的列表选项
    shopListApi(this.geohash).then(res => {
      let swiperItemLength = res.length // ~ 将作为分组判断依据
      let swiperArr = [...res] // ~ 将数据深拷贝到另一个变量
      let foodArr = [] // ~ 将做为渲染列表
      for (let i = 0, j = 0; i < swiperItemLength; i += 8, j++) {
        // ~ 将数据分为2组，即两页数据
        foodArr[j] = swiperArr.splice(0, 8)
      }
      this.foodTypeList = foodArr
    }).then(() => {
      // ~ 轮播图设置
      /* eslint-disable no-new */
      new Swiper('.swiper-container', {
        loop: true,
        autoplay: 3000,
        speed: 1500,
        autoplayDisableOnInteraction: false,
        pagination: '.swiper-pagination'
      })
    })
  },
  methods: {
    // ~ mutations导入
    ...mapMutations(['SAVE_GEOHASH', 'SAVE_LA_LG']),

    // ~ 处理导航选项的跳转路径
    getCategoryId (url) {
      let urlData = decodeURIComponent(url.split('=')[1].replace('&target_name', ''))
      if (/restaurant_category_id/gi.test(urlData)) {
        return JSON.parse(urlData).restaurant_category_id.id
      } else {
        return ''
      }
    }
  },
  components: {
    HeaderTop,
    FooterBottom,
    ShopContainer
  }
}
</script>
<style lang="less" scope>
  .shop-list {
    .pd(b, 46px);
    .bg-c(#f5f5f5);
    .head-top {
      .search-icon {
        .w(5%);
        .ft-s(17px);
        .txt-a(l);
        .iconfont {
          .ft-s(16px);
        }
      }
      .to-home {
        .w(65%);
        .txt-a(c);
        .ellipsis()
      }
    }
    .shoplist-nav {
      .bg-c(#fff);
      .bd(b, 1px solid #e5e5e5);
      .swiper-container {
        .h(193px);
        .swiper-slide {
          .dp(f);
          .f-w(r);
          .pd(b, 20px);
          .foodItem {
            .wh(25%, 50%);
            figure {
              .flex-hv();
              .f-d(c);
              .wh(100%, 100%);
              img {
                .w(50%);
              }
              figcaption {
                .mg(t, 5px);
                .ft-s(14px);
              }
            }
          }
        }
      }
      .swiper-pagination {
        bottom: 2%;
      }
    }
    .shoplist-container {
      .mg(t, 10px);
      .bd(t, 1px solid #e5e5e5);
      .bd(b, 1px solid #e5e5e5);
      .bg-c(#fff);
      .shoplist-business {
        .dp(f);
        .a-i(c);
        .ft-s(14px);
        .pd(8px);
        .icon-shangjia {
          .ft-s(14px);
          .mg(r, 8px);
          .c(#999);
        }
      }
    }
  }
</style>
