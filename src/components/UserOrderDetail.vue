<template>
  <div>
    <el-table :data="userOrderDetails" stripe>
      <el-table-column prop="goodsId" label="商品编号" width="100"></el-table-column>  
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
      <el-table-column prop="typeName" label="商品种类" width="100"></el-table-column>
      <el-table-column prop="gtotSaleNum" label="购买数量" width="100"></el-table-column>
      <el-table-column prop="goodsPrice" label="购买价格" width="100"></el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
            <div v-if="scope.row.gtotEvaluateState==false">
                <el-button type="primary" @click="selectOrder(scope.row)" >评价</el-button>
            </div>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-col :span="10">
        <el-pagination background layout="sizes, prev, pager, next, jumper" :page-size="page.rn" :page-sizes="[5, 10]" :total="page.total" @size-change="changePageSize" @current-change="changeCurrPage"></el-pagination>
      </el-col>
    </el-row>
</div>
</template>
<script>
  export default {
    props:['orderId'],
    data() {
      return {
        userOrderDetails: [],
        page: {
          total: 0,
          pn: 1,
          rn: 10
        },
      }
    },
    methods: {
      loadUserOrderDetail() {
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
          }
        })
      },
      changePageSize(size) {
        this.page.rn = size;
        this.loadUserOrderDetail()
      },
      changeCurrPage(page) {
        this.page.pn = page;
        this.loadUserOrderDetail()
      },
      selectOrder(userOrderDetail){
          this.goodsId = userOrderDetail.goodsId;
        //   alert(userOrderDetail.goodsId);         
          localStorage.setItem("goodsId", userOrderDetail.goodsId);
          alert("这是跳转");
          this.$router.push({
          name: "",//跳转到商品评价页
        });
      },
      url(uri){
        return 'http://localhost:8088/pic/'+uri;
      },
    },
    mounted() {
      this.loadUserOrderDetail()
    }
  }
</script>
<style>
</style>
