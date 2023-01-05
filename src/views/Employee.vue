<template>
  <div>
    <div class="button-group">
      <el-button type="primary" @click="addUserDialogVisible=true">
        <el-icon style="margin-right:3px ">
          <CirclePlusFilled/>
        </el-icon>
        新增
      </el-button>
<!--      <el-button type="primary">-->
<!--        <el-icon style="margin-right:3px ">-->
<!--          <CirclePlusFilled/>-->
<!--        </el-icon>-->
<!--        批量导入-->
<!--      </el-button>-->
      <el-button type="danger" :disabled="deleteButtonShow" @click="deleteUser">
        <el-icon style="margin-right:3px">
          <DeleteFilled/>
        </el-icon>
        删除
      </el-button>
    </div>

    <div style="margin-left: 15px">
      <el-input v-model="search" placeholder="请输入关键字" style="width: 20%" clearable></el-input>
      <el-button type="primary" style="margin-left: 5px" @click="loadData">查询</el-button>
    </div>

    <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        style="width: 100%"
        max-height="500"
        @selection-change="handleSelectionChange"
        @filter-change="filterChange"
    >
      <el-table-column
          type="selection"
          width="55"
          fixed="left"
      >
      </el-table-column>
      <el-table-column sortable prop="userId" label="员工ID" align="center" width="100"/>
      <el-table-column prop="name" label="姓名" align="center" width="100"/>
      <el-table-column prop="gender" label="性别" align="center" width="100" :formatter="genderFormat"/>
      <el-table-column prop="idValid" label="员工有效期" align="center" width="240"/>
      <el-table-column prop="departmentName" label="员工部门" align="center" width="100"/>
      <el-table-column prop="proName" label="员工种类" align="center" width="100"/>
      <el-table-column prop="isDistributed" label="是否下发" align="center" width="100"
                       :filters="[{text:'已下发',value:1},{text:'未下发',value:0}]"
                       column-key="filterTag"
                       filter-placement="bottom-end"
      >
        <template #default="scope">
          <el-tag v-if="scope.row.isDistributed===0" type="warning">未下发</el-tag>
          <el-tag v-else-if="scope.row.isDistributed===1" type="success">已下发</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="电话号码" align="center" width="150"/>
      <el-table-column prop="idCard" label="身份证号" align="center" width="240"/>
      <el-table-column fixed="right" label="操作" align="center" width="300">
        <template #default="scope">
          <el-button link type="primary" size="small" @click="handleDetail(scope.row)">用户详情</el-button>
          <el-button link type="primary" size="small" @click="openSendDevice(scope.row)">已下发设备</el-button>
          <el-button link type="primary" size="small" @click="handleEdit(scope.row)">修改</el-button>
          <el-button link type="primary" size="small" @click="recogDetail(scope.row)">识别记录</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div>
      <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          :page-sizes="[10, 50, 100]"
          :small="small"
          :disabled="disabled"
          :background="background"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
      />
    </div>
    <add-user-dialog :addUserDialogVisible="addUserDialogVisible" @addDialogVisibleChange="addDialogVisibleChange"
                     @addSuccessVisibleChange="addSuccessVisibleChange"></add-user-dialog>
    <edit-user-dialog :editUserDialogVisible="editUserDialogVisible" :formRow="form" @editDialogVisibleChange="editDialogVisibleChange"
                     @editSuccessVisibleChange="editSuccessVisibleChange"></edit-user-dialog>
    <user-detail-dialog :detailDialogVisible="detailDialogVisible" :formRow="form" @detailDialogVisibleChange="detailDialogVisibleChange"></user-detail-dialog>

    <!--已下发设备列表-->
    <el-dialog
        v-model="deviceDialogVisible"
        :title="'【'+rowUserName+'】已下发设备列表'"
        width="50%"
        :before-close="deviceClose"
    >
      <el-table :data="deviceData"
                v-loading="deviceLoading"
                stripe
                style="width: 100%"
                @selection-change="handleSelectionChange"
      >
        <el-table-column sortable prop="devName" label="设备编号" align="center"/>
        <el-table-column
            prop="isOnline"
            label="是否在线"
            align="center"
            :filters="[{text:'在线',value:'在线'},{text:'离线',value:'离线'}]"
            :filter-method="filterOnline"
            filter-placement="bottom-end"
        >
