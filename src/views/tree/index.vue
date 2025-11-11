<!--
 * @Author: SGuanyaa 1051158791@qq.com
 * @Date: 2025-05-29 09:32:37
 * @LastEditors: SGuanyaa 1051158791@qq.com
 * @LastEditTime: 2025-11-11 14:55:01
 * @FilePath: \ChannelVue\src\views\tree\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="app-container">
    <div class="top">
      <el-card class="box-card">
        <div>
          <el-button type="primary" icon="el-icon-plus" :disabled="!admin" @click="bulkCreate('insert')">批量添加</el-button>
          <el-button type="primary" icon="el-icon-plus" :disabled="!admin" @click="addProduct">新增产品</el-button>
          <el-button type="primary" icon="el-icon-download" :loading="downloadTime" :disabled="!admin" @click="downloadTem">下载模板文件</el-button>
          <el-button type="primary" icon="el-icon-edit-outline" :disabled="!admin" @click="bulkCreate('edit')">批量更新</el-button>
          <el-button type="primary" icon="el-icon-delete" :disabled="!admin" @click="dialogVisible = true">stockSKU批量删除</el-button>
        </div>
        <div>
          <el-button v-show="selectedPIDArr.length !== 0" type="primary" icon="el-icon-delete" :disabled="!admin" @click="bulkDestroy">批量删除</el-button>
          <el-input v-model="keywords" placeholder="请输入库存SKU关键词" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="getProductsList" />
          </el-input>
        </div>
      </el-card>
    </div>
    <div class="table">
      <el-table
        v-loading="loading"
        :data="productsList"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          fixed
          type="selection"
          width="55"
          :align="'center'"
        />
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
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="PZName"
          label="产品中文名"
          width="300"
          :show-overflow-tooltip="true"
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
          prop="referenceProfit"
          label="参考利润"
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
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="remark"
          label="特殊发货备注"
          width="180"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          fixed="right"
          label="操作"
          width="120"
        >
          <template slot-scope="scope">
            <el-button type="text" size="small" :disabled="!admin" @click="editProduct(scope.row)">编辑</el-button>
            <el-divider direction="vertical" />
            <el-popconfirm
              confirm-button-text="好的"
              cancel-button-text="不用了"
              icon="el-icon-info"
              icon-color="red"
              title="这是一段内容确定删除吗？"
              @confirm="handleDelete(scope.row)"
            >
              <el-button slot="reference" type="text" size="small" :disabled="!admin">删除</el-button>
            </el-popconfirm>

          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="bottom">
      <el-pagination
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100, 200, 500]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <el-button size="mini" :disabled="productsList.length === 0" @click="exportExcel">
        {{ selectedPIDArr.length !== 0 ? '导出选中数据' : '导出当前数据' }}
      </el-button>
    </div>
    <BulkCreate :drawer="bulkCreateDrawer" :type="bulkInsertOrBulkEdit" @close="bulkCreateClose" />
    <AddEditProduct
      :drawer="addEditDrawer"
      :row="editRow"
      :type="addOrEdit"
      @close="addEditClose"
    />

    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-input
        v-model="bulkStockSKUString"
        type="textarea"
        :rows="5"
        placeholder="请输入要删除的产品SKU，多个SKU可以用逗号、分号、空格或换行分隔"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="CancelBulkDeleteSKU">取 消</el-button>
        <el-button type="primary" @click="ConfirmBulkDeleteBySKU">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BulkCreate from './components/bulkcreate'
import AddEditProduct from './components/addEditProduct'
import { isAdmin } from '@/utils/auth'
// import XLSX from 'xlsx'
const XLSX = require('xlsx')
import { saveAs } from 'file-saver'

