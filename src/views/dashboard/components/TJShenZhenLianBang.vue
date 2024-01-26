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
    <!-- <el-checkbox v-model="Magnetized" @change="changeSettings">弱磁</el-checkbox> -->
    <el-checkbox v-model="GuanShui" @change="changeSettings">关税预付 150 元/票</el-checkbox>
    <el-checkbox v-model="PianYuan" @change="changeSettings">偏远 4.6 / KG, 最低 218 元/票</el-checkbox>
    <el-checkbox v-model="Saturday" @change="changeSettings">周六配送 116 元/票</el-checkbox>
    <el-checkbox v-model="DSFGuanShui" @change="changeSettings">第三方关税附加费 2.5%收取,最低99元</el-checkbox>
    <el-checkbox v-model="DSZShoujianren" @change="changeSettings">第三者收件人 10.7/KG,最低96元</el-checkbox>
    <el-checkbox v-model="FeiDuiDie" @change="changeSettings">非堆叠 1233 元</el-checkbox>
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
  name: 'TJShenZhenLianBang',
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
    PianYuan: false,
    Saturday: false,
    DSFGuanShui: false, // 第三方关税
    DSZShoujianren: false, // 第三者收件人
    FeiDuiDie: false, // 非堆叠货物
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
    },
    PianYuan: function(newVal) {
      // 偏远费：按RMB4.6/KG*燃油，最低收费 RMB218 / 票*燃油
      this.newTotalPrice = parseFloat(this.item.showInfo.totalPrice)
      const CountWeight = Number(this.item.showInfo.CountWeight) / 1000
      const msg = this.item.showInfo.msg
      if (newVal === true) {
        this.newTotalPrice += CountWeight * 4.6 >= 218 ? CountWeight * 4.6 : 218
        msg.push(`偏远收费 4.6 / KG,最低 218 元/票: ${CountWeight * 4.6 >= 218 ? CountWeight * 4.6 : 218}`)
      } else {
        this.newTotalPrice -= CountWeight * 4.6 >= 218 ? CountWeight * 4.6 : 218
        msg.splice(msg.indexOf(`偏远收费 4.6 / KG,最低 218 元/票: ${CountWeight * 4.6 >= 218 ? CountWeight * 4.6 : 218}`), 1)
      }
      this.item.showInfo.totalPrice = this.newTotalPrice.toFixed(2)
      this.item.showInfo.msg = msg
    },
    DSZShoujianren: function(newVal) {
      // 第三者收件人附加费和指定清关代理人服务附加费：将产生RMB10.7/KG*燃油，最低收费RMB96/票*燃油
      this.newTotalPrice = parseFloat(this.item.showInfo.totalPrice)
      const CountWeight = Number(this.item.showInfo.CountWeight) / 1000
      const msg = this.item.showInfo.msg
      if (newVal === true) {
        this.newTotalPrice += CountWeight * 10.7 >= 96 ? CountWeight * 10.7 : 96
        msg.push(`第三者收件人10.7/KG,最低96元: ${CountWeight * 10.7 >= 96 ? CountWeight * 10.7 : 96}`)
      } else {
        this.newTotalPrice -= CountWeight * 10.7 >= 96 ? CountWeight * 10.7 : 96
        msg.splice(msg.indexOf(`第三者收件人10.7/KG,最低96元: ${CountWeight * 10.7 >= 96 ? CountWeight * 10.7 : 96}`), 1)
      }
      this.item.showInfo.totalPrice = this.newTotalPrice.toFixed(2)
      this.item.showInfo.msg = msg
    },
    DSFGuanShui: function(newVal) {
      // 第三方关税附加费：按照运费总金额的2.5%收取，最低按RMB99/票
      this.newTotalPrice = parseFloat(this.item.showInfo.totalPrice)
      const msg = this.item.showInfo.msg
      if (newVal === true) {
        this.newTotalPrice += this.newTotalPrice * 0.025 >= 99 ? this.newTotalPrice * 0.025 >= 99 : 99
        msg.push(`第三方关税按运费总金额2.5%收取,最低99元: ${this.newTotalPrice * 0.025 >= 99 ? this.newTotalPrice * 0.025 >= 99 : 99}`)
      } else {
        this.newTotalPrice -= this.newTotalPrice * 0.025 >= 99 ? this.newTotalPrice * 0.025 >= 99 : 99
        msg.splice(msg.indexOf(`第三方关税按运费总金额2.5%收取,最低99元: ${this.newTotalPrice * 0.025 >= 99 ? this.newTotalPrice * 0.025 >= 99 : 99}`), 1)
      }
      this.item.showInfo.totalPrice = this.newTotalPrice.toFixed(2)
      this.item.showInfo.msg = msg
    },
    Saturday: function(newVal) {
      // 周六派送手续费：按RMB116/票*燃油计算
      this.newTotalPrice = parseFloat(this.item.showInfo.totalPrice)
      const msg = this.item.showInfo.msg
      if (newVal === true) {
        this.newTotalPrice += 116
        msg.push('周六配送费: 116 元/票')
      } else {
        this.newTotalPrice -= 116
        msg.splice(msg.indexOf('周六配送费: 116 元/票'), 1)
      }
      this.item.showInfo.totalPrice = this.newTotalPrice.toFixed(2)
      this.item.showInfo.msg = msg
    },
    FeiDuiDie: function(newVal) {
      // 非堆叠货件: 1233
      this.newTotalPrice = parseFloat(this.item.showInfo.totalPrice)
      const msg = this.item.showInfo.msg
      if (newVal === true) {
        this.newTotalPrice += 1233
        msg.push('非堆叠货件: 1233')
      } else {
        this.newTotalPrice -= 1233
        msg.splice(msg.indexOf('非堆叠货件: 1233'), 1)
      }
      this.item.showInfo.totalPrice = this.newTotalPrice.toFixed(2)
      this.item.showInfo.msg = msg
    }
  },
  mounted() {
    this.forUPSPrice(this.item, this.volume)
  },
  methods: {
    changeSettings() {

    },

    forUPSPrice(value, volume) {
      const { showInfo } = value
      const price = parseFloat(showInfo.totalPrice)
      const CountWeight = Number(showInfo.CountWeight)
      const msg = showInfo.msg

      let ChaoZhong = 0

      // 该渠道不叠加收费
      // 超尺寸/超重/包装处理附加费：费用不重复收取，收取附加费195元/票*燃油
      // 超尺寸附加费：最长单边超过118厘米；次长单边超过74厘米；
      if (this.lwh_arr.length === 3 && (this.lwh_arr[0] >= 118 || this.lwh_arr[1] >= 74)) {
        ChaoZhong = 108
        msg.push('最长边 >= 118 CM / 第二边长 >= 74 CM: 108元')
      }
      // 或围长超264厘米
      if (volume > 264) {
        ChaoZhong = 108
        msg.push('围长 > 264 CM: 108元')
      }
      // 超重附加费：单件结算重超30KG（包含30KG）
      if (CountWeight / 1000 >= 30) {
        ChaoZhong = 108
        msg.push('单件结算重超30KG: 108元')
      }

      // const ele = 25 // 弱磁 + 25 元

      // msg.push('弱磁: 25 元/票')

      const totalPrice = (price + ChaoZhong).toFixed(2)

      this.$emit('countPrice', { totalPrice, isShow: true, msg, CountWeight }, this.index, 'TJShenZhenLianBang.vue')
    }
  }
}

</script>

<style scoped>

</style>
