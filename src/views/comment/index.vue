<template>
  <div class="container-comment">
    <el-card>
      <!-- 面包屑导航 -->
      <div slot="header">
        <my-bread>评论管理</my-bread>
      </div>
      <!-- 表格 -->
      <el-table :data="article">
        <el-table-column label="标题" width="400" prop="title"></el-table-column>
        <el-table-column label="总评论数" prop="total_comment_count"></el-table-column>
        <el-table-column label="粉丝评论数" prop="fans_comment_count"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">{{scope.row.comment_status?'正常':'关闭'}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="danger"
              v-if="scope.row.comment_status"
              @click="toggleStatus(scope.row.id,false)"
              size="small"
            >关闭评论</el-button>
            <el-button
              type="primary"
              v-else
              @click="toggleStatus(scope.row.id,true)"
              size="small"
            >打开评论</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        style="margin-top: 20px;"
        :page-size="reqParams.per_page"
        :current-page="reqParams.page"
        @current-change="pager"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      reqParams: {
        comment_status: null,
        total_comment_count: null,
        fans_comment_count: null,
        page: 1,
        // 每页条数
        per_page: 20,
        response_type: 'comment'
      },
      // 评论文章列表
      article: [],
      // 总条数
      total: 0
    }
  },
  methods: {
    // 获取评论信息
    async getComment () {
      const {
        data: { data }
      } = await this.$http.get('articles', { params: this.reqParams })
      this.article = data.results
      // 总条数
      this.total = data.total_count
    },
    // 分页
    pager (newPage) {
      // newPage这个参数是点击分页之后改变的页码
      this.reqParams.page = newPage
      this.getComment()
    },
    // 打开或关闭评论
    toggleStatus (id, status) {
      const text = status
        ? '您确定要打开评论吗?'
        : '您确认关闭评论吗，如果关闭用户将无法对该文章进行评论。'
      this.$confirm(text, '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const {
            data: { data }
          } = await this.$http.put(`comments/status?article_id=${id}`, {
            allow_comment: status
          })
          // 提示
          this.$message.success(
            data.allow_comment ? '打开评论成功' : '关闭评论成功'
          )
          // 更新当前列表
          this.getComment()
        })
        .catch(() => {})
    }
  },
  created () {
    this.getComment()
  }
}
</script>

<style scoped lang='less'>
</style>
