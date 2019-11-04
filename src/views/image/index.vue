<template>
  <div class="container-image">
    <el-card>
      <!-- 面包屑导航 -->
      <div slot="header">
        <my-bread>素材管理</my-bread>
      </div>
      <div class="btn_box">
        <!-- 按钮样式的单选框组合  -->
        <el-radio-group @change="toggleList" v-model="reqParams.collect" size="small">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <!-- 添加按钮 -->
        <el-button @click="open" style="float:right;" type="success" size="small">添加素材</el-button>
      </div>
      <!-- 素材列表 -->
      <div class="img_list">
        <div class="img_box" v-for="item in images" :key="item.id">
          <img :src="item.url" />
          <div class="footer" v-if="!reqParams.collect">
            <span
              @click="toggleStatus(item)"
              class="el-icon-star-off"
              :class="{red:item.is_collected}"
            ></span>
            <span @click="delImage(item.id)" class="el-icon-delete"></span>
          </div>
        </div>
      </div>
      <!-- 分页 -->
      <el-pagination
        style="text-align: center"
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="reqParams.per_page"
        :current-page="reqParams.page"
        @current-change="pager"
      ></el-pagination>
      <!-- 添加素材组件 -->
      <el-dialog title="添加图片" width="20%" :visible.sync="dialogVisible">
        <span>
          <el-upload
            class="avatar-uploader"
            action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
            :headers="headers"
            :show-file-list="false"
            style="text-align: center;"
            :on-success="updataImage"
            name="image"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import local from '../../utils/local'
export default {
  data () {
    return {
      reqParams: {
        // false 全部  true 收藏
        collect: false,
        page: 1,
        per_page: 10
      },
      // 总条数
      total: 0,
      // 素材列表
      images: [],
      // 对话框显示隐藏
      dialogVisible: false,
      // 图片路径
      imageUrl: null,
      // 设置请求头
      headers: {
        Authorization: `Bearer ${local.getUser().token}`
      }
    }
  },
  methods: {
    // 获取素材
    async getImages () {
      const {
        data: { data }
      } = await this.$http.get('user/images', { params: this.reqParams })
      this.images = data.results
      // 赋值总条数
      this.total = data.total_count
    },
    // 点击切换页面
    pager (newPage) {
      this.reqParams.page = newPage
      this.getImages()
    },
    // 切换全部收藏
    toggleList () {
      this.reqParams.page = 1
      this.getImages()
    },
    // 添加收藏&取消收藏
    async toggleStatus (item) {
      // 发送请求
      const {
        data: { data }
      } = await this.$http.put(`user/images/${item.id}`, {
        collect: !item.is_collected
      })
      // 改变状态
      item.is_collected = data.collect
      // 温馨提示
      this.$message.success((data.collect ? '添加收藏' : '取消收藏') + '成功')
    },
    // 删除图片
    delImage (id) {
      this.$confirm('确定要删除此图片吗？', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await this.$http.delete(`user/images/${id}`)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getImages()
        })
        .catch(() => {
          // 取消不做任何操作
        })
    },
    // 上传图片
    updataImage (response) {
      // 获取到的图片src赋值给this.imageUrl
      this.imageUrl = response.data.url
      window.setTimeout(() => {
        // 隐藏对话框
        this.dialogVisible = false
        // 页数跳转到第一页
        this.reqParams.page = 1
        // 重新渲染页面
        this.getImages()
      }, 2000)
    },
    open () {
      this.dialogVisible = true
      this.imageUrl = null
    }
  },
  created () {
    this.getImages()
  }
}
</script>

<style scoped lang='less'>
.img_list {
  padding-top: 30px;
  .img_box {
    width: 180px;
    height: 180px;
    border: 1px dashed #ccc;
    position: relative;
    display: inline-block;
    margin-right: 60px;
    margin-bottom: 20px;
    img {
      width: 100%;
      height: 100%;
    }
    .footer {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 30px;
      line-height: 30px;
      background: rgba(0, 0, 0, 0.2);
      width: 100%;
      text-align: center;
      color: #fff;
      span {
        margin: 0 20px;
        &.red {
          color: red;
        }
      }
    }
  }
}
</style>
