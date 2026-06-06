
import { createApp } from 'vue'
import {
  Button,
  Card,
  Input,
  Noticebar,
  Cell,
  Col,
  CellGroup,
  Row,
  Toast
} from '@nutui/nutui-taro'
import '@nutui/nutui-taro/dist/style.css'
import './app.scss'

  

const App = createApp({
  onShow (options) {
    console.log('App onShow.')
  },
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})
App.use(Button)
App.use(Card)
App.use(Input)
App.use(Noticebar)
App.use(Cell)
App.use(Col)
App.use(CellGroup)
App.use(Row)
App.use(Toast)

export default App
