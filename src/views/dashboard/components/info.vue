<!--
 * @Author: shangguanyaa 1051158791@qq.com
 * @Date: 2024-01-05 15:18:59
 * @LastEditors: SGuanyaa 1051158791@qq.com
 * @LastEditTime: 2024-03-28 10:51:05
 * @FilePath: \vue-admin-template\src\views\dashboard\components\LiChuang.vue
 * @Description: 渠道: 泰嘉-深圳UPS红单小货 5800
-->
<template>
  <div class="more">
    <p v-for="(value, i) in item.customSurcharge" :key="i">
      <el-checkbox v-model="value.autoSelect" @change="changeSettings(i)">{{ value.text }}</el-checkbox>
    </p>
    <Descriptions :item="item" />
  </div>
</template>

<script>
import Descriptions from './descriptions.vue'
import { getOil } from '@/utils/setOil'

export default {
  name: 'Info',
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
    },
    // eslint-disable-next-line vue/prop-name-casing
    is_first_show: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    newTotalPrice: 0
  }),
  created() {
    this.forUPSPrice(this.item, this.volume)
  },
  methods: {
    changeSettings(index) {
      const value = this.item.customSurcharge[index]
      this.newTotalPrice = parseFloat(this.item.showInfo.totalPrice)
      const msg = this.item.showInfo.msg
      const { Price, Message } = this.countPrice(value, Number(this.item.showInfo.CountWeight) / 1000)
      if (value.autoSelect) {
        console.log('勾选了')
        console.log(Price, Message)
        this.newTotalPrice += parseFloat(Price)
        msg.push(...Message)
      } else {
        console.log('取消了')
        this.newTotalPrice -= parseFloat(Price)
        msg.splice(msg.indexOf(Message[0]), 1)
      }
      console.log(this.newTotalPrice)
      this.item.showInfo.totalPrice = parseFloat(this.newTotalPrice.toFixed(2))
      this.item.showInfo.msg = msg
    },

    forUPSPrice(value, volume) {
      const { showInfo, customSurcharge, channelName, countWay } = value
      const price = parseFloat(showInfo.totalPrice)
      const CountWeight = Number(showInfo.CountWeight)
      let isShow = showInfo.isShow
      const msg = showInfo.msg

      let totalPrice = price

      // const p = new Promise((resove, reject) => {
      //   const { Price, Message } = this.itemZdyPrice((CountWeight / 1000), customSurcharge)
      //   resove({ Price, Message })
      // })

      // p.then((value) => {
      //   console.log(value);
      // })

      let log = false

      if (channelName === '宇驰-深圳联邦-IP【只发普货，带磁】' && countWay === '3') {
        console.log(channelName + '  ' + countWay)
        log = true
        console.log(this.is_first_show)
      }

      if (this.is_first_show) {
        const { Price, Message } = this.itemZdyPrice((CountWeight / 1000), customSurcharge, log)

        totalPrice += Price

        msg.push(...Message)
      }

      if (showInfo.price === 0) {
        isShow = false
      }

      this.$emit('countPrice', { totalPrice: parseFloat(totalPrice.toFixed(2)), isShow, msg, CountWeight, price: showInfo.price }, this.index, `Info.vue ${this.item.channelName}`)
    },
    itemZdyPrice(weight, customSurcharge, log) {
      let price = 0
      const msg = []
      for (const item of customSurcharge) {
        if (!item.autoSelect) {
          price += 0
        } else {
          const { Price, Message } = this.countPrice(item, weight)
          price += Price
          msg.push(...Message)
        }
      }
      // if (log) {
      //   console.log('触发了计算价格')
      //   console.log({ Price: price, Message: msg })
      // }
      return { Price: price, Message: msg }
    },
    countPrice(item, weight) {
      const oil = getOil()
      let tempPrice = 0
      let price = 0
      const msg = []
      if (item.type === 1) {
        if (item.oil) { // 需要乘以当周燃油
          tempPrice = parseFloat((item.price * oil))
          price += tempPrice
          msg.push(`${item.text} ${item.price} * ${oil}燃油: ${tempPrice} 元`)
        } else { // 不需要当周燃油
          tempPrice = item.price > item.minPrice ? item.price : item.minPrice
          price += parseFloat(tempPrice)
          msg.push(`${item.text}: ${tempPrice} 元`)
        }
      } else {
        if (item.oil) { // 需要乘以当周燃油
          tempPrice = item.price * weight * oil > item.minPrice ? item.price * weight * oil : item.minPrice
          price += parseFloat((tempPrice))
          msg.push(`${item.text} 每KG ${item.price} * ${oil}燃油: ${tempPrice} 元. (最低${item.minPrice})`)
        } else { // 不需要当周燃油
          tempPrice = item.price * weight > item.minPrice ? item.price * weight : item.minPrice
          price += parseFloat(tempPrice)
          msg.push(`${item.text} 每KG ${item.price} 元: ${tempPrice} 元. (最低${item.minPrice})`)
        }
      }
      return { Price: price, Message: msg }
    }
  }
  /* 检查渠道信息是否正确的步骤:
   * 1. 首先到试算界面, 尽量多的选择条件去试算, 这样是为了能过滤掉还没检查到的渠道
   * 2. 试算 之后, 原价信息没有错误的, 开始对着渠道表格新建 附加费用规则
   * 3. 如果试算出来的 原价 是对不上的, 那么就先去 数据管理 -> 渠道数据管理 模块, 找到该渠道
   *    对比一下渠道里的数据是否对的上, 对不上修改之后再返回第 2 步重新进行试算
   *    如果渠道里的数据对上了, 但是试算原价不对, 这个时候就记录下来, 这一次试算的所有参数, 不对在哪, 应该得到多少钱
   * 4. 添加了 附加费规则 模块, 回到试算页面, 根据附加费的临界值去 重新试算, 看看添加了附加费的结果是否有出入
   *
  */
}

</script>

<style scoped>

</style>
