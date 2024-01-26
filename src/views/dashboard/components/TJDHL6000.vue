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
    <el-checkbox v-model="Toy" @change="changeSettings">玩具、太阳能板、平板电脑、手机、手表、智能手环、数码相机、摄像头、投影仪、行车记录仪、对讲机、机顶盒、无人飞机</el-checkbox>
    <br>
    <el-checkbox v-model="PiGe" @change="changeSettings">水笔产品、纺织品，皮革制品，鞋类，箱包，木制产品，纯金属制产品，笔类产品、成人用品</el-checkbox>
    <br>
    <el-checkbox v-model="GaoFengXian" @change="changeSettings">高风险: 阿富汗、伊拉克、利比亚、索马里、马里、尼日尔、 苏丹、叙利亚、也门、以色列、黎巴嫩、委内瑞拉、布基纳法索</el-checkbox>
    <br>
    <el-checkbox v-model="XianYun" @change="changeSettings">限运:中非共和国、科特迪瓦、刚果民主共和国、厄立特里亚、伊朗、伊拉克、朝鲜、利比里亚、利比亚、索马里、苏丹、叙利亚、也门</el-checkbox>
    <br>
    <el-checkbox v-model="FDA" @change="changeSettings">FDA产品</el-checkbox>
    <el-checkbox v-model="GuanShui" @change="changeSettings">关税预付</el-checkbox>
    <el-checkbox v-model="Saturday" @change="changeSettings">周六配送</el-checkbox>
    <el-checkbox v-model="DSFGuanShui" @change="changeSettings">第三方关税附加费</el-checkbox>
    <el-checkbox v-model="DSZShoujianren" @change="changeSettings">第三者收件人</el-checkbox>
    <el-checkbox v-model="FeiDuiDie" @change="changeSettings">非堆叠</el-checkbox>
    <!-- <el-descriptions title="渠道信息" :column="3" border>
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
    </el-descriptions> -->
    <Descriptions :item="item" />
  </div>
</template>

<script>
import Descriptions from './descriptions.vue'

