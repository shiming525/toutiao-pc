<template>
  <div class="container-setting">
    <el-card>
      <!-- 面包屑导航 -->
      <div slot="header">
        <my-bread>个人设置</my-bread>
      </div>
      <!-- 布局 -->
      <el-row>
        <el-col :span="12">
          <div>
            <el-form label-width="120px" ref="userInfo" :rules="rules" :model="userInfo">
              <el-form-item label="编号：" prop="id">
                <span>{{userInfo.id}}</span>
              </el-form-item>
              <el-form-item label="手机号：" prop="mobile">
                <span>{{userInfo.mobile}}</span>
              </el-form-item>
              <el-form-item label="媒体名称：" prop="name">
                <el-input v-model="userInfo.name"></el-input>
              </el-form-item>
              <el-form-item label="媒体介绍：" prop="intro">
                <el-input type="textarea" :rows="3" v-model="userInfo.intro"></el-input>
              </el-form-item>
              <el-form-item label="邮箱：" prop="email">
                <el-input v-model="userInfo.email"></el-input>
              </el-form-item>
              <el-button
                type="primary"
                style="margin-left:120px;"
                size="small"
                @click="saveSetting('userInfo')"
              >保存设置</el-button>
            </el-form>
          </div>
        </el-col>
        <el-col :span="12">
          <div style="text-align: center;">
            <el-upload
              class="avatar-uploader"
              :show-file-list="false"
              action=''
              style="text-align: center;"
              :http-request="updataImages"
            >
              <img v-if="userInfo.photo" :src="userInfo.photo" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>

            <p>修改头像</p>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import local from '@/utils/local'
import eventBus from '@/api/eventBus'
export default {
  data () {
    return {
      userInfo: {
        name: null,
        intro: null,
        email: null,
        photo: null
      },
      // 验证
      rules: {
        name: [
          { required: true, message: '媒体名称', trigger: 'blur' },
          { min: 3, max: 6, message: '长度在 3 到 6 个字符', trigger: 'blur' }
        ],
        intro: [
          { required: true, message: '媒体介绍', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change']
          }
        ]
      }
    }
  },
  created () {
    this.getUserIfon()
  },
  methods: {
    async getUserIfon () {
      const {
        data: { data }
      } = await this.$http.get('user/profile')
      this.userInfo = data
    },
    // 上传图片
    async updataImages ({ file }) {
      const formData = new FormData()
      formData.append('photo', file)
      const { data: { data } } = await this.$http.patch('user/photo', formData)
      // 提示
      this.$message.success('修改头像成功')
      // 预览
      this.userInfo.photo = data.photo
      // 获取存储的用户信息
      const userPhoto = local.getUser()
      // 更新本地存储的信息
      userPhoto.photo = data.photo
      // 再设置本地存储
      local.setUser(userPhoto)
      eventBus.$emit('editUserIPhoto', data.photo)
    },
    // 保存设置
    saveSetting (formData) {
      this.$refs[formData].validate(valid => {
        if (valid) {
          const { name, intro, email } = this.userInfo
          this.$http.patch('user/profile', { name, intro, email })
          this.$message.success('保存设置成功')
          // 获取存储的用户信息
          const userName = local.getUser()
          // 更新本地存储的信息
          userName.name = name
          // 再设置本地存储
          local.setUser(userName)
          eventBus.$emit('editUserName', name)
        } else {
        }
      })
    }
  }
}
</script>

<style scoped lang='less'></style>
