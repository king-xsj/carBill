<template>
  <view class="accounting">
    <view class="bill-input">
      <input class="uni-input" placeholder="0.00" />
      <view class="desc">
        <text class="iconfont" :class="selectedBillType.icon"></text>
        <text class="text" @click="handleShowBillType">{{ selectedBillType.text }}</text>
      </view>
    </view>
    <view class="accounting-content">
      <uni-datetime-picker v-model="billTime" :border="false" />
      <view class="location" @click="toCommunity">
        <text class="iconfont icon-weizhi"></text>
        <text>选择位置</text>
      </view>
      <textarea v-model="remark" class="textarea" placeholder="备注..."></textarea>
      <button type="primary" plain="true" class="save-btn">保存</button>
    </view>
  </view>
  <uni-popup ref="popup" type="bottom" border-radius="10px 10px 0 0">
    <view>
      <uni-list>
        <uni-list-item
          v-for="item in billType"
          :key="item.type"
          :title="item.text"
          clickable
          @click="handleSelectedType(item)"
        >
          <template #header>
            <text
              class="iconfont"
              :class="item.icon"
              :style="{ fontSize: '40rpx', color: '#fe9b26', paddingRight: '12rpx' }"
            ></text>
          </template>
          <template #footer>
            <text
              v-if="selectedBillType.type === item.type"
              class="iconfont icon-gouxuan"
              :style="{ fontSize: '32rpx', color: '#118dde' }"
            ></text>
          </template>
        </uni-list-item>
      </uni-list>
    </view>
  </uni-popup>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive } from 'vue'
