<template>
  <el-dialog
      v-model="dialogVisible"
      title="用户详情"

      @close="closeDialog"
  >

    <div class="all">
      <div class="text_information">
        <div>
          <div class="title">员工ID</div>
          <div class="content">{{ form.userId }}</div>
        </div>
        <div>
          <div class="title">姓名</div>
          <div class="content">{{ form.name }}</div>
        </div>
        <div>
          <div class="title">性别</div>
          <div class="content">{{ form.gender }}</div>
        </div>
        <div>
          <div class="title">员工组</div>
          <div class="content">{{ form.group }}</div>
        </div>
        <div>
          <div class="title">电话号码</div>
          <div class="content">{{ form.phone }}</div>
        </div>
        <div>
          <div class="title">员工有效期</div>
          <div class="content">{{ form.idValid }}</div>
        </div>
        <div>
          <div class="title">身份证号码</div>
          <div class="content">{{ form.idCard }}</div>
        </div>
      </div>
      <div class="img_information">
        <el-image
            style="width: 220px; height: 335px"
            :src="'http://localhost:8089/common/download?name='+form.faceTemplate"
            :fit="fit"></el-image>
      </div>
    </div>


  </el-dialog>
</template>

<script>
export default {
  name: "userDetailDialog",
  props: ['detailDialogVisible', 'formRow'],
  data() {
    return {
      dialogVisible: this.detailDialogVisible,
      form: this.formRow,
      fit: 'fill'
    }
  },
  methods: {
    closeDialog() {
      this.$emit("detailDialogVisibleChange", false)
    },

  },
  watch: {
    detailDialogVisible(newVal) {
      this.dialogVisible = newVal
    },
    formRow(newVal) {
      this.form = newVal
    }
  }

}
</script>

<style scoped>
.all {
  display: flex;
}

.title {
  font-weight: bold;
  width: 100px;
  display: inline-block;
  text-align: right;
  padding-bottom: 4vh;
}

.content {
  width: 250px;
  display: inline-block;
  margin-left: 20px;
}

.text_information {
  display: flex;
  flex-direction: column;
}

.img_information {
  width: auto;
}
</style>