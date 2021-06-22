<template>
  <div class="shop-container full-screen">
    <header-top
      goBack = "true"
      backStatus = "true"
      headTitle = "商品"
    ></header-top>
  </div>
</template>
<script>
import {
  shopListAddress, // ~ 地址请求
  shopDetails, // ~ 商铺详情
  shopMenu, // ~ 商品菜单
  getRatingList, // ~ 商品评价列表
  ratingScores, // ~ 商铺评价分数
  ratingTags // ~ 商铺评价分类
} from '@/api/'

console.log(shopListAddress, shopDetails, shopMenu, getRatingList, ratingScores, ratingTags)
const HeaderTop = () => import('@com/headertop')
export default {
  data () {
    return {
    }
  },
  components: { HeaderTop }
}
</script>
<style lang="less" scope>
</style>
