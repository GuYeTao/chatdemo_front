<template>
  <div>
    <el-col :span="14" :offset="5">
      <el-header height="80px">
      <el-row>
        <el-col>
          <el-form :inline="true">
            <el-form-item label="运单Id">
              <el-input v-model="condition.transportId"  clearable @blur="loadOrders()" placeholder="运单id"></el-input>
            </el-form-item>
            <el-form-item label="订单Id">
              <el-input v-model="condition.orderId"  clearable @blur="loadOrders()" placeholder="订单id"></el-input>
            </el-form-item>
            <el-form-item label="运单状态">
              <el-select v-model="condition.transportState" clearable placeholder="请选择" @blur="loadOrders()">
                <el-option v-for="item in options" :key="item.transportState" :label="item.label" :value="item.transportState" ></el-option>
              </el-select>
            </el-form-item>
            <el-button @click="loadOrders()" type="primary" icon="el-icon-search">查询</el-button>
          </el-form>
        </el-col>
      </el-row>
    </el-header>
    <el-table :data="userOrders" stripe>
      <el-table-column prop="transportId" label="运单编号" width="100"></el-table-column>
      <el-table-column prop="riderName" label="骑手" width="100"></el-table-column>
      <el-table-column prop="addressUser" label="收货人" width="100"></el-table-column>
      <el-table-column prop="addressSite" label="收货地址" width="200"></el-table-column>
      <el-table-column prop="addressTel" label="收货人电话" width="200"></el-table-column>
      <el-table-column label="操作" width="200">
      <template slot-scope="scope">
          <el-row :gutter="20">
            <el-col :span="12">
                <el-button type="primary"  @click="selectOrder(scope.row),transportDetailDialogVisible = true" >详情</el-button>
                <el-dialog title="运单详情"  v-if="transportDetailDialogVisible" :visible.sync="transportDetailDialogVisible" center modal modal-append-to-body>
                    <user-transport-detail :transportId="transportId"></user-transport-detail>
                </el-dialog>
            </el-col>
            <el-col :span="12">
                <div v-if="scope.row.transportState==0">
                    <el-button type="primary" @click="selectOrder(scope.row),openMap(scope.row),mapDetailDialogVisible = true" >物流</el-button>
                    <el-dialog title="物流详情"  v-if="mapDetailDialogVisible" :visible.sync="mapDetailDialogVisible" center modal modal-append-to-body>
                      <user-map-detail></user-map-detail>
                    </el-dialog>
                </div>
            </el-col>
          </el-row>
        </template>
    </el-table-column>
    </el-table>
    <el-row>
      <el-col :span="10" :offset="6">
        <el-pagination background layout="sizes, prev, pager, next, jumper" :page-size="page.rn" :page-sizes="[10, 20]" :total="page.total" @size-change="changePageSize" @current-change="changeCurrPage"></el-pagination>
      </el-col>
    </el-row>
    </el-col>
</div>
</template>
<script>
import UserTransportDetail from '@/components/UserTransportDetail';
import UserMapDetail from '@/components/UserMapDetail';
  export default {
    components:{UserTransportDetail,UserMapDetail},
    data() {
      return {
        userOrders: [],
        page: {
          total: 0,
          pn: 1,
          rn: 10
        },
        transportDetailDialogVisible:false,
        mapDetailDialogVisible:false,
        transportId:null,
        condition:{
          transportId:null,
          orderId:null,
          userId:null,
          transportState:null
        },
        options: [{
          transportState: 1,
          label: '已送达'
        }, {
          transportState: 0,
          label: '配送中'
        }],
      }
    },
    methods: {
      loadOrders() {
        let params = {
          pn: this.page.pn,
          rn: this.page.rn
        }
        params.userId=localStorage.getItem("websocket_userId");//
        if(this.condition.transportId){
            params.transportId=this.condition.transportId;
        }
        if(this.condition.orderId){
            params.orderId=this.condition.orderId;
        }
        if(this.condition.transportState!=null){
            params.transportState=this.condition.transportState;
        }
        this.ajax.request({
          url: '/usertransport/find.action',
          params
        }).then((res) => {
          if (!res.data.code) {
            this.userOrders = res.data.result.userOrders;
            this.page.total = res.data.result.total;
          }
        })
      },
      selectOrder(userOrder){
          this.transportId = userOrder.transportId;
      },
      changePageSize(size) {
        this.page.rn = size;
        this.loadOrders()
      },
      changeCurrPage(page) {
        this.page.pn = page;
        this.loadOrders()
      },
      openMap(row){
        localStorage.setItem("addressSite",row.addressSite);
      },
    },
    created() {
      this.condition.orderId = localStorage.getItem("orderId");
      this.loadOrders()
    }
  }
</script>
<style>
</style>
