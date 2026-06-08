<template>
  <view class="page pageSpellWord">

    <nut-cell-group class="card">
      <nut-cell class="sentence-cell">
        <view class="cn">{{ sentence?.cn }}</view>
      </nut-cell>
      <nut-cell class="tip-cell">
        <view class="tip">请拼出英文翻译</view>
      </nut-cell>
    </nut-cell-group>

    <!-- 输入区 -->
    <nut-cell-group class="card">
      <nut-cell>
        <nut-input
          v-model="userInput"
          placeholder="请拼写"
          align="center"
          clearable
        />
      </nut-cell>
      <nut-cell>
        <view class="btn-group">
          <nut-button class="btn" type="primary" @click="checkAnswer"
            >校验</nut-button
          >
          <nut-button class="btn" type="danger" @click="delLetter"
            >删除</nut-button
          >
        </view>
      </nut-cell>
    </nut-cell-group>

    <!-- 键盘区：三行独立 cell，每行一个 nut-cell，完全分开 -->
    <nut-cell-group class="card keyboard-group">
      <!-- 第一行：q w e r t y u i o p -->
      <nut-cell class="key-cell">
        <view class="key-row">
          <button
            v-for="key in row1"
            :key="key"
            class="key-btn"
            @click="selectLetter(key)"
          >
            {{ currentCase ? key.toUpperCase() : key }}
          </button>
        </view>
      </nut-cell>

      <!-- 第二行：a s d f g h j k l -->
      <nut-cell class="key-cell">
        <view class="key-row">
          <button
            v-for="key in row2"
            :key="key"
            class="key-btn"
            @click="selectLetter(key)"
          >
            {{ currentCase ? key.toUpperCase() : key }}
          </button>
        </view>
      </nut-cell>

      <!-- 第三行：Aa z x c v b n m 删除 空格 -->
      <nut-cell class="key-cell">
        <view class="key-row">
          <button class="key-btn func" @click="toggleCase">Aa</button>
          <button
            v-for="key in row3"
            :key="key"
            class="key-btn"
            @click="selectLetter(key)"
          >
            {{ currentCase ? key.toUpperCase() : key }}
          </button>
          <button class="key-btn space" @click="selectLetter(' ')">空格</button>
        </view>
      </nut-cell>
    </nut-cell-group>

    <!-- 结果提示 -->
    <nut-toast
      :title="state.title"
      v-model:visible="state.show"
      :type="state.type"
      cover
    ></nut-toast>
  </view>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { sentenceList } from "../../../utils/sentence";


defineOptions({
  name: 'SpellWord'
})

function getRandomIndex() {
  return Math.floor(Math.random() * sentenceList.length) + 1;
}

const row1 = ref(["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"]);
const row2 = ref(["a", "s", "d", "f", "g", "h", "j", "k", "l"]);
const row3 = ref(["z", "x", "c", "v", "b", "n", "m"]);

const sentence = ref({ cn: "", en: "" });
const userInput = ref("");
const currentCase = ref(false);

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

const init = () => {
  const idx = getRandomIndex();
  sentence.value = sentenceList[idx];
};

const selectLetter = (l) => {
  userInput.value += currentCase.value ? l.toUpperCase() : l;
};
const delLetter = () => {
  userInput.value = userInput.value.slice(0, -1);
};
const toggleCase = () => {
  currentCase.value = !currentCase.value;
};

const checkAnswer = () => {
  const user = userInput.value.trim();
  if (!user) {
    openToast("warn", "请输入英文翻译");
    return;
  }
  const correct = sentence.value.en.trim();
  if (user.toLowerCase() === correct.toLowerCase()) {
    openToast("success", "恭喜你，挑战成功！");
  } else {
    openToast("fail", "答案错误，再试试");
  }
};

onMounted(() => init());
</script>

<style lang="scss">
.pageSpellWord {
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

  // 句子区样式
  .sentence-cell {
    padding: 30rpx;
    .cn {
      font-size: 32rpx;
      font-weight: 500;
      color: #333;
    }
  }

  .tip-cell {
    padding: 0 30rpx 30rpx;
    .tip {
      font-size: 26rpx;
      color: #999;
    }
  }

  // 输入区按钮
  .btn-group {
    display: flex;
    justify-content: center;
    gap: 20rpx;
  }
  .btn {
    padding: 16rpx 40rpx;
    border-radius: 8rpx;
    font-size: 28rpx;
  }

  // 键盘区：三行独立 cell，完全分开
  .keyboard-group {
    padding: 20rpx;
  }
  .key-cell {
    padding: 0 !important;
    border: none;
    margin-bottom: 12rpx; /* 行间距 */
    justify-content: center;
  }
  .key-row {
    display: flex;
    justify-content: center;
    gap: 8rpx;
  }
  .key-btn {
    width: 56rpx;
    height: 64rpx;
    border-radius: 8rpx;
    background: #fff;
    border: 1rpx solid #ddd;
    font-size: 28rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .key-btn.space {
    width: 110rpx;
    padding-left: 8px;
    padding-right: 8px;
  }

  .card {
    margin-bottom: 20rpx;
    border-radius: 12rpx;
    background: #fff;
  }
}
</style>
