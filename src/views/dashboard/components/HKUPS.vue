<template>
  <div class="XiaoHuoOne">
    <el-checkbox v-model="privateAddress" @change="changeSettings">私人地址</el-checkbox>
    <el-checkbox v-model="isToy" @change="changeSettings">玩具类</el-checkbox>
    <el-checkbox v-model="Ele" @change="changeSettings">带电带磁</el-checkbox>
    <!-- <el-checkbox v-model="Magnetized" @change="changeSettings">带磁</el-checkbox> -->
  </div>
</template>

<script>

export default {
  name: 'HKUPS',
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
    privateAddress: true,
    isToy: true,
    Ele: true, // 带电带磁
    newTotalPrice: 0
  }),
  watch: {
    privateAddress: function(newVal) {
      this.newTotalPrice = this.item.showInfo.totalPrice
      if (newVal === true) {
        console.log(true)
        this.newTotalPrice += 30
      } else {
        console.log(false)
        this.newTotalPrice -= 30
      }
      this.item.showInfo.totalPrice = this.newTotalPrice
      // this.$emit('countPrice', this.newTotalPrice, this.index)
    },
    Ele: function(newVal) {
      this.newTotalPrice = this.item.showInfo.totalPrice
      if (newVal === true) {
        console.log(true)
        this.newTotalPrice += 25
      } else {
        console.log(false)
        this.newTotalPrice -= 25
      }
      this.item.showInfo.totalPrice = this.newTotalPrice
      // this.$emit('countPrice', this.newTotalPrice, this.index)
    },
    isToy: function(newVal) {
      this.newTotalPrice = this.item.showInfo.totalPrice
      const weight = this.forUPSWeight(this.weight) / 1000
      if (newVal === true) {
        this.newTotalPrice += (3 * weight)
      } else {
        this.newTotalPrice -= (3 * weight)
      }
      this.item.showInfo.totalPrice = this.newTotalPrice
      // this.$emit('countPrice', this.newTotalPrice, this.index)
    }
  },
  mounted() {
    this.forUPSPrice(this.item, this.weight, this.lwh_arr, this.volume)
  },
  methods: {
    changeSettings() {

    },
    // 计算 UPS双清专线A价普货 渠道的重量, 不足1KG, 按照1KG计算
    forUPSWeight(val) {
      // 不足 21KG 的, 按照 21KG 计算
      val = val <= 25 ? 25 : val
      // 向上取整 Math.ceil
      return Math.ceil(val / 1000) * 1000
    },

    forUPSPrice(value, weight, LWH_arr, volume) {
      // const { range } = value
      const price = parseFloat(value.showInfo.totalPrice)
      // for (const item of range) {
      //   if (this.forUPSWeight(weight) >= item.range[0] && this.forUPSWeight(weight) < item.range[1]) {
      //     price = item.price
      //     break
      //   }
      // }

      let ChaoZhong = 0
      const msg = []
      if ((this.forUPSWeight(weight) > 32000)) {
        ChaoZhong += 108
        msg.push('单件始终 >= 32 KG: 108元')
      }
      if (LWH_arr.length === 3 && LWH_arr[0] >= 122) {
        ChaoZhong += 108
        msg.push('最长边 >= 122 CM: 108元')
      }
      if (LWH_arr.length === 3 && LWH_arr[1] >= 76) {
        ChaoZhong += 108
        msg.push('第二长边 >= 76 CM: 108元')
      }
      if (volume > 295 && volume < 400) {
        ChaoZhong += 527
        msg.push('(宽+高)*2+长, 超过295cm: 527元')
      }

      const toy = 3 // 电子玩具类 + 1
      const pre = 30 // 私人地址 30 元
      const ele = 25 // 带电带磁 25 元一单
      const totalPrice = (price + (this.forUPSWeight(weight) / 1000 * toy) + pre + ele).toFixed()

      console.log({ totalPrice, isShow: true, msg: `超重费用: ${ChaoZhong}` })
      this.$emit('countPrice', { totalPrice, isShow: true, msg }, this.index)
    }
  }
}

</script>
