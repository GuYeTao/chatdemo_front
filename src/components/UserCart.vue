<template>
  <div>
    <el-col :span="14" :offset="5">
      <el-header>
        <span>购物车</span>
      </el-header>
      <el-table :data="userCarts" ref="multipleTable" stripe>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="商品图片" width="100">
          <template slot-scope="scope">
            <el-image width="100px" fit="cover" :src="url(scope.row.goodsPicture)">
              <div slot="error" class="image-slot">
                <p prop="goodsPicture"></p>
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="goodsName" label="商品名" width="100"></el-table-column>
        <el-table-column prop="goodsPrice" label="单价" width="100"></el-table-column>
        <el-table-column prop="cartNum" label="数量" width="100"></el-table-column>
        <el-table-column label="商品总价" :formatter="Formatter" width="100"></el-table-column>
        <el-table-column label="操作" width="400">
        <template slot-scope="scope">
            <el-row :gutter="24">
              <el-col :span="6">
                  <el-button type="primary"  @click="selectOrder(scope.row),subGoods(scope.row)" >-</el-button>
              </el-col>
              <el-col :span="6">
                  <el-button type="primary"  @click="selectOrder(scope.row),addGoods(scope.row)" >+</el-button>
              </el-col>
              <el-col :span="6">
                  <el-button type="primary"  @click="selectOrder(scope.row),delGoods()" >删除</el-button>
              </el-col>
            </el-row>
          </template>
      </el-table-column>
      </el-table>
      <el-row :gutter="20">
          <el-col :span="12" :offset="10">
              <el-button type="primary"  @click="submitOrder()" style="float:right">提交订单</el-button>
          </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" :offset="4">
          <el-pagination background layout="sizes, prev, pager, next, jumper" :page-size="page.rn" :page-sizes="[10, 20]" :total="page.total" @size-change="changePageSize" @current-change="changeCurrPage"></el-pagination>
        </el-col>
      </el-row>
      <el-dialog title="确认订单" :visible.sync="orderDialogVisible" width="30%">
          <div v-for="item in multipleSelection" :key="item.cartId">
              {{item.goodsName}}     {{item.cartNum}}件     {{item.cartNum*item.goodsPrice}}元
          </div>
          <div style="float: right">
              共计{{this.sumpay}}元
          </div>
          <span slot="footer" class="dialog-footer">
              <el-select placeholder="请选择收货地址" v-model="addressId" style="width: 100%;">
                  <el-option v-for="item in address" :value="item.addressId" :label="item.addressUser" :key="item.addressId">
                  </el-option>
              </el-select>
              <el-button @click="orderDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="orderDialogVisible = false, createOrder()">提 交</el-button>
          </span>
      </el-dialog>
    </el-col>
