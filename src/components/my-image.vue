<template>
  <div class="container">
    <div class="btnImage" @click="open">
      <img :src="value||image" alt />
    </div>
    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogVisible" width="750px">
      <!-- 选项卡标签页 -->
      <el-tabs v-model="activeName" type="card">
        <!-- 素材库 -->
        <el-tab-pane label="素材库" name="image">
          <!-- 按钮样式的单选框组合  -->
          <el-radio-group @change="toggleList" v-model="reqParams.collect" size="small">
            <el-radio-button :label="false">全部</el-radio-button>
            <el-radio-button :label="true">收藏</el-radio-button>
          </el-radio-group>
          <!-- 素材列表 -->
          <div class="img_list">
            <div
              class="img_box"
              v-for="item in images"
              :key="item.id"
              @click="selectImage(item.url)"
              :class="{selected: selectedImageUrl === item.url}"
            >
              <img :src="item.url" />
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
        </el-tab-pane>
        <!-- 上传图片 -->
        <el-tab-pane label="上传图片" name="upload">
          <el-upload
            class="avatar-uploader"
            action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
            :headers="headers"
            :show-file-list="false"
            style="text-align: center;"
            :on-success="uploadImage"
            name="image"
          >
            <img v-if="uploadImageUrl" :src="uploadImageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmImage">确 定</el-button>
        <el-button @click="off">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import local from '../utils/local'
import images from '../assets/default.png'
export default {
  props: ['value'],
  data () {
    return {
      // 对话框显示隐藏
      dialogVisible: false,
      reqParams: {
        // false 全部  true 收藏
        collect: false,
        page: 1,
        per_page: 8
      },
      // 总条数
      total: 0,
      // 素材列表
      images: [],
      // 当前激活的选项卡name的值
      activeName: 'image',
      // 记录点击的图片
      selectedImageUrl: null,
      // 上传图片路径
      uploadImageUrl: null,
      // 设置请求头
      headers: {
        Authorization: `Bearer ${local.getUser().token}`
      },
      // 渲染图片
      image: images
    }
  },
  methods: {
    // 点击图片
    selectImage (url) {
      this.selectedImageUrl = url
    },
    // 对话框显示隐藏
    open () {
      this.dialogVisible = true
      this.getImages()
      this.imageUrl = null
      this.selectedImageUrl = null
    },
    // 切换全部收藏
    toggleList () {
      this.reqParams.page = 1
      this.getImages()
    },
    //
    handleClick (tab, event) {
      console.log(tab, event)
    },
    // 点击切换页面
    pager (newPage) {
      this.reqParams.page = newPage
      this.getImages()
    },
    // 获取素材
    async getImages () {
      const {
        data: { data }
      } = await this.$http.get('user/images', { params: this.reqParams })
      this.images = data.results
      // 赋值总条数
      this.total = data.total_count
    },
    // 上传图片
    uploadImage (response) {
      console.log(response)
      // 获取到的图片src赋值给this.imageUrl
      this.uploadImageUrl = response.data.url
    },
    // 上传图片
    confirmImage () {
      if (this.activeName === 'image') {
        this.image = this.selectedImageUrl
        this.dialogVisible = false
        this.$emit('input', this.image)
      } else {
        this.image = this.uploadImageUrl
        this.dialogVisible = false
        this.$emit('input', this.image)
      }
    },
    // 取消
    off () {
      this.dialogVisible = false
      this.selectedImageUrl = null
      this.uploadImageUrl = null
    }
  }
}
</script>

<style scoped lang='less'>
.container {
  margin-right: 20px;
  display: inline-block;
}
.btnImage {
  width: 150px;
  height: 150px;
  border: 1px dashed #ddd;
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
.img_list {
  padding-top: 30px;
  .img_box {
    width: 150px;
    height: 120px;
    border: 1px dashed #ccc;
    position: relative;
    display: inline-block;
    margin-right: 10px;
    margin-left: 13px;
    margin-bottom: 20px;
    img {
      width: 100%;
      height: 100%;
    }
    &.selected::after {
      content: "";
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background: rgba(0, 0, 0, 0.2) url("../assets/selected.png") no-repeat
        center / 50px;
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
.dialog-footer {
  text-align: center;
  width: 100%;
  display: block;
}
</style>