export default {
  name: 'TJDHL6000',
  components: { Descriptions },
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
    Toy: true, // 玩具
    PiGe: false, // 水笔产品、纺织品，皮革制品，鞋类，箱包，木制产品，纯金属制产品，笔类产品、成人用品
    FDA: false, // FDA 产品
    Magnetized: true,
    GuanShui: false,
    GaoFengXian: false, // 高风险地区
    XianYun: false, // 限运
    Saturday: false,
    DSFGuanShui: false, // 第三方关税
    DSZShoujianren: false, // 第三者收件人
    FeiDuiDie: false, // 非堆叠货物
    newTotalPrice: 0
  }),
  watch: {
    Toy: function(newVal) {
      // 玩具 3 元/KG 附加费最低消费 50 元
      this.newTotalPrice = parseFloat(this.item.showInfo.totalPrice)
      const CountWeight = Number(this.item.showInfo.CountWeight) / 1000
      const msg = this.item.showInfo.msg
      if (newVal === true) {
        this.newTotalPrice += CountWeight * 3 >= 50 ? CountWeight * 3 : 50
        msg.push(`玩具 3 元/KG(最低50): ${CountWeight * 3 >= 50 ? CountWeight * 3 : 50}`)
      } else {
        this.newTotalPrice -= CountWeight * 3 >= 50 ? CountWeight * 3 : 50
        msg.splice(msg.indexOf(`玩具 3 元/KG(最低50): ${CountWeight * 3 >= 50 ? CountWeight * 3 : 50}`), 1)
      }
      this.item.showInfo.totalPrice = this.newTotalPrice.toFixed(2)
      this.item.showInfo.msg = msg
    },
    PiGe: function(newVal) {
      // 水笔产品、纺织品，皮革制品，鞋类，箱包，木制产品，纯金属制产品，笔类产品、成人用品 1 元/KG
      this.newTotalPrice = parseFloat(this.item.showInfo.totalPrice)
      const CountWeight = Number(this.item.showInfo.CountWeight) / 1000
      const msg = this.item.showInfo.msg
      if (newVal === true) {
        this.newTotalPrice += CountWeight * 1 >= 50 ? CountWeight * 1 : 50
        msg.push(`水彩产品等 1 元/KG(最低50): ${CountWeight * 1 >= 50 ? CountWeight * 1 : 50}`)
      } else {
        this.newTotalPrice -= CountWeight * 1 >= 50 ? CountWeight * 1 : 50
        msg.splice(msg.indexOf(`水彩产品等 1 元/KG(最低50): ${CountWeight * 1 >= 50 ? CountWeight * 1 : 50}`), 1)
      }
      this.item.showInfo.totalPrice = this.newTotalPrice.toFixed(2)
      this.item.showInfo.msg = msg
    },
    FDA: function(newVal) {
      // FDA 产品 5 元/KG
      this.newTotalPrice = parseFloat(this.item.showInfo.totalPrice)
      const CountWeight = Number(this.item.showInfo.CountWeight) / 1000
      const msg = this.item.showInfo.msg
      if (newVal === true) {
        this.newTotalPrice += CountWeight * 5 >= 50 ? CountWeight * 5 : 50
        msg.push(`FDA 产品 5 元/KG(最低50): ${CountWeight * 5 >= 50 ? CountWeight * 5 : 50}`)
      } else {
        this.newTotalPrice -= CountWeight * 5 >= 50 ? CountWeight * 5 : 50
        msg.splice(msg.indexOf(`FDA 产品 5 元/KG(最低50): ${CountWeight * 5 >= 50 ? CountWeight * 5 : 50}`), 1)
      }
      this.item.showInfo.totalPrice = this.newTotalPrice.toFixed(2)
      this.item.showInfo.msg = msg
    },
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
    GaoFengXian: function(newVal) {
      // 高风险地区 250 元/票
      this.newTotalPrice = parseFloat(this.item.showInfo.totalPrice)
      const msg = this.item.showInfo.msg
      if (newVal === true) {
        this.newTotalPrice += 250
        msg.push(`高风险地区: 250`)
      } else {
        this.newTotalPrice -= 250
        msg.splice(msg.indexOf(`高风险地区: 250`), 1)
      }
      this.item.showInfo.totalPrice = this.newTotalPrice.toFixed(2)
      this.item.showInfo.msg = msg
    },
    XianYun: function(newVal) {
      // 限运地区 350 元/票
      this.newTotalPrice = parseFloat(this.item.showInfo.totalPrice)
      const msg = this.item.showInfo.msg
      if (newVal === true) {
        this.newTotalPrice += 350
        msg.push(`限运地区: 350`)
      } else {
        this.newTotalPrice -= 350
        msg.splice(msg.indexOf(`限运地区: 350`), 1)
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
      // 非堆叠货件: 1600
      this.newTotalPrice = parseFloat(this.item.showInfo.totalPrice)
      const msg = this.item.showInfo.msg
      if (newVal === true) {
        this.newTotalPrice += 1600
        msg.push('非堆叠等特殊货件: 1600')
      } else {
        this.newTotalPrice -= 1600
        msg.splice(msg.indexOf('非堆叠等特殊货件: 1600'), 1)
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

      if (CountWeight / 1000 >= 68) {
        ChaoZhong += 108
        msg.push('单件计费重大于等于68kg: 400元')
      }

      const toy = 3 * CountWeight / 1000 // 玩具 + 3 元/KG

      msg.push(`玩具 3 元/KG(最低50): ${toy}`)

      const totalPrice = (price + ChaoZhong + toy).toFixed(2)

      this.$emit('countPrice', { totalPrice, isShow: true, msg, CountWeight }, this.index, 'TJDHL6000.vue')
    }
  }
}

</script>

<style scoped>

</style>
