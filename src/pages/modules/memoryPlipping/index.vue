<template>
  <view class="page memoryPliping">
    <!-- 增加：显示时间 -->
    <view class="tip" v-if="showTime > 0">
      请记住位置 {{ showTime }} 秒后开始
    </view>
    <view class="time" v-else>
      用时：{{ time }} 秒
    </view>

    <view class="grid">
      <view
        v-for="(item, idx) in list"
        :key="idx"
        class="card"
        :class="{ flip: item.flip, success: item.success }"
        @click="clickCard(idx)"
      >
        <view class="front">{{ item.icon }}</view>
        <view class="back"></view>
      </view>
    </view>

    <view class="win" v-if="isWin">
      <view class="box">
        <view>🎉 恭喜通关！</view>
        <view class="final-time">最终用时：{{ time }} 秒</view>
        <button class="btn" @click="startGame">再来一局</button>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";

defineOptions({
  name: 'MemoryPliping'
})

// 主题库
const themeIcons = [
  "🐶", "🐱", "🐭", "🐹", "🐸", "🐯",
  "🍎", "🍌", "🍇", "🍉", "🍓", "🍒",
  "🚗", "🚲", "✈️", "🚢", "🚀", "🚂",
  "😀", "😁", "😂", "🤣", "😊", "😍",
  "☀️", "⛅", "☁️", "❄️", "⚡", "🌈",
  "🍕", "🍔", "🍟", "🌭", "🍿", "🥤"
];

const list = ref<any[]>([]);
const isWin = ref(false);
const lock = ref(false);
const lastIdx = ref(-1);
const showTime = ref(3);

// ======================
// 计时相关
// ======================
const time = ref(0);
let timeInterval: any = null;

// 开始计时
const startTimer = () => {
  time.value = 0;
  timeInterval = setInterval(() => {
    time.value++;
  }, 1000);
};

// 停止计时
const stopTimer = () => {
  if (timeInterval) {
    clearInterval(timeInterval);
    timeInterval = null;
  }
};

// 随机取 6 个不重复图标
const getRandomIcons = () =>{
  const shuffled = [...themeIcons].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 6);
}

// 洗牌函数
const shuffle = (arr: any[]) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// 开始游戏
const startGame = () => {
  stopTimer(); // 先清空上一局计时器
  isWin.value = false;
  lock.value = true;
  lastIdx.value = -1;
  showTime.value = 3;
  time.value = 0;

  const icons = getRandomIcons();
  let cards: any[] = [];
  icons.forEach((icon) => {
    cards.push({ icon, flip: true, success: false });
    cards.push({ icon, flip: true, success: false });
  });

  list.value = cards;

  const timer = setInterval(() => {
    showTime.value--;
    if (showTime.value <= 0) {
      clearInterval(timer);
      list.value = shuffle(list.value);
      list.value.forEach((item) => {
        item.flip = false;
      });
      lock.value = false;
      startTimer(); // 3秒结束 → 开始计时
    }
  }, 1000);
}

// 点击翻牌
const clickCard = (idx: number) => {
  const card = list.value[idx];
  if (card.flip || card.success || lock.value) return;

  card.flip = true;
  if (lastIdx.value === -1) {
    lastIdx.value = idx;
    return;
  }

  const lastCard = list.value[lastIdx.value];

  if (card.icon === lastCard.icon) {
    card.success = true;
    lastCard.success = true;
    lastIdx.value = -1;
    checkWin();
    return;
  }

  lock.value = true;
  setTimeout(() => {
    card.flip = false;
    lastCard.flip = false;
    lastIdx.value = -1;
    lock.value = false;
  }, 600);
}

// 检查胜利
const checkWin = () =>{
  if (list.value.every((item) => item.success)) {
    isWin.value = true;
    stopTimer(); // 通关 → 停止计时
  }
}

onMounted(() => {
  startGame();
});

onUnmounted(() => {
  stopTimer(); // 页面销毁清除定时器
});

</script>

<style lang="scss">
.memoryPliping {
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
  }

  .tip, .time {
    text-align: center;
    font-size: 36rpx;
    color: #ff4d4f;
    margin-bottom: 20rpx;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20rpx;
  }

  .card {
    height: 180rpx;
    position: relative;
    transform-style: preserve-3d;
    transition: transform 0.3s ease;
  }

  .card.flip,
  .card.success {
    transform: rotateY(180deg);
  }

  .front {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #fff;
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48rpx;
    backface-visibility: hidden;
    transform: rotateY(180deg);
    box-shadow: 0 4rpx 12rpx #00000010;
  }

  .back {
    position: absolute;
    width: 100%;
    height: 100%;
    background: #409eff;
    border-radius: 16rpx;
    backface-visibility: hidden;
    box-shadow: 0 4rpx 12rpx #00000010;
  }

  .win {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99;
  }

  .box {
    width: 400rpx;
    background: #fff;
    border-radius: 20rpx;
    padding: 40rpx;
    text-align: center;
  }

  .box view {
    font-size: 30rpx;
    margin: 10rpx 0;
  }

  .final-time {
    color: #ff4d4f;
    font-weight: bold;
  }

  .btn {
    margin-top: 20rpx;
    background: #409eff;
    color: #fff;
    border-radius: 10rpx;
    padding: 16rpx 32rpx;
    border: none;
    line-height: 1;
    width: max-content;
  }
}
</style>