<template>
  <div class="big-box">
    <div v-if="!isMobile" class="content">
      <div class="top">
        <h1>物流比价系统(TOUCANHOBBY)</h1>
      </div>
      <div class="select">
        <el-card v-loading="cardLoading" class="box-card">
          <div class="text item">
            <div class="row">
              <span class="label">
                <span style="color: red"> * </span>
                目的地国家:
              </span>
              <el-select
                v-model="selectCountry"
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in options"
                  :key="item.label + 'c'"
                  :label="item.label"
                  :value="item.label"
                />
              </el-select>

              <el-divider direction="vertical" />

              <span class="label">
                <span style="color: red"> * </span>物品重量:
              </span>
              <el-input
                v-model="weight"
                type="Number"
                placeholder="请输入内容"
                class="input-with-select"
              >
                <el-select
                  slot="append"
                  v-model="unit"
                  class="append-span"
                  :placeholder="unit"
                >
                  <el-option label="G" value="G" />
                  <el-option label="KG" value="KG" />
                </el-select>
                <!-- <span slot="append" class="append-span" @click="changeUnit">{{ unit }}</span> -->
              </el-input>

              <el-divider direction="vertical" />
              <span class="label">长宽高(CM): </span>
              <el-input
                v-model="long"
                class="long-input"
                placeholder="长"
              /><el-divider direction="vertical" />
              <el-input
                v-model="wide"
                class="long-input"
                placeholder="宽"
              /><el-divider direction="vertical" />
              <el-input v-model="high" class="long-input" placeholder="高" />
            </div>

            <div class="row margin-t-10">
              <span class="top-label">发货地: </span>
              <el-select v-model="faHuo" filterable placeholder="深圳">
                <el-option
                  v-for="item in faHuoOptions"
                  :key="item.value + 'd'"
                  :label="item.value"
                  :value="item.value"
                />
              </el-select>
              <el-divider direction="vertical" />
              <span class="top-label">渠道类型: </span>
              <el-select
                v-model="channelType"
                filterable
                placeholder="请选择渠道类型"
              >
                <el-option
                  v-for="item in channelTypes"
                  :key="item.label + 'e'"
                  :label="item.label"
                  :value="item.channelType"
                />
              </el-select>
              <el-divider direction="vertical" />
              <span class="top-label">带电带磁: </span>
              <el-select
                v-model="withElectricity"
                filterable
                placeholder="请选择货物类型"
              >
                <el-option
                  v-for="item in ElectricityOptions"
                  :key="item.value + 'f'"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>

            <div class="row margin-t-10">
              <span
                class="top-label"
              ><span style="color: red"> * </span>选择库存SKU:
              </span>
              <el-autocomplete
                v-model="stockSKU"
                :fetch-suggestions="querySearchAsync"
                placeholder="请输入库存SKU"
                @select="handleSelectProduct"
              />
              <el-divider direction="vertical" />
              <span
                class="top-label"
              ><span style="color: red"> * </span>选择英文SKU:
              </span>
              <el-autocomplete
                v-model="PEName"
                :fetch-suggestions="querySearchAsyncPEName"
                placeholder="请输入英文名搜索"
                @select="handleSelectProduct"
              />
            </div>
            <div v-show="stockSKU" class="">
              <el-popover placement="right" width="400" trigger="hover">
                <el-descriptions
                  class="margin-top"
                  title="带边框列表"
                  :column="1"
                  border
                >
                  <template slot="extra">
                    <el-button type="primary" size="small">操作</el-button>
                  </template>
                  <el-descriptions-item label="品牌名称">{{
                    selectedProduct.brandName
                  }}</el-descriptions-item>
                  <el-descriptions-item label="库存SKU">{{
                    selectedProduct.stockSKU
                  }}</el-descriptions-item>
                  <el-descriptions-item label="SKU英文名">{{
                    selectedProduct.PEName
                  }}</el-descriptions-item>
                  <el-descriptions-item label="SKU中文名">{{
                    selectedProduct.PZName
                  }}</el-descriptions-item>
                  <el-descriptions-item
                    :label-style="{ width: '150px' }"
                    label="售前危机预防和培训"
                  >{{ selectedProduct.presaleRemark }}</el-descriptions-item>
                  <el-descriptions-item label="是否侵权">{{
                    selectedProduct.isTort
                  }}</el-descriptions-item>
                  <el-descriptions-item label="责任人">{{
                    selectedProduct.liability
                  }}</el-descriptions-item>
                  <el-descriptions-item label="预估尺寸 CM">{{
                    selectedProduct.Dimensions
                  }}</el-descriptions-item>
                  <el-descriptions-item label="电池">{{
                    selectedProduct.productType
                  }}</el-descriptions-item>
                  <el-descriptions-item label="开发估重 G">{{
                    selectedProduct.PWeight
                  }}</el-descriptions-item>
                  <el-descriptions-item label="商品成本">{{
                    selectedProduct.cost
                  }}</el-descriptions-item>
                  <el-descriptions-item label="特殊发货备注">{{
                    selectedProduct.remark
                  }}</el-descriptions-item>
                </el-descriptions>
                <span
                  slot="reference"
                  class="PZName"
                >产品中文SKU: {{ selectedProduct.PZName }}</span>
              </el-popover>
            </div>
          </div>
          <div class="search">
            <el-button
              type="primary"
              icon="el-icon-search"
              :loading="searchLoading"
              @click="search"
            >试算</el-button>
            <el-button
              type="primary"
              icon="el-icon-search"
              :loading="searchLoading"
              @click="reSet"
            >重置</el-button>
          </div>
        </el-card>
      </div>
      <div v-loading="searchLoading" class="list-box">
        <KeepAlive>
          <channelList
            :list="channels"
            :weight="unit === 'KG' ? Number(weight * 1000) : Number(weight)"
            :lwh_arr="LWH_arr"
            :volume="volume"
            :country="selectCountry"
            :is_first_show="isFirstShow"
            @countPrice="countPrice"
          />
        </KeepAlive>

      </div>
    </div>
    <div v-else class="mobile">
      <div class="top">
        <h1>物流渠道比价系统(定制)</h1>
      </div>
      <div class="select">
        <div v-loading="cardLoading" class="box-card">
          <div class="item">
            <div class="every-div">
              <p class="top-label">
                <span style="color: red"> * </span>目的地国家:
              </p>
              <el-select
                v-model="selectCountry"
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value + 'g'"
                  :label="item.label"
                  :value="item.label"
                />
              </el-select>
            </div>
            <div class="every-div">
              <p class="top-label">
                <span style="color: red"> * </span>物品重量:
              </p>
              <el-input
                v-model="weight"
                type="Number"
                placeholder="请输入内容"
                class="input-with-select"
              >
                <el-select
                  slot="append"
                  v-model="unit"
                  class="append-span"
                  :placeholder="unit"
                >
                  <el-option label="G" value="G" />
                  <el-option label="KG" value="KG" />
                </el-select>
              </el-input>
            </div>
            <template v-if="showMoreOptions">
              <div class="every-div">
                <p class="top-label">长宽高(CM):</p>
                <el-input v-model="long" class="long-input" placeholder="长" />
                <el-input v-model="wide" class="long-input" placeholder="宽" />
                <el-input v-model="high" class="long-input" placeholder="高" />
              </div>

              <div class="every-div">
                <p class="top-label">发货地:</p>
                <el-select v-model="faHuo" filterable placeholder="深圳">
                  <el-option
                    v-for="item in faHuoOptions"
                    :key="item.value + 'h'"
                    :label="item.value"
                    :value="item.value"
                  />
                </el-select>
              </div>
              <div class="every-div">
                <p class="top-label">渠道类型:</p>
                <el-select
                  v-model="channelType"
                  filterable
                  placeholder="请选择货物类型"
                >
                  <el-option
                    v-for="item in channelTypes"
                    :key="item.channelType + 'i'"
                    :label="item.channelType"
                    :value="item.channelType"
                  />
                </el-select>
              </div>
              <div class="every-div">
                <p class="top-label">带电带磁:</p>
                <el-select
                  v-model="withElectricity"
                  filterable
                  placeholder="请选择货物类型"
                >
                  <el-option
                    v-for="item in ElectricityOptions"
                    :key="item.value + 'j'"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
              <div class="every-div">
                <p class="top-label">
                  <span style="color: red"> * </span>库存SKU:
                </p>
                <el-autocomplete
                  v-model="stockSKU"
                  :fetch-suggestions="querySearchAsync"
                  placeholder="请输入库存SKU"
                  @select="handleSelectProduct"
                />
              </div>
              <div class="every-div">
                <p class="top-label">
                  <span style="color: red"> * </span>英文SKU:
                </p>
                <el-autocomplete
                  v-model="PEName"
                  :fetch-suggestions="querySearchAsyncPEName"
                  placeholder="请输入英文名搜索"
                  @select="handleSelectProduct"
                />
              </div>
              <div v-show="stockSKU" class="every-div">
                <el-popover placement="right" width="400" trigger="hover">
                  <el-descriptions
                    class="margin-top"
                    title="带边框列表"
                    :column="1"
                    border
                  >
                    <template slot="extra">
                      <el-button type="primary" size="small">操作</el-button>
                    </template>
                    <el-descriptions-item label="品牌名称">{{
                      selectedProduct.brandName
                    }}</el-descriptions-item>
                    <el-descriptions-item label="库存SKU">{{
                      selectedProduct.stockSKU
                    }}</el-descriptions-item>
                    <el-descriptions-item label="SKU英文名">{{
                      selectedProduct.PEName
                    }}</el-descriptions-item>
                    <el-descriptions-item label="SKU中文名">{{
                      selectedProduct.PZName
                    }}</el-descriptions-item>
                    <el-descriptions-item
                      :label-style="{ width: '150px' }"
                      label="售前危机预防和培训"
                    >{{ selectedProduct.presaleRemark }}</el-descriptions-item>
                    <el-descriptions-item label="是否侵权">{{
                      selectedProduct.isTort
                    }}</el-descriptions-item>
                    <el-descriptions-item label="责任人">{{
                      selectedProduct.liability
                    }}</el-descriptions-item>
                    <el-descriptions-item label="预估尺寸 CM">{{
                      selectedProduct.Dimensions
                    }}</el-descriptions-item>
                    <el-descriptions-item label="电池">{{
                      selectedProduct.productType
                    }}</el-descriptions-item>
                    <el-descriptions-item label="开发估重 G">{{
                      selectedProduct.PWeight
                    }}</el-descriptions-item>
                    <el-descriptions-item label="商品成本">{{
                      selectedProduct.cost
                    }}</el-descriptions-item>
                    <el-descriptions-item label="特殊发货备注">{{
                      selectedProduct.remark
                    }}</el-descriptions-item>
                  </el-descriptions>
                  <span
                    slot="reference"
                    class="PZName"
                  >中文SKU: {{ selectedProduct.PZName }}</span>
                </el-popover>
              </div>
            </template>
          </div>
          <div class="search">
            <el-button
              type="primary"
              icon="el-icon-search"
              :loading="searchLoading"
              @click="search"
            >试算</el-button>
            <el-button
              type="primary"
              icon="el-icon-search"
              :loading="searchLoading"
              @click="reSet"
            >重置</el-button>
          </div>
          <div class="bottom" @click="showMoreOptions = !showMoreOptions">
            <i
              :class="
                showMoreOptions ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
              "
            />
            {{ showMoreOptions ? "收起选项" : "打开更多选项" }}
          </div>
        </div>
      </div>
      <div class="list-box">
        <ChannelListMobile
          :list="channels"
          :weight="unit === 'KG' ? Number(weight * 1000) : Number(weight)"
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
import channelList from './channelView'
import ChannelListMobile from './channelViewMobile'
import { getOil } from '@/utils/setOil'
import { isMobile } from '@/utils/isMobile'

