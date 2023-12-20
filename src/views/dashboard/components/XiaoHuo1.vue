<template>
  <div class="XiaoHuoOne">
    <el-checkbox v-model="privateAddress" @change="changeSettings">私人地址</el-checkbox>
    <el-checkbox v-model="isToy" @change="changeSettings">玩具类</el-checkbox>
    <el-checkbox v-model="Magnetized" @change="changeSettings">带磁</el-checkbox>
  </div>
</template>

<script>

export default {
  name: 'XiaoHuoOne',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    item: { type: Object },
    // eslint-disable-next-line vue/require-default-prop
    weight: { type: Number },
    // eslint-disable-next-line vue/require-default-prop
    index: { type: Number }
  },
  data: () => ({
    privateAddress: true,
    isToy: true,
    Magnetized: true,
    newTotalPrice: 0
  }),
  watch: {
    weight: function(newVal) {
      console.log(newVal)
    },
    privateAddress: function(newVal) {
      this.newTotalPrice = this.item.showInfo.totalPrice
      if (newVal === true) {
        console.log(true)
        this.YuChiCount(this.weight) < 10000 ? this.newTotalPrice += 50 : this.newTotalPrice += 30
      } else {
        console.log(false)
        this.YuChiCount(this.weight) < 10000 ? this.newTotalPrice -= 50 : this.newTotalPrice -= 30
      }
      this.$emit('countPrice', this.newTotalPrice, this.index)
    },
    isToy: function(newVal) {
      this.newTotalPrice = this.item.showInfo.totalPrice
      const weight = this.YuChiCount(this.weight) / 1000
      if (newVal === true) {
        console.log(true)
        this.newTotalPrice += (2 * weight)
      } else {
        console.log(false)
        this.newTotalPrice -= (2 * weight)
      }
      this.$emit('countPrice', this.newTotalPrice, this.index)
    },
    Magnetized: function(newVal) {
      this.newTotalPrice = this.item.showInfo.totalPrice
      const weight = this.YuChiCount(this.weight) / 1000
      if (newVal === true) {
        console.log(true)
        this.newTotalPrice += (2 * weight)
      } else {
        console.log(false)
        this.newTotalPrice -= (2 * weight)
      }
      this.$emit('countPrice', this.newTotalPrice, this.index)
    }
  },
  mounted() {
    console.log(this.weight)
  },
  methods: {
    changeSettings() {
      // let TotalPrice = this.item.totalPrice
      // let weight = this.YuChiCount(this.weight) / 1000
      // if (this.privateAddress) {
      //   TotalPrice += 30
      //   if (weight < 10) TotalPrice += 20
      // } else {
      //   TotalPrice -= 30
      //   if (weight < 10) TotalPrice -= 20
      // }
      // if (this.isToy) {
      //   TotalPrice += (2 * weight)
      // }
      // if (this.Magnetized) {
      //   TotalPrice += (2 * weight)
      // }
      // this.$emit('countPrice', this.newTotalPrice, this.index)
    },
    isInteger(obj) {
      return obj % 1 === 0
    },

    YuChiCount(weight) {
      let currentScore = 0
      const floor = Math.floor((weight / 1000))
      if (this.isInteger(weight / 1000)) {
        currentScore = weight
        return currentScore
      }
      if (floor + 0.5 < (weight / 1000)) {
        currentScore = (floor + 1) * 1000
        return currentScore
      } else {
        currentScore = (floor + 0.5) * 1000
        return currentScore
      }
    }
  }

}

</script>
