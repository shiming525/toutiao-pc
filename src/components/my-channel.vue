<template>
      <el-select :value="value" @change="fn" clearable placeholder="请选择">
      <el-option
        v-for="item in options"
        :key="item.id"
        :label="item.name"
        :value="item.id">
      </el-option>
    </el-select>
</template>

<script>
export default {
  props: ['value'],
  data () {
    return {
      options: []
    }
  },
  created () {
    this.getOptions()
  },
  methods: {
    async getOptions () {
      const { data: { data } } = await this.$http.get('channels')
      this.options = data.channels
    },
    fn (channelId) {
      if (channelId === '') channelId = null
      this.$emit('input', channelId)
    }
  }
}
</script>

<style scoped lang='less'></style>
