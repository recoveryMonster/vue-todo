"use strict";
//引入Vue
import Vue from "vue";
//引入app
import App from "./app.vue";
//引入css 和背景图片
import "./assets/images/bg.jpg";
import "./assets/styles/global.styl";

//创建一个节点
const root = document.createElement("div");
//将节点添加到html的body中
document.body.appendChild(root);

//实例化Vue
new Vue({
  //将App挂载到html上
  render: h => h(App)
}).$mount(root);
