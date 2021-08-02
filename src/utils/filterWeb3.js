import Vue from 'vue'

// 地址脱敏
Vue.filter('addressDesensitization', function (value, beforeLength, afterLength = 4) {
  if (!value) return ''

  if (!beforeLength) {
    beforeLength = 4
  }
  if (!afterLength) {
    afterLength = 4
  }
  value = value.toString()
  return value.substring(0, beforeLength) + '*****' + value.substring(value.length - afterLength)
})
