<template>
  <div class="container-publish">
    <el-card>
      <!-- 面包屑导航 -->
      <div slot="header">
        <my-bread>{{$route.query.id?'修改文章':'发布文章'}}</my-bread>
      </div>
      <!-- 表单 -->
      <el-form label-width="120px">
        <el-form-item label="标题 : ">
          <el-input v-model="articleForm.title" style="width:400px"></el-input>
          <span> (请输入6个或6个以上字符)</span>
        </el-form-item>
        <el-form-item label="内容 : ">
          <quill-editor v-model="articleForm.content" :options="editorOption"></quill-editor>
        </el-form-item>
        <el-form-item label="封面 : ">
          <el-radio-group v-model="articleForm.cover.type" @change="changeClear">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <!-- 封面图组件 -->
          <div v-if="articleForm.cover.type===1">
            <my-image v-model="articleForm.cover.images[0]"></my-image>
          </div>
          <div v-if="articleForm.cover.type===3">
            <my-image v-for="i in 3" :key="i" v-model="articleForm.cover.images[i-1]"></my-image>
          </div>
        </el-form-item>
        <!-- 频道 -->
        <el-form-item label="频道 : ">
          <my-channel v-model="articleForm.channel_id"></my-channel>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item>
          <el-button type="primary" @click="submitArticle(false)" v-if="!$route.query.id">发布文章</el-button>
          <el-button type="primary" @click="edit($route.query.id)" v-if="$route.query.id">修改文章</el-button>
          <el-button @click="submitArticle(true)">存为草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
export default {
  components: {
    quillEditor
  },
  data () {
    return {
      articleForm: {
        title: null,
        content: null,
        cover: {
          images: [],
          type: 1
        },
        channel_id: null
      },
      editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            ['image']
          ]
        },
        placeholder: ''
      }
    }
  },
  watch: {
    // data = {a:{b:10}}  'a.b':function(){}
    // （只要是this能够获取到的数据）字段名称：function(newVal,oldVal){ //当数据改变就会执行  }
    '$route.query.id': function () {
      this.toggleArticleStatus()
    }
  },
  // 只有组件 初始化的时候，永远只会执行一次
  // 当路由规则没有发生改变时，组件是不会重新初始化的
  created () {
    this.toggleArticleStatus()
  },
  methods: {
    // 切换清空数据
    changeClear () {
      this.articleForm.cover.images = []
    },
    // 发布文章 存为草稿
    async submitArticle (draft) {
      await this.$http.post(`articles?draft=${draft}`, this.articleForm)
      // 提示
      this.$message.success(draft === false ? '发布成功' : '存为草稿')
      this.$router.push('/article')
    },
    // 获取指定文章信息
    async getArticles (id) {
      const {
        data: { data }
      } = await this.$http.get(`articles/${id}`)
      // 将文章内容渲染页面  面包屑文字   按钮文字
      this.articleForm = data
    },
    // 修改文章
    async edit (id) {
      await this.$http.put(`articles/${id}`, this.articleForm)
      this.$router.push('/article')
      this.$message.success('修改成功')
    },
    // 切换发布与修改
    toggleArticleStatus () {
      // 文章id
      const articleId = this.$route.query.id
      // 判断文章是否有id
      if (articleId) {
        // 获取指定文章信息
        this.getArticles(articleId)
      } else {
        // 重置数据 不能为空对象
        this.articleForm = {
          title: null,
          content: null,
          cover: {
            images: [],
            type: 1
          },
          channel_id: null
        }
      }
    }
  }
}
</script>

<style scoped lang='less'>
.el-input {
  width: 300px;
}
</style>