</div>
</template>
<script>
  export default {
    data() {
      return {
        userCarts: [],
        page: {
          total: 0,
          pn: 1,
          rn: 10
        },
        cartId:null,
        newcartNum:null,
        multipleSelection: [],
        orderDialogVisible: false,
        selection:null,
        sumpay:null,
        addOrder:{
            userId:null,
            addressId:null,//暂时
            orderState:null,
            orderCreateTime:null,
        },
        addGtoTList:{
          orderId:null,
          goodsId:null,
          gtotSaleNum:null,
          gtotEvaluateState:null,
        },
        orderId:null,
        address:[],
        userId:null,
        addressId:null,
        goodsStorage:null,
      }
    },
    methods: {
      loadUserCarts() {
        let params = {
          pn: this.page.pn,
          rn: this.page.rn
        }
        params.userId=localStorage.getItem("websocket_userId");//
        this.ajax.request({
          url: '/usercart/find.action',
          params
        }).then((res) => {
          if (!res.data.code) {
            this.userCarts = res.data.result.userCarts;
            this.page.total = res.data.result.total;
          }
        })
      },
      loadAddress() {
      this.userId = localStorage.getItem("websocket_userId");
      this.ajax
        .request({
          url: "/address/find.action",
          params:{userId: this.userId},
        })
        .then((res) => {
          if (!res.data.code) {
            this.address = res.data.result.address;
          }
        });
      },
      selectOrder(userCart){
          this.cartId = userCart.cartId;
      },
      changePageSize(size) {
        this.page.rn = size;
        this.loadUserCarts()
      },
      changeCurrPage(page) {
        this.page.pn = page;
        this.loadUserCarts()
      },
      Formatter(row,column){
          return row.goodsPrice*row.cartNum;
      },
      delGoods(){
        this.$confirm("是否删除该商品", "提示", {
        confirmButtonText: "确认删除",
        cancelButtonText: "取消",
        type: "warning",
        }).then(() => {
          this.ajax.request({
              url: "/usercart/del.action",
              params: {
                id: this.cartId,
              },
            }).then((res) => {
            if (!res.data.code) {
              this.$message({
                message: "删除成功",
                type: "success",  
              });
              this.loadUserCarts();
            } else {
              this.$message({
                message: "删除失败",
                type: "error",
              });
            }
          });
        }).catch(()=>{
          //取消的回调
        });
      },
      subGoods(row){
        this.newcartNum = row.cartNum - 1;
        if(this.newcartNum==0){
            this.$message({
            message: "该商品不能再减少了",
            type: "error",
            });
        }
        else{
            this.ajax.request({
            url: "/usercart/update.action",
            params:{
                cartId:this.cartId,
                cartNum:this.newcartNum,
            }
            }).then((res) => {
            if (!res.data.code) {
                this.$message({
                message: "减少成功",
                type: "success",  
                });
                this.loadUserCarts();
            } else {
                this.$message({
                message: "减少失败",
                type: "error",
                });
            }
            });
        }
      },
      addGoods(row){
        if(row.cartNum == row.goodsStorage){
          this.$message({
            message: "该商品不能再增加了",
            type: "error",
            });
        }
        else{
          this.newcartNum = row.cartNum + 1;
          this.ajax.request({
          url: "/usercart/update.action",
          params:{
              cartId:this.cartId,
              cartNum:this.newcartNum,
          }
          }).then((res) => {
          if (!res.data.code) {
              this.$message({
              message: "增加成功",
              type: "success",  
              });
              this.loadUserCarts();
          } else {
              this.$message({
              message: "增加失败",
              type: "error",
              });
          }
          });
        }
      },
      submitOrder(){
          this.sumpay = 0;
          if(this.$refs.multipleTable.selection.length==0){
              this.$message({
                message: "你还没有选择商品",
                type: "error",
                });
          }
          else{
            this.loadAddress();
            this.orderDialogVisible = true
            this.multipleSelection = this.$refs.multipleTable.selection;
            for(this.selection in this.multipleSelection){
                this.sumpay+=this.multipleSelection[this.selection].cartNum*this.multipleSelection[this.selection].goodsPrice;
            }
          }
      },
      createOrder(){
        //   写OrderList
        const temptime = new Date().getTime();
        this.addOrder.userId = localStorage.getItem("websocket_userId");
        this.addOrder.addressId = this.addressId;
        this.addOrder.orderState = 1;
        this.addOrder.orderCreateTime = new Date(temptime);
        let fd = new FormData();
        for (let prop in this.addOrder) {
            fd.append(prop, this.addOrder[prop]);
        }
        this.ajax
            .request({
            url: "/usercart/add.action",
            data: fd,
            method: "post",
            })
            .then((res) => {
            if (!res.data.code) {
                this.orderId = res.data.result.orderId;
                // 写gtot
                for(let item in this.multipleSelection){
                  this.addGtoTList.orderId = this.orderId;
                  this.addGtoTList.goodsId = this.multipleSelection[item].goodsId;
                  this.addGtoTList.gtotSaleNum = this.multipleSelection[item].cartNum;
                  this.addGtoTList.gtotEvaluateState = 0;
                  let nfd = new FormData();
                  for (let prop in this.addGtoTList) {
                      nfd.append(prop, this.addGtoTList[prop]);
                  }
                  this.ajax.request({
                    url:"/gtotlist/add.action",
                    data:nfd,
                    method: "post",
                  }).then((res)=>{
                    if (res.data.code){
                      this.$message({
                      message: "提交失败",
                      type: "error",
                      });
                    }
                  })
                }
                // 从购物车中删除
                for(let item in this.multipleSelection){
                  this.ajax.request({
                    url: "/usercart/del.action",
                    params: {
                      id: this.multipleSelection[item].cartId,
                    },
                  }).then((res)=>{
                    if (!res.data.code) {
                      // this.$message({
                      //   message: "删除成功",
                      //   type: "success",  
                      // });
                      this.loadUserCarts();
                    } else {
                      this.$message({
                        message: "删除失败",
                        type: "error",
                      });
                    }
                  })
                }
                // 修改商品库存和销量
                for(let item in this.multipleSelection){
                  this.ajax.request({
                    url: "/usergoods/update.action",
                    params: {
                      goodsId:this.multipleSelection[item].goodsId,
                      goodsStorage:this.multipleSelection[item].goodsStorage-this.multipleSelection[item].cartNum,
                      goodsSale:this.multipleSelection[item].goodsSale+this.multipleSelection[item].cartNum,
                    },
                  }).then((res)=>{
                    if (!res.data.code) {
                      // this.$message({
                      //   message: "删除成功",
                      //   type: "success",  
                      // });
                    } else {
                      this.$message({
                        message: "删除失败",
                        type: "error",
                      });
                    }
                  })
                }
                this.$message({
                message: "提交成功",
                type: "success",
                });
            } else {
                this.$message({
                message: "提交失败",
                type: "error",
                });
            }
        });
      },
      url(uri){
        return 'http://localhost:8088/pic/'+uri;
      },
    },
    created() {
      this.loadUserCarts()
    }
  }
</script>
<style>
</style>
