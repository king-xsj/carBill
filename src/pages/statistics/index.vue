<template>
  <view class="statistics">
    <image class="img" mode="aspectFill" src="/static/other/xiaoxin.jpg"></image>
    <uni-fab
      ref="fab"
      :pattern="baseFab.pattern"
      :horizontal="baseFab.horizontal"
      :pop-menu="false"
      :vertical="baseFab.vertical"
      :direction="baseFab.direction"
      @fab-click="fabClick"
    />
  </view>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'

const baseFab = reactive({
  title: 'uni-fab',
  horizontal: 'right',
  vertical: 'bottom',
  direction: 'horizontal',
  pattern: {
    color: '#7A7E83',
    backgroundColor: '#fff',
    selectedColor: '#007AFF',
    buttonColor: '#118dde',
    iconColor: '#fff'
  }
})
const fabClick = () => {
  uni.navigateTo({
    url: '/pages/accounting/index'
  })
}
</script>

<style lang="scss" scoped>
.statistics {
  .img {
    width: 100%;
  }
}
</style>