import { IbillType } from '@/types/index'
import { getBillTypes } from '@/api/billTypes'
import dayjs from 'dayjs'
const billTime = ref<String>('')
const remark = ref<String>('')
const popup = ref(null)
const billType: IbillType[] = [
  {
    text: '燃油',
    icon: 'icon-fuelcost',
    type: 'REFUEL'
  },
  {
    text: '充电',
    icon: 'icon-charge',
    type: 'CHARGING'
  },
  {
    text: '停车',
    icon: 'icon-parkinglot',
    type: 'PARKING'
  },
  {
    text: '高速通行费',
    icon: 'icon-ETC',
    type: 'ETC'
  },
  {
    text: '清洁',
    icon: 'icon-clean',
    type: 'WASHING'
  },
  {
    text: '保养',
    icon: 'icon-maintenance',
    type: 'SERVICE'
  },
  {
    text: '违章',
    icon: 'icon-violation',
    type: 'PENALTY'
  },
  {
    text: '保险',
    icon: 'icon-insurance',
    type: 'INSURANCE'
  },
  {
    text: '维修',
    icon: 'icon-repair',
    type: 'FIX'
  },
  {
    text: '改装',
    icon: 'icon-refit',
    type: 'UPGRADE'
  },
  {
    text: '其他',
    icon: 'icon-other',
    type: 'OTHER'
  }
]
const selectedBillType: IbillType = reactive({
  text: '燃油',
  icon: 'icon-fuelcost',
  type: 'REFUEL'
})
const isDeny = ref<Boolean>(true)
const toCommunity = () => {
  uni.getSetting({
    success: res => {
      const status = res.authSetting
      // 如果当前设置是：不允许，则需要弹框提醒客户，需要前往设置页面打开授权
      if (!status['scope.userLocation']) {
        uni.showModal({
          title: '是否授权当前位置',
          content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
          success: tip => {
            if (tip.confirm) {
              // 如果已经拒绝过，则需要打开设置页面，授权弹框不会弹出第二次，因为已经明确拒绝/确认过了（微信的原因）
              if (isDeny.value) {
                wx.openSetting({
                  success: function () {
                    // 在设置页面授权成功后再次获取位置信息
                    uni.showToast({
                      title: '授权成功'
                    })
                    isDeny.value = false
                    // 修改授权后返回页面，弹框消失，需要再点一次
                  },
                  fail: data => {
                    console.log(data)
                    // isDeny 是否拒绝过授权，如果拒绝过，再点击按钮的话，弹框确认后就直接打开微信小程序设置页
                    isDeny.value = true
                  }
                })
                return
              }
              // 如果点击了确认，并且没有拒绝过微信系统授权弹框，则会弹出授权位置信息的弹框
              uni.authorize({
                scope: 'scope.userLocation',
                success: data => {
                  // 授权弹框点击确认
                  console.log(data)
                  // 如果用户同意授权，则打开授权设置页面，判断用户的操作
                  uni.openSetting({
                    success: data => {
                      // 如果用户授权了地理信息在，则提示授权成功
                      if (data.authSetting['scope.userLocation'] === true) {
                        uni.showToast({
                          title: '授权成功',
                          icon: 'none',
                          duration: 1000
                        })
                      }
                    }
                  })
                },
                fail: data => {
                  // 如果用户拒绝授权，则提示用户需要授权
                  console.log(data)
                  uni.showToast({
                    title: '您已拒绝授权，请重新授权',
                    icon: 'none',
                    duration: 1000
                  })
                  isDeny.value = true
                }
              })
            }
          }
        })
      } else {
        // uni.chooseLocation({
        //   success: res => {
        //     that.formData.village = res.name
        //     that.formData.address = res.address
        //     that.formData.longitude = res.longitude
        //     that.formData.latitude = res.latitude
        //     const map = new amapFile.AMapWX({
        //       key: 'f037f0a9966f01339818bbe2ec1c6495'
        //     })
        //     map.getRegeo({
        //       location: res.longitude + ',' + res.latitude,
        //       success: data => {
        //         this.formData.sheng = data[0].regeocodeData.addressComponent.province
        //         this.formData.shi = data[0].regeocodeData.addressComponent.city
        //         this.formData.qu = data[0].regeocodeData.addressComponent.district
        //       }
        //     })
        //   },
        //   fail: () => {}
        // })
      }
    },
    fail: () => {
      isDeny.value = true
    }
  })
}
const handleShowBillType = () => {
  popup.value.open('top')
}
const handleSelectedType = (item: IbillType) => {
  /* eslint-disable */
  selectedBillType.icon = item.icon
  selectedBillType.text = item.text
  selectedBillType.type = item.type
  popup.value.close()
}
onMounted(async () => {
  billTime.value = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
  const { retCode, data, retMsg } = await getBillTypes()
  console.log(retCode, data, retMsg)
})
</script>

<style lang="scss" scoped>
.accounting {
  ::v-deep .uni-date__x-input {
    font-size: 48rpx !important;
    padding-left: 12rpx;
  }
  .bill-input {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: #f5f5f5;
    margin: 20rpx 30rpx;
    border-radius: 16rpx;
    padding: 80rpx 0;
    .uni-input {
      text-align: center;
      font-size: 120rpx;
      height: 100rpx;
      line-height: 100rpx;
      caret-color: $u-primary;
    }
    .desc {
      display: flex;
      align-items: center;
      padding-top: 30rpx;
      .iconfont {
        font-size: 100rpx;
      }
      .text {
        padding-left: 12rpx;
        font-size: 80rpx;
      }
    }
  }
  .accounting-content {
    padding: 0rpx 30rpx;
    .location {
      display: flex;
      align-items: center;
      font-size: 38rpx;
      padding: 30rpx 0;
      color: #666666;
      .iconfont {
        font-size: 42rpx;
        color: $u-primary;
        padding-right: 12rpx;
        padding-left: 8rpx;
      }
    }
    .textarea {
      width: auto;
      padding: 20rpx;
      background: #f9f9f9;
      border-radius: 16rpx;
    }
    .save-btn {
      color: $u-primary;
      border-color: $u-primary;
      margin-top: 30rpx;
      width: 40%;
      border-radius: 60rpx;
    }
  }
}
</style>
