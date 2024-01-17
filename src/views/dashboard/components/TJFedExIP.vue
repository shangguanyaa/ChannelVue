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
    <el-checkbox v-model="MiaoZhunJing" @change="changeSettings">瞄准镜</el-checkbox>
    <el-checkbox v-model="Phone" @change="changeSettings">仿牌手机</el-checkbox>
    <el-checkbox v-model="PianYuan" @change="changeSettings">偏远附加费</el-checkbox>
    <el-checkbox v-model="DiSanFang" @change="changeSettings">第三方指定清关代理人</el-checkbox>
    <el-checkbox v-model="Saturday" @change="changeSettings">周六配送</el-checkbox>
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
  name: 'TJFedExIP',
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
    },
    country: {
      type: String,
      default: () => { '' }
    }
  },
  data: () => ({
    MiaoZhunJing: false, // 瞄准镜
    Phone: false, // 仿牌手机
    PianYuan: false, // 偏远附加费
    DiSanFang: false, // 第三方
    Saturday: false,
    newTotalPrice: 0
  }),
  watch: {
    MiaoZhunJing: function(newVal) {
      // 瞄准镜 5 元/KG 附加费最低消费 60 元
      this.newTotalPrice = parseFloat(this.item.showInfo.totalPrice)
      const CountWeight = Number(this.item.showInfo.CountWeight) / 1000
      const msg = this.item.showInfo.msg
      if (newVal === true) {
        this.newTotalPrice += CountWeight * 5 >= 60 ? CountWeight * 5 : 60
        msg.push(`瞄准镜 5 元/KG(最低60): ${CountWeight * 5 >= 60 ? CountWeight * 5 : 60}`)
      } else {
        this.newTotalPrice -= CountWeight * 5 >= 60 ? CountWeight * 5 : 60
        msg.splice(msg.indexOf(`瞄准镜 5 元/KG(最低60): ${CountWeight * 5 >= 60 ? CountWeight * 5 : 60}`), 1)
      }
      this.item.showInfo.totalPrice = this.newTotalPrice.toFixed(2)
      this.item.showInfo.msg = msg
    },
    Phone: function(newVal) {
      // 仿牌手机 5 元/KG 附加费最低消费 25 元
      this.newTotalPrice = parseFloat(this.item.showInfo.totalPrice)
      const CountWeight = Number(this.item.showInfo.CountWeight) / 1000
      const msg = this.item.showInfo.msg
      if (newVal === true) {
        this.newTotalPrice += CountWeight * 5 >= 25 ? CountWeight * 5 : 25
        msg.push(`仿牌手机 5 元/KG(最低25): ${CountWeight * 5 >= 25 ? CountWeight * 5 : 25}`)
      } else {
        this.newTotalPrice -= CountWeight * 5 >= 25 ? CountWeight * 5 : 25
        msg.splice(msg.indexOf(`仿牌手机 5 元/KG(25): ${CountWeight * 5 >= 25 ? CountWeight * 5 : 25}`), 1)
      }
      this.item.showInfo.totalPrice = this.newTotalPrice.toFixed(2)
      this.item.showInfo.msg = msg
    },
    PianYuan: function(newVal) {
      // 偏远附加费 5 元/KG, 最低收费 275 元
      this.newTotalPrice = parseFloat(this.item.showInfo.totalPrice)
      const CountWeight = Number(this.item.showInfo.CountWeight) / 1000
      const msg = this.item.showInfo.msg
      if (newVal === true) {
        this.newTotalPrice += CountWeight * 5 >= 275 ? CountWeight * 5 : 275
        msg.push(`偏远附加费 5 元/KG(最低275): ${CountWeight * 5 >= 275 ? CountWeight * 5 : 275}`)
      } else {
        this.newTotalPrice -= CountWeight * 5 >= 275 ? CountWeight * 5 : 275
        msg.splice(msg.indexOf(`偏远附加费 5 元/KG(最低275): ${CountWeight * 5 >= 275 ? CountWeight * 5 : 275}`), 1)
      }
      this.item.showInfo.totalPrice = this.newTotalPrice.toFixed(2)
      this.item.showInfo.msg = msg
    },
    DiSanFang: function(newVal) {
      // 第三方 9.8 元/KG, 最低收费 90 元
      this.newTotalPrice = parseFloat(this.item.showInfo.totalPrice)
      const CountWeight = Number(this.item.showInfo.CountWeight) / 1000
      const msg = this.item.showInfo.msg
      if (newVal === true) {
        this.newTotalPrice += CountWeight * 9.8 >= 90 ? CountWeight * 9.8 : 90
        msg.push(`偏远附加费 9.8 元/KG(90): ${CountWeight * 9.8 >= 90 ? CountWeight * 9.8 : 90}`)
      } else {
        this.newTotalPrice -= CountWeight * 9.8 >= 90 ? CountWeight * 9.8 : 90
        msg.splice(msg.indexOf(`偏远附加费 9.8 元/KG(90): ${CountWeight * 9.8 >= 90 ? CountWeight * 9.8 : 90}`), 1)
      }
      this.item.showInfo.totalPrice = this.newTotalPrice.toFixed(2)
      this.item.showInfo.msg = msg
    },
    Saturday: function(newVal) {
      // 周六派送手续费：按RMB 142 /票*燃油计算
      this.newTotalPrice = parseFloat(this.item.showInfo.totalPrice)
      const msg = this.item.showInfo.msg
      if (newVal === true) {
        this.newTotalPrice += 142
        msg.push('周六配送费: 142 元/票')
      } else {
        this.newTotalPrice -= 142
        msg.splice(msg.indexOf('周六配送费: 142 元/票'), 1)
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
      let price = parseFloat(showInfo.totalPrice)
      const CountWeight = Number(showInfo.CountWeight)

      let ChaoZhong = 0
      const msg = []

      if (this.country && this.country.indexOf('加拿大') !== -1) {
        price += 32
        msg.push('加拿大住宅配送费: 32元')
      }
      // 超尺寸/超重/包装处理 不重复收取
      // 超尺寸附加费：最长单边超过118厘米；次长单边超过74厘米；或围长超255厘米
      if (this.lwh_arr.length === 3 && (this.lwh_arr[0] > 118 || this.lwh_arr[1] > 74)) {
        ChaoZhong = 222
        msg.push('最长边 > 118 CM / 第二边 > 74 CM: 222元')
      }
      if (volume > 255) {
        ChaoZhong = 222
        msg.push('围长 > 255 CM: 222元')
      }
      // 超重附加费：单件结算重超30KG（包含30KG）
      if (CountWeight / 1000 >= 30000) {
        ChaoZhong = 222
        msg.push('单件计费重大于等于30kg: 222元')
      }

      if (this.lwh_arr.length === 3 && (this.lwh_arr[0] > 230 || volume > 310)) {
        ChaoZhong += 625
        msg.push('最长边 > 230 CM / 围长 > 310 CM: 625元')
      }

      const totalPrice = (price + ChaoZhong).toFixed(2)

      this.$emit('countPrice', { totalPrice, isShow: true, msg, CountWeight }, this.index, 'TJFedExIP.vue')
    }
  }
}

</script>

<style scoped>

</style>
