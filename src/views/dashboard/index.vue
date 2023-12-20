<template>
  <div class="big-box">
    <div class="content">
      <div class="top">
        <h1>物流渠道比价系统(定制)</h1>
      </div>
      <div class="select">
        <el-card class="box-card">
          <div class="text item">
            <span>目的地国家: </span>
            <el-select v-model="selectCountry" filterable placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-divider direction="vertical" />
            <span>物品重量: </span>
            <el-input v-model="weight" type="Number" placeholder="请输入内容" class="input-with-select">
              <span slot="append" class="append-span" @click="changeUnit">{{ unit }}</span>
            </el-input>
            <el-divider direction="vertical" />
            <span>长宽高(CM): </span>
            <el-input v-model="long" class="long-input" placeholder="长" /><el-divider
              direction="vertical"
            />
            <el-input v-model="wide" class="long-input" placeholder="宽" /><el-divider
              direction="vertical"
            />
            <el-input v-model="high" class="long-input" placeholder="高" />
          </div>
          <div class="search">
            <el-button type="primary" icon="el-icon-search" :loading="searchLoading" @click="search">搜索</el-button>
          </div>
        </el-card>
      </div>
      <div class="list-box">
        <channelList :list="channels" :weight="unit === 'KG' ? (weight * 1000) : weight" />
      </div>
    </div>
  </div>
</template>

<script>

const { country } = require('@/utils/country')
// import axios from "axios";
import channelList from './channelView'

export default {
  name: 'HomeView',
  components: { channelList },
  data: () => ({
    options: country,
    selectCountry: '',
    weight: 0,
    unit: 'KG',
    searchLoading: false,
    channels: [],
    long: null,
    wide: null,
    high: null
  }),
  methods: {
    changeUnit() {
      if (this.unit === 'KG') {
        this.weight = this.weight * 1000
        this.unit = 'G'
      } else {
        this.weight = this.weight / 1000
        this.unit = 'KG'
      }
    },
    search() {
      let arr = []
      this.long && arr.push(parseFloat(this.long))
      this.wide && arr.push(parseFloat(this.wide))
      this.high && arr.push(parseFloat(this.high))
      if (arr.length !== 0 && arr.length !== 3) {
        this.$message({
          message: '请输入完整的长宽高数据.',
          type: 'warning'
        })
        return
      }
      const volume = arr.length === 3 ? arr[0] + ((arr[1] + arr[2]) * 2) : 0
      console.log('材积 ', volume)
      if (!this.selectCountry) {
        this.$message({
          message: '请先选择目的地国家.',
          type: 'warning'
        })
        return
      }
      if (!this.weight) {
        this.$message({
          message: '物品重量不能为空或0.',
          type: 'warning'
        })
        return
      }
      this.searchLoading = true
      arr = arr.sort((a, b) => { return b - a })
      this.channels = []
      this.getList(arr, volume)
    },
    async getList(LWH_arr, volume) {
      const data = {}
      data.country = this.selectCountry
      data.weight = this.unit === 'KG' ? this.weight * 1000 : this.weight
      data.LWH_arr = LWH_arr
      data.volume = volume
      console.log(data)
      const res = await this.$store.dispatch('channel/getChannelList', data)
      console.log(res.results)
      this.channels = res.results || []
      this.searchLoading = false
    }
  }
}
</script>

<style>
.top {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  text-align: center;
  font-weight: 500;
  letter-spacing: 3px;
}

.input-with-select {
  width: 200px !important;
}

.el-input-group__append,
.el-input-group__prepend {
  padding: 0;
  width: 50px;
  text-align: center;
}

.long-input {
  width: 60px !important;
}

.long-input>>>.el-input__inner {
  border-right: none;
}

.append-span {
  cursor: pointer;
}

.el-card__body {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.list-box {
  flex: 1;
  display: flex;
  margin-top: 20px;
  flex-direction: column;
  width: 100%;
  height: auto;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
  border-radius: 4px;
  border: 1px solid #EBEEF5;
  background-color: #FFF;
  overflow: hidden;
  color: #303133;
  transition: .3s;
  padding: 20px;
}
</style>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-bottom: 20px;
}
</style>
