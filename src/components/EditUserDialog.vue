<template>
  <el-dialog
      v-model="dialogVisible"
      title="修改用户信息"
      width="40%"
      :before-close="handleDialogClose"
      @close="closeDialog"
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" :label-position='labelPosition' v-loading="loading">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" style="width: 90%"/>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="form.gender">
          <el-radio :label="0">男</el-radio>
          <el-radio :label="1">女</el-radio>
          <el-radio :label="2">未知</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="员工部门" prop="depId">
        <el-select v-model="form.depId" placeholder="请选择" style="width: 90%">
          <el-option
              v-for="item in groupOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="电话号码" prop="phone">
        <el-input v-model="form.phone" style="width: 90%"/>
      </el-form-item>
      <el-form-item label="身份证号码" prop="idCard">
        <el-input v-model="form.idCard" style="width: 90%"/>
      </el-form-item>
      <el-form-item label="有效期" prop="idValid">
        <el-date-picker
            v-model="form.idValid"
            type="datetime"
            format="YYYY-MM-DD HH:mm:ss"
            value-format = "YYYY-MM-DD HH:mm:ss"
            placeholder="置空则有效期永久"
            style="width: 90%">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="人脸照片">
        <el-upload
            class="upload-photo"
            ref="upload"
            action="http://localhost:8089/common/upload"
            list-type="picture"
            :on-remove="handleRemove"
            :on-change="handleChange"
            :on-success="handleUploadSuccess"
            :before-upload="handleBeforeUploaded"
            :file-list="fileList"
        >
          <template #trigger>
            <el-button type="primary">选择照片</el-button>
            <div class="el-upload__tip" style="margin-left: 20px">
              请上传jpg/png格式的照片，文件大小不超过500kb
            </div>
          </template>
        </el-upload>

      </el-form-item>

    </el-form>
    <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="submitForm('formRef')">
            保存
          </el-button>
<!--          <el-button @click="resetForm('formRef')">重置</el-button>-->
          <el-button @click="dialogVisible = false">取消</el-button>
        </span>
    </template>
  </el-dialog>
</template>

<script>
import request from "@/plugins/request";

export default {
  name: "EditUserDialog",
  props: ['editUserDialogVisible', 'formRow'],
  data() {
    return {
      loading:false,
      multipleSelection: [],
      dialogVisible: this.editUserDialogVisible,
      groupOptions: [],
      form: this.formRow,
      labelPosition: 'right',
      fileList: [],
      // limit:1,
      rules: {
        name: [
          {required: true, message: "请输入姓名", trigger: 'change'},
        ],
        gender: [
          {required: true, message: "请选择性别", trigger: 'change'},
        ],
        depId: [
          {required: true, message: '请选择员工组', trigger: 'change'}
        ],
      },
    }
  },
  methods: {
    loadData(){
      request.get("/department/all").then(res=>{
        this.groupOptions = res.data.map(item=>{
          return {value:item.depId,label:item.depName}
        })
      })

    },

    handleDialogClose() {
      this.form={}
      this.dialogVisible = false
      this.$refs.formRef.resetFields()
    },
    closeDialog() {
      this.$emit("editDialogVisibleChange", false)
      this.resetForm("formRef")
    },

    handleExceed(files, fileList) {
      this.$message.warning(`只能上传 ${this.limit} 张图片`);
    },
    handleChange(file, fileList) {
      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]] // 替换照片
      }
    },
    handleUploadSuccess(res) {
      this.form.faceTemplate = res.data
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      console.log('this.fileList',this.fileList)
      if (fileList.length === 0){
        this.form.faceTemplate = ''
      }
    },
    handleBeforeUploaded(file) {
      return this.$confirm(`确定上传 ${file.name}？`);
    },
    async submitForm(formName) {
      await this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log("edit", this.form)
          this.loading = true
          // if (this.form.faceTemplate){
          request.put("/employee/editEmp", this.form).then(res => {
            console.log(res)
            if (res['code'] === 1) {
              this.$message({
                type: "success",
                message: res.data
              })
              this.loading = false
              this.$emit("editSuccessVisibleChange", false)
            } else {
              this.$message({
                type: "error",
                message: "修改失败"
              })
              this.loading = false
              this.$emit("editDialogVisibleChange", false)
            }
          }).catch(err => {
            this.$message({
              message: "响应超时，请确认该员工的下发设备是否已连接",
              type: 'error'
            })
            this.loading = false
          })

        } else {
          console.log('修改校验失败')
        }
      })

    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$refs['upload'].clearFiles()
    },

  },
  watch: {
    editUserDialogVisible(newVal) {
      this.dialogVisible = newVal
    },
    formRow(newVal) {
      this.form = newVal
      if (this.form.faceTemplate){
        this.fileList = [{
          // name:this.form.faceTemplate,
          name:'当前上传成功的照片',
          url:'http://localhost:8089/common/download?name='+this.form.faceTemplate
        }]
      }
    }
  },
  created() {
    this.loadData()
  },
}
</script>

<style scoped>
.upload-photo {
}
</style>