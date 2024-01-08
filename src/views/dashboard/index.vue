<template>
  <div class="big-box">
    <div class="content">
      <div class="top">
        <h1>物流渠道比价系统(定制)</h1>
      </div>
      <div class="select">
        <el-card class="box-card">
          <div class="text item">
            <div class="every-div">
              <span class="top-label">目的地国家: </span>
              <el-select v-model="selectCountry" filterable placeholder="请选择">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </div>
            <el-divider direction="vertical" />
            <div class="every-div">
              <span class="top-label">物品重量: </span>
              <el-input v-model="weight" type="Number" placeholder="请输入内容" class="input-with-select">
                <span slot="append" class="append-span" @click="changeUnit">{{ unit }}</span>
              </el-input>
            </div>
            <el-divider direction="vertical" />
            <span class="top-label">长宽高(CM): </span>
            <el-input v-model="long" class="long-input" placeholder="长" /><el-divider
              direction="vertical"
            />
            <el-input v-model="wide" class="long-input" placeholder="宽" /><el-divider
              direction="vertical"
            />
            <el-input v-model="high" class="long-input" placeholder="高" />
            <el-divider direction="vertical" />
            <div class="every-div margin-t-10">
              <span class="top-label">发货地: </span>
              <el-select v-model="selectCountry" filterable placeholder="深圳" disabled>
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </div>
            <el-divider direction="vertical" class="margin-t-10" />
            <div class="every-div margin-t-10">
              <span class="top-label">选择产品: </span>
              <el-select v-model="selectCountry" filterable placeholder="儿童挖土机" disabled>
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </div>
            <el-divider direction="vertical" class="margin-t-10" />
            <div class="every-div margin-t-10">
              <span class="top-label">带电带磁: </span>
              <el-select v-model="withElectricity" filterable placeholder="请选择货物类型">
                <el-option v-for="item in ElectricityOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </div>
            <el-divider direction="vertical" class="margin-t-10" />
            <div class="every-div margin-t-10">
              <span class="top-label">渠道类型: </span>
              <el-select v-model="channelType" filterable placeholder="请选择货物类型">
                <el-option v-for="item in channelTypes" :key="item.channelType" :label="item.channelType" :value="item.channelType" />
              </el-select>
            </div>
          </div>
          <div class="search">
            <el-button type="primary" icon="el-icon-search" :loading="searchLoading" @click="search">试算</el-button>
            <el-button type="primary" icon="el-icon-search" :loading="searchLoading" @click="paiXu('price')">排序</el-button>
          </div>
        </el-card>
      </div>
      <div class="list-box">
        <channelList
          :list="channels"
          :weight="unit === 'KG' ? (weight * 1000) : weight"
          :lwh_arr="LWH_arr"
          :volume="volume"
        />
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
    high: null,
    volume: 0,
    LWH_arr: [],
    withElectricity: null,
    ElectricityOptions: [
      {
        label: '不限',
        value: null
      },
      {
        label: '普货',
        value: '1'
      },
      {
        label: '纯电',
        value: '2'
      },
      {
        label: '带电带磁',
        value: '3'
      }
    ],
    channelTypes: ['类型1', '类型2'],
    channelType: null
  }),
  created() {
    this.getChannelTypes()
  },
  methods: {
    async getChannelTypes() {
      const res = await this.$store.dispatch('channel/getChannelTypes')
      if (res.code !== 200) {
        return
      }
      this.channelTypes = res.results || ['获取类型失败']
    },
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
      const arr = []
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
      this.volume = arr.length === 3 ? arr[0] + ((arr[1] + arr[2]) * 2) : 0
      console.log('材积 ', this.volume)
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
      this.LWH_arr = arr.sort((a, b) => { return b - a })
      this.channels = []
      this.getList(this.LWH_arr, this.volume)
    },
    async getList(LWH_arr, volume) {
      this.searchLoading = false
      const data = {}
      data.country = this.selectCountry
      data.weight = this.unit === 'KG' ? this.weight * 1000 : this.weight
      data.LWH_arr = LWH_arr
      data.volume = volume
      data.withElectricity = this.withElectricity
      data.channelType = this.channelType
      console.log(data)
      const res = await this.$store.dispatch('channel/getChannelList', data)
      console.log(res.results)
      this.channels = res.results || []
      this.searchLoading = false
    },
    paiXu(way) {
      if (way === 'price') {
        const data = this.channels
        data.sort(function(a, b) {
          return parseFloat(a.showInfo.totalPrice) > parseFloat(b.showInfo.totalPrice) ? 1 : -1
        })
        console.log(data)
      }
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

.top-label {
  display: block;
  width: 100px;
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

.item {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  /* padding-right: 200px; */
}
.every-div {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 302px;
}
</style>
