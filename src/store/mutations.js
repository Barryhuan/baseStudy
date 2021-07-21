import {
  SAVE_GEOHASH,
  SAVE_LA_LG,
  ADD_CAR,
  REDUCE_CAR,
  INIT_BUYCART,
  CLEAR_CART,
  RECORD_SHOPDETAIL,
  SAVE_SHOPID
} from './mutations-type'

import { setSearchHistory, getSearchHistory } from '../utils/'

export default {
  // ~ 存储当前geohash的值
  [SAVE_GEOHASH] (state, geohash) {
    state.geohash = geohash
  },
  // ~ 记录具体的经纬度信息
  [SAVE_LA_LG] (state, { latitude, longitude }) {
    state.latitude = latitude
    state.longitude = longitude
  },
  // ~ 添加到购物车中
  [ADD_CAR] (state, {
    shopId,
    categoryId,
    itemId,
    foodId,
    name,
    price,
    specs,
    packingFee,
    skuId,
    stock
  }) {
    let cart = state.cartList
    let shop = cart[shopId] = (cart[shopId] || {})
    let category = shop[categoryId] = (shop[categoryId] || {})
    let item = category[itemId] = (category[itemId] || {})
    if (item[foodId]) {
      item[foodId]['num']++
    } else {
      item[foodId] = {
        'num': 1,
        'id': foodId,
        'name': name,
        'price': price,
        'specs': specs,
        'packingFee': packingFee,
        'skuId': skuId,
        'stock': stock
      }
    }
    state.cartList = { ...cart }
    setSearchHistory('buyCart', state.cartList)
  },
  // ~ 从购物车中删除
  [REDUCE_CAR] (state, {
    shopId,
    categoryId,
    itemId,
    foodId
  }) {
    let cart = state.cartList
    let shop = cart[shopId] || {}
    let category = shop[categoryId] || {}
    let item = category[itemId] || {}
    if (item && item[foodId]) {
      if (item[foodId]['num'] > 0) {
        item[foodId]['num']--
        state.cartList = { ...cart }
        setSearchHistory('buyCart', state.cartList)
      } else {
        item[foodId] = null
      }
    }
  },
  // ~ 初始化购物车
  [INIT_BUYCART] (state) {
    let initCart = getSearchHistory('buyCart')
    if (initCart) {
      state.cartList = JSON.parse(initCart)
    }
  },
  // ~ 清除购物车信息
  [CLEAR_CART] (state, shopId) {
    state.cartList[shopId] = null
    state.cartList = { ...state.cartList }
    setSearchHistory('buyCart', state.cartList)
  },
  // ~ 记录商铺信息
  [RECORD_SHOPDETAIL] (state, detail) {
    state.shopDetail = detail
  },
  // ~ 保存商铺id
  [SAVE_SHOPID] (state, shopId) {
    state.shopId = shopId
  }
}
