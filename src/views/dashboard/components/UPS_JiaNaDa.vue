<template>
  <div class="XiaoHuoOne">
    <!-- <el-checkbox v-model="privateAddress" @change="changeSettings">私人地址</el-checkbox> -->
    <el-checkbox v-model="isToy" @change="changeSettings">电子玩具类</el-checkbox>
    <!-- <el-checkbox v-model="Magnetized" @change="changeSettings">带磁</el-checkbox> -->
  </div>
</template>

<script>

export default {
  name: 'UPSJiaNaDa',
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
    isToy: function(newVal) {
      this.newTotalPrice = this.item.showInfo.totalPrice
      const weight = this.forUPSWeight(this.weight) / 1000
      if (newVal === true) {
        console.log(true)
        this.newTotalPrice += (3 * weight)
      } else {
        console.log(false)
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
      val = val <= 11000 ? 11000 : val
      // 向上取整 Math.ceil
      return Math.ceil(val / 1000) * 1000
    },

    forUPSPrice(value, weight, LWH_arr, volume) {
      const { range } = value
      let price = 0
      for (const item of range) {
        if (this.forUPSWeight(weight) >= item.range[0] && this.forUPSWeight(weight) < item.range[1]) {
          price = item.price
          break
        }
      }

      let ChaoZhong = 0
      let msg = ''
      if ((this.forUPSWeight(weight) > 30000)) {
        ChaoZhong += 120
        msg += '超重费用:120, '
      }
      if (LWH_arr.length === 3 && LWH_arr[0] > 120) {
        ChaoZhong += 120
        msg += '超长费用:120, '
      }
      //  || (LWH_arr.length === 3 && LWH_arr[0] >= 100 || LWH_arr[1] >= 76)
      if (volume > 265 && volume < 400) {
        ChaoZhong += 420
        msg += '大型货件:420'
      }

      console.log('超重', ChaoZhong)

      const toy = 3 // 电子玩具类 + 3
      const pre = 0 // 私人地址 30 元
      const totalPrice = (price * (this.forUPSWeight(weight) / 1000) + (toy * this.forUPSWeight(weight) / 1000) + pre + ChaoZhong).toFixed(2)
      console.log((toy * this.forUPSWeight(weight) / 1000))

      console.log({ totalPrice, isShow: true, msg: `超重费用: ${ChaoZhong}` })
      this.$emit('countPrice', { totalPrice, isShow: true, msg }, this.index)
      return { totalPrice, isShow: true, msg: `超重费用: ${ChaoZhong}` }
    }
  }
}

</script>
