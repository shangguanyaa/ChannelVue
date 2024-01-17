<template>
  <div class="app-container">
    <div class="top">
      <el-card class="box-card">
        <el-button type="primary" icon="el-icon-plus" @click="bulkCreate">批量添加</el-button>
        <el-divider direction="vertical" />
        <el-input v-model="keywords" placeholder="请输入关键词" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" />
        </el-input>
      </el-card>
    </div>
    <div class="table">
      <el-table
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
          label="产品重量"
          width="100"
        />
        <el-table-column
          fixed="right"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleClick(scope.row)">查看</el-button>
            <el-button type="text" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <BulkCreate :drawer="bulkCreateDrawer" @close="bulkCreateClose" />
  </div>
</template>

<script>
import BulkCreate from './components/bulkcreate'

export default {
  components: {
    BulkCreate
  },
  data() {
    return {
      keywords: '',
      productsList: [],
      bulkCreateDrawer: false
    }
  },
  watch: {
  },
  mounted() {
    this.getProductsList()
  },
  methods: {
    async getProductsList() {
      const res = await this.$store.dispatch('products/getProductsList', { pageSize: 10, pageIndex: 1 })
      if (res.code === 200 && res.results.total !== 0) {
        this.productsList = res.results.res
      }
    },
    handleClick(val) {
      console.log(val)
    },
    bulkCreate() {
      this.bulkCreateDrawer = true
    },
    bulkCreateClose() {
      this.bulkCreateDrawer = false
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
.table {
  margin-top: 20px;
}
</style>

