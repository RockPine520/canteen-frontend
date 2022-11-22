<template>
  <el-dialog
      v-model="dialogVisible"
      title="新增用户"
      width="40%"
      :before-close="handleDialogClose"
      @close="closeDialog"
  >
    <el-form :model="form" :rules="rules" ref="formRef" label-width="120px" :label-position='labelPosition'>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="form.name" style="width: 90%"/>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model="form.gender">
          <el-radio label="男" :value="1"></el-radio>
          <el-radio label="女"></el-radio>
          <el-radio label="未知"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="员工组" prop="group">
        <el-select v-model="form.group" placeholder="请选择" style="width: 90%">
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
            :before-upload="handleBeforeUploaded"
            :on-success="handleUploadSuccess"
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
          <el-button @click="resetForm('formRef')">重置</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </span>
    </template>
  </el-dialog>
</template>

<script>
import request from "@/plugins/request";

export default {
  name: "AddUserDialog",
  props: ['addUserDialogVisible'],
  data() {
    return {
      multipleSelection: [],
      dialogVisible: this.addUserDialogVisible,
      photoVisible: false,
      photoUrl: '',
      groupOptions: [
        {
          value: '1',
          label: '山明'
        },
        {
          value: '2',
          label: '益新'
        },
        {
          value: '3',
          label: '尔美'
        }
      ],
      form: {
        name: '',
        group: '',
        phone: '',
        idCard: '',
        gender: '',
        idValid: '',
        faceTemplate: '',
      },
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
        group: [
          {required: true, message: '请选择员工组', trigger: 'change'}
        ],
      },
    }
  },
  methods: {
    handleUploadSuccess(res) {
      // const baseurl = 'http://localhost:8089/common/download?name='
      this.form.faceTemplate = res.data
    },
    handleDialogClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {
          });
    },
    closeDialog() {
      this.$emit("addDialogVisibleChange", false)
      this.resetForm("formRef")
    },

    handleExceed(files, fileList) {
      this.$message.warning(`只能上传 ${this.limit} 张图片`);
    },
    handleChange(file, fileList) {
      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]]
      }
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleBeforeUploaded(file) {
      return this.$confirm(`确定上传 ${file.name}？`);
    },
    async submitForm(formName) {
      await this.$refs[formName].validate((valid) => {
        if (valid) {
          request.post("/employee/addEmp", this.form).then(res => {
            console.log(res)
            if (res['code'] === 1) {
              this.$message({
                type: "success",
                message: "新增成功"
              })
              this.$emit("addSuccessVisibleChange", false)
            } else {
              this.$message({
                type: "error",
                message: "新增失败"
              })
              this.$emit("dialogVisibleChange", false)
            }
          })
        } else {
          console.log('新增校验失败')
        }
      })

    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$refs['upload'].clearFiles()
    },

  },
  watch: {
    addUserDialogVisible(newVal) {
      this.dialogVisible = newVal
    },
  },
}
</script>

<style scoped>

</style>