<!--          <template #default="scope">-->
<!--            <el-tag-->
<!--                :type="scope.row.isOnline==='在线'?'success':'danger'"-->
<!--            >{{scope.row.isOnline}}</el-tag>-->
<!--          </template>-->

        </el-table-column>
        <el-table-column prop="deviceNickname" label="设备名称" align="center"/>
        <el-table-column prop="departmentName" label="部门名称" align="center"/>
        <el-table-column fixed="right" label="操作" width="100" align="center">
          <template #default="scope">
            <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-dialog>
<!--    识别记录-->
    <el-dialog
        v-model="recogDialogVisible"
        :title="'【'+rowUserName2+'】识别记录'"
        width="68%"
        :before-close="recogClose"
    >
      <el-table :data="recogData"
                v-loading="recogLoading"
                stripe
                style="width: 100%"
                @selection-change="handleSelectionChange"
      >
        <el-table-column sortable prop="deviceName" label="设备编号" align="center"/>
        <el-table-column prop="recogTime" label="识别时间" align="center"/>
        <el-table-column prop="confidence" label="相似度（％）" align="center"/>
        <el-table-column prop="bodyTemperature" label="体温数据（℃）" align="center"/>
        <el-table-column label="识别图片" align="center">
          <template #default="scope">
            <el-image
                style="width: 100px; height: 100px"
                :src="'http://localhost:8089/common/downloadRec?name='+scope.row.photo"
                :preview-src-list="['http://localhost:8089/common/downloadRec?name='+scope.row.photo]"
                fit="cover"
                preview-teleported="true">
            </el-image>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          :current-page="currentRecogPage"
          :page-size="pageRecogSize"
          :page-sizes="[10, 50, 100]"
          :small="small"
          :disabled="disabled"
          :background="background"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalRecog"
          @size-change="recogSizeChange"
          @current-change="recogCurrentChange"
      />
    </el-dialog>

  </div>
</template>

<script>
import request from "@/plugins/request";
import {CirclePlusFilled, DeleteFilled} from '@element-plus/icons-vue'
import AddUserDialog from "@/components/AddUserDialog";
import EditUserDialog from "@/components/EditUserDialog";
import UserDetailDialog from "@/components/UserDetailDialog";

