<template>
  <div>
    <el-table :data="userTransportDetails" stripe>
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
      <el-table-column prop="transportDeliverTime" label="配送时间" width="200"></el-table-column>
      <el-table-column prop="transportArriveTime" label="抵达时间" width="200"></el-table-column>
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
    props:['transportId'],
    data() {
      return {
        userTransportDetails: [],
        page: {
          total: 0,
          pn: 1,
          rn: 10
        },
      }
    },
    methods: {
      loadUserTransportDetail() {
        let params = {
          pn: this.page.pn,
          rn: this.page.rn,
          transportId:this.transportId,
        }
        this.ajax.request({
          url: '/usertransportdetail/find.action',
          params
        }).then((res) => {
          if (!res.data.code) {
            this.userTransportDetails = res.data.result.userTransportDetails;
            this.page.total = res.data.result.total;
          }
        })
      },
      changePageSize(size) {
        this.page.rn = size;
        this.loadUserTransportDetail()
      },
      changeCurrPage(page) {
        this.page.pn = page;
        this.loadUserTransportDetail()
      },
      url(uri){
        return 'http://localhost:8088/pic/'+uri;
      },
    },
    mounted() {
      this.loadUserTransportDetail()
    }
  }
</script>
<style>
</style>
