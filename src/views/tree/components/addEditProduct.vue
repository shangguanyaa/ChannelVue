<template>

  <div>
    <el-drawer
      :title="addType"
      :visible.sync="drawer"
      :direction="'rtl'"
      :before-close="handleClose"
      :size="500"
    >
      <div class="header">
        <el-form ref="form" class="form" :model="rowData" label-width="120px">
          <el-form-item label="库存SKU">
            <el-input v-model="rowData.stockSKU" />
          </el-form-item>
          <el-form-item label="品牌名称">
            <el-input v-model="rowData.brandName" />
          </el-form-item>
          <el-form-item label="整车/零件">
            <el-radio-group v-model="rowData.completeORpart">
              <el-radio :label="'整车'">整车</el-radio>
              <el-radio :label="'零部件'">零部件</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="产品英文名">
            <el-input v-model="rowData.PEName" />
          </el-form-item>
          <el-form-item label="产品中文名">
            <el-input v-model="rowData.PZName" />
          </el-form-item>
          <el-form-item label="产品长宽高">
            <el-input v-model="rowData.Dimensions" />
          </el-form-item>
          <el-form-item label="开发估重 G">
            <el-input v-model="rowData.PWeight" type="Number" />
          </el-form-item>
          <el-form-item label="成本价">
            <el-input v-model="rowData.cost" type="Number" />
          </el-form-item>
          <el-form-item label="发货前备注">
            <el-input v-model="rowData.presaleRemark" />
          </el-form-item>
          <el-form-item label="是否侵权">
            <el-radio-group v-model="rowData.isTort">
              <el-radio :label="'是'">是</el-radio>
              <el-radio :label="'否'">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="责任人">
            <el-input v-model="rowData.liability" />
          </el-form-item>
          <el-form-item label="电池">
            <el-select v-model="rowData.productType" placeholder="请选择">
              <el-option label="普货" value="普货" />
              <el-option label="纯电" value="纯电" />
              <el-option label="带电" value="带电" />
              <el-option label="带电带磁" value="带电带磁" />
            </el-select>
          </el-form-item>
          <el-form-item label="特殊发货备注">
            <el-input v-model="rowData.remark" type="textarea" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">确定</el-button>
            <el-button @click="handleClose">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
  </div>

</template>

<script>

export default {
  name: 'AddEditProduct',
  props: {
    drawer: {
      type: Boolean
    },
    type: {
      type: String,
      default: () => { '' }
    },
    row: {
      type: Object,
      default: () => { }
    }
  },
  data: () => ({
    rowData: {},
    addType: '新增产品'
  }),
  watch: {
    'drawer': function(newVal) {
      if (newVal) {
        this.addType = this.type === 'add' ? '新增产品' : '编辑产品'
        if (this.type === 'edit') {
          this.rowData = JSON.parse(JSON.stringify(this.row))
        } else {
          this.rowDataInit()
        }
      }
    }
  },
  methods: {
    rowDataInit() {
      this.rowData = {
        stockSKU: '',
        brandName: '',
        completeORpart: '整车',
        PEName: '',
        PZName: '',
        Dimensions: '0*0*0',
        PWeight: 0,
        cost: 0,
        presaleRemark: '',
        isTort: '否',
        liability: '',
        productType: '',
        remark: ''
      }
    },
    async onSubmit() {
      if (this.type === 'add') {
        const res = await this.$store.dispatch('products/addProducts', { rowData: this.rowData })
        if (res.code === 200) {
          this.$emit('close', true)
        }
      } else {
        const res = await this.$store.dispatch('products/updateProduct', {
          PID: this.rowData.PID,
          rowData: this.rowData
        })
        if (res.code === 200) {
          this.$emit('close', true)
        }
      }
    },
    async handleDelete(row) {
      console.log('delete')
    },
    handleClick(row) {
      console.log(row)
    },
    handleClose(done) {
      this.$emit('close', false)
    },
    async handleBulkCreate() {
      const res = await this.$store.dispatch('products/bulkCreate', { PList: this.tableData })
      if (res.code === 200) {
        this.$emit('close', true)
      }
    }

  }
}

</script>

<style scoped>
.header {
  width: 100%;
  padding: 0 20px;
}
.header {
  display: flex;
  justify-content: space-between;
}
.form {
  width: 100%;
}
</style>
