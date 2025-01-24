<template>
  <view class="mine">
    <view class="image-content">
      <image class="img" mode="aspectFit" src="/static/images/login/logo.png"></image>
    </view>
    <view class="image-title">微信用户</view>
    <view class="image-desc">ID:123456789</view>
  </view>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.mine {
  .image-content {
    display: flex;
    justify-content: center;
    .img {
      width: 240rpx;
      height: 240rpx;
      border-radius: 50%;
      background-color: $u-bg-color;
    }
  }
  .image-title {
    font-size: 40rpx;
    text-align: center;
    padding-top: 30rpx;
  }
  .image-desc {
    font-size: 32rpx;
    text-align: center;
    padding-top: 20rpx;
  }
}
</style>
