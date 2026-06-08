<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <view class="page pageIndex">
    <!-- 九宫格 -->
    <view class="grid">
      <view class="item" @click="goGame('spellWords')">
        <view class="icon">🔤</view>
        <text>字母拼词</text>
      </view>

      <view class="item" @click="goGame('mathGame')">
        <view class="icon">➗</view>
        <text>速算挑战</text>
      </view>

       <view class="item" @click="goGame('memoryPlipping')">
        <view class="icon">🃏</view>
        <text>记忆翻牌</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import Taro from "@tarojs/taro";

const goGame = (name) => {
  Taro.navigateTo({
    url: `/pages/modules/${name}/index`,
  });
};
</script>

<style lang="scss">
.pageIndex {
  .title {
    font-size: 44rpx;
    font-weight: bold;
    text-align: center;
    margin-bottom: 40rpx;
  }
  .grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
  }
  .item {
    width: calc(33.33% - 14rpx);
    aspect-ratio: 1/1;
    background: #fff;
    border-radius: 20rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.08);
  }
  .icon {
    font-size: 60rpx;
    margin-bottom: 10rpx;
  }
  .item text {
    font-size: 26rpx;
    color: #333;
  }
}
</style>
