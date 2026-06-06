<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <view class="page pageMathGame">
    <!-- 题目区：4个数字卡片 -->
    <view class="num-row">
      <view
        v-for="(num, idx) in nums"
        :key="idx"
        class="num-card"
        :class="{ used: used[idx] }"
        @click="selectNum(idx)"
      >
        <text class="num-text">{{ num }}</text>
      </view>
    </view>

    <!-- 表达式输入区 -->
    <view class="expr-box">
      <text class="expr-label">表达式</text>
      <text class="expr-content" :class="{ placeholder: !expr }">
        {{ expr || "请点击数字和运算符组成算式" }}
      </text>
    </view>

    <!-- 操作按钮区 -->
    <view class="btn-panel">
      <!-- 运算符行 1 -->
      <view class="btn-row">
        <button class="btn-op" @click="append('+')">+</button>
        <button class="btn-op" @click="append('-')">-</button>
        <button class="btn-op" @click="append('*')">×</button>
        <button class="btn-op" @click="append('/')">÷</button>
      </view>
      <!-- 运算符行 2 -->
      <view class="btn-row">
        <button class="btn-op" @click="append('(')">(</button>
        <button class="btn-op" @click="append(')')">)</button>
        <button class="btn-control" @click="backspace">←</button>
        <button class="btn-control" @click="clear">清空</button>
      </view>
      <!-- 操作行 -->
      <view class="btn-row">
        <button class="btn-action primary" @click="check">验证</button>
        <button class="btn-action secondary" @click="newGame">换一题</button>
      </view>
    </view>
    <nut-toast
      :title="state.title"
      v-model:visible="state.show"
      :type="state.type"
      cover
    ></nut-toast>
  </view>
</template>

<script setup>
import { ref, reactive } from "vue";
import { generateValidPuzzle, safeEval } from "./calc24";

const state = reactive({
  title: "",
  type: "",
  show: false,
});

const openToast = (type, title) => {
  state.show = true;
  state.type = type;
  state.title = title;
};

// ==============================================
// 游戏逻辑
// ==============================================
const nums = ref(generateValidPuzzle());
const used = ref([false, false, false, false]);
const expr = ref("");

// 选择数字
const selectNum = (idx) => {
  if (used.value[idx]) return;
  expr.value += nums.value[idx];
  used.value[idx] = true;
};
// 追加运算符/括号
const append = (s) => {
  expr.value += s;
};

// 退格
const backspace = () => {
  if (!expr.value) return;
  const last = expr.value.slice(-1);
  expr.value = expr.value.slice(0, -1);
  const numIdx = nums.value.indexOf(Number(last));
  if (numIdx !== -1 && used.value[numIdx]) {
    used.value[numIdx] = false;
  }
};

// 清空
const clear = () => {
  expr.value = "";
  used.value = [false, false, false, false];
};

// 验证是否等于 24
const check = () => {
  if (!expr.value) {
    openToast("warn", "请输入表达式");
    return;
  }
  try {
    const safeExpr = expr.value.replace(/×/g, "*").replace(/÷/g, "/");
    const res = safeEval(safeExpr);
    if (Number.isNaN(res)) {
      openToast("warn", "表达式格式错误，请检查");
    } else {
      if (Math.abs(res - 24) < 1e-6) {
        openToast("success", "恭喜你，答对了！");
        setTimeout(() => newGame(), 1500);
      } else {
        openToast("error", `结果是 ${res.toFixed(2)}，不等于 24`);
      }
    }
  } catch (e) {
    openToast("warn", "表达式格式错误，请检查");
  }
};

// 换题
const newGame = () => {
  nums.value = generateValidPuzzle();
  clear();
};
</script>

<style lang="scss">
.pageMathGame {
  /* 顶部标题 */
  .header {
    text-align: center;
    margin-bottom: 40rpx;
  }
  .title {
    font-size: 48rpx;
    font-weight: 600;
    color: #1d2129;
  }

  /* 数字卡片行 */
  .num-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 40rpx;
  }
  .num-card {
    width: 150rpx;
    height: 150rpx;
    background: #ffffff;
    border-radius: 20rpx;
    box-shadow: 0 6rpx 20rpx rgba(0, 0, 0, 0.06);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }
  .num-card:active {
    transform: scale(0.95);
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  }
  .num-card.used {
    background: #f2f3f5;
    color: #c9cdd4;
    box-shadow: none;
  }
  .num-text {
    font-size: 52rpx;
    font-weight: 700;
    color: #1d2129;
  }
  .num-card.used .num-text {
    color: #c9cdd4;
  }

  /* 表达式输入框 */
  .expr-box {
    background: #ffffff;
    border-radius: 20rpx;
    padding: 30rpx;
    margin-bottom: 30rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  }
  .expr-label {
    font-size: 28rpx;
    color: #86909c;
    display: block;
    margin-bottom: 16rpx;
  }
  .expr-content {
    font-size: 44rpx;
    font-weight: 500;
    color: #1d2129;
    min-height: 60rpx;
    line-height: 1.4;
  }
  .expr-content.placeholder {
    color: #c9cdd4;
  }

  /* 按钮面板 */
  .btn-panel {
    background: #ffffff;
    border-radius: 20rpx;
    padding: 30rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  }
  .btn-row {
    display: flex;
    gap: 20rpx;
    margin-bottom: 20rpx;
  }
  .btn-row:last-child {
    margin-bottom: 0;
  }

  /* 运算符按钮 */
  .btn-op {
    flex: 1;
    height: 90rpx;
    border: 2rpx solid #ff7d00;
    border-radius: 16rpx;
    background: #ffffff;
    color: #ff7d00;
    font-size: 36rpx;
    font-weight: 600;
  }
  .btn-op:active {
    background: #fff7e6;
  }

  /* 控制按钮（退格/清空） */
  .btn-control {
    flex: 1;
    height: 90rpx;
    border: 2rpx solid #ffb84d;
    border-radius: 16rpx;
    background: #ffffff;
    color: #ffb84d;
    font-size: 32rpx;
    font-weight: 600;
  }
  .btn-control:active {
    background: #fff9e6;
  }

  /* 操作按钮（验证/换题） */
  .btn-action {
    flex: 1;
    height: 100rpx;
    border-radius: 16rpx;
    font-size: 36rpx;
    font-weight: 600;
    border: none;
  }
  .btn-action.primary {
    background: #00b42a;
    color: #ffffff;
  }
  .btn-action.primary:active {
    background: #009a23;
  }
  .btn-action.secondary {
    background: #1890ff;
    color: #ffffff;
  }
  .btn-action.secondary:active {
    background: #0078d4;
  }
}
</style>
