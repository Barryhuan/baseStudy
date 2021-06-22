<template>
  <div class="login-container full-screen">
    <header-top
      head-title="密码登录"
      goBack="true"
      backStatus="true"
    ></header-top>
  </div>
</template>
<script>
const HeaderTop = () => import('@com/headertop')
export default {
  name: 'login',
  data () {
    return {
    }
  },
  components: { HeaderTop }
}
</script>
<style lang="less" scope>

</style>
