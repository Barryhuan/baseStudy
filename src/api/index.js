import ajax from './ajax'
/*
!  首页接口
*/

// ~ 获取当前城市接口
export const currentCity = () => ajax('/v1/cities', {
  type: 'guess'
})

// ~ 获取热门城市接口
export const hotCity = () => ajax('/v1/cities', {
  type: 'hot'
})

// ~ 获取所有城市接口
export const cityGroup = () => ajax('/v1/cities', {
  type: 'group'
})

/*
!  搜索页接口
*/

// ~ 进入到搜索页面去请求城市名接口
export const searchCityName = cityId => ajax('v1/cities/' + cityId)

// ~ 提交搜索地名的接口,传入城市id和输入框的值
export const searchResult = (cityId, content) => ajax('/v1/pois', {
  type: 'search',
  city_id: cityId,
  keyword: content
})


/*
!  商品首页页接口
*/

//~ 商品列表页面的根据经纬度接口
export const shopListAddress = geohash => ajax('/v2/pois/' + geohash)

//~ 商品列表页面的食物列表接口
export const shopListApi = geohash => ajax('/v2/index_entry', {
  geohash,
  group_type: '1',
	'flags[]': 'F'
})

//~ 商品列表商铺列表接口
export const shopItemApi = (
  latitude,
  longitude,
  offset,
  restaurant_category_id = '',
  restaurant_category_ids = '',
  order_by = '',
  delivery_mode = '',
  support_ids = []
) => {
  let supportStr = ''
  support_ids.forEach(item => {
    if (item.status) {
      supportStr += '&support_ids[]=' + item.id
    }
  })
  return ajax('/shopping/restaurants', {
    latitude,
    longitude,
    offset,
    limit: '20',
    'extras[]': 'activities',
    keyword: '',
    restaurant_category_id,
    'restaurant_category_ids[]': restaurant_category_ids,
    order_by,
    'delivery_mode[]': delivery_mode + supportStr
  })
}


/*
!  商品食物分类接口
*/

//~ 获取商品分类
export const foodCategory = (latitude, longitude) => ajax('/shopping/v2/restaurant/category', { latitude, longitude })

//~ 获取商家送货数据接口
export const foodDelivery = (latitude, longitude) => ajax('/shopping/v1/restaurants/delivery_modes', { latitude, longitude })

//~ 获取商家活动数据接口
export const foodActivity = (latitude, longitude) => ajax('/shopping/v1/restaurants/activity_attributes', { latitude, longitude })


/*
!  搜索页面记录
*/

//~ 获取搜索商铺数据接口
export const searchList= (geohash, keyword) => ajax('/v4/restaurants', {
  'extras[]': 'restaurant_activity',
  geohash,
  keyword,
  type: 'search'
})

/*
!  商铺商品详情
*/

//~ 商品详情接口
export const shopDetailsApi = (shopid, latitude, longitude) => ajax('/shopping/restaurant/' + shopid, {
  latitude,
  longitude: longitude + '&extras[]=activities&extras[]=album&extras[]=license&extras[]=identification&extras[]=statistics'
})

//~ 商品菜单列表接口
export const shopMenuListApi = restaurant_id => ajax('/shopping/v2/menu', { restaurant_id })

//~ 商品评价列表接口
export const ratingListApi = (shopid, offset, tag_name = '') => ajax('/ugc/v2/restaurants/' + shopid + '/ratings', {
  has_content: true,
	offset,
	limit: 10,
	tag_name
})

//~ 商铺评价分数接口
export const ratingScoresDataApi = shopid => ajax('/ugc/v2/restaurants/' + shopid + '/ratings/scores')

//~ 商铺评价分类接口
export const ratingTagsApi = shopid => ajax('/ugc/v2/restaurants/' + shopid + '/ratings/tags')