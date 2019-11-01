<template>
  <div class="container-article">
    <el-card slot="header">
      <div slot="header">
        <my-bread>内容管理</my-bread>
      </div>
      <!-- 表单 -->
      <el-form label-width="80px" size="small">
        <el-form-item label="状态 :">
          <el-radio-group v-model="reqParams.status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 频道 -->
        <el-form-item label="频道 :">
          <my-channel v-model="reqParams.channel_id"></my-channel>
        </el-form-item>
        <el-form-item label="日期 :">
          <el-date-picker
              v-model="dateArr"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="changeDate"
              value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="search">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top: 20px;">
      <div slot="header">
        <span>根据筛选条件共查询到 {{totle}} 条结果：</span>
      </div>
      <el-table :data="articles">
        <el-table-column label="封面">
          <template slot-scope="scope">
            <el-image :src="scope.row.cover.images[0]" fit="fill"  style="width:150px;height:100px;">
              <div slot="error" >
                <img src="../../assets/error.gif"  style="width:150px;height:100px;">
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="标题" prop="title"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status===0" type="info">草稿</el-tag>
            <el-tag v-if="scope.row.status===1">待审核</el-tag>
            <el-tag v-if="scope.row.status===2" type="success">审核通过</el-tag>
            <el-tag v-if="scope.row.status===3" type="warning">审核失败</el-tag>
            <el-tag v-if="scope.row.status===4" type="danger">已删除</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" prop="pubdate"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle plain @click="toEdit(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" circle plain @click="deleteArticle(scope.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totle"
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
        status: null,
        channel_id: null,
        begin_pubdate: null,
        end_pubdate: null,
        page: 1,
        // 每页条数
        per_page: 20
      },
      // 下拉列表选项
      options: [],
      // 时间
      dateArr: [],
      // 文章列表
      articles: [],
      // 文章总条数
      totle: 0

    }
  },
  methods: {
    // async getOptions () {
    //   const { data: { data } } = await this.$http.get('channels')
    //   this.options = data.channels
    // },
    async getArticles () {
      const { data: { data } } = await this.$http.get('articles', { params: this.reqParams })
      // 给文章列表赋值
      this.articles = data.results
      // 给文章条数赋值
      this.totle = data.total_count
    },
    pager (newPage) {
      // newPage这个参数是当前改变后的页码
      this.reqParams.page = newPage
      this.getArticles()
    },
    // 选择日期触发的函数
    changeDate (dateArr) {
      // dateArr 的数据格式：[date,date]
      // 后端需要的是字符串格式   dateArr 的数据格式：[string,string]
      // 注意：清除选择的日期后  dateArr的值 null
      if (dateArr) {
        this.reqParams.begin_pubdate = dateArr[0]
        this.reqParams.end_pubdate = dateArr[1]
      } else {
        this.reqParams.begin_pubdate = null
        this.reqParams.end_pubdate = null
      }
    },
    search () {
      // 如果频道的值 '' 时候 修改为 null
      if (this.reqParams.channel_id === '') this.reqParams.channel_id = null
      // 回到第一页
      this.reqParams.page = 1
      // 重新渲染页面
      this.getArticles()
    },
    // 去发布文章页面 修改文章
    toEdit (id) {
      this.$router.push({ path: '/publish', query: { id } })
    },
    // 点击删除文章
    async deleteArticle (id) {
      await this.$http.delete(`articles/${id}`)
      this.$message.success('删除成功')
      // 重新渲染页面
      this.getArticles()
    }
  },
  // 在页面渲染时调用
  created () {
    // this.getOptions()
    this.getArticles()
  }
}
</script>

<style scoped lang='less'>
</style>