export default {
  components: {
    BulkCreate,
    AddEditProduct
  },
  data() {
    return {
      bulkInsertOrBulkEdit: 'insert',
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
      pageSize: 10,
      selectedPIDArr: [],
      selectedArr: [],
      admin: isAdmin(),
      bulkStockSKUString: '', // 根据 stockSKU 批量删除的字符串
      dialogVisible: false // 输入stockSKU 批量删除弹窗
    }
  },
  watch: {
  },
  mounted() {
    this.getProductsList()
    this.admin = isAdmin()
  },
  methods: {
    /**
     * @description: 通过 stockSKU 字符串转换为数组
     * @param {string} pasteText
     * @return {array}
     */
    handlePasteStockSKU(pasteText) {
      if (!pasteText || typeof pasteText !== 'string') {
        return []
      }

      // 使用正则表达式匹配各种分隔符：逗号、分号、空格、换行、制表符等
      const separators = /[,，;；\s\n\t|]+/

      // 分割字符串并处理每个元素
      const skuArray = pasteText
        .split(separators)
        .map(sku => sku.trim()) // 去除前后空格
        .filter(sku => {
        // 过滤空字符串和无效的SKU
          return sku && sku.length > 0
        })
        .filter((sku, index, self) => {
        // 去重
          return self.indexOf(sku) === index
        })

      console.log('处理后的SKU数组:', skuArray)
      return skuArray
    },
    // 通过 stockSKU 弹窗点击确认按钮
    async ConfirmBulkDeleteBySKU() {
      try {
        let loading = ''
        const pasteText = this.bulkStockSKUString
        console.log(pasteText)
        if (!pasteText) {
          this.$message.warning('请输入要删除的产品SKU')
          return
        }
        // 处理粘贴的文本
        const stockSKUArray = this.handlePasteStockSKU(pasteText)

        if (stockSKUArray.length === 0) {
          this.$message.warning('未识别到有效的产品SKU')
          return
        }
        loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        const res = await this.$store.dispatch('products/batchDeleteByStockSKU', {
          stockSKUArray
        })
        console.log(res)
        if (res.code === 200) {
          loading.close()
          this.CancelBulkDeleteSKU()
          this.getProductsList()
          this.$notify({
            title: '删除成功',
            type: 'success',
            message: `成功删除 ${res.data.deletedCount} 个产品`
          })
          if (res.data.nonExistingSKUs.length > 0) {
            const text = `未成功删除 ${res.data.nonExistingSKUs.join(',')} 这${res.data.nonExistingSKUs.length}个产品`
            this.$alert(text, '删除失败列表', {
              confirmButtonText: '确定'
            })
          }
        }
      } catch (error) {
        console.error('批量删除失败:', error)
        this.$message.error('批量删除失败')
      }
      console.log(this.handlePasteStockSKU(this.bulkStockSKUString))
    },
    // 根据 stockSKU 批量删除弹窗取消按钮
    CancelBulkDeleteSKU() {
      this.dialogVisible = false
      this.bulkStockSKUString = ''
    },
    async exportExcel() {
      try {
        // 1. 获取后端数据（示例为axios请求）

        // 2. 转换数据为Excel工作表
        const worksheet = XLSX.utils.json_to_sheet(this.selectedArr.length !== 0 ? this.selectedArr : this.productsList)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

        const fileName = `${this.getCurrentDateTime()}.xlsx`

        // 3. 生成文件并下载
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
        saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), fileName)
      } catch (error) {
        console.error('导出失败:', error)
      }
    },
    getCurrentDateTime() {
      const now = new Date()

      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')

      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    },
    async bulkDestroy() {
      let loading = ''
      if (this.selectedPIDArr.length === 0 || !Array.isArray(this.selectedPIDArr)) {
        this.$message({
          type: 'warning',
          message: '请选择需要删除的数据'
        })
        return
      }
      this.$confirm(`此操作将永久删除选中的 ${this.selectedPIDArr.length} 条数据, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await this.$store.dispatch('products/deleteProducts', {
          PidArr: this.selectedPIDArr
        })
        loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        if (res.code === 200) {
          loading.close()
          this.getProductsList()
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
        loading.close()
      })
    },
    handleSelectionChange(selectedArr) {
      console.log(selectedArr)
      this.selectedArr = selectedArr
      const selectedPIDArr = []
      for (const item of selectedArr) {
        selectedPIDArr.push(item.PID)
      }
      this.selectedPIDArr = selectedPIDArr
    },
    handleSizeChange(size) {
      this.pageSize = size
      this.getProductsList()
    },
    handleCurrentChange(index) {
      this.pageIndex = index
      this.getProductsList()
    },
    async getProductsList() {
      this.loading = true
      const res = await this.$store.dispatch('products/getProductsList', { pageSize: this.pageSize, pageIndex: this.pageIndex, keywords: this.keywords })
      if (res.code === 200 && res.results.total !== 0) {
        this.productsList = res.results.res
        this.total = res.results.total
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
    bulkCreate(type) {
      this.bulkInsertOrBulkEdit = type
      this.bulkCreateDrawer = true
      console.log(this.bulkInsertOrBulkEdit)
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
.app-container .bottom{
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
}
.top {
  width: 100%;
}
.input-with-select {
  width: 230px;
  margin-left: 16px;
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
  margin-bottom: 20px;
}
</style>

