<template>
  <view class="bill-detail">
    <view class="header">
      <view class="left" @click="handleShowDate">
        <text>{{ year }}年{{ month }}月</text>
        <text class="iconfont icon-xiangxiasanjiaoxing"></text>
      </view>
      <view class="right">统计：{{ totalAmount }}元</view>
    </view>
    <view class="bill-detail-container">
      <view v-if="billDetailList.length" class="bill-detail-list">
        <uni-swipe-action>
          <uni-swipe-action-item
            v-for="item in billDetailList"
            :key="item.id"
            :right-options="options"
            show="none"
            :auto-close="false"
            class="bill-detail-swiper"
          >
            <view class="bill-detail-item">
              <view class="left">
                <view>
                  <text
                    class="iconfont"
                    :class="item.typeIcon"
                    :style="{ fontSize: '40rpx', color: '#118dde', paddingRight: '12rpx' }"
                  ></text>
                  <text>
                    {{ item.typeName }}
                  </text>
                </view>
                <view class="time">
                  <text>
                    {{ item.billTime }}
                  </text>
                </view>
              </view>
              <view class="right">
                <text class="amount">{{ item.amount }}</text>
                <text class="iconfont icon-edit" @click="handleEdit(item.id)"></text>
              </view>
            </view>
          </uni-swipe-action-item>
        </uni-swipe-action>
      </view>
      <view class="noneData">{{ loadMoreText }}</view>
    </view>
    <uni-popup ref="popup" :mask-click="false">
      <view class="opt-date">
        <text class="cancel" @click="handleHidePopup">取消</text>
        <text class="confirm" @click="handleConfirmPopup">确认</text>
      </view>
      <picker-view
        v-if="visible"
        :indicator-style="indicatorStyle"
        :value="billTime"
        class="picker-view"
        @change="handleChange"
      >
        <picker-view-column>
          <view v-for="(item, index) in years" :key="index" class="item">{{ item }}年</view>
        </picker-view-column>
        <picker-view-column>
          <view v-for="(item, index) in months" :key="index" class="item">{{ item }}月</view>
        </picker-view-column>
      </picker-view>
    </uni-popup>
  </view>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { getBillDetailList, getBillStatistics } from '@/api/billTypes'
import { onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import dayjs from 'dayjs'
const year = ref<String | Number>('')
const years = ref<Number[]>([])
const month = ref<String | Number>('')
const months = ref<Number[]>([])
const date = ref<String>('')
const popup = ref(null)
const billTime = ref<Number[]>([])
const visible = ref<Boolean>(false)
const indicatorStyle = `height: 50px;color:#333;`
const billDetailList = ref<any[]>([])
const loadMoreText = ref<String>('')
const totalPage = ref()
const options = [
  {
    text: '删除',
    style: {
      backgroundColor: '#118dde'
    }
  }
]
const pageNum = ref<Number>(1)
const loadMore = () => {
  getBillDetailList({ date: dayjs(date.value).format('YYYY-MM'), pageNum: pageNum.value, pageSize: 10 }).then(res => {
    console.log(res)
    if (res.code === 200) {
      // 总行数取余页面大小，等于0，则页数为整页数，否则有余数，则页数为正页数加一
      totalPage.value = parseInt(res.data.total) % 10 === 0 ? res.data.total / 10 : Math.ceil(res.data.total / 10)
      if (pageNum.value === 1) {
        billDetailList.value = res.data.rows
      } else {
        billDetailList.value = [...billDetailList.value, ...res.data.rows]
      }
      if (!res.data.rows.length) {
        loadMoreText.value = '暂无数据！'
      }
      if (totalPage.value === pageNum.value) {
        loadMoreText.value = '已经到底了！！！'
      }
    }
  })
}
const totalAmount = ref<number | string>()
const getBillStatisticsByMonth = () => {
  getBillStatistics({ date: dayjs(date.value).format('YYYY-MM') }).then(res => {
    console.log(res)
    if (res.code === 200) {
      totalAmount.value = res.data.totalAmount
    } else {
      console.log(res.msg)
    }
  })
}
onReachBottom(() => {
  loadMoreText.value = '加载中...'
  if (totalPage.value === pageNum.value) {
    loadMoreText.value = '已经到底了！！！'
  } else {
    pageNum.value++
    loadMore()
  }
})
onPullDownRefresh(async () => {
  // 清除列表数据（可选）
  billDetailList.value = []
  pageNum.value = 1
  // 重新获取数据
  await loadMore()
  // 停止下拉刷新动画（重要）
  uni.stopPullDownRefresh()
})
onMounted(() => {
  const NOW = new Date()
  year.value = NOW.getFullYear()
  month.value = NOW.getMonth() + 1
  for (let i = 1990; i <= NOW.getFullYear(); i++) {
    years.value.push(i)
  }
  for (let i = 1; i <= 12; i++) {
    months.value.push(i)
  }
  billTime.value = [year.value, month.value - 1]
  date.value = `${year.value}-${month.value}`
  loadMore()
  getBillStatisticsByMonth()
})

const handleShowDate = () => {
  popup.value.open('bottom')
  visible.value = true
}
const handleConfirmPopup = () => {
  handleHidePopup()
  loadMore()
  getBillStatisticsByMonth()
}
const handleHidePopup = () => {
  console.log(billTime.value)
  popup.value.close()
  visible.value = false
}
const handleChange = (e: any) => {
  const val = e.detail.value
  year.value = years.value[val[0]]
  month.value = months.value[val[1]]
  billTime.value = val
  date.value = `${year.value}-${month.value}`
}

const handleEdit = id => {
  uni.navigateTo({
    url: '/pages/accounting/index?id=' + id
  })
}
</script>

<style lang="scss" scoped>
.bill-detail {
  padding-bottom: 24rpx;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 34rpx 30rpx;
    margin: 24rpx 30rpx;
    background: #d1ecff;
    border-radius: 12rpx;
    font-size: 32rpx;
    .iconfont {
      padding-left: 10rpx;
    }
  }
  .picker-view {
    background: #fff;
    width: 750rpx;
    height: 480rpx;
  }
  .item {
    line-height: 100rpx;
    text-align: center;
  }
}
.opt-date {
  display: flex;
  justify-content: space-between;
  padding: 24rpx 30rpx;
  font-size: 32rpx;
  background: #ffffff;
  .cancel {
    color: $menuText;
  }
  .confirm {
    color: $u-primary;
  }
}
.bill-detail-container {
  .noneData {
    padding-top: 30rpx;
    text-align: center;
    color: $u-tips-color;
  }
  .bill-detail-list {
    padding: 0 30rpx;
    .bill-detail-swiper {
      ::v-deep .uni-swipe {
        margin-top: 24rpx;
        border-radius: 12rpx;
      }
    }
    .bill-detail-item {
      display: flex;
      justify-content: space-between;
      background-color: $u-bg-color;
      padding: 20rpx;

      .left {
        .time {
          font-size: 28rpx;
          color: $u-info-dark;
          padding-top: 12rpx;
        }
      }
      .right {
        display: flex;
        justify-content: center;
        align-items: center;
        .amount {
          font-size: 40rpx;
          padding-right: 20rpx;
        }
        .icon-edit {
          font-size: 40rpx;
          color: $u-primary;
        }
      }
    }
  }
}
</style>
