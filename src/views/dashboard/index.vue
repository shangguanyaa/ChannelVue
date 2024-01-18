<template>
  <div class="big-box">
    <div class="content">
      <div class="top">
        <h1>物流渠道比价系统(定制)</h1>
      </div>
      <div class="select">
        <el-card v-loading="cardLoading" class="box-card">
          <div class="text item">
            <div class="every-div">
              <span style="color: red;">*</span><span class="top-label">目的地国家: </span>
              <el-select v-model="selectCountry" filterable placeholder="请选择">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.label" />
              </el-select>
            </div>
            <el-divider direction="vertical" />
            <div class="every-div">
              <span style="color: red;">*</span>
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
              <span class="top-label">渠道类型: </span>
              <el-select v-model="channelType" filterable placeholder="请选择货物类型">
                <el-option v-for="item in channelTypes" :key="item.channelType" :label="item.channelType" :value="item.channelType" />
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
              <span class="top-label">选择产品: </span>
              <el-autocomplete
                v-model="stockSKU"
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入库存SKU"
                @select="handleSelectProduct"
              />
            </div>
            <el-divider v-show="stockSKU" direction="vertical" class="margin-t-10" />
            <div v-show="stockSKU" class="every-div margin-t-10">
              <el-popover
                placement="right"
                width="400"
                trigger="hover"
              >
                <el-descriptions class="margin-top" title="带边框列表" :column="1" border>
                  <template slot="extra">
                    <el-button type="primary" size="small">操作</el-button>
                  </template>
                  <el-descriptions-item label="品牌名称">{{ selectedProduct.brandName }}</el-descriptions-item>
                  <el-descriptions-item label="库存SKU">{{ selectedProduct.stockSKU }}</el-descriptions-item>
                  <el-descriptions-item label="SKU英文名">{{ selectedProduct.PEName }}</el-descriptions-item>
                  <el-descriptions-item label="SKU中文名">{{ selectedProduct.PZName }}</el-descriptions-item>
                  <el-descriptions-item :label-style="{'width': '150px'}" label="售前危机预防和培训">{{ selectedProduct.presaleRemark }}</el-descriptions-item>
                  <el-descriptions-item label="是否侵权">{{ selectedProduct.isTort }}</el-descriptions-item>
                  <el-descriptions-item label="责任人">{{ selectedProduct.liability }}</el-descriptions-item>
                  <el-descriptions-item label="预估尺寸 CM">{{ selectedProduct.Dimensions }}</el-descriptions-item>
                  <el-descriptions-item label="电池">{{ selectedProduct.productType }}</el-descriptions-item>
                  <el-descriptions-item label="开发估重 G">{{ selectedProduct.PWeight }}</el-descriptions-item>
                  <el-descriptions-item label="商品成本">{{ selectedProduct.cost }}</el-descriptions-item>
                  <el-descriptions-item label="特殊发货备注">{{ selectedProduct.remark }}</el-descriptions-item>
                </el-descriptions>
                <span slot="reference">产品中文SKU: {{ selectedProduct.PZName }}</span>
              </el-popover>
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
          :weight="unit === 'KG' ? Number((weight * 1000)) : Number(weight)"
          :lwh_arr="LWH_arr"
          :volume="volume"
          :country="selectCountry"
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
    channelType: null,
    stockSKU: '',
    selectedProduct: {},
    cardLoading: false
  }),
  created() {
    this.getChannelTypes()
  },
  methods: {
    async querySearchAsync(queryString, cb) {
      const res = await this.$store.dispatch('products/getProductsListForIndex', { pageSize: 1000, pageIndex: 1, keywords: queryString })
      const productList = []
      if (res.code !== 201) {
        productList.push({
          value: '服务器错误'
        })
      } else if (res.code === 201 && res.results.total === 0) {
        productList.push({
          value: '无数据'
        })
      } else {
        for (const item of res.results.res) {
          item.value = item.stockSKU
          productList.push(item)
        }
      }
      cb(productList)
    },
    handleSelectProduct(item) {
      console.log(item)
      this.selectedProduct = item
      const Dimensions = item.Dimensions.split('*')
      console.log(Dimensions)
      if (!Array.isArray(Dimensions) || Dimensions.length !== 3) {
        this.$message({
          type: 'warning',
          message: '当前选择的SKU, 长宽高数据不合法, 无法自动输入'
        })
      } else {
        this.long = Dimensions[0]
        this.wide = Dimensions[1]
        this.high = Dimensions[2]
      }
      const obj = {
        '普货': '1',
        '纯电': '2',
        '带电': '3',
        '带电带磁': '3'
      }
      if (!item.productType || !['普货', '纯电', '带电', '带电带磁'].includes(item.productType)) {
        this.$message({
          type: 'warning',
          message: '当前选择的SKU, 带电带磁货物类型非法, 请检查'
        })
      } else {
        this.withElectricity = obj[item.productType]
      }
      if (!item.PWeight) {
        this.$message({
          type: 'warning',
          message: '当前选择的SKU, 重量数据非法, 请检查'
        })
      } else {
        this.weight = item.PWeight
      }
    },
    async getChannelTypes() {
      this.cardLoading = true
      const res = await this.$store.dispatch('channel/getChannelTypes')
      if (res.code !== 200) {
        this.cardLoading = false
        this.channelTypes = ['获取类型失败']
        return
      }
      this.cardLoading = false
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
