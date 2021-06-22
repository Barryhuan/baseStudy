// ~ 存储本地搜索历史
export const setSearchHistory = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.localStorage.setItem(name, content)
}

// ~ 读取本地搜索历史
export const getSearchHistory = name => {
  if (!name) return
  return window.localStorage.getItem(name)
}

// ~ 清楚本地搜索历史
export const removeSearchHistory = name => {
  if (!name) return
  window.localStorage.removeItem(name)
}

// ~ 防止state数据因为刷新丢失数据
export const saveCurrentState = store => {
  if (sessionStorage.getItem('store')) {
    store.replaceState(Object.assign({}, store.state, JSON.parse(sessionStorage.getItem('store'))))
  }
  window.addEventListener('beforeunload', () => {
    sessionStorage.setItem('store', JSON.stringify(store.state))
  })
}

// ~ 处理图片地址
export const handlePicturePath = {
  methods: {
    handlePicturePath (path) {
      let suffix
      if (!path) {
        return '//elm.cangdu.org/img/default.jpg'
      }
      suffix = path.includes('jpeg') ? '.jpeg' : '.png'
      return 'https://fuss10.elemecdn.com' + '/' + path.substr(0, 1) + '/' + path.substr(1, 2) + '/' + path.substr(3) + suffix
    }
  }
}
