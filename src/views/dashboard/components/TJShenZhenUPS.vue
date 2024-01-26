<!--
 * @Author: shangguanyaa 1051158791@qq.com
 * @Date: 2024-01-05 15:18:59
 * @LastEditors: shangguanyaa 1051158791@qq.com
 * @LastEditTime: 2024-1-8 15:48:27
 * @FilePath: \vue-admin-template\src\views\dashboard\components\LiChuang.vue
 * @Description: 渠道: 泰嘉-深圳UPS红单小货 5800
-->
<template>
  <div class="more">
    <el-checkbox v-model="Magnetized" @change="changeSettings">弱磁 25 元/票</el-checkbox>
    <el-checkbox v-model="GuanShui" @change="changeSettings">关税预付 150 元/票</el-checkbox>
    <el-descriptions title="渠道信息" :column="3" border>
      <el-descriptions-item label="渠道名称" label-class-name="my-label" content-class-name="my-content">
        {{ item.channelName || '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="渠道类型">{{ item.channelType || '-' }}</el-descriptions-item>
      <el-descriptions-item label="配送时效">{{ item.ageing || '-' }}</el-descriptions-item>
      <el-descriptions-item label="其他附加费用">
        <p v-for="(msg, i) in item.showInfo.msg" :key="i">
          {{ msg }}
        </p>
      </el-descriptions-item>
      <el-descriptions-item label="备注" :content-style="{ 'text-align': 'left', 'max-width': '290px' }">
        {{ item.remark || '无备注' }}
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script>

export default {
  name: 'TJShenZhenUPS',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    item: { type: Object },
    // eslint-disable-next-line vue/require-default-prop
    weight: { type: Number },
    // eslint-disable-next-line vue/require-default-prop
    index: { type: Number },
    // eslint-disable-next-line vue/prop-name-casing
    lwh_arr: {
      type: Array,
      default: () => { [] }
    },
    volume: {
      type: Number,
      default: () => { 0 }
    }
  },
  data: () => ({
    Magnetized: true,
    GuanShui: false,
    newTotalPrice: 0
  }),
  watch: {
    Magnetized: function(newVal) {
      this.newTotalPrice = parseFloat(this.item.showInfo.totalPrice)
      const msg = this.item.showInfo.msg
      console.log(this.newTotalPrice)
      if (newVal === true) {
        this.newTotalPrice += 25
        msg.push('弱磁: 25 元/票')
      } else {
        this.newTotalPrice -= 25
        msg.splice(msg.indexOf('弱磁: 25 元/票'), 1)
      }
      console.log(this.newTotalPrice)
      this.item.showInfo.totalPrice = this.newTotalPrice.toFixed(2)
      this.item.showInfo.msg = msg
    },
    GuanShui: function(newVal) {
      // 关税预付: 手续费 150 元/票
      this.newTotalPrice = parseFloat(this.item.showInfo.totalPrice)
      const msg = this.item.showInfo.msg
      if (newVal === true) {
        this.newTotalPrice += 150
        msg.push('关税预付手续费: 150 元/票')
      } else {
        this.newTotalPrice -= 150
        msg.splice(msg.indexOf('关税预付手续费: 150 元/票'), 1)
      }
      this.item.showInfo.totalPrice = this.newTotalPrice.toFixed(2)
      this.item.showInfo.msg = msg
    }
  },
  mounted() {
    this.forUPSPrice(this.item)
  },
  methods: {
    changeSettings() {

    },

    forUPSPrice(value) {
      const { showInfo } = value
      const price = parseFloat(showInfo.totalPrice)
      const CountWeight = Number(showInfo.CountWeight)
      const msg = showInfo.msg

      let ChaoZhong = 0

      // 该渠道不叠加收费 含有一项就得加 108 * 燃油
      // 任何最长一边之长度超过118厘米（含118CM）或第二最长边的长度超过74厘米（含74CM）的包裹。
      if (this.lwh_arr.length === 3 && (this.lwh_arr[0] >= 118 || this.lwh_arr[1] >= 74)) {
        ChaoZhong = 108
        msg.push('最长边 >= 118 CM / 第二边长 >= 74 CM: 108元')
      }
      // 任何单件货物重量超过31公斤（计费重,含31kg）。
      if (CountWeight / 1000 >= 31) {
        ChaoZhong = 108
        msg.push('单件计费重 >= 31 KG: 108元')
      }

      const ele = 25 // 弱磁 + 25 元

      msg.push('弱磁: 25 元/票')

      const totalPrice = (price + ChaoZhong + ele).toFixed(2)

      this.$emit('countPrice', { totalPrice, isShow: true, msg, CountWeight }, this.index, 'TJShenZhenUPS.vue')
    }
  }
}

</script>

<style scoped>

</style>
