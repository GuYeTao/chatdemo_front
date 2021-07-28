<template>
  <div>
    <el-col :span="20" :offset="3">
      <el-header height="80px">
      <el-row>
        <el-col>
          <el-form :inline="true">
            <el-form-item label="订单Id">
              <el-input v-model="condition.orderId"  clearable @blur="loadOrders()" placeholder="订单id"></el-input>
            </el-form-item>
            <el-form-item label="订单状态">
              <el-select v-model="condition.orderState" clearable placeholder="请选择" @blur="loadOrders()">
                <el-option v-for="item in options" :key="item.orderState" :label="item.label" :value="item.orderState" ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="订单创建时间">
              <el-date-picker v-model="condition.timeRange" @blur="loadOrders()" type="datetimerange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right"></el-date-picker>
            </el-form-item>
            <el-button @click="loadOrders()" type="primary" icon="el-icon-search">查询</el-button>
          </el-form>
        </el-col>
      </el-row>
    </el-header>
    <el-table :data="userOrders" stripe>
      <el-table-column prop="orderId" label="订单编号" width="100"></el-table-column>
      <el-table-column prop="userName" label="下单人" width="100"></el-table-column>
      <el-table-column prop="userTel" label="下单人电话" width="200"></el-table-column>
      <el-table-column prop="addressUser" label="收货人" width="100"></el-table-column>
      <el-table-column prop="addressSite" label="收货地址" width="200"></el-table-column>
      <el-table-column prop="addressTel" label="收货人电话" width="200"></el-table-column>
      <el-table-column prop="orderCreateTime" label="订单创建时间" width="200"></el-table-column>
      <el-table-column label="操作" width="400">
      <template slot-scope="scope">
          <el-row :gutter="20">
            <el-col :span="6">
                <el-button type="primary"  @click="selectOrder(scope.row),orderDetailDialogVisible = true" >详情</el-button>
                <el-dialog title="订单详情"  v-if="orderDetailDialogVisible" :visible.sync="orderDetailDialogVisible" center modal modal-append-to-body>
                  <user-order-detail :orderId="orderId"></user-order-detail>
                </el-dialog>
            </el-col>
            <el-col :span="6">
                <div v-if="scope.row.orderState==3">
                    <el-button type="primary" @click="selectOrder(scope.row),toTransport()" >运单</el-button>
                </div>
            </el-col>
            <el-col :span="6">
                <div v-if="scope.row.orderState==1">
                    <el-button type="primary" @click="selectOrder(scope.row),openPay()" >支付</el-button>
                </div>
            </el-col>
          </el-row>
        </template>
    </el-table-column>
    </el-table>
    <el-row>
      <el-col :span="8" :offset="6">
        <el-pagination background layout="sizes, prev, pager, next, jumper" :page-size="page.rn" :page-sizes="[10, 20]" :total="page.total" @size-change="changePageSize" @current-change="changeCurrPage"></el-pagination>
      </el-col>
    </el-row>
        <el-dialog title="支付" :visible.sync="payDialogVisible" width="30%">
        <div style="float: right">
            共计{{this.sumpay}}元
        </div>
        <span slot="footer" class="dialog-footer">
            <el-select placeholder="请选择支付方式" v-model="payWayId" style="width: 100%;" clearable>
                <el-option v-for="item in payWay" :value="item.payWayId" :label="item.payWayType" :key="item.payWayId">
                </el-option>
            </el-select>
            <el-button @click="payDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="payDialogVisible = false, doPay()">支 付</el-button>
        </span>
    </el-dialog>
    </el-col>
