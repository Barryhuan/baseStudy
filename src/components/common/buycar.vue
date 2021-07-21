<template>
  <div class="car-content">
    <div v-if="!foodItem.specifications.length" class="control-car">
      <transition name="showReduce">
        <i
          class="iconfont icon-reduce"
          v-if="foodCount"
          @click="removeOutCart(
            foodItem.category_id,
            foodItem.item_id,
            foodItem.specfoods[0].food_id,
            foodItem.specfoods[0].name,
            foodItem.specfoods[0].price,
            '',
            foodItem.specfoods[0].packing_fee,
            foodItem.specfoods[0].sku_id,
            foodItem.specfoods[0].stock
          )">
        </i>
      </transition>
      <transition name="fade">
        <span class="cart-count" v-if="foodCount">{{ foodCount }}</span>
      </transition>
      <i class="iconfont icon-add" @click="addToCar(
        foodItem.category_id,
        foodItem.item_id,
        foodItem.specfoods[0].food_id,
        foodItem.specfoods[0].name,
        foodItem.specfoods[0].price,
        '',
        foodItem.specfoods[0].packing_fee,
        foodItem.specfoods[0].sku_id,
        foodItem.specfoods[0].stock,
        $event
      )"></i>
    </div>
    <div v-else class="choose-specs">
      <div class="choose-icon-content">
        <transition name="showReduce">
          <i class="iconfont icon-reduce" v-if="foodCount" @click="showReduceTip"></i>
        </transition>
        <transition name="fade">
          <span class="cart-count" v-if="foodCount">{{ foodCount }}</span>
        </transition>
        <span class="show-choose-list" @click="showChooseList(foodItem)">选规格</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'

export default {
  data () {
    return {
      showMoveDot: []
    }
  },
  methods: {
    ...mapMutations(['ADD_CAR', 'REDUCE_CAR']),
    // ~ 将添加到购物车里
    addToCar (categoryId, itemId, foodId, name, price, specs, packingFee, skuId, stock, event) {
      this.ADD_CAR({ shopId: this.shopId, categoryId, itemId, foodId, name, price, specs, packingFee, skuId, stock, event })
      let elLeft = event.target.getBoundingClientRect().left
      let elBottom = event.target.getBoundingClientRect().bottom
      this.showMoveDot.push(true)
      this.$emit('showMoveDot', this.showMoveDot, elLeft, elBottom)
    },
    // ~ 从购物车里移除商品
    removeOutCart (categoryId, itemId, foodId, name, price, specs, packingFee, skuId, stock) {
      if (this.foodCount > 0) {
        this.REDUCE_CAR({ shopId: this.shopId, categoryId, itemId, foodId, name, price, specs, packingFee, skuId, stock })
      }
    },
    showChooseList (foodScroll) {
      this.$emit('showChooseList', foodScroll)
    },
    showReduceTip () {
      this.$emit('showReduceTip')
    }
  },
  props: ['foodItem', 'shopId'],
  computed: {
    ...mapState(['cartList']),
    shopCart () {
      return Object.assign({}, this.cartList[this.shopId])
    },
    foodCount () {
      let categoryId = this.foodItem.category_id
      let itemId = this.foodItem.item_id
      if (this.shopCart && this.shopCart[categoryId] && this.shopCart[categoryId][itemId]) {
        let count = 0
        Object.values(this.shopCart[categoryId][itemId]).forEach(item => {
          count += item.num
        })
        return count
      } else {
        return 0
      }
    }
  }
}
</script>
<style lang="less" scope>
.buycar-content {
  .dp(f);
  .j-c(sb);
  .pd(0 10px 10px);
  .buycar-price {
    .f-g(1);
    & span:nth-of-type(1) {
      .ft-s(12px);
      .c(#ff6600);
    }
    & span:nth-of-type(2) {
      .ft-w(600);
      .c(#ff6600);
      .mg(l, -5px);
    }
    & span:nth-of-type(3) {
      .ft-s(12px);
    }
  }
  .car-content {
    .dp(f);
    .j-c(fe);
    .f-g(1);
    .choose-specs {
      .dp(f);
      .j-c(fe);
      .w(70%);
      .choose-icon-content {
        .dp(f);
        .a-i(c);
        .iconfont {
          .ft-s(18px);
          .c(#3190e8);
        }
        .cart-count {
          .ft-s(14px);
          .mg(0 10px 0 6px);
        }
        .show-choose-list {
          .flex-hv();
          .pd(3px 6px);
          .ft-s(12px);
          .bg-c(#3190e8);
          .c(#fff);
          .bdr(5px);
        }
      }
    }
    .control-car {
      .dp(f);
      .a-i(c);
      .cart-count {
        .ft-s(14px);
        .mg(0 6px);
      }
      .iconfont {
        .ft-s(18px);
        .c(#3190e8);
      }
    }
  }
}
.showReduce-enter-active, .showReduce-leave-to {
  .trans(all .3s ease-out);
}

.showReduce-enter, .showReduce-leave-to {
  opacity: 0;
  .tranf(translateX(10px));
}

.fade-enter-active, .fade-leave-to {
  .trans(all .3s);
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.fade-bounce-enter-active, .fade-bounce-leave-active {
  .trans(all .3s);
}

.fade-bounce-enter, .fade-bounce-leave-to {
  opacity: 0;
  .tranf(scale(.7));
}

</style>
