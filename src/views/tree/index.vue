<template>
  <div class="app-container">
    <div class="top">
      <el-card class="box-card">
        <div>
          <el-button type="primary" icon="el-icon-plus" @click="bulkCreate">批量添加</el-button>
          <el-button type="primary" icon="el-icon-plus" @click="addProduct">新增产品</el-button>
          <el-button type="primary" icon="el-icon-download" :loading="downloadTime" @click="downloadTem">下载模板文件</el-button>
        </div>
        <el-input v-model="keywords" placeholder="请输入库存SKU关键词" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="getProductsList" />
        </el-input>
      </el-card>
    </div>
    <div class="table">
      <el-table
        v-loading="loading"
        :data="productsList"
        border
        style="width: 100%"
      >
        <el-table-column
          fixed
          prop="stockSKU"
          label="库存SKU"
          width="250"
        />
        <el-table-column
          prop="brandName"
          label="品牌名称"
          width="150"
        />
        <el-table-column
          prop="PEName"
          label="产品英文名"
          width="220"
        />
        <el-table-column
          prop="PZName"
          label="产品中文名"
          width="300"
        />
        <el-table-column
          prop="Dimensions"
          label="产品尺寸"
          width="150"
        />
        <el-table-column
          prop="PWeight"
          label="开发估重 G"
          width="100"
        />
        <el-table-column
          prop="completeORpart"
          label="整车零部件"
          width="100"
        />
        <el-table-column
          prop="cost"
          label="商品成本"
          width="100"
        />
        <el-table-column
          prop="productType"
          label="电池"
          width="100"
        />
        <el-table-column
          prop="isTort"
          label="是否侵权"
          width="100"
        />
        <el-table-column
          prop="liability"
          label="责任人"
          width="100"
        />
        <el-table-column
          prop="presaleRemark"
          label="售前危机预防和培训"
          width="180"
        />
        <el-table-column
          prop="remark"
          label="特殊发货备注"
          width="180"
        />
        <el-table-column
          fixed="right"
          label="操作"
          width="120"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editProduct(scope.row)">编辑</el-button>
            <el-divider direction="vertical" />
            <el-popconfirm
              confirm-button-text="好的"
              cancel-button-text="不用了"
              icon="el-icon-info"
              icon-color="red"
              title="这是一段内容确定删除吗？"
              @confirm="handleDelete(scope.row)"
            >
              <el-button slot="reference" type="text" size="small">删除</el-button>
            </el-popconfirm>

          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :current-page="pageIndex"
      :page-size="pageSize"
      @current-change="currentChange"
    />
    <BulkCreate :drawer="bulkCreateDrawer" @close="bulkCreateClose" />
    <AddEditProduct
      :drawer="addEditDrawer"
      :row="editRow"
      :type="addOrEdit"
      @close="addEditClose"
    />
  </div>
</template>

<script>
import BulkCreate from './components/bulkcreate'
import AddEditProduct from './components/addEditProduct'

export default {
  components: {
    BulkCreate,
    AddEditProduct
  },
  data() {
    return {
      keywords: '',
      productsList: [],
      bulkCreateDrawer: false,
      addEditDrawer: false,
      addOrEdit: 'edit',
      editRow: {},
      loading: false,
      downloadTime: false,
      total: 5,
      pageIndex: 1,
      pageSize: 10
    }
  },
  watch: {
  },
  mounted() {
    this.getProductsList()
  },
  methods: {
    async getProductsList() {
      this.loading = true
      const res = await this.$store.dispatch('products/getProductsList', { pageSize: this.pageSize, pageIndex: this.pageIndex, keywords: this.keywords })
      if (res.code === 200 && res.results.total !== 0) {
        this.productsList = res.results.res
      }
      this.loading = false
    },
    currentChange(page) {
      this.pageIndex = page
      this.getProductsList()
    },
    downloadTem() {
      window.open('https://cloud.olbing.cn/Excel/%E6%89%B9%E9%87%8F%E6%B7%BB%E5%8A%A0%E4%BA%A7%E5%93%81%E6%A8%A1%E6%9D%BF_%E7%AC%AC%E4%B8%80%E8%A1%8C%E7%A6%81%E6%AD%A2%E5%88%A0%E9%99%A4_%E5%88%A0%E9%99%A4%E6%8E%89%E7%AC%AC2~5%E8%A1%8C%E6%95%B0%E6%8D%AE%E5%90%8E%E5%A1%AB%E5%85%A5.xlsx')
      this.downloadTime = true
      setTimeout(() => {
        this.downloadTime = false
      }, 10000)
    },
    handleClick(val) {
      console.log(val)
    },
    bulkCreate() {
      this.bulkCreateDrawer = true
    },
    async handleDelete(row) {
      // console.log(row)
      const res = await this.$store.dispatch('products/deleteProducts', {
        PidArr: [row.PID]
      })
      if (res.code === 200) {
        this.getProductsList()
      }
    },
    addEditClose(val) {
      this.addEditDrawer = false
      if (val) {
        this.getProductsList()
      }
    },
    addProduct() {
      this.addOrEdit = 'add'
      this.addEditDrawer = true
    },
    editProduct(row) {
      this.addOrEdit = 'edit'
      this.editRow = row
      this.addEditDrawer = true
    },
    bulkCreateClose(isCreated) {
      this.bulkCreateDrawer = false
      if (isCreated) {
        this.getProductsList()
      }
    }
  }
}
</script>

<style scoped>
.top {
  width: 100%;
}
.input-with-select {
  width: 200px;
}
.box-card {
  width: 100%;
}

.box-card >>> .el-card__body {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
}

.table {
  margin-top: 20px;
}
</style>

