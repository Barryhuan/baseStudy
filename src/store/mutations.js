import {
  SAVE_GEOHASH,
  SAVE_LA_LG
} from './mutations-type'

export default {
  // ~ 存储当前geohash的值
  [SAVE_GEOHASH] (state, geohash) {
    state.geohash = geohash
  },
  // ~ 记录具体的经纬度信息
  [SAVE_LA_LG] (state, { latitude, longitude }) {
    state.latitude = latitude
    state.longitude = longitude
  }
}
