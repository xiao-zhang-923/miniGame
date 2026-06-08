import { createApp } from "vue";
import {
  Button,
  Card,
  Input,
  Noticebar,
  Cell,
  Col,
  CellGroup,
  Row,
  Toast,
} from "@nutui/nutui-taro";
import "@nutui/nutui-taro/dist/style.css";
import "./app.scss";
import Taro from "@tarojs/taro";

const App = createApp({
  onLaunch() {
    this.checkAppUpdate();
  },

  onShow() {},
  methods: {
    checkAppUpdate() {
      if (process.env.TARO_ENV !== "weapp") return; 
      const updateManager = Taro.getUpdateManager()
      updateManager.onCheckForUpdate((res) => {
        if (res.hasUpdate) {
          Taro.showLoading({ title: '正在检查更新...' })
        }
      })
      updateManager.onUpdateReady(() => {
        Taro.hideLoading()
        Taro.showModal({
          title: '更新提示',
          content: '新版本已准备好，是否重启应用？',
          success: (modalRes) => {
            if (modalRes.confirm) {
              // 重启应用新版本
              updateManager.applyUpdate()
            }
          }
        })
      }) 
      updateManager.onUpdateFailed(() => {
        Taro.hideLoading()
        Taro.showToast({
          title: '更新失败，请稍后重试',
          icon: 'none',
          duration: 2000
        })
      })
    },
  },
});
App.use(Button);
App.use(Card);
App.use(Input);
App.use(Noticebar);
App.use(Cell);
App.use(Col);
App.use(CellGroup);
App.use(Row);
App.use(Toast);

export default App;