export default {
  name: "Employee",
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      search: '',
      currentRecogPage:1,
      pageRecogSize: 10,
      totalRecog: 0,
      recogLoading:false,
      small: false,
      background: false,
      disabled: false,
      addUserDialogVisible: false,
      editUserDialogVisible: false,
      detailDialogVisible:false,
      recogDialogVisible:false,
      deleteButtonShow: true,
      loading:true,
      form:{},
      deviceDialogVisible:false,
      deviceLoading:false,
      deviceData:[],
      rowUserName:'',
      rowUserName2:'',
      rowUserId:-1,
      rowUserId2:-1,
      aFilter:undefined,
      recogData:[],
    }
  },
  components: {
    UserDetailDialog,
    AddUserDialog,
    EditUserDialog,
    CirclePlusFilled,
    DeleteFilled
  },

  methods: {
    filterChange(filters){
      console.log("filter",filters.filterTag)
      this.aFilter = filters.filterTag
      this.loadData()
    },
    filterDistributed(value,row){
      return row.isDistributed === value
    },
    filterOnline(value,row){
      return row.isOnline === value
    },
    openSendDevice(row) {
      this.deviceDialogVisible = true
      this.rowUserName = row.name
      this.rowUserId = row.userId
      console.log("调用根据员工id查询下发设备的接口")
      request.get('/belong/getDevById/'+row.userId).then(res=>{
        this.deviceData = res.data
      })

    },
    deviceClose(){
      this.deviceDialogVisible = false
      this.deviceData = []
      this.rowUserName = ''
      this.rowUserId = -1
    },
    handleDelete(row){
      console.log("调用删除（不删库）接口",row)
      let ids = [
        [this.rowUserId,row.devId]
      ]
      console.log("ids",ids)
      this.$confirm('此操作会将该人员从设备中删除，是否继续？','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).then(()=>{
        this.deviceLoading = true
        request.post('/employee/delsEmp',ids).then(res=>{
          request.get('/belong/getDevById/'+this.rowUserId).then(res=>{
            this.deviceData = res.data
            this.deviceLoading = false
            this.loadData()
          })
        }).catch(err=>{
          this.$message({
            message: err,
            type: 'error'
          })
          this.deviceLoading = false
        })
      }).catch(err => {
        this.$message({
          message: err,
          type: 'error'
        })
        this.deviceLoading = false
      })
    },
    genderFormat(row){
      if (row.gender === 0) {
        return '男'
      } else if (row.gender === 1) {
        return '女'
      }else return '未知'
    },
    statusFormat(row){
      if (row.isDistributed === 0) {
        return '未下发'
      } else if (row.isDistributed === 1) {
        return '已下发'
      }else return '未知'
    },
    loadData() {
      this.loading = true
      let aStatus = ""
      if (this.aFilter!==undefined) aStatus = this.aFilter.join(",")
      request.get('/employee/findPageByDistributed',{
        params:{
          pageNum:this.currentPage,
          pageSize:this.pageSize,
          search:this.search,
          status:aStatus
        }
      }).then(res => {
        console.log(res)
        this.loading = false
        this.tableData = res.data.records
        this.total = res.data.total
      })
      this.loading = false
    },
    handleDetail(row) {
      this.form = JSON.parse(JSON.stringify(row))
      this.detailDialogVisible = true
    },
    handleEdit(row) {
      this.form = JSON.parse(JSON.stringify(row))
      this.editUserDialogVisible = true
    },
    handleSizeChange(val) {
      console.log(`${val} items per page`)
      this.pageSize = val
      this.loadData()
    },
    handleCurrentChange(val) {
      console.log(`current page: ${val}`)
      this.currentPage = val
      this.loadData()
    },
    addDialogVisibleChange(val) {
      this.addUserDialogVisible = val
    },
    addSuccessVisibleChange(val) {
      this.addUserDialogVisible = val
      this.loadData()
    },
    editDialogVisibleChange(val) {
      this.editUserDialogVisible = val
    },
    editSuccessVisibleChange(val) {
      this.editUserDialogVisible = val
      this.loadData()
    },
    detailDialogVisibleChange(val) {
      this.detailDialogVisible = val
    },
    handleSelectionChange(val) {
      this.multipleSelection = JSON.parse(JSON.stringify(val))
      this.deleteButtonShow = this.multipleSelection.length <= 0;
    },
    // deleteUser() {
    //   this.$confirm('此操作将永久删除所选人员信息，是否继续？','提示',{
    //     confirmButtonText:'确定',
    //     cancelButtonText:'取消',
    //     type:'warning'
    //   }).then(async ()=>{
    //     for (let i = 0; i < this.multipleSelection.length; i++) {
    //       await request.delete('/employee/' + this.multipleSelection[i].userId).then(res => {
    //         console.log(res)
    //         if (res["code"] === 1) {
    //           this.$message({
    //             message:res.data,
    //             type:'success'
    //           })
    //         }
    //         else {
    //           this.$message.error({
    //             message:res.msg
    //           })
    //         }
    //       })
    //     }
    //     this.loadData()
    //   })
    // },
    deleteUser() {
      let ids = []
      for (let i = 0;i<this.multipleSelection.length;i++){
        ids.push(this.multipleSelection[i].userId)
      }
      this.$confirm('此操作将永久删除所选人员信息，是否继续？','提示',{
        confirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).then(()=>{
        request.post('/employee',ids).then(res => {
          console.log(res)
          if (res["code"] === 1) {
            this.$message({
              message:res.data,
              type:'success'
            })
            this.loadData()
          }
          else {
            this.$message.error({
              message:res.msg
            })
          }
        })
      })
    },
    loadRecogData(){
      this.recogLoading = true
      request.get("/attendance/findPageById",{
        params:{
          pageNum:this.currentRecogPage,
          pageSize:this.pageRecogSize,
          userId:this.rowUserId2
        }
      }).then(res=>{
        console.log("res",res)
        this.recogData = res.data.records
        this.totalRecog = res.data.total
        this.recogLoading = false
      }).catch(err=>{
        this.$message({
          message: err,
          type: 'error'
        })
        this.recogLoading = false
      })
      // this.recogData = [
      //   {
      //     deviceName:"ET11111",
      //     recogTime:'131313',
      //     confidence:95,
      //     bodyTemperature:36,
      //     photo:null
      //   }
      // ]
    },
    recogDetail(row) {
      console.log("row",row)
      this.rowUserName2 = row.name
      this.rowUserId2 = row.userId
      this.recogDialogVisible = true
      this.loadRecogData()
    },
    recogSizeChange(val) {
      console.log(`${val} items per page`)
      this.pageRecogSize = val
      this.loadRecogData()
    },
    recogCurrentChange(val) {
      console.log(`current page: ${val}`)
      this.currentRecogPage = val
      this.loadRecogData()
    },
    recogClose() {
      this.recogDialogVisible = false
      this.recogData = []
      this.rowUserName2 = ''
    },
  },
  created() {
    this.loadData()
  },
}

</script>

<style scoped>
.button-group {
  padding: 15px;
}

</style>