<template>
  <div>
    <!-- 面包屑导航 -->
    <crumb v-bind:data="crumbData"></crumb>

    <!-- 卡片视图 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <span class="query-label">关键词：</span>
          <el-input
            placeholder="请输入文章关键词"
            clearable
            v-model="queryInfo.keyword"
          />
          <span class="query-label">标签：</span>
          <el-select v-model="queryInfo.tag" placeholder="请选择标签" clearable>
            <el-option
              v-for="item in tagsList"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>
          <span class="query-label">分类：</span>
          <el-select
            v-model="queryInfo.category"
            placeholder="请选择分类"
            clearable
          >
            <el-option
              v-for="item in catesList"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>
          <el-button type="primary" @click="handleSearch">检索</el-button>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addGoods">添加文章</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <CommonTable
        :tableData="articlesList"
        :tableTitle="tableTitle"
        :tableCol="tableCol"
        :pageConfig="queryInfo"
        :operator="operator"
        :total="total"
        @sizeChange="handleSizeChange"
        @pageChange="handleCurrentChange"
      ></CommonTable>
    </el-card>

    <!-- 删除对话框 -->
  </div>
</template>

<script>
import CommonTable from '../commons/CommonTable.vue'
import CommonModal from '../commons/CommonModal.vue'
export default {
  name: 'List',
  components: {
    CommonTable,
    CommonModal,
  },
  data() {
    return {
      queryInfo: {
        keyword: '',
        tag: '',
        category: '',
        page: 1,
        pageSize: 5,
      },
      articlesList: [],
      tagsList: [],
      catesList: [],
      total: 0,
      crumbData: ['首页', '文章管理', '文章列表'],
      tableTitle: {
        stripe: true,
        border: true,
      },
      tableCol: [
        { prop: 'title', label: '标题', width: '120' },
        { prop: 'tags', label: '标签', render: 'tags' },
        { prop: 'categories', label: '分类', render: 'tags' },
        { prop: 'viewCount', label: '浏览数', width: '100' },
        { prop: 'createdAt', label: '创建时间' },
        { prop: 'updatedAt', label: '修改时间' },
      ],
      operator: [
        {
          type: 'primary',
          icon: 'el-icon-edit',
          text: '编辑',
          click: (row) => {
            // TODO
          },
        },
        {
          type: 'danger',
          icon: 'el-icon-delete',
          text: '删除',
          click: (row) => {
            this.removeById(row.id)
          },
        },
      ],
      editDialogVisible: false,
      editForm: {
        goods_id: '',
        goods_name: '',
        goods_price: '',
        goods_goods_number: '',
        goods_weight: '',
      },
      editFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
      },
      formConfig: [
        { prop: 'title', label: '标题' },
        { prop: 'tags', label: '标签', render: 'tags' },
        { prop: 'categories', label: '分类', render: 'tags' },
        { prop: 'createdAt', label: '创建时间' },
        { prop: 'updatedAt', label: '修改时间' },
      ],
    }
  },
  methods: {
    async getArticlesList() {
      const { data: res } = await this.$http.get('article/list', {
        params: this.queryInfo,
      })
      this.articlesList = res.rows
      this.total = res.count
    },
    async getTagsList() {
      const { data } = await this.$http.get('tag/list', {
        params: this.queryInfo,
      })
      this.tagsList = data
    },
    async getCatesList() {
      const { data } = await this.$http.get('category/list', {
        params: this.queryInfo,
      })
      this.catesList = data
    },
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.getArticlesList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.page = newPage
      this.getArticlesList()
    },
    handleSearch() {
      this.getArticlesList()
    },
    async removeById(id) {
      const result = await this.$confirm(
        '此操作将永久删除该文章, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)

      if (result === 'confirm') {
        const res = await this.$http.delete(`article/${id}`)
        alert(JSON.stringify(res))
        // if (res.meta.status !== 200) return this.$message.error('商品删除失败')
        // this.$message.success('商品删除成功')
        this.getArticlesList()
        return
      }
      this.$message('已取消删除商品')
    },
    addGoods() {
      this.$router.push('/goods/add')
    },
    async editById(id) {
      // 根据id查询商品
      const { data: res } = await this.$http.get(`goods/${id}`)
      console.log(res)

      if (res.meta.status !== 200)
        return this.$message.error('获取商品信息失败')

      console.log(res.data)
      this.editForm = res.data
      console.log(this.editForm)

      this.editDialogVisible = true
    },
    editConfirm() {
      // 预验证
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return this.$message.error('表单验证失败，请重新填写表单')
        const { data: res } = await this.$http.put(
          `goods/${this.editForm.goods_id}`,
          this.editForm
        )
        console.log(res)

        if (res.meta.status !== 200)
          return this.$message.error('商品信息修改失败')
        this.$message.success('商品信息修改成功')
        this.editDialogVisible = false
        this.getArticlesList()
      })
    },
    change(originVal) {
      const dt = new Date(originVal)

      const y = dt.getFullYear()
      const m = (dt.getMonth() + 1 + '').padStart(2, '0')
      const d = (dt.getDate() + '').padStart(2, '0')

      const hh = (dt.getHours() + '').padStart(2, '0')
      const mm = (dt.getMinutes() + '').padStart(2, '0')
      const ss = (dt.getSeconds() + '').padStart(2, '0')
      return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    },
  },
  computed: {},
  created() {
    this.getArticlesList()
    this.getTagsList()
    this.getCatesList()
  },
}
</script>

<style lang="less" scoped>
.el-input {
  width: 350px !important;
}
</style>