export default {
  name: 'HomeView',
  components: { channelList, ChannelListMobile },
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
    channelTypes: [
      {
        label: '全部类型',
        channelType: null
      }
    ],
    channelType: null,
    stockSKU: '',
    selectedProduct: {},
    cardLoading: false,
    faHuo: '深圳',
    faHuoOptions: [{ value: '深圳' }],
    PEName: '',
    isMobile,
    showMoreOptions: false,
    isFirstShow: true // 是否第一次请求显示数据, 请求时为true, 排序时为false, 尝试阻止第二次计算价格
  }),
  watch: {
    unit: function(newVal) {
      if (newVal === 'G') {
        this.weight = this.weight * 1000
        // this.unit = 'G'
      } else {
        this.weight = this.weight / 1000
        // this.unit = 'KG'
      }
    }
  },
  created() {
    this.getChannelTypes()
  },
  methods: {
    countPrice() {
      // console.log('触发了排序')
    },
    reSet() {
      this.selectCountry = ''
      this.weight = 0
      this.long = ''
      this.wide = ''
      this.high = ''
      this.channelType = ''
      this.withElectricity = ''
      this.stockSKU = ''
      this.PEName = ''
    },
    async querySearchAsync(queryString, cb) {
      const res = await this.$store.dispatch(
        'products/getProductsListForIndex',
        { pageSize: 1000, pageIndex: 1, keywords: queryString }
      )
      const productList = []
      if (res.code !== 200) {
        productList.push({
          value: '服务器错误'
        })
      } else if (res.code === 200 && res.results.total === 0) {
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
    async querySearchAsyncPEName(queryString, cb) {
      const res = await this.$store.dispatch(
        'products/getProductsListForIndex',
        { pageSize: 1000, pageIndex: 1, PEName: queryString }
      )
      const productList = []
      if (res.code !== 200) {
        productList.push({
          value: '服务器错误'
        })
      } else if (res.code === 200 && res.results.total === 0) {
        productList.push({
          value: '无数据'
        })
      } else {
        for (const item of res.results.res) {
          item.value = item.PEName
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
      this.PEName = item.PEName
      this.stockSKU = item.stockSKU
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
        普货: '1',
        纯电: '2',
        带电: '3',
        带电带磁: '3'
      }
      if (
        !item.productType ||
        !['普货', '纯电', '带电', '带电带磁'].includes(item.productType)
      ) {
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
        this.weight = this.unit === 'G' ? item.PWeight : item.PWeight / 1000
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
      for (const item of res.results) {
        item.label = item.channelType
      }
      console.log(res.results)
      this.channelTypes = [
        {
          channelType: null,
          label: '全部类型'
        },
        ...res.results
      ] || ['获取类型失败']
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
      this.volume = arr.length === 3 ? arr[0] + (arr[1] + arr[2]) * 2 : 0
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
      this.LWH_arr = arr.sort((a, b) => {
        return b - a
      })
      this.channels = []
      this.getList(this.LWH_arr, this.volume)
    },
    async getList(LWH_arr, volume) {
      this.isFirstShow = true
      const data = {}
      data.country = this.selectCountry
      data.weight = this.unit === 'KG' ? this.weight * 1000 : this.weight
      data.LWH_arr = LWH_arr
      data.volume = volume
      data.withElectricity = this.withElectricity
      data.channelType = this.channelType
      data.oil = getOil()
      console.log(data)
      const res = await this.$store.dispatch('channel/getChannelList', data)
      console.log(res.results)
      this.channels = res.results || []
      // this.$message('1秒后自动排序')
      this.paiXu('price')
      this.searchLoading = false
    },
    paiXu(way) {
      if (way === 'price') {
        this.searchLoading = true
        const data = this.channels
        setTimeout(() => {
          this.isFirstShow = false
          data.sort(function(a, b) {
            return parseFloat(a.showInfo.totalPrice) >
              parseFloat(b.showInfo.totalPrice)
              ? 1
              : -1
          })
          console.log(data)
          this.$message('自动排序完成')
          this.searchLoading = false
        }, 1000)
      }
    }
  }
}
</script>

<style>
.select {
  width: 100%;
}
.select .box-card {
  display: flex;
  width: 100%;
}
.select .box-card .el-card__body {
  display: flex;
  flex-direction: row;
  width: 100%;
}
.select .box-card .el-card__body .item {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.select .box-card .el-card__body .item .row {
  display: flex;
  align-items: center;
}
.select .box-card .el-card__body .item .row .input-with-select {
  width: 200px;
  .el-input-group__append {
    .el-select {
      width: 68px;
    }
  }
}
.select .box-card .el-card__body .item .row .top-label {
  width: 130px;
}
.select .box-card .el-card__body .item .row .el-autocomplete {
  width: 300px;
}
.select .box-card .el-card__body .item .row .long-input {
  width: 100px;
}
.select .box-card .el-card__body .item .row .el-input__inner {
  padding: 0 5px;
}
.select .box-card .el-card__body .search {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 100px;
}
</style>

<style>
.mobile .top h1 {
  font-size: 0.2rem;
}
.mobile .select .box-card {
  width: 4rem;
  display: flex;
  flex-direction: column;
  border-radius: 0.06rem;
  box-shadow: 7px 7px 14px #cecece, -7px -7px 14px #f2f2f2;
  padding: 0.1rem;
  font-size: 0.16rem;
}
.mobile .select .box-card .search {
  width: 100%;
  height: 0.6rem;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}
.mobile .select .box-card .search button {
  margin: 0 0;
}
.mobile .select .box-card .item {
  display: block;
}
.mobile .select .box-card .bottom {
  text-align: center;
}
.mobile .select .box-card .item .every-div {
  width: 100%;
  height: 0.5rem;
  font-size: 0.16rem;
}
.mobile .select .box-card .item .every-div .el-autocomplete {
  height: 0.4rem;
  font-size: 16px;
}
.mobile .select .box-card .item .every-div p {
  font-size: 0.16rem;
}
</style>

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

/* .input-with-select {
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

.long-input >>> .el-input__inner {
  border-right: none;
}

.append-span {
  cursor: pointer;
  width: 70px;
}

.el-input-group__append {
  width: 70px;
}

.el-card__body {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
} */

.list-box {
  flex: 1;
  display: flex;
  margin-top: 20px;
  flex-direction: column;
  width: 100%;
  height: auto;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  border: 1px solid #ebeef5;
  background-color: #fff;
  overflow: hidden;
  color: #303133;
  transition: 0.3s;
  padding: 20px;
}
</style>

<style scoped>
/* .content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-bottom: 20px;
}

.box-card .search {
  width: 100px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.box-card .search button {
  margin: 0 0 16px 0;
}

.item {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
}
.every-div {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 302px;
  height: 40px;
} */
.PZName {
  width: 500px;
  display: -webkit-box; /* Safari */
  overflow: hidden;
  text-overflow: ellipsis;
  line-clamp: 2; /* 设置显示的最大行数为2行 */
  -webkit-line-clamp: 2; /* Safari and Chrome */
  -webkit-box-orient: vertical; /* Safari and Chrome */
}
</style>