</div>
</template>
<script>
import UserOrderDetail from '@/components/UserOrderDetail';
  export default {
    components:{UserOrderDetail},
    data() {
      return {
        userOrders: [],
        page: {
          total: 0,
          pn: 1,
          rn: 10
        },
        orderDetailDialogVisible:false,
        orderId:null,
        condition:{
          orderId:null,
          userId:null,
          orderState:null,
          timeRange: null,
        },
        options: [{
          orderState: 1,
          label: '待付款'
        }, {
          orderState: 2,
          label: '待发货'
        }, {
          orderState: 3,
          label: '待收货'
        }, {
          orderState: 4,
          label: '待评价'
        }, {
          orderState: 5,
          label: '已退货'
        }],
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        payDialogVisible: false,
        sumpay:null,
        userOrderDetails:[],
        payWay:[],
        payWayId:null,
        addPay:{
          userId:null,
          orderId:null,
          payWayId:null,
          payPrice:null,
          payTime:null,
        },
      }
    },
    methods: {
      loadOrders() {
        console.log(this.condition.timeRange);
        let params = {
          pn: this.page.pn,
          rn: this.page.rn
        }
        params.userId=localStorage.getItem("websocket_userId");//
        if(this.condition.orderId){
            params.orderId=this.condition.orderId;
        }
        if(this.condition.orderState){
            params.orderState=this.condition.orderState;
        }
        if(this.condition.timeRange){
            params.startTime=this.condition.timeRange[0];
            params.endTime=this.condition.timeRange[1];
        }
        console.log(params.startTime);
        console.log(params.endTime);
        this.ajax.request({
          url: '/userorder/find.action',
          params
        }).then((res) => {
          if (!res.data.code) {
            this.userOrders = res.data.result.userOrders;
            this.page.total = res.data.result.total;
          }
        })
      },
      selectOrder(userOrder){
          this.orderId = userOrder.orderId;
          localStorage.setItem("orderId",this.orderId);
      },
      toTransport(){
        this.$router.push({
          name: "UserTransport",
        });
      },
      changePageSize(size) {
        this.page.rn = size;
        this.loadOrders()
      },
      changeCurrPage(page) {
        this.page.pn = page;
        this.loadOrders()
      },
      openPay(){
        this.payDialogVisible = true;
        // 计算价格
        let params = {
          pn: this.page.pn,
          rn: this.page.rn,
          orderId:this.orderId,
        }
        this.ajax.request({
          url: '/userorderdetail/find.action',
          params
        }).then((res) => {
          if (!res.data.code) {
            this.userOrderDetails = res.data.result.userOrderDetails;
            this.page.total = res.data.result.total;
            this.sumpay = 0;
            for(let item in this.userOrderDetails){
              this.sumpay += this.userOrderDetails[item].gtotSaleNum*this.userOrderDetails[item].goodsPrice;
            }
          }
        });
        // 选择支付方式
        this.ajax
        .request({
          url: "/payway/find.action",
        })
        .then((res) => {
          if (!res.data.code) {
            this.payWay = res.data.result.payway;
          }
        });
      },
      doPay(){
        // 生成支付表
        if(this.payWayId==1||this.payWayId==2){
          const temptime = new Date().getTime();
          this.addPay.userId = localStorage.getItem("websocket_userId");
          this.addPay.orderId = this.orderId;
          this.addPay.payWayId = this.payWayId;
          this.addPay.payPrice = this.sumpay;
          this.addPay.payTime = new Date(temptime);
          let fd = new FormData();
          for (let prop in this.addPay) {
              fd.append(prop, this.addPay[prop]);
          }
          this.ajax
              .request({
              url: "/pay/add.action",
              data: fd,
              method: "post",
              })
              .then((res) => {
              if (!res.data.code) {
                  this.$message({
                  message: "支付成功",
                  type: "success",
                  });
              } else {
                  this.$message({
                  message: "支付失败",
                  type: "error",
                  });
              }
          });
        }
        else if(this.payWayId==3){
          let params = {
            userId:localStorage.getItem("websocket_userId"),
          };
          this.ajax.request({
            url: '/uservip/find.action',
            params,
          }).then((res) => {
            if(this.sumpay>res.data.result.data.vipremainder){
              this.$message({
                message: "余额不足",
                type: "error",  
              });
            }
            else{
              this.ajax.request({
              url: "/uservip/update.action",
              params:{
                  userId:localStorage.getItem("websocket_userId"),
                  vipremainder:res.data.result.data.vipremainder-this.sumpay,
              }
              }).then((res) => {
              if (!res.data.code) {
                  this.$message({
                  message: "扣款成功",
                  type: "success",  
                  });
                  this.loadUserCarts();
              } else {
                  this.$message({
                  message: "扣款失败",
                  type: "error",
                  });
              }
              });
              const temptime = new Date().getTime();
              this.addPay.userId = localStorage.getItem("websocket_userId");
              this.addPay.orderId = this.orderId;
              this.addPay.payWayId = this.payWayId;
              this.addPay.payPrice = this.sumpay;
              this.addPay.payTime = new Date(temptime);
              let fd = new FormData();
              for (let prop in this.addPay) {
                  fd.append(prop, this.addPay[prop]);
              }
              this.ajax
                  .request({
                  url: "/pay/add.action",
                  data: fd,
                  method: "post",
                  })
                  .then((res) => {
                  if (!res.data.code) {
                              // 修改order
                  this.ajax.request({
                      url: "/userorder/update.action",
                      params:{
                          orderId:this.orderId,
                          orderState:2,
                      }
                      }).then((res) => {
                      if (!res.data.code) {
                          this.loadOrders();
                          this.$message({
                          message: "修改成功",
                          type: "success",  
                          });
                      } else {
                          this.$message({
                          message: "修改失败",
                          type: "error",
                          });
                      }
                      });
                      this.$message({
                      message: "支付成功",
                      type: "success",
                      });
                  } else {
                      this.$message({
                      message: "支付失败",
                      type: "error",
                      });
                  }
              });
            }
          })
        }
        else{
          this.$message({
                message: "你还没有选择支付方式",
                type: "error",  
              });
        }
      },
    },
    created() {
      this.loadOrders()
    }
  }
</script>
<style>
</style>
