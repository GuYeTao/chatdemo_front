<template>
  <div>
    <div id="container" class="map"></div>
  </div>
</template>

<script>
import { BMPGL } from "@/bmpgl.js";
export default {
  data() {
    return {
      ak: "jeywmrgzmIdsE33PUOfCX70XK6luXNyU",
      myMap: null,
      location_click_jing: null,
      location_click_wei: null,
      line_distance: 0,
      target_location: localStorage.getItem("addressSite"),
      map: null,
    };
  },
  mounted() {
    BMPGL(this.ak).then((BMapGL) => {
      // this.map = new BMapGL.Map('container');
      this.baiduMapMounted();
    });
  },
  methods: {
    baiduMapMounted() {
      // 百度地图API功能
      let map = new BMapGL.Map("container"); // 创建Map实例
      map.centerAndZoom(new BMap.Point(123.4343, 41.65885), 17); // 初始化地图,设置中心点坐标和地图级别
      map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
      //添加地图类型控件
      map.addControl(
        new BMap.MapTypeControl({
          mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP],
        })
      );

      let locationControl = new BMapGL.LocationControl({
        // 控件的停靠位置（可选，默认左上角）
        anchor: BMAP_ANCHOR_TOP_RIGHT,
        // 控件基于停靠位置的偏移量（可选）
        offset: new BMapGL.Size(20, 20),
      });
      // 将控件添加到地图上
      map.addControl(locationControl);

      // 添加定位事件

      locationControl.addEventListener("locationSuccess", function (e) {
        let address = "";
        address += e.addressComponent.province;
        address += e.addressComponent.city;
        address += e.addressComponent.district;
        address += e.addressComponent.street;
        address += e.addressComponent.streetNumber;
        console.log("当前定位地址为：" + address);
      });
      locationControl.addEventListener("locationError", function (e) {
        alert(e.message);
      });

      var myIcon = new BMapGL.Icon(
        "https://img2.baidu.com/it/u=23049399,2787675650&fm=26&fmt=auto&gp=0.jpg",
        new BMapGL.Size(26, 26)
      );
      let headquarterpt = new BMapGL.Point(
        123.42849514308058,
        41.658179685617085
      );
      let headquarter = new BMapGL.Marker(headquarterpt, {
        icon: myIcon,
      });
      headquarter.disableMassClear();

      map.addOverlay(headquarter);
      let opts = {
        width: 200,
        height: 100,
        title: "老相好生活服务超市",
      };
      let infoWindow = new BMapGL.InfoWindow(
        "地址：东北大学浑南校区食堂一楼",
        opts
      );
      headquarter.addEventListener("mouseover", function () {
        map.openInfoWindow(infoWindow, headquarterpt);

        // 开启信息窗口
      });
      headquarter.addEventListener("mouseout", function () {
        map.closeInfoWindow(infoWindow, headquarterpt);

        // 开启信息窗口
      });

      //获取输入定位
      //创建地址解析器实例

      let myGeo = new BMapGL.Geocoder();
      // 将地址解析结果显示在地图上，并调整地图视野
      myGeo.getPoint(
        this.target_location,
        function (point) {
          if (point) {
            map.centerAndZoom(point, 17);
            let target = new BMapGL.Point(point.lng, point.lat);
            let target_point = new BMapGL.Marker(target, {
              title: "北京市海淀区上地10街",
            });
            console.log("111");
            map.addOverlay(target_point);

            //测距
            let output = "预计到达需要";
            let searchComplete = function (results) {
              if (transit.getStatus() != BMAP_STATUS_SUCCESS) {
                return;
              }
              let plan = results.getPlan(0);
              let time_add = plan.getDuration(false) + 1200;
              localStorage.setItem("time_add", time_add);

              let time_changed = "";

              //时间格式变化
              if (time_add < 60) time_changed = String(time_add) + "秒";
              else if (time_add < 3600) {
                // Math.floor(time_add/60)  向下取整
                time_changed =
                  String(Math.floor(time_add / 60)) +
                  "分" +
                  (time_add % 60) +
                  "秒";
              } else {
                time_changed =
                  String(Math.floor(time_add / 3600)) +
                  "时" +
                  String(Math.floor((time_add % 3600) / 60)) +
                  "分" +
                  (time_add % 60) +
                  "秒";
              }
              //
              output += time_changed + "\n";
              // output += time_changed + "\n";                //获取时间
              output += "总路程为：";
              output += plan.getDistance(true) + "\n"; //获取距离
              console.log("222");
              localStorage.setItem("time_show", time_changed);
            };
            let transit = new BMapGL.DrivingRoute(map, {
              renderOptions: { map: map },
              onSearchComplete: searchComplete,
              onPolylinesSet: function () {
                setTimeout(function () {
                  // alert(output);
                }, "1000");
              },
            });

            // let end=new BMapGL.Point(this.location_click_jing, this.location_click_wei);
            transit.search(headquarterpt, target);
          } else {
            console.log("您选择的地址没有解析到结果！");
          }
        },
        "沈阳市"
      );
    },
  },
};
</script>

<style>
.map {
  width: 900px;
  height: 600px;
  position: fixed;
  top: 0;
  left: 0;
  margin: auto;
}

</style>
