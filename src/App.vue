<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}

.big-box {
  display: flex;
  justify-content: center;
  flex-direction: row;
  height: 100%;
  padding: 0 20px;
}

.content {
  min-width: 1200px;
  width: 100%;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0;
}

.margin-t-10 {
  margin-top: 10px;
}

/* 滚动条样式 */
/* 滚动条的整体样式 */
/* 用于设置滚动条的整体样式
在这里设置宽高，以控制滚动条尺寸，且必须要设置宽高，否则不生效
宽高分别对应 y轴 和 x轴 的滚动条尺寸
若宽高为0，则可隐藏滚动条，但仍可保持滚动 */
::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 6px;
  height: 6px;
}
/* 滚动条内的轨道 */
/* 滚动条轨道
不设置则不出现轨道 */
::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 0;
}
/* 滚动条内的滑块 */
/* 滚动条滑块，即滚动条滚动的部分
必须要设置，否则不会出现滑块 */
::-webkit-scrollbar-thumb {
  cursor: pointer;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.15);
  transition: color 0.2s ease;
}
/* X轴滚动条和Y轴滚动条的交接处
不设置，默认为白色小方块，宽高随X轴和Y轴滚动条尺寸 */
/* ::-webkit-scrollbar-corner {
  background: rgba(0, 0, 0, 0.1);
} */
/* ::-webkit-scrollbar-track-piece
没有滑块的滚动条轨道，或者说是内层轨道
同滚动条轨道 */
/* ::-webkit-scrollbar-button
滚动条两端的箭头按钮
不设置则不出现 */

</style>
