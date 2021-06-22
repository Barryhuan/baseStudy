<template>
  <div class="order-container full-screen">
    <header-top head-title="订单" onlyStatus="true"></header-top>
    <footer-bottom />
  </div>
</template>
<script>
const HeaderTop = () => import('@com/headertop')
const FooterBottom = () => import('@com/footerbottom')
export default {
  data () {
    return {
    }
  },
  components: {
    FooterBottom,
    HeaderTop
  }
}
</script>
<style lang="less" scope>
  .order-container {
    .bg-c(#f5f5f5);
  }
</style>
